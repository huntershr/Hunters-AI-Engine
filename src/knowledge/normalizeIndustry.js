// Single source of truth for turning a free-text industry label (e.g. "Finance
// & Accounting") into the slug used for knowledge/jobs/{slug} folder names.
// Previously duplicated inline in both server.js and knowledgeSaver.js — the
// two copies drifted out of sync (the & stripping fix landed in one but not
// the other), so any future change to this logic must only be made here.
function normalizeIndustry(raw) {
  return (raw || '').toLowerCase()
    .replace(/&/g, ' ')
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

module.exports = { normalizeIndustry };
