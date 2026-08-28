import {
  WORKOUT_LIFECYCLE_STATUS,
  WORKOUT_STATUS,
  normalizeWorkoutLifecycleStatus,
  normalizeWorkoutStatus,
} from "./workoutDataContract.js";

export const WORKOUT_LIFECYCLE_FILTER_OPTIONS = [
  { value: "todos", label: "Todos" },
  { value: WORKOUT_LIFECYCLE_STATUS.DRAFT, label: "Em revisão" },
  { value: WORKOUT_LIFECYCLE_STATUS.ACTIVE, label: "Ativos" },
  { value: WORKOUT_LIFECYCLE_STATUS.COMPLETED, label: "Concluídos" },
  { value: WORKOUT_LIFECYCLE_STATUS.ARCHIVED, label: "Arquivados" },
];

const PRESENTATION = {
  [WORKOUT_LIFECYCLE_STATUS.DRAFT]: {
    label: "Em revisão",
    description: "Treino ainda não entregue ao aluno.",
    badgeClassName: "status-badge status-badge-warning",
  },
  [WORKOUT_LIFECYCLE_STATUS.ACTIVE]: {
    label: "Ativo",
    description: "Treino entregue e disponível para o aluno.",
    badgeClassName: "status-badge status-badge-success",
  },
  [WORKOUT_LIFECYCLE_STATUS.COMPLETED]: {
    label: "Concluído",
    description: "Ciclo de treino finalizado.",
    badgeClassName: "status-badge status-badge-info",
  },
  [WORKOUT_LIFECYCLE_STATUS.ARCHIVED]: {
    label: "Arquivado",
    description: "Treino removido do fluxo ativo, sem exclusão dos dados.",
    badgeClassName: "status-badge status-badge-muted",
  },
};

const ACTIONS = {
  [WORKOUT_LIFECYCLE_STATUS.DRAFT]: ["edit", "deliver", "archive"],
  [WORKOUT_LIFECYCLE_STATUS.ACTIVE]: ["view", "edit", "complete", "archive"],
  [WORKOUT_LIFECYCLE_STATUS.COMPLETED]: ["view", "archive"],
  [WORKOUT_LIFECYCLE_STATUS.ARCHIVED]: ["view"],
};

export function getWorkoutLifecycleStatus(workout = {}) {
  const lifecycle = workout.lifecycleStatus || workout.lifecycle_status;
  if (lifecycle) return normalizeWorkoutLifecycleStatus(lifecycle);

  const legacy = normalizeWorkoutStatus(workout.status || "");
  if (legacy === WORKOUT_STATUS.IN_REVIEW) return WORKOUT_LIFECYCLE_STATUS.DRAFT;
  if (legacy === WORKOUT_STATUS.FINISHED) return WORKOUT_LIFECYCLE_STATUS.COMPLETED;
  return WORKOUT_LIFECYCLE_STATUS.ACTIVE;
}

export function getWorkoutLifecyclePresentation(workoutOrStatus = {}) {
  const status =
    typeof workoutOrStatus === "string"
      ? normalizeWorkoutLifecycleStatus(workoutOrStatus)
      : getWorkoutLifecycleStatus(workoutOrStatus);
  return {
    status,
    ...PRESENTATION[status],
  };
}

export function getWorkoutLifecycleActions(workout = {}) {
  const status = getWorkoutLifecycleStatus(workout);
  return [...(ACTIONS[status] || ["view"])];
}

export function getWorkoutPrimaryLifecycleAction(workout = {}) {
  const actions = getWorkoutLifecycleActions(workout);
  if (actions.includes("deliver")) return "deliver";
  if (actions.includes("complete")) return "complete";
  return "view";
}

export function getWorkoutRelevantDate(workout = {}) {
  const status = getWorkoutLifecycleStatus(workout);
  if (status === WORKOUT_LIFECYCLE_STATUS.DRAFT) {
    return {
      label: "Criado em",
      value: workout.appliedAt || workout.createdAt || workout.dataInicio || "",
    };
  }
  if (status === WORKOUT_LIFECYCLE_STATUS.ACTIVE) {
    return { label: "Entregue em", value: workout.deliveredAt || "" };
  }
  if (status === WORKOUT_LIFECYCLE_STATUS.COMPLETED) {
    return { label: "Concluído em", value: workout.completedAt || workout.dataFim || "" };
  }
  return { label: "Arquivado em", value: workout.archivedAt || "" };
}

export function getWorkoutOriginPresentation(workout = {}) {
  const type = String(workout.templateOriginType || "").trim();
  const name = String(workout.templateOriginName || "").trim();
  const label =
    type === "official"
      ? "Modelo oficial"
      : type === "personal"
        ? "Modelo pessoal"
        : "Criação manual";

  return {
    label,
    value: name ? `${label}: ${name}` : label,
  };
}

export function mapWorkoutLifecycleUiError(error) {
  const code = String(error?.code || "").trim();
  const message = String(error?.message || "").toLowerCase();

  if (code === "WORKOUT_INCOMPLETE" || message.includes("incomplete")) {
    return "Complete os dias e exercícios antes de entregar.";
  }
  if (code === "WORKOUT_DELIVERY_INVALID_TRANSITION") {
    return "Esta ação não está disponível para o estado atual do treino.";
  }
  if (code === "WORKOUT_DELIVERY_NOT_AUTHORIZED") {
    return "Você não tem permissão para alterar este treino.";
  }
  if (code === "WORKOUT_DELIVERY_NOT_FOUND") return "O treino não foi encontrado.";
  if (message.includes("network")) {
    return "Não foi possível concluir a operação. Verifique sua conexão e tente novamente.";
  }
  return "Não foi possível atualizar o treino.";
}
