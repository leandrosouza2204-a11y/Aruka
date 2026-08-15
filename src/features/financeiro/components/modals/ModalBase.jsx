import AccessibleModal from "../../../../components/AccessibleModal";

const larguraPorTamanho = {
  sm: "min(420px, calc(100vw - 48px))",
  md: "min(620px, calc(100vw - 48px))",
  lg: "min(760px, calc(100vw - 48px))",
  xl: "min(1040px, calc(100vw - 48px))",
  content: "fit-content",
};

function ModalBase({ children, onClose, largura, size = "md", contentClassName = "" }) {
  const larguraModal = largura || larguraPorTamanho[size] || larguraPorTamanho.md;

  return (
    <AccessibleModal
      isOpen
      onClose={onClose}
      ariaLabel="Modal financeiro"
      size={size === "content" ? "lg" : size}
      showCloseButton={false}
      contentClassName={`financeiro-modal ${contentClassName}`.trim()}
      className="financeiro-modal-overlay"
      style={{ "--financeiro-modal-width": larguraModal }}
    >
      <div className="financeiro-modal-content">
        {children}
      </div>
    </AccessibleModal>
  );
}

export default ModalBase;
