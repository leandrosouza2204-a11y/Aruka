import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  Tags,
  Users,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import "./LandingPage.css";

const beneficios = [
  {
    icon: <Users size={22} />,
    title: "Gestão completa de alunos",
    text: "Organize cadastros, status, contatos e acompanhamento em uma única rotina.",
  },
  {
    icon: <Dumbbell size={22} />,
    title: "Montagem de treinos organizada",
    text: "Estruture treinos personalizados e mantenha cada prescrição centralizada.",
  },
  {
    icon: <ClipboardCheck size={22} />,
    title: "Avaliações físicas com histórico",
    text: "Registre avaliações e acompanhe a evolução de cada aluno com clareza.",
  },
  {
    icon: <Tags size={22} />,
    title: "Controle de planos e vencimentos",
    text: "Visualize planos ativos, períodos e vencimentos com mais previsibilidade.",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Dashboard para acompanhar sua operação",
    text: "Tenha indicadores rápidos para decidir onde colocar atenção no dia.",
  },
  {
    icon: <Sparkles size={22} />,
    title: "Experiência mais profissional para o aluno",
    text: "Entregue uma jornada mais organizada, consistente e confiável.",
  },
];

const problemas = [
  "Menos desorganização",
  "Mais controle dos alunos",
  "Mais profissionalismo na entrega",
];

const mockups = [
  {
    title: "Dashboard",
    text: "Tenha uma visão geral da sua operação em poucos segundos.",
    type: "dashboard",
  },
  {
    title: "Alunos",
    text: "Cadastre, organize e acompanhe seus alunos com facilidade.",
    type: "alunos",
  },
  {
    title: "Treinos",
    text: "Monte treinos personalizados e mantenha tudo centralizado.",
    type: "treinos",
  },
  {
    title: "Avaliações",
    text: "Registre avaliações físicas e acompanhe a evolução.",
    type: "avaliacoes",
  },
  {
    title: "Planos",
    text: "Crie planos, pacotes e acompanhe vencimentos.",
    type: "planos",
  },
  {
    title: "Financeiro",
    text: "Visualize pagamentos, renovações e histórico dos alunos.",
    type: "financeiro",
  },
];

const passos = [
  "Cadastre seus alunos",
  "Monte treinos e planos",
  "Acompanhe a evolução",
];

const publico = [
  "Personal trainers",
  "Consultores online",
  "Professores de musculação",
  "Pequenos estúdios",
  "Profissionais que atendem via WhatsApp",
];

const planos = [
  {
    title: "Starter",
    price: "Essencial",
    items: ["Organização de alunos", "Treinos centralizados", "Acompanhamento básico"],
  },
  {
    title: "Profissional",
    price: "Mais usado",
    featured: true,
    items: ["Dashboard completo", "Avaliações com histórico", "Planos e vencimentos"],
  },
  {
    title: "Premium",
    price: "Escala",
    items: ["Operação avançada", "Relatórios visuais", "Experiência premium"],
  },
];

