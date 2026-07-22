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

      <div className="financeiro-page app-main page-container" data-testid="financeiro-page" style={styles.conteudo}>
        <FinanceiroHeader onRelatorios={page.abrirRelatorioGeral} />

        {page.alunoContextual && (
          <section className="app-alert" data-testid="financeiro-context-aluno" style={styles.contextoAluno}>
            Financeiro contextualizado para {page.alunoContextual.nome}.
          </section>
        )}

        <FinanceiroCards resumo={page.resumo} styles={styles} />

        <FinanceiroFilters
          busca={page.busca}
          contadoresAcompanhamento={page.contadoresAcompanhamento}
          filtroPagamento={page.filtroPagamento}
          filtroStatus={page.filtroStatus}
          onAcompanhamentoViewChange={page.setVisaoAcompanhamento}
          onBuscaChange={page.setBusca}
          onFiltroPagamentoChange={page.setFiltroPagamento}
          onFiltroStatusChange={page.setFiltroStatus}
          onLimpar={page.limparFiltros}
          styles={styles}
          visaoAcompanhamento={page.visaoAcompanhamento}
        />

        {page.erro && <div style={styles.erroBox}>{page.erro}</div>}

        {page.visaoAcompanhamento === "encerrados" && (
          <section className="app-alert app-section" style={styles.encerradosAviso}>
            Alunos encerrados continuam disponíveis para consulta e podem ser reativados ou renovados a qualquer momento. Nenhum histórico é removido.
          </section>
        )}

        <FinanceiroMobileCards
          atualizandoId={page.atualizandoId}
          carregando={page.carregando}
          onDesfazer={page.desfazerPagamento}
          onHistorico={page.abrirHistorico}
          onMarcarNaoRenovado={page.marcarComoNaoRenovado}
          onReceber={page.abrirRegistroPagamento}
          onReativar={page.reativarAluno}
          onRelatorioAluno={page.abrirRelatorioAluno}
          onRenovarPlano={page.abrirRenovacaoPlano}
          onWhatsApp={page.enviarAvisoWhatsApp}
          registros={page.registrosFiltrados}
          visaoAcompanhamento={page.visaoAcompanhamento}
        />

        <FinanceiroTable
          atualizandoId={page.atualizandoId}
          carregando={page.carregando}
          onDesfazer={page.desfazerPagamento}
          onHistorico={page.abrirHistorico}
          onMarcarNaoRenovado={page.marcarComoNaoRenovado}
          onReceber={page.abrirRegistroPagamento}
          onReativar={page.reativarAluno}
          onRelatorioAluno={page.abrirRelatorioAluno}
          onRenovarPlano={page.abrirRenovacaoPlano}
          onWhatsApp={page.enviarAvisoWhatsApp}
          registros={page.registrosFiltrados}
          styles={styles}
          visaoAcompanhamento={page.visaoAcompanhamento}
        />

        <FinanceiroModals page={page} styles={styles} />
      </div>
    </div>
  );
}

export default FinanceiroList;
