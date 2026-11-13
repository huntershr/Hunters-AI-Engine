// Structure checks for the role knowledge files added in this series.
const test   = require('node:test');
const assert = require('node:assert/strict');
const fs     = require('fs');
const path   = require('path');

const DIR = path.join(__dirname, '..', 'knowledge', 'jobs', 'education');
const FILES = [
  'preschool-english-teacher.md', 'french-preschool-teacher.md', 'german-preschool-teacher.md',
  'arabic-teacher-y7.md', 'english-teacher-y7-british-curriculum.md',
  'german-head-of-department-international-school.md',
];
const ORDER = ['Job Brief', 'Key Responsibilities', 'Required Qualifications', 'Required Skills',
               'Core Competencies', 'Essential (Deal Breaker)', 'Nice to Have'];

function sections(text) {
  const out = {};
  for (const m of text.matchAll(/^## (.+)\n([\s\S]*?)(?=\n## |$)/gm)) out[m[1].trim()] = m[2].trim();
  return out;
}
const bullets = s => s.split('\n').filter(l => /^- /.test(l)).map(l => l.slice(2).trim());

for (const f of FILES) {
  const text = fs.readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n');
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

  test(`${f}: deal breakers are phrased as skills (also listed in Required Skills)`, () => {
    const skills = bullets(sec['Required Skills']).map(s => s.toLowerCase());
    for (const d of bullets(sec['Essential (Deal Breaker)'])) {
      assert.ok(!/^no\b/i.test(d), `negative phrasing: ${d}`);
      assert.ok(skills.includes(d.toLowerCase()), `not in Required Skills: ${d}`);
    }
  });
}
