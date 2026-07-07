import Sidebar from "../../../components/Sidebar";
import { useFinanceiroPage } from "../hooks/useFinanceiroPage";
import FinanceiroCards from "./FinanceiroCards";
import FinanceiroFilters from "./FinanceiroFilters";
import FinanceiroHeader from "./FinanceiroHeader";
import FinanceiroMobileCards from "./FinanceiroMobileCards";
import FinanceiroModals from "./FinanceiroModals";
import FinanceiroTable from "./FinanceiroTable";
import styles from "./financeiroListStyles";

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

        <FinanceiroModals page={page} styles={styles} />
      </div>
    </div>
  );
}

export default FinanceiroList;
