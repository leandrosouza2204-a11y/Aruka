import { WORKOUT_EXECUTION_SESSION_STATUS, normalizeExecutionSession } from "../../workoutExecution/utils/workoutExecutionSession.js";
import { STUDENT_ACCESS_STATUS, normalizeStudentAccessState } from "../../studentAccess/utils/studentAccessLifecycle.js";

export const COACH_SIGNAL_PRIORITY = Object.freeze({
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  INFO: "INFO",
});

export const COACH_SIGNAL_TYPE = Object.freeze({
  EXECUTION_INACTIVITY: "EXECUTION_INACTIVITY",
  RECENT_ABANDONED_SESSION: "RECENT_ABANDONED_SESSION",
  LOW_RECENT_FREQUENCY: "LOW_RECENT_FREQUENCY",
  RECENT_EXECUTION_ACTIVITY: "RECENT_EXECUTION_ACTIVITY",
  FINANCE_ATTENTION: "FINANCE_ATTENTION",
  STUDENT_ACCESS_ATTENTION: "STUDENT_ACCESS_ATTENTION",
  NO_ACTIVE_WORKOUT: "NO_ACTIVE_WORKOUT",
});

export const MAX_SIGNALS_PER_STUDENT = 3;
export const RECENT_ACTIVITY_DAYS = 7;
export const INACTIVITY_DAYS = 7;
export const ABANDONED_SESSION_DAYS = 7;
export const FIRST_STUDENT_GRACE_DAYS = 7;

const PRIORITY_RANK = {
  [COACH_SIGNAL_PRIORITY.HIGH]: 0,
  [COACH_SIGNAL_PRIORITY.MEDIUM]: 1,
  [COACH_SIGNAL_PRIORITY.INFO]: 2,
};

export function buildCoachWorkflowSignals(studentContext = {}, options = {}) {
  const now = normalizeDate(options.now) || new Date();
  const aluno = studentContext.aluno || studentContext.student || {};
  const signals = [];
  const treinos = Array.isArray(studentContext.treinos) ? studentContext.treinos : [];
  const execucoes = Array.isArray(studentContext.execucoes)
    ? studentContext.execucoes.map(normalizeExecutionSession).filter(Boolean)
    : [];
  const financeiro = studentContext.financeiro || null;
  const atencaoCobranca = studentContext.atencaoCobranca || aluno.atencaoCobranca || null;
  const studentId = aluno.id || studentContext.studentId || "";
  const studentName = aluno.nome || studentContext.studentName || "";

  const activeWorkout = findActiveWorkout(treinos);
  if (isActiveStudent(aluno) && !activeWorkout) {
    signals.push(createSignal({
      type: COACH_SIGNAL_TYPE.NO_ACTIVE_WORKOUT,
      priority: COACH_SIGNAL_PRIORITY.HIGH,
      title: "Sem treino ativo",
      description: "Este aluno ativo ainda não possui treino ativo disponível.",
      reason: "Nenhum treino com status ativo foi encontrado no resumo carregado.",
      source: "treinos",
      actionTarget: "treinos",
      studentId,
      studentName,
    }));
  }

  const accessSignal = buildStudentAccessSignal(aluno, studentId, studentName);
  if (accessSignal) signals.push(accessSignal);

  const financeSignal = buildFinanceSignal({ financeiro, atencaoCobranca, studentId, studentName });
  if (financeSignal) signals.push(financeSignal);

  const executionSignals = buildExecutionSignals({ aluno, execucoes, now, studentId, studentName });
  signals.push(...executionSignals);

  return orderCoachWorkflowSignals(deduplicateSignals(signals))
    .slice(0, Number(options.maxSignals || MAX_SIGNALS_PER_STUDENT));
}

export function buildCoachWorkflowSignalsForStudents(students = [], options = {}) {
  return students.map((studentContext) => ({
    studentId: studentContext.aluno?.id || studentContext.studentId || "",
    studentName: studentContext.aluno?.nome || studentContext.studentName || "",
    signals: buildCoachWorkflowSignals(studentContext, options),
  }));
}

