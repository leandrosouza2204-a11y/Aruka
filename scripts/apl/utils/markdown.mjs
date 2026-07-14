export function normalize(markdown) {
  return String(markdown ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, "  ")
    .trim();
}

export function removeCodeBlocks(markdown) {
  return normalize(markdown).replace(/```[\s\S]*?```/g, "");
}

export function extractHeadings(markdown) {
  return normalize(markdown)
    .split("\n")
    .map((line, index) => {
      const match = /^(#{1,6})\s+(.+)$/.exec(line.trim());
      if (!match) return null;
      return {
        level: match[1].length,
        text: match[2].trim(),
        line: index + 1,
      };
    })
    .filter(Boolean);
}

export function countWords(markdown) {
  const text = removeCodeBlocks(markdown).replace(/[^\p{L}\p{N}\s-]/gu, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

export function countTables(markdown) {
  const lines = normalize(markdown).split("\n");
  return lines.filter((line) => /^\s*\|(.+\|)+\s*$/.test(line)).length;
}

export function contains(markdown, text) {
  return normalize(markdown).toLowerCase().includes(String(text ?? "").toLowerCase());
}

export function hasSection(markdown, sectionTitle) {
  const expected = String(sectionTitle ?? "").trim().toLowerCase();
  return extractHeadings(markdown).some((heading) => heading.text.toLowerCase() === expected);
}
