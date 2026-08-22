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
    p_grace_until: assinatura.graceUntil || null,
    p_cancel_at_period_end: Boolean(assinatura.cancelAtPeriodEnd),
  });

  if (error) throw error;
}

export async function executarLifecycleAssinaturaAdmin(userId, action, assinatura = {}) {
  const { error } = await supabase.rpc("admin_subscription_lifecycle_action", {
    p_user_id: userId,
    p_action: action,
    p_plano: assinatura.plano || null,
    p_data_inicio: assinatura.dataInicio || null,
    p_data_vencimento: assinatura.dataVencimento || null,
    p_grace_until: assinatura.graceUntil || null,
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

export async function transferirAcessoAdmin(userId, novoEmail) {
  const { data, error } = await supabase.functions.invoke("transfer-user-access", {
    body: {
      userId,
      novoEmail,
    },
  });

  if (error) throw error;

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
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
    graceUntil: row.grace_until || "",
    cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
    cancelledAt: row.cancelled_at || "",
    suspendedAt: row.suspended_at || "",
    reactivatedAt: row.reactivated_at || "",
  };
}
