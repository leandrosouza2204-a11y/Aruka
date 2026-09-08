import { Building2, CircleDollarSign, MapPinned, Route, Scale } from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import { SMART_MANAGEMENT_FOUNDATION_AREAS } from "../constants/transferRuleTypes";

function SmartManagementFoundationPage() {
  return (
    <div className="app-shell" style={{ display: "flex" }}>
      <Sidebar />

      <main
        className="app-main page-container smart-management-page"
        data-testid="smart-management-page"
        style={styles.content}
      >
        <header className="smart-management-hero" style={styles.hero}>
          <div style={styles.heroIcon} aria-hidden="true">
            <Scale size={28} />
          </div>
          <div style={styles.heroCopy}>
            <span style={styles.eyebrow}>Cycle 11</span>
            <h1 style={styles.title}>Gestao Inteligente</h1>
            <p style={styles.subtitle}>
              Entenda melhor a rentabilidade do seu trabalho, organize seus locais de
              atendimento e tome decisoes mais inteligentes sobre seus servicos e precos.
            </p>
          </div>
        </header>

        <section
          aria-labelledby="smart-management-foundation-title"
          className="smart-management-section"
          style={styles.section}
        >
          <div style={styles.sectionHeader}>
            <div>
              <h2 id="smart-management-foundation-title" style={styles.sectionTitle}>
                Fundacao do modulo
              </h2>
              <p style={styles.sectionDescription}>
                Cadastre seus locais de atendimento para comecar a entender onde seu
                trabalho gera mais retorno.
              </p>
            </div>
            <span style={styles.foundationBadge}>Uso profissional</span>
          </div>

          <div className="smart-management-grid" style={styles.grid}>
            <FoundationCard
              icon={<MapPinned size={22} />}
              title="Locais de atendimento"
              text="Academias, estudios, atendimento domiciliar ou qualquer lugar onde voce presta servico."
            />
            <FoundationCard
              icon={<CircleDollarSign size={22} />}
              title="Regras de repasse"
              text="Base estruturada para repasse fixo, por aluno, percentual, por faixas ou sem repasse."
            />
            <FoundationCard
              icon={<Route size={22} />}
              title="Rentabilidade futura"
              text="Contrato preparado para calcular bruto, repasse, liquido, retorno por hora e comparacao entre locais."
            />
          </div>

          <div className="smart-management-empty" role="status" style={styles.emptyState}>
            <Building2 size={22} aria-hidden="true" />
            <div>
              <strong>Nenhum fluxo operacional foi antecipado.</strong>
              <p>
                A experiencia completa de cadastro, edicao, arquivamento e configuracao
                de repasses entra na Stage 11.2.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="smart-management-areas-title"
          className="smart-management-section"
          style={styles.section}
        >
          <h2 id="smart-management-areas-title" style={styles.sectionTitle}>
            Areas planejadas
          </h2>
          <div className="smart-management-area-list" style={styles.areaList}>
            {SMART_MANAGEMENT_FOUNDATION_AREAS.map((area) => (
              <span key={area} style={styles.areaPill}>
                {area}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function FoundationCard({ icon, text, title }) {
  return (
    <article className="smart-management-card" style={styles.card}>
      <div style={styles.cardIcon} aria-hidden="true">
        {icon}
      </div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardText}>{text}</p>
    </article>
  );
}

const styles = {
  content: {
    background:
      "radial-gradient(circle at top right, rgba(20, 184, 166, 0.13), transparent 320px), linear-gradient(180deg, rgba(240, 253, 250, 0.78), rgba(248, 250, 252, 1) 320px)",
    marginLeft: "260px",
    minHeight: "100vh",
    padding: "24px",
    width: "calc(100% - 260px)",
  },
  hero: {
    alignItems: "center",
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(15, 118, 110, 0.94))",
    borderRadius: "8px",
    color: "#ffffff",
    display: "grid",
    gap: "18px",
    gridTemplateColumns: "56px minmax(0, 1fr)",
    padding: "24px",
  },
  heroIcon: {
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.12)",
    border: "1px solid rgba(255, 255, 255, 0.16)",
    borderRadius: "8px",
    display: "inline-flex",
    height: "56px",
    justifyContent: "center",
    width: "56px",
  },
  heroCopy: {
    minWidth: 0,
  },
  eyebrow: {
    color: "#99f6e4",
    display: "block",
    fontSize: "12px",
    fontWeight: "850",
    marginBottom: "6px",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "30px",
    lineHeight: 1.12,
    margin: 0,
    overflowWrap: "anywhere",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: "15px",
    lineHeight: 1.45,
    marginTop: "8px",
    maxWidth: "860px",
  },
  section: {
    background: "rgba(255, 255, 255, 0.92)",
    border: "1px solid rgba(226, 232, 240, 0.84)",
    borderRadius: "8px",
    boxShadow: "0 24px 58px rgba(15, 23, 42, 0.08)",
    marginTop: "18px",
    padding: "20px",
  },
  sectionHeader: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  sectionTitle: {
    color: "#111827",
    fontSize: "24px",
    lineHeight: 1.15,
    margin: 0,
  },
  sectionDescription: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.45,
    marginTop: "6px",
  },
  foundationBadge: {
    alignItems: "center",
    background: "#ccfbf1",
    borderRadius: "999px",
    color: "#0f766e",
    display: "inline-flex",
    fontSize: "12px",
    fontWeight: "850",
    minHeight: "34px",
    padding: "8px 11px",
  },
  grid: {
    display: "grid",
    gap: "14px",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
  card: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.99), rgba(248,250,252,0.95))",
    border: "1px solid rgba(203, 213, 225, 0.72)",
    borderRadius: "8px",
    display: "grid",
    gap: "10px",
    minWidth: 0,
    padding: "16px",
  },
  cardIcon: {
    alignItems: "center",
    background: "#f0fdfa",
    border: "1px solid #99f6e4",
    borderRadius: "8px",
    color: "#0f766e",
    display: "inline-flex",
    height: "42px",
    justifyContent: "center",
    width: "42px",
  },
  cardTitle: {
    color: "#111827",
    fontSize: "17px",
    lineHeight: 1.25,
    margin: 0,
  },
  cardText: {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.45,
    margin: 0,
  },
  emptyState: {
    alignItems: "flex-start",
    background: "#f8fafc",
    border: "1px dashed #cbd5e1",
    borderRadius: "8px",
    color: "#475569",
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "28px minmax(0, 1fr)",
    lineHeight: 1.45,
    marginTop: "16px",
    padding: "14px",
  },
  areaList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "14px",
  },
  areaPill: {
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: "999px",
    color: "#3730a3",
    fontSize: "13px",
    fontWeight: "850",
    minHeight: "34px",
    padding: "8px 11px",
  },
};

export default SmartManagementFoundationPage;
