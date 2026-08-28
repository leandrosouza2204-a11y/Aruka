import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Dumbbell,
  History,
  HelpCircle,
  LogOut,
  Minimize2,
  Play,
  RefreshCcw,
  Save,
  Timer,
  XCircle,
} from "lucide-react";
import { markSessionLoggedOut } from "../hooks/useAutoLogout.js";
import { buscarMinhaExperienciaDiariaAluno } from "../services/studentDailyExperienceService.js";
import { supabase } from "../services/supabase.js";
import {
  abandonarExecucaoTreino,
  buscarMeuEstadoExecucaoTreino,
  concluirExecucaoTreino,
  createExecutionIdempotencyKey,
  iniciarExecucaoTreino,
  salvarExecucaoTreino,
} from "../services/workoutExecutionService.js";
import { buildStudentDailyExperience } from "../features/studentDailyExperience/utils/studentDailyExperience.js";
import {
  WORKOUT_EXECUTION_EXERCISE_STATUS,
  buildExecutionHistorySummary,
  canCompleteSession,
  formatDateOnlyPtBr,
  hasExecutionSetPerformanceData,
} from "../features/workoutExecution/utils/workoutExecutionSession.js";
import {
  EXECUTION_PROGRESS_SIGNAL,
  buildExecutionProgressionSnapshot,
  formatSetReference,
  formatPerformedSetLine,
  getCompletedExerciseSets,
} from "../features/workoutExecution/utils/workoutExecutionProgression.js";
import ExerciseVideoPlayer from "../features/workoutExecution/components/ExerciseVideoPlayer.jsx";
import {
  clearRestTimerState,
  buildExecutionSetNumbers,
  createRestTimerState,
  formatRestDuration,
  getRemainingRestTime,
  restoreRestTimerForSession,
  saveRestTimerState,
  shouldStartRestAfterSetUpdate,
} from "../features/workoutExecution/utils/restTimer.js";

