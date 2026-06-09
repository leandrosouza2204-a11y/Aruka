import { supabase } from "./supabase";

export async function buscarPagamentosSupabase() {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("pagamentos")
    .select("*")
    .eq("user_id", user.id)
    .order("data_pagamento", { ascending: false });

  if (error) throw error;

  return (data || []).map(rowParaPagamento);
}

export async function adicionarPagamentoSupabase(pagamento) {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("pagamentos")
    .insert(pagamentoParaPayload(pagamento, user.id))
    .select()
    .single();

  if (error) throw error;

  return rowParaPagamento(data);
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
    dataPagamento: row.data_pagamento || "",
    valor: Number(row.valor || 0),
    formaPagamento: row.forma_pagamento || "",
    parcela: Number(row.parcela || 1),
    totalParcelas: Number(row.total_parcelas || 1),
    observacoes: row.observacoes || "",
    createdAt: row.created_at || "",
  };
}

function pagamentoParaPayload(pagamento, userId) {
  return {
    user_id: userId,
    aluno_id: pagamento.alunoId,
    data_pagamento: pagamento.dataPagamento,
    valor: Number(pagamento.valor || 0),
    forma_pagamento: pagamento.formaPagamento || "",
    parcela: Number(pagamento.parcela || 1),
    total_parcelas: Number(pagamento.totalParcelas || 1),
    observacoes: pagamento.observacoes || "",
  };
}
