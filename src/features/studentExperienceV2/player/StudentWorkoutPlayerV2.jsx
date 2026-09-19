import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ImageOff,
  List,
  LogOut,
  LoaderCircle,
  RefreshCcw,
  SkipForward,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExerciseVideoPlayer from "../../workoutExecution/components/ExerciseVideoPlayer.jsx";
import { cancelWorkoutSession, skipWorkoutExercise } from "../../../services/workoutExecutionService.js";
import {
  buscarMeuDesempenhoAnteriorNoWorkoutPlayerV2,
  buscarMeuWorkoutPlayerV2,
  concluirMinhaSerieNoWorkoutPlayerV2,
} from "../../../services/studentWorkoutPlayerV2Service.js";
import {
  buildPlayerSetCommandValues,
  buildPlayerSetRows,
  buildPlayerPrescriptionFacts,
  deriveCanonicalSetProgress,
  derivePlayerProgress,
  getPlayerTrackingFields,
  getPreviousSetReference,
  isPlayerSessionTerminal,
  resolveCurrentExerciseIndex,
  resolveCurrentSetNumber,
  validatePlayerSetInput,
} from "../domain/studentWorkoutPlayerV2.js";
import { STUDENT_EXPERIENCE_V2_ROUTES } from "../domain/studentExperienceV2Contracts.js";

const selectionKey = (sessionId) => `aruka:student-player-v2:${sessionId}:exercise`;

