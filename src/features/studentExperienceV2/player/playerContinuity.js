const MAX_DRAFTS = 100;
const VOLATILE_STORE_KEY = Symbol.for("aruka.studentExperienceV2.playerDraftStore");

export function createVolatilePlayerDraftStore() {
  const drafts = new Map();
  const selectedSets = new Map();

  return {
    read(sessionId, exerciseId, setNumber, fallback = {}) {
      const stored = drafts.get(draftKey(sessionId, exerciseId, setNumber));
      return { ...(stored || fallback) };
    },
    write(sessionId, exerciseId, setNumber, values) {
      const key = draftKey(sessionId, exerciseId, setNumber);
      drafts.delete(key);
      drafts.set(key, { ...values });
      while (drafts.size > MAX_DRAFTS) drafts.delete(drafts.keys().next().value);
    },
    clear(sessionId, exerciseId, setNumber) {
      drafts.delete(draftKey(sessionId, exerciseId, setNumber));
    },
    clearSession(sessionId) {
      const prefix = `${clean(sessionId)}:`;
      for (const key of drafts.keys()) if (key.startsWith(prefix)) drafts.delete(key);
      for (const key of selectedSets.keys()) if (key.startsWith(prefix)) selectedSets.delete(key);
    },
    readSelectedSet(sessionId, exerciseId) {
      return selectedSets.get(exerciseKey(sessionId, exerciseId)) || 0;
    },
    selectSet(sessionId, exerciseId, setNumber) {
      selectedSets.set(exerciseKey(sessionId, exerciseId), Number(setNumber) || 0);
    },
  };
}

export function getVolatilePlayerDraftStore(host = globalThis) {
  if (!host[VOLATILE_STORE_KEY]) {
    Object.defineProperty(host, VOLATILE_STORE_KEY, {
      configurable: true,
      value: createVolatilePlayerDraftStore(),
    });
  }
  return host[VOLATILE_STORE_KEY];
}

export function resolveActiveExerciseId(exercises = [], preferredExerciseId = "", fallbackExerciseId = "") {
  if (!exercises.length) return "";
  if (exercises.some((exercise) => exercise.id === preferredExerciseId)) return preferredExerciseId;
  if (exercises.some((exercise) => exercise.id === fallbackExerciseId)) return fallbackExerciseId;
  return exercises[0]?.id || "";
}

function draftKey(sessionId, exerciseId, setNumber) {
  return `${exerciseKey(sessionId, exerciseId)}:${Number(setNumber) || 0}`;
}

function exerciseKey(sessionId, exerciseId) {
  return `${clean(sessionId)}:${clean(exerciseId)}`;
}

function clean(value) {
  return String(value || "").trim();
}
