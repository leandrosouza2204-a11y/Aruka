import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import "./LandingPage.css";

const aboutNavItems = [
  { label: "Benefícios", href: "/#beneficios" },
  { label: "Funcionalidades", href: "/#funcionalidades" },
  { label: "Planos", href: "/#planos" },
  { label: "Sobre", href: "/sobre" },
];

const values = [
  { icon: <TrendingUp size={18} />, label: "Evolução contínua" },
  { icon: <Sparkles size={18} />, label: "Simplicidade" },
  { icon: <ShieldCheck size={18} />, label: "Confiança" },
  { icon: <Target size={18} />, label: "Tecnologia com propósito" },
  { icon: <Users size={18} />, label: "Respeito às pessoas" },
  { icon: <Leaf size={18} />, label: "Crescimento sustentável" },
];

function Sobre() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const previousDescription = description?.getAttribute("content") || "";
    const previousOgTitle = ogTitle?.getAttribute("content") || "";
    const previousOgDescription = ogDescription?.getAttribute("content") || "";
    const title = "Sobre a Aruka | Tecnologia para quem transforma vidas";
    const summary = "Conheça a história, missão, visão e valores da Aruka, uma marca criada para simplificar a gestão de profissionais do movimento.";

    document.title = title;
    description?.setAttribute("content", summary);
    ogTitle?.setAttribute("content", title);
    ogDescription?.setAttribute("content", summary);

    return () => {
      document.title = previousTitle;
      description?.setAttribute("content", previousDescription);
      ogTitle?.setAttribute("content", previousOgTitle);
      ogDescription?.setAttribute("content", previousOgDescription);
    };
  }, []);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <main className="landing-page about-page">
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link className="landing-brand landing-brand-dark" to="/" aria-label="Aruka">
            <BrandLogo variant="icon" size="legal" />
            <span>ARUKA</span>
          </Link>

          <nav className="landing-nav landing-nav-desktop" aria-label="Navegação pública">
            {aboutNavItems.map((item) => (
              <Link to={item.href} key={item.href}>{item.label}</Link>
            ))}
          </nav>

          <div className="landing-header-actions">
            <Link className="landing-login-link" to="/login">Entrar</Link>
            <Link className="landing-button landing-button-primary landing-header-cta" to="/login">
              Começar agora
            </Link>
            <button
              aria-controls={menuId}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              className="landing-menu-button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              type="button"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav
          aria-label="Menu público mobile"
          className={`landing-mobile-menu${mobileMenuOpen ? " landing-mobile-menu-open" : ""}`}
          hidden={!mobileMenuOpen}
          id={menuId}
        >
          {aboutNavItems.map((item) => (
            <Link to={item.href} key={item.href} onClick={closeMobileMenu}>{item.label}</Link>
          ))}
          <Link to="/login" onClick={closeMobileMenu}>Entrar</Link>
          <Link className="landing-button landing-button-primary" to="/login" onClick={closeMobileMenu}>
            Começar agora
          </Link>
        </nav>
      </header>

      <section className="about-hero">
        <Link className="about-back-link" to="/">
          <ArrowLeft size={17} />
          Voltar para o início
        </Link>
        <span className="landing-eyebrow">Nossa história</span>
        <h1>Aruka. Tecnologia para quem transforma vidas.</h1>
        <p>
          Uma marca criada para acompanhar jornadas, simplificar rotinas e
          impulsionar a evolução por meio da tecnologia.
        </p>
      </section>

      <section className="about-editorial-section">
        <span className="landing-eyebrow">Origem da marca</span>
        <h2>Aruka</h2>
        <div className="about-prose">
          <p>
            Inspirada na riqueza linguística dos povos originários do Brasil,
            especialmente na sonoridade das línguas da família tupi-guarani.
          </p>
          <p>
            A Aruka é uma marca original, criada a partir da inspiração na
            riqueza linguística dos povos originários do Brasil e nos conceitos
            de jornada, movimento, evolução e transformação que essa herança
            cultural evoca.
          </p>
          <p>
            O nome não corresponde a uma palavra existente em tupi-guarani. Ele
            foi cuidadosamente desenvolvido para refletir os valores que definem
            a essência da marca: acompanhar o crescimento dos profissionais,
            simplificar sua rotina e impulsionar sua evolução por meio da tecnologia.
          </p>
        </div>
      </section>

      <section className="about-manifest-section">
        <span className="landing-eyebrow">Manifesto</span>
        <h2>Toda evolução começa com um caminho.</h2>
        <div className="about-prose">
          <p>
            Inspirada na riqueza cultural e linguística dos povos originários do
            Brasil, a Aruka nasceu para caminhar ao lado de quem transforma vidas
            por meio do movimento.
          </p>
          <p>
            Acreditamos que a tecnologia deve eliminar a complexidade, organizar
            processos e impulsionar o crescimento de profissionais que dedicam
            seu tempo ao cuidado com outras pessoas.
          </p>
          <p>
            Mais do que um software, construímos uma plataforma que acompanha
            cada etapa dessa jornada, permitindo que nossos clientes foquem no
            que realmente importa: transformar vidas.
          </p>
          <p>Porque evoluir não significa apenas chegar mais longe.</p>
          <p>Significa percorrer o caminho certo.</p>
        </div>
      </section>

      <section className="about-purpose-grid">
        <article>
          <span className="landing-eyebrow">Nossa missão</span>
          <h2>Simplificar a gestão.</h2>
          <p>
            Simplificar a gestão para que profissionais possam dedicar mais tempo
            às pessoas e menos tempo à burocracia.
          </p>
        </article>
        <article>
          <span className="landing-eyebrow">Nossa visão</span>
          <h2>Tecnologia como aliada.</h2>
          <p>
            Ser a plataforma de gestão mais confiável para profissionais do
            movimento, tornando a tecnologia uma aliada da evolução de seus negócios.
          </p>
        </article>
      </section>

      <section className="about-values-section">
        <div className="landing-section-heading about-wide-heading">
          <span className="landing-eyebrow">Nossos valores</span>
          <h2>O que orienta cada decisão da Aruka.</h2>
        </div>
        <div className="about-values-list">
          {values.map((value) => (
            <div className="about-value-item" key={value.label}>
              <span>{value.icon}</span>
              <strong>{value.label}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="about-signature">
        <BrandLogo variant="icon" size="lg" />
        <h2>Aruka</h2>
        <p>Tecnologia para quem transforma vidas.</p>
        <Link className="landing-button landing-button-primary" to="/login">
          Começar agora
          <ArrowRight size={18} />
        </Link>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <Link className="landing-brand landing-brand-light" to="/" aria-label="Aruka">
              <BrandLogo variant="icon" size="legal" />
              <span>ARUKA</span>
            </Link>
            <p>Sistema para consultoria fitness online com gestão, treino, acompanhamento e financeiro.</p>
          </div>
          <nav aria-label="Links institucionais">
            <Link to="/#beneficios">Benefícios</Link>
            <Link to="/#funcionalidades">Funcionalidades</Link>
            <Link to="/sobre">Sobre</Link>
            <Link to="/#planos">Planos</Link>
            <Link to="/politica-privacidade">Privacidade</Link>
            <Link to="/termos-de-uso">Termos</Link>
          </nav>
          <p className="landing-copyright">Aruka. Tecnologia para quem transforma vidas.</p>
        </div>
      </footer>
    </main>
  );
}

export default Sobre;