export function WorkoutPlayerV2() {
  const { sessionId = "" } = useParams();
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const selectorRef = useRef(null);
  const selectorTriggerRef = useRef(null);
  const cancelRef = useRef(null);
  const [state, setState] = useState({ status: "loading", data: null, message: "" });
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [action, setAction] = useState({ status: "idle", message: "" });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, status: "loading", message: "" }));
    try {
      const data = await buscarMeuWorkoutPlayerV2(sessionId);
      if (!data) {
        setState({ status: "missing", data: null, message: "" });
        setCurrentIndex(-1);
        return null;
      }
      const preferred = window.sessionStorage.getItem(selectionKey(sessionId)) || "";
      setState({ status: "success", data, message: "" });
      setCurrentIndex(resolveCurrentExerciseIndex(data.exercises, preferred));
      return data;
    } catch {
      setState({ status: "error", data: null, message: "Não foi possível carregar este treino. Confira sua conexão e tente novamente." });
      return null;
    }
  }, [sessionId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(load, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => titleRef.current?.focus());
    return () => window.cancelAnimationFrame(frameId);
  }, [currentIndex]);

  function selectExercise(index) {
    const exercise = state.data?.exercises[index];
    if (!exercise) return;
    window.sessionStorage.setItem(selectionKey(sessionId), exercise.id);
    setCurrentIndex(index);
    selectorRef.current?.close();
  }

  async function skipCurrent() {
    const exercise = state.data?.exercises[currentIndex];
    if (!exercise || action.status !== "idle") return;
    setAction({ status: "skipping", message: "" });
    try {
      await skipWorkoutExercise(sessionId, exercise.id);
      const refreshed = await buscarMeuWorkoutPlayerV2(sessionId);
      setState({ status: "success", data: refreshed, message: "" });
      const next = refreshed.exercises.findIndex((item, index) => index > currentIndex && item.status !== "skipped");
      setCurrentIndex(next >= 0 ? next : Math.min(currentIndex, refreshed.exercises.length - 1));
      setAction({ status: "idle", message: "Exercício pulado. Você pode continuar o treino." });
    } catch {
      setAction({ status: "idle", message: "Não foi possível pular este exercício agora." });
    }
  }

  async function cancelSession() {
    if (action.status !== "idle") return;
    setAction({ status: "cancelling", message: "" });
    try {
      await cancelWorkoutSession(sessionId, "Cancelado pelo aluno no Workout Player V2");
      cancelRef.current?.close();
      await load();
      setAction({ status: "idle", message: "" });
    } catch {
      setAction({ status: "idle", message: "Não foi possível encerrar o treino agora." });
    }
  }

  const refreshPlayer = useCallback(async () => {
    const refreshed = await buscarMeuWorkoutPlayerV2(sessionId);
    if (!refreshed) return null;
    setState({ status: "success", data: refreshed, message: "" });
    return refreshed;
  }, [sessionId]);

  function applyConfirmedSet(exerciseId, setNumber, commandSession) {
    const confirmedExercise = commandSession?.exercises?.find((item) => item.id === exerciseId);
    const confirmedSet = confirmedExercise?.sets?.find((item) => item.setNumber === setNumber && item.completed);
    if (!confirmedSet) return false;
    setState((current) => ({
      ...current,
      data: {
        ...current.data,
        lastActivityAt: commandSession.lastActivityAt,
        exercises: current.data.exercises.map((item) => item.id === exerciseId ? {
          ...item,
          status: confirmedExercise.status,
          sets: [...item.sets.filter((set) => set.setNumber !== setNumber), {
            ...confirmedSet,
            completedAt: commandSession.lastActivityAt,
          }].sort((left, right) => left.setNumber - right.setNumber),
        } : item),
      },
    }));
    return true;
  }

  if (state.status === "loading") return <PlayerLoading />;
  if (state.status === "error") return <PlayerState icon={AlertCircle} title="Não foi possível abrir o treino" copy={state.message} action={<button className="workout-player-button is-primary" onClick={load} type="button"><RefreshCcw aria-hidden="true" size={18} /> Tentar novamente</button>} />;
  if (state.status === "missing") return <PlayerState icon={AlertCircle} title="Treino indisponível" copy="Esta sessão não existe ou não está disponível para sua conta." action={<button className="workout-player-button" onClick={() => navigate(STUDENT_EXPERIENCE_V2_ROUTES.TRAINING)} type="button">Voltar aos treinos</button>} />;

  const player = state.data;
  if (isPlayerSessionTerminal(player.status)) return <TerminalPlayerState player={player} onLeave={() => navigate(STUDENT_EXPERIENCE_V2_ROUTES.TRAINING)} />;
  if (!player.exercises.length || currentIndex < 0) return <PlayerState icon={ImageOff} title="Treino sem exercícios" copy="A prescrição desta sessão não possui exercícios disponíveis." action={<button className="workout-player-button" onClick={() => navigate(STUDENT_EXPERIENCE_V2_ROUTES.TRAINING)} type="button">Voltar aos treinos</button>} />;

  const exercise = player.exercises[currentIndex];
  const progress = { ...derivePlayerProgress(player.exercises, currentIndex), sets: deriveCanonicalSetProgress(player.exercises) };
  return (
    <main className="workout-player" data-testid="student-workout-player-v2">
      <header className="workout-player-header">
        <button aria-label="Sair do player e continuar depois" className="workout-player-icon-button" onClick={() => navigate(STUDENT_EXPERIENCE_V2_ROUTES.TRAINING)} type="button"><X aria-hidden="true" size={22} /></button>
        <div className="workout-player-header-copy"><span>{player.workoutTitle}</span><strong>{player.dayName}</strong></div>
        <button aria-label="Encerrar treino" className="workout-player-icon-button" onClick={() => cancelRef.current?.showModal()} type="button"><LogOut aria-hidden="true" size={20} /></button>
      </header>

      <PlayerProgress progress={progress} />
      {action.message && <div className="workout-player-notice" role="status">{action.message}</div>}
      <ExerciseStage exercise={exercise} titleRef={titleRef} />
      <SetStage exercise={exercise} key={exercise.id} onApplyConfirmed={applyConfirmedSet} onRefresh={refreshPlayer} sessionId={sessionId} />
      <PlayerActions
        busy={action.status !== "idle"}
        canGoNext={currentIndex < player.exercises.length - 1}
        canGoPrevious={currentIndex > 0}
        onNext={() => selectExercise(currentIndex + 1)}
        onOpenSelector={() => selectorRef.current?.showModal()}
        onPrevious={() => selectExercise(currentIndex - 1)}
        onSkip={skipCurrent}
        selectorTriggerRef={selectorTriggerRef}
        skipDisabled={exercise.sets.some((set) => set.completed)}
      />

      <ExerciseSelector currentIndex={currentIndex} dialogRef={selectorRef} exercises={player.exercises} onClose={() => selectorTriggerRef.current?.focus()} onSelect={selectExercise} />
      <CancelDialog busy={action.status === "cancelling"} dialogRef={cancelRef} onConfirm={cancelSession} />
    </main>
  );
}

