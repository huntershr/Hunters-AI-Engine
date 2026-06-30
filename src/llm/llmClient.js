// Hunters AI Generation Engine — Phase 1
// Deterministic knowledge-driven generation
// No external dependencies

function complete({ systemPrompt, userPrompt }) {
  const knowledge = parseKnowledgeBlock(userPrompt);
  const inputs    = parseRequestBlock(userPrompt);
  const schema    = parseOutputSchema(systemPrompt);
  const output    = generate(knowledge, inputs, schema);
  return Promise.resolve(JSON.stringify(output, null, 2));
}

// ─── PARSERS ────────────────────────────────────────────────────────────────

function parseKnowledgeBlock(userPrompt) {
  // Use top-level extractor so inner ## headings inside the knowledge file don't terminate the block
  const block = extractTopLevelSection(userPrompt, 'Knowledge');
  if (!block) return {};
  return {
    summary:          extractSection(block, 'Summary')        || '',
    responsibilities: extractBullets(block, 'Responsibilities'),
    competencies:     extractBullets(block, 'Competencies') || extractBullets(block, 'Skills'),
    qualifications:   extractSection(block, 'Qualifications') || extractSection(block, 'Requirements') || '',
    guidelinesSkills: extractGuidelinesSkills(block),
  };
}

// Extracts a top-level userPrompt section (Knowledge / Examples / Request).
// Stops only at the other known top-level headings, not at every ## inside the knowledge file.
function extractTopLevelSection(text, heading) {
  const others = ['Knowledge', 'Examples', 'Request'].filter(h => h !== heading).join('|');
  const regex  = new RegExp(
    `##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+(?:${others})\\s*\\n|$)`,
    'i'
  );
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

function parseRequestBlock(userPrompt) {
  const block = extractSection(userPrompt, 'Request') || userPrompt;
  return {
    title:            extractField(block, 'Job Title')           || '',
    industry:         extractField(block, 'Industry')            || '',
    skills:           extractFieldList(block, 'Required Skills'),
    experience_years: extractField(block, 'Experience Required') || '',
    education:        extractField(block, 'Education')           || '',
    language:         extractField(block, 'Language')            || 'en',
  };
}

function parseOutputSchema(systemPrompt) {
  if (systemPrompt.includes('job posting') || systemPrompt.includes('job description')) {
    return 'generate-job-post';
  }
  return 'generic';
}

// ─── SECTION EXTRACTORS ──────────────────────────────────────────────────────

function extractSection(text, heading) {
  // Match heading variations: "Responsibilities", "Key Responsibilities", "Core Responsibilities" etc.
  const regex = new RegExp(
    `##\\s+(?:Key\\s+|Core\\s+|Main\\s+)?${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
    'i'
  );
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

function extractBullets(text, heading) {
  const section = extractSection(text, heading);
  if (!section) return [];
  return section
    .split('\n')
    .map(l => l.replace(/^[-•*]\s*/, '').trim())
    .filter(l => l.length > 10);
}

// Extracts skill vocabulary from guidelines files (which use `Use "Skill Name"` syntax).
// Skips reference/lookup sections (Types, Standards, Certifications) — those are not required skills.
// JD knowledge files never use this syntax, so false positives are impossible.
function extractGuidelinesSkills(block) {
  if (!block) return [];
  const SKIP   = /\b(types|standards|certifications)\b/i;
  const seen   = new Set();
  const result = [];

  const sectionRe = /##\s+([^\n]+)\n([\s\S]*?)(?=\n##\s|$)/gi;
  let sec;
  while ((sec = sectionRe.exec(block)) !== null) {
    if (SKIP.test(sec[1])) continue;

    const useRe = /\bUse\s+"([^"]+)"/gi;
    let u;
    while ((u = useRe.exec(sec[2])) !== null) {
      const skill = u[1].trim();
      if (skill.length > 2 && !seen.has(skill.toLowerCase())) {
        seen.add(skill.toLowerCase());
        result.push(skill);
      }
    }
  }
  return result;
}

function extractField(text, fieldName) {
  const regex = new RegExp(`${fieldName}:\\s*(.+)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

function extractFieldList(text, fieldName) {
  const raw = extractField(text, fieldName);
  if (!raw) return [];
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

// ─── GENERATOR ───────────────────────────────────────────────────────────────

function generate(knowledge, inputs, schema) {
  if (schema === 'generate-job-post') return generateJobPost(knowledge, inputs);
  return { error: 'Unknown skill schema' };
}

function generateJobPost(k, inp) {
  const title    = inp.title    || 'Professional';
  const industry = inp.industry || 'General';
  const lang     = inp.language || 'en';

  // Summary
  const summary = k.summary && k.summary.length > 20
    ? k.summary
    : `We are seeking an experienced ${title} to join our team in the ${industry} sector. `
    + `The ideal candidate will bring proven expertise and a commitment to excellence.`;

  // Responsibilities — from knowledge, enriched with skills
  let responsibilities = [...(k.responsibilities || [])];
  if (responsibilities.length === 0) {
    responsibilities = defaultResponsibilities(title, industry);
  }
  if (inp.skills && inp.skills.length > 0) {
    const skillLine = `Apply expertise in ${inp.skills.slice(0, 3).join(', ')} to deliver high-quality results`;
    if (!responsibilities.some(r => r.toLowerCase().includes('skill') || r.toLowerCase().includes('expertise'))) {
      responsibilities.push(skillLine);
    }
  }
  responsibilities = responsibilities.slice(0, 10);

  // Requirements
  const experience = inp.experience_years
    ? `Minimum ${inp.experience_years} in a relevant ${industry} role`
    : k.qualifications
      ? extractExperienceFromQualifications(k.qualifications)
      : `Relevant experience in ${industry}`;

  const education = inp.education
    ? inp.education
    : extractEducationFromQualifications(k.qualifications);

  const skills = inp.skills && inp.skills.length > 0
    ? inp.skills
    : k.guidelinesSkills && k.guidelinesSkills.length > 0
      ? k.guidelinesSkills.slice(0, 8)
      : defaultSkills(title, industry);

  // Competencies — from knowledge or defaults
  let competencies = [...(k.competencies || [])];
  if (competencies.length === 0) {
    competencies = defaultCompetencies(title, industry);
  }
  competencies = competencies.slice(0, 5);

  // Qualifications
  const qualifications = k.qualifications && k.qualifications.length > 20
    ? k.qualifications
    : `${education}. ${experience}. Strong communication and organizational skills required.`;

  return {
    title,
    summary,
    responsibilities,
    requirements: { experience, education, skills },
    competencies,
    qualifications,
    language: lang,
  };
}

// ─── DEFAULTS ────────────────────────────────────────────────────────────────

function defaultResponsibilities(title, industry) {
  const shared = [
    `Perform core ${title} duties to the highest professional standards`,
    `Collaborate with team members and stakeholders to achieve departmental goals`,
    `Maintain accurate records and prepare reports as required`,
    `Participate in professional development and continuous improvement initiatives`,
    `Comply with organizational policies, procedures, and quality standards`,
  ];
  const industryMap = {
    'Education':            ['Deliver high-quality instruction aligned with curriculum standards', 'Monitor and report on student progress and welfare', 'Engage with parents and guardians on student development'],
    'Finance/Accounting':   ['Prepare and review financial statements and reports', 'Ensure compliance with Egyptian tax regulations and accounting standards', 'Support internal and external audit processes'],
    'Healthcare':           ['Deliver patient care in line with clinical standards and protocols', 'Maintain accurate clinical records and documentation', 'Collaborate with multidisciplinary clinical teams'],
    'Technology':           ['Design, develop, and maintain software systems and applications', 'Participate in code reviews and technical planning sessions', 'Troubleshoot and resolve technical issues efficiently'],
    'Real Estate':          ['Manage client relationships throughout the property lifecycle', 'Coordinate property transactions, documentation, and handovers', 'Monitor market trends and provide clients with accurate property insights'],
    'Construction':         ['Supervise construction activities and ensure compliance with approved designs', 'Coordinate with contractors, consultants, and project stakeholders', 'Enforce health, safety, and quality standards on site'],
  };
  const extras = industryMap[industry] || [
    `Deliver results aligned with ${industry} sector standards and best practices`,
    `Build and maintain productive relationships with clients and stakeholders`,
  ];
  return [...extras, ...shared].slice(0, 8);
}

function defaultCompetencies(title, industry) {
  return [
    `Professional Excellence: Delivers high-quality work consistently and takes ownership of outcomes`,
    `Communication: Engages colleagues, clients, and stakeholders clearly and professionally`,
    `Problem Solving: Identifies issues proactively and implements effective, lasting solutions`,
    `Collaboration: Works effectively within teams and across departments to achieve shared goals`,
    `Continuous Improvement: Seeks opportunities to develop professionally and improve processes`,
  ];
}

function defaultSkills(title, industry) {
  return [
    `${industry} sector knowledge`,
    'Communication and interpersonal skills',
    'MS Office proficiency',
    'Organizational and time management skills',
  ];
}

function extractExperienceFromQualifications(qual) {
  const match = qual.match(/(\d+)\+?\s*years?/i);
  return match ? `Minimum ${match[1]} years of relevant experience` : 'Relevant professional experience required';
}

function extractEducationFromQualifications(qual) {
  if (!qual) return 'Relevant degree or qualification';
  const match = qual.match(/(Bachelor|Master|PhD|Diploma|Degree)[^.;,]*/i);
  return match ? match[0].trim() : 'Relevant degree or equivalent qualification';
}

module.exports = { complete };
