function Toast({ toast, onClose }) {
  return (
    <div className={`app-toast app-toast-${toast.tipo || "info"}`} role="status">
      <div>
        <strong>{toast.titulo}</strong>
        {toast.descricao && <p>{toast.descricao}</p>}
      </div>
      <button type="button" onClick={() => onClose(toast.id)} aria-label="Fechar">
        ×
      </button>
    </div>
  );
}

export default Toast;
