import Sidebar from "../../../components/Sidebar";
import { useDashboardPage } from "../hooks/useDashboardPage";
import DashboardAlertas from "./DashboardAlertas";
import DashboardAtalhos from "./DashboardAtalhos";
import DashboardCards from "./DashboardCards";
import DashboardCheckin from "./DashboardCheckin";
import DashboardHeader from "./DashboardHeader";

function DashboardPage() {
  const dashboard = useDashboardPage();

  return (
    <div className="app-shell" style={{ display: "flex" }}>
      <Sidebar />

      <div className="dashboard-page app-main page-container" style={styles.conteudo}>
        <DashboardHeader styles={styles} />

        {dashboard.erro && <div style={styles.erroBox}>{dashboard.erro}</div>}

        <div className="dashboard-stats-grid" style={styles.cardsGrid}>
          <DashboardCards metricas={dashboard.metricas} styles={styles} />
          <DashboardCheckin
            alunos={dashboard.alunosAtivosCheckin}
            carregando={dashboard.carregando}
            modalAberto={dashboard.modalCheckinAberto}
            onAbrirModal={dashboard.abrirModalCheckin}
            onFecharModal={dashboard.fecharModalCheckin}
            styles={styles}
          />
        </div>

        <DashboardAtalhos
          carregando={dashboard.carregando}
          maiorReceitaMensal={dashboard.maiorReceitaMensal}
          receitaMensal={dashboard.receitaMensal}
          styles={styles}
        />

        <DashboardAlertas
          alertas={dashboard.alertasConsultoria}
          carregando={dashboard.carregando}
          styles={styles}
        />
      </div>
    </div>
  );
}

const conteudo = {
  padding: "24px",
  marginLeft: "260px",
  width: "calc(100% - 260px)",
  background: "#f5f7fb",
  minHeight: "100vh",
};

const dashboardHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: "18px",
  alignItems: "flex-start",
};

const dashboardTitulo = {
  color: "#111827",
  fontSize: "32px",
  lineHeight: 1.15,
  margin: 0,
};

const dashboardSubtitulo = {
  color: "#6b7280",
  fontSize: "15px",
  marginTop: "8px",
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  marginTop: "24px",
};

const card = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
  minHeight: "154px",
  padding: "18px",
};

const checkinCard = {
  display: "flex",
  flexDirection: "column",
  gridColumn: "span 2",
  justifyContent: "space-between",
  minHeight: "154px",
};

const metricHeader = {
  alignItems: "center",
  display: "flex",
  gap: "10px",
};

const metricIcon = {
  alignItems: "center",
  background: "#eff6ff",
  border: "1px solid #dbeafe",
  borderRadius: "8px",
  color: "#2563eb",
  display: "inline-flex",
  height: "34px",
  justifyContent: "center",
  width: "34px",
};

const metricLabel = {
  color: "#6b7280",
  fontSize: "13px",
  fontWeight: "800",
};

const metricHint = {
  color: "#6b7280",
  display: "block",
  fontSize: "13px",
  marginTop: "6px",
};

const botaoPrimario = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "800",
  marginTop: "14px",
  minHeight: "40px",
  padding: "9px 12px",
};

const numero = {
  fontSize: "30px",
  fontWeight: "850",
  letterSpacing: "-0.01em",
  marginTop: "14px",
};

const graficoCard = {
  ...card,
  marginTop: "22px",
  minHeight: "auto",
};

const resumoCard = {
  ...card,
  marginTop: "22px",
  minHeight: "auto",
};

const secaoTopo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const secaoLegenda = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "5px",
};

const secaoTitulo = {
  margin: 0,
  fontSize: "22px",
};

const historicoTag = {
  background: "#eef2ff",
  border: "1px solid #dbeafe",
  borderRadius: "999px",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "800",
  padding: "7px 10px",
};

const grafico = {
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(80px, 1fr))",
  gap: "14px",
  alignItems: "end",
  minHeight: "230px",
  marginTop: "20px",
  overflowX: "auto",
};

const barraItem = {
  display: "grid",
  gridTemplateRows: "auto 180px auto",
  gap: "8px",
  minWidth: "80px",
  textAlign: "center",
};

const barraValor = {
  color: "#374151",
  fontSize: "13px",
  fontWeight: "bold",
};

