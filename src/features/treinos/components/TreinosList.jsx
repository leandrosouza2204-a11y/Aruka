import { lazy, Suspense } from "react";
import { Dumbbell } from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import { useTreinosPage } from "../hooks/useTreinosPage";
import TreinosCards from "./TreinosCards";
import TreinoDetalhesModal from "./TreinoDetalhesModal";
import TreinosFilters from "./TreinosFilters";
import TreinosHeader from "./TreinosHeader";

const TreinoModal = lazy(() => import("../../../components/TreinoModal"));

function TreinosList() {
  const treinosPage = useTreinosPage();
  const treinoSelecionadoId = treinosPage.treinoSelecionado?.id || "";
  const alternarTreino = (id) => {
    if (treinoSelecionadoId === id) {
      treinosPage.fecharDetalhes();
      return;
    }

    treinosPage.visualizarTreino(id);
  };
  const focarModelos = () => {
    document.getElementById("treinos-modelos-rapidos")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="app-shell" style={{ display: "flex" }}>
      <Sidebar />

      <div className="treinos-page app-main page-container" style={styles.conteudo}>
        <TreinosHeader
          quantidadeFiltrada={treinosPage.treinosFiltrados.length}
          quantidadeTotal={treinosPage.treinos.length}
          onNovoTreino={treinosPage.abrirNovoTreino}
          onGerarModelo={treinosPage.gerarTreinoBase}
          styles={styles}
        />

        {treinosPage.erro && <div style={styles.erroBox}>{treinosPage.erro}</div>}

        <section className="treinos-library-section" style={styles.librarySection}>
          <div className="app-card-header" style={styles.libraryHeader}>
            <div>
              <span style={styles.libraryEyebrow}>Biblioteca</span>
              <h2 style={styles.libraryTitle}>Biblioteca de treinos</h2>
              <p style={styles.librarySubtitle}>
                Gerencie as rotinas criadas para seus alunos.
              </p>
            </div>
            <span style={styles.libraryCounter}>
              {treinosPage.treinosFiltrados.length} rotinas
            </span>
          </div>

          <div style={styles.filterCard}>
            <TreinosFilters
              busca={treinosPage.busca}
              filtroAluno={treinosPage.filtroAluno}
              filtroObjetivo={treinosPage.filtroObjetivo}
              filtroNivel={treinosPage.filtroNivel}
              filtroStatus={treinosPage.filtroStatus}
              opcoesFiltro={treinosPage.opcoesFiltro}
              onBuscaChange={treinosPage.setBusca}
              onFiltroAlunoChange={treinosPage.setFiltroAluno}
              onFiltroObjetivoChange={treinosPage.setFiltroObjetivo}
              onFiltroNivelChange={treinosPage.setFiltroNivel}
              onFiltroStatusChange={treinosPage.setFiltroStatus}
              onLimparFiltros={treinosPage.limparFiltros}
              styles={styles}
            />
          </div>

          <TreinosCards
            carregando={treinosPage.carregando}
            selectedId={treinoSelecionadoId}
            treinos={treinosPage.treinosFiltrados}
            onVisualizar={alternarTreino}
            onEditar={treinosPage.abrirEdicao}
            onDuplicar={treinosPage.duplicarTreino}
            onExcluir={treinosPage.removerTreino}
            onNovoTreino={treinosPage.abrirNovoTreino}
            onUsarModelo={focarModelos}
            styles={styles}
          />
        </section>

        <div className="treinos-detail-panel">
          <TreinoDetalhesModal
            treino={treinosPage.treinoSelecionado}
            onEnviarWhatsApp={treinosPage.copiarTreinoWhatsApp}
            onFechar={treinosPage.fecharDetalhes}
            styles={styles}
          />
        </div>

        {!treinosPage.treinoSelecionado && !treinosPage.carregando && (
          <section className="treinos-empty-card app-card" style={styles.semTreinoCard}>
            <div style={styles.semTreinoIcone}>
              <Dumbbell size={22} />
            </div>
            <div>
              <h2 style={styles.semTreinoTitulo}>Nenhum treino selecionado.</h2>
              <p className="app-muted" style={styles.semTreinoTexto}>
                Selecione uma rotina na biblioteca ou crie um novo treino para visualizar os detalhes.
              </p>
              <div style={styles.semTreinoAcoes}>
                <button className="app-button app-button-primary" onClick={treinosPage.abrirNovoTreino} style={styles.botaoPrimario}>
                  Novo treino
                </button>
                <button className="app-button app-button-secondary" onClick={focarModelos} style={styles.botaoSecundario}>
                  Usar modelo rápido
                </button>
              </div>
            </div>
          </section>
        )}

        {treinosPage.modalAberto && (
          <Suspense fallback={null}>
            <TreinoModal
              alunos={treinosPage.alunos}
              treino={treinosPage.treinoEditando || treinosPage.treinoBase}
              onClose={treinosPage.fecharModal}
              onSave={treinosPage.salvarTreino}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}

const conteudo = {
  padding: "24px",
  marginLeft: "260px",
  width: "calc(100% - 260px)",
  background:
    "radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 320px), linear-gradient(180deg, rgba(239, 246, 255, 0.84), rgba(245, 247, 251, 1) 300px)",
  minHeight: "100vh",
};

const listaCard = {
  background: "rgba(255, 255, 255, 0.86)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255, 255, 255, 0.72)",
  borderRadius: "8px",
  boxShadow: "0 22px 52px rgba(15, 23, 42, 0.08)",
  padding: "22px",
};

const listaTopo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "end",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const modelosRapidos = {
  alignItems: "center",
  background:
    "linear-gradient(135deg, rgba(248, 250, 252, 0.96), rgba(219, 234, 254, 0.58))",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.75)",
  borderRadius: "8px",
  display: "flex",
  gap: "16px",
  justifyContent: "space-between",
  marginBottom: "16px",
  padding: "14px",
};

const modelosTitulo = {
  color: "#111827",
  display: "block",
  fontSize: "13px",
  fontWeight: "850",
};

const modelosLegenda = {
  color: "#6b7280",
  fontSize: "12px",
  marginTop: "3px",
};

const modelosLinha = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const librarySection = {
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.76)",
  borderRadius: "8px",
  boxShadow: "0 24px 58px rgba(15, 23, 42, 0.09)",
  marginTop: "18px",
  padding: "22px",
};

const libraryHeader = {
  alignItems: "flex-start",
  display: "flex",
  gap: "16px",
  justifyContent: "space-between",
  marginBottom: "16px",
};

const libraryEyebrow = {
  color: "#2563eb",
  display: "block",
  fontSize: "12px",
  fontWeight: "850",
  marginBottom: "6px",
  textTransform: "uppercase",
};

const libraryTitle = {
  color: "#111827",
  fontSize: "24px",
  lineHeight: 1.15,
  margin: 0,
};

const librarySubtitle = {
  color: "#64748b",
  fontSize: "14px",
  marginTop: "7px",
};

const libraryCounter = {
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "999px",
  color: "#1d4ed8",
  flex: "0 0 auto",
  fontSize: "12px",
  fontWeight: "850",
  padding: "8px 11px",
};

const filterCard = {
  background: "linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(255, 255, 255, 0.94))",
  border: "1px solid rgba(226, 232, 240, 0.7)",
  borderRadius: "8px",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.045)",
  marginBottom: "18px",
  padding: "14px",
};

