require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const { get: getSkill }             = require('./src/skills/skillRegistry');
const { resolve: resolveKnowledge } = require('./src/knowledge/knowledgeResolver');
const { build: buildPrompt }        = require('./src/prompts/promptBuilder');
const { complete }                  = require('./src/llm/llmClient');

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
    const skill      = await getSkill(skillName);
    const sources    = buildKnowledgeSources(skillName, inputs, context);
    const knowledge  = await resolveKnowledge(sources);
    const { systemPrompt, userPrompt } = buildPrompt({ skill, knowledge, context, inputs, examples: null });
    const raw        = await complete({ systemPrompt, userPrompt, maxTokens: 2000 });
    const cleaned    = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const data       = JSON.parse(cleaned);

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
