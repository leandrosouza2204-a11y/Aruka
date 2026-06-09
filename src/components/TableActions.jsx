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
