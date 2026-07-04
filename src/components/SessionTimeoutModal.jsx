import AccessibleModal from "./AccessibleModal";

function SessionTimeoutModal({ remainingSeconds, onContinue, onLogout }) {
  return (
    <AccessibleModal
      isOpen
      title="Sessão prestes a expirar"
      description="Por segurança, sua sessão será encerrada automaticamente por inatividade."
      size="sm"
      closeOnEscape={false}
      closeOnOverlayClick={false}
      showCloseButton={false}
      contentClassName="session-timeout-modal"
      footer={
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
      }
    >
      <span className="session-timeout-eyebrow">Segurança</span>
      <strong className="session-timeout-counter">
        Sua sessão será encerrada em {remainingSeconds} segundos.
      </strong>
    </AccessibleModal>
  );
}

export default SessionTimeoutModal;
