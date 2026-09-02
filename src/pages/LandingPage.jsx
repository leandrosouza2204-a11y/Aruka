import { useId, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Dumbbell,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  WalletCards,
  X,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import "./LandingPage.css";

const navItems = [
  { label: "Beneficios", href: "#beneficios" },
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
];

const valueStrip = [
  "Alunos em ordem",
  "Treinos centralizados",
  "Financeiro visivel",
  "Acompanhamento claro",
];

const productModules = [
  {
    icon: <UserRoundCheck size={20} />,
    title: "Gestao de alunos",
    text: "Cadastro, contratos, acesso do aluno, avaliacoes, treinos e acompanhamento ficam conectados no mesmo fluxo.",
    preview: "students",
  },
  {
    icon: <Dumbbell size={20} />,
    title: "Treinos",
    text: "Monte prescricoes, organize fichas ativas e entregue uma experiencia mais profissional para cada aluno.",
    preview: "workouts",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Acompanhamento",
    text: "Veja historico de execucao, progresso e sinais factuais que ajudam a identificar quem precisa de atencao.",
    preview: "tracking",
  },
  {
    icon: <WalletCards size={20} />,
    title: "Financeiro",
    text: "Acompanhe contratos, parcelas, vencimentos e pendencias sem depender de controles espalhados.",
    preview: "finance",
  },
];

const benefits = [
  {
    icon: <ClipboardList size={22} />,
    title: "Mais organizacao",
    text: "Uma rotina unica para consultar dados importantes antes de decidir o proximo contato.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Mais controle",
    text: "Visao clara de alunos, treinos, avaliacoes, financeiro e acesso sem perder contexto.",
  },
  {
    icon: <Sparkles size={22} />,
    title: "Mais profissionalismo",
    text: "A entrega fica mais consistente para o profissional e mais simples para o aluno.",
  },
  {
    icon: <MessageCircle size={22} />,
    title: "Mais tempo para acompanhar",
    text: "O WhatsApp continua util, mas a operacao deixa de depender so da memoria e de mensagens soltas.",
  },
];

const steps = [
  {
    title: "Organize seus alunos",
    text: "Cadastre alunos, planos, contratos, acesso e informacoes importantes.",
  },
  {
    title: "Monte e entregue treinos",
    text: "Crie fichas, acompanhe status e mantenha o aluno com um caminho claro.",
  },
  {
    title: "Acompanhe a evolucao",
    text: "Use historico, avaliacoes e sinais do produto para priorizar sua rotina.",
  },
  {
    title: "Gerencie a consultoria",
    text: "Tenha financeiro, vencimentos e proximas acoes no mesmo ambiente.",
  },
];

const plans = [
  {
    title: "Starter",
    marker: "Essencial",
    items: ["Organizacao de alunos", "Treinos centralizados", "Acompanhamento basico"],
  },
  {
    title: "Profissional",
    marker: "Mais usado",
    featured: true,
    items: ["Dashboard completo", "Avaliacoes com historico", "Planos e vencimentos"],
  },
  {
    title: "Premium",
    marker: "Escala",
    items: ["Operacao avancada", "Relatorios visuais", "Experiencia premium"],
  },
];

const faqs = [
  {
    question: "Para quem e o Aruka?",
    answer: "Para personal trainers e consultores fitness que querem organizar alunos, treinos, avaliacoes e financeiro em uma plataforma propria.",
  },
  {
    question: "O aluno tambem acessa o sistema?",
    answer: "Sim. O aluno pode acessar a area do aluno para visualizar e executar treinos quando o acesso estiver liberado.",
  },
  {
    question: "O Aruka funciona no celular?",
    answer: "Sim. O Aruka pode ser usado no navegador e instalado como app no Android e no iPhone, com a experiencia PWA validada.",
  },
  {
    question: "Os planos mudaram nesta landing?",
    answer: "Nao. Esta etapa renova apenas a apresentacao publica; regras comerciais, cobranca e assinatura permanecem iguais.",
  },
];

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuId = useId();

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <main className="landing-page">
      <LandingHeader
        menuId={menuId}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMenu={closeMobileMenu}
        onToggleMenu={() => setMobileMenuOpen((open) => !open)}
      />
      <Hero />
      <ValueStrip />
      <ProblemSolution />
      <ProductShowcase />
      <StudentExperience />
      <Benefits />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <LandingFooter />
    </main>
  );
}

