// Fallback LLM client — only called when Phase 1 has no knowledge file
// Uses Gemini free tier
// Saves response to knowledge base after success

const { saveGeneratedKnowledge } = require('../knowledge/knowledgeSaver');

async function callWithFallback({ systemPrompt, userPrompt, inputs, knowledgeFound }) {
  // Only trigger fallback if no knowledge file was found
  if (knowledgeFound) return null;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[FallbackClient] GEMINI_API_KEY not set — skipping fallback');
    return null;
  }

  try {
    console.log(`[FallbackClient] No knowledge file found for "${inputs.title}" — calling Gemini`);

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url   = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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
      console.error(`[FallbackClient] Gemini error: ${response.status} ${err}`);
      return null;
    }

    const result = await response.json();
    const raw    = result.candidates[0].content.parts[0].text;

    // Parse JSON from response
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const data    = JSON.parse(cleaned);

    // Save to knowledge base so Phase 1 handles this role next time
    const industry = inputs.industry || 'other';
    await saveGeneratedKnowledge(industry, inputs.title, data);

    // Flag as llm-generated
    data._source = 'llm-fallback';
    return data;

  } catch (err) {
    console.error(`[FallbackClient] Failed: ${err.message}`);
    return null;
  }
}

module.exports = { callWithFallback };
