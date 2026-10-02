const CONFIRMED_TERMINAL_STATUSES = new Set(["completed", "cancelled", "abandoned"]);

export function isConfirmedTerminalSession(session) {
  return CONFIRMED_TERMINAL_STATUSES.has(String(session?.status || "").trim());
}

export async function refreshAfterConfirmedSessionTransition(session, refresh) {
  if (!isConfirmedTerminalSession(session) || typeof refresh !== "function") {
    return { status: "ignored", home: null, error: null };
  }

  try {
    return { status: "refreshed", home: await refresh(), error: null };
  } catch (error) {
    return { status: "failed", home: null, error };
  }
}
