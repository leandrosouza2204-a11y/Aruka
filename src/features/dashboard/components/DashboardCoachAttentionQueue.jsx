import { Link } from "react-router-dom";
import { ListChecks } from "lucide-react";
import { COACH_ATTENTION_QUEUE_PRIORITY } from "../../alunos/utils/coachAttentionQueue.js";

const PRIORITY_LABEL = {
  [COACH_ATTENTION_QUEUE_PRIORITY.ACTION_REQUIRED]: "Requer atencao",
  [COACH_ATTENTION_QUEUE_PRIORITY.REVIEW]: "Revisar",
  [COACH_ATTENTION_QUEUE_PRIORITY.FOLLOW_UP]: "Acompanhar",
};

const PRIORITY_TONE = {
  [COACH_ATTENTION_QUEUE_PRIORITY.ACTION_REQUIRED]: "warning",
  [COACH_ATTENTION_QUEUE_PRIORITY.REVIEW]: "info",
  [COACH_ATTENTION_QUEUE_PRIORITY.FOLLOW_UP]: "muted",
};

function DashboardCoachAttentionQueue({ carregando, erro, queue = [], stats = { total: 0 }, styles }) {
  return (
    <section
      className="dashboard-panel coach-attention-queue"
      style={styles.resumoCard}
      aria-labelledby="coach-attention-queue-title"
    >
      <div style={styles.secaoTopo}>
        <div>
          <h2 id="coach-attention-queue-title" style={styles.secaoTitulo}>Fila de atencao</h2>
          <p style={styles.secaoLegenda}>
            Sinais calculados para decidir a proxima revisao operacional.
          </p>
        </div>
        <span style={styles.historicoTag}>{stats.total} item(ns)</span>
      </div>

      {erro ? (
        <div className="app-error" role="alert" style={styles.erroBox}>
          <span>{erro}</span>
          <Link
            className="app-button app-button-secondary"
            style={styles.queueRetryAction}
            to="/dashboard"
            aria-label="Tentar carregar novamente a fila de atencao"
          >
            Tentar novamente
          </Link>
        </div>
      ) : carregando ? (
        <div className="app-loading" role="status" aria-live="polite" style={styles.queueLoading}>
          Carregando fila de atencao...
        </div>
      ) : queue.length === 0 ? (
        <p className="app-success" style={styles.queueEmpty}>
          Nenhuma pendencia importante no momento.
        </p>
      ) : (
        <div style={styles.queueList}>
          {queue.map((item) => (
            <article key={item.id} className="coach-attention-queue-item" style={styles.queueItem}>
              <div style={styles.queueIcon} aria-hidden="true">
                <ListChecks size={18} />
              </div>
              <div style={styles.queueContent}>
                <div style={styles.queueHeader}>
                  <strong style={styles.queueStudent}>{item.studentName}</strong>
                  <span className={`status-badge status-badge-${PRIORITY_TONE[item.priority] || "muted"}`}>
                    {PRIORITY_LABEL[item.priority] || "Revisar"}
                  </span>
                </div>
                <p style={styles.queueTitle}>{item.title}</p>
                <p style={styles.queueDescription}>{item.description}</p>
                <div style={styles.queueSignals} aria-label="Sinais agrupados">
                  {item.signals.map((signal) => (
                    <span key={signal.code} style={styles.queueSignalTag}>{signal.title}</span>
                  ))}
                </div>
              </div>
              <Link
                className="app-button app-button-secondary"
                style={styles.queueAction}
                to={item.actionTarget}
                aria-label={`${item.actionLabel} de ${item.studentName}`}
              >
                {item.actionLabel}
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default DashboardCoachAttentionQueue;
