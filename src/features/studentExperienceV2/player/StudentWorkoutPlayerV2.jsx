import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ImageOff,
  List,
  LogOut,
  RefreshCcw,
  SkipForward,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExerciseVideoPlayer from "../../workoutExecution/components/ExerciseVideoPlayer.jsx";
import { cancelWorkoutSession, skipWorkoutExercise } from "../../../services/workoutExecutionService.js";
import { buscarMeuWorkoutPlayerV2 } from "../../../services/studentWorkoutPlayerV2Service.js";
import {
  buildPlayerPrescriptionFacts,
  derivePlayerProgress,
  isPlayerSessionTerminal,
  resolveCurrentExerciseIndex,
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

  if (state.status === "loading") return <PlayerLoading />;
  if (state.status === "error") return <PlayerState icon={AlertCircle} title="Não foi possível abrir o treino" copy={state.message} action={<button className="workout-player-button is-primary" onClick={load} type="button"><RefreshCcw aria-hidden="true" size={18} /> Tentar novamente</button>} />;
  if (state.status === "missing") return <PlayerState icon={AlertCircle} title="Treino indisponível" copy="Esta sessão não existe ou não está disponível para sua conta." action={<button className="workout-player-button" onClick={() => navigate(STUDENT_EXPERIENCE_V2_ROUTES.TRAINING)} type="button">Voltar aos treinos</button>} />;

  const player = state.data;
  if (isPlayerSessionTerminal(player.status)) return <TerminalPlayerState player={player} onLeave={() => navigate(STUDENT_EXPERIENCE_V2_ROUTES.TRAINING)} />;
  if (!player.exercises.length || currentIndex < 0) return <PlayerState icon={ImageOff} title="Treino sem exercícios" copy="A prescrição desta sessão não possui exercícios disponíveis." action={<button className="workout-player-button" onClick={() => navigate(STUDENT_EXPERIENCE_V2_ROUTES.TRAINING)} type="button">Voltar aos treinos</button>} />;

  const exercise = player.exercises[currentIndex];
  const progress = derivePlayerProgress(player.exercises, currentIndex);
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
      <SetStage trackingConfig={exercise.trackingConfig} />
      <PlayerActions
        busy={action.status !== "idle"}
        canGoNext={currentIndex < player.exercises.length - 1}
        canGoPrevious={currentIndex > 0}
        onNext={() => selectExercise(currentIndex + 1)}
        onOpenSelector={() => selectorRef.current?.showModal()}
        onPrevious={() => selectExercise(currentIndex - 1)}
        onSkip={skipCurrent}
        selectorTriggerRef={selectorTriggerRef}
      />

      <ExerciseSelector currentIndex={currentIndex} dialogRef={selectorRef} exercises={player.exercises} onClose={() => selectorTriggerRef.current?.focus()} onSelect={selectExercise} />
      <CancelDialog busy={action.status === "cancelling"} dialogRef={cancelRef} onConfirm={cancelSession} />
    </main>
  );
}

export function PlayerProgress({ progress }) {
  return <section aria-label="Progresso do treino" className="workout-player-progress"><div><span>Seu treino</span><strong>Exercício {progress.position} de {progress.total}</strong></div><div aria-valuemax={progress.total} aria-valuemin="1" aria-valuenow={progress.position} className="workout-player-progressbar" role="progressbar"><span style={{ width: `${progress.percent}%` }} /></div></section>;
}

export function ExerciseStage({ exercise, titleRef }) {
  return <article className="workout-player-stage"><div className="workout-player-stage-heading"><span className="workout-player-eyebrow">Agora</span><h1 ref={titleRef} tabIndex="-1">{exercise.name}</h1>{exercise.group && <p>{exercise.group}</p>}</div><PlayerMedia exercise={exercise} key={exercise.id} /><ExercisePrescription exercise={exercise} /></article>;
}

export function ExercisePrescription({ exercise }) {
  const facts = buildPlayerPrescriptionFacts(exercise);
  return <section aria-labelledby="workout-player-prescription-title" className="workout-player-prescription"><span className="workout-player-eyebrow">Prescrição da sessão</span><h2 id="workout-player-prescription-title">Como executar</h2>{facts.length ? <ul>{facts.map((fact) => <li key={fact}>{fact}</li>)}</ul> : <p>Sem detalhes adicionais de prescrição.</p>}{exercise.prescribedNotes && <div className="workout-player-note"><strong>Orientação</strong><p>{exercise.prescribedNotes}</p></div>}</section>;
}

export function SetStage({ trackingConfig }) {
  const configured = Object.entries(trackingConfig).filter(([, enabled]) => enabled).map(([key]) => ({ load: "carga", reps: "repetições", rir: "RIR", rpe: "RPE", duration: "duração", distance: "distância" }[key]));
  return <section aria-labelledby="workout-player-tracking-title" className="workout-player-set-stage" data-testid="set-tracker-boundary"><span className="workout-player-eyebrow">Registro de séries</span><h2 id="workout-player-tracking-title">Acompanhamento preparado</h2><p>Esta sessão acompanhará {configured.length ? configured.join(", ") : "os campos definidos pelo seu profissional"}. O registro será habilitado na próxima etapa.</p><div aria-hidden="true" data-rest-duration="" data-rest-ends-at="" data-rest-started-at="" /><div aria-hidden="true" data-previous-performance-boundary="ready" /></section>;
}

export function PlayerActions({ busy, canGoNext, canGoPrevious, onNext, onOpenSelector, onPrevious, onSkip, selectorTriggerRef }) {
  return <nav aria-label="Navegação entre exercícios" className="workout-player-actions"><button aria-label="Exercício anterior" className="workout-player-button" disabled={!canGoPrevious || busy} onClick={onPrevious} type="button"><ArrowLeft aria-hidden="true" size={19} /> Anterior</button><button aria-label="Escolher exercício" className="workout-player-button is-selector" disabled={busy} onClick={onOpenSelector} ref={selectorTriggerRef} type="button"><List aria-hidden="true" size={18} /> Exercícios <ChevronDown aria-hidden="true" size={16} /></button><button aria-label="Próximo exercício" className="workout-player-button is-primary" disabled={!canGoNext || busy} onClick={onNext} type="button">Próximo <ArrowRight aria-hidden="true" size={19} /></button><button className="workout-player-skip" disabled={busy} onClick={onSkip} type="button"><SkipForward aria-hidden="true" size={17} /> {busy ? "Aguarde..." : "Pular exercício"}</button></nav>;
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
