import { normalizeStudentAccessState } from "../features/studentAccess/utils/studentAccessLifecycle.js";
import { sanitizeStudentInviteError, sanitizeStudentInvitePayload } from "./studentInviteErrorService.js";
import { supabase } from "./supabase.js";

export async function getStudentAccessState(alunoId) {
  const { data, error } = await supabase.rpc("get_student_access_state", {
    p_aluno_id: alunoId,
  });
  if (error) throw sanitizeStudentAccessError(error);
  return normalizeStudentAccessState(data || {});
}

export async function inviteStudentAccess(alunoId, email) {
  return requestStudentAccessInvite("send", alunoId, { email });
}

export async function resendStudentAccessInvite(alunoId) {
  return requestStudentAccessInvite("resend", alunoId);
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

async function requestStudentAccessInvite(action, alunoId, options = {}) {
  const { data, error } = await supabase.functions.invoke("student-access-invite", {
    body: {
      action,
      alunoId,
      email: options.email || null,
    },
  });
  if (error) throw await sanitizeStudentInviteError(error);
  if (data?.error) throw sanitizeStudentInvitePayload(data);
  return normalizeStudentAccessState(data?.access || {});
}

function sanitizeStudentAccessError(error) {
  if (error.message === "STUDENT_ACCESS_EMAIL_REQUIRED") {
    return new Error("Informe um e-mail válido para liberar o acesso.");
  }
  if (error.message === "STUDENT_ACCESS_AUTH_LINK_REQUIRED") {
    return new Error("Vincule uma conta de aluno antes de ativar o acesso.");
  }
  if (error.message === "STUDENT_ACCESS_TRANSITION_INVALID") {
    return new Error("Esta ação não está disponível para o estado atual do acesso.");
  }
  return new Error("Não foi possível atualizar o acesso agora.");
}
