import { supabase } from "./supabase";

const VERSAO_POLITICA = "1.0";
const VERSAO_TERMOS = "1.0";

export function obterVersoesLegaisAtuais() {
  return {
    politicaVersao: VERSAO_POLITICA,
    termosVersao: VERSAO_TERMOS,
  };
}

export async function buscarAceiteLegal() {
  const user = await buscarUsuarioLogado();
  const { politicaVersao, termosVersao } = obterVersoesLegaisAtuais();

  const { data, error } = await supabase
    .from("aceites_legais")
    .select("*")
    .eq("user_id", user.id)
    .eq("politica_versao", politicaVersao)
    .eq("termos_versao", termosVersao)
    .eq("politica_aceita", true)
    .eq("termos_aceitos", true)
    .order("aceito_em", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data ? rowParaAceite(data) : null;
}

export async function verificarAceiteLegal() {
  const aceite = await buscarAceiteLegal();
  return Boolean(aceite);
}

export async function registrarAceiteLegal({ userAgent } = {}) {
  const user = await buscarUsuarioLogado();
  const { politicaVersao, termosVersao } = obterVersoesLegaisAtuais();

  const { data, error } = await supabase
    .from("aceites_legais")
    .insert({
      user_id: user.id,
      politica_versao: politicaVersao,
      termos_versao: termosVersao,
      politica_aceita: true,
      termos_aceitos: true,
      aceito_em: new Date().toISOString(),
      ip: null,
      user_agent: userAgent || "",
    })
    .select()
    .single();

  if (error) throw error;

  return rowParaAceite(data);
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

function rowParaAceite(row) {
  return {
    id: row.id,
    userId: row.user_id,
    politicaVersao: row.politica_versao,
    termosVersao: row.termos_versao,
    politicaAceita: row.politica_aceita,
    termosAceitos: row.termos_aceitos,
    aceitoEm: row.aceito_em,
    ip: row.ip || "",
    userAgent: row.user_agent || "",
    createdAt: row.created_at,
  };
}
