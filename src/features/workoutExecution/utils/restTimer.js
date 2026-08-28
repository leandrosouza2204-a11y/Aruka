export const REST_TIMER_STORAGE_KEY = "aruka:workoutExecution:restTimer:v1";

export function parseRestDuration(value) {
  if (value === null || value === undefined) return 0;
  const text = String(value).trim().toLowerCase();
  if (!text) return 0;

  if (/^\d+$/.test(text)) return positiveSeconds(Number(text));

  const seconds = text.match(/^(\d+)\s*s$/);
  if (seconds) return positiveSeconds(Number(seconds[1]));

  const minutes = text.match(/^(\d+)\s*min$/);
  if (minutes) return positiveSeconds(Number(minutes[1]) * 60);

  const mmss = text.match(/^(\d{1,2}):([0-5]\d)$/);
  if (mmss) return positiveSeconds(Number(mmss[1]) * 60 + Number(mmss[2]));

  return 0;
}

export function formatRestDuration(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(total / 60);
  const restSeconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
}

export function createRestDeadline(durationSeconds, now = Date.now()) {
  const duration = positiveSeconds(durationSeconds) || parseRestDuration(durationSeconds);
  if (!duration) return null;
  return Number(now) + duration * 1000;
}

export function getRemainingRestTime(restEndsAt, now = Date.now()) {
  const remainingMs = Math.max(0, Number(restEndsAt || 0) - Number(now || 0));
  return Math.ceil(remainingMs / 1000);
}

export function createRestTimerState({
  sessionId,
  exerciseId,
  exerciseName = "",
  setNumber,
  durationSeconds,
  now = Date.now(),
} = {}) {
  const duration = positiveSeconds(durationSeconds) || parseRestDuration(durationSeconds);
  const restEndsAt = createRestDeadline(duration, now);
  if (!sessionId || !exerciseId || !setNumber || !restEndsAt) return null;
  return {
    sessionId,
    exerciseId,
    exerciseName,
    setNumber: Number(setNumber),
    durationSeconds: duration,
    restEndsAt,
  };
}

export function saveRestTimerState(storage, state) {
  if (!storage || !state) return false;
  try {
    storage.setItem(REST_TIMER_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function restoreRestTimerState(storage, { sessionId, exerciseId, now = Date.now() } = {}) {
  if (!storage) return null;
  try {
    const state = JSON.parse(storage.getItem(REST_TIMER_STORAGE_KEY) || "null");
    if (!state || state.sessionId !== sessionId || state.exerciseId !== exerciseId) return null;
    if (getRemainingRestTime(state.restEndsAt, now) <= 0) return null;
    return state;
  } catch {
    return null;
  }
}

export function restoreRestTimerForSession(storage, { sessionId, now = Date.now() } = {}) {
  if (!storage || !sessionId) return null;
  try {
    const state = JSON.parse(storage.getItem(REST_TIMER_STORAGE_KEY) || "null");
    if (!state || state.sessionId !== sessionId) return null;
    if (getRemainingRestTime(state.restEndsAt, now) <= 0) return null;
    return state;
  } catch {
    return null;
  }
}

export function clearRestTimerState(storage) {
  try {
    storage?.removeItem?.(REST_TIMER_STORAGE_KEY);
  } catch {
    // Ignore unavailable storage.
  }
}

export function shouldStartRestAfterSetUpdate({
  field,
  prescribedRest,
  prescribedSeries,
  set,
  setNumber,
  value,
} = {}) {
  if (field !== "completed" || !value || !hasRestPerformanceData(set)) return false;
  if (!parseRestDuration(prescribedRest)) return false;
  return !isLastPrescribedSet(prescribedSeries, setNumber);
}

export function isLastPrescribedSet(prescribedSeries, setNumber) {
  const totalSets = parsePrescribedSeriesCount(prescribedSeries);
  return totalSets > 0 && Number(setNumber) >= totalSets;
}

export function parsePrescribedSeriesCount(value) {
  if (typeof value === "number") return Number.isInteger(value) && value > 0 ? value : 0;
  const text = String(value || "").trim();
  if (!text) return 0;
  if (/^\d+$/.test(text)) return Number(text);
  const match = text.match(/^(\d+)(?:\s*(?:s[eé]ries?|sets?)|\s*x(?:\s+.+)?)$/i);
  return match ? Number(match[1]) : 0;
}

export function buildExecutionSetNumbers(prescribedSeries, persistedSets = []) {
  const prescribedCount = parsePrescribedSeriesCount(prescribedSeries);
  const persistedMax = Array.isArray(persistedSets)
    ? Math.max(0, ...persistedSets.map((set) => Number(set?.setNumber || 0)))
    : 0;
  const rowCount = Math.max(1, prescribedCount || 0, persistedMax);
  return Array.from({ length: rowCount }, (_, index) => index + 1);
}

function hasRestPerformanceData(set = {}) {
  return ["reps", "loadValue", "rir", "rpe"].some((field) => String(set[field] ?? "").trim() !== "");
}

function positiveSeconds(value) {
  const number = Math.floor(Number(value) || 0);
  return number > 0 ? number : 0;
}
