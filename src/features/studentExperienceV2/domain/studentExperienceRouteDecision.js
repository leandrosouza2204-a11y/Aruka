export const STUDENT_EXPERIENCE = Object.freeze({
  V1: "v1",
  V2: "v2",
  PROFESSIONAL: "professional",
});

export const SAFE_V1_DECISION = Object.freeze({
  experience: STUDENT_EXPERIENCE.V1,
  reasonCode: "DECISION_UNAVAILABLE",
  configVersion: 0,
  activeWorkout: null,
});

export function normalizeStudentExperienceRouteDecision(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return { ...SAFE_V1_DECISION };
  const experience = Object.values(STUDENT_EXPERIENCE).includes(payload.experience)
    ? payload.experience
    : STUDENT_EXPERIENCE.V1;
  const activeWorkout = normalizeActiveWorkout(payload.activeWorkout ?? payload.active_workout);
  return {
    experience,
    reasonCode: clean(payload.reasonCode ?? payload.reason_code) || "UNKNOWN",
    configVersion: Math.max(0, Number(payload.configVersion ?? payload.config_version) || 0),
    activeWorkout,
  };
}

export function canUseStudentExperienceV2(decision, buildSupportsV2) {
  return buildSupportsV2 === true
    && normalizeStudentExperienceRouteDecision(decision).experience === STUDENT_EXPERIENCE.V2;
}

function normalizeActiveWorkout(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const sessionId = clean(value.sessionId ?? value.session_id);
  const experienceOrigin = clean(value.experienceOrigin ?? value.experience_origin);
  if (!sessionId || ![STUDENT_EXPERIENCE.V1, STUDENT_EXPERIENCE.V2].includes(experienceOrigin)) return null;
  return { sessionId, experienceOrigin };
}

function clean(value) {
  return String(value || "").trim();
}
