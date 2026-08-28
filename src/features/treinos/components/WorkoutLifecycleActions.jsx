import { Archive, CheckCircle2, Eye, Pencil, Send } from "lucide-react";
import { getWorkoutLifecycleActions } from "../utils/workoutLifecyclePresentation";

const ACTION_META = {
  view: { label: "Visualizar", icon: Eye },
  edit: { label: "Editar treino", icon: Pencil },
  deliver: { label: "Entregar treino", icon: Send },
  complete: { label: "Concluir treino", icon: CheckCircle2 },
  archive: { label: "Arquivar treino", icon: Archive },
};

function WorkoutLifecycleActionItems({
  ItemComponent,
  actionInProgress = "",
  disabled = false,
  onAction,
  treino,
}) {
  return getWorkoutLifecycleActions(treino).map((action) => {
    const meta = ACTION_META[action];
    const Icon = meta.icon;
    const loading = actionInProgress === action;

    return (
      <ItemComponent
        key={action}
        data-testid={`workout-lifecycle-action-${action}`}
        onClick={() => onAction(action, treino)}
        disabled={disabled || loading}
        variant={action === "archive" ? "danger" : "secondary"}
      >
        <Icon size={14} />
        {loading ? loadingLabel(action) : meta.label}
      </ItemComponent>
    );
  });
}

function loadingLabel(action) {
  if (action === "deliver") return "Entregando...";
  if (action === "complete") return "Concluindo...";
  if (action === "archive") return "Arquivando...";
  return "Carregando...";
}

export default WorkoutLifecycleActionItems;
