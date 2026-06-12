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
  const payload = planoParaPayload(plano, user.id);

  let { data, error } = await supabase
    .from("planos")
    .insert(payload)
    .select()
    .single();

  if (erroSchemaCache(error)) {
    const resultado = await supabase
      .from("planos")
      .insert(planoParaPayloadLegado(payload))
      .select()
      .single();

    data = resultado.data;
    error = resultado.error;
  }

  if (error) throw error;

  return rowParaPlano(data);
}

export async function atualizarPlanoSupabase(id, plano) {
  const user = await buscarUsuarioLogado();
  const payload = planoParaPayload(plano, user.id);

  let { data, error } = await supabase
    .from("planos")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (erroSchemaCache(error)) {
    const resultado = await supabase
      .from("planos")
      .update(planoParaPayloadLegado(payload))
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    data = resultado.data;
    error = resultado.error;
  }

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
  const permiteParcelamento = row.permite_parcelamento ?? false;
  const quantidadeParcelas = Number(row.quantidade_parcelas || 1);
  const valor = Number(row.valor || 0);

  return {
    id: row.id,
    userId: row.user_id,
    nome: row.nome || "",
    descricao: row.descricao || "",
    duracaoMeses: Number(row.duracao_meses || 1),
    valor,
    permiteParcelamento,
    quantidadeParcelas,
    valorParcela: Number(
      row.valor_parcela || (permiteParcelamento && quantidadeParcelas > 0
        ? valor / quantidadeParcelas
        : 0)
    ),
    intervaloParcelasMeses: Number(row.intervalo_parcelas_meses || 1),
    ativo: row.ativo ?? true,
    createdAt: row.created_at || "",
  };
}

function planoParaPayload(plano, userId) {
  const permiteParcelamento = Boolean(plano.permiteParcelamento);
  const quantidadeParcelas = permiteParcelamento
    ? Math.max(Number(plano.quantidadeParcelas || 1), 1)
    : 1;

  return {
    user_id: userId,
    nome: plano.nome || "",
    descricao: plano.descricao || "",
    duracao_meses: Number(plano.duracaoMeses || 1),
    valor: Number(plano.valor || 0),
    permite_parcelamento: permiteParcelamento,
    quantidade_parcelas: quantidadeParcelas,
    valor_parcela: permiteParcelamento ? Number(plano.valorParcela || 0) : 0,
    intervalo_parcelas_meses: permiteParcelamento
      ? Number(plano.intervaloParcelasMeses || 1)
      : 1,
    ativo: Boolean(plano.ativo),
  };
}

function planoParaPayloadLegado(payload) {
  const legado = { ...payload };

  delete legado.permite_parcelamento;
  delete legado.quantidade_parcelas;
  delete legado.valor_parcela;
  delete legado.intervalo_parcelas_meses;

  return legado;
}

function erroSchemaCache(error) {
  return (
    error?.code === "PGRST204" ||
    String(error?.message || "").includes("schema cache")
  );
}
