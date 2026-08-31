export const PASSWORD_RECOVERY_PATH = "/redefinir-senha";

export function passwordRecoveryRedirectTo(origin = window.location.origin) {
  return new URL(PASSWORD_RECOVERY_PATH, origin).toString();
}