function LandingHeader({ menuId, mobileMenuOpen, onCloseMenu, onToggleMenu }) {
  return (
    <header className="landing-header">
      <div className="landing-header-inner">
        <Link className="landing-brand" to="/" aria-label="Aruka">
          <BrandLogo variant="full" size="sm" />
        </Link>

        <nav className="landing-nav landing-nav-desktop" aria-label="Navegacao publica">
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>{item.label}</a>
          ))}
        </nav>

        <div className="landing-header-actions">
          <Link className="landing-login-link" to="/login">Entrar</Link>
          <Link className="landing-button landing-button-primary landing-header-cta" to="/login">
            Comecar agora
          </Link>
          <button
            aria-controls={menuId}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            className="landing-menu-button"
            onClick={onToggleMenu}
            type="button"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <nav
        aria-label="Menu publico mobile"
        className={`landing-mobile-menu${mobileMenuOpen ? " landing-mobile-menu-open" : ""}`}
        hidden={!mobileMenuOpen}
        id={menuId}
      >
        {navItems.map((item) => (
          <a href={item.href} key={item.href} onClick={onCloseMenu}>{item.label}</a>
        ))}
        <Link to="/login" onClick={onCloseMenu}>Entrar</Link>
        <Link className="landing-button landing-button-primary" to="/login" onClick={onCloseMenu}>
          Comecar agora
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero-copy">
        <span className="landing-eyebrow">Sistema para consultoria fitness online</span>
        <h1>Sua consultoria fitness, organizada para crescer.</h1>
        <p>
          Alunos, treinos, avaliacoes, financeiro e acompanhamento em uma unica plataforma
          para uma operacao mais profissional.
        </p>
        <div className="landing-hero-actions">
          <Link className="landing-button landing-button-primary" to="/login">
            Comecar agora
            <ArrowRight size={18} />
          </Link>
          <a className="landing-button landing-button-secondary" href="#funcionalidades">
            Ver como funciona
          </a>
        </div>
      </div>

      <div className="landing-hero-product" aria-label="Previa visual do dashboard Aruka">
        <ProductFrame variant="dashboard" />
      </div>
    </section>
  );
}

function ValueStrip() {
  return (
    <section className="landing-value-strip" aria-label="Resumo de valor">
      {valueStrip.map((item) => (
        <span key={item}>
          <CheckCircle2 size={16} />
          {item}
        </span>
      ))}
    </section>
  );
}

function ProblemSolution() {
  return (
    <section className="landing-section landing-problem">
      <div className="landing-section-heading">
        <span className="landing-eyebrow">Operacao mais leve</span>
        <h2>Menos tempo organizando. Mais tempo acompanhando seus alunos.</h2>
        <p>
          O Aruka centraliza dados que antes ficavam espalhados entre planilhas,
          PDFs, historicos soltos e conversas. O WhatsApp continua no atendimento;
          a gestao deixa de depender somente dele.
        </p>
      </div>
      <div className="landing-problem-panel">
        <div>
          <strong>Antes</strong>
          <p>Informacoes fragmentadas, revisoes manuais e pouco contexto para decidir quem precisa de atencao.</p>
        </div>
        <ArrowRight aria-hidden="true" size={22} />
        <div>
          <strong>Com Aruka</strong>
          <p>Aluno, treino, avaliacao, financeiro e sinais de acompanhamento no mesmo lugar.</p>
        </div>
      </div>
    </section>
  );
}

function ProductShowcase() {
  return (
    <section className="landing-section landing-showcase" id="funcionalidades">
      <div className="landing-section-heading">
        <span className="landing-eyebrow">Funcionalidades</span>
        <h2>Tudo acontece no Aruka.</h2>
        <p>
          Uma visao do produto real, organizada por blocos que refletem a rotina
          do profissional sem prometer automacoes ainda nao implementadas.
        </p>
      </div>
      <div className="landing-showcase-grid">
        {productModules.map((module) => (
          <article className="landing-showcase-item" key={module.title}>
            <div className="landing-showcase-copy">
              <span className="landing-card-icon">{module.icon}</span>
              <h3>{module.title}</h3>
              <p>{module.text}</p>
            </div>
            <ProductMiniFrame variant={module.preview} />
          </article>
        ))}
      </div>
    </section>
  );
}

