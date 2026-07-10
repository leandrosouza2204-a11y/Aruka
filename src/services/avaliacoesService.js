import { buscarUsuarioLogado } from "./authSessionService";
import { avaliacaoParaPayload, rowParaAvaliacao } from "./avaliacoesMapper";
import { supabase } from "./supabase";

export async function buscarAvaliacoesSupabase() {
  const user = await buscarUsuarioLogado();
  const { data, error } = await supabase.from("avaliacoes").select("*")
    .eq("user_id", user.id).order("data_avaliacao", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data || []).map(rowParaAvaliacao);
}

export async function adicionarAvaliacaoSupabase(avaliacao) {
  const user = await buscarUsuarioLogado();
  const payload = avaliacaoParaPayload(avaliacao, user.id);
  const { data, error } = await supabase.from("avaliacoes").insert(payload).select().single();
  if (error) tratarErroPersistencia("insert", error, payload);
  return rowParaAvaliacao(data);
}

export async function atualizarAvaliacaoSupabase(id, avaliacao) {
  const user = await buscarUsuarioLogado();
  const payload = avaliacaoParaPayload(avaliacao, user.id);
  const { data, error } = await supabase.from("avaliacoes").update(payload)
    .eq("id", id).eq("user_id", user.id).select().single();
  if (error) tratarErroPersistencia("update", error, payload);
  return rowParaAvaliacao(data);
}

export async function excluirAvaliacaoSupabase(id) {
  const user = await buscarUsuarioLogado();
  const { error } = await supabase.from("avaliacoes").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw error;
  return id;
}

function tratarErroPersistencia(operacao, error, payload) {
  console.error("Erro ao persistir avaliação no Supabase:", {
    operacao, erro: formatarErroSupabase(error), payload: sanitizarPayloadParaLog(payload),
  });
  if (isErroSchemaAvaliacao(error)) {
    const erroSchema = new Error("O banco de dados não possui todas as colunas da avaliação. A operação foi cancelada para evitar perda parcial de dados.");
    erroSchema.code = "AVALIACAO_SCHEMA_INCOMPATIVEL";
    erroSchema.supabaseError = error;
    throw erroSchema;
  }
  throw error;
}

function isErroSchemaAvaliacao(error) {
  const texto = [error?.code, error?.message, error?.details, error?.hint].filter(Boolean).join(" ").toLowerCase();
  return texto.includes("pgrst204") || texto.includes("schema cache") || texto.includes("could not find") || texto.includes("column");
}

function sanitizarPayloadParaLog(payload) {
  return {
    possui_aluno_id: Boolean(payload.aluno_id),
    possui_data_avaliacao: Boolean(payload.data_avaliacao),
    campos_enviados: Object.keys(payload),
    campos_preenchidos: Object.entries(payload).filter(([, valor]) => valor !== null && valor !== "").map(([campo]) => campo),
  };
}

export function formatarErroSupabase(error) {
  if (!error) return null;
  const original = error.supabaseError || error;
  return { code: original.code || error.code, message: original.message || error.message, details: original.details, hint: original.hint };
}
