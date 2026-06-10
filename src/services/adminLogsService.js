import { supabase } from "./supabase";

export async function listarAdminLogs() {
  return filtrarAdminLogs();
}

export async function filtrarAdminLogs(filtros = {}) {
  const { data, error } = await supabase.rpc("admin_listar_logs", {
    p_acao: filtros.acao || null,
    p_target_user_id: filtros.targetUserId || null,
    p_data_inicio: filtros.dataInicio || null,
    p_data_fim: filtros.dataFim || null,
    p_busca: filtros.busca || null,
  });

  if (error) throw error;

  return (data || []).map(rowParaAdminLog);
}

function rowParaAdminLog(row) {
  return {
    id: row.id,
    adminUserId: row.admin_user_id,
    adminEmail: row.admin_email || "",
    adminNome: row.admin_nome || "",
    targetUserId: row.target_user_id,
    targetEmail: row.target_email || "",
    targetNome: row.target_nome || "",
    acao: row.acao || "",
    entidade: row.entidade || "",
    entidadeId: row.entidade_id || "",
    dadosAnteriores: row.dados_anteriores || null,
    dadosNovos: row.dados_novos || null,
    ip: row.ip || "",
    userAgent: row.user_agent || "",
    createdAt: row.created_at || "",
  };
}
