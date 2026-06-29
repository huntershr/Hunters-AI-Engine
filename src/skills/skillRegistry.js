const fs   = require('fs').promises;
const path = require('path');

async function get(skillName) {
  const filePath = path.join(__dirname, '../../skills', `${skillName}.skill.md`);
  let raw;
  try { raw = await fs.readFile(filePath, 'utf-8'); }
  catch { throw new Error(`SKILL_NOT_FOUND: ${skillName}`); }

  const frontmatter = parseFrontmatter(raw);
  const sections    = parseSections(raw);

  if (!sections.role && !sections.goal) {
    throw new Error(`SKILL_INVALID: ${skillName} — missing Role and Goal sections`);
  }
  return { name: frontmatter.name || skillName, version: frontmatter.version || '1.0', ...sections };
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result = {};
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) result[key.trim()] = rest.join(':').trim();
  }
  return result;
}

function parseSections(raw) {
  const body         = raw.replace(/^---[\s\S]*?---\s*\n/, '');
  const sectionNames = ['role', 'goal', 'instructions', 'rules', 'output'];
  const result       = Object.fromEntries(sectionNames.map(k => [k, '']));
  for (const part of body.split(/^## /m)) {
    if (!part.trim()) continue;
    const nl     = part.indexOf('\n');
    const header = part.slice(0, nl).trim().toLowerCase();
    const content = part.slice(nl + 1).trim();
    if (sectionNames.includes(header)) result[header] = content;
  }
  return result;
}

module.exports = { get };
