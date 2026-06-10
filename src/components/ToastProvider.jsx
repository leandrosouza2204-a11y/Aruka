import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "../contexts/ToastContext";
import Toast from "./Toast";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removerToast = useCallback((id) => {
    setToasts((atuais) => atuais.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ titulo, descricao = "", tipo = "info", duracao = 4200 }) => {
      const id = crypto.randomUUID();

      setToasts((atuais) => [...atuais, { id, titulo, descricao, tipo }]);

      window.setTimeout(() => removerToast(id), duracao);
      return id;
    },
    [removerToast]
  );

  const value = useMemo(
    () => ({
      sucesso: (titulo, descricao) => showToast({ titulo, descricao, tipo: "sucesso" }),
      erro: (titulo, descricao) => showToast({ titulo, descricao, tipo: "erro", duracao: 6200 }),
      aviso: (titulo, descricao) => showToast({ titulo, descricao, tipo: "aviso" }),
      info: (titulo, descricao) => showToast({ titulo, descricao, tipo: "info" }),
      showToast,
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="app-toast-stack">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removerToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
