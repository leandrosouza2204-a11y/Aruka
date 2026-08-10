import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { trapModalFocus } from "../../../utils/modalAccessibility";
import { mapWorkoutLifecycleUiError } from "../utils/workoutLifecyclePresentation";

const COPY = {
  deliver: {
    title: "Entregar treino?",
    description: "Após a entrega, este treino ficará ativo para o aluno.",
    confirm: "Entregar treino",
    loading: "Entregando...",
  },
  complete: {
    title: "Concluir treino?",
    description: "O treino será marcado como concluído e permanecerá disponível no histórico.",
    confirm: "Concluir treino",
    loading: "Concluindo...",
  },
  archive: {
    title: "Arquivar treino?",
    description: "O treino sairá do fluxo principal, mas seus dados serão preservados.",
    confirm: "Arquivar treino",
    loading: "Arquivando...",
  },
};

function WorkoutLifecycleConfirmationModal({
  action,
  error,
  loading = false,
  onCancel,
  onConfirm,
  onReview,
  treino,
}) {
  const copy = COPY[action];
  const titleId = useId();
  const descriptionId = useId();
  const cancelRef = useRef(null);
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement;
    cancelRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key !== "Escape" || loading) return;
      event.stopPropagation();
      onCancel();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [loading, onCancel]);

  if (!copy) return null;

  return createPortal(
    <div className="workout-lifecycle-confirmation-overlay" role="presentation">
      <section
        ref={dialogRef}
        className="workout-lifecycle-confirmation-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={loading}
        data-testid="workout-lifecycle-confirmation"
        tabIndex={-1}
        onKeyDown={(event) => trapModalFocus(event, dialogRef.current)}
      >
        <header>
          <h2 id={titleId}>{copy.title}</h2>
          <p id={descriptionId}>{copy.description}</p>
        </header>

        <div className="workout-lifecycle-confirmation-summary">
          <span>Aluno</span>
          <strong>{treino?.aluno || "Aluno não informado"}</strong>
          <span>Treino</span>
          <strong>{treino?.rotina || "Ficha de treino"}</strong>
        </div>

        {error && (
          <div className="app-error" role="alert" data-testid="workout-lifecycle-error">
            {mapWorkoutLifecycleUiError(error)}
            {action === "deliver" && (
              <button type="button" className="app-button app-button-secondary" onClick={onReview}>
                Revisar treino
              </button>
            )}
          </div>
        )}

        <footer>
          <button
            ref={cancelRef}
            type="button"
            className="app-button app-button-secondary"
            data-testid="workout-lifecycle-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="app-button app-button-primary"
            data-testid={`workout-lifecycle-confirm-${action}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? copy.loading : copy.confirm}
          </button>
        </footer>
      </section>
    </div>,
    document.body
  );
}

export default WorkoutLifecycleConfirmationModal;
