function InlineDetails({
  itemId,
  selectedItemId,
  onToggle,
  children,
  variant = "inline",
  className = "",
}) {
  const aberto = Boolean(itemId) && itemId === selectedItemId;

  if (!aberto) return null;

  return (
    <section
      aria-hidden={!aberto}
      className={["inline-details", `inline-details-${variant}`, className]
        .filter(Boolean)
        .join(" ")}
      data-toggle-bound={typeof onToggle === "function" ? "true" : undefined}
    >
      {children}
    </section>
  );
}

export default InlineDetails;
