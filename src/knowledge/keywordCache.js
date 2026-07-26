// Phrase -> keyword lookup cache for the simplify-skills skill.
// Flat JSON table (not one-file-per-phrase like the job knowledge base) since the
// input space is arbitrary sentences, not a bounded set of role/industry names.

const fs   = require('fs').promises;
const path = require('path');

const CACHE_PATH = path.join(__dirname, '../../knowledge/skills-cache/keywords.json');

function normalize(phrase) {
  return (phrase || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

async function readCache() {
  try {
    const raw = await fs.readFile(CACHE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// Returns an array positionally aligned with `phrases`: cached keyword string, or null on a miss.
async function lookupMany(phrases) {
  const cache = await readCache();
  return phrases.map(p => (Object.prototype.hasOwnProperty.call(cache, normalize(p)) ? cache[normalize(p)] : null));
}

// pairs: [{ phrase, keyword }] — newly-resolved phrases to persist for future lookups.
async function saveMany(pairs) {
  if (!pairs || pairs.length === 0) return;
  const cache = await readCache();
  for (const { phrase, keyword } of pairs) {
    cache[normalize(phrase)] = keyword;
  }
  await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  console.log(`[KeywordCache] Saved ${pairs.length} new phrase(s) to cache`);
}

module.exports = { normalize, lookupMany, saveMany };
