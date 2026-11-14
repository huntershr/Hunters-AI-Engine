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

// ── Stage A: aliases, education titles, platform titles, seniority variants ───
const JOBS_DIR = path.join(__dirname, '..', 'knowledge', 'jobs');
const slugFileExists = slug => fs.readdirSync(JOBS_DIR, { withFileTypes: true })
  .some(d => d.isDirectory() && fs.existsSync(path.join(JOBS_DIR, d.name, `${slug}.md`)));

test('every ROLE_MAP value points to a knowledge file that exists', () => {
  for (const [k, v] of Object.entries(ROLE_MAP)) assert.ok(slugFileExists(v), `${k} -> ${v}.md has no file`);
});

test('the six requested aliases exist and resolve (bare "arabic teacher" key kept)', () => {
  const want = {
    'arabic teacher ks3': 'arabic-teacher-y7', 'arabic teacher key stage 3': 'arabic-teacher-y7',
    'english teacher high school': 'english-teacher-high-school',
    'french teacher early years': 'french-preschool-teacher', 'german teacher early years': 'german-preschool-teacher',
    'english teacher early years': 'preschool-english-teacher',
    'arabic teacher': 'arabic-teacher-y7',
  };
  for (const [k, v] of Object.entries(want)) { assert.equal(ROLE_MAP[k], v, k); assert.equal(normalizeRole(k), v, k); }
});

// Education titles requested for coverage (title -> slug)
const EDUCATION_TITLES = [
  ["English Teacher (Early Years Homeroom)", "preschool-english-teacher"],
  ["French Teacher (Early Years)", "french-preschool-teacher"],
  ["German Teacher (Early Years)", "german-preschool-teacher"],
  ["English Teacher Y7 / KS3", "english-teacher-y7-british-curriculum"],
  ["German HOD", "german-head-of-department-international-school"],
  ["Arabic Teacher KS3", "arabic-teacher-y7"],
  ["Reading Teacher KS2", "reading-teacher"],
  ["English Teacher High School", "english-teacher-high-school"],
  ["ICT Teacher (Middle & High)", "ict-teacher"],
  ["Humanities Teacher (Middle & High)", "humanities-teacher"],
  ["EYFS Homeroom Teacher (native based in Egypt)", "eyfs-homeroom-teacher"],
  ["Lower Elementary Homeroom Teacher (native based in Egypt)", "lower-elementary-homeroom-teacher"],
  ["Science Teacher", "science-teacher"],
  ["German Teacher (secondary)", "german-teacher"],
  ["Head of Admission", "head-of-enrollment"],
  ["Senior Customer Care", "customer-service-representative"],
];
for (const [title, slug] of EDUCATION_TITLES) {
  test(`education title "${title}" -> ${slug}`, () => assert.equal(normalizeRole(title), slug));
}

