import {
  HISTORY_QUALITY,
  STUDENT_PROGRESSION_SIGNAL,
  STUDENT_PROGRESSION_STATUS,
  buildStudentProgressionSnapshot,
} from "../../alunos/utils/studentProgressionSnapshot.js";

export const WORKOUT_FEEDBACK_TYPE = Object.freeze({
  PROGRESSION_SIGNAL: "PROGRESSION_SIGNAL",
  STABLE_PATTERN: "STABLE_PATTERN",
  PARTIAL_HISTORY: "PARTIAL_HISTORY",
  NEW_EXERCISE: "NEW_EXERCISE",
  REVIEW_CONTEXT: "REVIEW_CONTEXT",
  CONTINUITY_BREAK: "CONTINUITY_BREAK",
  NO_DATA: "NO_DATA",
});

export const WORKOUT_FEEDBACK_CONFIDENCE = Object.freeze({
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
});

export const WORKOUT_CONTINUITY = Object.freeze({
  GOOD: "CONTINUITY_GOOD",
  PARTIAL: "CONTINUITY_PARTIAL",
  LOW: "CONTINUITY_LOW",
  UNKNOWN: "UNKNOWN",
});

const PRIORITY = {
  [WORKOUT_FEEDBACK_TYPE.NO_DATA]: 10,
  [WORKOUT_FEEDBACK_TYPE.PROGRESSION_SIGNAL]: 20,
  [WORKOUT_FEEDBACK_TYPE.PARTIAL_HISTORY]: 30,
  [WORKOUT_FEEDBACK_TYPE.CONTINUITY_BREAK]: 35,
  [WORKOUT_FEEDBACK_TYPE.NEW_EXERCISE]: 40,
  [WORKOUT_FEEDBACK_TYPE.STABLE_PATTERN]: 50,
  [WORKOUT_FEEDBACK_TYPE.REVIEW_CONTEXT]: 70,
};

export function buildWorkoutIntelligenceFeedback({
  currentWorkout,
  workoutHistory = [],
  progressionSnapshot,
  now,
} = {}) {
  const history = normalizeHistory({ currentWorkout, workoutHistory });
  const snapshot = progressionSnapshot || buildStudentProgressionSnapshot(history, { now });
  const continuity = classifyContinuity(snapshot);
  const evidence = buildEvidence(snapshot, continuity);
  const items = buildItems(snapshot, evidence);

  return {
    summaryStatus: classifySummaryStatus(snapshot),
    continuity,
    evidence,
    items: items.sort((a, b) => a.priority - b.priority).slice(0, 5),
  };
}

function normalizeHistory({ currentWorkout, workoutHistory }) {
  const byId = new Map();
  [...(Array.isArray(workoutHistory) ? workoutHistory : []), currentWorkout]
    .filter(Boolean)
    .forEach((workout) => {
      if (workout.id) byId.set(workout.id, workout);
    });
  return [...byId.values()];
}

