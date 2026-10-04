import { isStudentExperienceV2Enabled } from "../features/studentExperienceV2/config/studentExperienceV2Config.js";
import {
  SAFE_V1_DECISION,
  canUseStudentExperienceV2,
  normalizeStudentExperienceRouteDecision,
} from "../features/studentExperienceV2/domain/studentExperienceRouteDecision.js";
import { buscarUsuarioLogado } from "./authSessionService.js";
import { recordStudentExperienceEvent } from "./studentExperienceTelemetryService.js";
import { supabase } from "./supabase.js";

export async function buscarMinhaRotaExperienciaAluno({
  buildSupportsV2,
  rpc = null,
  authenticate = buscarUsuarioLogado,
  telemetry = recordStudentExperienceEvent,
} = {}) {
  const capability = isStudentExperienceV2Enabled(buildSupportsV2);
  const startedAt = Date.now();
  try {
    await authenticate();
    const response = rpc ? await rpc() : await supabase.rpc("get_my_student_experience_route");
    if (response?.error) throw response.error;
    const decision = normalizeStudentExperienceRouteDecision(response?.data ?? response);
    const effectiveDecision = decision.experience === "v2" && !capability
      ? { ...decision, experience: "v1", reasonCode: "BUILD_CAPABILITY_DISABLED" }
      : decision;
    emitTelemetry(telemetry, "rollout_decision", {
      experience: effectiveDecision.experience,
      reasonCode: effectiveDecision.reasonCode,
      configVersion: effectiveDecision.configVersion,
      route: typeof window === "undefined" ? null : window.location.pathname,
      latencyMs: Date.now() - startedAt,
      sessionId: effectiveDecision.activeWorkout?.sessionId,
    });
    return effectiveDecision;
  } catch {
    emitTelemetry(telemetry, "rpc_error", {
      experience: "v1",
      reasonCode: "DECISION_UNAVAILABLE",
      route: typeof window === "undefined" ? null : window.location.pathname,
      latencyMs: Date.now() - startedAt,
      errorCategory: "ROUTE_DECISION_FAILED",
    });
    return { ...SAFE_V1_DECISION };
  }
}

export function decisaoPermiteStudentExperienceV2(decision, buildSupportsV2) {
  return canUseStudentExperienceV2(decision, isStudentExperienceV2Enabled(buildSupportsV2));
}

function emitTelemetry(telemetry, eventName, details) {
  try {
    Promise.resolve(telemetry(eventName, details)).catch(() => {});
  } catch {
    // Telemetry is deliberately non-blocking and never changes routing authority.
  }
}
