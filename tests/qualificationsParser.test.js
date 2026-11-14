// "## Required Qualifications" is read from the knowledge file: experience, education and the qualifications paragraph.
const test   = require('node:test');
const assert = require('node:assert/strict');
const fs     = require('fs');
const path   = require('path');
const { complete } = require('../src/llm/llmClient');

const JOBS = path.join(__dirname, '..', 'knowledge', 'jobs');
const SYS  = 'You generate a job posting.';
async function gen(knowledge, title = 'Test Role') {
  const raw = await complete({ systemPrompt: SYS, userPrompt: `## Knowledge\n${knowledge}\n\n## Request\nJob Title: ${title}\nIndustry: Education\n` });
  return JSON.parse(raw);
}
const withQual = (...lines) => `## Job Brief\nA test role for the parser checks.\n\n## Required Qualifications\n${lines.map(l => '- ' + l).join('\n')}\n\n## Core Competencies\n- Communication: speaks clearly and listens well\n`;

test('range uses the LOWER number: hyphen, en dash, "to", plus sign', async () => {
  for (const [line, want] of [
    ['3-5 years of experience in accounting', 'Minimum 3 years of relevant experience'],
    ['3–5 years of experience in accounting', 'Minimum 3 years of relevant experience'],
    ['3 to 5 years of experience in accounting', 'Minimum 3 years of relevant experience'],
    ['7+ years of real estate sales experience', 'Minimum 7 years of relevant experience'],
    ['At least 2 years of experience teaching', 'Minimum 2 years of relevant experience'],
    ['Two years of experience teaching', 'Minimum 2 years of relevant experience'],
  ]) {
    const d = await gen(withQual("Bachelor's degree in a related field", line));
    assert.equal(d.requirements.experience, want, line);
  }
});

test('"1 year" is singular', async () => {
  for (const line of ['At least 1 year of experience in a school', '1+ year of experience in a school', '1-2 years of experience in a school']) {
    const d = await gen(withQual("Bachelor's degree", line));
    assert.equal(d.requirements.experience, 'Minimum 1 year of relevant experience', line);
  }
});

test('an experience line wins over another years figure', async () => {
  const d = await gen(withQual("Bachelor's degree in Law", 'Graduated within the last 10 years', '4 years of experience in litigation'));
  assert.equal(d.requirements.experience, 'Minimum 4 years of relevant experience');
});

test('no years in the file: neutral text, no invented number', async () => {
  const d = await gen(withQual('Ability to follow instructions reliably', 'Physical fitness for manual work'));
  assert.equal(d.requirements.experience, 'Relevant professional experience required');
  assert.doesNotMatch(d.requirements.experience, /\d/);
});

test('education: first degree line only, commas and brackets kept, never the following bullets', async () => {
  const d = await gen(withQual("Bachelor's degree (education, English or a related field)", '3-5 years of experience', 'Strong English'));
  assert.equal(d.requirements.education, "Bachelor's degree (education, English or a related field)");
  const e = await gen(withQual("Bachelor's degree in Computer Science, Software Engineering, or related field", '3 years of experience'));
  assert.equal(e.requirements.education, "Bachelor's degree in Computer Science, Software Engineering, or related field");
  assert.doesNotMatch(d.requirements.education, /\n/);
});

test('no degree line: does not claim a degree is required', async () => {
  const d = await gen(withQual('Valid commercial driving licence', '3+ years of driving experience'));
  assert.equal(d.requirements.education, 'Relevant qualification or equivalent experience');
});

test('CRLF knowledge files give clean single-line output', async () => {
  const crlf = withQual("Bachelor's degree in education", 'At least 1 year of experience teaching').replace(/\n/g, '\r\n');
  const d = await gen(crlf);
  for (const v of [d.qualifications, d.requirements.education, d.requirements.experience]) assert.doesNotMatch(v, /[\r\n]/);
  assert.equal(d.requirements.education, "Bachelor's degree in education");
  assert.equal(d.qualifications, "Bachelor's degree in education. At least 1 year of experience teaching.");
});

test('qualifications is one paragraph (string contract), not a bulleted block', async () => {
  const d = await gen(withQual("Bachelor's degree in Accounting or Finance", '3–5 years of accounting experience', 'Proficiency in MS Excel'));
  assert.equal(d.qualifications, "Bachelor's degree in Accounting or Finance. 3–5 years of accounting experience. Proficiency in MS Excel.");
});

test('the older "## Qualifications" heading and files without any section keep the old behaviour', async () => {
  const old = await gen('## Job Brief\nA role without a qualifications section for testing.\n');
  assert.match(old.qualifications, /^Relevant degree or qualification\. Relevant experience in Education\./);
  const alt = await gen('## Qualifications\n- Bachelor degree in nursing from a recognised university\n- 3 years of experience in a hospital\n');
  assert.equal(alt.requirements.education, 'Bachelor degree in nursing from a recognised university');
});

// Every shipped role file with a Required Qualifications section.
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(JOBS).filter(f => f.endsWith('.md') && /^## Required Qualifications/m.test(fs.readFileSync(f, 'utf8')));

test('real files: qualifications come from the file, on one line, never above the top of a range', async () => {
  assert.ok(files.length > 100, `files with the section: ${files.length}`);
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8');
    const rel  = path.relative(JOBS, f);
    const d    = await gen(text, path.basename(f, '.md'));
    for (const v of [d.qualifications, d.requirements.education, d.requirements.experience]) assert.doesNotMatch(v, /[\r\n]/, rel);
    assert.doesNotMatch(d.qualifications, /^Relevant degree or qualification\./, `${rel}: still the generic template`);
    assert.doesNotMatch(d.requirements.experience, /\b1 years\b/, rel);
    // A file with a single years figure that is a range must report the lower number.
    const sec    = (text.match(/^## Required Qualifications\r?\n([\s\S]*?)(?=\r?\n## |$)/m) || [])[1] || '';
    const figs   = sec.match(/\d+\s*(?:-|–|to)?\s*\d*\s*\+?\s*years?/gi) || [];
    const range  = figs.length === 1 && figs[0].match(/(\d+)\s*(?:-|–|to)\s*(\d+)/);
    if (range) assert.equal(d.requirements.experience, `Minimum ${range[1]} years of relevant experience`, rel);
  }
});

test('the other output fields are untouched by the parser change', async () => {
  const d = await gen(fs.readFileSync(path.join(JOBS, 'education', 'math-teacher.md'), 'utf8'), 'Math Teacher - Year 7');
  assert.equal(d.responsibilities.length, 8);
  assert.equal(d.competencies.length, 5);
  assert.equal(d.deal_breakers.length, 2);
});
