// Run with: npm test   (node --test, no extra dependencies)
const test   = require('node:test');
const assert = require('node:assert/strict');
const fs     = require('fs');
const path   = require('path');

const { normalizeRole, ROLE_MAP } = require('../src/knowledge/providers/markdownProvider');
const { normalizeIndustry }       = require('../src/knowledge/normalizeIndustry');

const EDU_DIR = path.join(__dirname, '..', 'knowledge', 'jobs', 'education');

const ROLE_CASES = [
  ['Teacher',                                'teacher.md'],
  ['Homeroom Teacher',                       'homeroom-teacher.md'],
  ['English Teacher',                        'teacher.md'],
  ['Preschool English Teacher',              'preschool-english-teacher.md'],
  ['Preschool English Teacher (KG1–KG2)',    'preschool-english-teacher.md'],
  ['Pre-school English Teacher',             'preschool-english-teacher.md'],
  ['KG English Teacher',                     'preschool-english-teacher.md'],
  ['Kindergarten English Teacher',           'preschool-english-teacher.md'],
  ['Nursery English Teacher',                'preschool-english-teacher.md'],
  ['Early Years English Teacher',            'preschool-english-teacher.md'],
];

for (const [title, file] of ROLE_CASES) {
  test(`role "${title}" -> ${file}`, () => {
    const slug = normalizeRole(title);
    assert.equal(`${slug}.md`, file);
    assert.ok(fs.existsSync(path.join(EDU_DIR, `${slug}.md`)), `${slug}.md must exist in knowledge/jobs/education`);
  });
}

test('every exact ROLE_MAP key resolves to its own mapped value', () => {
  for (const [k, v] of Object.entries(ROLE_MAP)) assert.equal(normalizeRole(k), v, k);
});

const INDUSTRY_CASES = [
  ['Preschool', 'education'], ['Pre-school', 'education'], ['Kindergarten', 'education'],
  ['Nursery', 'education'], ['Early Years', 'education'], ['School', 'education'],
  ['PRESCHOOL', 'education'], ['  early years ', 'education'], ['Education', 'education'],
  // unchanged behaviour for everything else
  ['Finance & Accounting', 'finance-accounting'], ['Construction', 'construction'],
  ['British School', 'british-school'], ['Healthcare', 'healthcare'], ['', ''],
];

for (const [raw, slug] of INDUSTRY_CASES) {
  test(`industry "${raw}" -> "${slug}"`, () => assert.equal(normalizeIndustry(raw), slug));
}