export function PlayerProgress({ progress }) {
  return <section aria-label="Progresso do treino" className="workout-player-progress"><div><span>{progress.sets.completed} de {progress.sets.total} séries concluídas</span><strong>Exercício {progress.position} de {progress.total}</strong></div><div aria-label={`${progress.sets.completed} de ${progress.sets.total} séries concluídas`} aria-valuemax={progress.sets.total} aria-valuemin="0" aria-valuenow={progress.sets.completed} className="workout-player-progressbar" role="progressbar"><span style={{ width: `${progress.sets.percent}%` }} /></div></section>;
}

export function ExerciseStage({ exercise, titleRef }) {
  return <article className="workout-player-stage"><div className="workout-player-stage-heading"><span className="workout-player-eyebrow">Agora</span><h1 ref={titleRef} tabIndex="-1">{exercise.name}</h1>{exercise.group && <p>{exercise.group}</p>}</div><PlayerMedia exercise={exercise} key={exercise.id} /><ExercisePrescription exercise={exercise} /></article>;
}

export function ExercisePrescription({ exercise }) {
  const facts = buildPlayerPrescriptionFacts(exercise);
  return <section aria-labelledby="workout-player-prescription-title" className="workout-player-prescription"><span className="workout-player-eyebrow">Prescrição da sessão</span><h2 id="workout-player-prescription-title">Como executar</h2>{facts.length ? <ul>{facts.map((fact) => <li key={fact}>{fact}</li>)}</ul> : <p>Sem detalhes adicionais de prescrição.</p>}{exercise.prescribedNotes && <div className="workout-player-note"><strong>Orientação</strong><p>{exercise.prescribedNotes}</p></div>}</section>;
}

