import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Dumbbell, ImageOff, Play, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ExerciseVideoPlayer from "../../workoutExecution/components/ExerciseVideoPlayer.jsx";
import { iniciarExecucaoTreino } from "../../../services/workoutExecutionService.js";
import {
  buscarDetalhesMeuTreinoV2,
  buscarMinhaBibliotecaTreinosV2,
} from "../../../services/studentTrainingLibraryV2Service.js";
import { buildPrescriptionFacts, isRecentlyCompleted } from "../domain/studentTrainingLibraryV2.js";
import { STUDENT_EXPERIENCE_V2_ROUTES } from "../domain/studentExperienceV2Contracts.js";

function StudentTrainingLibraryV2() {
  const { workoutId = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const actionLock = useRef(false);
  const [libraryState, setLibraryState] = useState({ status: "loading", data: null, error: "" });
  const [detailState, setDetailState] = useState({ status: workoutId ? "loading" : "idle", data: null, error: "" });
  const [actionState, setActionState] = useState({ status: "idle", message: "" });

  const loadLibrary = useCallback(async () => {
    setLibraryState((current) => ({ ...current, status: "loading", error: "" }));
    try {
      const data = await buscarMinhaBibliotecaTreinosV2();
      setLibraryState({ status: "success", data, error: "" });
      return data;
    } catch (error) {
      setLibraryState({ status: "error", data: null, error: error.message });
      throw error;
    }
  }, []);

  const loadDetail = useCallback(async () => {
    if (!workoutId) return null;
    setDetailState({ status: "loading", data: null, error: "" });
    try {
      const data = await buscarDetalhesMeuTreinoV2(workoutId);
      setDetailState({ status: "success", data, error: "" });
      return data;
    } catch (error) {
      setDetailState({ status: "error", data: null, error: error.message });
      throw error;
    }
  }, [workoutId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => loadLibrary().catch(() => {}), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadLibrary]);
  useEffect(() => {
    if (!workoutId) return undefined;
    const timeoutId = window.setTimeout(() => loadDetail().catch(() => {}), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadDetail, workoutId]);
  useEffect(() => {
    if (!workoutId && location.state?.focusWorkoutId) {
      window.requestAnimationFrame(() => document.querySelector(`[data-workout-link="${location.state.focusWorkoutId}"]`)?.focus());
    }
  }, [location.state, workoutId]);

  async function startOrContinue(workout) {
    if (actionLock.current) return;
    const active = libraryState.data?.activeSession;
    if (active?.id) {
      navigate(`/workout/${active.id}`);
      return;
    }

    actionLock.current = true;
    setActionState({ status: "starting", message: "" });
    try {
      const freshLibrary = await buscarMinhaBibliotecaTreinosV2();
      setLibraryState({ status: "success", data: freshLibrary, error: "" });
      if (freshLibrary.activeSession?.id) {
        navigate(`/workout/${freshLibrary.activeSession.id}`);
        return;
      }
      const freshWorkout = freshLibrary.workouts.find((item) => item.id === workout.id);
      if (!freshWorkout || !freshLibrary.currentProgram?.id) throw new Error("Treino indisponível.");
      const session = await iniciarExecucaoTreino({
        treinoId: freshLibrary.currentProgram.id,
        treinoDiaId: freshWorkout.id,
      });
      if (!session?.id) throw new Error("Sessão indisponível.");
      navigate(`/workout/${session.id}`);
    } catch {
      setActionState({ status: "error", message: "Não foi possível iniciar o treino agora. Tente novamente." });
    } finally {
      actionLock.current = false;
      setActionState((current) => current.status === "error" ? current : { status: "idle", message: "" });
    }
  }

  if (workoutId) {
    return <WorkoutDetail actionState={actionState} detailState={detailState} library={libraryState.data} onRetry={loadDetail} onStart={startOrContinue} />;
  }
  if (libraryState.status === "loading") return <LibrarySkeleton />;
  if (libraryState.status === "error") return <LibraryError message={libraryState.error} onRetry={loadLibrary} />;

  const library = libraryState.data;
  return (
    <div className="student-training-library" data-testid="student-training-library-v2">
      <header className="student-training-heading">
        <span className="student-v2-eyebrow">Biblioteca de treinos</span>
        <h1>Seus treinos</h1>
        <p>Escolha um treino para ver a prescrição ou começar.</p>
      </header>

      {actionState.message && <div className="student-v2-inline-error" role="alert">{actionState.message}</div>}
      {library.activeSession && <ActiveSessionBanner session={library.activeSession} onContinue={() => startOrContinue({ id: library.activeSession.treinoDiaId })} />}

      {!library.currentProgram ? <NoProgram /> : (
        <>
          <ProgramContext program={library.currentProgram} />
          {library.workouts.length === 0 ? <EmptyProgram /> : (
            <section aria-labelledby="student-workouts-title">
              <div className="student-training-section-title">
                <div><span className="student-v2-eyebrow">Prescrição atual</span><h2 id="student-workouts-title">Treinos disponíveis</h2></div>
                <span>{formatWorkoutCount(library.workouts.length)}</span>
              </div>
              <ul className="student-workout-grid">
                {library.workouts.map((workout) => (
                  <WorkoutCard
                    activeSession={library.activeSession}
                    disabled={actionState.status === "starting"}
                    key={workout.id}
                    onStart={() => startOrContinue(workout)}
                    workout={workout}
                  />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function ProgramContext({ program }) {
  return (
    <section aria-labelledby="training-program-title" className="student-v2-card student-program-context" data-testid="student-training-program">
      <div><span className="student-v2-eyebrow">Seu programa</span><h2 id="training-program-title">{program.displayName}</h2></div>
      <div className="student-program-facts">
        {program.objective && <span>{program.objective}</span>}
        {program.level && <span>{program.level}</span>}
        {program.weeklyTarget && <strong>{program.weeklyTarget} {program.weeklyTarget === 1 ? "treino" : "treinos"} por semana</strong>}
      </div>
    </section>
  );
}

function ActiveSessionBanner({ session, onContinue }) {
  return (
    <section aria-labelledby="training-active-session-title" className="student-v2-card student-training-active" data-testid="student-training-active-session">
      <div className="student-v2-card-icon"><Play aria-hidden="true" fill="currentColor" size={20} /></div>
      <div><span className="student-v2-eyebrow">Em andamento</span><h2 id="training-active-session-title">{session.dayName}</h2>{session.dayName !== session.workoutTitle && <p>{session.workoutTitle}</p>}</div>
      <button className="student-v2-button student-v2-button-primary" onClick={onContinue} type="button">Continuar treino <ArrowRight aria-hidden="true" size={18} /></button>
    </section>
  );
}

function WorkoutCard({ activeSession, disabled, onStart, workout }) {
  const active = activeSession?.treinoDiaId === workout.id;
  const recentlyCompleted = isRecentlyCompleted(workout.lastCompletedAt);
  const facts = [formatExerciseCount(workout.exerciseCount), workout.setCount ? `${workout.setCount} séries` : ""].filter(Boolean);
  return (
    <li className={`student-v2-card student-workout-card${active ? " is-active" : ""}`} data-testid="student-workout-card">
      <div className="student-workout-card-top">
        <div className="student-v2-card-icon"><Dumbbell aria-hidden="true" size={21} /></div>
        {active ? <span className="student-workout-status is-active">Em andamento</span> : recentlyCompleted ? <span className="student-workout-status"><CheckCircle2 aria-hidden="true" size={14} /> Concluído recentemente</span> : null}
      </div>
      <div><h3>{workout.name}</h3>{workout.muscleGroups && <p className="student-v2-card-subtitle">{workout.muscleGroups}</p>}<p className="student-v2-facts">{facts.join(" · ")}</p></div>
      <div className="student-workout-actions">
        <Link className="student-v2-button student-v2-button-secondary" data-workout-link={workout.id} to={`${STUDENT_EXPERIENCE_V2_ROUTES.TRAINING}/${workout.id}`}>Ver detalhes</Link>
        <button className="student-v2-button student-v2-button-primary" disabled={disabled} onClick={onStart} type="button">
          <Play aria-hidden="true" fill="currentColor" size={17} /> {activeSession ? "Continuar" : disabled ? "Preparando..." : "Iniciar"}
        </button>
      </div>
    </li>
  );
}

function WorkoutDetail({ actionState, detailState, library, onRetry, onStart }) {
  const titleRef = useRef(null);
  useEffect(() => {
    if (detailState.status === "success") titleRef.current?.focus();
  }, [detailState.status]);
  if (detailState.status === "loading") return <DetailSkeleton />;
  if (detailState.status === "error") return <LibraryError detail message={detailState.error} onRetry={onRetry} />;
  if (!detailState.data) {
    return <section className="student-v2-state"><AlertCircle aria-hidden="true" size={25} /><span className="student-v2-eyebrow">Treino indisponível</span><h1>Não encontramos este treino</h1><p>Ele pode ter sido atualizado pelo seu profissional.</p><Link className="student-v2-button student-v2-button-secondary" to={STUDENT_EXPERIENCE_V2_ROUTES.TRAINING}>Voltar aos treinos</Link></section>;
  }
  const detail = detailState.data;
  const activeSession = library?.activeSession;
  return (
    <article className="student-training-detail" data-testid="student-workout-detail-v2">
      <Link className="student-v2-text-link student-training-back" state={{ focusWorkoutId: detail.id }} to={STUDENT_EXPERIENCE_V2_ROUTES.TRAINING}><ArrowLeft aria-hidden="true" size={18} /> Voltar aos treinos</Link>
      <header className="student-training-detail-header">
        <span className="student-v2-eyebrow">Detalhes do treino</span>
        <h1 ref={titleRef} tabIndex="-1">{detail.name}</h1>
        {detail.muscleGroups && <p>{detail.muscleGroups}</p>}
        <p className="student-v2-facts">{[formatExerciseCount(detail.exerciseCount), detail.setCount ? `${detail.setCount} séries` : ""].filter(Boolean).join(" · ")}</p>
      </header>
      {actionState.message && <div className="student-v2-inline-error" role="alert">{actionState.message}</div>}
      <section aria-labelledby="student-exercises-title">
        <div className="student-training-section-title"><div><span className="student-v2-eyebrow">Prescrição</span><h2 id="student-exercises-title">Exercícios</h2></div></div>
        {detail.exercises.length ? <ol className="student-exercise-list">{detail.exercises.map((exercise) => <ExerciseCard exercise={exercise} key={exercise.id} />)}</ol> : <div className="student-v2-card student-training-empty"><ImageOff aria-hidden="true" size={24} /><h2>Nenhum exercício disponível</h2><p>Seu profissional ainda não adicionou exercícios a este treino.</p></div>}
      </section>
      <div className="student-training-sticky-action">
        <button className="student-v2-button student-v2-button-primary" disabled={actionState.status === "starting" || !detail.exercises.length} onClick={() => onStart(detail)} type="button">
          <Play aria-hidden="true" fill="currentColor" size={18} /> {activeSession ? "Continuar treino em andamento" : actionState.status === "starting" ? "Preparando..." : "Iniciar treino"}
        </button>
      </div>
    </article>
  );
}

function ExerciseCard({ exercise }) {
  const facts = buildPrescriptionFacts(exercise);
  return (
    <li className="student-v2-card student-exercise-card">
      <div className="student-exercise-order" aria-hidden="true">{exercise.order || "•"}</div>
      <div className="student-exercise-copy">
        <h3>{exercise.name}</h3>
        <p className="student-exercise-prescription">{facts.length ? facts.join(" · ") : "Prescrição não informada"}</p>
        {exercise.notes && <details className="student-exercise-notes"><summary>Observação do exercício</summary><p>{exercise.notes}</p></details>}
        <ExerciseVideoPlayer media={exercise.media} title={exercise.name} treinoExercicioId={exercise.id} videoUrl={exercise.videoUrl} />
        {!exercise.media?.type && !exercise.videoUrl && <span className="student-exercise-media-fallback"><ImageOff aria-hidden="true" size={15} /> Sem demonstração em vídeo</span>}
      </div>
    </li>
  );
}

function NoProgram() {
  return <section className="student-v2-card student-training-empty" data-testid="student-training-no-program"><Dumbbell aria-hidden="true" size={26} /><span className="student-v2-eyebrow">Seu programa</span><h2>Seus treinos ainda não estão disponíveis</h2><p>Quando seu profissional liberar um programa, os treinos aparecerão aqui.</p></section>;
}

function EmptyProgram() {
  return <section className="student-v2-card student-training-empty" data-testid="student-training-empty-program"><Dumbbell aria-hidden="true" size={26} /><h2>Seu programa ainda não possui treinos</h2><p>Assim que seu profissional adicionar os treinos, você poderá consultá-los aqui.</p></section>;
}

function LibraryError({ detail = false, message, onRetry }) {
  return <section aria-labelledby="student-training-error-title" className="student-v2-state student-v2-error" data-testid={detail ? "student-workout-detail-error" : "student-training-error"}><AlertCircle aria-hidden="true" size={25} /><h1 id="student-training-error-title">{detail ? "Não foi possível abrir este treino" : "Não foi possível carregar seus treinos"}</h1><p>{message || "Confira sua conexão e tente novamente."}</p><button className="student-v2-button student-v2-button-primary" onClick={() => onRetry().catch(() => {})} type="button"><RefreshCcw aria-hidden="true" size={18} /> Tentar novamente</button>{detail && <Link className="student-v2-text-link" to={STUDENT_EXPERIENCE_V2_ROUTES.TRAINING}>Voltar aos treinos</Link>}</section>;
}

function LibrarySkeleton() {
  return <div aria-busy="true" aria-label="Carregando seus treinos" className="student-training-library student-v2-skeleton" data-testid="student-training-loading"><div className="student-v2-skeleton-line is-short" /><div className="student-v2-skeleton-line is-title" /><div className="student-v2-skeleton-card is-small" /><div className="student-workout-grid"><div className="student-v2-skeleton-card is-small" /><div className="student-v2-skeleton-card is-small" /></div><span className="sr-only" aria-live="polite">Carregando seus treinos...</span></div>;
}

function DetailSkeleton() {
  return <div aria-busy="true" aria-label="Carregando detalhes do treino" className="student-training-detail student-v2-skeleton" data-testid="student-workout-detail-loading"><div className="student-v2-skeleton-line is-short" /><div className="student-v2-skeleton-line is-title" /><div className="student-v2-skeleton-card" /><span className="sr-only" aria-live="polite">Carregando detalhes do treino...</span></div>;
}

function formatExerciseCount(count) {
  return `${count} ${count === 1 ? "exercício" : "exercícios"}`;
}

function formatWorkoutCount(count) {
  return `${count} ${count === 1 ? "treino" : "treinos"}`;
}

export default StudentTrainingLibraryV2;
