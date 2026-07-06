import { lazy, Suspense } from "react";
import Sidebar from "../../../components/Sidebar";
import { useFinanceiroPage } from "../hooks/useFinanceiroPage";
import FinanceiroCards from "./FinanceiroCards";
import FinanceiroFilters from "./FinanceiroFilters";
import FinanceiroHeader from "./FinanceiroHeader";
import FinanceiroMobileCards from "./FinanceiroMobileCards";
import FinanceiroTable from "./FinanceiroTable";

const HistoricoFinanceiroModal = lazy(() => import("./modals/HistoricoFinanceiroModal"));
const PagamentoModal = lazy(() => import("./modals/PagamentoModal"));
const RelatorioAlunoModal = lazy(() => import("./modals/RelatorioAlunoModal"));
const RelatorioGeralModal = lazy(() => import("./modals/RelatorioGeralModal"));
const RenovacaoPlanoModal = lazy(() => import("./modals/RenovacaoPlanoModal"));

function FinanceiroList() {
  const page = useFinanceiroPage();

  return (
    <div className="app-shell" style={{ display: "flex" }}>
      <Sidebar />

      <div className="app-main page-container" style={styles.conteudo}>
        <FinanceiroHeader onRelatorios={page.abrirRelatorioGeral} />

        <FinanceiroCards resumo={page.resumo} styles={styles} />

        <FinanceiroFilters
          busca={page.busca}
          filtroPagamento={page.filtroPagamento}
          filtroStatus={page.filtroStatus}
          onBuscaChange={page.setBusca}
          onFiltroPagamentoChange={page.setFiltroPagamento}
          onFiltroStatusChange={page.setFiltroStatus}
          onLimpar={page.limparFiltros}
          styles={styles}
        />

        {page.erro && <div style={styles.erroBox}>{page.erro}</div>}

        <FinanceiroMobileCards
          atualizandoId={page.atualizandoId}
          carregando={page.carregando}
          onDesfazer={page.desfazerPagamento}
          onHistorico={page.abrirHistorico}
          onReceber={page.abrirRegistroPagamento}
          onRelatorioAluno={page.abrirRelatorioAluno}
          onRenovarPlano={page.abrirRenovacaoPlano}
          onWhatsApp={page.enviarAvisoWhatsApp}
          registros={page.registrosFiltrados}
        />

        <FinanceiroTable
          atualizandoId={page.atualizandoId}
          carregando={page.carregando}
          onDesfazer={page.desfazerPagamento}
          onHistorico={page.abrirHistorico}
          onReceber={page.abrirRegistroPagamento}
          onRelatorioAluno={page.abrirRelatorioAluno}
          onRenovarPlano={page.abrirRenovacaoPlano}
          onWhatsApp={page.enviarAvisoWhatsApp}
          registros={page.registrosFiltrados}
          styles={styles}
        />

        {page.modalPagamento && (
          <Suspense fallback={null}>
            <PagamentoModal
              atualizando={page.atualizandoId === page.modalPagamento.aluno.id}
              form={page.formPagamento}
              onChange={page.setFormPagamento}
              onClose={page.fecharModalPagamento}
              onSave={page.registrarPagamento}
              registro={page.modalPagamento}
              styles={styles}
            />
          </Suspense>
        )}

        {page.modalRenovacao && (
          <Suspense fallback={null}>
            <RenovacaoPlanoModal
              atualizando={page.atualizandoId === page.modalRenovacao.aluno.id}
              dadosCalculados={page.dadosRenovacaoCalculados}
              form={page.formRenovacao}
              onChange={page.setFormRenovacao}
              onClose={page.fecharRenovacaoPlano}
              onSave={page.confirmarRenovacaoPlano}
              planos={page.planosAtivos}
              registro={page.modalRenovacao}
              styles={styles}
            />
          </Suspense>
        )}

        {page.modalHistorico && (
          <Suspense fallback={null}>
            <HistoricoFinanceiroModal
              onClose={page.fecharHistorico}
              onRelatorio={() => page.abrirRelatorioAluno(page.modalHistorico)}
              registro={page.modalHistorico}
              styles={styles}
            />
          </Suspense>
        )}

        {page.modalRelatorioAluno && (
          <Suspense fallback={null}>
            <RelatorioAlunoModal
              onClose={page.fecharRelatorioAluno}
              registro={page.modalRelatorioAluno}
              styles={styles}
            />
          </Suspense>
        )}

        {page.modalRelatorioGeral && (
          <Suspense fallback={null}>
            <RelatorioGeralModal
              onClose={page.fecharRelatorioGeral}
              ranking={page.rankingFinanceiro}
              styles={styles}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const styles = {
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "20px",
    marginTop: "25px",
  },
  conteudo: {
    padding: "24px",
    marginLeft: "260px",
    width: "calc(100% - 260px)",
  },
  card,
  numeroCard: {
    fontSize: "24px",
    fontWeight: "700",
    marginTop: "10px",
  },
  filtrosCard: {
    ...card,
    marginTop: "30px",
  },
  secaoTitulo: {
    margin: 0,
    fontSize: "22px",
  },
  secaoLegenda: {
    color: "#6b7280",
    fontSize: "14px",
    marginTop: "6px",
  },
  filtros: {
    display: "grid",
    gridTemplateColumns:
      "minmax(220px, 1fr) minmax(170px, 220px) minmax(180px, 220px) auto",
    gap: "10px",
    marginTop: "18px",
  },
  campoGrupo: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  labelCampo: {
    color: "#374151",
    fontSize: "13px",
    fontWeight: "700",
  },
  campo: {
    width: "100%",
    minHeight: "42px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "9px 11px",
    background: "white",
    color: "#111827",
    outline: "none",
  },
  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
  },
  linhaCabecalho: {
    background: "#111827",
    color: "#fff",
  },
  header: {
    padding: "12px",
    textAlign: "left",
  },
  celula: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
  },
  estadoVazio: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#6b7280",
    textAlign: "center",
  },
  botaoReceber: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  botaoNeutro: {
    background: "#e5e7eb",
    color: "#111827",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  erroBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#991b1b",
    fontSize: "14px",
    fontWeight: "700",
    marginTop: "16px",
    padding: "12px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "rgba(17, 24, 39, 0.55)",
  },
  modal: {
    maxHeight: "calc(100vh - 48px)",
    overflowY: "auto",
    background: "white",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)",
  },
  modalTopo: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
  },
  modalAcoes: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "flex-end",
  },
  modalTitulo: {
    margin: 0,
    fontSize: "22px",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "12px",
    marginTop: "20px",
  },
  rodapeModal: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "22px",
  },
  filtrosHistorico: {
    display: "grid",
    gridTemplateColumns: "minmax(180px, 240px)",
    marginTop: "18px",
  },
  tabelaModal: {
    marginTop: "18px",
  },
  mobileModalList: {
    marginTop: "18px",
  },
  resumoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginTop: "20px",
  },
  resumoItem: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    display: "grid",
    gap: "6px",
    padding: "14px",
  },
  relatorioBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    marginTop: "18px",
    padding: "16px",
  },
  subtituloModal: {
    margin: 0,
    fontSize: "16px",
  },
  rankingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "12px",
    marginTop: "20px",
  },
  rankingCard: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "14px",
  },
  listaCompacta: {
    display: "grid",
    gap: "8px",
    marginTop: "12px",
  },
  rankingLinha: {
    alignItems: "center",
    display: "flex",
    gap: "10px",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "8px",
  },
};

export default FinanceiroList;
