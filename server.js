require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const { get: getSkill }             = require('./src/skills/skillRegistry');
const { resolve: resolveKnowledge } = require('./src/knowledge/knowledgeResolver');
const { build: buildPrompt }        = require('./src/prompts/promptBuilder');
const { complete }                  = require('./src/llm/llmClient');
const { callWithFallback }          = require('./src/llm/fallbackClient');

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'hunters-ai-engine', version: '1.0.0' });
});

app.post('/execute', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.AI_ENGINE_KEY) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const { skill: skillName, inputs = {}, context = {} } = req.body;
  if (!skillName) {
    return res.status(400).json({ success: false, error: 'skill is required' });
  }

  try {
    const skill     = await getSkill(skillName);
    const sources   = buildKnowledgeSources(skillName, inputs, context);
    const knowledge = await resolveKnowledge(sources);

    // Check if knowledge was found
    const knowledgeFound = knowledge.sources && knowledge.sources.some(s => s.found);

    const { systemPrompt, userPrompt } = buildPrompt({ skill, knowledge, context, inputs, examples: null });

    // Phase 1 — knowledge-driven generation
    const raw  = await complete({ systemPrompt, userPrompt, maxTokens: 2000 });
    let data   = JSON.parse(raw);

    // Phase 2 fallback — if no knowledge file, try external LLM and save result
    if (!knowledgeFound) {
      const fallbackData = await callWithFallback({
        systemPrompt,
        userPrompt,
        inputs,
        knowledgeFound
      });
      if (fallbackData) {
        data = fallbackData;
        console.log(`[execute] Used LLM fallback for "${inputs.title || skillName}"`);
      } else {
        console.log(`[execute] Phase 1 defaults used for "${inputs.title || skillName}"`);
      }
    }

    return res.json({ success: true, skill: skillName, data });

  } catch (err) {
    console.error(`[execute] skill=${skillName} error=${err.message}`);
    if (err.message.startsWith('SKILL_NOT_FOUND'))    return res.status(404).json({ success: false, error: err.message });
    if (err.message.startsWith('LLM_NOT_CONFIGURED')) return res.status(503).json({ success: false, error: 'AI provider not configured' });
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Maps skill + inputs → knowledge sources
// V1: generate-job-post uses jobs/{industry}/{role}
// Future skills: add their source resolution here
function buildKnowledgeSources(skillName, inputs, context) {
  if (skillName === 'generate-job-post') {
    const industry = (inputs.industry || context.industry || '').toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
    const role     = inputs.title || '';
    if (industry && role) {
      return [{ domain: 'jobs', subdomain: industry, role }];
    }
  }
  return [];
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Hunters AI Engine running on port ${PORT}`));
