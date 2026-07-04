import { useCallback, useMemo, useRef, useState } from "react";
import AccessibleModal from "./AccessibleModal";
import { ConfirmContext } from "../contexts/ConfirmContext";

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const cancelarRef = useRef(null);

  const confirmar = useCallback((opcoes) => {
    return new Promise((resolve) => {
      setDialog({
        titulo: opcoes.titulo || "Confirmar ação",
        descricao: opcoes.descricao || "Deseja continuar?",
        textoConfirmar: opcoes.textoConfirmar || "Confirmar",
        textoCancelar: opcoes.textoCancelar || "Cancelar",
        variante: opcoes.variante || "perigo",
        resolve,
      });
    });
  }, []);

  function fechar(resultado) {
    dialog?.resolve(resultado);
    setDialog(null);
  }

  const value = useMemo(() => ({ confirmar }), [confirmar]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {dialog && (
        <AccessibleModal
          isOpen={Boolean(dialog)}
          onClose={() => fechar(false)}
          title={dialog.titulo}
          description={dialog.descricao}
          size="sm"
          initialFocusRef={cancelarRef}
          closeOnOverlayClick={false}
          footer={
            <>
              <button
                ref={cancelarRef}
                type="button"
                className="btn btn-secondary"
                onClick={() => fechar(false)}
              >
                {dialog.textoCancelar}
              </button>
              <button
                type="button"
                className={`btn ${dialog.variante === "perigo" ? "btn-danger" : "btn-primary"}`}
                onClick={() => fechar(true)}
              >
                {dialog.textoConfirmar}
              </button>
            </>
          }
        />
      )}
    </ConfirmContext.Provider>
  );
}
