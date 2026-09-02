import { useId, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Dumbbell,
  FileText,
  HeartPulse,
  Menu,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  UserRoundCheck,
  WalletCards,
  X,
} from "lucide-react";
import { commercialPlans } from "../data/commercialPlans";
import BrandLogo from "../components/BrandLogo";
import "./LandingPage.css";

const navItems = [
  { label: "Benefícios", href: "#beneficios" },
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Sobre", href: "/sobre" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
];

const valueStrip = [
  "Alunos em ordem",
  "Treinos centralizados",
  "Financeiro visível",
  "Acompanhamento claro",
];

const solutionBenefits = [
  {
    icon: <ClipboardList size={20} />,
    title: "Informações centralizadas",
    text: "Dados importantes deixam de ficar espalhados entre planilhas, PDFs e históricos soltos.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Rotina mais organizada",
    text: "Alunos, treinos, avaliações, contratos e vencimentos passam a ter um ponto de consulta.",
  },
  {
    icon: <HeartPulse size={20} />,
    title: "Mais clareza no acompanhamento",
    text: "Sinais factuais ajudam a enxergar quem precisa de atenção na rotina da consultoria.",
  },
];

const productModules = [
  {
    icon: <UserRoundCheck size={20} />,
    title: "Gestão de alunos",
    text: "Cadastro, status, contrato, acesso do aluno, treino e acompanhamento conectados ao mesmo registro.",
    preview: "students",
  },
  {
    icon: <Dumbbell size={20} />,
    title: "Treinos",
    text: "Organize fichas, exercícios, status e entrega dos treinos sem perder o vínculo com cada aluno.",
    preview: "workouts",
  },
  {
    icon: <FileText size={20} />,
    title: "Avaliações",
    text: "Registre avaliações e mantenha o histórico do aluno disponível para consulta na evolução do atendimento.",
    preview: "assessments",
  },
  {
    icon: <WalletCards size={20} />,
    title: "Financeiro",
    text: "Acompanhe contratos, parcelas, vencimentos e pendências dentro da operação da consultoria.",
    preview: "finance",
  },
  {
    icon: <HeartPulse size={20} />,
    title: "Acompanhamento",
    text: "Use alertas e sinais existentes para priorizar alunos sem treino ativo, acesso pendente ou atenção financeira.",
    preview: "tracking",
  },
];

const benefits = [
  {
    icon: <ClipboardList size={22} />,
    title: "Mais organização",
    text: "Uma rotina única para consultar dados importantes antes de decidir o próximo contato.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Mais controle",
    text: "Visão clara de alunos, treinos, avaliações, financeiro e acesso sem perder contexto.",
  },
  {
    icon: <MessageCircle size={22} />,
    title: "WhatsApp no lugar certo",
    text: "O WhatsApp continua fazendo parte do atendimento; o Aruka organiza o que não deveria depender apenas das conversas.",
  },
  {
    icon: <Smartphone size={22} />,
    title: "Use também no celular",
    text: "A experiência se adapta ao navegador do celular e pode ser instalada em dispositivos compatíveis.",
  },
];

const steps = [
  {
    title: "Organize seus alunos",
    text: "Cadastre alunos, planos, contratos, acesso e informações importantes.",
  },
  {
    title: "Monte e entregue treinos",
    text: "Crie fichas, acompanhe status e mantenha o aluno com um caminho claro.",
  },
  {
    title: "Acompanhe a evolução",
    text: "Use histórico, avaliações e sinais do produto para priorizar sua rotina.",
  },
  {
    title: "Gerencie a consultoria",
    text: "Tenha financeiro, vencimentos e próximas ações no mesmo ambiente.",
  },
];

const faqs = [
  {
    question: "Para quem é o Aruka?",
    answer: "Para personal trainers e consultores fitness que querem organizar alunos, treinos, avaliações, financeiro e acompanhamento em uma plataforma própria.",
  },
  {
    question: "Meu aluno também acessa o Aruka?",
    answer: "Sim. Quando o acesso está disponível, o aluno entra na área do aluno para visualizar o treino ativo, executar sessões e consultar histórico.",
  },
  {
    question: "Consigo montar e enviar treinos pelo Aruka?",
    answer: "Sim. O Aruka permite cadastrar fichas, organizar exercícios, acompanhar status e manter os treinos vinculados aos alunos.",
  },
  {
    question: "Posso acompanhar avaliações e evolução dos alunos?",
    answer: "Sim. O produto mantém registros e históricos de avaliações para apoiar o acompanhamento do profissional.",
  },
  {
    question: "O Aruka funciona no celular?",
    answer: "Sim. O Aruka pode ser usado pelo navegador do celular e instalado como aplicativo em dispositivos compatíveis.",
  },
  {
    question: "O que está incluído no meu plano?",
    answer: "Os planos atuais incluem acesso completo ao Aruka. A diferença entre eles é o período contratado.",
  },
];

const planDescriptions = {
  mensal: "Acesso por 30 dias.",
  trimestral: "Acesso por 3 meses.",
  semestral: "Acesso por 6 meses.",
  anual: "Acesso por 12 meses.",
};

