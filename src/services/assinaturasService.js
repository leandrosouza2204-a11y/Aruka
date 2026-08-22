import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";

export async function buscarAssinaturaUsuario() {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("assinaturas")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data ? rowParaAssinatura(data) : null;
}

export async function verificarAcessoAtivo() {
  const resultado = await verificarAssinaturaAtiva();
  return resultado.liberado;
}

export async function verificarAssinaturaAtiva() {
  const assinatura = await buscarAssinaturaUsuario();

  if (!assinatura) return { liberado: false, motivo: "sem-assinatura", assinatura: null };

  const status = String(assinatura.status || "").toLowerCase();
  if (status === "teste") return { liberado: true, motivo: "teste", assinatura };
  if (status === "ativo" && dataEhHojeOuFutura(assinatura.dataVencimento)) {
    return { liberado: true, motivo: assinatura.cancelAtPeriodEnd ? "cancelamento-agendado" : "assinante", assinatura };
  }
  if (status === "vencido" && !assinatura.suspendedAt && dataEhHojeOuFutura(assinatura.graceUntil)) {
    return { liberado: true, motivo: "grace", assinatura };
  }
  if (status === "cancelado") return { liberado: false, motivo: "cancelado", assinatura };
  if (status === "vencido" && assinatura.suspendedAt) return { liberado: false, motivo: "suspenso", assinatura };
  return { liberado: false, motivo: "vencido", assinatura };
}

export async function criarAssinaturaPendente(plano = "pendente") {
  const user = await buscarUsuarioLogado();
  const assinaturaAtual = await buscarAssinaturaUsuarioSemCriar(user.id);

  if (assinaturaAtual) return rowParaAssinatura(assinaturaAtual);

  const { data, error } = await supabase
    .from("assinaturas")
    .insert({
      user_id: user.id,
      plano,
      status: "pendente",
    })
    .select()
    .single();

  if (error) throw error;

  return rowParaAssinatura(data);
}

async function buscarAssinaturaUsuarioSemCriar(userId) {
  const { data, error } = await supabase
    .from("assinaturas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}

function rowParaAssinatura(row) {
  return {
    id: row.id,
    userId: row.user_id,
    plano: row.plano || "",
    status: row.status || "pendente",
    dataInicio: row.data_inicio || "",
    dataVencimento: row.data_vencimento || "",
    pagamentoId: row.pagamento_id || "",
    graceUntil: row.grace_until || "",
    cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
    cancelledAt: row.cancelled_at || "",
    suspendedAt: row.suspended_at || "",
    reactivatedAt: row.reactivated_at || "",
    createdAt: row.created_at || "",
  };
}

function dataEhHojeOuFutura(data) {
  if (!data) return false;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const partes = String(data).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!partes) return false;

  const alvo = new Date(
    Number(partes[1]),
    Number(partes[2]) - 1,
    Number(partes[3])
  );

  return alvo >= hoje;
}
