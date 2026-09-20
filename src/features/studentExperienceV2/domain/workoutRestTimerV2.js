import {
  buildExecutionSetNumbers,
  formatRestDuration,
  parseRestDuration,
} from "../../workoutExecution/utils/restTimer.js";

const TERMINAL_SESSION_STATUSES = new Set(["completed", "cancelled", "abandoned"]);

export function normalizeCanonicalTimestamp(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const epochMs = Date.parse(value);
  return Number.isFinite(epochMs) ? epochMs : null;
}

export function createServerClockAnchor(serverNow, monotonicNow = 0, roundTripMs = 0) {
  const serverEpochMs = normalizeCanonicalTimestamp(serverNow);
  const receivedMonotonicMs = Number(monotonicNow);
  if (serverEpochMs === null || !Number.isFinite(receivedMonotonicMs)) return null;
  return {
    serverEpochMs,
    receivedMonotonicMs,
    uncertaintyMs: Math.max(0, Number(roundTripMs) || 0),
  };
}

export function estimateServerNow(anchor, monotonicNow = 0) {
  if (!anchor || !Number.isFinite(Number(monotonicNow))) return null;
  const elapsedMs = Math.max(0, Number(monotonicNow) - anchor.receivedMonotonicMs);
  return anchor.serverEpochMs + elapsedMs;
}

export function deriveCanonicalRest(player) {
  if (!player?.id || TERMINAL_SESSION_STATUSES.has(player.status)) return null;

  const completed = [];
  for (const [exerciseIndex, exercise] of (player.exercises || []).entries()) {
    if (exercise.status === "skipped") continue;
    for (const set of exercise.sets || []) {
      if (!set.completed) continue;
      const startedAtMs = normalizeCanonicalTimestamp(set.completedAt);
      if (startedAtMs === null) continue;
      completed.push({
        exerciseIndex,
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        setNumber: Number(set.setNumber),
        startedAt: set.completedAt,
        startedAtMs,
        durationSeconds: parseRestDuration(exercise.prescribedRest),
      });
    }
  }

  if (!completed.length) return null;
  completed.sort(compareCompletedSets);
  const latest = completed.at(-1);

  // A newer canonical completion supersedes an older rest, even when the new
  // set has no valid rest prescription or finishes the final pending set.
  if (!latest.durationSeconds || !hasPendingWorkoutSet(player.exercises)) return null;

  const durationMs = latest.durationSeconds * 1000;
  return {
    identity: JSON.stringify([player.id, latest.exerciseId, latest.setNumber, latest.startedAt, latest.durationSeconds]),
    sessionId: player.id,
    executionExerciseId: latest.exerciseId,
    exerciseName: latest.exerciseName,
    setNumber: latest.setNumber,
    startedAt: latest.startedAt,
    startedAtMs: latest.startedAtMs,
    durationSeconds: latest.durationSeconds,
    durationLabel: formatRestDuration(latest.durationSeconds),
    endsAtMs: latest.startedAtMs + durationMs,
  };
}

export function deriveRestTimerPresentation(rest, serverNowMs) {
  if (!rest || !Number.isFinite(Number(serverNowMs))) return null;
  const durationMs = rest.durationSeconds * 1000;
  const remainingMs = Math.min(durationMs, Math.max(0, rest.endsAtMs - Number(serverNowMs)));
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  return {
    ...rest,
    remainingSeconds,
    remainingLabel: formatRestDuration(remainingSeconds),
    status: remainingSeconds > 0 ? "active" : "completed",
  };
}

export function isSameCanonicalRest(left, right) {
  return Boolean(left?.identity && left.identity === right?.identity);
}

function compareCompletedSets(left, right) {
  return left.startedAtMs - right.startedAtMs
    || left.startedAt.localeCompare(right.startedAt)
    || left.exerciseIndex - right.exerciseIndex
    || left.setNumber - right.setNumber;
}

function hasPendingWorkoutSet(exercises = []) {
  return exercises.some((exercise) => {
    if (exercise.status === "skipped") return false;
    const completedNumbers = new Set((exercise.sets || [])
      .filter((set) => set.completed)
      .map((set) => Number(set.setNumber)));
    return buildExecutionSetNumbers(exercise.prescribedSeries, exercise.sets)
      .some((setNumber) => !completedNumbers.has(setNumber));
  });
}