// Titles the platform really used (jobs-we-had), title -> slug. Titles that are still on a generic file or
// unresolved are listed on purpose, so a later change of their resolution is a visible, reviewed edit.
const PLATFORM_TITLES = [
  ["HR Director - Schools Group", "head-of-hr"],
  ["English Teacher - Year 5", "english-teacher-primary"],
  ["Key Stage Headmistress", "ks-headmistress"],
  ["Science Teacher - year 7", "science-teacher"],
  ["Head of Admissions", "head-of-enrollment"],
  ["School Counselor / Psychologist", "school-counselor"],
  ["Science Teacher KS3", "science-teacher"],
  ["Math Teacher - Year 7", "math-teacher"],
  ["HOD – Head of Department", "hod"],
  ["Front Desk Officer", "receptionist"],
  ["Senior Admission Officer", "admissions-officer"],
  ["Arabic SS HOD", "head-of-arabic-department"],
  ["German Teacher KS1", "german-teacher"],
  ["Arabic Teacher - Year 8", "arabic-teacher-y7"],
  ["English Teacher - Year 7", "english-teacher-y7-british-curriculum"],
  ["Head of Arabic Department", "head-of-arabic-department"],
  ["PE Head of Department - HOD", "pe-head-of-department"],
  ["Math Teacher - Year 2", "math-teacher"],
  ["Technical Pre-Sales Engineer", "technical-pre-sales-engineer"],
  ["English Head of Department", "english-head-of-department"],
  ["Business Development Manager", "business-development-manager"],
  ["English Teacher", "teacher"],
  ["Marketing & Admission Officer", "marketing-admission-officer"],
  ["EYFS Co Teacher", "eyfs-co-teacher"],
  ["charcter Building Teacher", "character-building-teacher"],
  ["KS Admin Assistant", "ks-admin-assistant"],
  ["English Teacher - KS 3", "english-teacher-y7-british-curriculum"],
  ["English Head of Department", "english-head-of-department"],
  ["Math Teacher - KS 2", "math-teacher"],
  ["Student Management Officer - French Speaker", "student-management-officer"],
  ["Arabic Teacher - Lower Primary", "arabic-teacher-lower-primary"],
  ["German HOD", "german-head-of-department-international-school"],
  ["German Teacher", "german-teacher"],
  ["Floating Teacher", "floating-teacher"],
  ["Arabic Social Studies Teacher", "arabic-social-studies-teacher"],
  ["Lower Elementary Homeroom Teacher - Native, Based in Egypt", "lower-elementary-homeroom-teacher"],
  ["American high school math teacher", "math-teacher"],
  ["Finance Manager", "finance-manager"],
  ["Global Perspective Teacher", "teacher"],
  ["Marketing Specialist", "digital-marketing-specialist"],
  ["Administrative Assistant to CEO", "administrative-assistant-to-ceo"],
  ["British primary school English teacher", "english-teacher-primary"],
  ["Music Teacher", "teacher"],
  ["Preschool French Teacher", "french-preschool-teacher"],
  ["Checkpoint Math Teacher", "math-teacher"],
  ["Preschool English Teacher", "preschool-english-teacher"],
  ["Arabic Teacher", "arabic-teacher-y7"],
  ["HR Assistant", "hr-assistant"],
  ["Literature and Drama Teacher", "teacher"],
  ["Accountant- Finance Firm", "accountant"],
  ["French Teacher - KS 2", "teacher"],
  ["Humanities Teacher - Middle & High School", "humanities-teacher"],
  ["English Teacher - High School", "english-teacher-high-school"],
  ["ICT Teacher - Middle & High School", "ict-teacher"],
  ["Science Teachers KS2 - KS3", "science-teacher"],
  ["Drama Teacher", "teacher"],
  ["Science Teacher - KS 2", "science-teacher"],
  ["Senior Customer Service Representative", "customer-service-representative"],
  ["Year 3 Homeroom Teacher", "homeroom-teacher"],
  ["Civil Engineer", "civil-engineer"],
  ["English Support Teacher - KS 3", "teacher"],
  ["Junior sales - Field (Outdoor) Sales Executive", "junior-sales---field-(outdoor)-sales-executive"],
  ["Preschool English Teacher", "preschool-english-teacher"],
  ["Preschool German Teacher", "german-preschool-teacher"],
  ["Property Consultant - Real Estate Sales", "property-consultant---real-estate-sales"],
  ["Senior Accountant", "accountant"],
  ["Senior Pre Sales Engineer", "technical-pre-sales-engineer"],
  ["EYFS Homeroom Teacher (Native, Based in Egypt)", "eyfs-homeroom-teacher"],
  ["Real Estate Sales Manager", "sales-manager"],
  ["Senior Property Consultant", "senior-property-consultant"],
  ["Senior sales - Field (Outdoor) Sales Executive", "senior-sales---field-(outdoor)-sales-executive"],
];
for (const [title, slug] of PLATFORM_TITLES) {
  test(`platform title "${title}" -> ${slug}`, () => assert.equal(normalizeRole(title), slug));
}

// Seniority variants resolve to the same base file ("Junior X", "Senior X", "X Manager")
const SENIORITY_STABLE = [
  ["MEP Engineer", "mep-engineer"],
  ["Site Engineer", "site-engineer"],
  ["Technical Office Engineer", "technical-office-engineer"],
  ["Technical Pre-Sales Engineer", "technical-pre-sales-engineer"],
  ["Accountant", "accountant"],
  ["Senior Accountant", "accountant"],
  ["Accounts Payable Accountant", "accountant"],
  ["Accounts Receivable Accountant", "accountant"],
  ["Cost Accountant", "accountant"],
  ["Financial Analyst", "financial-analyst"],
  ["Tax Accountant", "accountant"],
  ["Finance Manager", "finance-manager"],
  ["Sales Manager", "sales-manager"],
  ["Business Development Executive", "business-development-executive"],
  ["Business Development Manager", "business-development-manager"],
  ["Customer Service Representative", "customer-service-representative"],
  ["Call Center Agent", "call-center-agent"],
  ["Customer Care Representative", "customer-service-representative"],
  ["Customer Service Manager", "customer-service-manager"],
  ["Digital Marketing Specialist", "digital-marketing-specialist"],
  ["Social Media Specialist", "social-media-specialist"],
  ["Marketing Manager", "marketing-manager"],
  ["Software Developer", "software-engineer"],
  ["Front-End Developer", "software-engineer"],
  ["Back-End Developer", "software-engineer"],
  ["Full-Stack Developer", "software-engineer"],
  ["Mobile Developer", "software-engineer"],
  ["Data Analyst", "data-analyst"],
  ["IT Manager", "it-manager"],
];
for (const [base, slug] of SENIORITY_STABLE) {
  const variants = [`Junior ${base}`, `Senior ${base}`];
  if (!/manager$|cfo$|controller$/i.test(base)) variants.push(`${base} Manager`);
  for (const t of variants) test(`seniority variant "${t}" -> ${slug}`, () => assert.equal(normalizeRole(t), slug));
}

