require('dotenv').config();
const fs = require('fs');
const path = require('path');
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

// Maps industry labels (after slug normalisation) to guidelines filenames
const GUIDELINES_MAP = {
  'education':               'skills-education',
  'finance':                 'skills-finance-accounting',
  'finance-accounting':      'skills-finance-accounting',
  'finance-&-accounting':    'skills-finance-accounting',
  'engineering':             'skills-engineering',
  'construction':            'skills-engineering',
  'procurement':             'skills-procurement',
  'purchasing':              'skills-procurement',
  'purchasing-procurement':  'skills-procurement',
  'business-development':    'skills-business-development',
  'customer-service':        'skills-customer-service',
  'real-estate':             'skills-real-estate',
};

// Education sub-industries ("British School", "American School", ...) live under
// knowledge/jobs/education/{branch}/ rather than their own top-level jobs folder.
const EDUCATION_BRANCH_MAP = {
  'british school':           'british',
  'american school':          'american',
  'ib school':                'ib',
  'cambridge school':         'cambridge',
  'egyptian national school': 'egyptian',
};

// Mirrors the role keys/aliases in src/knowledge/providers/markdownProvider.js ROLE_MAP,
// scoped to the roles that have curriculum-branch variants, so branch-file existence
// checks here resolve to the same filename markdownProvider will read.
const EDUCATION_BRANCH_ROLE_SLUGS = {
  'teacher': 'teacher', 'subject teacher': 'teacher',
  'hod': 'hod', 'head of department': 'hod',
  'homeroom teacher': 'homeroom-teacher', 'homeroom': 'homeroom-teacher',
  'teaching assistant': 'teaching-assistant', 'ta': 'teaching-assistant',
  'floating teacher': 'floating-teacher',
  'stage principal': 'stage-principal',
  'assistant stage principal': 'assistant-stage-principal',
  'ks headmistress': 'ks-headmistress', 'key stage headmistress': 'ks-headmistress',
};

function normalizeEducationBranchRole(title) {
  const key = (title || '').toLowerCase().trim();
  if (EDUCATION_BRANCH_ROLE_SLUGS[key]) return EDUCATION_BRANCH_ROLE_SLUGS[key];
  for (const [k, v] of Object.entries(EDUCATION_BRANCH_ROLE_SLUGS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return key.replace(/\s+/g, '-');
}

// Maps skill + inputs → knowledge sources
// V1: generate-job-post uses jobs/{industry}/{role} + optional guidelines/{industry}
// Future skills: add their source resolution here
function buildKnowledgeSources(skillName, inputs, context) {
  if (skillName === 'generate-job-post') {
    const industryRaw = inputs.industry || context.industry || '';
    const industry     = industryRaw.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
    const role     = inputs.title || '';
    const sources  = [];

    const educationBranch = EDUCATION_BRANCH_MAP[industryRaw.toLowerCase().trim()];

    if (educationBranch && role) {
      // Try the curriculum-branch file first, fall back to the shared education file
      // if this role has no branch-specific variant.
      const roleSlug   = normalizeEducationBranchRole(role);
      const branchFile = path.join(__dirname, 'knowledge', 'jobs', 'education', educationBranch, `${roleSlug}.md`);
      const subdomain  = fs.existsSync(branchFile) ? `education/${educationBranch}` : 'education';
      sources.push({ domain: 'jobs', subdomain, role });
    } else if (industry && role) {
      sources.push({ domain: 'jobs', subdomain: industry, role });
    }

    const guidelinesKey   = educationBranch ? 'education' : industry;
    const guidelinesFile  = GUIDELINES_MAP[guidelinesKey] || null;
    if (guidelinesFile) {
      sources.push({ domain: 'guidelines', role: guidelinesFile });
    }
    return sources;
  }
  return [];
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Hunters AI Engine running on port ${PORT}`));
