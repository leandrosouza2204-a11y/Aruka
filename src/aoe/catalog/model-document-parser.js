function strip(value) {
  return String(value ?? "").replace(/`/g, "").replace(/\*\*/g, "").trim();
}

function parseInlineHeader(markdown) {
  const result = {};
  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^\*\*([^:*]+):\*\*\s*(.+?)(?:\s{2,})?$/);
    if (match) result[strip(match[1])] = strip(match[2]);
  }
  return result;
}

function parseMetadataTable(markdown) {
  const section = markdown.match(/##\s+Metadados([\s\S]*?)(?:\n##\s+|$)/i)?.[1] ?? "";
  const result = {};
  for (const line of section.split(/\r?\n/)) {
    if (!/^\s*\|/.test(line) || /---/.test(line) || /Campo/i.test(line)) continue;
    const cells = line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(strip);
    if (cells.length >= 2) result[cells[0]] = cells[1];
  }
  return result;
}

function parseTags(markdown) {
  const tagSection = markdown.match(/##\s+Tags([\s\S]*?)(?:\n##\s+|$)/i)?.[1] ?? "";
  const fromSection = tagSection.match(/`([^`]+)`/g)?.map((tag) => strip(tag)) ?? [];
  const fromLines = tagSection.split(/\r?\n/).filter((line) => /^\s*-/.test(line)).map((line) => strip(line.replace(/^\s*-\s*/, "")));
  return [...new Set([...fromSection, ...fromLines])].filter(Boolean).sort();
}

export function parseModelDocument(markdown) {
  const title = strip(markdown.match(/^#\s+(.+)$/m)?.[1] ?? "");
  const header = parseInlineHeader(markdown);
  const metadata = parseMetadataTable(markdown);
  return {
    title,
    header,
    metadata,
    tags: parseTags(markdown),
    raw: markdown,
  };
}
