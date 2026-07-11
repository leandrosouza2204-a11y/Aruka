import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function AvaliacaoFotoLightbox({ isOpen, imageUrl, label, alunoNome, alt, onClose }) {
  const fecharRef = useRef(null);
  const focoAnteriorRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const scrollAnteriorRef = useRef(null);
  const [imagemComErro, setImagemComErro] = useState("");

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const containerPagina = document.querySelector(".avaliacoes-page.app-main.page-container");

    focoAnteriorRef.current = document.activeElement;
    scrollAnteriorRef.current = {
      windowX: window.scrollX,
      windowY: window.scrollY,
      htmlScrollTop: html.scrollTop,
      bodyScrollTop: body.scrollTop,
      containerScrollTop: containerPagina?.scrollTop ?? null,
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      containerOverflow: containerPagina?.style.overflow ?? null,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (containerPagina) containerPagina.style.overflow = "hidden";
    fecharRef.current?.focus();

    function fecharComEscape(event) {
      if (event.key === "Escape") onCloseRef.current?.();
    }

    function bloquearScrollFundo(event) {
      event.preventDefault();
      event.stopPropagation();
    }

    window.addEventListener("keydown", fecharComEscape);
    document.addEventListener("wheel", bloquearScrollFundo, { passive: false, capture: true });
    document.addEventListener("touchmove", bloquearScrollFundo, { passive: false, capture: true });

    return () => {
      const scrollAnterior = scrollAnteriorRef.current;
      window.removeEventListener("keydown", fecharComEscape);
      document.removeEventListener("wheel", bloquearScrollFundo, { capture: true });
      document.removeEventListener("touchmove", bloquearScrollFundo, { capture: true });

      html.style.overflow = scrollAnterior?.htmlOverflow ?? "";
      body.style.overflow = scrollAnterior?.bodyOverflow ?? "";
      if (containerPagina && scrollAnterior?.containerOverflow !== null) {
        containerPagina.style.overflow = scrollAnterior?.containerOverflow ?? "";
      }

      if (scrollAnterior) {
        html.scrollTop = scrollAnterior.htmlScrollTop;
        body.scrollTop = scrollAnterior.bodyScrollTop;
        if (containerPagina && scrollAnterior.containerScrollTop !== null) {
          containerPagina.scrollTop = scrollAnterior.containerScrollTop;
        }
        window.scrollTo(scrollAnterior.windowX, scrollAnterior.windowY);
      }

      try {
        focoAnteriorRef.current?.focus?.({ preventScroll: true });
      } catch {
        focoAnteriorRef.current?.focus?.();
        if (scrollAnterior) window.scrollTo(scrollAnterior.windowX, scrollAnterior.windowY);
      }
    };
  }, [isOpen]);

  if (!isOpen || !imageUrl) return null;

  const titulo = alunoNome ? `${label} - ${alunoNome}` : label;
  const erroImagem = imagemComErro === imageUrl;

  return createPortal(
    <div
      style={overlay}
      onMouseDown={onClose}
      onWheel={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onTouchMove={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Visualização ampliada: ${titulo}`}
        style={container}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div style={topo}>
          <strong style={tituloStyle}>{titulo}</strong>
          <button ref={fecharRef} type="button" onClick={onClose} style={botaoFechar}>
            Fechar
          </button>
        </div>

        {erroImagem ? (
          <p style={erroStyle}>Não foi possível carregar esta imagem.</p>
        ) : (
          <img
            src={imageUrl}
            alt={alt || titulo}
            style={imagem}
            onError={() => setImagemComErro(imageUrl)}
          />
        )}
      </section>
    </div>,
    document.body
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px",
  background: "rgba(15, 23, 42, 0.82)",
};

const container = {
  width: "min(1100px, calc(100vw - 32px))",
  maxHeight: "calc(100vh - 32px)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  borderRadius: "8px",
  background: "#0f172a",
  color: "white",
  padding: "14px",
  boxShadow: "0 24px 70px rgba(0, 0, 0, 0.42)",
};

const topo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
};

const tituloStyle = {
  fontSize: "14px",
  lineHeight: 1.35,
};

const botaoFechar = {
  minHeight: "40px",
  border: "1px solid rgba(255, 255, 255, 0.24)",
  borderRadius: "8px",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "800",
  padding: "9px 12px",
};

const imagem = {
  width: "100%",
  maxHeight: "calc(100vh - 140px)",
  objectFit: "contain",
  borderRadius: "6px",
  background: "#020617",
};

const erroStyle = {
  margin: 0,
  border: "1px solid rgba(248, 113, 113, 0.38)",
  borderRadius: "8px",
  background: "rgba(127, 29, 29, 0.35)",
  color: "#fee2e2",
  padding: "18px",
  textAlign: "center",
};

export default AvaliacaoFotoLightbox;
