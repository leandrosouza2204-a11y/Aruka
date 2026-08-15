import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";

export async function buscarContratosAlunoSupabase(alunoId) {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("aluno_contratos")
    .select("*")
    .eq("user_id", user.id)
    .eq("aluno_id", alunoId)
    .order("inicio", { ascending: true });

  if (error) throw error;

  return (data || []).map(rowParaContratoAluno);
}

export async function buscarContratosAlunosSupabase() {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("aluno_contratos")
    .select("*")
    .eq("user_id", user.id)
    .order("inicio", { ascending: true });

  if (error) throw error;

  return (data || []).map(rowParaContratoAluno);
}

export async function renovarAlunoContratoSupabase({
  alunoId,
  novoPlanoId,
  novoInicio,
  novoVencimento,
  novoValor,
  registrarPagamentoAgora = true,
  formaPagamento = "Pix",
  observacao = "",
  eventKey = "",
}) {
  const { data, error } = await supabase.rpc("renovar_aluno_contrato", {
    p_aluno_id: alunoId,
    p_novo_plano_id: novoPlanoId,
    p_novo_inicio: novoInicio,
    p_novo_vencimento: novoVencimento,
    p_novo_valor: Number(novoValor || 0),
    p_registrar_pagamento: Boolean(registrarPagamentoAgora),
    p_forma_pagamento: formaPagamento || "Pix",
    p_observacao: observacao || "",
    p_event_key: eventKey || null,
  });

  if (error) throw error;

  return data;
}

export function rowParaContratoAluno(row) {
  return {
    id: row.id,
    userId: row.user_id,
    alunoId: row.aluno_id,
    planoId: row.plano_id || "",
    planoNomeSnapshot: row.plano_nome_snapshot || "",
    inicio: row.inicio || "",
    vencimento: row.vencimento || "",
    valor: Number(row.valor || 0),
    status: row.status || "ativo",
    origem: row.origem || "",
    renovadoDeId: row.renovado_de_id || "",
    metadata: row.metadata || {},
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };
}
