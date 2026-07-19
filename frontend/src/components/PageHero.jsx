export default function PageHero({ label, title, subtitle, children, tone = "red" }) {
  return (
    <header className={`page-hero page-hero-${tone}`}>
      <div className="page-hero-main">
        <p className="stamp-label">{label}</p>
        <h1 className="page-hero-title">{title}</h1>
        {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
      </div>
      {children && <div className="page-hero-aside">{children}</div>}
    </header>
  );
}
