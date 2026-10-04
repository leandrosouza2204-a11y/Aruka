import { supabase } from "./supabase.js";

const ALLOWED_EVENTS = new Set([
  "rollout_decision",
  "route_fallback",
  "rpc_error",
  "v2_error_boundary",
  "player_start_attempt",
  "player_start_confirmed",
  "player_resume",
  "player_set_attempt",
  "player_set_confirmed",
  "player_set_uncertain",
  "player_set_reconciled",
  "player_set_conflict",
  "player_completion_attempt",
  "player_completion_confirmed",
  "player_cancel",
  "player_command_error",
]);

export async function recordStudentExperienceEvent(eventName, details = {}) {
  if (!ALLOWED_EVENTS.has(eventName)) return false;
  try {
    const { error } = await supabase.rpc("record_student_experience_event", {
      p_event_name: eventName,
      p_experience: details.experience || null,
      p_reason_code: details.reasonCode || null,
      p_config_version: details.configVersion ?? null,
      p_route: details.route || null,
      p_build_version: import.meta.env?.VITE_APP_VERSION || null,
      p_latency_ms: details.latencyMs ?? null,
      p_error_category: details.errorCategory || null,
      p_session_id: details.sessionId || null,
    });
    return !error;
  } catch {
    return false;
  }
}
