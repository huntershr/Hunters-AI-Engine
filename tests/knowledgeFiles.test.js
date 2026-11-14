// Structure checks for the role knowledge files added in this series.
const test   = require('node:test');
const assert = require('node:assert/strict');
const fs     = require('fs');
const path   = require('path');

const JOBS = path.join(__dirname, '..', 'knowledge', 'jobs');
const EDU = [
  'preschool-english-teacher', 'french-preschool-teacher', 'german-preschool-teacher',
  'arabic-teacher-y7', 'english-teacher-y7-british-curriculum',
  'german-head-of-department-international-school',
  // Stage A additions
  'english-teacher-primary', 'science-teacher', 'math-teacher', 'head-of-arabic-department',
  'pe-head-of-department', 'english-head-of-department', 'marketing-admission-officer', 'eyfs-co-teacher',
  'character-building-teacher', 'ks-admin-assistant', 'student-management-officer', 'arabic-teacher-lower-primary',
  'german-teacher', 'arabic-social-studies-teacher', 'lower-elementary-homeroom-teacher', 'eyfs-homeroom-teacher',
  'reading-teacher', 'english-teacher-high-school', 'ict-teacher', 'humanities-teacher',
];
const FILES = [...EDU.map(f => `education/${f}.md`), 'technology/technical-pre-sales-engineer.md'];
const ORDER = ['Job Brief', 'Key Responsibilities', 'Required Qualifications', 'Required Skills',
               'Core Competencies', 'Essential (Deal Breaker)', 'Nice to Have'];

// A section body runs to the next "## " heading or the end of the file. ("$" under /m would stop at the first
// line break, so only the first bullet of each section was ever checked.)
function sections(text) {
  const out = {};
  for (const m of text.matchAll(/^## (.+)\n([\s\S]*?)(?=\n## |(?![\s\S]))/gm)) out[m[1].trim()] = m[2].trim();
  return out;
}
const bullets = s => s.split('\n').filter(l => /^- /.test(l)).map(l => l.slice(2).trim());

for (const f of FILES) {
  const text = fs.readFileSync(path.join(JOBS, f), 'utf8').replace(/\r\n/g, '\n');
  const sec  = sections(text);

  test(`${f}: headings present in template order`, () => {
    const heads = [...text.matchAll(/^## (.+)$/gm)].map(m => m[1].trim());
    assert.deepEqual(heads.filter(h => ORDER.includes(h)), ORDER);
    assert.ok(heads.indexOf('Essential (Deal Breaker)') < heads.indexOf('Nice to Have'), 'deal breakers above Nice to Have');
  });

  test(`${f}: every parsed bullet is longer than 10 characters`, () => {
    for (const h of ['Key Responsibilities', 'Required Skills', 'Core Competencies', 'Essential (Deal Breaker)']) {
      const b = bullets(sec[h]);
      assert.ok(b.length > 0, h);
      for (const x of b) assert.ok(x.length > 10, `${h}: "${x}"`);
    }
  });

  test(`${f}: has a Keywords line, at least 5 competencies and Required Qualifications bullets`, () => {
    assert.ok(/^## Keywords\n.{10,}/m.test(text), 'Keywords line');
    assert.ok(bullets(sec['Core Competencies']).length >= 5, 'at least 5 core competencies');
    assert.ok(bullets(sec['Required Qualifications']).length >= 3, 'Required Qualifications bullets');
  });

  test(`${f}: deal breakers are phrased as skills (also listed in Required Skills)`, () => {
    const skills = bullets(sec['Required Skills']).map(s => s.toLowerCase());
    for (const d of bullets(sec['Essential (Deal Breaker)'])) {
      assert.ok(!/^no\b/i.test(d), `negative phrasing: ${d}`);
      assert.ok(skills.includes(d.toLowerCase()), `not in Required Skills: ${d}`);
    }
  });
}
