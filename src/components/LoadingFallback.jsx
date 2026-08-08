import LoadingState from "./LoadingState";

function LoadingFallback({ texto = "Carregando...", variant = "section" }) {
  return (
    <div className={`loading-fallback loading-fallback-${variant}`}>
      <LoadingState texto={texto} />
    </div>
  );
}

export default LoadingFallback;