export function orderCoachWorkflowSignals(signals = []) {
  return [...signals].sort((a, b) => {
    const priority = (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9);
    if (priority !== 0) return priority;
    const recency = getComparableDate(b).getTime() - getComparableDate(a).getTime();
    if (recency !== 0) return recency;
    return String(a.studentName || a.title).localeCompare(String(b.studentName || b.title), "pt-BR");
  });
}

export function buildStudentListSignals(aluno = {}) {
  const signals = [];
  if (isActiveStudent(aluno) && aluno.atencaoCobranca?.requerAtencao) {
    const item = aluno.atencaoCobranca.highestPriority || aluno.atencaoCobranca;
    signals.push(createSignal({
      type: COACH_SIGNAL_TYPE.FINANCE_ATTENTION,
      priority: item.vencido ? COACH_SIGNAL_PRIORITY.HIGH : COACH_SIGNAL_PRIORITY.MEDIUM,
      title: item.vencido ? "Pagamento vencido" : "Pagamento próximo",
      description: item.vencido ? "Há uma cobrança vencida." : "Há uma cobrança com vencimento próximo.",
      reason: "Resumo de cobrança já carregado na lista de alunos.",
      source: "financeiro",
      actionTarget: "financeiro",
      studentId: aluno.id || "",
      studentName: aluno.nome || "",
    }));
  }

  const accessSignal = buildStudentAccessSignal(aluno, aluno.id || "", aluno.nome || "");
  if (accessSignal) signals.push(accessSignal);

  return orderCoachWorkflowSignals(signals).slice(0, 2);
}

function buildExecutionSignals({ aluno, execucoes, now, studentId, studentName }) {
  if (!execucoes.length) {
    const daysSinceStart = calculateDaysSince(getStudentStartDate(aluno), now);
    if (daysSinceStart !== null && daysSinceStart <= FIRST_STUDENT_GRACE_DAYS) {
      return [createSignal({
        type: COACH_SIGNAL_TYPE.RECENT_EXECUTION_ACTIVITY,
        priority: COACH_SIGNAL_PRIORITY.INFO,
        title: "Sem execução registrada ainda",
        description: "Aluno recente sem execuções registradas no histórico carregado.",
        reason: `Início registrado há ${daysSinceStart} dia(s).`,
        source: "execucoes",
        actionTarget: "historico",
        studentId,
        studentName,
        occurredAt: getStudentStartDate(aluno),
      })];
    }
    return [createSignal({
      type: COACH_SIGNAL_TYPE.EXECUTION_INACTIVITY,
      priority: COACH_SIGNAL_PRIORITY.MEDIUM,
      title: "Sem execução recente",
      description: "Nenhuma sessão concluída foi encontrada no histórico carregado.",
      reason: "O resumo de execução não trouxe sessões concluídas recentes.",
      source: "execucoes",
      actionTarget: "historico",
      studentId,
      studentName,
    })];
  }

  const abandoned = execucoes
    .filter((session) => session.status === WORKOUT_EXECUTION_SESSION_STATUS.ABANDONED)
    .map((session) => ({ session, date: getSessionDate(session) }))
    .filter((item) => item.date && calculateDaysSince(item.date, now) <= ABANDONED_SESSION_DAYS)
    .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

  const completed = execucoes
    .filter((session) => session.status === WORKOUT_EXECUTION_SESSION_STATUS.COMPLETED)
    .map((session) => ({ session, date: getSessionDate(session) }))
    .filter((item) => item.date)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const signals = [];
  if (abandoned) {
    signals.push(createSignal({
      type: COACH_SIGNAL_TYPE.RECENT_ABANDONED_SESSION,
      priority: COACH_SIGNAL_PRIORITY.MEDIUM,
      title: "Treino interrompido recentemente",
      description: `${formatDatePtBr(abandoned.date)} - ${getSessionWorkoutLabel(abandoned.session)}.`,
      reason: "Há uma sessão marcada como interrompida nos últimos 7 dias.",
      source: "execucoes",
      actionTarget: "historico",
      studentId,
      studentName,
      occurredAt: abandoned.date,
    }));
  }

  const completed7d = completed.filter((item) => calculateDaysSince(item.date, now) <= RECENT_ACTIVITY_DAYS).length;
  const completed30d = completed.filter((item) => calculateDaysSince(item.date, now) <= 30).length;
  if (completed7d === 0) {
    const latest = completed[0] || null;
    signals.push(createSignal({
      type: COACH_SIGNAL_TYPE.EXECUTION_INACTIVITY,
      priority: COACH_SIGNAL_PRIORITY.MEDIUM,
      title: "Sem execução recente",
      description: latest
        ? `Última sessão concluída registrada há ${calculateDaysSince(latest.date, now)} dia(s).`
        : "Nenhuma sessão concluída nos últimos 7 dias.",
      reason: `Sessões concluídas: ${completed7d} nos últimos 7 dias e ${completed30d} nos últimos 30 dias.`,
      source: "execucoes",
      actionTarget: "historico",
      studentId,
      studentName,
      occurredAt: latest?.date || null,
    }));
  } else {
    signals.push(createSignal({
      type: COACH_SIGNAL_TYPE.RECENT_EXECUTION_ACTIVITY,
      priority: COACH_SIGNAL_PRIORITY.INFO,
      title: "Execução recente para revisar",
      description: `${completed7d} sessão(ões) concluída(s) nos últimos 7 dias.`,
      reason: `Sessões concluídas nos últimos 30 dias: ${completed30d}.`,
      source: "execucoes",
      actionTarget: "historico",
      studentId,
      studentName,
      occurredAt: completed[0]?.date || null,
    }));
  }

  return signals;
}