function MinhaArea() {
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [executionState, setExecutionState] = useState(null);
  const [executionSession, setExecutionSession] = useState(null);
  const [selectedDayId, setSelectedDayId] = useState("");
  const [status, setStatus] = useState("loading");
  const [erro, setErro] = useState("");
  const [treinoAberto, setTreinoAberto] = useState(false);
  const [savingState, setSavingState] = useState("idle");
  const [completionSummary, setCompletionSummary] = useState(null);
  const [activeRestTimer, setActiveRestTimer] = useState(null);
  const [completedRestTimer, setCompletedRestTimer] = useState(null);
  const [restOverlayOpen, setRestOverlayOpen] = useState(false);
  const [restRemaining, setRestRemaining] = useState(0);
  const [restAnnouncement, setRestAnnouncement] = useState("");

  async function carregar() {
    setStatus("loading");
    setErro("");
    try {
      const [dailyData, executionData] = await Promise.all([
        buscarMinhaExperienciaDiariaAluno(),
        buscarMeuEstadoExecucaoTreino(5),
      ]);
      setPayload(dailyData);
      setExecutionState(executionData);
      setExecutionSession(executionData?.activeSession || null);
      setSelectedDayId(executionData?.activeSession?.treinoDiaId || "");
      setStatus("success");
    } catch (error) {
      setErro(error.message || "Não foi possível carregar sua área agora.");
      setStatus("error");
    }
  }

  useEffect(() => {
    let active = true;

    Promise.all([buscarMinhaExperienciaDiariaAluno(), buscarMeuEstadoExecucaoTreino(5)])
      .then(([dailyData, executionData]) => {
        if (!active) return;
        setPayload(dailyData);
        setExecutionState(executionData);
        setExecutionSession(executionData?.activeSession || null);
        setSelectedDayId(executionData?.activeSession?.treinoDiaId || "");
        setStatus("success");
      })
      .catch((error) => {
        if (!active) return;
        setErro(error.message || "Não foi possível carregar sua área agora.");
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  const daily = useMemo(() => buildStudentDailyExperience(payload || {}), [payload]);
  const historySummary = useMemo(
    () => buildExecutionHistorySummary(executionState?.recentSessions || []),
    [executionState]
  );
  const executionProgression = useMemo(
    () => buildExecutionProgressionSnapshot({
      currentSession: executionSession,
      recentSessions: executionState?.recentSessions || [],
    }),
    [executionSession, executionState]
  );
  const activeDays = useMemo(() => daily.activeWorkout?.days || [], [daily.activeWorkout?.days]);
  const selectedDay = activeDays.find((day) => day.id === selectedDayId) || activeDays[0] || null;
  const videoByExerciseId = useMemo(() => {
    const entries = activeDays.flatMap((day) =>
      (day.exercises || []).map((exercise) => [exercise.id, exercise.videoUrl || ""])
    );
    return new Map(entries);
  }, [activeDays]);

  useEffect(() => {
    if (!executionSession?.id) return;
    const restored = restoreRestTimerForSession(window.localStorage, { sessionId: executionSession.id });
    if (restored) {
      window.setTimeout(() => {
        setActiveRestTimer(restored);
        setCompletedRestTimer(null);
        setRestOverlayOpen(false);
        setRestRemaining(getRemainingRestTime(restored.restEndsAt));
      }, 0);
    }
  }, [executionSession?.id]);

  useEffect(() => {
    if (!activeRestTimer) {
      return undefined;
    }

    function syncRemaining() {
      const remaining = getRemainingRestTime(activeRestTimer.restEndsAt);
      setRestRemaining(remaining);
      if (remaining <= 0) {
        setRestAnnouncement("Descanso concluído.");
        clearRestTimerState(window.localStorage);
        setCompletedRestTimer(activeRestTimer);
        setActiveRestTimer(null);
        setRestOverlayOpen(true);
        if (navigator.vibrate) navigator.vibrate(120);
      }
    }

    syncRemaining();
    const intervalId = window.setInterval(syncRemaining, 500);
    window.addEventListener("focus", syncRemaining);
    window.addEventListener("pageshow", syncRemaining);
    document.addEventListener("visibilitychange", syncRemaining);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", syncRemaining);
      window.removeEventListener("pageshow", syncRemaining);
      document.removeEventListener("visibilitychange", syncRemaining);
    };
  }, [activeRestTimer]);

  async function sair() {
    markSessionLoggedOut();
    setPayload(null);
    setExecutionState(null);
    setExecutionSession(null);
    setCompletionSummary(null);
    clearRestTimerState(window.localStorage);
    setActiveRestTimer(null);
    setCompletedRestTimer(null);
    setRestOverlayOpen(false);
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  async function iniciarOuContinuarExecucao() {
    if (executionSession) {
      setTreinoAberto(true);
      return;
    }

    if (!daily.activeWorkout?.id) return;
    const nextDayId = selectedDay?.id || "";
    if (activeDays.length > 1 && !nextDayId) return;

    setSavingState("starting");
    setErro("");
    try {
      const session = await iniciarExecucaoTreino({
        treinoId: daily.activeWorkout.id,
        treinoDiaId: nextDayId || null,
        idempotencyKey: createExecutionIdempotencyKey(daily.activeWorkout.id, nextDayId),
      });
      setExecutionSession(session);
      setSelectedDayId(session.treinoDiaId || nextDayId);
      setTreinoAberto(true);
    } catch (error) {
      setErro(error.message || "Não foi possível iniciar a execução agora.");
    } finally {
      setSavingState("idle");
    }
  }

  async function salvarExecucao(session = executionSession) {
    if (!session?.id) return null;
    setSavingState("saving");
    setErro("");
    try {
      const updated = await salvarExecucaoTreino(session);
      setExecutionSession(updated);
      return updated;
    } catch (error) {
      setErro(error.message || "Não foi possível salvar a execução agora.");
      return null;
    } finally {
      setSavingState("idle");
    }
  }

  async function concluirExecucao() {
    const saved = await salvarExecucao();
    if (!saved?.id) return;
    setSavingState("completing");
    try {
      const completed = await concluirExecucaoTreino(saved.id);
      const summary = buildExecutionProgressionSnapshot({
        currentSession: completed,
        recentSessions: executionState?.recentSessions || [],
      });
      setExecutionSession(null);
      clearRestTimerState(window.localStorage);
      setActiveRestTimer(null);
      setCompletedRestTimer(null);
      setRestOverlayOpen(false);
      setCompletionSummary({
        registeredExercises: buildExecutionHistorySummary(completed)?.exerciseCount || 0,
        completedSets: buildExecutionHistorySummary(completed)?.completedSetCount || 0,
        safeComparisonCount: summary.safeComparisonCount,
        frequency: summary.frequency,
      });
      setExecutionState((current) => ({
        ...(current || {}),
        activeSession: null,
        recentSessions: [completed, ...(current?.recentSessions || [])].slice(0, 5),
      }));
    } catch (error) {
      setErro(error.message || "Não foi possível concluir a execução agora.");
    } finally {
      setSavingState("idle");
    }
  }

  async function abandonarExecucao() {
    if (!executionSession?.id) return;
    setSavingState("abandoning");
    setErro("");
    try {
      const abandoned = await abandonarExecucaoTreino(executionSession.id);
      setExecutionSession(null);
      clearRestTimerState(window.localStorage);
      setActiveRestTimer(null);
      setCompletedRestTimer(null);
      setRestOverlayOpen(false);
      setExecutionState((current) => ({
        ...(current || {}),
        activeSession: null,
        recentSessions: [abandoned, ...(current?.recentSessions || [])].slice(0, 5),
      }));
    } catch (error) {
      setErro(error.message || "Não foi possível abandonar a execução agora.");
    } finally {
      setSavingState("idle");
    }
  }

  function updateExercise(exerciseId, updater) {
    setExecutionSession((session) => ({
      ...session,
      exercises: session.exercises.map((exercise) =>
        exercise.id === exerciseId ? updater(exercise) : exercise
      ),
    }));
  }

  function updateSet(exerciseId, setNumber, field, value) {
    updateExercise(exerciseId, (exercise) => {
      const existing = exercise.sets.find((item) => item.setNumber === setNumber) || { setNumber };
      const nextSet = { ...existing, [field]: value };
      if (field === "completed") {
        nextSet.completed = Boolean(value) && hasExecutionSetPerformanceData(nextSet);
      }
      if (
        shouldStartRestAfterSetUpdate({
          field,
          value,
          set: nextSet,
          setNumber,
          prescribedRest: exercise.prescribedRest,
          prescribedSeries: exercise.prescribedSeries,
        })
      ) {
        startRestTimer(exercise, setNumber);
      }
      const sets = [
        ...exercise.sets.filter((item) => item.setNumber !== setNumber),
        nextSet,
      ].sort((a, b) => a.setNumber - b.setNumber);
      return { ...exercise, status: WORKOUT_EXECUTION_EXERCISE_STATUS.PARTIAL, sets };
    });
  }

  function startRestTimer(exercise, setNumber) {
    const state = createRestTimerState({
      sessionId: executionSession?.id,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      setNumber,
      durationSeconds: exercise.prescribedRest,
    });
    if (!state) return;
    setActiveRestTimer(state);
    setCompletedRestTimer(null);
    setRestOverlayOpen(true);
    setRestRemaining(state.durationSeconds);
    setRestAnnouncement("Descanso iniciado.");
    saveRestTimerState(window.localStorage, state);
  }

  function restartRestTimer() {
    if (!activeRestTimer) return;
    const state = createRestTimerState({
      ...activeRestTimer,
      now: Date.now(),
    });
    setActiveRestTimer(state);
    setCompletedRestTimer(null);
    setRestOverlayOpen(true);
    setRestRemaining(state.durationSeconds);
    setRestAnnouncement("Descanso reiniciado.");
    saveRestTimerState(window.localStorage, state);
  }

  function skipRestTimer() {
    clearRestTimerState(window.localStorage);
    setActiveRestTimer(null);
    setCompletedRestTimer(null);
    setRestOverlayOpen(false);
    setRestRemaining(0);
    setRestAnnouncement("Descanso pulado.");
  }

  function minimizeRestTimer() {
    setRestOverlayOpen(false);
  }

  function openRestTimer() {
    setRestOverlayOpen(true);
  }

  function closeCompletedRestTimer() {
    setCompletedRestTimer(null);
    setRestOverlayOpen(false);
    setRestRemaining(0);
  }

  if (status === "loading") {
    return (
      <main style={styles.page} data-testid="student-daily-page">
        <section style={styles.stateBox} data-testid="student-daily-loading">
          <RefreshCcw size={22} />
          <strong>Carregando sua área...</strong>
        </section>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main style={styles.page} data-testid="student-daily-page">
        <section style={styles.stateBox} data-testid="student-daily-error">
          <AlertCircle size={22} />
          <strong>Não foi possível carregar sua área</strong>
          <p>{erro}</p>
          <button style={styles.primaryButton} type="button" onClick={carregar}>
            Tentar novamente
          </button>
        </section>
      </main>
    );
  }

  if (daily.state === "UNLINKED_STUDENT") {
    return (
      <main style={styles.page} data-testid="student-daily-page">
        <section style={styles.stateBox} data-testid="student-daily-unlinked">
          <AlertCircle size={22} />
          <strong>Perfil de aluno não encontrado</strong>
          <p>Não encontramos um perfil de aluno vinculado a esta conta.</p>
        </section>
      </main>
    );
  }

  if (daily.state === "ACCESS_BLOCKED") {
    return (
      <main style={styles.page} data-testid="student-daily-page">
        <section style={styles.stateBox} data-testid="student-access-blocked">
          <AlertCircle size={22} />
          <strong>{daily.blockedState.title}</strong>
          <p>{daily.blockedState.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page} data-testid="student-daily-page">
      <header style={styles.header}>
        <div style={styles.headerText}>
          <span style={styles.kicker}>Minha área</span>
          <h1 style={styles.title}>Olá, {daily.student?.name || "aluno"}</h1>
        </div>
        <button
          data-testid="student-logout"
          onClick={sair}
          style={styles.logoutButton}
          type="button"
        >
          <LogOut size={17} aria-hidden="true" />
          Sair
        </button>
      </header>

      {erro && <div style={styles.errorBox}>{erro}</div>}

      <section style={styles.hero} data-testid="student-daily-active-workout">
        <div style={styles.heroTop}>
          <span style={styles.iconBubble}><Dumbbell size={20} /></span>
          <div>
            <span style={styles.kicker}>Seu treino atual</span>
            <h2 style={styles.heroTitle}>{daily.activeWorkout?.title || "Nenhum treino ativo"}</h2>
          </div>
        </div>

        {daily.activeWorkout ? (
          <>
            <div style={styles.heroGrid}>
              <Info label="Objetivo" testId="student-workout-objective" value={daily.activeWorkout.objective} />
              <Info label="Frequência prescrita" testId="student-workout-frequency" value={daily.activeWorkout.daysText} />
              <Info label="Período" testId="student-workout-period" value={daily.activeWorkout.period} />
              <Info label="Status" testId="student-workout-status" value={daily.activeWorkout.statusText} />
            </div>
            <p style={styles.reviewText}>{daily.activeWorkout.reviewText}</p>
            {activeDays.length > 1 && !executionSession && (
              <label style={styles.daySelector}>
                <span>Dia de treino</span>
                <select
                  data-testid="student-execution-day-select"
                  value={selectedDayId}
                  onChange={(event) => setSelectedDayId(event.target.value)}
                  style={styles.select}
                >
                  {activeDays.map((day) => (
                    <option key={day.id || day.name} value={day.id}>
                      {day.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div style={styles.actionsRow}>
              <button
                style={styles.primaryButton}
                type="button"
                onClick={iniciarOuContinuarExecucao}
                disabled={savingState !== "idle"}
                data-testid="student-execution-start"
              >
                <Play size={18} />
                {executionSession ? "Continuar treino" : "Iniciar treino"}
              </button>
              <button
                style={styles.secondaryButton}
                type="button"
                onClick={() => setTreinoAberto((open) => !open)}
                data-testid="student-daily-view-workout"
              >
                Ver ficha <ChevronDown size={18} />
              </button>
            </div>
          </>
        ) : (
          <p style={styles.muted}>Você ainda não possui um treino ativo para consulta.</p>
        )}
      </section>

      {executionSession && (
        <ExecutionSessionPanel
          canComplete={canCompleteSession(executionSession)}
          onAbandon={abandonarExecucao}
          onComplete={concluirExecucao}
          onSave={() => salvarExecucao()}
          onUpdateExercise={updateExercise}
          onUpdateSet={updateSet}
          progression={executionProgression}
          savingState={savingState}
          session={executionSession}
          videoByExerciseId={videoByExerciseId}
        />
      )}

      <RestTimerOverlay
        announcement={restAnnouncement}
        isOpen={restOverlayOpen}
        onCloseCompleted={closeCompletedRestTimer}
        onMinimize={minimizeRestTimer}
        onRestart={restartRestTimer}
        onSkip={skipRestTimer}
        remaining={restRemaining}
        timer={activeRestTimer || completedRestTimer}
        timerCompleted={!activeRestTimer && Boolean(completedRestTimer)}
      />
      <CompactRestTimer
        onOpen={openRestTimer}
        remaining={restRemaining}
        timer={activeRestTimer}
        visible={Boolean(activeRestTimer) && !restOverlayOpen}
      />

      {completionSummary && (
        <section style={styles.section} data-testid="student-execution-completion-summary">
          <h2 style={styles.sectionTitle}>Resumo realizado</h2>
          <div style={styles.compactList}>
            <span>{pluralizePt(completionSummary.registeredExercises, "exercício registrado", "exercícios registrados")}</span>
            <span>{pluralizePt(completionSummary.completedSets, "série concluída", "séries concluídas")}</span>
            <span>{pluralizePt(completionSummary.safeComparisonCount, "comparação com execução anterior", "comparações com execuções anteriores")}</span>
            <span>{pluralizePt(completionSummary.frequency.completed7d, "sessão concluída nos últimos 7 dias", "sessões concluídas nos últimos 7 dias")}</span>
          </div>
        </section>
      )}

      <section style={styles.nextAction} data-testid="student-daily-next-action">
        <CalendarDays size={20} />
        <div>
          <strong>{daily.nextAction.title}</strong>
          <p>{daily.nextAction.text}</p>
        </div>
      </section>

      {treinoAberto && daily.activeWorkout && (
        <section style={styles.section} data-testid="student-daily-workout-days">
          <h2 style={styles.sectionTitle}>Ficha para consulta</h2>
          <div style={styles.daysList}>
            {daily.activeWorkout.days.map((day, index) => (
              <article style={styles.dayCard} key={day.id || `${day.name}-${index}`}>
                <h3 style={styles.cardTitle}>{day.name}</h3>
                {day.notes && <p style={styles.muted}>{day.notes}</p>}
                <div style={styles.exerciseList}>
                  {day.exercises.map((exercise, exerciseIndex) => (
                    <div style={styles.exerciseItem} key={exercise.id || `${exercise.name}-${exerciseIndex}`}>
                      <strong>{exercise.name}</strong>
                      <span>{exercise.prescription}</span>
                      <ExerciseVideoPlayer title={exercise.name} videoUrl={exercise.videoUrl} />
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section style={styles.section} data-testid="student-execution-history">
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Histórico de execução</h2>
            <p style={styles.muted}>Registros recentes feitos por você.</p>
          </div>
          <History size={18} />
        </div>
        {historySummary.length ? (
          <div style={styles.historyList}>
            {(executionState?.recentSessions || []).map((session) => {
              const item = buildExecutionHistorySummary(session);
              return (
              <article style={styles.historyItem} key={item.id}>
                <strong>{item.workoutTitle}</strong>
                <span>{item.dayName}</span>
                <p>{item.statusLabel} em {item.dateLabel}</p>
                <small>{pluralizePt(item.exerciseCount, "exercício", "exercícios")} e {pluralizePt(item.completedSetCount, "série concluída", "séries concluídas")}</small>
                <details data-testid="student-execution-history-details" style={styles.historyDetails}>
                  <summary style={styles.detailsSummary}>Ver detalhes</summary>
                  <ExecutionSessionSetDetails session={session} />
                </details>
              </article>
              );
            })}
          </div>
        ) : (
          <p style={styles.emptyText}>Nenhum treino executado registrado ainda.</p>
        )}
      </section>

      <section style={styles.section} data-testid="student-daily-progression">
        <h2 style={styles.sectionTitle}>{daily.progression.title}</h2>
        <p style={styles.muted}>{daily.progression.text}</p>
        {daily.progression.items.length ? (
          <div style={styles.compactList}>
            {daily.progression.items.map((item) => <span key={item}>{item}</span>)}
          </div>
        ) : (
          <p style={styles.emptyText}>Sem comparação disponível entre fichas.</p>
        )}
      </section>

      <section style={styles.section} data-testid="student-daily-history">
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Histórico de fichas</h2>
          <History size={18} />
        </div>
        {daily.history.length ? (
          <div style={styles.historyList}>
            {daily.history.map((item) => (
              <article style={styles.historyItem} key={`${item.title}-${item.period}`}>
                <strong>{item.title}</strong>
                <span>{item.statusText}</span>
                <p>{item.period}</p>
                <small>{item.completedText}</small>
              </article>
            ))}
          </div>
        ) : (
          <p style={styles.emptyText}>Ainda não há histórico de fichas disponível.</p>
        )}
      </section>

      <section style={styles.section} data-testid="student-daily-assessment">
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{daily.assessment.title}</h2>
          <ClipboardList size={18} />
        </div>
        <p style={styles.emptyText}>{daily.assessment.text}</p>
      </section>
    </main>
  );
}

function ExecutionSessionPanel({
  canComplete,
  onAbandon,
  onComplete,
  onSave,
  onUpdateExercise,
  onUpdateSet,
  progression,
  savingState,
  session,
  videoByExerciseId,
}) {
  const progressionByExercise = new Map((progression?.exercises || []).map((item) => [item.exerciseId, item]));

  return (
    <section style={styles.executionPanel} data-testid="student-execution-session">
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Execução em andamento</h2>
          <p style={styles.muted}>{session.workoutTitle || "Treino atual"} - {session.dayName || "Dia de treino"}</p>
        </div>
        <CheckCircle2 size={20} />
      </div>

      <div style={styles.executionList}>
        {session.exercises.map((exercise) => (
          <article style={styles.executionExercise} key={exercise.id} data-testid="student-execution-exercise">
            {(() => {
              const reference = progressionByExercise.get(exercise.id);
              return (
                <>
            <div style={styles.exerciseHeader}>
              <div>
                <h3 style={styles.cardTitle}>{exercise.name}</h3>
                <p style={styles.muted}>
                  {[
                    exercise.prescribedSets,
                    exercise.prescribedReps ? `${exercise.prescribedReps} reps` : "",
                    exercise.prescribedLoad ? `carga prescrita ${exercise.prescribedLoad}` : "",
                    exercise.prescribedRest ? `descanso ${exercise.prescribedRest}` : "",
                  ]
                    .filter(Boolean)
                    .join(" - ") || "Prescrição não informada"}
                </p>
                <ExerciseVideoPlayer title={exercise.name} videoUrl={videoByExerciseId.get(exercise.treinoExercicioId)} />
              </div>
              <button
                style={styles.secondaryButton}
                type="button"
                onClick={() =>
                  onUpdateExercise(exercise.id, (current) => ({
                    ...current,
                    status: WORKOUT_EXECUTION_EXERCISE_STATUS.SKIPPED,
                  }))
                }
              >
                Pular
              </button>
            </div>

            <ExecutionProgressionHint exercise={exercise} reference={reference} />
            <div style={styles.setGrid}>
              {buildExecutionSetNumbers(exercise.prescribedSeries, exercise.sets).map((setNumber) => {
                const set = exercise.sets.find((item) => item.setNumber === setNumber) || {};
                return (
                  <div style={styles.setRow} key={setNumber}>
                    <strong>{setNumber}</strong>
                    <NumericField
                      label="Reps"
                      value={set.reps ?? ""}
                      onChange={(value) => onUpdateSet(exercise.id, setNumber, "reps", value)}
                    />
                    <NumericField
                      label="Carga realizada"
                      value={set.loadValue ?? ""}
                      onChange={(value) => onUpdateSet(exercise.id, setNumber, "loadValue", value)}
                    />
                    <NumericField
                      help={RIR_HELP}
                      helpLabel="Entenda o que é RIR"
                      label="RIR"
                      value={set.rir ?? ""}
                      onChange={(value) => onUpdateSet(exercise.id, setNumber, "rir", value)}
                    />
                    <NumericField
                      help={RPE_HELP}
                      helpLabel="Entenda o que é RPE"
                      label="RPE"
                      value={set.rpe ?? ""}
                      onChange={(value) => onUpdateSet(exercise.id, setNumber, "rpe", value)}
                    />
                    <label style={styles.checkLabel}>
                      <input
                        checked={Boolean(set.completed)}
                        type="checkbox"
                        onChange={(event) => onUpdateSet(exercise.id, setNumber, "completed", event.target.checked)}
                      />
                      Feita
                    </label>
                  </div>
                );
              })}
            </div>
                </>
              );
            })()}
          </article>
        ))}
      </div>

      <div style={styles.actionsRow}>
        <button style={styles.secondaryButton} type="button" onClick={onSave} disabled={savingState !== "idle"}>
          <Save size={17} />
          Salvar
        </button>
        <button style={styles.primaryButton} type="button" onClick={onComplete} disabled={!canComplete || savingState !== "idle"}>
          <CheckCircle2 size={17} />
          Concluir treino
        </button>
        <button style={styles.dangerButton} type="button" onClick={onAbandon} disabled={savingState !== "idle"}>
          <XCircle size={17} />
          Abandonar treino
        </button>
      </div>
    </section>
  );
}

function RestTimerOverlay({
  announcement,
  isOpen,
  onCloseCompleted,
  onMinimize,
  onRestart,
  onSkip,
  remaining,
  timer,
  timerCompleted,
}) {
  if (!timer || !isOpen) return null;

  const progress = timer.durationSeconds
    ? Math.max(0, Math.min(1, remaining / timer.durationSeconds))
    : 0;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div style={styles.restOverlay} data-testid="student-rest-timer-overlay">
      <div
        aria-label="Timer de descanso"
        role="dialog"
        style={styles.restOverlayCard}
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            timerCompleted ? onCloseCompleted() : onMinimize();
          }
        }}
      >
        <button
          aria-label={timerCompleted ? "Fechar timer" : "Minimizar timer"}
          data-testid={timerCompleted ? "student-rest-close" : "student-rest-minimize"}
          onClick={timerCompleted ? onCloseCompleted : onMinimize}
          style={styles.restIconButton}
          type="button"
        >
          <Minimize2 size={18} />
        </button>
        <div style={styles.restDial} data-testid="student-rest-dial">
          <svg aria-hidden="true" height="152" viewBox="0 0 152 152" width="152">
            <circle cx="76" cy="76" fill="none" r={radius} stroke="#dbeafe" strokeWidth="12" />
            <circle
              cx="76"
              cy="76"
              fill="none"
              r={radius}
              stroke={timerCompleted ? "#16a34a" : "#174ea6"}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeWidth="12"
              style={styles.restProgressCircle}
            />
          </svg>
          <div style={styles.restDialCenter}>
            <Timer size={24} />
            <strong style={styles.restTime}>{formatRestDuration(remaining)}</strong>
          </div>
        </div>
        <div style={styles.restOverlayText}>
          <span style={styles.infoLabel}>{timerCompleted ? "Descanso concluído" : "Descanso"}</span>
          <p style={styles.restContext}>
            Após a série {timer.setNumber} de {timer.exerciseName || "exercício"}
          </p>
        </div>
        {!timerCompleted ? (
          <div style={styles.restActions}>
            <button type="button" style={styles.secondaryButton} onClick={onSkip} data-testid="student-rest-skip">
              Pular descanso
            </button>
            <button type="button" style={styles.secondaryButton} onClick={onRestart} data-testid="student-rest-restart">
              Reiniciar descanso
            </button>
          </div>
        ) : (
          <button type="button" style={styles.primaryButton} onClick={onCloseCompleted} data-testid="student-rest-done">
            Fechar
          </button>
        )}
        <span style={styles.srOnly} aria-live="polite">{announcement}</span>
      </div>
    </div>
  );
}

function CompactRestTimer({ onOpen, remaining, timer, visible }) {
  if (!visible || !timer) return null;

  return (
    <button
      aria-label="Abrir timer de descanso"
      data-testid="student-rest-compact"
      onClick={onOpen}
      style={styles.compactRestTimer}
      type="button"
    >
      <Timer size={18} />
      <span>Descanso</span>
      <strong>{formatRestDuration(remaining)}</strong>
    </button>
  );
}

function ExecutionProgressionHint({ exercise, reference }) {
  const [expanded, setExpanded] = useState(false);

  if (!reference || (reference.signal === EXECUTION_PROGRESS_SIGNAL.NOT_COMPARABLE && !reference.previousExercise)) {
    return (
      <p style={styles.executionHint} data-testid="student-execution-progression-hint">
        Primeiro registro deste exercício.
      </p>
    );
  }

  if (reference.signal === EXECUTION_PROGRESS_SIGNAL.FIRST_RECORD) {
    return (
      <p style={styles.executionHint} data-testid="student-execution-progression-hint">
        Primeiro registro deste exercício.
      </p>
    );
  }

  const previousSets = getCompletedExerciseSets(reference.previousExercise);
  const detailsId = `student-previous-execution-details-${exercise?.id || reference?.exerciseId || "exercise"}`;
  const sessionDate = reference.previousSessionDate ? formatDateOnlyPtBr(reference.previousSessionDate) : "Data da sessão não informada";

  return (
    <div style={styles.executionHint} data-testid="student-execution-progression-hint">
      <div style={styles.previousExecutionCompact} data-testid="student-previous-execution-compact">
        <strong>Última execução · {sessionDate}</strong>
        <span data-testid="student-previous-execution-best-set">Melhor série: {formatSetReference(reference.previousBestSet)}</span>
        <span data-testid="student-previous-execution-series-count">
          {previousSets.length ? pluralizePt(previousSets.length, "série registrada", "séries registradas") : "Sem séries registradas"}
        </span>
        {previousSets.length ? (
          <button
            aria-controls={detailsId}
            aria-expanded={expanded}
            data-testid="student-previous-execution-toggle"
            onClick={() => setExpanded((current) => !current)}
            style={styles.previousExecutionToggle}
            type="button"
          >
            {expanded ? "Ocultar detalhes" : "Ver detalhes"}
          </button>
        ) : null}
      </div>
      {expanded && previousSets.length ? (
        <div
          data-testid="student-previous-execution-details"
          id={detailsId}
          style={styles.previousSetList}
        >
          {previousSets.map((set) => (
            <span key={set.setNumber} data-testid="student-previous-execution-set" style={styles.previousSetItem}>
              <strong>Série {set.setNumber}</strong>
              <span>{formatPerformedSetLine(set)}</span>
            </span>
          ))}
        </div>
      ) : (
        <span>Sem séries concluídas na execução anterior.</span>
      )}
    </div>
  );
}

function ExecutionSessionSetDetails({ session }) {
  const exercises = (session?.exercises || []).filter((exercise) => getCompletedExerciseSets(exercise).length);
  if (!exercises.length) {
    return <p style={styles.muted}>Sem séries realizadas para detalhar.</p>;
  }

  return (
    <div style={styles.historyDetailList} data-testid="student-execution-history-set-details">
      {exercises.map((exercise) => (
        <div key={exercise.id || exercise.name} style={styles.historyExerciseDetail}>
          <strong>{exercise.name}</strong>
          <span style={styles.infoLabel}>Realizado</span>
          {getCompletedExerciseSets(exercise).map((set) => (
            <span key={set.setNumber}>Série {set.setNumber} - {formatPerformedSetLine(set)}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function NumericField({ help = "", helpLabel = "", label, onChange, value }) {
  return (
    <label style={styles.numericField}>
      <span style={styles.numericLabel}>
        {label}
        {help && (
          <details style={styles.helpDetails}>
            <summary aria-label={helpLabel} style={styles.helpButton}>
              <HelpCircle size={14} aria-hidden="true" />
            </summary>
            <span style={styles.helpText}>{help}</span>
          </details>
        )}
      </span>
      <input
        inputMode="decimal"
        min="0"
        step="0.5"
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={styles.numberInput}
      />
    </label>
  );
}

function Info({ label, testId, value }) {
  return (
    <div data-testid={testId} style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <strong style={styles.infoValue}>{value}</strong>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f8fb",
    color: "#111827",
    padding: "24px clamp(16px, 4vw, 40px) 88px",
    maxWidth: 1120,
    margin: "0 auto",
  },
  header: {
    alignItems: "flex-start",
    display: "flex",
    gap: 14,
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerText: { minWidth: 0 },
  kicker: { color: "#5b6472", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0 },
  title: { margin: "6px 0 0", fontSize: 30, lineHeight: 1.1 },
  hero: { background: "#ffffff", border: "1px solid #dde3ee", borderRadius: 8, padding: 20, marginBottom: 14 },
  heroTop: { display: "flex", gap: 12, alignItems: "center", marginBottom: 16 },
  iconBubble: { width: 40, height: 40, borderRadius: 8, display: "grid", placeItems: "center", background: "#e8f1ff", color: "#174ea6" },
  heroTitle: { margin: "4px 0 0", fontSize: 24, lineHeight: 1.15 },
  heroGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 },
  infoItem: { border: "1px solid #e5e9f1", borderRadius: 8, display: "grid", gap: 6, minWidth: 0, padding: 12, background: "#fbfcfe" },
  infoLabel: { color: "#5b6472", display: "block", fontSize: 12, fontWeight: 800, lineHeight: 1.25, textTransform: "uppercase" },
  infoValue: { color: "#111827", display: "block", fontSize: 16, lineHeight: 1.35, overflowWrap: "anywhere" },
  reviewText: { margin: "14px 0", color: "#384252", fontWeight: 600 },
  primaryButton: { border: 0, borderRadius: 8, background: "#174ea6", color: "#fff", minHeight: 44, padding: "0 16px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 800, cursor: "pointer" },
  secondaryButton: { border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff", color: "#1f2937", minHeight: 40, padding: "0 14px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 800, cursor: "pointer" },
  logoutButton: { border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff", color: "#1f2937", flexShrink: 0, minHeight: 40, padding: "0 14px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 800, cursor: "pointer" },
  dangerButton: { border: "1px solid #fecaca", borderRadius: 8, background: "#fff5f5", color: "#991b1b", minHeight: 40, padding: "0 14px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 800, cursor: "pointer" },
  nextAction: { display: "flex", gap: 12, borderRadius: 8, padding: 16, background: "#ecfdf5", border: "1px solid #bbf7d0", color: "#14532d", marginBottom: 14 },
  section: { background: "#ffffff", border: "1px solid #dde3ee", borderRadius: 8, padding: 18, marginBottom: 14 },
  executionPanel: { background: "#ffffff", border: "1px solid #bfdbfe", borderRadius: 8, padding: 18, marginBottom: 14 },
  sectionHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  sectionTitle: { margin: "0 0 10px", fontSize: 20, lineHeight: 1.2 },
  muted: { color: "#526071", margin: 0, lineHeight: 1.5 },
  emptyText: { color: "#526071", background: "#f8fafc", border: "1px solid #e5e9f1", borderRadius: 8, padding: 12, margin: 0 },
  errorBox: { color: "#991b1b", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 12, marginBottom: 14 },
  daySelector: { display: "grid", gap: 6, margin: "14px 0", color: "#374151", fontSize: 13, fontWeight: 800 },
  select: { border: "1px solid #cbd5e1", borderRadius: 8, minHeight: 42, padding: "0 10px", maxWidth: 320 },
  actionsRow: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 },
  daysList: { display: "grid", gap: 12 },
  dayCard: { border: "1px solid #e5e9f1", borderRadius: 8, padding: 14 },
  cardTitle: { margin: "0 0 8px", fontSize: 17 },
  exerciseList: { display: "grid", gap: 8, marginTop: 10 },
  exerciseItem: { display: "grid", gap: 3, padding: "10px 0", borderTop: "1px solid #eef2f7" },
  compactList: { display: "grid", gap: 8, marginTop: 12 },
  historyList: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 },
  historyItem: { display: "grid", gap: 5, border: "1px solid #e5e9f1", borderRadius: 8, padding: 12 },
  historyDetails: { display: "grid", gap: 8, marginTop: 4 },
  detailsSummary: { color: "#174ea6", cursor: "pointer", fontSize: 13, fontWeight: 800 },
  historyDetailList: { display: "grid", gap: 10, marginTop: 8 },
  historyExerciseDetail: { borderTop: "1px solid #e5e9f1", display: "grid", gap: 4, paddingTop: 8 },
  executionList: { display: "grid", gap: 12, marginTop: 12 },
  executionExercise: { border: "1px solid #e5e9f1", borderRadius: 8, padding: 14 },
  executionHint: { background: "#f8fafc", border: "1px solid #e5e9f1", borderRadius: 8, color: "#384252", display: "grid", gap: 3, fontSize: 13, lineHeight: 1.35, margin: "0 0 12px", padding: "8px 10px" },
  prescriptionReference: { display: "grid", gap: 3, marginTop: 4 },
  previousExecutionCompact: { alignItems: "start", display: "grid", gap: 4 },
  previousExecutionToggle: { alignItems: "center", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 8, color: "#174ea6", cursor: "pointer", display: "inline-flex", fontWeight: 800, justifyContent: "center", justifySelf: "start", marginTop: 2, minHeight: 40, padding: "0 12px" },
  previousSetList: { borderTop: "1px solid #e5e9f1", display: "grid", gap: 6, marginTop: 6, paddingTop: 8 },
  previousSetItem: { display: "grid", gap: 2 },
  restOverlay: { alignItems: "center", background: "rgba(15, 23, 42, 0.52)", display: "flex", inset: 0, justifyContent: "center", padding: 16, position: "fixed", zIndex: 40 },
  restOverlayCard: { alignItems: "center", background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 8, boxShadow: "0 24px 60px rgba(15, 23, 42, 0.28)", display: "grid", gap: 14, justifyItems: "center", maxWidth: 380, outline: "none", padding: "18px 18px 20px", position: "relative", textAlign: "center", width: "min(100%, 380px)" },
  restIconButton: { alignItems: "center", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 8, color: "#1f2937", cursor: "pointer", display: "inline-flex", height: 38, justifyContent: "center", padding: 0, position: "absolute", right: 12, top: 12, width: 38 },
  restDial: { display: "grid", height: 152, placeItems: "center", position: "relative", width: 152 },
  restDialCenter: { alignItems: "center", color: "#174ea6", display: "grid", gap: 4, justifyItems: "center", position: "absolute" },
  restProgressCircle: { transform: "rotate(-90deg)", transformOrigin: "76px 76px", transition: "stroke-dashoffset 0.35s ease" },
  restTime: { color: "#174ea6", display: "block", fontSize: 34, lineHeight: 1.05, marginTop: 2 },
  restOverlayText: { display: "grid", gap: 6 },
  restContext: { color: "#384252", fontSize: 15, fontWeight: 700, lineHeight: 1.35, margin: 0 },
  restActions: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  compactRestTimer: { alignItems: "center", background: "#174ea6", border: "1px solid #0f3d86", borderRadius: 8, bottom: 18, boxShadow: "0 16px 36px rgba(23, 78, 166, 0.3)", color: "#ffffff", cursor: "pointer", display: "inline-flex", gap: 8, fontWeight: 800, minHeight: 44, padding: "0 14px", position: "fixed", right: 18, zIndex: 35 },
  exerciseHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 },
  setGrid: { display: "grid", gap: 8 },
  setRow: { alignItems: "end", display: "grid", gap: 8, gridTemplateColumns: "28px repeat(4, minmax(64px, 1fr)) minmax(70px, auto)" },
  numericField: { display: "grid", gap: 4, color: "#5b6472", fontSize: 12, fontWeight: 800 },
  numericLabel: { alignItems: "center", display: "flex", gap: 4 },
  helpDetails: { position: "relative" },
  helpButton: { alignItems: "center", background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 999, color: "#174ea6", cursor: "pointer", display: "inline-flex", height: 22, justifyContent: "center", listStyle: "none", padding: 0, width: 22 },
  helpText: { background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 8, boxShadow: "0 12px 30px rgba(15, 23, 42, 0.16)", boxSizing: "border-box", color: "#1f2937", display: "block", fontSize: 12, fontWeight: 600, left: "-120px", lineHeight: 1.35, marginTop: 6, maxWidth: "min(260px, calc(100vw - 32px))", padding: 10, position: "absolute", width: 260, zIndex: 5 },
  numberInput: { border: "1px solid #cbd5e1", borderRadius: 8, boxSizing: "border-box", minHeight: 36, minWidth: 0, padding: "0 8px", width: "100%" },
  checkLabel: { alignItems: "center", display: "flex", gap: 6, minHeight: 36, whiteSpace: "nowrap" },
  stateBox: { minHeight: "70vh", display: "grid", placeItems: "center", gap: 12, textAlign: "center", color: "#334155" },
  srOnly: { border: 0, clip: "rect(0 0 0 0)", height: 1, margin: -1, overflow: "hidden", padding: 0, position: "absolute", whiteSpace: "nowrap", width: 1 },
};

const RIR_HELP = "RIR - Repetições em reserva. Quantas repetições você acha que ainda conseguiria fazer ao terminar a série. RIR 0: não conseguiria outra repetição. RIR 2: conseguiria aproximadamente mais 2.";
const RPE_HELP = "RPE - Percepção de esforço. Indica o quanto a série foi difícil para você, em uma escala de 0 a 10. RPE 10: esforço máximo. RPE 8: muito difícil, mas ainda havia alguma margem.";

function pluralizePt(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export default MinhaArea;
