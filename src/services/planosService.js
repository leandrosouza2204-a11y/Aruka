import { supabase } from "./supabase";

export async function buscarPlanosSupabase() {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("planos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(rowParaPlano);
}

export async function adicionarPlanoSupabase(plano) {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("planos")
    .insert(planoParaPayload(plano, user.id))
    .select()
    .single();

  if (error) throw error;

  return rowParaPlano(data);
}

export async function atualizarPlanoSupabase(id, plano) {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("planos")
    .update(planoParaPayload(plano, user.id))
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  return rowParaPlano(data);
}

export async function excluirPlanoSupabase(id) {
  const user = await buscarUsuarioLogado();

  const { error } = await supabase
    .from("planos")
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

function rowParaPlano(row) {
  return {
    id: row.id,
    userId: row.user_id,
    nome: row.nome || "",
    descricao: row.descricao || "",
    duracaoMeses: Number(row.duracao_meses || 1),
    valor: Number(row.valor || 0),
    ativo: row.ativo ?? true,
    createdAt: row.created_at || "",
  };
}

function planoParaPayload(plano, userId) {
  return {
    user_id: userId,
    nome: plano.nome || "",
    descricao: plano.descricao || "",
    duracao_meses: Number(plano.duracaoMeses || 1),
    valor: Number(plano.valor || 0),
    ativo: Boolean(plano.ativo),
  };
}