function buildStudentAccessSignal(aluno, studentId, studentName) {
  const access = normalizeStudentAccessState({
    status: aluno.studentAccessStatus,
    email: aluno.studentAccessEmail,
    invitedAt: aluno.studentAccessInvitedAt,
    activatedAt: aluno.studentAccessActivatedAt,
    suspendedAt: aluno.studentAccessSuspendedAt,
    revokedAt: aluno.studentAccessRevokedAt,
    reason: aluno.studentAccessReason,
  });

  if (access.status === STUDENT_ACCESS_STATUS.ACTIVE) return null;
  if (access.status === STUDENT_ACCESS_STATUS.INVITED) {
    return createSignal({
      type: COACH_SIGNAL_TYPE.STUDENT_ACCESS_ATTENTION,
      priority: COACH_SIGNAL_PRIORITY.INFO,
      title: "Convite de acesso enviado",
      description: "O aluno foi convidado, mas o acesso ainda não está ativo.",
      reason: "Status de acesso do aluno está como convite enviado.",
      source: "acesso",
      actionTarget: "acesso",
      studentId,
      studentName,
      occurredAt: access.invitedAt,
    });
  }
  if (access.status === STUDENT_ACCESS_STATUS.SUSPENDED) {
    return createSignal({
      type: COACH_SIGNAL_TYPE.STUDENT_ACCESS_ATTENTION,
      priority: COACH_SIGNAL_PRIORITY.HIGH,
      title: "Acesso suspenso",
      description: "O aluno não consegue acessar a área do aluno enquanto o acesso estiver suspenso.",
      reason: access.reason || "Status de acesso do aluno está como suspenso.",
      source: "acesso",
      actionTarget: "acesso",
      studentId,
      studentName,
      occurredAt: access.suspendedAt,
    });
  }
  if (access.status === STUDENT_ACCESS_STATUS.REVOKED) {
    return createSignal({
      type: COACH_SIGNAL_TYPE.STUDENT_ACCESS_ATTENTION,
      priority: COACH_SIGNAL_PRIORITY.HIGH,
      title: "Acesso revogado",
      description: "O aluno não tem acesso ativo à área do aluno.",
      reason: access.reason || "Status de acesso do aluno está como revogado.",
      source: "acesso",
      actionTarget: "acesso",
      studentId,
      studentName,
      occurredAt: access.revokedAt,
    });
  }
  return createSignal({
    type: COACH_SIGNAL_TYPE.STUDENT_ACCESS_ATTENTION,
    priority: COACH_SIGNAL_PRIORITY.MEDIUM,
    title: "Acesso não liberado",
    description: "O aluno ainda não tem acesso liberado à área do aluno.",
    reason: "Status de acesso do aluno está como não liberado.",
    source: "acesso",
    actionTarget: "acesso",
    studentId,
    studentName,
  });
}

