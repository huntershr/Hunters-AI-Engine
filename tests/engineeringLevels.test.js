// Stage B, Engineering: Junior / mid / Senior files resolve by title, carry the right experience for their level,
// and the alias map has no duplicate keys, dead values or hijacked titles.
const test   = require('node:test');
const assert = require('node:assert/strict');
const fs     = require('fs');
const path   = require('path');

const provider = require('../src/knowledge/providers/markdownProvider');
const { normalizeRole, ROLE_MAP } = provider;
const { normalizeIndustry } = require('../src/knowledge/normalizeIndustry');
const { complete } = require('../src/llm/llmClient');

const JOBS = path.join(__dirname, '..', 'knowledge', 'jobs');
const read = rel => fs.readFileSync(path.join(JOBS, rel), 'utf8').replace(/\r\n/g, '\n');
const served = async (label, title) => {
  const r = await provider.get({ domain: 'jobs', subdomain: normalizeIndustry(label), role: title });
  return { found: r.metadata.found, rel: r.metadata.found ? path.relative(JOBS, r.metadata.path).replace(/\\/g, '/') : null };
};
async function experienceFor(rel) {
  const raw = await complete({
    systemPrompt: 'You generate a job posting.',
    userPrompt: `## Knowledge\n${read(rel)}\n\n## Request\nJob Title: Test\nIndustry: Construction\n`,
  });
  return JSON.parse(raw).requirements.experience;
}

// family -> [ [titles that must resolve to the file], expected lower bound ]
const FAMILIES = {
  'civil-engineer':      { names: ['Civil Engineer', 'Civil Site Engineer', 'Civil Execution Engineer'], ar: 'مهندس مدني' },
  'electrical-engineer': { names: ['Electrical Engineer', 'Electrical Site Engineer', 'Electrical Design Engineer', 'Electrical Execution Engineer'], ar: 'مهندس كهرباء' },
  'mechanical-engineer': { names: ['Mechanical Engineer', 'Mechanical Site Engineer', 'Mechanical Design Engineer', 'Mechanical Execution Engineer'], ar: 'مهندس ميكانيكا' },
};

for (const [slug, { names, ar }] of Object.entries(FAMILIES)) {
  for (const n of names) {
    for (const [prefixes, file, min] of [
      [[''], slug, 3],
      [['Junior ', 'Jr ', 'Jr. ', 'Assistant ', 'Graduate '], `junior-${slug}`, 0],
      [['Senior ', 'Sr ', 'Sr. ', 'Lead ', 'Principal '], `senior-${slug}`, 6],
    ]) {
      for (const p of prefixes) {
        const title = `${p}${n}`;
        test(`"${title}" -> ${file}.md (minimum ${min})`, () => {
          assert.equal(normalizeRole(title), file);
          assert.equal(normalizeRole(`${title} - Site`), file, 'suffix after a dash keeps the level');
        });
      }
    }
  }
  test(`Arabic title for ${slug}`, () => assert.equal(normalizeRole(ar), slug));
}

test('each level file states its own experience range and the parser reads the lower bound', async () => {
  for (const [slug, lo] of Object.entries({ 'civil-engineer': 'civil', 'electrical-engineer': 'electrical', 'mechanical-engineer': 'mechanical' })) {
    const j = read(`construction/junior-${slug}.md`), m = read(`construction/${slug}.md`), s = read(`construction/senior-${slug}.md`);
    assert.match(j, /^- 0–2 years of experience/m, `junior ${lo}`);
    assert.match(m, /^- 3–5 years of experience/m, `mid ${lo}`);
    assert.match(s, /^- 6–9 years of experience/m, `senior ${lo}`);
    assert.equal(await experienceFor(`construction/junior-${slug}.md`), 'Minimum 0 years of relevant experience');
    assert.equal(await experienceFor(`construction/${slug}.md`), 'Minimum 3 years of relevant experience');
    assert.equal(await experienceFor(`construction/senior-${slug}.md`), 'Minimum 6 years of relevant experience');
  }
  assert.equal(await experienceFor('construction/project-engineer.md'), 'Minimum 3 years of relevant experience');
});

test('Project Engineer (mid) and its aliases', () => {
  for (const t of ['Project Engineer', 'Site Project Engineer', 'مهندس مشروع', 'Project Engineer - MEP']) assert.equal(normalizeRole(t), 'project-engineer', t);
});

test('electro-mechanical and MEP titles are not hijacked by the new mechanical / electrical keys', () => {
  for (const t of ['Electro-Mechanical Engineer', 'Electromechanical Engineer', 'Mechanical and Electrical Engineer', 'Mechanical & Electrical Engineer', 'M&E Engineer', 'Senior Electro-Mechanical Engineer'])
    assert.equal(normalizeRole(t), 'electro-mechanical-engineer', t);
  assert.equal(normalizeRole('MEP Engineer'), 'mep-engineer');
  assert.equal(normalizeRole('Site Engineer'), 'site-engineer');
  assert.equal(normalizeRole('Technical Office Engineer'), 'technical-office-engineer');
  assert.equal(normalizeRole('Concrete Engineer'), 'concrete-engineer');
});