const libraryGrid = {
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
};

const libraryLoading = {
  background: "rgba(248, 250, 252, 0.9)",
  border: "1px solid rgba(226, 232, 240, 0.7)",
  borderRadius: "8px",
  padding: "28px",
};

const treinoCard = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))",
  border: "1px solid rgba(226, 232, 240, 0.7)",
  borderRadius: "8px",
  boxShadow: "0 18px 42px rgba(15, 23, 42, 0.075)",
  display: "grid",
  gap: "14px",
  minWidth: 0,
  padding: "16px",
  transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
};

const treinoCardSelecionado = {
  borderColor: "rgba(37, 99, 235, 0.55)",
  boxShadow: "0 24px 56px rgba(37, 99, 235, 0.16)",
};

const treinoCardTop = {
  alignItems: "center",
  display: "flex",
  gap: "12px",
  justifyContent: "space-between",
};

const treinoCardIcon = {
  alignItems: "center",
  background: "#eff6ff",
  borderRadius: "8px",
  color: "#2563eb",
  display: "inline-flex",
  height: "38px",
  justifyContent: "center",
  width: "38px",
};

const treinoCardTitulo = {
  color: "#0f172a",
  fontSize: "18px",
  lineHeight: 1.25,
  margin: 0,
};

const treinoCardAluno = {
  color: "#64748b",
  fontSize: "14px",
  marginTop: "5px",
};

const treinoBadges = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const treinoMetaGrid = {
  display: "grid",
  gap: "10px",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
};

const treinoMetaItem = {
  alignItems: "center",
  background: "rgba(239, 246, 255, 0.62)",
  border: "1px solid rgba(191, 219, 254, 0.42)",
  borderRadius: "8px",
  display: "flex",
  gap: "9px",
  minHeight: "62px",
  minWidth: 0,
  padding: "10px",
};

const treinoMetaIcon = {
  color: "#2563eb",
  display: "inline-flex",
  flex: "0 0 auto",
};

const treinoMetaLabel = {
  color: "#64748b",
  display: "block",
  fontSize: "11px",
  fontWeight: "850",
  marginBottom: "3px",
  textTransform: "uppercase",
};