function buildFinanceSignal({ financeiro, atencaoCobranca, studentId, studentName }) {
  const item = atencaoCobranca?.highestPriority || atencaoCobranca;
  if (item?.requerAtencao) {
    return createSignal({
      type: COACH_SIGNAL_TYPE.FINANCE_ATTENTION,
      priority: item.vencido ? COACH_SIGNAL_PRIORITY.HIGH : COACH_SIGNAL_PRIORITY.MEDIUM,
      title: item.vencido ? "Pagamento vencido" : "Pagamento próximo",
      description: item.vencido
        ? `Vencimento em aberto desde ${formatDatePtBr(item.dataReferencia)}.`
        : `Vencimento em ${formatDatePtBr(item.dataReferencia)}.`,
      reason: "Resumo financeiro indica cobrança que merece acompanhamento.",
      source: "financeiro",
      actionTarget: "financeiro",
      studentId,
      studentName,
      occurredAt: item.dataReferencia,
    });
  }

  if (financeiro && financeiro.quantidadePagamentos > 0 && financeiro.recorrenteEmDia === false) {
    return createSignal({
      type: COACH_SIGNAL_TYPE.FINANCE_ATTENTION,
      priority: COACH_SIGNAL_PRIORITY.MEDIUM,
      title: "Financeiro para conferir",
      description: "Há pagamentos no histórico, mas o resumo não indica recorrência em dia.",
      reason: "Resumo financeiro do aluno requer leitura do profissional.",
      source: "financeiro",
      actionTarget: "financeiro",
      studentId,
      studentName,
      occurredAt: financeiro.proximoVencimento || "",
    });
  }

  return null;
}

function deduplicateSignals(signals) {
  const seen = new Set();
  return signals.filter((signal) => {
    const key = signal.type === COACH_SIGNAL_TYPE.LOW_RECENT_FREQUENCY
      ? COACH_SIGNAL_TYPE.EXECUTION_INACTIVITY
      : signal.type;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function createSignal(signal) {
  return {
    type: signal.type,
    priority: signal.priority,
    title: signal.title,
    description: signal.description,
    reason: signal.reason,
    source: signal.source,
    actionTarget: signal.actionTarget,
    studentId: signal.studentId || "",
    studentName: signal.studentName || "",
    occurredAt: signal.occurredAt || "",
  };
}

function findActiveWorkout(treinos) {
  return treinos.find((treino) => {
    const lifecycle = String(treino?.lifecycleStatus || treino?.lifecycle_status || "").toLowerCase();
    if (lifecycle) return lifecycle === "active";
    const status = String(treino?.status || "").toLowerCase();
    return status === "ativo";
  }) || null;
}

function isActiveStudent(aluno) {
  return String(aluno?.status || "").toLowerCase() === "ativo";
}

function getSessionDate(session) {
  return normalizeDate(session.completedAt || session.abandonedAt || session.sessionDate || session.startedAt);
}

function getSessionWorkoutLabel(session) {
  return session.exercises?.[0]?.workoutTitle || session.exercises?.[0]?.dayName || "treino";
}

function getStudentStartDate(aluno) {
  return normalizeDate(aluno?.inicio || aluno?.consultoriaInicio || aluno?.createdAt || aluno?.created_at);
}

function getComparableDate(signal) {
  return normalizeDate(signal.occurredAt) || new Date(0);
}

function calculateDaysSince(date, now) {
  if (!date) return null;
  const start = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.max(0, Math.floor((end - start) / 86400000));
}

function normalizeDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDatePtBr(value) {
  const date = normalizeDate(value);
  if (!date) return "data não informada";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
}