const miniFrameTitle = {
  students: "Alunos",
  workouts: "Treinos",
  assessments: "Avaliações",
  finance: "Financeiro",
  tracking: "Acompanhamento",
};

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
      <BrandStory />
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
        <LandingBrand tone="dark" />

        <nav className="landing-nav landing-nav-desktop" aria-label="Navegação pública">
          {navItems.map((item) => (
            <HeaderNavLink item={item} key={item.href} />
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
            onClick={onToggleMenu}
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
        {navItems.map((item) => (
          <HeaderNavLink item={item} key={item.href} onClick={onCloseMenu} />
        ))}
        <Link to="/login" onClick={onCloseMenu}>Entrar</Link>
        <Link className="landing-button landing-button-primary" to="/login" onClick={onCloseMenu}>
          Começar agora
        </Link>
      </nav>
    </header>
  );
}

function HeaderNavLink({ item, onClick }) {
  if (item.href.startsWith("/")) {
    return <Link to={item.href} onClick={onClick}>{item.label}</Link>;
  }

  return <a href={item.href} onClick={onClick}>{item.label}</a>;
}

function LandingBrand({ tone = "dark" }) {
  return (
    <Link className={`landing-brand landing-brand-${tone}`} to="/" aria-label="Aruka">
      <BrandLogo variant="icon" size="legal" />
      <span>ARUKA</span>
    </Link>
  );
}

function Hero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero-copy">
        <span className="landing-eyebrow">Sistema para consultoria fitness online</span>
        <h1>Sua consultoria fitness, organizada para crescer.</h1>
        <p>
          Alunos, treinos, avaliações, financeiro e acompanhamento em uma única plataforma
          para uma operação mais profissional.
        </p>
        <div className="landing-hero-actions">
          <Link className="landing-button landing-button-primary" to="/login">
            Começar agora
            <ArrowRight size={18} />
          </Link>
          <a className="landing-button landing-button-secondary" href="#funcionalidades">
            Ver como funciona
          </a>
        </div>
      </div>

      <div className="landing-hero-product" aria-label="Prévia visual do dashboard Aruka">
        <ProductFrame />
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
        <span className="landing-eyebrow">Operação mais leve</span>
        <h2>Menos tempo organizando. Mais tempo acompanhando seus alunos.</h2>
        <p>
          O Aruka centraliza dados que antes ficavam espalhados entre planilhas,
          PDFs, históricos e conversas. O WhatsApp continua fazendo parte do atendimento;
          o sistema organiza o que precisa virar rotina.
        </p>
      </div>
      <div className="landing-solution-grid">
        {solutionBenefits.map((benefit) => (
          <article className="landing-solution-card" key={benefit.title}>
            <span className="landing-card-icon">{benefit.icon}</span>
            <h3>{benefit.title}</h3>
            <p>{benefit.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductShowcase() {
  return (
    <section className="landing-section landing-showcase" id="funcionalidades">
      <div className="landing-section-heading">
        <span className="landing-eyebrow">Funcionalidades</span>
        <h2>O dia a dia da consultoria em um só lugar.</h2>
        <p>
          Alunos, treinos, avaliações, financeiro e acompanhamento conectados
          para facilitar sua rotina de atendimento.
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

function BrandStory() {
  return (
    <section className="landing-section landing-brand-story">
      <div className="landing-brand-symbol" aria-hidden="true">
        <BrandLogo variant="icon" size="lg" />
      </div>
      <div className="landing-brand-story-copy">
        <span className="landing-eyebrow">Por trás do nome</span>
        <h2>Aruka. Uma marca inspirada em jornada, movimento e transformação.</h2>
        <p>
          A Aruka nasceu inspirada na riqueza cultural e linguística dos povos
          originários do Brasil, especialmente na sonoridade das línguas da família
          tupi-guarani.
        </p>
        <p>
          O nome é uma criação original e representa os conceitos que orientam
          nossa marca: acompanhar jornadas, simplificar caminhos e impulsionar a
          evolução por meio da tecnologia.
        </p>
        <Link className="landing-story-link" to="/sobre">
          Conheça nossa história
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

function StudentExperience() {
  return (
    <section className="landing-section landing-student">
      <div className="landing-student-copy">
        <span className="landing-eyebrow">Área do aluno</span>
        <h2>Seu aluno acessa o treino com mais clareza.</h2>
        <p>
          A área do aluno permite visualizar o treino ativo, executar sessões,
          consultar histórico e usar o Aruka pelo celular quando o acesso estiver disponível.
        </p>
        <div className="landing-student-tags">
          <span>Treino ativo</span>
          <span>Execução da sessão</span>
          <span>Histórico</span>
          <span>Acesso pelo celular</span>
        </div>
      </div>
      <div className="landing-phone-frame" aria-label="Prévia mobile da área do aluno">
        <div className="landing-phone-top" />
        <div className="landing-phone-card landing-phone-card-strong">
          <span>Treino ativo</span>
          <strong>Força superior</strong>
          <p>5 exercícios cadastrados</p>
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
        <span className="landing-eyebrow">Benefícios</span>
        <h2>Uma operação mais clara sem deixar sua consultoria pesada.</h2>
        <p>
          O Aruka reúne o que sustenta a rotina da consultoria para que cada
          decisão tenha mais contexto e menos retrabalho.
        </p>
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
        <h2>Da primeira organização ao acompanhamento contínuo.</h2>
        <p>
          Um fluxo simples para estruturar a base de alunos, entregar treinos e
          acompanhar a evolução da consultoria no dia a dia.
        </p>
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
        <h2>Escolha o período ideal para sua consultoria.</h2>
        <p>
          Tenha acesso completo ao Aruka durante todo o período contratado, com
          as funcionalidades disponíveis na plataforma.
        </p>
      </div>
      <div className="landing-access-card">
        <div className="landing-access-copy">
          <span>Plano simples</span>
          <h3>Um plano simples. Acesso completo ao Aruka.</h3>
          <p>
            Escolha como prefere começar e mantenha sua operação organizada pelo
            período contratado.
          </p>
        </div>
        <div className="landing-plan-list" aria-label="Períodos de acesso disponíveis">
          {commercialPlans.map((plan) => (
            <div className="landing-plan-option" key={plan.id}>
              <strong>{plan.nome}</strong>
              <span>{planDescriptions[plan.id] || "Período de acesso ao Aruka."}</span>
            </div>
          ))}
        </div>
        <Link className="landing-button landing-button-primary" to="/login">
          Começar agora
        </Link>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="landing-section landing-faq">
      <div className="landing-section-heading">
        <span className="landing-eyebrow">Dúvidas comuns</span>
        <h2>Direto ao ponto.</h2>
        <p>
          Respostas rápidas sobre acesso, uso no celular, treinos, avaliações e planos.
        </p>
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
      <span className="landing-eyebrow">Próximo passo</span>
      <h2>Sua consultoria merece uma operação mais profissional.</h2>
      <p>Comece a organizar alunos, treinos, financeiro e acompanhamento em um só lugar.</p>
      <Link className="landing-button landing-button-primary" to="/login">
        Começar agora
        <ArrowRight size={18} />
      </Link>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <div className="landing-footer-brand">
          <LandingBrand tone="light" />
          <p>Sistema para consultoria fitness online com gestão, treino, acompanhamento e financeiro.</p>
        </div>
        <nav aria-label="Links públicos">
          <a href="#beneficios">Benefícios</a>
          <a href="#funcionalidades">Funcionalidades</a>
          <Link to="/sobre">Sobre</Link>
          <a href="#planos">Planos</a>
          <Link to="/politica-privacidade">Privacidade</Link>
          <Link to="/termos-de-uso">Termos</Link>
        </nav>
        <p className="landing-copyright">Aruka. Tecnologia para quem transforma vidas.</p>
      </div>
    </footer>
  );
}

function ProductFrame() {
  return (
    <div className="landing-product-frame">
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
            <div className="landing-product-feed">
              <strong>Atenção e acompanhamento</strong>
              <ProductRow title="Aluno sem treino ativo" tag="Treinos" />
              <ProductRow title="Sessão concluída recente" tag="Histórico" />
              <ProductRow title="Contrato próximo" tag="Financeiro" />
            </div>
            <div className="landing-product-list">
              <strong>Rotina de hoje</strong>
              <ProductRow title="Revisar ficha de Marina" tag="Ação" />
              <ProductRow title="Registrar avaliação de Rafael" tag="Avaliação" />
              <ProductRow title="Conferir acesso de Camila" tag="Acesso" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductMiniFrame({ variant }) {
  const rows = {
    students: [
      { title: "Marina Costa", tag: "Ativo" },
      { title: "Rafael Lima", tag: "Convite" },
      { title: "Camila Rocha", tag: "Revisar" },
    ],
    workouts: [
      { title: "Ficha superior", tag: "Ativo" },
      { title: "Treino entregue", tag: "Aluno" },
      { title: "Revisão em aberto", tag: "Status" },
    ],
    assessments: [
      { title: "Avaliação registrada", tag: "Hoje" },
      { title: "Histórico corporal", tag: "Aluno" },
      { title: "Observações salvas", tag: "Ficha" },
    ],
    finance: [
      { title: "Parcela próxima", tag: "Vence" },
      { title: "Pagamento confirmado", tag: "Pago" },
      { title: "Renovação planejada", tag: "Plano" },
    ],
    tracking: [
      { title: "Sem treino ativo", tag: "Alerta" },
      { title: "Acesso pendente", tag: "Aluno" },
      { title: "Sessão concluída", tag: "Histórico" },
    ],
  };

  return (
    <div className={`landing-mini-frame landing-mini-${variant}`}>
      <div className="landing-mini-header">
        <span />
        <strong>{miniFrameTitle[variant]}</strong>
      </div>
      <div className="landing-mini-list">
        {rows[variant].map((row) => (
          <ProductRow key={row.title} title={row.title} tag={row.tag} />
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
