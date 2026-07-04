import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

const TableActionsContext = createContext(null);
const MENU_WIDTH = 190;
const MENU_OFFSET = 6;

function TableActions({ children, label = "Mais ações" }) {
  const [aberto, setAberto] = useState(false);
  const [posicao, setPosicao] = useState({ left: 0, top: 0, abrirParaCima: false });
  const menuId = useId();
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  function calcularPosicao() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const left = Math.min(
      Math.max(8, rect.right - MENU_WIDTH),
      window.innerWidth - MENU_WIDTH - 8
    );
    const espacoAbaixo = window.innerHeight - rect.bottom;
    const abrirParaCima = espacoAbaixo < 180 && rect.top > 180;
    const top = abrirParaCima
      ? Math.max(8, rect.top - MENU_OFFSET)
      : Math.min(window.innerHeight - 8, rect.bottom + MENU_OFFSET);

    setPosicao({ left, top, abrirParaCima });
  }

  function alternarMenu(event) {
    event.stopPropagation();
    calcularPosicao();
    setAberto((valor) => !valor);
  }

  function fecharMenu() {
    setAberto(false);
  }

  function fecharComTeclado(event) {
    if (event.key === "Escape") {
      event.stopPropagation();
      fecharMenu();
      triggerRef.current?.focus();
    }
  }

  useEffect(() => {
    if (!aberto) return undefined;

    function fecharAoClicarFora(event) {
      if (
        triggerRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return;
      }

      fecharMenu();
    }

    function fecharAoReposicionar() {
      fecharMenu();
    }

    document.addEventListener("mousedown", fecharAoClicarFora);
    window.addEventListener("resize", fecharAoReposicionar);
    window.addEventListener("scroll", fecharAoReposicionar, true);

    return () => {
      document.removeEventListener("mousedown", fecharAoClicarFora);
      window.removeEventListener("resize", fecharAoReposicionar);
      window.removeEventListener("scroll", fecharAoReposicionar, true);
    };
  }, [aberto]);

  return (
    <TableActionsContext.Provider value={fecharMenu}>
      <div className="table-actions-menu">
        <button
          ref={triggerRef}
          type="button"
          className="table-button table-button-secondary table-actions-trigger"
          aria-label={label}
          aria-expanded={aberto}
          aria-controls={aberto ? menuId : undefined}
          aria-haspopup="menu"
          title={label}
          onClick={alternarMenu}
        >
          <MoreHorizontal size={16} aria-hidden="true" />
        </button>

        {aberto &&
          createPortal(
            <div
              id={menuId}
              ref={menuRef}
              role="menu"
              aria-label={label}
              className="table-actions-dropdown"
              onKeyDown={fecharComTeclado}
              style={{
                left: posicao.left,
                top: posicao.abrirParaCima ? "auto" : posicao.top,
                bottom: posicao.abrirParaCima
                  ? window.innerHeight - posicao.top + MENU_OFFSET
                  : "auto",
              }}
            >
              {children}
            </div>,
            document.body
          )}
      </div>
    </TableActionsContext.Provider>
  );
}

export function TableActionItem({
  children,
  className = "",
  onClick,
  variant = "secondary",
  ...props
}) {
  const fecharMenu = useContext(TableActionsContext);

  function handleClick(event) {
    event.stopPropagation();
    onClick?.(event);

    if (!event.defaultPrevented) {
      fecharMenu?.();
    }
  }

  return (
    <button
      type="button"
      role="menuitem"
      className={`table-menu-item table-menu-item-${variant} ${className}`.trim()}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default TableActions;
