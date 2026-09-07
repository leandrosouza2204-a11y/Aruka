import { existsSync, readFileSync } from "node:fs";

const modal = existsSync("src/components/TreinoModal.jsx") ? readFileSync("src/components/TreinoModal.jsx", "utf8") : "";
const checks = [];

check("picker declara dialog modal nomeado", all(modal, [
  "role=\"dialog\"",
  "aria-modal=\"true\"",
  "aria-labelledby=\"workout-library-picker-title\"",
  "id=\"workout-library-picker-title\"",
]));
check("fechamento tem nome acessivel", all(modal, ["aria-label=\"Fechar biblioteca\"", "workout-library-picker-close"]));
check("filtros usam labels visiveis", all(modal, ["Buscar", "Origem", "Grupo", "Categoria", "Mídia"]));
check("icones decorativos ficam ocultos de leitores", all(modal, ["aria-hidden=\"true\""]));
check("estados de erro/loading/vazio ficam em texto", all(modal, ["Carregando biblioteca", "Nenhum exercício encontrado", "Tentar novamente"]));

for (const item of checks) console.log(`${item.ok ? "OK" : "FAIL"} ${item.name}`);
if (checks.some((item) => !item.ok)) process.exitCode = 1;

function check(name, ok) {
  checks.push({ name, ok: Boolean(ok) });
}

function all(text, markers) {
  return markers.every((marker) => text.includes(marker));
}
