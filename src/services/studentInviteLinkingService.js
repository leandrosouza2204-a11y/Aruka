import { normalizeStudentAccessState } from "../features/studentAccess/utils/studentAccessLifecycle.js";
import { supabase } from "./supabase";

export async function claimPendingStudentInvite({ optional = false } = {}) {
  const { data, error } = await supabase.rpc("claim_pending_student_invite");

  if (error) {
    if (optional) return null;
    throw sanitizeClaimError(error);
  }

  return normalizeStudentAccessState(data || {});
}

function sanitizeClaimError(error) {
  if (error.message === "STUDENT_INVITE_NOT_FOUND") {
    return new Error("Não encontramos um convite pendente para esta conta.");
  }
  if (error.message === "STUDENT_INVITE_AMBIGUOUS") {
    return new Error("Encontramos mais de um convite para este e-mail. Fale com seu profissional para revisar o acesso.");
  }
  if (error.message === "STUDENT_ACCOUNT_ALREADY_LINKED") {
    return new Error("Esta conta já está vinculada a outro cadastro de aluno.");
  }
  if (error.message === "STUDENT_INVITE_PROFILE_INCOMPATIBLE") {
    return new Error("Esta conta já possui outro tipo de acesso. Use uma conta de aluno para concluir o convite.");
  }
  if (error.message === "STUDENT_INVITE_AUTH_EMAIL_REQUIRED") {
    return new Error("Não foi possível confirmar o e-mail autenticado desta sessão.");
  }
  return new Error("Sua senha foi criada, mas não foi possível concluir o vínculo com o convite. Fale com seu profissional.");
}