export function SetStage({ exercise, onApplyConfirmed, onRefresh, sessionId }) {
  const rows = buildPlayerSetRows(exercise);
  const fields = getPlayerTrackingFields(exercise.trackingConfig);
  const [setNumber, setSetNumber] = useState(() => resolveCurrentSetNumber(exercise));
  const selected = rows.find((set) => set.setNumber === setNumber) || rows[0];
  const [values, setValues] = useState(() => valuesFromSet(selected));
  const [submission, setSubmission] = useState({ status: "idle", message: "", errors: {} });
  const [previous, setPrevious] = useState({ status: "loading", data: null });

  useEffect(() => {
    let active = true;
    buscarMeuDesempenhoAnteriorNoWorkoutPlayerV2(exercise.treinoExercicioId, sessionId)
      .then((data) => { if (active) setPrevious({ status: "success", data }); })
      .catch(() => { if (active) setPrevious({ status: "error", data: null }); });
    return () => { active = false; };
  }, [exercise.treinoExercicioId, sessionId]);

  function selectSet(nextSetNumber, preserveMessage = false) {
    const next = rows.find((set) => set.setNumber === nextSetNumber);
    setSetNumber(nextSetNumber);
    setValues(valuesFromSet(next));
    if (!preserveMessage) setSubmission({ status: "idle", message: "", errors: {} });
  }

  function updateValue(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setSubmission((current) => ({ ...current, message: "", errors: { ...current.errors, [field]: "" } }));
  }

  function moveAfterCompletion(refreshedExercise = exercise) {
    const refreshedRows = buildPlayerSetRows(refreshedExercise || exercise);
    const next = refreshedRows.find((set) => !set.completed && set.setNumber > setNumber)
      || refreshedRows.find((set) => !set.completed);
    if (next) selectSet(next.setNumber, true);
  }

  async function reconcile() {
    setSubmission((current) => ({ ...current, status: "submitting", message: "Verificando o registro..." }));
    try {
      const refreshed = await onRefresh();
      const refreshedExercise = refreshed?.exercises.find((item) => item.id === exercise.id);
      if (refreshedExercise?.sets.some((set) => set.setNumber === setNumber && set.completed)) {
        setSubmission({ status: "idle", message: "Série confirmada e recuperada.", errors: {} });
        moveAfterCompletion(refreshedExercise);
      } else {
        setSubmission({ status: "idle", message: "A série ainda não foi registrada. Você pode tentar novamente.", errors: {} });
      }
    } catch {
      setSubmission({ status: "uncertain", message: "Ainda não foi possível confirmar o registro. Verifique sua conexão.", errors: {} });
    }
  }

  async function completeSet(event) {
    event.preventDefault();
    const validation = validatePlayerSetInput(values, exercise.trackingConfig);
    if (!validation.valid) {
      setSubmission({ status: "idle", message: "Revise os campos indicados.", errors: validation.errors });
      return;
    }
    setSubmission({ status: "submitting", message: "Registrando série...", errors: {} });
    try {
      const result = await concluirMinhaSerieNoWorkoutPlayerV2(sessionId, exercise.id, setNumber, buildPlayerSetCommandValues(values, exercise.trackingConfig));
      if (!onApplyConfirmed(exercise.id, setNumber, result)) throw new Error("SET_CONFIRMATION_MISSING");
      setSubmission({ status: "idle", message: "Série registrada com sucesso.", errors: {} });
      try {
        const refreshed = await onRefresh();
        moveAfterCompletion(refreshed?.exercises.find((item) => item.id === exercise.id));
      } catch {
        moveAfterCompletion();
      }
    } catch {
      setSubmission({ status: "submitting", message: "Verificando se o registro foi concluído...", errors: {} });
      try {
        const refreshed = await onRefresh();
        const refreshedExercise = refreshed?.exercises.find((item) => item.id === exercise.id);
        if (refreshedExercise?.sets.some((set) => set.setNumber === setNumber && set.completed)) {
          setSubmission({ status: "idle", message: "Série confirmada pelo servidor.", errors: {} });
          moveAfterCompletion(refreshedExercise);
        } else {
          setSubmission({ status: "idle", message: "Não foi possível registrar a série. Seus dados foram preservados.", errors: {} });
        }
      } catch {
        setSubmission({ status: "uncertain", message: "Não foi possível confirmar o registro. Verifique antes de tentar novamente.", errors: {} });
      }
    }
  }

  const previousReference = getPreviousSetReference(previous.data, setNumber);
  const hasReservedTracking = exercise.trackingConfig.duration || exercise.trackingConfig.distance;
  return <section aria-labelledby="workout-player-tracking-title" className="workout-player-set-stage" data-testid="set-tracker-boundary">
    <span className="workout-player-eyebrow">Registro atual</span>
    <div className="workout-player-set-heading"><h2 id="workout-player-tracking-title">Série {setNumber} de {rows.length}</h2><strong>{rows.filter((set) => set.completed).length}/{rows.length} concluídas</strong></div>
    <div aria-label="Escolher série" className="workout-player-set-selector" role="group">{rows.map((set) => <button aria-label={`Série ${set.setNumber}${set.completed ? ", concluída" : ""}`} aria-pressed={set.setNumber === setNumber} className={set.completed ? "is-complete" : ""} key={set.setNumber} onClick={() => selectSet(set.setNumber)} type="button">{set.completed ? <CheckCircle2 aria-hidden="true" size={17} /> : set.setNumber}</button>)}</div>
    <PreviousPerformance previous={previous} reference={previousReference} setNumber={setNumber} />
    {selected.completed ? <CompletedSet set={selected} trackingConfig={exercise.trackingConfig} /> : fields.length ? <form className="workout-player-set-form" onSubmit={completeSet}>
      <TrackingFields errors={submission.errors} fields={fields} onChange={updateValue} values={values} />
      {hasReservedTracking && <p className="workout-player-field-note">Duração e distância ainda não fazem parte do registro canônico desta etapa.</p>}
      {submission.message && <p className={`workout-player-set-message ${submission.status === "uncertain" ? "is-error" : ""}`} role="status">{submission.message}</p>}
      {submission.status === "uncertain" ? <button className="workout-player-button is-primary" onClick={reconcile} type="button"><RefreshCcw aria-hidden="true" size={18} /> Verificar registro</button> : <button className="workout-player-button is-primary workout-player-complete-set" disabled={submission.status === "submitting"} type="submit">{submission.status === "submitting" ? <LoaderCircle aria-hidden="true" className="is-spinning" size={18} /> : <CheckCircle2 aria-hidden="true" size={18} />} {submission.status === "submitting" ? "Registrando..." : "Concluir série"}</button>}
    </form> : <p>Os campos configurados para este exercício ainda não possuem persistência canônica. Nenhuma conclusão foi criada.</p>}
    <div aria-hidden="true" data-rest-duration={exercise.prescribedRest} data-rest-ends-at="" data-rest-started-at={selected.completedAt || ""} />
  </section>;
}

