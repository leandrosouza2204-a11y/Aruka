import AccessibleModal from "../../../../components/AccessibleModal";

function ModalBase({ children, onClose, largura, contentClassName = "" }) {
  return (
    <AccessibleModal
      isOpen
      onClose={onClose}
      ariaLabel="Modal financeiro"
      size="full"
      showCloseButton={false}
      contentClassName={`financeiro-modal ${contentClassName}`.trim()}
      className="financeiro-modal-overlay"
    >
      <div style={{ width: largura }}>
        {children}
      </div>
    </AccessibleModal>
  );
}

export default ModalBase;
