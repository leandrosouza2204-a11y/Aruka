import { supabase } from "./supabase";

export async function buscarAlunosSupabase() {
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

async function buscarUsuarioLogado() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Usuario nao autenticado.");

  return user;
}

function rowParaAluno(row) {
  return {
    id: row.id,
    userId: row.user_id,
    nome: row.nome || "",
    whatsapp: row.whatsapp || "",
    nascimento: row.nascimento || "",
    inicio: row.inicio || "",
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
}

function alunoParaPayload(aluno, userId) {
  return {
    user_id: userId,
    nome: aluno.nome,
    whatsapp: aluno.whatsapp,
    nascimento: dataOuNull(aluno.nascimento),
    inicio: dataOuNull(aluno.inicio),
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
}

function dataOuNull(data) {
  return data || null;
}