export function PlayerActions({ busy, canGoNext, canGoPrevious, onNext, onOpenSelector, onPrevious, onSkip, selectorTriggerRef, skipDisabled }) {
  return <nav aria-label="Navegação entre exercícios" className="workout-player-actions"><button aria-label="Exercício anterior" className="workout-player-button" disabled={!canGoPrevious || busy} onClick={onPrevious} type="button"><ArrowLeft aria-hidden="true" size={19} /> Anterior</button><button aria-label="Escolher exercício" className="workout-player-button is-selector" disabled={busy} onClick={onOpenSelector} ref={selectorTriggerRef} type="button"><List aria-hidden="true" size={18} /> Exercícios <ChevronDown aria-hidden="true" size={16} /></button><button aria-label="Próximo exercício" className="workout-player-button is-primary" disabled={!canGoNext || busy} onClick={onNext} type="button">Próximo <ArrowRight aria-hidden="true" size={19} /></button><button className="workout-player-skip" disabled={busy || skipDisabled} onClick={onSkip} type="button"><SkipForward aria-hidden="true" size={17} /> {skipDisabled ? "Exercício iniciado" : busy ? "Aguarde..." : "Pular exercício"}</button></nav>;
}

function TrackingFields({ errors, fields, onChange, values }) {
  return <div className="workout-player-fields">
    {fields.includes("reps") && <NumberField error={errors.reps} field="reps" label="Repetições realizadas" min="0" onChange={onChange} step="1" value={values.reps} />}
    {fields.includes("load") && <div className="workout-player-load-fields"><NumberField disabled={values.loadUnit === "bodyweight"} error={errors.load} field="loadValue" label="Carga realizada" min="0" onChange={onChange} step="0.01" value={values.loadValue} /><label>Unidade<select onChange={(event) => onChange("loadUnit", event.target.value)} value={values.loadUnit}><option value="kg">kg</option><option value="lb">lb</option><option value="machine_level">nível da máquina</option><option value="bodyweight">peso corporal</option><option value="unknown">outra unidade</option></select></label></div>}
    {fields.includes("rir") && <NumberField error={errors.rir} field="rir" label="RIR (0 a 10)" max="10" min="0" onChange={onChange} step="1" value={values.rir} />}
    {fields.includes("rpe") && <NumberField error={errors.rpe} field="rpe" label="RPE (0 a 10)" max="10" min="0" onChange={onChange} step="0.1" value={values.rpe} />}
  </div>;
}

function NumberField({ disabled = false, error, field, label, max, min, onChange, step, value }) {
  const errorId = `workout-player-${field}-error`;
  return <label>{label}<input aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)} disabled={disabled} inputMode="decimal" max={max} min={min} onChange={(event) => onChange(field, event.target.value)} step={step} type="number" value={disabled ? "" : value} />{error && <small id={errorId}>{error}</small>}</label>;
}

function CompletedSet({ set, trackingConfig }) {
  const fields = getPlayerTrackingFields(trackingConfig);
  const facts = [];
  if (fields.includes("reps")) facts.push(["Repetições", set.reps]);
  if (fields.includes("load")) facts.push(["Carga", set.bodyweight ? "Peso corporal" : set.loadValue === "" ? "Não informada" : `${set.loadValue} ${set.loadUnit}`]);
  if (fields.includes("rir")) facts.push(["RIR", set.rir]);
  if (fields.includes("rpe")) facts.push(["RPE", set.rpe]);
  return <div className="workout-player-completed-set"><div><CheckCircle2 aria-hidden="true" size={20} /><strong>Série confirmada</strong></div><dl>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value === "" ? "Não informado" : value}</dd></div>)}</dl><p>Este registro está somente para leitura.</p></div>;
}