function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link className="landing-brand" to="/" aria-label="Aruka">
          <BrandLogo variant="full" size="sm" />
        </Link>

        <nav className="landing-nav" aria-label="Navegação pública">
          <a href="#beneficios">Benefícios</a>
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#planos">Planos</a>
        </nav>

        <div className="landing-header-actions">
          <Link className="landing-link-button" to="/login">
            Entrar
          </Link>
          <Link className="landing-button landing-button-primary" to="/login">
            Começar agora
          </Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="landing-eyebrow">Sistema para consultoria fitness online</span>
          <h1>Gerencie seus alunos, treinos e planos em um só lugar.</h1>
          <p>
            O Aruka ajuda personal trainers a organizar alunos, treinos, avaliações,
            planos e acompanhamento online com mais profissionalismo.
          </p>
          <div className="landing-hero-actions">
            <Link className="landing-button landing-button-primary" to="/login">
              Começar agora
              <ArrowRight size={18} />
            </Link>
            <a className="landing-button landing-button-secondary" href="#funcionalidades">
              Ver funcionalidades
            </a>
          </div>
        </div>

        <div className="landing-hero-visual" aria-label="Mockup do sistema Aruka">
          <SystemMockup type="dashboard" compact />
        </div>
      </section>

      <section className="landing-section landing-problem">
        <div className="landing-section-heading">
          <span className="landing-eyebrow">Operação mais leve</span>
          <h2>Chega de planilhas, PDFs soltos e WhatsApp bagunçado.</h2>
          <p>
            Com o Aruka, você centraliza sua operação, ganha tempo e oferece uma
            experiência mais profissional para seus alunos.
          </p>
        </div>
        <div className="landing-problem-grid">
          {problemas.map((item) => (
            <article className="landing-card landing-problem-card" key={item}>
              <CheckCircle2 size={22} />
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="beneficios">
        <div className="landing-section-heading">
          <span className="landing-eyebrow">Benefícios</span>
          <h2>Tudo que você precisa para escalar sua consultoria online.</h2>
        </div>
        <div className="landing-benefits-grid">
          {beneficios.map((beneficio) => (
            <article className="landing-card landing-benefit-card" key={beneficio.title}>
              <span className="landing-card-icon">{beneficio.icon}</span>
              <h3>{beneficio.title}</h3>
              <p>{beneficio.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-feature-section" id="funcionalidades">
        <div className="landing-section-heading">
          <span className="landing-eyebrow">Funcionalidades</span>
          <h2>Uma experiência de SaaS para o seu atendimento fitness.</h2>
        </div>
        <div className="landing-feature-stack">
          {mockups.map((mockup) => (
            <article className="landing-feature-block" key={mockup.title}>
              <div className="landing-feature-copy">
                <span className="landing-feature-number">
                  {String(mockups.indexOf(mockup) + 1).padStart(2, "0")}
                </span>
                <h3>{mockup.title}</h3>
                <p>{mockup.text}</p>
              </div>
              <SystemMockup type={mockup.type} />
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-steps" id="como-funciona">
        <div className="landing-section-heading">
          <span className="landing-eyebrow">Como funciona</span>
          <h2>Da organização inicial ao acompanhamento contínuo.</h2>
        </div>
        <div className="landing-steps-grid">
          {passos.map((passo, index) => (
            <article className="landing-card landing-step-card" key={passo}>
              <span>{index + 1}</span>
              <h3>{passo}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-audience">
        <div className="landing-section-heading">
          <span className="landing-eyebrow">Para quem é</span>
          <h2>Feito para profissionais que querem uma operação mais clara.</h2>
        </div>
        <div className="landing-audience-grid">
          {publico.map((item) => (
            <article className="landing-card landing-audience-card" key={item}>
              <ShieldCheck size={20} />
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="planos">
        <div className="landing-section-heading">
          <span className="landing-eyebrow">Planos</span>
          <h2>Escolha uma estrutura para apresentar sua consultoria com mais valor.</h2>
        </div>
        <div className="landing-pricing-grid">
          {planos.map((plano) => (
            <article
              className={`landing-card landing-price-card${
                plano.featured ? " landing-price-card-featured" : ""
              }`}
              key={plano.title}
            >
              <div>
                <h3>{plano.title}</h3>
                <strong>{plano.price}</strong>
              </div>
              <ul>
                {plano.items.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={17} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link className="landing-button landing-button-primary" to="/login">
                Começar agora
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-final-cta">
        <div>
          <span className="landing-eyebrow">Próximo passo</span>
          <h2>Transforme sua consultoria em uma operação profissional.</h2>
          <p>
            Com o Aruka, você organiza sua rotina, entrega mais valor e acompanha
            seus alunos com muito mais clareza.
          </p>
        </div>
        <Link className="landing-button landing-button-primary" to="/login">
          Começar agora
          <ArrowRight size={18} />
        </Link>
      </section>

      <footer className="landing-footer">
        <div>
          <BrandLogo variant="full" size="sm" />
          <p>Sistema para personal trainers, consultores online e profissionais fitness.</p>
        </div>
        <nav aria-label="Links do rodapé">
          <Link to="/login">Entrar</Link>
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#planos">Planos</a>
        </nav>
      </footer>
    </main>
  );
}

function SystemMockup({ type, compact = false }) {
  const rows = {
    dashboard: ["Alunos ativos", "Treinos enviados", "Planos vencendo"],
    alunos: ["Marina Alves", "João Martins", "Rafael Costa"],
    treinos: ["Treino A", "Treino B", "Mobilidade"],
    avaliacoes: ["Peso", "Medidas", "Evolução"],
    planos: ["Starter", "Profissional", "Premium"],
    financeiro: ["Pago", "Pendente", "Renovação"],
  };

  const title = {
    dashboard: "Dashboard",
    alunos: "Alunos",
    treinos: "Treinos",
    avaliacoes: "Avaliações",
    planos: "Planos",
    financeiro: "Financeiro",
  }[type];

  return (
    <div className={`landing-mockup${compact ? " landing-mockup-compact" : ""}`}>
      <div className="landing-mockup-sidebar">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="landing-mockup-screen">
        <div className="landing-mockup-topbar">
          <strong>{title}</strong>
          <span>Aruka</span>
        </div>
        <div className="landing-mockup-kpis">
          <span />
          <span />
          <span />
        </div>
        <div className={`landing-mockup-content landing-mockup-content-${type}`}>
          <div className="landing-mockup-chart">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="landing-mockup-list">
            {rows[type].map((row) => (
              <div key={row}>
                <span>{row}</span>
                <i />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