test('agreed aliases: software developer, marketing specialist, real estate sales manager', async () => {
  assert.equal(normalizeRole('Software Developer'), 'software-engineer');
  assert.equal(normalizeRole('software developer'), 'software-engineer');
  assert.equal(normalizeRole('Marketing Specialist'), 'digital-marketing-specialist');
  assert.equal(normalizeRole('Digital Marketing Specialist'), 'digital-marketing-specialist');
  assert.equal(normalizeRole('Social Media Marketing Specialist'), 'social-media-specialist');
  assert.equal(normalizeRole('Real Estate Sales Manager'), 'sales-manager');
  // Served through the real platform labels (cross-industry step accepts exact ROLE_MAP keys)
  assert.equal((await served('Engineering & Technical', 'Software Developer')).rel, 'technology/software-engineer.md');
  assert.equal((await served('Marketing & Communications', 'Marketing Specialist')).rel, 'marketing-advertising/digital-marketing-specialist.md');
  assert.equal((await served('Sales & Business Development', 'Real Estate Sales Manager')).rel, 'real-estate/sales-manager.md');
});

test('platform labels serve the level files (Construction, Engineering & Technical, Technology, Real Estate)', async () => {
  for (const label of ['Construction', 'Engineering & Technical', 'Technology', 'Real Estate', 'Engineering']) {
    for (const [title, rel] of [
      ['Junior Civil Engineer', 'construction/junior-civil-engineer.md'],
      ['Civil Engineer', 'construction/civil-engineer.md'],
      ['Senior Electrical Engineer', 'construction/senior-electrical-engineer.md'],
      ['Jr. Mechanical Engineer', 'construction/junior-mechanical-engineer.md'],
      ['Project Engineer', 'construction/project-engineer.md'],
    ]) {
      const r = await served(label, title);
      assert.equal(r.rel, rel, `${label} / ${title}`);
    }
  }
});

// ── Collision scan ──────────────────────────────────────────────────────────
test('collision scan: no duplicate keys in the ROLE_MAP literal', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'knowledge', 'providers', 'markdownProvider.js'), 'utf8');
  const body = src.slice(src.indexOf('const ROLE_MAP = {'), src.indexOf('\n};', src.indexOf('const ROLE_MAP = {')));
  const keys = [...body.matchAll(/(?:^|[,{]\s*)(?:'((?:[^'\\]|\\.)+)'|"((?:[^"\\]|\\.)+)")\s*:/gm)].map(m => m[1] || m[2]);
  assert.ok(keys.length > 40);
  const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
  assert.deepEqual(dup, []);
});

test('collision scan: every ROLE_MAP value is an existing role file', () => {
  const all = new Set();
  for (const d of fs.readdirSync(JOBS)) for (const f of fs.readdirSync(path.join(JOBS, d), { withFileTypes: true }))
    if (f.isFile() && f.name.endsWith('.md')) all.add(f.name.slice(0, -3));
    else if (f.isDirectory()) for (const g of fs.readdirSync(path.join(JOBS, d, f.name))) if (g.endsWith('.md')) all.add(g.slice(0, -3));
  const dead = [...new Set(Object.values(ROLE_MAP))].filter(v => !all.has(v));
  assert.deepEqual(dead, []);
});

test('collision scan: every knowledge file name, read as a title, resolves to itself (known exception listed)', () => {
  // Pre-existing: "English Teacher Primary" is served as teacher.md by the longest-key rule. Not part of this batch.
  const KNOWN = new Set(['education/english-teacher-primary']);
  const bad = [];
  for (const d of fs.readdirSync(JOBS)) for (const f of fs.readdirSync(path.join(JOBS, d), { withFileTypes: true })) {
    if (!f.isFile() || !f.name.endsWith('.md')) continue;
    const s = f.name.slice(0, -3);
    if (normalizeRole(s.replace(/-/g, ' ')) !== s && !KNOWN.has(`${d}/${s}`)) bad.push(`${d}/${s} -> ${normalizeRole(s.replace(/-/g, ' '))}`);
  }
  assert.deepEqual(bad, []);
});

test('collision scan: a title containing a longer key never falls to a shorter one with a different level', () => {
  for (const [k, v] of Object.entries(ROLE_MAP)) assert.equal(normalizeRole(k), v, k);
  for (const [k, v] of Object.entries(ROLE_MAP)) {
    if (!/^(junior|senior) /.test(k)) continue;
    assert.ok(/^(junior|senior)-/.test(v), `${k} -> ${v}`);
    assert.equal(k.startsWith('junior ') ? v.startsWith('junior-') : v.startsWith('senior-'), true, k);
  }
});
