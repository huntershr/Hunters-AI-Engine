// Single source of truth for turning a free-text industry label (e.g. "Finance
// & Accounting") into the slug used for knowledge/jobs/{slug} folder names.
// Previously duplicated inline in both server.js and knowledgeSaver.js — the
// two copies drifted out of sync (the & stripping fix landed in one but not
// the other), so any future change to this logic must only be made here.
// Early-years labels that share the education knowledge folder (slugs, post-normalisation).
const EDUCATION_ALIASES = new Set([
  'preschool', 'pre-school', 'kindergarten', 'nursery', 'early-years', 'school',
]);

function normalizeIndustry(raw) {
  const slug = (raw || '').toLowerCase()
    .replace(/&/g, ' ')
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return EDUCATION_ALIASES.has(slug) ? 'education' : slug;
}

module.exports = { normalizeIndustry };
