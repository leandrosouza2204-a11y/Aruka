import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronDown, ListChecks } from "lucide-react";
import {
  COACH_ATTENTION_QUEUE_PRIORITY,
  COACH_WORKFLOW_ITEM_STATE,
} from "../../alunos/utils/coachAttentionQueue.js";
import {
  getVisibleAttentionItems,
  groupCoachAttentionQueue,
} from "../utils/dashboardAttentionGroups.js";

const PRIORITY_LABEL = {
  [COACH_ATTENTION_QUEUE_PRIORITY.ACTION_REQUIRED]: "Requer atenção",
  [COACH_ATTENTION_QUEUE_PRIORITY.REVIEW]: "Revisar",
  [COACH_ATTENTION_QUEUE_PRIORITY.FOLLOW_UP]: "Acompanhar",
};

const PRIORITY_TONE = {
  [COACH_ATTENTION_QUEUE_PRIORITY.ACTION_REQUIRED]: "warning",
  [COACH_ATTENTION_QUEUE_PRIORITY.REVIEW]: "info",
  [COACH_ATTENTION_QUEUE_PRIORITY.FOLLOW_UP]: "muted",
};

function DashboardCoachAttentionQueue({
  carregando,
  erro,
  onRetry,
  onToggleAcknowledgement,
  queue = [],
  stats = { total: 0 },
  styles,
}) {
  const groups = useMemo(() => groupCoachAttentionQueue(queue), [queue]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedAll, setExpandedAll] = useState({});

  function toggleGroup(groupId) {
    setExpandedGroups((current) => ({ ...current, [groupId]: !current[groupId] }));
  }

  return (
    <section
      className="dashboard-panel coach-attention-queue"
      style={styles.resumoCard}
      aria-labelledby="coach-attention-queue-title"
    >
      <div style={styles.secaoTopo}>
        <div>
          <h2 id="coach-attention-queue-title" style={styles.secaoTitulo}>Fila de atenção</h2>
          <p style={styles.secaoLegenda}>Pendências agrupadas para uma revisão rápida.</p>
        </div>
        <span style={styles.historicoTag}>{stats.total} item(ns)</span>
      </div>

      {erro ? (
        <div className="app-error" role="alert" style={styles.erroBox}>
          <span>{erro}</span>
          <button className="app-button app-button-secondary" style={styles.queueRetryAction} type="button" onClick={onRetry}>
            Tentar novamente
          </button>
        </div>
      ) : carregando ? (
        <div className="app-loading" role="status" aria-live="polite" style={styles.queueLoading}>
          Carregando fila de atenção...
        </div>
      ) : groups.length === 0 ? (
        <p className="app-success" style={styles.queueEmpty}>Nenhuma pendência importante no momento.</p>
      ) : (
        <div className="coach-attention-groups" style={styles.queueList}>
          {groups.map((group) => {
            const expanded = Boolean(expandedGroups[group.id]);
            const showAll = Boolean(expandedAll[group.id]);
            const contentId = `attention-group-${group.id}`;
            return (
              <section className="coach-attention-group" key={group.id}>
                <button
                  type="button"
                  className="coach-attention-group-toggle"
                  aria-expanded={expanded}
                  aria-controls={contentId}
                  onClick={() => toggleGroup(group.id)}
                >
                  <span className="coach-attention-group-copy">
                    <strong>{group.title}</strong>
                    <small>{group.description}</small>
                  </span>
                  <span className={`status-badge status-badge-${PRIORITY_TONE[group.priority] || "muted"}`}>
                    {PRIORITY_LABEL[group.priority] || "Revisar"}
                  </span>
                  <span className="coach-attention-group-count">{group.items.length}</span>
                  <ChevronDown className="coach-attention-group-chevron" size={18} aria-hidden="true" />
                </button>

                {expanded && (
                  <div id={contentId} className="coach-attention-group-content">
                    {getVisibleAttentionItems(group, showAll).map((item) => (
                      <AttentionItem item={item} key={item.id} onToggleAcknowledgement={onToggleAcknowledgement} styles={styles} />
                    ))}
                    {group.items.length > 3 && (
                      <button
                        type="button"
                        className="app-button app-button-neutral coach-attention-show-all"
                        onClick={() => setExpandedAll((current) => ({ ...current, [group.id]: !showAll }))}
                      >
                        {showAll ? "Mostrar menos" : `Ver todos (${group.items.length})`}
                      </button>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}

function AttentionItem({ item, onToggleAcknowledgement, styles }) {
  const acknowledged = item.workflowState === COACH_WORKFLOW_ITEM_STATE.ACKNOWLEDGED;
  return (
    <article className={`coach-attention-queue-item${acknowledged ? " coach-attention-queue-item-acknowledged" : ""}`} style={styles.queueItem}>
      <div style={styles.queueIcon} aria-hidden="true"><ListChecks size={18} /></div>
      <div style={styles.queueContent}>
        <div style={styles.queueHeader}>
          <strong style={styles.queueStudent}>{item.studentName}</strong>
          {acknowledged && <span className="status-badge status-badge-muted">Visto</span>}
        </div>
        <p style={styles.queueTitle}>{item.title}</p>
        <p style={styles.queueDescription}>{item.description}</p>
        <div style={styles.queueSignals} aria-label="Sinais agrupados">
          {item.signals.map((signal) => <span key={signal.code} style={styles.queueSignalTag}>{signal.title}</span>)}
        </div>
      </div>
      <div className="coach-attention-item-actions">
        <Link className="app-button app-button-secondary" style={styles.queueAction} to={item.primaryAction?.target || item.actionTarget} aria-label={`${item.primaryAction?.label || item.actionLabel} de ${item.studentName}`}>
          {item.primaryAction?.label || item.actionLabel}
        </Link>
        {item.secondaryAction && (
          <Link className="app-button app-button-neutral" style={styles.queueSecondaryAction} to={item.secondaryAction.target} aria-label={`${item.secondaryAction.label} de ${item.studentName}`}>
            {item.secondaryAction.label}
          </Link>
        )}
        <button className="app-button app-button-neutral" style={styles.queueAcknowledgementAction} type="button" aria-pressed={acknowledged} onClick={() => onToggleAcknowledgement?.(item.id)}>
          {acknowledged ? <Check size={15} aria-hidden="true" /> : null}
          {acknowledged ? "Visto" : "Marcar como visto"}
        </button>
      </div>
    </article>
  );
}

export default DashboardCoachAttentionQueue;
