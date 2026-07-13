import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

const TableActionsContext = createContext(null);
const MENU_WIDTH = 240;
const MENU_OFFSET = 8;
const MENU_MARGIN = 16;

function TableActions({ children, label = "Mais ações", testIdPrefix = "aluno" }) {
  const [aberto, setAberto] = useState(false);
  const [posicao, setPosicao] = useState({
    left: MENU_MARGIN,
    top: MENU_MARGIN,
    maxHeight: 360,
  });
  const menuId = useId();
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  function calcularPosicao() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = Math.min(MENU_WIDTH, viewportWidth - MENU_MARGIN * 2);
    const left = Math.min(
      Math.max(MENU_MARGIN, rect.right - menuWidth),
      viewportWidth - menuWidth - MENU_MARGIN
    );
    const espacoAbaixo = viewportHeight - rect.bottom - MENU_MARGIN;
    const espacoAcima = rect.top - MENU_MARGIN;
    const abrirParaCima = espacoAbaixo < 180 && espacoAcima > espacoAbaixo;
    const espacoDisponivel = Math.max(
      96,
      abrirParaCima ? espacoAcima - MENU_OFFSET : espacoAbaixo - MENU_OFFSET
    );
    const maxHeight = Math.min(360, espacoDisponivel);
    const top = abrirParaCima
      ? Math.max(MENU_MARGIN, rect.top - MENU_OFFSET - maxHeight)
      : Math.min(rect.bottom + MENU_OFFSET, viewportHeight - MENU_MARGIN - maxHeight);

    setPosicao({ left, top, maxHeight });
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

    function fecharAoPressionarEscape(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        fecharMenu();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", fecharAoClicarFora);
    document.addEventListener("keydown", fecharAoPressionarEscape);
    window.addEventListener("resize", fecharAoReposicionar);
    window.addEventListener("scroll", fecharAoReposicionar, true);

    return () => {
      document.removeEventListener("mousedown", fecharAoClicarFora);
      document.removeEventListener("keydown", fecharAoPressionarEscape);
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
          data-testid={`${testIdPrefix}-actions-trigger`}
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
              data-testid={`${testIdPrefix}-actions-menu`}
              aria-label={label}
              className="table-actions-dropdown"
              onKeyDown={fecharComTeclado}
              style={{
                left: posicao.left,
                top: posicao.top,
                maxHeight: posicao.maxHeight,
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
