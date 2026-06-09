import { MoreHorizontal } from "lucide-react";

function TableActions({ children, label = "Mais acoes" }) {
  return (
    <details className="table-actions-menu">
      <summary className="table-button table-button-secondary table-actions-trigger">
        <MoreHorizontal size={16} aria-hidden="true" />
        <span>{label}</span>
      </summary>
      <div className="table-actions-dropdown">{children}</div>
    </details>
  );
}

export function TableActionItem({
  children,
  className = "",
  variant = "secondary",
  ...props
}) {
  return (
    <button
      type="button"
      className={`table-menu-item table-menu-item-${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default TableActions;
