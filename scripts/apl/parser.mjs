import path from "node:path";
import { buildDocumentContext, classifyDocument } from "./document-context.mjs";
import { read } from "./utils/files.mjs";
import { countTables, countWords, extractHeadings, normalize } from "./utils/markdown.mjs";

function extractSections(markdown, headings) {
  const lines = normalize(markdown).split("\n");
  return headings.map((heading, index) => {
    const next = headings[index + 1];
    const start = heading.line;
    const end = next ? next.line - 2 : lines.length;

    return {
      title: heading.text,
      level: heading.level,
      line: heading.line,
      content: lines.slice(start, end).join("\n").trim(),
    };
  });
}

function extractCodeBlocks(markdown) {
  const blocks = [];
  const pattern = /```(\w+)?\n([\s\S]*?)```/g;
  let match;

  while ((match = pattern.exec(markdown)) !== null) {
    blocks.push({
      language: match[1] ?? "",
      content: match[2].trim(),
    });
  }

  return blocks;
}

export async function parseMarkdown(file) {
  const raw = await read(file);
  const normalized = normalize(raw);
  const headings = extractHeadings(normalized);
  const title = headings.find((heading) => heading.level === 1)?.text ?? path.basename(file, ".md");

  const parsed = {
    file,
    title,
    headings,
    sections: extractSections(normalized, headings),
    tables: countTables(normalized),
    codeBlocks: extractCodeBlocks(normalized),
    raw,
    normalized,
    metadata: {
      wordCount: countWords(normalized),
      extension: path.extname(file),
      documentType: classifyDocument(file),
    },
  };
  return {
    ...parsed,
    context: buildDocumentContext(parsed),
  };
}
