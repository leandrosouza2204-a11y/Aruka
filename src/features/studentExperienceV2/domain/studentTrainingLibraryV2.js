export function normalizeStudentTrainingLibraryV2(payload = {}) {
  const program = payload.currentProgram || payload.current_program || null;
  const activeSession = payload.activeSession || payload.active_session || null;
  return {
    studentAccess: payload.studentAccess || payload.student_access || { status: "unlinked" },
    currentProgram: program ? {
      id: program.id || "",
      displayName: program.displayName || program.display_name || program.name || "Seu programa",
      objective: program.objective || program.objetivo || "",
      level: program.level || program.nivel || "",
      weeklyTarget: toOptionalCount(program.weeklyTarget ?? program.weekly_target),
      workoutCount: toCount(program.workoutCount ?? program.workout_count),
    } : null,
    workouts: (payload.workouts || []).map(normalizeWorkoutSummary),
    activeSession: activeSession ? normalizeActiveSession(activeSession) : null,
  };
}

export function normalizeStudentWorkoutDetailV2(payload) {
  if (!payload || typeof payload !== "object") return null;
  return {
    id: payload.id || "",
    treinoId: payload.treinoId || payload.treino_id || "",
    name: payload.name || payload.nome || "Treino",
    order: toCount(payload.order ?? payload.ordem),
    muscleGroups: payload.muscleGroups || payload.muscle_groups || "",
    exerciseCount: toCount(payload.exerciseCount ?? payload.exercise_count),
    setCount: toOptionalCount(payload.setCount ?? payload.set_count),
    exercises: (payload.exercises || []).map((exercise) => ({
      id: exercise.id || "",
      exerciseId: exercise.exerciseId || exercise.exercise_id || "",
      name: exercise.name || exercise.nome || "Exercício",
      order: toCount(exercise.order ?? exercise.ordem),
      series: cleanText(exercise.series),
      repetitions: cleanText(exercise.repetitions ?? exercise.repeticoes),
      prescribedLoad: cleanText(exercise.prescribedLoad ?? exercise.prescribed_load ?? exercise.carga),
      rest: cleanText(exercise.rest ?? exercise.descanso),
      notes: cleanText(exercise.notes ?? exercise.observacoes),
      trackingConfig: normalizeTrackingConfig(exercise.trackingConfig || exercise.tracking_config),
      videoUrl: cleanText(exercise.videoUrl ?? exercise.video_url),
      media: normalizeMedia(exercise.media),
    })),
  };
}

export function buildPrescriptionFacts(exercise = {}) {
  const facts = [];
  if (exercise.series && exercise.repetitions) facts.push(`${exercise.series} × ${exercise.repetitions}`);
  else if (exercise.series) facts.push(`${exercise.series} ${exercise.series === "1" ? "série" : "séries"}`);
  else if (exercise.repetitions) facts.push(`${exercise.repetitions} repetições`);
  if (exercise.prescribedLoad) facts.push(`Carga: ${exercise.prescribedLoad}`);
  if (exercise.rest) facts.push(`Descanso: ${exercise.rest}`);
  return facts;
}

export function isRecentlyCompleted(lastCompletedAt, now = new Date()) {
  if (!lastCompletedAt) return false;
  const completed = new Date(lastCompletedAt);
  if (Number.isNaN(completed.getTime())) return false;
  const elapsed = now.getTime() - completed.getTime();
  return elapsed >= 0 && elapsed <= 7 * 24 * 60 * 60 * 1000;
}

function normalizeWorkoutSummary(workout = {}) {
  return {
    id: workout.id || "",
    name: workout.name || workout.nome || "Treino",
    order: toCount(workout.order ?? workout.ordem),
    muscleGroups: workout.muscleGroups || workout.muscle_groups || "",
    exerciseCount: toCount(workout.exerciseCount ?? workout.exercise_count),
    setCount: toOptionalCount(workout.setCount ?? workout.set_count),
    lastCompletedAt: workout.lastCompletedAt || workout.last_completed_at || "",
  };
}

function normalizeActiveSession(session = {}) {
  return {
    id: session.id || "",
    treinoId: session.treinoId || session.treino_id || "",
    treinoDiaId: session.treinoDiaId || session.treino_dia_id || "",
    status: session.status || "",
    startedAt: session.startedAt || session.started_at || "",
    lastActivityAt: session.lastActivityAt || session.last_activity_at || "",
    workoutTitle: session.workoutTitle || session.workout_title || "Treino",
    dayName: session.dayName || session.day_name || "Treino atual",
  };
}

function normalizeTrackingConfig(config = {}) {
  return Object.fromEntries(["load", "reps", "rir", "rpe", "duration", "distance"]
    .map((key) => [key, config?.[key] === true]));
}

function normalizeMedia(media = {}) {
  if (!media || typeof media !== "object" || Array.isArray(media)) return { type: "" };
  if (media.type === "youtube") return {
    type: "youtube",
    videoId: cleanText(media.videoId ?? media.video_id),
    youtubeUrl: cleanText(media.youtubeUrl ?? media.youtube_url),
  };
  if (media.type === "uploaded_video") return {
    type: "uploaded_video",
    mimeType: cleanText(media.mimeType ?? media.mime_type),
  };
  return { type: "" };
}

function cleanText(value) {
  return String(value || "").trim();
}

function toCount(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function toOptionalCount(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : null;
}