function buildItems(snapshot, evidence) {
  if (!snapshot.currentWorkout || !snapshot.previousWorkout) {
    return [
      createItem({
        type: WORKOUT_FEEDBACK_TYPE.NO_DATA,
        confidence: WORKOUT_FEEDBACK_CONFIDENCE.HIGH,
        evidence,
      }),
    ];
  }

  const items = [];

  if (evidence.matchingCount === 0) {
    items.push(createItem({
      type: WORKOUT_FEEDBACK_TYPE.CONTINUITY_BREAK,
      confidence: WORKOUT_FEEDBACK_CONFIDENCE.MEDIUM,
      evidence,
    }));
  }

  if (evidence.loadProgressCount + evidence.repProgressCount > 0) {
    items.push(createItem({
      type: WORKOUT_FEEDBACK_TYPE.PROGRESSION_SIGNAL,
      confidence: snapshot.historyQuality === HISTORY_QUALITY.GOOD
        ? WORKOUT_FEEDBACK_CONFIDENCE.HIGH
        : WORKOUT_FEEDBACK_CONFIDENCE.MEDIUM,
      evidence,
    }));
  }

  if (evidence.stableCount >= Math.max(2, evidence.matchingCount - 1)) {
    items.push(createItem({
      type: WORKOUT_FEEDBACK_TYPE.STABLE_PATTERN,
      confidence: WORKOUT_FEEDBACK_CONFIDENCE.MEDIUM,
      evidence,
    }));
  }

  if (evidence.partialCount > 0 || snapshot.historyQuality === HISTORY_QUALITY.PARTIAL) {
    items.push(createItem({
      type: WORKOUT_FEEDBACK_TYPE.PARTIAL_HISTORY,
      confidence: WORKOUT_FEEDBACK_CONFIDENCE.MEDIUM,
      evidence,
    }));
  }

  if (evidence.newExerciseCount > 0) {
    items.push(createItem({
      type: WORKOUT_FEEDBACK_TYPE.NEW_EXERCISE,
      confidence: evidence.matchingCount > 0
        ? WORKOUT_FEEDBACK_CONFIDENCE.HIGH
        : WORKOUT_FEEDBACK_CONFIDENCE.MEDIUM,
      evidence,
    }));
  }

  if (evidence.continuity === WORKOUT_CONTINUITY.LOW) {
    items.push(createItem({
      type: WORKOUT_FEEDBACK_TYPE.CONTINUITY_BREAK,
      confidence: WORKOUT_FEEDBACK_CONFIDENCE.MEDIUM,
      evidence,
    }));
  }

  if (snapshot.daysSinceReview !== null) {
    items.push(createItem({
      type: WORKOUT_FEEDBACK_TYPE.REVIEW_CONTEXT,
      confidence: WORKOUT_FEEDBACK_CONFIDENCE.HIGH,
      evidence,
    }));
  }

  return items.length ? items : [
    createItem({
      type: WORKOUT_FEEDBACK_TYPE.PARTIAL_HISTORY,
      confidence: WORKOUT_FEEDBACK_CONFIDENCE.LOW,
      evidence,
    }),
  ];
}

function createItem({ type, confidence, evidence }) {
  return {
    type,
    priority: PRIORITY[type] || 99,
    confidence,
    evidence,
  };
}

function buildEvidence(snapshot, continuity) {
  const loadProgressCount = countSignal(snapshot, STUDENT_PROGRESSION_SIGNAL.LOAD_PROGRESS);
  const repProgressCount = countSignal(snapshot, STUDENT_PROGRESSION_SIGNAL.REP_PROGRESS);

  return {
    exerciseCount: snapshot.currentExercisesCount || 0,
    matchingCount: snapshot.comparableExercisesCount || 0,
    loadProgressCount,
    repProgressCount,
    stableCount: countSignal(snapshot, STUDENT_PROGRESSION_SIGNAL.STABLE),
    partialCount: countSignal(snapshot, STUDENT_PROGRESSION_SIGNAL.PARTIAL_DATA),
    newExerciseCount: countSignal(snapshot, STUDENT_PROGRESSION_SIGNAL.NEW_EXERCISE),
    daysSinceReview: snapshot.daysSinceReview,
    historyQuality: snapshot.historyQuality,
    continuity,
  };
}

function countSignal(snapshot, type) {
  return (snapshot.signals || []).filter((signal) => signal.type === type).length;
}

function classifySummaryStatus(snapshot) {
  if (!snapshot.currentWorkout || !snapshot.previousWorkout) return WORKOUT_FEEDBACK_TYPE.NO_DATA;
  if (snapshot.status === STUDENT_PROGRESSION_STATUS.PROGRESSING) return WORKOUT_FEEDBACK_TYPE.PROGRESSION_SIGNAL;
  if (snapshot.status === STUDENT_PROGRESSION_STATUS.STABLE) return WORKOUT_FEEDBACK_TYPE.STABLE_PATTERN;
  return WORKOUT_FEEDBACK_TYPE.PARTIAL_HISTORY;
}

function classifyContinuity(snapshot) {
  if (!snapshot.currentWorkout || !snapshot.previousWorkout) return WORKOUT_CONTINUITY.UNKNOWN;
  if (snapshot.currentExercisesCount === 0) return WORKOUT_CONTINUITY.UNKNOWN;
  const ratio = snapshot.comparableExercisesCount / snapshot.currentExercisesCount;
  if (ratio >= 0.7) return WORKOUT_CONTINUITY.GOOD;
  if (ratio >= 0.35) return WORKOUT_CONTINUITY.PARTIAL;
  return WORKOUT_CONTINUITY.LOW;
}
