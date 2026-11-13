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

// ── Language teachers, Arabic Y7, English Y7 and German HoD ─────────────────
const provider = require('../src/knowledge/providers/markdownProvider');

const NEW_ROLES = [
  // [file, [titles], industries]
  ['french-preschool-teacher.md',
    ['French Preschool Teacher (KG1–KG2)', 'French KG Teacher', 'Kindergarten French Teacher'],
    ['Education', 'School', 'International School', 'Preschool']],
  ['german-preschool-teacher.md',
    ['German Preschool Teacher (KG1–KG2)', 'German KG Teacher', 'Kindergarten German Teacher'],
    ['Education', 'School', 'International School', 'Preschool']],
  ['arabic-teacher-y7.md',
    ['Arabic Teacher Y7 / الصف الأول الإعدادي', 'Arabic Teacher Year 7', 'Arabic Teacher',
     'مدرس لغة عربية', 'مدرس اللغة العربية', 'معلم لغة عربية', 'مدرس لغة عربية - الصف الأول الإعدادي'],
    ['Education', 'School', 'International School']],
  ['english-teacher-y7-british-curriculum.md',
    ['English Teacher Y7 (British Curriculum)', 'English Teacher Year 7', 'Year 7 English Teacher', 'KS3 English Teacher'],
    ['Education', 'School', 'International School']],
  ['german-head-of-department-international-school.md',
    ['German Head of Department (International School)', 'Head of German', 'German Department Head', 'Head of German Department', 'HOD German'],
    ['Education', 'School', 'International School']],
];

for (const [file, titles, industries] of NEW_ROLES) {
  for (const title of titles) {
    test(`new role "${title}" -> ${file}`, () => assert.equal(`${normalizeRole(title)}.md`, file));
    for (const industry of industries) {
      test(`  found via industry "${industry}": "${title}"`, async () => {
        const res = await provider.get({ domain: 'jobs', subdomain: normalizeIndustry(industry), role: title });
        assert.equal(res.metadata.found, true);
        assert.ok(res.metadata.path.endsWith(file));
      });
    }
  }
}

test('generic titles are not hijacked by the new aliases', () => {
  assert.equal(normalizeRole('Teacher'), 'teacher');
  assert.equal(normalizeRole('English Teacher'), 'teacher');       // no standalone english-teacher file exists
  assert.equal(normalizeRole('Head of Department'), 'hod');
  assert.equal(normalizeRole('HOD'), 'hod');
  assert.equal(normalizeRole('Homeroom Teacher'), 'homeroom-teacher');
});

test('industry "International School" maps to education', () => {
  assert.equal(normalizeIndustry('International School'), 'education');
  assert.equal(normalizeIndustry('international school'), 'education');
});

test('Arabic keys match inside longer titles (Unicode word boundaries)', () => {
  assert.equal(normalizeRole('مدرس لغة عربية'), 'arabic-teacher-y7');
  assert.equal(normalizeRole('مدرس لغة عربية - القاهرة'), 'arabic-teacher-y7');
});
