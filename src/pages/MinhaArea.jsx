import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CalendarDays, ChevronDown, ClipboardList, Dumbbell, History, RefreshCcw } from "lucide-react";
import { buscarMinhaExperienciaDiariaAluno } from "../services/studentDailyExperienceService.js";
import { buildStudentDailyExperience } from "../features/studentDailyExperience/utils/studentDailyExperience.js";

function MinhaArea() {
  const [payload, setPayload] = useState(null);
  const [status, setStatus] = useState("loading");
  const [erro, setErro] = useState("");
  const [treinoAberto, setTreinoAberto] = useState(false);

  async function carregar() {
    setStatus("loading");
    setErro("");
    try {
      const data = await buscarMinhaExperienciaDiariaAluno();
      setPayload(data);
      setStatus("success");
    } catch (error) {
      setErro(error.message || "Não foi possível carregar sua área agora.");
      setStatus("error");
    }
  }

  useEffect(() => {
    let active = true;

    buscarMinhaExperienciaDiariaAluno()
      .then((data) => {
        if (!active) return;
        setPayload(data);
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
        <span style={styles.kicker}>Minha área</span>
        <h1 style={styles.title}>Olá, {daily.student?.name || "aluno"}</h1>
      </header>

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
              <Info label="Frequência prescrita" value={daily.activeWorkout.daysText} />
              <Info label="Período" value={daily.activeWorkout.period} />
              <Info label="Status" value={daily.activeWorkout.statusText} />
            </div>
            <p style={styles.reviewText}>{daily.activeWorkout.reviewText}</p>
            <button
              style={styles.primaryButton}
              type="button"
              onClick={() => setTreinoAberto((open) => !open)}
              data-testid="student-daily-view-workout"
            >
              Ver treino atual <ChevronDown size={18} />
            </button>
          </>
        ) : (
          <p style={styles.muted}>Você ainda não possui um treino ativo para consulta.</p>
        )}
      </section>

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
              <article style={styles.dayCard} key={`${day.name}-${index}`}>
                <h3 style={styles.cardTitle}>{day.name}</h3>
                {day.notes && <p style={styles.muted}>{day.notes}</p>}
                <div style={styles.exerciseList}>
                  {day.exercises.map((exercise, exerciseIndex) => (
                    <div style={styles.exerciseItem} key={`${exercise.name}-${exerciseIndex}`}>
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
  primaryButton: { border: 0, borderRadius: 8, background: "#174ea6", color: "#fff", minHeight: 44, padding: "0 16px", display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 800, cursor: "pointer" },
  cue: { display: "flex", gap: 12, borderRadius: 8, padding: 16, background: "#ecfdf5", border: "1px solid #bbf7d0", color: "#14532d", marginBottom: 14 },
  section: { background: "#ffffff", border: "1px solid #dde3ee", borderRadius: 8, padding: 18, marginBottom: 14 },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  sectionTitle: { margin: "0 0 10px", fontSize: 20, lineHeight: 1.2 },
  muted: { color: "#526071", margin: 0, lineHeight: 1.5 },
  emptyText: { color: "#526071", background: "#f8fafc", border: "1px solid #e5e9f1", borderRadius: 8, padding: 12, margin: 0 },
  daysList: { display: "grid", gap: 12 },
  dayCard: { border: "1px solid #e5e9f1", borderRadius: 8, padding: 14 },
  cardTitle: { margin: "0 0 8px", fontSize: 17 },
  exerciseList: { display: "grid", gap: 8, marginTop: 10 },
  exerciseItem: { display: "grid", gap: 3, padding: "10px 0", borderTop: "1px solid #eef2f7" },
  compactList: { display: "grid", gap: 8, marginTop: 12 },
  historyList: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 },
  historyItem: { display: "grid", gap: 5, border: "1px solid #e5e9f1", borderRadius: 8, padding: 12 },
  stateBox: { minHeight: "70vh", display: "grid", placeItems: "center", gap: 12, textAlign: "center", color: "#334155" },
};

export default MinhaArea;
