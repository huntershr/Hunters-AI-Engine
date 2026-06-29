// Saves LLM-generated job post responses as knowledge files
// so Phase 1 can handle the same role next time without LLM

const fs   = require('fs').promises;
const path = require('path');

async function saveGeneratedKnowledge(industry, role, data) {
  try {
    const normalized = normalizeForPath(role);
    const dir        = path.join(__dirname, '../../knowledge/jobs', industry.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-'));
    const filePath   = path.join(dir, `${normalized}.md`);

    // Don't overwrite existing hand-crafted knowledge files
    try {
      await fs.access(filePath);
      console.log(`[KnowledgeSaver] File already exists, skipping: ${filePath}`);
      return false;
    } catch {
      // File doesn't exist — safe to create
    }

    await fs.mkdir(dir, { recursive: true });

    const md = buildMarkdown(data);
    await fs.writeFile(filePath, md, 'utf-8');
    console.log(`[KnowledgeSaver] Saved new knowledge file: ${filePath}`);
    return true;

  } catch (err) {
    console.error(`[KnowledgeSaver] Failed to save: ${err.message}`);
    return false;
  }
}

function buildMarkdown(data) {
  const lines = [];
  lines.push(`<!-- generated: ${new Date().toISOString()} -->`);
  lines.push('');
  lines.push(`# ${data.title}`);
  lines.push('');
  lines.push('## Summary');
  lines.push(data.summary || '');
  lines.push('');
  lines.push('## Responsibilities');
  (data.responsibilities || []).forEach(r => lines.push(`- ${r}`));
  lines.push('');
  lines.push('## Core Competencies');
  (data.competencies || []).forEach(c => lines.push(`- ${c}`));
  lines.push('');
  lines.push('## Qualifications');
  lines.push(data.qualifications || '');
  lines.push('');
  return lines.join('\n');
}

function normalizeForPath(role) {
  return role.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

module.exports = { saveGeneratedKnowledge };
