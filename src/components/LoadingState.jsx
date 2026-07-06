function LoadingState({ texto = "Carregando..." }) {
  return (
    <div className="app-loading loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{texto}</span>
    </div>
  );
}

export default LoadingState;
