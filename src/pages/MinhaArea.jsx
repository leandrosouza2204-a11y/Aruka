import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Dumbbell,
  History,
  Play,
  RefreshCcw,
  Save,
  XCircle,
} from "lucide-react";
import { buscarMinhaExperienciaDiariaAluno } from "../services/studentDailyExperienceService.js";
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
} from "../features/workoutExecution/utils/workoutExecutionSession.js";

function MinhaArea() {
  const [payload, setPayload] = useState(null);
  const [executionState, setExecutionState] = useState(null);
  const [executionSession, setExecutionSession] = useState(null);
  const [selectedDayId, setSelectedDayId] = useState("");
  const [status, setStatus] = useState("loading");
  const [erro, setErro] = useState("");
  const [treinoAberto, setTreinoAberto] = useState(false);
  const [savingState, setSavingState] = useState("idle");

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
  const activeDays = daily.activeWorkout?.days || [];
  const selectedDay = activeDays.find((day) => day.id === selectedDayId) || activeDays[0] || null;

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
      setExecutionSession(null);
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
      const sets = [
        ...exercise.sets.filter((item) => item.setNumber !== setNumber),
        { ...existing, [field]: value },
      ].sort((a, b) => a.setNumber - b.setNumber);
      return { ...exercise, status: WORKOUT_EXECUTION_EXERCISE_STATUS.PARTIAL, sets };
    });
  }

  if (status === "loading") {
    return (
      <main style={styles.page} data-testid="student-daily-page">
        <section style={styles.stateBox} data-testid="student-daily-loading">
          <RefreshCcw size={22} />
          <strong>Carregando sua area...</strong>
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
          <strong>Perfil de aluno nao encontrado</strong>
          <p>Nao encontramos um perfil de aluno vinculado a esta conta.</p>
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
        <span style={styles.kicker}>Minha area</span>
        <h1 style={styles.title}>Ola, {daily.student?.name || "aluno"}</h1>
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
              <Info label="Objetivo" value={daily.activeWorkout.objective} />
              <Info label="Frequencia prescrita" value={daily.activeWorkout.daysText} />
              <Info label="Periodo" value={daily.activeWorkout.period} />
              <Info label="Status" value={daily.activeWorkout.statusText} />
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
          savingState={savingState}
          session={executionSession}
        />
      )}

      <section style={styles.cue} data-testid="student-daily-next-action">
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
            <h2 style={styles.sectionTitle}>Historico de execucao</h2>
            <p style={styles.muted}>Registros recentes feitos por voce.</p>
          </div>
          <History size={18} />
        </div>
        {historySummary.length ? (
          <div style={styles.historyList}>
            {historySummary.map((item) => (
              <article style={styles.historyItem} key={item.id}>
                <strong>{item.workoutTitle}</strong>
                <span>{item.dayName}</span>
                <p>{item.statusLabel} em {item.dateLabel}</p>
                <small>{item.exerciseCount} exercicio(s) e {item.completedSetCount} serie(s) concluidas</small>
              </article>
            ))}
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
          <p style={styles.emptyText}>Sem comparacao disponivel entre fichas.</p>
        )}
      </section>

      <section style={styles.section} data-testid="student-daily-history">
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Historico de fichas</h2>
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
          <p style={styles.emptyText}>Ainda nao ha historico de fichas disponivel.</p>
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
  savingState,
  session,
}) {
  return (
    <section style={styles.executionPanel} data-testid="student-execution-session">
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Execucao em andamento</h2>
          <p style={styles.muted}>{session.workoutTitle || "Treino atual"} - {session.dayName || "Dia de treino"}</p>
        </div>
        <CheckCircle2 size={20} />
      </div>

      <div style={styles.executionList}>
        {session.exercises.map((exercise) => (
          <article style={styles.executionExercise} key={exercise.id} data-testid="student-execution-exercise">
            <div style={styles.exerciseHeader}>
              <div>
                <h3 style={styles.cardTitle}>{exercise.name}</h3>
                <p style={styles.muted}>
                  {[exercise.prescribedSets, exercise.prescribedReps, exercise.prescribedLoad, exercise.prescribedRest]
                    .filter(Boolean)
                    .join(" - ") || "Prescricao nao informada"}
                </p>
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

            <div style={styles.setGrid}>
              {[1, 2, 3, 4, 5].map((setNumber) => {
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
                      label="Carga"
                      value={set.loadValue ?? ""}
                      onChange={(value) => onUpdateSet(exercise.id, setNumber, "loadValue", value)}
                    />
                    <NumericField
                      label="RIR"
                      value={set.rir ?? ""}
                      onChange={(value) => onUpdateSet(exercise.id, setNumber, "rir", value)}
                    />
                    <NumericField
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

function NumericField({ label, onChange, value }) {
  return (
    <label style={styles.numericField}>
      <span>{label}</span>
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

function Info({ label, value }) {
  return (
    <div style={styles.infoItem}>
      <span>{label}</span>
      <strong>{value}</strong>
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
  header: { marginBottom: 18 },
  kicker: { color: "#5b6472", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0 },
  title: { margin: "6px 0 0", fontSize: 30, lineHeight: 1.1 },
  hero: { background: "#ffffff", border: "1px solid #dde3ee", borderRadius: 8, padding: 20, marginBottom: 14 },
  heroTop: { display: "flex", gap: 12, alignItems: "center", marginBottom: 16 },
  iconBubble: { width: 40, height: 40, borderRadius: 8, display: "grid", placeItems: "center", background: "#e8f1ff", color: "#174ea6" },
  heroTitle: { margin: "4px 0 0", fontSize: 24, lineHeight: 1.15 },
  heroGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 },
  infoItem: { border: "1px solid #e5e9f1", borderRadius: 8, padding: 12, background: "#fbfcfe" },
  reviewText: { margin: "14px 0", color: "#384252", fontWeight: 600 },
  primaryButton: { border: 0, borderRadius: 8, background: "#174ea6", color: "#fff", minHeight: 44, padding: "0 16px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 800, cursor: "pointer" },
  secondaryButton: { border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff", color: "#1f2937", minHeight: 40, padding: "0 14px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 800, cursor: "pointer" },
  dangerButton: { border: "1px solid #fecaca", borderRadius: 8, background: "#fff5f5", color: "#991b1b", minHeight: 40, padding: "0 14px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 800, cursor: "pointer" },
  cue: { display: "flex", gap: 12, borderRadius: 8, padding: 16, background: "#ecfdf5", border: "1px solid #bbf7d0", color: "#14532d", marginBottom: 14 },
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
  executionList: { display: "grid", gap: 12, marginTop: 12 },
  executionExercise: { border: "1px solid #e5e9f1", borderRadius: 8, padding: 14 },
  exerciseHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 },
  setGrid: { display: "grid", gap: 8 },
  setRow: { alignItems: "end", display: "grid", gap: 8, gridTemplateColumns: "28px repeat(4, minmax(64px, 1fr)) minmax(70px, auto)" },
  numericField: { display: "grid", gap: 4, color: "#5b6472", fontSize: 12, fontWeight: 800 },
  numberInput: { border: "1px solid #cbd5e1", borderRadius: 8, boxSizing: "border-box", minHeight: 36, minWidth: 0, padding: "0 8px", width: "100%" },
  checkLabel: { alignItems: "center", display: "flex", gap: 6, minHeight: 36, whiteSpace: "nowrap" },
  stateBox: { minHeight: "70vh", display: "grid", placeItems: "center", gap: 12, textAlign: "center", color: "#334155" },
};

export default MinhaArea;