const treinoMetaValor = {
  color: "#111827",
  display: "block",
  fontSize: "13px",
  lineHeight: 1.25,
};

const treinoCardActions = {
  alignItems: "center",
  borderTop: "1px solid rgba(226, 232, 240, 0.72)",
  display: "flex",
  gap: "8px",
  justifyContent: "space-between",
  paddingTop: "14px",
};

const treinoVisualizar = {
  alignItems: "center",
  display: "inline-flex",
  gap: "7px",
  justifyContent: "center",
};

const filtros = {
  display: "grid",
  gridTemplateColumns:
    "minmax(220px, 1fr) repeat(4, minmax(150px, 190px)) auto",
  gap: "10px",
  alignItems: "center",
};

const resumoLista = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "6px",
};

const campo = {
  width: "100%",
  minHeight: "42px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "9px 11px",
  background: "white",
  color: "#111827",
  outline: "none",
};

const erroBox = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#991b1b",
  marginTop: "16px",
  padding: "12px",
};

const tabela = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  borderRadius: "8px",
  overflow: "hidden",
};

const linhaCabecalho = {
  background: "#111827",
  color: "white",
};

const tabelaHeader = {
  padding: "12px",
  textAlign: "left",
  fontSize: "13px",
};

const tabelaCelula = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
};

const estadoVazio = {
  ...tabelaCelula,
  color: "#6b7280",
  textAlign: "center",
};

const detalhesAcoes = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const botaoPrimario = {
  background: "#111827",
  color: "white",
  border: "none",
  padding: "11px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
};

const botaoSecundario = {
  background: "#e5e7eb",
  color: "#111827",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const botaoPill = {
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(191, 219, 254, 0.9)",
  borderRadius: "999px",
  color: "#1d4ed8",
  cursor: "pointer",
  display: "inline-flex",
  fontSize: "12px",
  gap: "6px",
  fontWeight: "850",
  minHeight: "34px",
  padding: "8px 12px",
};

const detalhesCard = {
  marginTop: "24px",
  background: "rgba(255, 255, 255, 0.88)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.72)",
  borderRadius: "8px",
  boxShadow: "0 28px 70px rgba(15, 23, 42, 0.13)",
  overflow: "hidden",
  padding: "0",
};

const detalhesHero = {
  background:
    "linear-gradient(135deg, rgba(15, 23, 42, 0.99), rgba(29, 78, 216, 0.94))",
  boxShadow: "0 18px 42px rgba(30, 64, 175, 0.22)",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "18px",
  padding: "28px",
  position: "relative",
  flexWrap: "wrap",
};

const detalhesTitulo = {
  margin: 0,
  fontSize: "28px",
  lineHeight: 1.15,
};

const detalhesEyebrow = {
  color: "#bfdbfe",
  display: "block",
  fontSize: "12px",
  fontWeight: "850",
  letterSpacing: "0.04em",
  marginBottom: "8px",
  textTransform: "uppercase",
};

const detalhesSubtitulo = {
  color: "rgba(255, 255, 255, 0.76)",
  fontSize: "15px",
  marginTop: "8px",
};

const heroBadges = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "14px",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: "12px",
  background:
    "linear-gradient(180deg, rgba(248, 250, 252, 0.72), rgba(255, 255, 255, 0.88))",
  padding: "20px",
};

const infoItem = {
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.78)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(226, 232, 240, 0.48)",
  borderRadius: "8px",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.055)",
  display: "flex",
  gap: "10px",
  minHeight: "74px",
  padding: "12px",
  transition: "transform 0.18s ease, box-shadow 0.18s ease",
};

const infoItemDestaque = {
  gridColumn: "span 2",
  alignItems: "flex-start",
};

const infoIcon = {
  alignItems: "center",
  background: "#eff6ff",
  borderRadius: "8px",
  color: "#2563eb",
  display: "inline-flex",
  flex: "0 0 auto",
  height: "34px",
  justifyContent: "center",
  width: "34px",
};

const infoLabel = {
  display: "block",
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "700",
  marginBottom: "4px",
  textTransform: "uppercase",
};

const infoValor = {
  color: "#111827",
  fontSize: "14px",
};

const botaoWhatsApp = {
  alignItems: "center",
  background: "#16a34a",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  display: "inline-flex",
  gap: "8px",
  fontWeight: "850",
  minHeight: "38px",
  padding: "9px 13px",
};

const botaoFechar = {
  alignItems: "center",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  display: "inline-flex",
  gap: "7px",
  fontWeight: "800",
  minHeight: "38px",
  padding: "9px 12px",
};

const diasBloco = {
  background:
    "linear-gradient(180deg, rgba(241, 245, 249, 0.78), rgba(248, 250, 252, 0.96))",
  borderTop: "1px solid rgba(226, 232, 240, 0.42)",
  padding: "20px",
};