// New aliases are served through the education industry label
const STAGE_A_ALIAS_CASES = [
  ['english-teacher-primary.md',            ['English Teacher - Year 5', 'English Teacher Year 4', 'Primary English Teacher', 'English Teacher KS2']],
  ['english-teacher-y7-british-curriculum.md', ['English Teacher - Year 7', 'English Teacher - KS 3', 'English Teacher KS3']],
  ['english-teacher-high-school.md',        ['English Teacher High School', 'English Teacher - High School']],
  ['preschool-english-teacher.md',          ['English Teacher (Early Years Homeroom)', 'English Teacher Early Years', 'English Teacher (Early Years)']],
  ['french-preschool-teacher.md',           ['French Teacher (Early Years)', 'French Teacher Early Years', 'Preschool French Teacher']],
  ['german-preschool-teacher.md',           ['German Teacher (Early Years)', 'German Teacher Early Years', 'Preschool German Teacher']],
  ['arabic-teacher-y7.md',                  ['Arabic Teacher KS3', 'Arabic Teacher Key Stage 3', 'Arabic Teacher - Year 8']],
  ['arabic-teacher-lower-primary.md',       ['Arabic Teacher - Lower Primary']],
  ['arabic-social-studies-teacher.md',      ['Arabic Social Studies Teacher']],
  ['german-teacher.md',                     ['German Teacher', 'German Teacher KS1', 'German Teacher (secondary)']],
  ['german-head-of-department-international-school.md', ['German HOD']],
  ['head-of-arabic-department.md',          ['Head of Arabic Department', 'Arabic SS HOD']],
  ['english-head-of-department.md',         ['English Head of Department']],
  ['pe-head-of-department.md',              ['PE Head of Department - HOD']],
  ['science-teacher.md',                    ['Science Teacher', 'Science Teacher - year 7', 'Science Teacher KS3', 'Senior Science Teacher']],
  ['math-teacher.md',                       ['Math Teacher - Year 7', 'Math Teacher - KS 2', 'Checkpoint Math Teacher', 'American high school math teacher']],
  ['reading-teacher.md',                    ['Reading Teacher KS2']],
  ['ict-teacher.md',                        ['ICT Teacher (Middle & High)', 'ICT Teacher - Middle & High School']],
  ['humanities-teacher.md',                 ['Humanities Teacher (Middle & High)', 'Humanities Teacher - Middle & High School']],
  ['eyfs-homeroom-teacher.md',              ['EYFS Homeroom Teacher (native based in Egypt)']],
  ['eyfs-co-teacher.md',                    ['EYFS Co Teacher']],
  ['lower-elementary-homeroom-teacher.md',  ['Lower Elementary Homeroom Teacher (native based in Egypt)']],
  ['character-building-teacher.md',         ['charcter Building Teacher', 'Character Building Teacher']],
  ['ks-admin-assistant.md',                 ['KS Admin Assistant']],
  ['student-management-officer.md',         ['Student Management Officer - French Speaker']],
  ['marketing-admission-officer.md',        ['Marketing & Admission Officer']],
  ['head-of-enrollment.md',                 ['Head of Admission', 'Head of Admissions']],
  ['admissions-officer.md',                 ['Senior Admission Officer']],
  ['receptionist.md',                       ['Front Desk Officer']],
];
for (const [file, titles] of STAGE_A_ALIAS_CASES) {
  for (const title of titles) {
    test(`stage A "${title}" -> ${file}`, () => assert.equal(`${normalizeRole(title)}.md`, file));
    test(`  served via industry "Education": "${title}"`, async () => {
      const res = await provider.get({ domain: 'jobs', subdomain: normalizeIndustry('Education'), role: title });
      assert.equal(res.metadata.found, true);
      assert.ok(res.metadata.path.endsWith(file), res.metadata.path);
    });
  }
}

test('technical pre-sales engineer is served from the technology folder, seniority variants included', async () => {
  for (const t of ['Technical Pre-Sales Engineer', 'Senior Pre Sales Engineer', 'Junior Technical Pre-Sales Engineer']) {
    const res = await provider.get({ domain: 'jobs', subdomain: normalizeIndustry('Technology'), role: t });
    assert.equal(res.metadata.found, true, t);
    assert.ok(res.metadata.path.endsWith('technical-pre-sales-engineer.md'), t);
  }
});

test('customer care and HR director aliases; generic titles are not hijacked', () => {
  assert.equal(normalizeRole('Senior Customer Care'), 'customer-service-representative');
  assert.equal(normalizeRole('Customer Care Manager'), 'customer-service-manager');
  assert.equal(normalizeRole('HR Director - Schools Group'), 'head-of-hr');
  assert.equal(normalizeRole('English Teacher'), 'teacher');
  assert.equal(normalizeRole('Teacher'), 'teacher');
  assert.equal(normalizeRole('Head of Department'), 'hod');
  assert.equal(normalizeRole('HOD'), 'hod');
  assert.equal(normalizeRole('Music Teacher'), 'teacher');
});

test('industry labels used for education all map to the education folder', () => {
  for (const l of ['Education', 'School', 'International School', 'Preschool', 'Early Years']) assert.equal(normalizeIndustry(l), 'education');
});
