const SUBSCRIPTION_STATUSES = new Set(["pendente", "ativo", "vencido", "cancelado", "teste"]);
const PROFILE_ACCESS_TYPES = new Set(["admin", "beta", "assinante", "pendente", "bloqueado"]);
const PROFILE_STATUSES = new Set(["ativo", "inativo"]);

export const COMMERCIAL_FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "aguardando", label: "Aguardando" },
  { id: "ativos", label: "Ativos" },
  { id: "beta_teste", label: "Beta/Teste" },
  { id: "proximos_vencimento", label: "Proximos do vencimento" },
  { id: "vencidos", label: "Vencidos" },
  { id: "cancelados", label: "Cancelados" },
  { id: "bloqueados", label: "Bloqueados" },
];

export function buildCommercialAccountState(usuario = {}, options = {}) {
  const today = parseDate(options.today) || startOfToday();
  const role = normalize(usuario.role, "user");
  const profileAccess = normalizeKnown(usuario.tipoAcesso, PROFILE_ACCESS_TYPES, "pendente");
  const profileStatus = normalizeKnown(usuario.status, PROFILE_STATUSES, "ativo");
  const subscriptionStatus = normalizeKnown(usuario.assinaturaStatus, SUBSCRIPTION_STATUSES, "");
  const plan = String(usuario.assinaturaPlano || "").trim();
  const renewalDate = parseDate(usuario.dataVencimento);
  const startsAt = parseDate(usuario.dataInicio);
  const blocked = profileStatus === "inativo" || profileAccess === "bloqueado";
  const admin = role === "admin" || profileAccess === "admin";
  const beta = profileAccess === "beta";
  const subscriberProfile = profileAccess === "assinante";
  const activeSubscription = subscriptionStatus === "ativo" && (!renewalDate || renewalDate >= today);
  const expiredByDate = subscriptionStatus === "ativo" && renewalDate && renewalDate < today;
  const expiringSoon = activeSubscription && renewalDate && daysBetween(today, renewalDate) <= 7;

  let commercialStatus = "aguardando";
  if (blocked) commercialStatus = "bloqueado";
  else if (subscriptionStatus === "cancelado") commercialStatus = "cancelado";
  else if (subscriptionStatus === "vencido" || expiredByDate) commercialStatus = "vencido";
  else if (admin) commercialStatus = "admin";
  else if (beta || subscriptionStatus === "teste") commercialStatus = "beta_teste";
  else if (subscriberProfile && activeSubscription) commercialStatus = expiringSoon ? "proximo_vencimento" : "ativo";
  else if (subscriberProfile) commercialStatus = "atencao";
  else if (profileAccess === "pendente" || subscriptionStatus === "pendente" || !subscriptionStatus) commercialStatus = "aguardando";

  const attention = buildAttention({
    blocked,
    commercialStatus,
    expiredByDate,
    profileAccess,
    profileStatus,
    subscriberProfile,
    subscriptionStatus,
  });

  return {
    role,
    profileAccess,
    profileStatus,
    subscriptionStatus: subscriptionStatus || "sem_assinatura",
    plan: plan || "Sem plano",
    startsAt: startsAt ? toIsoDate(startsAt) : "",
    renewalDate: renewalDate ? toIsoDate(renewalDate) : "",
    commercialStatus,
    commercialLabel: commercialLabel(commercialStatus),
    accessLabel: accessLabel(profileAccess, profileStatus, role),
    subscriptionLabel: subscriptionLabel(subscriptionStatus, plan, expiredByDate),
    attentionRequired: attention.required,
    attentionLabel: attention.label,
    attentionTone: attention.tone,
    availableActions: buildAvailableActions({
      admin,
      blocked,
      commercialStatus,
      subscriberProfile,
      subscriptionStatus,
    }),
    filterKeys: buildFilterKeys({ blocked, commercialStatus, expiringSoon }),
    isAdmin: admin,
    isBlocked: blocked,
    isExpiringSoon: expiringSoon,
    hasActiveSubscription: activeSubscription,
    daysUntilRenewal: renewalDate ? daysBetween(today, renewalDate) : null,
  };
}

export function buildCommercialSummary(usuarios = [], options = {}) {
  const states = usuarios.map((usuario) => buildCommercialAccountState(usuario, options));
  return {
    total: states.length,
    aguardando: states.filter((state) => state.filterKeys.includes("aguardando")).length,
    ativos: states.filter((state) => state.filterKeys.includes("ativos")).length,
    betaTeste: states.filter((state) => state.filterKeys.includes("beta_teste")).length,
    proximosVencimento: states.filter((state) => state.filterKeys.includes("proximos_vencimento")).length,
    vencidos: states.filter((state) => state.filterKeys.includes("vencidos")).length,
    cancelados: states.filter((state) => state.filterKeys.includes("cancelados")).length,
    bloqueados: states.filter((state) => state.filterKeys.includes("bloqueados")).length,
    attentionRequired: states.filter((state) => state.attentionRequired).length,
  };
}

export function usuarioMatchesCommercialFilter(usuario, filtro, options = {}) {
  if (filtro === "todos") return true;
  return buildCommercialAccountState(usuario, options).filterKeys.includes(filtro);
}

