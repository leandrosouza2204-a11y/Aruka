function PageHero({
  eyebrow,
  title,
  description,
  actions,
  meta,
  children,
  variant = "default",
}) {
  return (
    <section className={`page-hero page-hero-${variant}`}>
      <div className="page-hero-content">
        {eyebrow && <span className="page-hero-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {meta && <div className="page-hero-meta">{meta}</div>}
        {children && <div className="page-hero-extra">{children}</div>}
      </div>

      {actions && <div className="page-hero-actions">{actions}</div>}
    </section>
  );
}

export default PageHero;