function PreviousPerformance({ previous, reference, setNumber }) {
  return <aside aria-label="Desempenho anterior" className="workout-player-previous" data-previous-performance-boundary="ready"><strong>Desempenho anterior</strong>{previous.status === "loading" ? <p>Buscando última execução válida...</p> : previous.status === "error" ? <p>Referência indisponível agora. Isso não impede seu registro.</p> : reference ? <p>Série {setNumber}: {reference.facts.join(" · ")}.</p> : <p>Sem referência válida para esta série.</p>}</aside>;
}

function valuesFromSet(set = {}) {
  return {
    reps: set.reps ?? "",
    loadValue: set.loadValue ?? "",
    loadUnit: set.bodyweight ? "bodyweight" : (set.loadUnit || "kg"),
    rir: set.rir ?? "",
    rpe: set.rpe ?? "",
  };
}

function PlayerMedia({ exercise }) {
  const [broken, setBroken] = useState(false);
  if (exercise.media.type === "image" && !broken) return <figure className="workout-player-media"><img alt={exercise.media.alt || `Demonstração de ${exercise.name}`} loading="eager" onError={() => setBroken(true)} src={exercise.media.url} /></figure>;
  if (exercise.media.type === "youtube" || exercise.media.type === "uploaded_video") return <div className="workout-player-media"><ExerciseVideoPlayer media={exercise.media} title={exercise.name} treinoExercicioId={exercise.treinoExercicioId} /></div>;
  return <div className="workout-player-media-fallback"><ImageOff aria-hidden="true" size={24} /><span>Sem demonstração disponível</span></div>;
}

function ExerciseSelector({ currentIndex, dialogRef, exercises, onClose, onSelect }) {
  return <dialog aria-labelledby="exercise-selector-title" className="workout-player-dialog" onClose={onClose} ref={dialogRef}><div className="workout-player-dialog-heading"><div><span className="workout-player-eyebrow">Navegação</span><h2 id="exercise-selector-title">Escolha um exercício</h2></div><button aria-label="Fechar seletor de exercícios" className="workout-player-icon-button" onClick={() => dialogRef.current?.close()} type="button"><X aria-hidden="true" size={21} /></button></div><ol className="workout-player-exercise-list">{exercises.map((exercise, index) => <li key={exercise.id}><button aria-current={index === currentIndex ? "step" : undefined} onClick={() => onSelect(index)} type="button"><span>{index + 1}</span><strong>{exercise.name}</strong>{exercise.status === "skipped" && <small>Pulado</small>}</button></li>)}</ol></dialog>;
}

function CancelDialog({ busy, dialogRef, onConfirm }) {
  return <dialog aria-labelledby="cancel-workout-title" className="workout-player-dialog is-confirmation" ref={dialogRef}><span className="workout-player-eyebrow">Atenção</span><h2 id="cancel-workout-title">Encerrar este treino?</h2><p>Encerrar cancela a sessão. Se quiser continuar depois, apenas saia do player.</p><div className="workout-player-dialog-actions"><button className="workout-player-button" disabled={busy} onClick={() => dialogRef.current?.close()} type="button">Continuar treinando</button><button className="workout-player-button is-danger" disabled={busy} onClick={onConfirm} type="button">{busy ? "Encerrando..." : "Encerrar treino"}</button></div></dialog>;
}

function TerminalPlayerState({ onLeave, player }) {
  const label = player.status === "completed" ? "Treino concluído" : "Treino encerrado";
  return <PlayerState icon={CheckCircle2} title={label} copy="Esta sessão não aceita novas alterações." action={<button className="workout-player-button is-primary" onClick={onLeave} type="button">Voltar aos treinos</button>} />;
}

function PlayerState({ action, copy, icon: Icon, title }) {
  return <main className="workout-player workout-player-state"><Icon aria-hidden="true" size={30} /><h1>{title}</h1><p>{copy}</p>{action}</main>;
}

function PlayerLoading() {
  return <main aria-busy="true" aria-label="Carregando treino" className="workout-player workout-player-loading"><div /><div /><div /><span className="sr-only" aria-live="polite">Carregando treino...</span></main>;
}

export default WorkoutPlayerV2;
