import { calcularStatus, dataHojeISO } from "../data/alunosUtils";
import { atualizarAlunoSupabase, buscarAlunosSupabase } from "./alunosService";
import { buscarPlanosSupabase } from "./planosService";
import { supabase } from "./supabase";

export async function buscarPagamentosSupabase() {
  return buscarPagamentosDoUsuario();
}

export async function buscarPagamentosDoUsuario() {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("pagamentos")
    .select("*")
    .eq("user_id", user.id)
    .order("data_pagamento", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(rowParaPagamento);
}

export async function buscarPagamentosPorAluno(alunoId) {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("pagamentos")
    .select("*")
    .eq("user_id", user.id)
    .eq("aluno_id", alunoId)
    .order("data_pagamento", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(rowParaPagamento);
}

export async function adicionarPagamentoSupabase(pagamento) {
  const user = await buscarUsuarioLogado();
  const payload = pagamentoParaPayload(pagamento, user.id);

  let { data, error } = await supabase
    .from("pagamentos")
    .insert(payload)
    .select()
    .single();

  if (erroSchemaCache(error)) {
    const payloadCompativel = pagamentoParaPayloadLegado(payload);
    const resultado = await supabase
      .from("pagamentos")
      .insert(payloadCompativel)
      .select()
      .single();

    data = resultado.data;
    error = resultado.error;
  }

  if (error) throw error;

  return rowParaPagamento(data);
}

export async function registrarPagamento(aluno, dadosPagamento, plano = null) {
  const vencimentoAnterior = aluno.vencimento || "";
  const tipoMovimento =
    dadosPagamento.tipoMovimento || inferirTipoMovimento(aluno, dadosPagamento, plano);
  const vencimentoParcela =
    dadosPagamento.vencimentoParcela ||
    calcularVencimentoParcela(aluno, dadosPagamento.parcela, dadosPagamento.totalParcelas);
  const renovacao =
    tipoMovimento === "renovacao_plano"
      ? calcularRenovacaoPagamento({
          aluno,
          plano,
          dataPagamento: dadosPagamento.dataPagamento,
        })
      : null;

  const pagamento = await adicionarPagamentoSupabase({
    ...dadosPagamento,
    alunoId: aluno.id,
    plano: dadosPagamento.plano || plano?.nome || aluno.plano || "",
    tipoMovimento,
    vencimentoParcela,
    vencimentoAnterior,
    vencimentoNovo: renovacao?.vencimento || vencimentoAnterior,
  });

  if (tipoMovimento !== "renovacao_plano") {
    return { pagamento, aluno };
  }

  const alunoAtualizado = await atualizarAlunoSupabase(aluno.id, {
    ...aluno,
    ...renovacao,
    pagamentoRecebido: true,
    dataPagamento: dadosPagamento.dataPagamento,
    status: calcularStatus(renovacao.vencimento, aluno.plano),
  });

  return { pagamento, aluno: alunoAtualizado };
}

export async function desfazerUltimoPagamento(alunoId) {
  const [alunos, pagamentos] = await Promise.all([
    buscarAlunosSupabase(),
    buscarPagamentosPorAluno(alunoId),
  ]);
  const aluno = alunos.find((item) => item.id === alunoId);
  const pagamentosPorRegistro = ordenarPorRegistro(pagamentos);
  const ultimoPagamento = pagamentosPorRegistro[0];

  if (!aluno) throw new Error("Aluno não encontrado.");
  if (!ultimoPagamento) throw new Error("Nenhum pagamento encontrado para desfazer.");

  await excluirPagamentoSupabase(ultimoPagamento.id);

  if (!pagamentoAlteraVencimento(ultimoPagamento)) {
    return {
      aluno,
      pagamentoDesfeito: ultimoPagamento,
      pagamentosRestantes: pagamentos.filter(
        (pagamento) => pagamento.id !== ultimoPagamento.id
      ),
    };
  }

  const pagamentosRestantes = pagamentos.filter(
    (pagamento) => pagamento.id !== ultimoPagamento.id
  );
  const pagamentoAnterior = ordenarPorRegistro(pagamentosRestantes)[0] || null;
  const vencimentoRestaurado =
    ultimoPagamento.vencimentoAnterior || pagamentoAnterior?.vencimentoNovo || aluno.vencimento;
  const datasRestauradas = vencimentoRestaurado
    ? montarDatasAviso(vencimentoRestaurado)
    : { vencimento: "", aviso7: "", aviso1: "" };

  const alunoAtualizado = await atualizarAlunoSupabase(aluno.id, {
    ...aluno,
    ...datasRestauradas,
    pagamentoRecebido: Boolean(pagamentoAnterior),
    dataPagamento: pagamentoAnterior?.dataPagamento || "",
    status: calcularStatus(datasRestauradas.vencimento, aluno.plano),
  });

  return {
    aluno: alunoAtualizado,
    pagamentoDesfeito: ultimoPagamento,
    pagamentosRestantes,
  };
}

export async function excluirPagamentoSupabase(id) {
  const user = await buscarUsuarioLogado();

  const { error } = await supabase
    .from("pagamentos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  return id;
}

export async function calcularResumoFinanceiroAluno(alunoId) {
  const [alunos, pagamentos, planos] = await Promise.all([
    buscarAlunosSupabase(),
    buscarPagamentosPorAluno(alunoId),
    buscarPlanosSupabase(),
  ]);
  const aluno = alunos.find((item) => item.id === alunoId);

  if (!aluno) throw new Error("Aluno não encontrado.");

  return montarResumoFinanceiroAluno(
    aluno,
    pagamentos,
    planos.find((plano) => plano.id === aluno.plano)
  );
}

export async function calcularRankingFinanceiroAlunos() {
  const [alunos, pagamentos, planos] = await Promise.all([
    buscarAlunosSupabase(),
    buscarPagamentosDoUsuario(),
    buscarPlanosSupabase(),
  ]);

  return montarRankingFinanceiroAlunos(alunos, pagamentos, planos);
}

export function montarResumoFinanceiroAluno(aluno, pagamentos = [], plano = null) {
  const pagamentosOrdenados = ordenarPagamentos(pagamentos);
  const totalPago = pagamentosOrdenados.reduce(
    (total, pagamento) => total + Number(pagamento.valor || 0),
    0
  );
  const quantidadePagamentos = pagamentosOrdenados.length;
  const ultimoPagamento = pagamentosOrdenados[0] || null;

  return {
    aluno,
    nomeAluno: aluno.nome,
    dataInicio: aluno.inicio || "",
    tempoConsultoriaMeses: calcularMesesEntre(aluno.inicio, dataHojeISO()),
    totalPago,
    quantidadePagamentos,
    ticketMedio: quantidadePagamentos ? totalPago / quantidadePagamentos : 0,
    planoAtual: plano?.nome || aluno.plano || "-",
    ultimoPagamento,
    proximoVencimento: aluno.vencimento || "",
    recorrenteEmDia: quantidadePagamentos >= 2 && !["Atrasado", "Parcela atrasada"].includes(aluno.status),
  };
}

export function montarRankingFinanceiroAlunos(alunos = [], pagamentos = [], planos = []) {
  const resumos = alunos.map((aluno) =>
    montarResumoFinanceiroAluno(
      aluno,
      pagamentos.filter((pagamento) => pagamento.alunoId === aluno.id),
      planos.find((plano) => plano.id === aluno.plano)
    )
  );

  return {
    porTotalPago: [...resumos].sort((a, b) => b.totalPago - a.totalPago),
    porTempoConsultoria: [...resumos].sort(
      (a, b) => b.tempoConsultoriaMeses - a.tempoConsultoriaMeses
    ),
    porQuantidadePagamentos: [...resumos].sort(
      (a, b) => b.quantidadePagamentos - a.quantidadePagamentos
    ),
    recorrentesEmDia: resumos.filter((resumo) => resumo.recorrenteEmDia),
    resumos,
  };
}

async function buscarUsuarioLogado() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Usuário não autenticado.");

  return user;
}

function rowParaPagamento(row) {
  return {
    id: row.id,
    userId: row.user_id,
    alunoId: row.aluno_id,
    plano: row.plano || "",
    dataPagamento: row.data_pagamento || "",
    valor: Number(row.valor || 0),
    formaPagamento: row.forma_pagamento || "",
    parcela: String(row.parcela || "1"),
    totalParcelas: Number(row.total_parcelas || 1),
    tipoMovimento: row.tipo_movimento || "",
    vencimentoParcela: row.vencimento_parcela || "",
    vencimentoAnterior: row.vencimento_anterior || "",
    vencimentoNovo: row.vencimento_novo || "",
    observacao: row.observacao || row.observacoes || "",
    observacoes: row.observacao || row.observacoes || "",
    createdAt: row.created_at || "",
  };
}

function pagamentoParaPayload(pagamento, userId) {
  const observacao = pagamento.observacao ?? pagamento.observacoes ?? "";

  return {
    user_id: userId,
    aluno_id: pagamento.alunoId,
    plano: pagamento.plano || "",
    data_pagamento: pagamento.dataPagamento,
    valor: Number(pagamento.valor || 0),
    forma_pagamento: pagamento.formaPagamento || "",
    parcela: String(pagamento.parcela || "1"),
    total_parcelas: Number(pagamento.totalParcelas || 1),
    tipo_movimento: pagamento.tipoMovimento || "pagamento_avulso",
    vencimento_parcela: dataOuNull(pagamento.vencimentoParcela),
    vencimento_anterior: dataOuNull(pagamento.vencimentoAnterior),
    vencimento_novo: dataOuNull(pagamento.vencimentoNovo),
    observacao,
    observacoes: observacao,
  };
}

function pagamentoParaPayloadLegado(payload) {
  const legado = { ...payload };

  delete legado.plano;
  delete legado.tipo_movimento;
  delete legado.vencimento_parcela;
  delete legado.vencimento_anterior;
  delete legado.vencimento_novo;
  delete legado.observacao;

  return legado;
}

function erroSchemaCache(error) {
  return (
    error?.code === "PGRST204" ||
    String(error?.message || "").includes("schema cache")
  );
}

function calcularRenovacaoPagamento({ aluno, plano, dataPagamento }) {
  const mesesRenovacao = calcularMesesRenovacao(aluno, plano);
  const dataBase = aluno.vencimento || dataPagamento || aluno.inicio || dataHojeISO();
  const vencimento = adicionarMesesISO(dataBase, mesesRenovacao);

  return montarDatasAviso(vencimento);
}

function inferirTipoMovimento(aluno, pagamento, plano) {
  if (ehPlanoParcelado(aluno, plano, pagamento.totalParcelas)) {
    return "pagamento_parcela";
  }

  if (calcularMesesRenovacao(aluno, plano) <= 1) {
    return "renovacao_plano";
  }

  return "pagamento_avulso";
}

function ehPlanoParcelado(aluno, plano, totalParcelas = 1) {
  if (plano?.permiteParcelamento) return true;
  if (Number(totalParcelas || 1) > 1) return true;
  if (aluno.plano === "trimestralParcelado") return true;

  return false;
}

function calcularVencimentoParcela(aluno, parcela, totalParcelas) {
  if (!ehPlanoParcelado(aluno, null, totalParcelas) || !aluno.inicio) return "";

  const numeroParcela = Math.max(Number(parcela || 1), 1);

  return adicionarMesesISO(aluno.inicio, numeroParcela - 1);
}

function pagamentoAlteraVencimento(pagamento) {
  if (pagamento.tipoMovimento) return pagamento.tipoMovimento === "renovacao_plano";

  return (
    pagamento.vencimentoNovo &&
    pagamento.vencimentoAnterior &&
    pagamento.vencimentoNovo !== pagamento.vencimentoAnterior
  );
}

function calcularMesesRenovacao(aluno, plano) {
  if (plano?.duracaoMeses) return Math.max(Number(plano.duracaoMeses || 1), 1);
  if (aluno.plano === "trimestralParcelado") return 3;

  const textoPlano = `${aluno.plano || ""} ${plano?.nome || ""}`.toLowerCase();

  if (textoPlano.includes("semestral")) return 6;
  if (textoPlano.includes("trimestral")) return 3;

  return 1;
}

function adicionarMesesISO(dataISO, meses) {
  const data = new Date(`${dataISO}T00:00:00`);
  const diaOriginal = data.getDate();

  data.setMonth(data.getMonth() + Number(meses || 1));

  if (data.getDate() !== diaOriginal) {
    data.setDate(0);
  }

  return data.toISOString().split("T")[0];
}

function montarDatasAviso(vencimento) {
  const aviso7 = new Date(`${vencimento}T00:00:00`);
  aviso7.setDate(aviso7.getDate() - 7);

  const aviso1 = new Date(`${vencimento}T00:00:00`);
  aviso1.setDate(aviso1.getDate() - 1);

  return {
    vencimento,
    aviso7: aviso7.toISOString().split("T")[0],
    aviso1: aviso1.toISOString().split("T")[0],
  };
}

function ordenarPagamentos(pagamentos) {
  return [...pagamentos].sort((a, b) => {
    const data = String(b.dataPagamento).localeCompare(String(a.dataPagamento));
    if (data !== 0) return data;

    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
}

function ordenarPorRegistro(pagamentos) {
  return [...pagamentos].sort((a, b) => {
    const criado = String(b.createdAt).localeCompare(String(a.createdAt));
    if (criado !== 0) return criado;

    return String(b.dataPagamento).localeCompare(String(a.dataPagamento));
  });
}

function calcularMesesEntre(inicio, fim) {
  if (!inicio || !fim) return 0;

  const dataInicio = new Date(`${inicio}T00:00:00`);
  const dataFim = new Date(`${fim}T00:00:00`);
  let meses =
    (dataFim.getFullYear() - dataInicio.getFullYear()) * 12 +
    dataFim.getMonth() -
    dataInicio.getMonth();

  if (dataFim.getDate() < dataInicio.getDate()) {
    meses -= 1;
  }

  return Math.max(meses, 0);
}

function dataOuNull(data) {
  return data || null;
}
