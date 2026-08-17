import { Activity, Clock3, Dumbbell, TrendingUp } from "lucide-react";
import {
  STUDENT_PROGRESSION_SIGNAL,
  STUDENT_PROGRESSION_STATUS,
  buildStudentProgressionSnapshot,
} from "../utils/studentProgressionSnapshot";

const STATUS_LABELS = {
  [STUDENT_PROGRESSION_STATUS.PROGRESSING]: {
    label: "Evolucao identificada",
    detail: "Ha sinal confiavel de aumento em carga ou repeticoes prescritas.",
    tone: "ok",
  },
  [STUDENT_PROGRESSION_STATUS.STABLE]: {
    label: "Estavel",
    detail: "As fichas comparaveis mantem carga e repeticoes prescritas.",
    tone: "neutro",
  },
  [STUDENT_PROGRESSION_STATUS.PARTIAL_HISTORY]: {
    label: "Historico parcial",
    detail: "Existem fichas, mas parte dos dados nao permite comparacao segura.",
    tone: "atencao",
  },
  [STUDENT_PROGRESSION_STATUS.INSUFFICIENT_DATA]: {
    label: "Dados insuficientes",
    detail: "Ainda nao ha historico suficiente para comparar a evolucao.",
    tone: "vazio",
  },
};

const SIGNAL_PRIORITY = {
  [STUDENT_PROGRESSION_SIGNAL.LOAD_PROGRESS]: 1,
  [STUDENT_PROGRESSION_SIGNAL.REP_PROGRESS]: 2,
  [STUDENT_PROGRESSION_SIGNAL.STABLE]: 3,
  [STUDENT_PROGRESSION_SIGNAL.NEW_EXERCISE]: 4,
  [STUDENT_PROGRESSION_SIGNAL.PARTIAL_DATA]: 5,
  [STUDENT_PROGRESSION_SIGNAL.NO_DATA]: 6,
};

function StudentProgressionSnapshot({ treinosState, styles }) {
  if (!treinosState || treinosState.status === "idle" || treinosState.status === "loading") {
    return (
      <section className="aluno-details-section" data-testid="student-progression-snapshot" style={styles.resumoOperacional}>
        <SnapshotHeader />
        <div className="app-loading" data-testid="student-progression-loading" style={snapshotStyles.stateBox}>
          Carregando progressao...
        </div>
      </section>
    );
  }

  if (treinosState.status === "error") {
    return (
      <section className="aluno-details-section" data-testid="student-progression-snapshot" style={styles.resumoOperacional}>
        <SnapshotHeader />
        <div className="app-empty-state" data-testid="student-progression-error" style={snapshotStyles.stateBox}>
          Nao foi possivel carregar a progressao agora.
        </div>
      </section>
    );
  }

  const snapshot = buildStudentProgressionSnapshot(treinosState.data || []);
  const status = STATUS_LABELS[snapshot.status];
  const signals = [...snapshot.signals]
    .sort((a, b) => (SIGNAL_PRIORITY[a.type] || 99) - (SIGNAL_PRIORITY[b.type] || 99))
    .slice(0, 4);

  return (
    <section
      className="aluno-details-section student-progression-snapshot"
      data-progression-status={snapshot.status}
      data-testid="student-progression-snapshot"
      style={styles.resumoOperacional}
    >
      <SnapshotHeader />

      <div className="student-progression-summary" style={snapshotStyles.summaryGrid}>
        <article data-state={status.tone} data-testid="student-progression-status" style={styles.resumoIndicador}>
          <span style={styles.infoLabel}>Status</span>
          <strong style={styles.infoValor}>{status.label}</strong>
          <p style={styles.resumoIndicadorTexto}>{status.detail}</p>
        </article>
        <article data-testid="student-progression-review-cue" style={styles.resumoIndicador}>
          <span style={styles.infoLabel}>Ultima revisao</span>
          <strong style={styles.infoValor}>{formatReviewCue(snapshot)}</strong>
          <p style={styles.resumoIndicadorTexto}>Cue informativo; o profissional decide a proxima acao.</p>
        </article>
        <article data-testid="student-progression-comparable-count" style={styles.resumoIndicador}>
          <span style={styles.infoLabel}>Exercicios comparaveis</span>
          <strong style={styles.infoValor}>
            {snapshot.comparableExercisesCount}/{snapshot.currentExercisesCount}
          </strong>
          <p style={styles.resumoIndicadorTexto}>Comparacao conservadora entre a ficha atual e a anterior.</p>
        </article>
      </div>

      {snapshot.status === STUDENT_PROGRESSION_STATUS.INSUFFICIENT_DATA ? (
        <div className="app-empty-state" data-testid="student-progression-no-history" style={snapshotStyles.stateBox}>
          <strong>Ainda nao ha historico suficiente para comparar a evolucao.</strong>
          <p className="app-muted">Cadastre ou entregue mais de uma ficha com exercicios comparaveis.</p>
        </div>
      ) : (
        <div className="student-progression-signals" data-testid="student-progression-signals" style={snapshotStyles.signalsGrid}>
          {signals.map((signal) => (
            <SignalCard key={`${signal.exerciseName}-${signal.type}`} signal={signal} styles={styles} />
          ))}
        </div>
      )}
    </section>
  );
}

