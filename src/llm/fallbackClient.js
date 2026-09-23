// Fallback LLM client — only called when Phase 1 has no knowledge file
// Uses Gemini free tier
// Saves response to knowledge base after success

const { saveGeneratedKnowledge } = require('../knowledge/knowledgeSaver');

// gemini-2.5-flash-lite shuts down ~Jul 22 2026; gemini-3.1-flash-lite has the
// longest confirmed runway (shutdown May 7 2027) among current "lite" tier models.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

// Ordered model chain: GEMINI_MODEL is always tried first; GEMINI_FALLBACK_MODELS
// (comma-separated) supplies the rest. Kept in an env var since Google retires
// models often (gemini-2.5-flash-lite already 404s for new users).
const DEFAULT_FALLBACK_MODELS = 'gemini-3.1-flash-lite,gemini-2.5-flash';
const MODEL_CHAIN = [...new Set([
  GEMINI_MODEL,
  ...(process.env.GEMINI_FALLBACK_MODELS || DEFAULT_FALLBACK_MODELS).split(',').map(m => m.trim()).filter(Boolean),
])];
console.log(`[FallbackClient] Gemini model chain: ${MODEL_CHAIN.join(' -> ')}`);

// Transient statuses worth retrying; anything else (400/401/404...) won't fix itself.
const RETRYABLE_STATUS = new Set([503, 429]);
const RETRY_DELAYS_MS  = [1000, 2000];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Availability failure = Google couldn't serve the request (HTTP error / network), as
// opposed to a bad response body. Only a chain made entirely of these is reported to
// callers as LLM_UNAVAILABLE ("busy, try again").
function availabilityError(message) {
  const err = new Error(message);
  err.availability = true;
  return err;
}

// One HTTP attempt against one model. Throws on any failure.
async function requestGemini(model, apiKey, { systemPrompt, userPrompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { maxOutputTokens: 2000, temperature: 0.3 }
      })
    });
  } catch (err) {
    throw availabilityError(`Gemini network error (${model}): ${err.message}`);
  }

  if (!response.ok) {
    const err = availabilityError(`Gemini error (${model}): ${response.status} ${await response.text()}`);
    err.status = response.status;
    throw err;
  }

  const result = await response.json();
  const raw    = result.candidates[0].content.parts[0].text;

  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

// Retries a single model on 503/429 only, with short backoff (max ~3s added per model).
async function callModelWithRetry(model, apiKey, prompts) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await requestGemini(model, apiKey, prompts);
    } catch (err) {
      if (!RETRYABLE_STATUS.has(err.status) || attempt >= RETRY_DELAYS_MS.length) throw err;
      console.warn(`[FallbackClient] ${model} returned ${err.status} — retry ${attempt + 1}/${RETRY_DELAYS_MS.length} in ${RETRY_DELAYS_MS[attempt]}ms`);
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }
}

// Walks the model chain and returns { data, model, isPrimary }. Callers use isPrimary
// to decide whether the result is safe to persist: fallback-model output quality has
// not been validated against the skills' rules, so it must never be cached.
// Throws LLM_UNAVAILABLE if every model failed on availability, else the last error.
async function callGemini({ systemPrompt, userPrompt }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('LLM_NOT_CONFIGURED: GEMINI_API_KEY not set');
  }

  let lastErr;
  let allAvailability = true;
  const failures = [];

  for (const model of MODEL_CHAIN) {
    try {
      const data = await callModelWithRetry(model, apiKey, { systemPrompt, userPrompt });
      if (model !== MODEL_CHAIN[0]) {
        console.warn(`[FallbackClient] Served by fallback model ${model} (primary ${MODEL_CHAIN[0]} failed)`);
      }
      return { data, model, isPrimary: model === MODEL_CHAIN[0] };
    } catch (err) {
      lastErr = err;
      if (!err.availability) allAvailability = false;
      failures.push(`${model}: ${err.message.slice(0, 160)}`);
      console.error(`[FallbackClient] ${model} failed: ${err.message.slice(0, 300)}`);
    }
  }

  if (allAvailability) {
    throw new Error(`LLM_UNAVAILABLE: all Gemini models failed — ${failures.join(' | ')}`);
  }
  throw lastErr;
}

// For generate-job-post: only called when no knowledge file was found. Swallows
// failures to null (Phase 1 template defaults are an acceptable degrade), and
// saves a successful result to the knowledge base so Phase 1 handles it next time.
// Only primary-model results are saved — a saved file is permanent.
async function callWithFallback({ systemPrompt, userPrompt, inputs, knowledgeFound }) {
  if (knowledgeFound) return null;

  try {
    console.log(`[FallbackClient] No knowledge file found for "${inputs.title}" — calling Gemini`);
    const { data, isPrimary } = await callGemini({ systemPrompt, userPrompt });

    if (isPrimary) {
      const industry = inputs.industry || 'other';
      await saveGeneratedKnowledge(industry, inputs.title, data);
    } else {
      console.warn(`[FallbackClient] Fallback-model result for "${inputs.title}" NOT saved to knowledge base`);
    }

    data._source = 'llm-fallback';
    return data;

  } catch (err) {
    console.error(`[FallbackClient] Failed: ${err.message}`);
    return null;
  }
}

// For llm-direct skills (e.g. simplify-skills): no knowledge base, nothing to save,
// no template default to degrade to — so failures must propagate loudly, not swallow.
// Returns { data, model, isPrimary } so the caller can guard its own cache.
async function callDirect({ systemPrompt, userPrompt }) {
  return callGemini({ systemPrompt, userPrompt });
}

module.exports = { callWithFallback, callDirect };
