import { MoreHorizontal } from "lucide-react";

function TableActions({ children, label = "Mais ações" }) {
  return (
    <details className="table-actions-menu">
      <summary
        className="table-button table-button-secondary table-actions-trigger"
        aria-label={label}
        title={label}
      >
        <MoreHorizontal size={16} aria-hidden="true" />
      </summary>
      <div className="table-actions-dropdown">{children}</div>
    </details>
  );
}

export function TableActionItem({
  children,
  className = "",
  onClick,
  variant = "secondary",
  ...props
}) {
  function handleClick(event) {
    event.stopPropagation();
    onClick?.(event);

    if (!event.defaultPrevented) {
      event.currentTarget.closest("details")?.removeAttribute("open");
    }
  }

  return (
    <button
      type="button"
      className={`table-menu-item table-menu-item-${variant} ${className}`.trim()}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default TableActions;
