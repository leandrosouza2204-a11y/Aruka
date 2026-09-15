import { Activity, AlertCircle, ArrowRight, CalendarDays, Dumbbell, Play, RefreshCcw, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { iniciarExecucaoTreino } from "../../../services/workoutExecutionService.js";
import { useStudentExperienceV2 } from "../context/studentExperienceV2Context.js";
import { buildStudentHomeV2, formatShortDate } from "../domain/studentHomeV2.js";
import { STUDENT_EXPERIENCE_V2_ROUTES } from "../domain/studentExperienceV2Contracts.js";

function StudentHomeV2() {
  const navigate = useNavigate();
  const { error, home, reload, status } = useStudentExperienceV2();
  const [actionState, setActionState] = useState({ status: "idle", message: "" });
  const view = useMemo(() => buildStudentHomeV2(home || {}), [home]);

  async function retry() {
    setActionState({ status: "idle", message: "" });
    try { await reload(); } catch { /* A mensagem segura permanece no estado compartilhado. */ }
  }

  async function startWorkout() {
    if (view.activeSession?.id) {
      navigate(`/workout/${view.activeSession.id}`);
      return;
    }
    if (!view.todayWorkout?.treinoId) return;

    setActionState({ status: "starting", message: "" });
    try {
      const freshHome = buildStudentHomeV2(await reload());
      if (freshHome.activeSession?.id) {
        navigate(`/workout/${freshHome.activeSession.id}`);
        return;
      }
      const session = await iniciarExecucaoTreino({
        treinoId: freshHome.todayWorkout?.treinoId || view.todayWorkout.treinoId,
        treinoDiaId: freshHome.todayWorkout?.treinoDiaId || view.todayWorkout.treinoDiaId,
      });
      if (!session?.id) throw new Error("Sessão indisponível.");
      navigate(`/workout/${session.id}`);
    } catch {
      setActionState({ status: "error", message: "Não foi possível iniciar o treino agora. Tente novamente." });
    }
  }

  if (status === "loading") return <StudentHomeSkeleton />;
  if (status === "error") {
    return (
      <section aria-labelledby="student-home-error-title" className="student-v2-state student-v2-error" data-testid="student-home-error">
        <AlertCircle aria-hidden="true" size={25} />
        <h1 id="student-home-error-title">Não foi possível carregar sua área</h1>
        <p>{error?.message || "Confira sua conexão e tente novamente."}</p>
        <button className="student-v2-button student-v2-button-primary" onClick={retry} type="button">
          <RefreshCcw aria-hidden="true" size={18} /> Tentar novamente
        </button>
      </section>
    );
  }

  return (
    <div className="student-home-v2" data-testid="student-home-v2">
      <section aria-labelledby="student-home-title" className="student-home-intro">
        <span className="student-v2-eyebrow">Seu próximo passo</span>
        <h1 id="student-home-title">O que você treina hoje</h1>
        <p>Seu treino e seu progresso, sem distrações.</p>
      </section>

      {actionState.message && <div className="student-v2-inline-error" role="alert">{actionState.message}</div>}

      {view.activeSession ? (
        <ActiveSessionCard onContinue={startWorkout} session={view.activeSession} />
      ) : view.todayWorkout ? (
        <TodayWorkoutCard disabled={actionState.status === "starting"} onStart={startWorkout} workout={view.todayWorkout} />
      ) : (
        <NoWorkoutCard hasProgram={Boolean(view.currentProgram)} />
      )}

      <div className="student-home-grid">
        <WeeklyProgress progress={view.weeklyProgress} />
        <ProgramCard program={view.currentProgram} />
        {view.review.status !== "unavailable" && <ReviewCard review={view.review} />}
        <EvolutionCard summary={view.evolutionSummary} />
      </div>
    </div>
  );
}

function ActiveSessionCard({ onContinue, session }) {
  const progress = session.totalSetCount
    ? `${session.completedSetCount} de ${session.totalSetCount} séries`
    : `${session.completedSetCount} ${session.completedSetCount === 1 ? "série concluída" : "séries concluídas"}`;
  return (
    <section aria-labelledby="active-session-title" className="student-v2-card student-v2-hero-card is-active-session" data-testid="student-home-active-session">
      <div className="student-v2-card-icon"><Play aria-hidden="true" size={21} fill="currentColor" /></div>
      <div className="student-v2-card-copy">
        <span className="student-v2-eyebrow">Treino em andamento</span>
        <h2 id="active-session-title">{session.dayName || session.workoutTitle}</h2>
        {session.dayName !== session.workoutTitle && <p className="student-v2-card-subtitle">{session.workoutTitle}</p>}
        {session.muscleGroups && <p>{session.muscleGroups}</p>}
        <div aria-label={`Progresso: ${progress}`} className="student-v2-progress-copy">
          <span>Progresso</span><strong>{progress}</strong>
        </div>
      </div>
      <button className="student-v2-button student-v2-button-primary" onClick={onContinue} type="button">Continuar treino <ArrowRight aria-hidden="true" size={18} /></button>
    </section>
  );
}

function TodayWorkoutCard({ disabled, onStart, workout }) {
  const facts = [
    workout.exerciseCount ? `${workout.exerciseCount} ${workout.exerciseCount === 1 ? "exercício" : "exercícios"}` : "",
    workout.setCount ? `${workout.setCount} séries` : "",
  ].filter(Boolean);
  return (
    <section aria-labelledby="today-workout-title" className="student-v2-card student-v2-hero-card" data-testid="student-home-today-workout">
      <div className="student-v2-card-icon"><Dumbbell aria-hidden="true" size={22} /></div>
      <div className="student-v2-card-copy">
        <span className="student-v2-eyebrow">Treino de hoje</span>
        <h2 id="today-workout-title">{workout.name}</h2>
        {workout.muscleGroups && <p className="student-v2-card-subtitle">{workout.muscleGroups}</p>}
        {facts.length > 0 && <p className="student-v2-facts">{facts.join(" · ")}</p>}
      </div>
      <button className="student-v2-button student-v2-button-primary" disabled={disabled} onClick={onStart} type="button">
        <Play aria-hidden="true" size={18} fill="currentColor" /> {disabled ? "Preparando..." : "Iniciar treino"}
      </button>
    </section>
  );
}

function NoWorkoutCard({ hasProgram }) {
  return (
    <section aria-labelledby="no-workout-title" className="student-v2-card student-v2-hero-card student-v2-empty" data-testid="student-home-no-workout">
      <div className="student-v2-card-icon"><Sparkles aria-hidden="true" size={22} /></div>
      <div className="student-v2-card-copy">
        <span className="student-v2-eyebrow">Hoje</span>
        <h2 id="no-workout-title">{hasProgram ? "Nenhum treino definido para agora" : "Seu treino ainda não está disponível"}</h2>
        <p>{hasProgram ? "Você pode consultar os treinos disponíveis e escolher seu próximo passo." : "Quando seu profissional liberar o programa, ele aparecerá aqui."}</p>
      </div>
      {hasProgram && <Link className="student-v2-button student-v2-button-secondary" to={STUDENT_EXPERIENCE_V2_ROUTES.TRAINING}>Ver treinos</Link>}
    </section>
  );
}

function WeeklyProgress({ progress }) {
  return (
    <section aria-labelledby="weekly-progress-title" className="student-v2-card" data-testid="student-home-weekly-progress">
      <span className="student-v2-eyebrow">Semana</span>
      <h2 id="weekly-progress-title">{progress.text}</h2>
      {progress.percentage !== null && (
        <div aria-label={`${progress.percentage}% da meta semanal`} aria-valuemax="100" aria-valuemin="0" aria-valuenow={progress.percentage} className="student-v2-progress" role="progressbar">
          <span style={{ width: `${progress.percentage}%` }} />
        </div>
      )}
      <p>{progress.targetCount ? "Sua meta acompanha a frequência prescrita." : "A frequência aparece quando estiver definida no programa."}</p>
    </section>
  );
}

function ProgramCard({ program }) {
  return (
    <section aria-labelledby="current-program-title" className="student-v2-card" data-testid="student-home-current-program">
      <span className="student-v2-eyebrow">Seu programa</span>
      <h2 id="current-program-title">{program?.displayName || "Programa ainda não disponível"}</h2>
      {program ? (
        <>
          {program.objective && <p>{program.objective}</p>}
          {program.weeklyTarget && <strong>{program.weeklyTarget} {program.weeklyTarget === 1 ? "treino" : "treinos"} por semana</strong>}
        </>
      ) : <p>Seu programa atual aparecerá aqui após a liberação.</p>}
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <section aria-labelledby="review-title" className="student-v2-card student-v2-compact-card" data-testid="student-home-review">
      <CalendarDays aria-hidden="true" size={21} />
      <div><span className="student-v2-eyebrow">Próxima revisão</span><h2 id="review-title">{review.label}</h2></div>
    </section>
  );
}

function EvolutionCard({ summary }) {
  return (
    <section aria-labelledby="evolution-summary-title" className="student-v2-card" data-testid="student-home-evolution">
      <div className="student-v2-section-heading"><div><span className="student-v2-eyebrow">Evolução</span><h2 id="evolution-summary-title">Seu ritmo recente</h2></div><Activity aria-hidden="true" size={21} /></div>
      {summary.hasData ? (
        <p><strong>{summary.completedCount} {summary.completedCount === 1 ? "treino concluído" : "treinos concluídos"}</strong> nos últimos {summary.windowDays} dias{summary.lastCompletedAt ? ` · último em ${formatShortDate(summary.lastCompletedAt)}` : ""}.</p>
      ) : <p>Seus resultados vão aparecer aqui conforme você registrar seus treinos.</p>}
      <Link className="student-v2-text-link" to={STUDENT_EXPERIENCE_V2_ROUTES.EVOLUTION}>Ver evolução <ArrowRight aria-hidden="true" size={16} /></Link>
    </section>
  );
}

function StudentHomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Carregando sua área" className="student-home-v2 student-v2-skeleton" data-testid="student-home-loading">
      <div className="student-v2-skeleton-line is-short" /><div className="student-v2-skeleton-line is-title" />
      <div className="student-v2-skeleton-card" />
      <div className="student-home-grid"><div className="student-v2-skeleton-card is-small" /><div className="student-v2-skeleton-card is-small" /><div className="student-v2-skeleton-card is-small" /></div>
      <span className="sr-only" aria-live="polite">Carregando sua área...</span>
    </div>
  );
}

export default StudentHomeV2;
