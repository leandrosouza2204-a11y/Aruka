function EmptyState({ titulo, descricao, acaoLabel, onAcao }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <strong>{titulo}</strong>
      {descricao && <p>{descricao}</p>}
      {acaoLabel && onAcao && (
        <button type="button" className="btn btn-primary" onClick={onAcao}>
          {acaoLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
