import { useCallback, useMemo, useState } from "react";
import { ConfirmContext } from "../contexts/ConfirmContext";

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);

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
        <div className="confirm-overlay" role="presentation">
          <section className="confirm-dialog" role="dialog" aria-modal="true">
            <h2>{dialog.titulo}</h2>
            <p>{dialog.descricao}</p>
            <div className="confirm-actions">
              <button type="button" className="btn btn-secondary" onClick={() => fechar(false)}>
                {dialog.textoCancelar}
              </button>
              <button
                type="button"
                className={`btn ${dialog.variante === "perigo" ? "btn-danger" : "btn-primary"}`}
                onClick={() => fechar(true)}
              >
                {dialog.textoConfirmar}
              </button>
            </div>
          </section>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
