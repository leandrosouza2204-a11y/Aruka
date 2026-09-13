const RECOVERY_AUTH_ERROR = "access_denied";
const EXPIRED_OTP_ERROR_CODE = "otp_expired";

export function isExpiredRecoveryUrlError(hash) {
  const params = new URLSearchParams((hash || "").replace(/^#/, ""));

  return (
    params.get("error") === RECOVERY_AUTH_ERROR &&
    params.get("error_code") === EXPIRED_OTP_ERROR_CODE
  );
}

export function clearAuthErrorHash(location = window.location, history = window.history) {
  history.replaceState(null, "", `${location.pathname}${location.search}`);
}
