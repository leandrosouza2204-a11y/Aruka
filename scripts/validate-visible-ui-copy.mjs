import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const trackedFiles = execFileSync("git", ["ls-files", "src", "public", "package.json"], {
  encoding: "utf8",
})
  .trim()
  .split(/\r?\n/)
  .filter(Boolean);

const excluded = [
  /^src\/aoe\//,
  /\.(png|jpe?g|gif|webp|ico|svg|woff2?|ttf|eot)$/i,
];

const mojibakePatterns = [
  { name: "double-encoded UTF-8", pattern: /Ãƒ|Ã‚|Ã¢â‚¬|Ã¢â€|ï¿½/ },
  { name: "common Portuguese mojibake", pattern: /(?:Ã[§£©ª­³µº¼¡¢]|Â[ºª]|â€™|â€œ|â€)/ },
];

const visibleCopyRegressions = [
  { name: "unaccented voce", pattern: /\bVoce\b/ },
  { name: "unaccented avaliacao label", pattern: /\b(?:Nova|Sem|Nenhuma|Erro ao salvar|Erro ao excluir) avaliacao\b/i },
  { name: "unaccented action copy", pattern: /\bproxima acao\b/i },
  { name: "unaccented loading impossibility", pattern: /\bNao foi possivel\b/i },
  { name: "unaccented not informed", pattern: /\bNao informado\b/i },
];

const allowUnaccentedCopy = new Set([
  "src/features/alunos/utils/alunosCadastroValidacoes.test.js",
  "src/features/alunos/utils/alunosContextNavigation.test.js",
  "src/features/alunos/utils/alunosQueryParams.test.js",
]);

const failures = [];

for (const file of trackedFiles) {
  if (excluded.some((rule) => rule.test(file))) continue;

  const source = readFileSync(file, "utf8");

  for (const { name, pattern } of mojibakePatterns) {
    collectMatches({ failures, file, name, pattern, source });
  }

  if (!allowUnaccentedCopy.has(file)) {
    for (const { name, pattern } of visibleCopyRegressions) {
      collectMatches({ failures, file, name, pattern, source });
    }
  }
}

assert.doesNotMatch("Treino concluído", mojibakePatterns[0].pattern);
assert.doesNotMatch("Você", mojibakePatterns[0].pattern);
assert.doesNotMatch("revisão", mojibakePatterns[0].pattern);
assert.match("Treino concluÃƒÂ­do", mojibakePatterns[0].pattern);
assert.match("VocÃƒÂª", mojibakePatterns[0].pattern);
assert.match("revisÃƒÂ£o", mojibakePatterns[0].pattern);

if (failures.length > 0) {
  console.error("Visible UI copy validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("PASS visible UI copy has no known mojibake regressions.");

function collectMatches({ failures, file, name, pattern, source }) {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const globalPattern = new RegExp(pattern.source, flags);

  for (const match of source.matchAll(globalPattern)) {
    const line = source.slice(0, match.index).split(/\r?\n/).length;
    const snippet = source
      .split(/\r?\n/)
      [line - 1].trim()
      .slice(0, 140);
    failures.push(`${file}:${line} ${name}: ${snippet}`);
  }
}