export function validateCommercialSubscriptionInput({ plano, status, dataInicio, dataVencimento }) {
  const errors = [];
  const normalizedStatus = normalize(status, "pendente");
  const plan = String(plano || "").trim();
  const startsAt = parseDate(dataInicio);
  const renewsAt = parseDate(dataVencimento);

  if (!plan) errors.push("Informe o plano comercial.");
  if (!SUBSCRIPTION_STATUSES.has(normalizedStatus)) errors.push("Escolha um status de assinatura valido.");
  if (dataInicio && !startsAt) errors.push("Informe uma data de inicio valida.");
  if (dataVencimento && !renewsAt) errors.push("Informe uma data de vencimento valida.");
  if (startsAt && renewsAt && renewsAt < startsAt) {
    errors.push("A data de vencimento precisa ser igual ou posterior ao inicio.");
  }
  if (normalizedStatus === "ativo" && !renewsAt) {
    errors.push("Assinatura ativa precisa de data de vencimento.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function buildAttention({
  blocked,
  commercialStatus,
  expiredByDate,
  profileAccess,
  profileStatus,
  subscriberProfile,
  subscriptionStatus,
}) {
  if (blocked) {
    return { required: true, label: "Acesso bloqueado administrativamente", tone: "danger" };
  }
  if (commercialStatus === "aguardando") {
    return { required: true, label: "Aguardando liberacao administrativa", tone: "warning" };
  }
  if (commercialStatus === "vencido") {
    return { required: true, label: expiredByDate ? "Assinatura ativa com vencimento passado" : "Assinatura vencida", tone: "danger" };
  }
  if (commercialStatus === "cancelado") {
    return { required: true, label: "Assinatura cancelada; dados preservados", tone: "muted" };
  }
  if (commercialStatus === "proximo_vencimento") {
    return { required: true, label: "Renovacao proxima", tone: "warning" };
  }
  if (subscriberProfile && subscriptionStatus !== "ativo") {
    return { required: true, label: "Perfil assinante sem assinatura ativa", tone: "warning" };
  }
  if (profileAccess === "assinante" && profileStatus !== "ativo") {
    return { required: true, label: "Perfil precisa de revisao", tone: "warning" };
  }
  return { required: false, label: "Sem acao imediata", tone: "success" };
}

function buildAvailableActions({ admin, blocked, commercialStatus, subscriberProfile, subscriptionStatus }) {
  const actions = ["editar_assinatura"];

  if (!admin && !blocked) actions.push("liberar_beta");
  if (!blocked) actions.push("liberar_assinante");
  if (blocked) actions.push("reativar");
  else actions.push("bloquear");

  if (subscriberProfile || ["ativo", "teste", "vencido", "pendente"].includes(subscriptionStatus)) {
    actions.push("cancelar_assinatura");
  }
  if (["cancelado", "vencido"].includes(subscriptionStatus) || commercialStatus === "vencido") {
    actions.push("reativar_assinatura");
  }

  return [...new Set(actions)];
}

function buildFilterKeys({ blocked, commercialStatus, expiringSoon }) {
  const keys = [];
  if (blocked) keys.push("bloqueados");
  if (commercialStatus === "aguardando") keys.push("aguardando");
  if (commercialStatus === "ativo" || commercialStatus === "admin") keys.push("ativos");
  if (commercialStatus === "beta_teste") keys.push("beta_teste");
  if (commercialStatus === "proximo_vencimento" || expiringSoon) keys.push("proximos_vencimento", "ativos");
  if (commercialStatus === "vencido") keys.push("vencidos");
  if (commercialStatus === "cancelado") keys.push("cancelados");
  if (commercialStatus === "atencao") keys.push("aguardando");
  return keys.length ? [...new Set(keys)] : ["aguardando"];
}

function commercialLabel(status) {
  const labels = {
    admin: "Admin ativo",
    aguardando: "Aguardando liberacao",
    ativo: "Assinante ativo",
    atencao: "Revisar acesso",
    beta_teste: "Beta/Teste",
    bloqueado: "Bloqueado",
    cancelado: "Cancelado",
    proximo_vencimento: "Renovacao proxima",
    vencido: "Vencido",
  };
  return labels[status] || "Revisar";
}

function accessLabel(profileAccess, profileStatus, role) {
  if (profileStatus === "inativo") return "Perfil inativo";
  if (role === "admin" || profileAccess === "admin") return "Administrador";
  const labels = {
    assinante: "Acesso assinante",
    beta: "Acesso beta",
    bloqueado: "Acesso bloqueado",
    pendente: "Acesso pendente",
  };
  return labels[profileAccess] || "Acesso pendente";
}

function subscriptionLabel(status, plan, expiredByDate) {
  if (!status) return "Sem assinatura registrada";
  const planLabel = plan ? ` - ${plan}` : "";
  if (expiredByDate) return `Vencida por data${planLabel}`;
  const labels = {
    ativo: "Ativa",
    cancelado: "Cancelada",
    pendente: "Pendente",
    teste: "Teste",
    vencido: "Vencida",
  };
  return `${labels[status] || "Sem assinatura registrada"}${planLabel}`;
}

function normalize(value, fallback = "") {
  return String(value || fallback).trim().toLowerCase();
}

function normalizeKnown(value, known, fallback) {
  const normalized = normalize(value, fallback);
  return known.has(normalized) ? normalized : fallback;
}

function parseDate(value) {
  if (!value) return null;
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function daysBetween(start, end) {
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}
