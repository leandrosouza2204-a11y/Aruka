import { buscarUsuarioLogado } from "./authSessionService";
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
    throw erroColunasParcelamento();
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
    throw erroColunasParcelamento();
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

function rowParaPlano(row) {
  const permiteParcelamento = normalizarBoolean(
    row.permite_parcelamento ?? row.permiteParcelamento ?? false
  );
  const quantidadeParcelas = permiteParcelamento
    ? Math.max(Number(row.quantidade_parcelas ?? row.quantidadeParcelas ?? 1), 2)
    : 1;
  const valor = Number(row.valor || 0);
  const valorParcelaSalvo = Number(row.valor_parcela ?? row.valorParcela ?? 0);
  const valorParcelaCalculado =
    permiteParcelamento && quantidadeParcelas > 0 ? valor / quantidadeParcelas : 0;

  return {
    id: row.id,
    userId: row.user_id,
    nome: row.nome || "",
    descricao: row.descricao || "",
    duracaoMeses: Number(row.duracao_meses || 1),
    valor,
    permiteParcelamento,
    quantidadeParcelas,
    valorParcela: permiteParcelamento
      ? valorParcelaSalvo || valorParcelaCalculado
      : 0,
    intervaloParcelasMeses: permiteParcelamento
      ? Math.max(Number(row.intervalo_parcelas_meses ?? row.intervaloParcelasMeses ?? 1), 1)
      : 1,
    ativo: row.ativo ?? true,
    createdAt: row.created_at || "",
  };
}

function planoParaPayload(plano, userId) {
  const permiteParcelamento = normalizarBoolean(
    plano.permiteParcelamento ?? plano.permite_parcelamento ?? false
  );
  const valor = Number(plano.valor || 0);
  const quantidadeParcelas = permiteParcelamento
    ? Math.max(Number(plano.quantidadeParcelas ?? plano.quantidade_parcelas ?? 2), 2)
    : 1;
  const valorParcelaInformado = Number(plano.valorParcela ?? plano.valor_parcela ?? 0);
  const valorParcela =
    permiteParcelamento && valorParcelaInformado > 0
      ? valorParcelaInformado
      : permiteParcelamento
        ? valor / quantidadeParcelas
        : 0;

  return {
    user_id: userId,
    nome: plano.nome || "",
    descricao: plano.descricao || "",
    duracao_meses: Number(plano.duracaoMeses || 1),
    valor,
    permite_parcelamento: permiteParcelamento,
    quantidade_parcelas: quantidadeParcelas,
    valor_parcela: Number(valorParcela.toFixed(2)),
    intervalo_parcelas_meses: permiteParcelamento
      ? Math.max(Number(plano.intervaloParcelasMeses ?? plano.intervalo_parcelas_meses ?? 1), 1)
      : 1,
    ativo: Boolean(plano.ativo),
  };
}

function erroSchemaCache(error) {
  return (
    error?.code === "PGRST204" ||
    String(error?.message || "").includes("schema cache")
  );
}

function erroColunasParcelamento() {
  return new Error(
    "As colunas de parcelamento ainda não estão disponíveis no Supabase. Aplique o SQL de supabase/planos.sql e recarregue o schema cache antes de salvar planos parcelados."
  );
}

function normalizarBoolean(valor) {
  if (typeof valor === "boolean") return valor;
  if (typeof valor === "number") return valor === 1;
  if (typeof valor === "string") {
    return ["true", "1", "sim", "s", "yes"].includes(valor.trim().toLowerCase());
  }

  return Boolean(valor);
}