const diasHeader = {
  alignItems: "flex-start",
  display: "flex",
  gap: "14px",
  justifyContent: "space-between",
  marginBottom: "14px",
};

const diasTitulo = {
  color: "#111827",
  fontSize: "20px",
  margin: 0,
};

const diasLegenda = {
  color: "#6b7280",
  fontSize: "13px",
  marginTop: "5px",
};

const diasContador = {
  background: "#dbeafe",
  borderRadius: "999px",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "850",
  padding: "7px 10px",
};

const diasDetalhes = {
  display: "grid",
  gap: "12px",
};

const diaDetalhe = {
  background: "rgba(255, 255, 255, 0.82)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(226, 232, 240, 0.42)",
  borderRadius: "8px",
  boxShadow: "0 14px 32px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

const diaResumo = {
  alignItems: "center",
  cursor: "pointer",
  display: "flex",
  gap: "12px",
  justifyContent: "space-between",
  listStyle: "none",
  padding: "16px",
};

const diaTitulo = {
  color: "#111827",
  margin: 0,
  fontSize: "16px",
};

const diaDescricao = {
  color: "#6b7280",
  fontSize: "13px",
  marginTop: "4px",
};

const diaBadge = {
  alignItems: "center",
  background: "#eef2ff",
  borderRadius: "999px",
  color: "#1d4ed8",
  display: "inline-flex",
  fontSize: "12px",
  fontWeight: "850",
  height: "30px",
  justifyContent: "center",
  minWidth: "30px",
  padding: "0 9px",
};

const exerciciosGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "12px",
  background: "rgba(248, 250, 252, 0.72)",
  padding: "0 16px 16px",
};

const estadoDiaVazio = {
  background: "#f8fafc",
  borderRadius: "8px",
  color: "#6b7280",
  fontSize: "13px",
  fontWeight: "700",
  padding: "14px",
};

const estadoTreinoVazio = {
  background: "white",
  borderRadius: "8px",
  color: "#6b7280",
  fontWeight: "750",
  padding: "18px",
  textAlign: "center",
};

const semTreinoCard = {
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.78)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.72)",
  borderRadius: "8px",
  boxShadow: "0 18px 44px rgba(15, 23, 42, 0.075)",
  display: "flex",
  gap: "14px",
  marginTop: "24px",
  padding: "20px",
};

const semTreinoIcone = {
  alignItems: "center",
  background: "#eff6ff",
  borderRadius: "8px",
  color: "#2563eb",
  display: "inline-flex",
  flex: "0 0 auto",
  height: "46px",
  justifyContent: "center",
  width: "46px",
};

const semTreinoTitulo = {
  color: "#111827",
  fontSize: "18px",
  margin: 0,
};

const semTreinoTexto = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "5px",
};

const semTreinoAcoes = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "12px",
};

const styles = {
  botaoFechar,
  botaoPill,
  botaoPrimario,
  botaoSecundario,
  botaoWhatsApp,
  campo,
  conteudo,
  detalhesAcoes,
  detalhesCard,
  detalhesEyebrow,
  detalhesHero,
  detalhesSubtitulo,
  detalhesTitulo,
  diaBadge,
  diaDescricao,
  diaDetalhe,
  diaResumo,
  diaTitulo,
  diasBloco,
  diasContador,
  diasDetalhes,
  diasHeader,
  diasLegenda,
  diasTitulo,
  erroBox,
  estadoDiaVazio,
  estadoTreinoVazio,
  estadoVazio,
  exerciciosGrid,
  filtros,
  heroBadges,
  infoGrid,
  infoIcon,
  infoItem,
  infoItemDestaque,
  infoLabel,
  infoValor,
  filterCard,
  linhaCabecalho,
  listaCard,
  listaTopo,
  libraryCounter,
  libraryEyebrow,
  libraryGrid,
  libraryHeader,
  libraryLoading,
  librarySection,
  librarySubtitle,
  libraryTitle,
  modelosLegenda,
  modelosLinha,
  modelosRapidos,
  modelosTitulo,
  resumoLista,
  semTreinoCard,
  semTreinoAcoes,
  semTreinoIcone,
  semTreinoTexto,
  semTreinoTitulo,
  tabela,
  tabelaCelula,
  tabelaHeader,
  treinoBadges,
  treinoCard,
  treinoCardActions,
  treinoCardAluno,
  treinoCardIcon,
  treinoCardSelecionado,
  treinoCardTitulo,
  treinoCardTop,
  treinoMetaGrid,
  treinoMetaIcon,
  treinoMetaItem,
  treinoMetaLabel,
  treinoMetaValor,
  treinoVisualizar,
};

export default TreinosList;
