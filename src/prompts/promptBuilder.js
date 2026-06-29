// NOTE (V2): Output schema embedded in skill.output.
// In V2, extract to schemas/{skillName}.schema.json and load separately.

function build({ skill, knowledge, context = {}, inputs = {}, examples = null }) {
  return {
    systemPrompt: assembleSystem({ skill, context }),
    userPrompt:   assembleUser({ knowledge, inputs, examples })
  };
}

function assembleSystem({ skill, context }) {
  const parts = [];
  if (skill.role)         parts.push(skill.role);
  if (skill.goal)         parts.push(skill.goal);
  if (skill.instructions) parts.push(`## Instructions\n${skill.instructions}`);
  if (skill.rules)        parts.push(`## Rules\n${skill.rules}`);
  if (skill.output)       parts.push(`## Output Format\n${skill.output}`);
  const ctx = formatContext(context);
  if (ctx) parts.push(`## Context\n${ctx}`);
  return parts.join('\n\n');
}

function assembleUser({ knowledge, inputs, examples }) {
  const parts = [];
  if (knowledge && knowledge.combined) parts.push(`## Knowledge\n${knowledge.combined}`);
  if (examples) parts.push(`## Examples\n${examples}`);
  parts.push(`## Request\n${formatInputs(inputs)}`);
  parts.push('Return ONLY valid JSON. No markdown fences. No explanation. No text before or after.');
  return parts.join('\n\n');
}

function formatContext(ctx) {
  return [
    ['Platform',        ctx.platform],
    ['Client',          ctx.client_name],
    ['Country',         ctx.country],
    ['Industry',        ctx.industry],
    ['Company Size',    ctx.company_size],
    ['Language',        ctx.language],
    ['Tone',            ctx.tone],
    ['Target Audience', ctx.target_audience],
  ].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
}

function formatInputs(inputs) {
  return [
    ['Job Title',           inputs.title],
    ['Industry',            inputs.industry],
    ['Required Skills',     Array.isArray(inputs.skills) ? inputs.skills.join(', ') : inputs.skills],
    ['Experience Required', inputs.experience_years ? `${inputs.experience_years} years` : null],
    ['Education',           inputs.education],
    ['Language',            inputs.language],
  ].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
}

module.exports = { build };
