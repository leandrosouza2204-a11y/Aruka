export const STUDENT_ACCESS_STATUS = {
  NOT_INVITED: "not_invited",
  INVITED: "invited",
  ACTIVE: "active",
  SUSPENDED: "suspended",
  REVOKED: "revoked",
};

const STATUS_LABELS = {
  [STUDENT_ACCESS_STATUS.NOT_INVITED]: "Nao liberado",
  [STUDENT_ACCESS_STATUS.INVITED]: "Convite enviado",
  [STUDENT_ACCESS_STATUS.ACTIVE]: "Ativo",
  [STUDENT_ACCESS_STATUS.SUSPENDED]: "Suspenso",
  [STUDENT_ACCESS_STATUS.REVOKED]: "Revogado",
};

const STATUS_TONES = {
  [STUDENT_ACCESS_STATUS.NOT_INVITED]: "neutral",
  [STUDENT_ACCESS_STATUS.INVITED]: "info",
  [STUDENT_ACCESS_STATUS.ACTIVE]: "success",
  [STUDENT_ACCESS_STATUS.SUSPENDED]: "warning",
  [STUDENT_ACCESS_STATUS.REVOKED]: "danger",
};

export function normalizeStudentAccessState(value = {}) {
  const status = Object.values(STUDENT_ACCESS_STATUS).includes(value.status)
    ? value.status
    : STUDENT_ACCESS_STATUS.NOT_INVITED;

  return {
    alunoId: value.alunoId || value.aluno_id || "",
    status,
    label: STATUS_LABELS[status],
    tone: STATUS_TONES[status],
    email: value.email || "",
    hasStudentUser: Boolean(value.hasStudentUser ?? value.has_student_user),
    invitedAt: value.invitedAt || value.invited_at || "",
    activatedAt: value.activatedAt || value.activated_at || "",
    suspendedAt: value.suspendedAt || value.suspended_at || "",
    revokedAt: value.revokedAt || value.revoked_at || "",
    reason: value.reason || "",
  };
}

export function getStudentAccessActions(access) {
  const state = normalizeStudentAccessState(access);
  if (state.status === STUDENT_ACCESS_STATUS.NOT_INVITED) {
    return state.hasStudentUser ? ["activate"] : ["invite"];
  }
  if (state.status === STUDENT_ACCESS_STATUS.INVITED) return ["activate", "revoke"];
  if (state.status === STUDENT_ACCESS_STATUS.ACTIVE) return ["suspend"];
  if (state.status === STUDENT_ACCESS_STATUS.SUSPENDED) return ["reactivate", "revoke"];
  if (state.status === STUDENT_ACCESS_STATUS.REVOKED) return ["invite"];
  return [];
}

export function getStudentBlockedState(payload = {}) {
  const access = normalizeStudentAccessState(payload.studentAccess || {});
  if (access.status === STUDENT_ACCESS_STATUS.SUSPENDED) {
    return {
      blocked: true,
      title: "Acesso temporariamente indisponivel.",
      message: "Fale com seu profissional para reativar o acesso a sua area do aluno.",
    };
  }
  if (access.status === STUDENT_ACCESS_STATUS.REVOKED) {
    return {
      blocked: true,
      title: "Seu acesso a area do aluno nao esta ativo.",
      message: "Quando um novo acesso for liberado, voce podera entrar por aqui novamente.",
    };
  }
  return { blocked: false, title: "", message: "" };
}
