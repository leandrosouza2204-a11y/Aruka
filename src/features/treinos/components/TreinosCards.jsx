import {
  CalendarClock,
  Dumbbell,
  Eye,
  Layers3,
  Target,
} from "lucide-react";
import LoadingState from "../../../components/LoadingState";
import TableActions, { TableActionItem } from "../../../components/TableActions";
import { formatarData } from "../hooks/useTreinosPage";
import {
  getWorkoutPrimaryLifecycleAction,
  getWorkoutRelevantDate,
} from "../utils/workoutLifecyclePresentation";
import TreinosEmptyState from "./TreinosEmptyState";
import WorkoutLifecycleActionItems from "./WorkoutLifecycleActions";
import WorkoutLifecycleBadge from "./WorkoutLifecycleBadge";

function TreinosCards({
  acaoTreino,
  carregando,
  selectedId,
  treinos,
  onVisualizar,
  onEditar,
  onLifecycleAction,
  alunoContextual,
  alterandoEstadoTreinoId,
  entregandoTreinoId,
  lifecycleActionPending = null,
  onNovoTreino,
  onUsarModelo,
  styles,
}) {
  if (carregando) {
    return (
      <div style={styles.libraryLoading}>
        <LoadingState texto="Carregando treinos..." />
      </div>
    );
  }

  if (treinos.length === 0) {
    return (
      <TreinosEmptyState
        alunoContextual={alunoContextual}
        onNovoTreino={onNovoTreino}
        onUsarModelo={onUsarModelo}
      />
    );
  }

  return (
    <div className="treinos-library-grid" style={styles.libraryGrid}>
      {treinos.map((treino) => {
        const acaoAtual = acaoTreino?.id === treino.id ? acaoTreino.tipo : "";
        const lifecycleActionInProgress =
          entregandoTreinoId === treino.id
            ? "deliver"
            : alterandoEstadoTreinoId === treino.id
              ? lifecycleActionPending?.treino?.id === treino.id
                ? lifecycleActionPending.action
                : getWorkoutPrimaryLifecycleAction(treino)
              : "";
        const temAcaoEmAndamento = Boolean(acaoTreino || lifecycleActionInProgress);
        const dataRelevante = getWorkoutRelevantDate(treino);
        const primaryAction = getWorkoutPrimaryLifecycleAction(treino);

        return (
          <article
            key={treino.id}
            className={`treino-library-card${selectedId === treino.id ? " is-selected" : ""}`}
            data-testid="treino-mobile-card"
            aria-busy={Boolean(acaoAtual)}
            style={{
              ...styles.treinoCard,
              ...(selectedId === treino.id ? styles.treinoCardSelecionado : {}),
            }}
          >
            <div style={styles.treinoCardTop}>
              <div style={styles.treinoCardIcon}>
                <Dumbbell size={18} />
              </div>
              <WorkoutLifecycleBadge treino={treino} />
            </div>

            <div>
              <h3 style={styles.treinoCardTitulo}>{treino.rotina || "Ficha de treino"}</h3>
          <p style={styles.treinoCardAluno}>{treino.aluno || "Aluno não informado"}</p>
            </div>

            <div style={styles.treinoBadges}>
              <Badge icon={<Target size={13} />} texto={treino.objetivo || "Sem objetivo"} />
              <Badge icon={<Layers3 size={13} />} texto={treino.nivel || "Sem nivel"} />
            </div>

            <div style={styles.treinoMetaGrid}>
              <Meta
                icon={<CalendarClock size={15} />}
                label="Revisao"
                valor={formatarData(dataRelevante.value)}
                styles={styles}
                labelOverride={dataRelevante.label}
              />
              <Meta
                icon={<Dumbbell size={15} />}
                label="Dias"
                valor={`${treino.dias?.length || 0} por semana`}
                styles={styles}
              />
            </div>

            <div style={styles.treinoCardActions}>
              <button
                onClick={() => {
                  if (primaryAction === "view") onVisualizar(treino.id);
                  else onLifecycleAction(primaryAction, treino);
                }}
                className="table-button table-button-primary"
                data-testid={`workout-primary-action-${primaryAction}`}
                disabled={temAcaoEmAndamento}
                aria-busy={Boolean(lifecycleActionInProgress)}
                style={styles.treinoVisualizar}
              >
                <Eye size={15} />
                {primaryActionLabel(primaryAction, lifecycleActionInProgress)}
              </button>
              <TableActions label={`Mais acoes de ${treino.rotina || "treino"}`} testIdPrefix="treino">
                <WorkoutLifecycleActionItems
                  ItemComponent={TableActionItem}
                  actionInProgress={lifecycleActionInProgress || acaoAtual}
                  disabled={temAcaoEmAndamento}
                  treino={treino}
                  onAction={(action, selectedWorkout) => {
                    if (action === "view") onVisualizar(selectedWorkout.id);
                    else if (action === "edit") onEditar(selectedWorkout);
                    else onLifecycleAction(action, selectedWorkout);
                  }}
                />
              </TableActions>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Badge({ icon, texto }) {
  return (
    <span className="treino-library-badge">
      {icon}
      {texto}
    </span>
  );
}

function Meta({ icon, label, labelOverride, valor, styles }) {
  return (
    <div style={styles.treinoMetaItem}>
      <span style={styles.treinoMetaIcon}>{icon}</span>
      <div>
        <span style={styles.treinoMetaLabel}>{labelOverride || label}</span>
        <strong style={styles.treinoMetaValor}>{valor || "-"}</strong>
      </div>
    </div>
  );
}

function primaryActionLabel(action, loadingAction) {
  if (loadingAction === "deliver") return "Entregando...";
  if (loadingAction === "complete") return "Concluindo...";
  if (loadingAction === "archive") return "Arquivando...";
  if (action === "deliver") return "Entregar treino";
  if (action === "complete") return "Concluir treino";
  return "Visualizar";
}

export default TreinosCards;
