import assert from "node:assert/strict";
import test from "node:test";
import {
  limparQueryFiltrosAlunos,
  montarQueryAlunos,
  normalizarFiltrosAlunosDaUrl,
} from "./alunosQueryParams.js";

const planos = [
  { id: "plano-mensal", nome: "Mensal" },
  { id: "plano-trimestral", nome: "Trimestral" },
];

test("normaliza filtros sem parametros", () => {
  assert.deepEqual(normalizarFiltrosAlunosDaUrl("", planos), {
    busca: "",
    status: "todos",
    plano: "todos",
  });
});

test("normaliza busca, status e plano validos", () => {
  assert.deepEqual(
    normalizarFiltrosAlunosDaUrl(
      "busca=maria&status=Ativo&plano=plano-mensal",
      planos
    ),
    {
      busca: "maria",
      status: "Ativo",
      plano: "plano-mensal",
    }
  );
});

test("mantem compatibilidade com links do Dashboard", () => {
  assert.equal(
    normalizarFiltrosAlunosDaUrl("status=Vencido", planos).status,
    "Vencido"
  );
  assert.equal(
    normalizarFiltrosAlunosDaUrl("status=Vencendo", planos).status,
    "Vencendo"
  );
});

test("ignora status e plano invalidos", () => {
  assert.deepEqual(
    normalizarFiltrosAlunosDaUrl("status=Invalido&plano=desconhecido", planos),
    {
      busca: "",
      status: "todos",
      plano: "todos",
    }
  );
});

test("monta query preservando parametros desconhecidos", () => {
  const params = montarQueryAlunos("origem=dashboard", {
    busca: "ana",
    status: "Vencendo",
    plano: "plano-trimestral",
  });

  assert.equal(params.get("origem"), "dashboard");
  assert.equal(params.get("busca"), "ana");
  assert.equal(params.get("status"), "Vencendo");
  assert.equal(params.get("plano"), "plano-trimestral");
});

test("remove parametros vazios e filtros padrao", () => {
  const params = montarQueryAlunos("origem=dashboard&busca=ana&status=Ativo&plano=plano-mensal", {
    busca: "",
    status: "todos",
    plano: "todos",
  });

  assert.equal(params.toString(), "origem=dashboard");
});

test("limpar filtros remove somente parametros do modulo Alunos", () => {
  const params = limparQueryFiltrosAlunos(
    "origem=dashboard&busca=ana&status=Vencido&plano=plano-mensal"
  );

  assert.equal(params.toString(), "origem=dashboard");
});
