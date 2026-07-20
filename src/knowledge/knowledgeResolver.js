const markdownProvider = require('./providers/markdownProvider');

async function resolve(sources) {
  if (!sources || sources.length === 0) return { combined: '', sources: [] };

  const results = await Promise.all(
    sources.map(async (source) => {
      const result = await markdownProvider.get(source);
      return { domain: source.domain, path: result.metadata.path, content: result.content, found: result.metadata.found };
    })
  );

  const combined = results
    .filter(r => r.found && r.content)
    .map(r => r.content)
    .join('\n\n---\n\n');

  return { combined, sources: results };
}

module.exports = { resolve };