const barraTrilho = {
  display: "flex",
  alignItems: "end",
  background: "#eef2ff",
  borderRadius: "8px",
  overflow: "hidden",
};

const barra = {
  width: "100%",
  background: "linear-gradient(180deg, #60a5fa, #2563eb)",
  borderRadius: "8px 8px 0 0",
};

const barraLabel = {
  color: "#4b5563",
  fontSize: "13px",
  textTransform: "capitalize",
};

const graficoMobile = {
  display: "none",
  gap: "12px",
  marginTop: "18px",
};

const linhaMobile = {
  display: "grid",
  gap: "8px",
};

const linhaMobileTopo = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center",
};

const trilhoMobile = {
  background: "#eef2ff",
  borderRadius: "999px",
  height: "12px",
  overflow: "hidden",
};

const barraMobile = {
  background: "linear-gradient(90deg, #60a5fa, #2563eb)",
  borderRadius: "999px",
  height: "100%",
};

const estadoVazio = {
  color: "#6b7280",
  marginTop: "18px",
};

const alertasGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
  marginTop: "18px",
};

const alertaItem = {
  alignItems: "flex-start",
  background: "#f9fafb",
  border: "1px solid #eef2f7",
  borderRadius: "8px",
  display: "grid",
  gap: "12px",
  padding: "14px",
};

const alertaTitulo = {
  color: "#111827",
  display: "block",
  fontSize: "14px",
};

const alertaTexto = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: 1.45,
  marginTop: "5px",
};

const estadoVazioPremium = {
  alignItems: "center",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "8px",
  color: "#166534",
  display: "flex",
  gap: "10px",
  fontSize: "14px",
  fontWeight: "800",
  marginTop: "18px",
  padding: "14px",
};

const erroBox = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: "700",
  marginTop: "16px",
  padding: "12px",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  zIndex: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  background: "rgba(15, 23, 42, 0.58)",
};

const modal = {
  width: "min(640px, 100%)",
  maxHeight: "calc(100vh - 48px)",
  overflowY: "auto",
  background: "white",
  borderRadius: "8px",
  padding: "24px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.3)",
};

const modalTopo = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "flex-start",
};

const modalTitulo = {
  color: "#111827",
  fontSize: "22px",
  margin: 0,
};

const modalLegenda = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "6px",
};

const listaCheckin = {
  display: "grid",
  gap: "10px",
  marginTop: "18px",
};

const itemCheckin = {
  alignItems: "center",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  justifyContent: "space-between",
  padding: "12px",
};

const nomeCheckin = {
  color: "#111827",
  display: "block",
};

const whatsappCheckin = {
  color: "#6b7280",
  display: "block",
  fontSize: "13px",
  marginTop: "4px",
};

const botaoSecundario = {
  background: "#e5e7eb",
  color: "#111827",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  padding: "10px 14px",
};

const botaoWhatsApp = {
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "800",
  minHeight: "38px",
  padding: "8px 12px",
};

const botaoDesabilitado = {
  background: "#e5e7eb",
  color: "#9ca3af",
  border: "none",
  borderRadius: "8px",
  cursor: "not-allowed",
  fontWeight: "800",
  minHeight: "38px",
  padding: "8px 12px",
};

const styles = {
  alertaItem,
  alertaTexto,
  alertaTitulo,
  alertasGrid,
  barra,
  barraItem,
  barraLabel,
  barraMobile,
  barraTrilho,
  barraValor,
  botaoDesabilitado,
  botaoPrimario,
  botaoSecundario,
  botaoWhatsApp,
  card,
  cardsGrid,
  checkinCard,
  conteudo,
  dashboardHeader,
  dashboardSubtitulo,
  dashboardTitulo,
  erroBox,
  estadoVazio,
  estadoVazioPremium,
  grafico,
  graficoCard,
  graficoMobile,
  historicoTag,
  itemCheckin,
  linhaMobile,
  linhaMobileTopo,
  listaCheckin,
  metricHeader,
  metricHint,
  metricIcon,
  metricLabel,
  modal,
  modalLegenda,
  modalOverlay,
  modalTitulo,
  modalTopo,
  nomeCheckin,
  numero,
  resumoCard,
  secaoLegenda,
  secaoTitulo,
  secaoTopo,
  trilhoMobile,
  whatsappCheckin,
};

export default DashboardPage;
