import assert from "node:assert/strict";
import test from "node:test";
import {
  detectarDuplicidadeAluno,
  normalizarNomeAlunoParaComparacao,
  normalizarTelefoneAluno,
  validarCadastroAluno,
  validarWhatsAppAluno,
} from "./alunosCadastroValidacoes.js";

const alunos = [
  { id: "aluno-1", nome: "Maria Silva", whatsapp: "(11) 99999-0001" },
  { id: "aluno-2", nome: "João Souza", whatsapp: "11999990002" },
];

test("normaliza nome vazio e com espacos", () => {
  assert.equal(normalizarNomeAlunoParaComparacao("   "), "");
  assert.equal(normalizarNomeAlunoParaComparacao(" maria   silva "), "maria silva");
});

test("normaliza nome removendo caixa, acentos e caracteres invisiveis", () => {
  assert.equal(normalizarNomeAlunoParaComparacao("MARIA   SILVA"), "maria silva");
  assert.equal(normalizarNomeAlunoParaComparacao("João\u200BSouza"), "joaosouza");
  assert.equal(normalizarNomeAlunoParaComparacao("João Souza"), "joao souza");
  assert.equal(normalizarNomeAlunoParaComparacao("Joao Souza"), "joao souza");
});

test("normaliza telefone mantendo apenas digitos", () => {
  assert.equal(normalizarTelefoneAluno("(11) 99999-0001"), "11999990001");
});

test("valida WhatsApp vazio, incompleto, valido, formatado e zeros", () => {
  assert.equal(validarWhatsAppAluno("").valido, false);
  assert.equal(validarWhatsAppAluno("119999").valido, false);
  assert.equal(validarWhatsAppAluno("11999990001").valido, true);
  assert.equal(validarWhatsAppAluno("(11) 99999-0001").valido, true);
  assert.equal(validarWhatsAppAluno("00000000000").valido, false);
  assert.equal(validarWhatsAppAluno("11abc999990001").valido, false);
});

test("detecta duplicidade por telefone e por nome", () => {
  const duplicidadeTelefone = detectarDuplicidadeAluno(alunos, {
    nome: "Outra Pessoa",
    whatsapp: "11 99999-0001",
  });
  assert.equal(duplicidadeTelefone.whatsapp.id, "aluno-1");

  const duplicidadeNome = detectarDuplicidadeAluno(alunos, {
    nome: "joao souza",
    whatsapp: "11999990003",
  });
  assert.equal(duplicidadeNome.nome.id, "aluno-2");
});

test("edicao ignora o proprio id e detecta outro registro", () => {
  const proprio = detectarDuplicidadeAluno(
    alunos,
    { nome: "Maria Silva", whatsapp: "(11) 99999-0001" },
    "aluno-1"
  );
  assert.equal(proprio.nome, null);
  assert.equal(proprio.whatsapp, null);

  const outro = detectarDuplicidadeAluno(
    alunos,
    { nome: "Maria Silva", whatsapp: "(11) 99999-0001" },
    "aluno-2"
  );
  assert.equal(outro.nome.id, "aluno-1");
  assert.equal(outro.whatsapp.id, "aluno-1");
});

test("retorna erros inline associados aos campos obrigatorios e duplicados", () => {
  assert.deepEqual(
    validarCadastroAluno({ nome: "", whatsapp: "", inicio: "", plano: "" }, alunos),
    {
      nome: "Informe o nome do aluno.",
      whatsapp: "Informe o WhatsApp do aluno.",
      inicio: "Informe a data de inicio do plano.",
      plano: "Selecione o plano do aluno.",
    }
  );

  assert.deepEqual(
    validarCadastroAluno(
      { nome: " maria silva ", whatsapp: "11999990001", inicio: "2026-07-22", plano: "plano-1" },
      alunos
    ),
    {
      whatsapp: "Ja existe um aluno cadastrado com este WhatsApp.",
      nome: "Ja existe um aluno cadastrado com este nome.",
    }
  );
});
