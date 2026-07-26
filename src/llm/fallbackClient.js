// Fallback LLM client — only called when Phase 1 has no knowledge file
// Uses Gemini free tier
// Saves response to knowledge base after success

const { saveGeneratedKnowledge } = require('../knowledge/knowledgeSaver');

// gemini-2.5-flash-lite shuts down ~Jul 22 2026; gemini-3.1-flash-lite has the
// longest confirmed runway (shutdown May 7 2027) among current "lite" tier models.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
console.log(`[FallbackClient] Active Gemini model: ${GEMINI_MODEL}`);

// Raw Gemini call + JSON parse, shared by every consumer below. Throws on any
// failure — callers decide whether that's something to swallow or propagate.
async function callGemini({ systemPrompt, userPrompt }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('LLM_NOT_CONFIGURED: GEMINI_API_KEY not set');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: 2000, temperature: 0.3 }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini error: ${response.status} ${err}`);
  }

  const result = await response.json();
  const raw    = result.candidates[0].content.parts[0].text;

  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

// For generate-job-post: only called when no knowledge file was found. Swallows
// failures to null (Phase 1 template defaults are an acceptable degrade), and
// saves a successful result to the knowledge base so Phase 1 handles it next time.
async function callWithFallback({ systemPrompt, userPrompt, inputs, knowledgeFound }) {
  if (knowledgeFound) return null;

  try {
    console.log(`[FallbackClient] No knowledge file found for "${inputs.title}" — calling Gemini`);
    const data = await callGemini({ systemPrompt, userPrompt });

    const industry = inputs.industry || 'other';
    await saveGeneratedKnowledge(industry, inputs.title, data);

    data._source = 'llm-fallback';
    return data;

  } catch (err) {
    console.error(`[FallbackClient] Failed: ${err.message}`);
    return null;
  }
}

// For llm-direct skills (e.g. simplify-skills): no knowledge base, nothing to save,
// no template default to degrade to — so failures must propagate loudly, not swallow.
async function callDirect({ systemPrompt, userPrompt }) {
  return callGemini({ systemPrompt, userPrompt });
}

module.exports = { callWithFallback, callDirect };
