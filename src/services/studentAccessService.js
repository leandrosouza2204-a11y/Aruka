import { normalizeStudentAccessState } from "../features/studentAccess/utils/studentAccessLifecycle.js";
import { supabase } from "./supabase";

export async function getStudentAccessState(alunoId) {
  const { data, error } = await supabase.rpc("get_student_access_state", {
    p_aluno_id: alunoId,
  });
  if (error) throw sanitizeStudentAccessError(error);
  return normalizeStudentAccessState(data || {});
}

export async function inviteStudentAccess(alunoId, email) {
  return manageStudentAccess(alunoId, "invite", { email });
}

export async function activateStudentAccess(alunoId, email) {
  return manageStudentAccess(alunoId, "activate", { email });
}

export async function suspendStudentAccess(alunoId, reason = "") {
  return manageStudentAccess(alunoId, "suspend", { reason });
}

export async function reactivateStudentAccess(alunoId) {
  return manageStudentAccess(alunoId, "reactivate");
}

export async function revokeStudentAccess(alunoId, reason = "") {
  return manageStudentAccess(alunoId, "revoke", { reason });
}

async function manageStudentAccess(alunoId, action, options = {}) {
  const { data, error } = await supabase.rpc("manage_student_access", {
    p_aluno_id: alunoId,
    p_action: action,
    p_email: options.email || null,
    p_reason: options.reason || null,
  });
  if (error) throw sanitizeStudentAccessError(error);
  return normalizeStudentAccessState(data || {});
}

function sanitizeStudentAccessError(error) {
  if (error.message === "STUDENT_ACCESS_EMAIL_REQUIRED") {
    return new Error("Informe um e-mail valido para liberar o acesso.");
  }
  if (error.message === "STUDENT_ACCESS_AUTH_LINK_REQUIRED") {
    return new Error("Vincule uma conta de aluno antes de ativar o acesso.");
  }
  return new Error("Não foi possível atualizar o acesso agora.");
}
