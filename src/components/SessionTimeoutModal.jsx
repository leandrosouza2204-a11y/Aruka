function SessionTimeoutModal({ remainingSeconds, onContinue, onLogout }) {
  return (
    <div className="session-timeout-overlay" role="presentation">
      <section
        aria-labelledby="session-timeout-title"
        aria-modal="true"
        className="session-timeout-modal"
        role="dialog"
      >
        <div>
          <span className="session-timeout-eyebrow">Segurança</span>
          <h2 id="session-timeout-title">Sessão prestes a expirar</h2>
          <p>
            Por segurança, sua sessão será encerrada automaticamente por
            inatividade.
          </p>
        </div>

        <strong className="session-timeout-counter">
          Sua sessão será encerrada em {remainingSeconds} segundos.
        </strong>

        <div className="session-timeout-actions">
          <button
            className="session-timeout-primary"
            type="button"
            onClick={onContinue}
          >
            Continuar sessão
          </button>
          <button
            className="session-timeout-secondary"
            type="button"
            onClick={onLogout}
          >
            Sair agora
          </button>
        </div>
      </section>
    </div>
  );
}

export default SessionTimeoutModal;
