// Provider fallback: branch labels (British School, ...) and industry labels with no folder or no file for the role.
const test   = require('node:test');
const assert = require('node:assert/strict');
const path   = require('path');

const provider = require('../src/knowledge/providers/markdownProvider');
const { normalizeIndustry } = require('../src/knowledge/normalizeIndustry');

const served = async (subdomain, role) => {
  const res = await provider.get({ domain: 'jobs', subdomain, role });
  return { found: res.metadata.found, file: path.basename(res.metadata.path), dir: path.basename(path.dirname(res.metadata.path)) };
};

// What server.js sends for a branch label when the branch folder has a generic teacher.md / hod.md.
const BRANCH_SUBS = ['education/british', 'education/american', 'education/egyptian', 'education/ib', 'education/cambridge'];

// Titles that missed their file under branch labels before the fix, plus the five roles from e8389cf.
const BRANCH_TITLES = [
  ['English Teacher - Year 7',               'english-teacher-y7-british-curriculum.md'],
  ['PE Head of Department - HOD',            'pe-head-of-department.md'],
  ['Math Teacher - Year 2',                  'math-teacher.md'],
  ['English Head of Department',             'english-head-of-department.md'],
  ['EYFS Co Teacher',                        'eyfs-co-teacher.md'],
  ['charcter Building Teacher',              'character-building-teacher.md'],
  ['KS Admin Assistant',                     'ks-admin-assistant.md'],
  ['Lower Elementary Homeroom Teacher (native based in Egypt)', 'lower-elementary-homeroom-teacher.md'],
  // e8389cf roles
  ['French Teacher (Early Years)',           'french-preschool-teacher.md'],
  ['German Teacher (Early Years)',           'german-preschool-teacher.md'],
  ['Arabic Teacher Y7',                      'arabic-teacher-y7.md'],
  ['English Teacher Y7 / KS3',               'english-teacher-y7-british-curriculum.md'],
  ['German HOD',                             'german-head-of-department-international-school.md'],
];
for (const sub of BRANCH_SUBS) {
  for (const [title, file] of BRANCH_TITLES) {
    test(`branch folder ${sub}: "${title}" falls back to education/${file}`, async () => {
      const r = await served(sub, title);
      assert.equal(r.found, true);
      assert.equal(r.file, file);
    });
  }
}

test('a branch-specific file still wins over the shared file (nothing that resolved changes)', async () => {
  for (const b of ['british', 'american', 'egyptian', 'ib', 'cambridge']) {
    const r = await served(`education/${b}`, 'Teacher');
    assert.equal(r.found, true);
    assert.equal(r.dir, b, `teacher.md under ${b}`);
  }
});

test('an exact file in the requested folder is never replaced by a fallback', async () => {
  const r = await served('education', 'Preschool English Teacher');
  assert.deepEqual([r.found, r.dir], [true, 'education']);
});

// Real platform industry labels that normalise to a folder that does not exist, or has no file for the role.
const LABELS = ['Marketing & Communications', 'Sales & Business Development', 'Customer Service', 'Engineering & Technical', 'Human Resources'];

test('label folders without a role file search the other folders before giving up', async () => {
  const cases = [
    ['Human Resources', 'HR Director - Schools Group', 'head-of-hr.md'],
    ['Customer Service', 'Senior Customer Care', 'customer-service-representative.md'],
    ['Customer Service', 'Customer Care Manager', 'customer-service-manager.md'],
    ['Engineering & Technical', 'Technical Pre-Sales Engineer', 'technical-pre-sales-engineer.md'],
    ['Marketing & Communications', 'Digital Marketing Specialist', 'digital-marketing-specialist.md'],
    ['Sales & Business Development', 'Technical Pre-Sales Engineer', 'technical-pre-sales-engineer.md'],
  ];
  for (const [label, title, file] of cases) {
    const r = await served(normalizeIndustry(label), title);
    assert.equal(r.found, true, `${label} / ${title}`);
    assert.equal(r.file, file, `${label} / ${title}`);
  }
});

test('the five labels with no folder still find an education file by its exact role key', async () => {
  for (const l of LABELS) {
    const r = await served(normalizeIndustry(l), 'Reading Teacher');
    assert.equal(r.found, true, l);
    assert.equal(r.file, 'reading-teacher.md', l);
  }
});

// Guard: the cross-industry step (a folder unrelated to the requested one) accepts exact role keys only.
test('cross-industry step never uses partial / longest-match slugs', async () => {
  for (const [label, title] of [
    ['Marketing & Communications', 'Marketing Specialist'],        // contained-key match -> digital-marketing-specialist
    ['Sales & Business Development', 'Real Estate Sales Manager'], // contained-key match -> sales-manager
    ['Engineering & Technical', 'Software Developer'],             // fragment match -> software-engineer
    ['Customer Service', 'Reading Teacher KS2'],
  ]) {
    const r = await served(normalizeIndustry(label), title);
    assert.equal(r.found, false, `${label} / ${title} must not be served from another industry`);
  }
});

test('exact role keys are still served cross-industry, with the source folder in the metadata', async () => {
  const res = await provider.get({ domain: 'jobs', subdomain: normalizeIndustry('Marketing & Communications'), role: 'Digital Marketing Specialist' });
  assert.equal(res.metadata.found, true);
  assert.equal(res.metadata.fallback, 'cross-industry');
  assert.equal(res.metadata.requestedFolder, 'marketing-communications');
  assert.equal(res.metadata.sourceFolder, 'marketing-advertising');
});

test('metadata reports where a file came from: exact, parent/other, or not found', async () => {
  const exact = await provider.get({ domain: 'jobs', subdomain: 'education', role: 'Preschool English Teacher' });
  assert.deepEqual([exact.metadata.fallback, exact.metadata.sourceFolder], ['none', 'education']);
  const parent = await provider.get({ domain: 'jobs', subdomain: 'education/british', role: 'Math Teacher - Year 2' });
  assert.deepEqual([parent.metadata.fallback, parent.metadata.sourceFolder], ['parent-or-other', 'education']);
  const other = await provider.get({ domain: 'jobs', subdomain: 'human-resources', role: 'HR Director - Schools Group' });
  assert.deepEqual([other.metadata.fallback, other.metadata.sourceFolder], ['parent-or-other', 'other']);
  const none = await provider.get({ domain: 'jobs', subdomain: 'education', role: 'Zzz Unknown Role' });
  assert.equal(none.metadata.found, false);
});

test('the resolver passes the source folder through to /execute', async () => {
  const { resolve } = require('../src/knowledge/knowledgeResolver');
  const out = await resolve([{ domain: 'jobs', subdomain: 'marketing-communications', role: 'Digital Marketing Specialist' }]);
  assert.equal(out.sources[0].sourceFolder, 'marketing-advertising');
  assert.equal(out.sources[0].fallback, 'cross-industry');
});

test('a role with no file anywhere is still reported as not found (Gemini fallback stays reachable)', async () => {
  for (const sub of ['education/british', normalizeIndustry('Engineering & Technical'), 'technology']) {
    const r = await served(sub, 'Zzz Unknown Role (control)');
    assert.equal(r.found, false, sub);
  }
});
