import assert from "node:assert/strict";
import { gerarLinkWhatsApp } from "../src/services/whatsappService.js";
import { montarMensagemVencimento } from "../src/features/financeiro/utils/financeWhatsAppMessages.js";

const MOJIBAKE_PATTERNS = [/Ãƒ/u, /Ã‚/u, /Ã¢â‚¬/u, /Ã°Å¸/u, /Ã¯Â¸/u, /ï¿½/u];

function registroFinanceiro({ nome, vencimento, totalParcelas = 1, vencimentoParcelaAtual = "" }) {
  return {
    aluno: {
      nome,
      vencimento,
      whatsapp: "11999998888",
    },
    totalParcelas,
    vencimentoParcelaAtual,
  };
}

function assertSemMojibake(texto) {
  for (const pattern of MOJIBAKE_PATTERNS) {
    assert.equal(pattern.test(texto), false, `Mensagem contem mojibake: ${pattern}`);
  }
}

function assertRoundTrip(mensagem) {
  const url = gerarLinkWhatsApp("11999998888", mensagem);
  const decoded = new URL(url).searchParams.get("text");

  assert.equal(decoded, mensagem);
}

function assertContratoMensagem(mensagem) {
  assertSemMojibake(mensagem);
  assertRoundTrip(mensagem);
  assert.match(mensagem, /Olá,/u);
  assert.match(mensagem, /será|pendente|Hoje é/u);
  assert.match(mensagem, /necessário|assim que possível|renovação/u);
  assert.match(mensagem, /evolução|pendente/u);
  assert.match(mensagem, /[😊📲💪✅⚠️🚨⏰📅]/u);
  assert.match(mensagem, /\*[^*]+\*/u);
  assert.match(mensagem, /\n\n/u);
}

const vencimentoProximo = montarMensagemVencimento(
  registroFinanceiro({
    nome: "Sarah Almeida",
    vencimento: "2026-09-17",
  })
);

assertContratoMensagem(vencimentoProximo);
assert.match(vencimentoProximo, /Lembrete de vencimento da consultoria/u);
assert.match(vencimentoProximo, /Olá, \*Sarah\*!/u);
assert.match(vencimentoProximo, /será em \*26 dias\*/u);
assert.match(vencimentoProximo, /17\/09\/2026/u);
assert.match(vencimentoProximo, /Ajustes sempre que necessário/u);
assert.match(vencimentoProximo, /Acompanhamento da sua evolução/u);

const vencimentoPendente = montarMensagemVencimento(
  registroFinanceiro({
    nome: "Adriano Silva",
    vencimento: "2026-06-30",
  })
);

assertContratoMensagem(vencimentoPendente);
assert.match(vencimentoPendente, /Consultoria com vencimento pendente/u);
assert.match(vencimentoPendente, /Olá, \*Adriano\*!/u);
assert.match(vencimentoPendente, /30\/06\/2026/u);
assert.match(vencimentoPendente, /pendente/u);
assert.match(vencimentoPendente, /peço que realize o pagamento/u);

const vencimentoHoje = montarMensagemVencimento(
  registroFinanceiro({
    nome: "Marina",
    vencimento: "2026-08-22",
  })
);

assertContratoMensagem(vencimentoHoje);
assert.match(vencimentoHoje, /Hoje é a data de vencimento/u);
assert.match(vencimentoHoje, /renovação do plano/u);

const vencimentoAmanha = montarMensagemVencimento(
  registroFinanceiro({
    nome: "Bruno",
    vencimento: "2026-08-23",
  })
);

assertContratoMensagem(vencimentoAmanha);
assert.match(vencimentoAmanha, /será \*amanhã\*/u);
assert.match(vencimentoAmanha, /Peço que realize o pagamento até/u);

const mensagens = [vencimentoProximo, vencimentoPendente, vencimentoHoje, vencimentoAmanha];
const mojibakeCount = mensagens.reduce(
  (total, mensagem) => total + MOJIBAKE_PATTERNS.filter((pattern) => pattern.test(mensagem)).length,
  0
);

assert.equal(mojibakeCount, 0);

console.log("WHATSAPP_MESSAGE_ROUNDTRIP=PASS");
console.log("FINANCE_WHATSAPP_MOJIBAKE_COUNT=0");
console.log("UPCOMING_DUE_MESSAGE=PASS");
console.log("PENDING_DUE_MESSAGE=PASS");
console.log("EMOJI_PRESERVATION=PASS");
console.log("ACCENTS_PRESERVATION=PASS");
console.log("MARKDOWN_PRESERVATION=PASS");
console.log("LINE_BREAK_PRESERVATION=PASS");
