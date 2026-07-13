import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  initialFocusRef,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
  contentClassName = "",
  showCloseButton = true,
  ariaLabel,
  role = "dialog",
  ...props
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      const dialog = dialogRef.current;
      const primeiroFocavel = dialog?.querySelector(focusableSelector);
      const alvo = initialFocusRef?.current || primeiroFocavel || dialog;

      alvo?.focus?.();
    }, 0);

    return () => {
      document.body.style.overflow = overflowAnterior;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [initialFocusRef, isOpen]);

  if (!isOpen) return null;

  function fechar() {
    onClose?.();
  }

  function tratarTeclado(event) {
    if (event.key === "Escape" && closeOnEscape) {
      event.stopPropagation();
      fechar();
      return;
    }

    if (event.key !== "Tab") return;

    const focaveis = Array.from(
      dialogRef.current?.querySelectorAll(focusableSelector) || []
    ).filter((elemento) => elemento.offsetParent !== null || elemento === document.activeElement);

    if (focaveis.length === 0) {
      event.preventDefault();
      dialogRef.current?.focus();
      return;
    }

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];

    if (event.shiftKey && document.activeElement === primeiro) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault();
      primeiro.focus();
    }
  }

  function tratarCliqueOverlay(event) {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      fechar();
    }
  }

  return createPortal(
    <div
      className={`accessible-modal-overlay ${className}`.trim()}
      onMouseDown={tratarCliqueOverlay}
    >
      <section
        ref={dialogRef}
        className={`accessible-modal accessible-modal-${size} ${contentClassName}`.trim()}
        role={role}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        onKeyDown={tratarTeclado}
        {...props}
      >
        {(title || showCloseButton) && (
          <header className="accessible-modal-header">
            <div className="accessible-modal-title-block">
              {title && <h2 id={titleId}>{title}</h2>}
              {description && <p id={descriptionId}>{description}</p>}
            </div>
            {showCloseButton && onClose && (
              <button
                type="button"
                className="accessible-modal-close"
                onClick={fechar}
                aria-label="Fechar modal"
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </header>
        )}

        <div className="accessible-modal-body">{children}</div>

        {footer && <footer className="accessible-modal-footer">{footer}</footer>}
      </section>
    </div>,
    document.body
  );
}

export default AccessibleModal;
