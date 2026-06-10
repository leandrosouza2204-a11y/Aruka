import { supabase } from "./supabase";

export async function listarUsuariosAdmin() {
  const { data, error } = await supabase.rpc("admin_listar_usuarios");

  if (error) throw error;

  return (data || []).map(rowParaUsuarioAdmin);
}

export async function atualizarPerfilAdmin(userId, perfil) {
  const { error } = await supabase.rpc("admin_atualizar_perfil", {
    p_user_id: userId,
    p_nome: perfil.nome || "",
    p_role: perfil.role,
    p_tipo_acesso: perfil.tipoAcesso,
    p_status: perfil.status,
    p_user_agent: obterUserAgent(),
  });

  if (error) throw error;
}

export async function upsertAssinaturaAdmin(userId, assinatura) {
  const { error } = await supabase.rpc("admin_upsert_assinatura", {
    p_user_id: userId,
    p_plano: assinatura.plano || "pendente",
    p_status: assinatura.status || "pendente",
    p_data_inicio: assinatura.dataInicio || null,
    p_data_vencimento: assinatura.dataVencimento || null,
    p_user_agent: obterUserAgent(),
  });

  if (error) throw error;
}

export async function bloquearUsuarioAdmin(userId) {
  const { error } = await supabase.rpc("admin_bloquear_usuario", {
    p_user_id: userId,
    p_user_agent: obterUserAgent(),
  });

  if (error) throw error;
}

export async function liberarBetaAdmin(userId) {
  const { error } = await supabase.rpc("admin_liberar_beta", {
    p_user_id: userId,
    p_user_agent: obterUserAgent(),
  });

  if (error) throw error;
}

export async function liberarAssinanteAdmin(
  userId,
  plano,
  dataInicio,
  dataVencimento
) {
  const { error } = await supabase.rpc("admin_liberar_assinante", {
    p_user_id: userId,
    p_plano: plano || "Mensal",
    p_data_inicio: dataInicio || null,
    p_data_vencimento: dataVencimento || null,
    p_user_agent: obterUserAgent(),
  });

  if (error) throw error;
}

function obterUserAgent() {
  return typeof navigator === "undefined" ? "" : navigator.userAgent || "";
}

function rowParaUsuarioAdmin(row) {
  return {
    userId: row.user_id,
    email: row.email || "",
    createdAt: row.created_at || "",
    nome: row.nome || "",
    role: row.role || "user",
    tipoAcesso: row.tipo_acesso || "pendente",
    status: row.status || "ativo",
    assinaturaPlano: row.assinatura_plano || "",
    assinaturaStatus: row.assinatura_status || "",
    dataInicio: row.data_inicio || "",
    dataVencimento: row.data_vencimento || "",
  };
}