function SnapshotHeader() {
  return (
    <div style={snapshotStyles.header}>
      <div>
        <h3 style={snapshotStyles.title}>Progressao recente</h3>
        <p style={snapshotStyles.description}>Sinais simples da evolucao prescrita entre fichas.</p>
      </div>
      <TrendingUp size={20} aria-hidden="true" />
    </div>
  );
}

function SignalCard({ signal, styles }) {
  const presentation = getSignalPresentation(signal);

  return (
    <article data-signal={signal.type} data-testid={`student-progression-signal-${signal.type}`} style={snapshotStyles.signalCard}>
      <div style={snapshotStyles.signalHeader}>
        {presentation.icon}
        <strong style={styles.infoValor}>{signal.exerciseName || "Exercicio"}</strong>
      </div>
      <span style={styles.infoLabel}>{presentation.label}</span>
      <p style={styles.resumoIndicadorTexto}>{presentation.detail}</p>
    </article>
  );
}

function getSignalPresentation(signal) {
  if (signal.type === STUDENT_PROGRESSION_SIGNAL.LOAD_PROGRESS) {
    return {
      label: "Carga aumentou",
      detail: `${signal.previous?.carga || "-"} -> ${signal.current?.carga || "-"}`,
      icon: <Dumbbell size={16} aria-hidden="true" />,
    };
  }
  if (signal.type === STUDENT_PROGRESSION_SIGNAL.REP_PROGRESS) {
    return {
      label: "Repeticoes aumentaram",
      detail: `${signal.previous?.repeticoes || "-"} -> ${signal.current?.repeticoes || "-"} reps`,
      icon: <Activity size={16} aria-hidden="true" />,
    };
  }
  if (signal.type === STUDENT_PROGRESSION_SIGNAL.STABLE) {
    return {
      label: "Estavel entre as fichas",
      detail: `${signal.current?.carga || "-"} · ${signal.current?.repeticoes || "-"} reps`,
      icon: <Clock3 size={16} aria-hidden="true" />,
    };
  }
  if (signal.type === STUDENT_PROGRESSION_SIGNAL.NEW_EXERCISE) {
    return {
      label: "Novo no treino atual",
      detail: "Sem equivalente confiavel na ficha anterior.",
      icon: <Dumbbell size={16} aria-hidden="true" />,
    };
  }

  return {
    label: "Dados nao comparaveis",
    detail: "Os campos das fichas nao permitem comparacao segura.",
    icon: <Activity size={16} aria-hidden="true" />,
  };
}

function formatReviewCue(snapshot) {
  if (snapshot.daysSinceReview === null) return "Sem data confiavel";
  if (snapshot.daysSinceReview === 0) return "Revisada hoje";
  return `Ha ${snapshot.daysSinceReview} dia(s)`;
}

const snapshotStyles = {
  header: {
    alignItems: "flex-start",
    display: "flex",
    gap: "12px",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "16px",
    margin: 0,
  },
  description: {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.45,
    margin: "5px 0 0",
  },
  summaryGrid: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  },
  signalsGrid: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  },
  signalCard: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    minWidth: 0,
    padding: "12px",
  },
  signalHeader: {
    alignItems: "center",
    display: "flex",
    gap: "8px",
    minWidth: 0,
  },
  stateBox: {
    borderRadius: "8px",
    padding: "12px",
  },
};

export default StudentProgressionSnapshot;