function StudentExperience() {
  return (
    <section className="landing-section landing-student">
      <div className="landing-student-copy">
        <span className="landing-eyebrow">Experiencia do aluno</span>
        <h2>Seu aluno tambem sente a diferenca.</h2>
        <p>
          A area do aluno permite visualizar o treino ativo, executar sessoes,
          acompanhar historico e acessar o Aruka no celular como um app instalado.
        </p>
        <div className="landing-student-tags">
          <span>Area do aluno</span>
          <span>Execucao de treino</span>
          <span>Historico</span>
          <span>PWA no celular</span>
        </div>
      </div>
      <div className="landing-phone-frame" aria-label="Previa mobile da area do aluno">
        <div className="landing-phone-top" />
        <div className="landing-phone-card landing-phone-card-strong">
          <span>Treino de hoje</span>
          <strong>Forca superior</strong>
          <p>5 exercicios cadastrados</p>
        </div>
        <div className="landing-phone-list">
          <span>Supino reto</span>
          <span>Remada baixa</span>
          <span>Desenvolvimento</span>
        </div>
        <button className="landing-phone-action" type="button">Iniciar treino</button>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="landing-section" id="beneficios">
      <div className="landing-section-heading">
        <span className="landing-eyebrow">Beneficios</span>
        <h2>Uma operacao mais clara sem deixar sua consultoria pesada.</h2>
      </div>
      <div className="landing-benefits-grid">
        {benefits.map((benefit) => (
          <article className="landing-card landing-benefit-card" key={benefit.title}>
            <span className="landing-card-icon">{benefit.icon}</span>
            <h3>{benefit.title}</h3>
            <p>{benefit.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="landing-section landing-steps" id="como-funciona">
      <div className="landing-section-heading">
        <span className="landing-eyebrow">Como funciona</span>
        <h2>Da primeira organizacao ao acompanhamento continuo.</h2>
      </div>
      <div className="landing-steps-grid">
        {steps.map((step, index) => (
          <article className="landing-step" key={step.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="landing-section" id="planos">
      <div className="landing-section-heading">
        <span className="landing-eyebrow">Planos</span>
        <h2>Escolha a estrutura ideal para apresentar sua consultoria com mais valor.</h2>
        <p>A apresentacao visual foi renovada. Precos e regras comerciais continuam os mesmos do produto.</p>
      </div>
      <div className="landing-pricing-grid">
        {plans.map((plan) => (
          <article className={`landing-price-card${plan.featured ? " landing-price-card-featured" : ""}`} key={plan.title}>
            <div>
              <span>{plan.marker}</span>
              <h3>{plan.title}</h3>
            </div>
            <ul>
              {plan.items.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={17} />
                  {item}
                </li>
              ))}
            </ul>
            <Link className="landing-button landing-button-primary" to="/login">
              Comecar agora
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="landing-section landing-faq">
      <div className="landing-section-heading">
        <span className="landing-eyebrow">Duvidas comuns</span>
        <h2>Direto ao ponto.</h2>
      </div>
      <div className="landing-faq-list">
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>
              {faq.question}
              <ChevronDown size={18} />
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="landing-final-cta">
      <span className="landing-eyebrow">Proximo passo</span>
      <h2>Sua consultoria merece uma operacao mais profissional.</h2>
      <p>Comece a organizar alunos, treinos, financeiro e acompanhamento em um so lugar.</p>
      <Link className="landing-button landing-button-primary" to="/login">
        Comecar agora
        <ArrowRight size={18} />
      </Link>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-brand">
        <BrandLogo variant="full" size="sm" />
        <p>Sistema para consultoria fitness online com gestao, treino, acompanhamento e financeiro.</p>
      </div>
      <nav aria-label="Links da landing">
        <a href="#beneficios">Beneficios</a>
        <a href="#funcionalidades">Funcionalidades</a>
        <a href="#planos">Planos</a>
        <Link to="/politica-privacidade">Privacidade</Link>
        <Link to="/termos-de-uso">Termos</Link>
      </nav>
      <p className="landing-copyright">Aruka. Organize. Guie. Transforme.</p>
    </footer>
  );
}

function ProductFrame({ variant }) {
  return (
    <div className={`landing-product-frame landing-product-${variant}`}>
      <div className="landing-product-window">
        <span />
        <span />
        <span />
      </div>
      <div className="landing-product-shell">
        <aside>
          <BrandLogo variant="icon" size="legal" />
          <span />
          <span />
          <span />
          <span />
        </aside>
        <div className="landing-product-screen">
          <div className="landing-product-top">
            <div>
              <span>Dashboard</span>
              <strong>Boa tarde, profissional</strong>
            </div>
            <i>Hoje</i>
          </div>
          <div className="landing-product-kpis">
            <Metric label="Alunos ativos" value="32" />
            <Metric label="Treinos ativos" value="18" />
            <Metric label="Vencimentos" value="4" />
          </div>
          <div className="landing-product-content">
            <div className="landing-product-chart">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="landing-product-feed">
              <strong>Atencao e acompanhamento</strong>
              <ProductRow title="Aluno sem treino ativo" tag="Treinos" />
              <ProductRow title="Sessao concluida recente" tag="Historico" />
              <ProductRow title="Contrato proximo" tag="Financeiro" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductMiniFrame({ variant }) {
  const rows = {
    students: ["Marina, ativo", "Rafael, convite enviado", "Camila, revisar plano"],
    workouts: ["Ficha superior", "Treino entregue", "Revisao em aberto"],
    tracking: ["Execucao recente", "Sem sessao 7 dias", "Avaliacao registrada"],
    finance: ["Parcela proxima", "Pagamento confirmado", "Renovacao planejada"],
  };

  return (
    <div className={`landing-mini-frame landing-mini-${variant}`}>
      <div className="landing-mini-bars">
        <span />
        <span />
        <span />
      </div>
      <div className="landing-mini-list">
        {rows[variant].map((row) => (
          <ProductRow key={row} title={row} tag="" />
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="landing-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProductRow({ title, tag }) {
  return (
    <div className="landing-product-row">
      <span>{title}</span>
      {tag && <i>{tag}</i>}
    </div>
  );
}

export default LandingPage;
