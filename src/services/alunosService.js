import { dataOuNull } from "../data/formatters";
import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";

export async function buscarAlunosSupabase() {
  falharAlunosLocalQa("load");
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("alunos")
    .select("*")
    .eq("user_id", user.id)
    .order("vencimento", { ascending: true, nullsFirst: false });

  if (error) throw error;

  return (data || []).map(rowParaAluno);
}

export async function adicionarAlunoSupabase(aluno) {
  falharAlunosLocalQa("save");
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("alunos")
    .insert(alunoParaPayload(aluno, user.id))
    .select()
    .single();

  if (error) throw error;

  return rowParaAluno(data);
}

export async function atualizarAlunoSupabase(id, aluno) {
  falharAlunosLocalQa("save");
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("alunos")
    .update(alunoParaPayload(aluno, user.id))
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  return rowParaAluno(data);
}

export async function excluirAlunoSupabase(id) {
  const user = await buscarUsuarioLogado();

  const { error } = await supabase
    .from("alunos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  return id;
}

function rowParaAluno(row) {
  const aluno = {
    id: row.id,
    userId: row.user_id,
    nome: row.nome || "",
    whatsapp: row.whatsapp || "",
    nascimento: row.nascimento || "",
    inicio: row.inicio || "",
    consultoriaInicio: row.consultoria_inicio || "",
    consultoriaInicioConfianca: row.consultoria_inicio_confianca || (row.consultoria_inicio ? "EXACT" : "UNKNOWN"),
    vencimento: row.vencimento || "",
    aviso7: row.aviso7 || "",
    aviso1: row.aviso1 || "",
    plano: row.plano || "",
    valor: row.valor || "",
    status: row.status || "Ativo",
    pagamentoRecebido: row.pagamento_recebido ?? false,
    dataPagamento: row.data_pagamento || "",
    observacoes: row.observacoes || "",
    createdAt: row.created_at || "",
  };

  if (Object.prototype.hasOwnProperty.call(row, "acompanhamento_status")) {
    aluno.acompanhamentoStatus = row.acompanhamento_status || "ativo";
    aluno.acompanhamentoEncerradoEm = row.acompanhamento_encerrado_em || "";
    aluno.acompanhamentoMotivo = row.acompanhamento_motivo || "";
    if (Object.prototype.hasOwnProperty.call(row, "acompanhamento_motivo_detalhe")) {
      aluno.acompanhamentoMotivoDetalhe = row.acompanhamento_motivo_detalhe || "";
    }
  }

  return aluno;
}

function alunoParaPayload(aluno, userId) {
  const payload = {
    user_id: userId,
    nome: aluno.nome,
    whatsapp: aluno.whatsapp,
    nascimento: dataOuNull(aluno.nascimento),
    inicio: dataOuNull(aluno.inicio),
    consultoria_inicio: dataOuNull(aluno.consultoriaInicio),
    consultoria_inicio_confianca: aluno.consultoriaInicioConfianca || (aluno.consultoriaInicio ? "EXACT" : "UNKNOWN"),
    vencimento: dataOuNull(aluno.vencimento),
    aviso7: dataOuNull(aluno.aviso7),
    aviso1: dataOuNull(aluno.aviso1),
    plano: aluno.plano,
    valor: Number(aluno.valor || 0),
    status: aluno.status,
    pagamento_recebido: Boolean(aluno.pagamentoRecebido),
    data_pagamento: dataOuNull(aluno.dataPagamento),
    observacoes: aluno.observacoes || "",
  };

  if (Object.prototype.hasOwnProperty.call(aluno, "acompanhamentoStatus")) {
    payload.acompanhamento_status = aluno.acompanhamentoStatus || "ativo";
    payload.acompanhamento_encerrado_em = dataOuNull(aluno.acompanhamentoEncerradoEm);
    payload.acompanhamento_motivo = aluno.acompanhamentoMotivo || "";

    if (Object.prototype.hasOwnProperty.call(aluno, "acompanhamentoMotivoDetalhe")) {
      payload.acompanhamento_motivo_detalhe = aluno.acompanhamentoMotivoDetalhe || "";
    }
  }

  return payload;
}

function falharAlunosLocalQa(tipo) {
  if (typeof window === "undefined") return;
  if (!["localhost", "127.0.0.1"].includes(window.location.hostname)) return;
  if (window.localStorage?.getItem("ARUKA_QA_ALUNOS_FAIL") !== tipo) return;
  throw new Error("Falha controlada LOCAL_QA no modulo Alunos.");
}
