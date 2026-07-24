import { lazy, Suspense } from "react";
import Sidebar from "../../../components/Sidebar";
import InlineDetails from "../../../components/InlineDetails";
import { useAvaliacoesPage } from "../hooks/useAvaliacoesPage";
import AnamneseCardMobile from "./AnamneseCardMobile";
import AnamnesesTable from "./AnamnesesTable";
import AvaliacaoCardMobile from "./AvaliacaoCardMobile";
import AvaliacaoDetalhesModal from "./AvaliacaoDetalhesModal";
import AvaliacoesFilters from "./AvaliacoesFilters";
import AvaliacoesHeader from "./AvaliacoesHeader";
import AvaliacoesTable from "./AvaliacoesTable";

const AnamneseModal = lazy(() => import("../../../components/AnamneseModal"));
const AvaliacaoModal = lazy(() => import("../../../components/AvaliacaoModal"));

function AvaliacoesList() {
  const avaliacoesPage = useAvaliacoesPage();
  const alternarPerfilAluno = (alunoId) => {
    if (avaliacoesPage.alunoSelecionadoId === alunoId) {
      avaliacoesPage.fecharPerfilAluno();
      return;
    }

    avaliacoesPage.selecionarPerfilAluno(alunoId);
  };

  return (
    <div className="app-shell" style={{ display: "flex" }}>
      <Sidebar />

      <div className="avaliacoes-page app-main page-container" data-testid="avaliacoes-page" style={styles.conteudo}>
        <AvaliacoesHeader
          abaAtiva={avaliacoesPage.abaAtiva}
          quantidadeAnamneses={avaliacoesPage.anamnesesFiltradas.length}
          quantidadeAvaliacoes={avaliacoesPage.avaliacoesFiltradas.length}
          quantidadeExibida={
            avaliacoesPage.abaAtiva === "anamneses"
              ? avaliacoesPage.anamnesesFiltradas.length
              : avaliacoesPage.avaliacoesFiltradas.length
          }
          onAbaChange={avaliacoesPage.setAbaAtiva}
          onNovaAvaliacao={avaliacoesPage.abrirNovaAvaliacao}
          onNovaAnamnese={avaliacoesPage.abrirNovaAnamnese}
          styles={styles}
        >
          <AvaliacoesFilters
            alunos={avaliacoesPage.alunos}
            busca={avaliacoesPage.busca}
            filtroAluno={avaliacoesPage.filtroAluno}
            onBuscaChange={avaliacoesPage.setBusca}
            onFiltroAlunoChange={avaliacoesPage.setFiltroAluno}
            styles={styles}
          />
        </AvaliacoesHeader>

        {avaliacoesPage.erro && (
          <div className="app-error">{avaliacoesPage.erro}</div>
        )}

        {avaliacoesPage.alunoContextual && (
          <section
            className="app-alert"
            data-testid="avaliacoes-context-aluno"
            style={styles.contextoAluno}
            aria-labelledby="avaliacoes-context-title"
          >
            <div style={styles.contextoAlunoTexto}>
              <strong id="avaliacoes-context-title" style={styles.contextoAlunoTitulo}>
                Voce esta visualizando as avaliacoes de{" "}
                <span data-testid="avaliacoes-context-student-name">
                  {avaliacoesPage.alunoContextual.nome}
                </span>
                .
              </strong>
              <span style={styles.contextoAlunoDescricao}>
                O modulo esta filtrado para este aluno. Crie novos registros ou volte para a origem.
              </span>
            </div>
            <div style={styles.contextoAlunoAcoes}>
              <button
                type="button"
                className="app-button app-button-primary"
                data-testid="avaliacoes-context-new-assessment"
                onClick={avaliacoesPage.abrirNovaAvaliacao}
                style={styles.botaoPrimario}
              >
                Nova avaliacao
              </button>
              <button
                type="button"
                className="app-button app-button-secondary"
                data-testid="avaliacoes-context-new-anamnese"
                onClick={avaliacoesPage.abrirNovaAnamnese}
                style={styles.botaoSecundario}
              >
                Nova anamnese
              </button>
              {avaliacoesPage.returnToSeguro && (
                <button
                  type="button"
                  className="app-button app-button-secondary"
                  data-testid="avaliacoes-context-return"
                  onClick={avaliacoesPage.voltarParaOrigem}
                  style={styles.botaoSecundario}
                >
                  Voltar para o aluno
                </button>
              )}
              <button
                type="button"
                className="app-button app-button-secondary"
                data-testid="avaliacoes-context-clear"
                onClick={avaliacoesPage.limparContextoAluno}
                style={styles.botaoSecundario}
              >
                Mostrar todos
              </button>
            </div>
          </section>
        )}

        {avaliacoesPage.abaAtiva === "avaliacoes" ? (
          <AvaliacoesTable
            avaliacoes={avaliacoesPage.avaliacoesFiltradas}
            carregando={avaliacoesPage.carregando}
            onPerfil={alternarPerfilAluno}
            onEditar={avaliacoesPage.abrirEdicaoAvaliacao}
            onAnamnese={avaliacoesPage.editarAnamneseAluno}
            onExcluir={avaliacoesPage.removerAvaliacao}
            onNovaAvaliacao={avaliacoesPage.abrirNovaAvaliacao}
            onNovaAnamnese={avaliacoesPage.abrirNovaAnamnese}
            emptyState={avaliacoesPage.emptyState}
            contextualStudent={avaliacoesPage.alunoContextual}
            searchTerm={avaliacoesPage.busca}
            returnToSeguro={avaliacoesPage.returnToSeguro}
            onClearContext={avaliacoesPage.limparContextoAluno}
            onClearSearch={avaliacoesPage.limparBusca}
            onClearFilters={avaliacoesPage.limparFiltros}
            onReturn={avaliacoesPage.voltarParaOrigem}
            styles={styles}
          />
        ) : (
          <AnamnesesTable
            anamneses={avaliacoesPage.anamnesesFiltradas}
            carregando={avaliacoesPage.carregando}
            onEditar={avaliacoesPage.abrirEdicaoAnamnese}
            onPerfil={alternarPerfilAluno}
            onRelatorio={avaliacoesPage.abrirRelatorioAnamnese}
            onNovaAvaliacao={avaliacoesPage.abrirNovaAvaliacao}
            onNovaAnamnese={avaliacoesPage.abrirNovaAnamnese}
            emptyState={avaliacoesPage.emptyState}
            contextualStudent={avaliacoesPage.alunoContextual}
            searchTerm={avaliacoesPage.busca}
            returnToSeguro={avaliacoesPage.returnToSeguro}
            onClearContext={avaliacoesPage.limparContextoAluno}
            onClearSearch={avaliacoesPage.limparBusca}
            onClearFilters={avaliacoesPage.limparFiltros}
            onReturn={avaliacoesPage.voltarParaOrigem}
            styles={styles}
          />
        )}

        {!avaliacoesPage.carregando &&
          avaliacoesPage.abaAtiva === "avaliacoes" &&
          avaliacoesPage.avaliacoesFiltradas.length > 0 && (
            <div className="mobile-card-list avaliacoes-mobile-cards">
              {avaliacoesPage.avaliacoesFiltradas.map((avaliacao) => (
                <AvaliacaoCardMobile
                  key={avaliacao.id}
                  avaliacao={avaliacao}
                  isExpanded={avaliacoesPage.alunoSelecionadoId === avaliacao.alunoId}
                  onPerfil={alternarPerfilAluno}
                  onEditar={avaliacoesPage.abrirEdicaoAvaliacao}
                  onAnamnese={avaliacoesPage.editarAnamneseAluno}
                  onExcluir={avaliacoesPage.removerAvaliacao}
                >
                  <InlineDetails
                    className="mobile-inline-details"
                    itemId={avaliacao.alunoId}
                    selectedItemId={avaliacoesPage.alunoSelecionadoId}
                  >
                    <AvaliacaoDetalhesModal
                      alertas={avaliacoesPage.alertas}
                      alunoCadastro={avaliacoesPage.alunoCadastro}
                      alunoSelecionado={avaliacoesPage.alunoSelecionado}
                      anamneseAluno={avaliacoesPage.anamneseAluno}
                      avaliacaoAnterior={avaliacoesPage.avaliacaoAnterior}
                      historicoAluno={avaliacoesPage.historicoAluno}
                      primeiraAvaliacao={avaliacoesPage.primeiraAvaliacao}
                      relatorioAtivo={avaliacoesPage.relatorioAtivo}
                      ultimaAvaliacao={avaliacoesPage.ultimaAvaliacao}
                      onAlternarRelatorioAnamnese={avaliacoesPage.alternarRelatorioAnamnese}
                      onAlternarRelatorio={avaliacoesPage.alternarRelatorio}
                      onCopiarResumo={avaliacoesPage.copiarResumoWhatsApp}
                      onFechar={avaliacoesPage.fecharPerfilAluno}
                      onFecharRelatorio={avaliacoesPage.fecharRelatorio}
                      styles={styles}
                    />
                  </InlineDetails>
                </AvaliacaoCardMobile>
              ))}
            </div>
          )}

        {!avaliacoesPage.carregando &&
          avaliacoesPage.abaAtiva === "anamneses" &&
          avaliacoesPage.anamnesesFiltradas.length > 0 && (
            <div className="mobile-card-list avaliacoes-mobile-cards">
              {avaliacoesPage.anamnesesFiltradas.map((anamnese) => (
                <AnamneseCardMobile
                  key={anamnese.id}
                  anamnese={anamnese}
                  isExpanded={avaliacoesPage.alunoSelecionadoId === anamnese.alunoId}
                  onEditar={avaliacoesPage.abrirEdicaoAnamnese}
                  onPerfil={alternarPerfilAluno}
                  onRelatorio={avaliacoesPage.abrirRelatorioAnamnese}
                >
                  <InlineDetails
                    className="mobile-inline-details"
                    itemId={anamnese.alunoId}
                    selectedItemId={avaliacoesPage.alunoSelecionadoId}
                  >
                    <AvaliacaoDetalhesModal
                      alertas={avaliacoesPage.alertas}
                      alunoCadastro={avaliacoesPage.alunoCadastro}
                      alunoSelecionado={avaliacoesPage.alunoSelecionado}
                      anamneseAluno={avaliacoesPage.anamneseAluno}
                      avaliacaoAnterior={avaliacoesPage.avaliacaoAnterior}
                      historicoAluno={avaliacoesPage.historicoAluno}
                      primeiraAvaliacao={avaliacoesPage.primeiraAvaliacao}
                      relatorioAtivo={avaliacoesPage.relatorioAtivo}
                      ultimaAvaliacao={avaliacoesPage.ultimaAvaliacao}
                      onAlternarRelatorioAnamnese={avaliacoesPage.alternarRelatorioAnamnese}
                      onAlternarRelatorio={avaliacoesPage.alternarRelatorio}
                      onCopiarResumo={avaliacoesPage.copiarResumoWhatsApp}
                      onFechar={avaliacoesPage.fecharPerfilAluno}
                      onFecharRelatorio={avaliacoesPage.fecharRelatorio}
                      styles={styles}
                    />
                  </InlineDetails>
                </AnamneseCardMobile>
              ))}
            </div>
          )}

        <div className="desktop-detail-panel">
          <AvaliacaoDetalhesModal
            alertas={avaliacoesPage.alertas}
            alunoCadastro={avaliacoesPage.alunoCadastro}
            alunoSelecionado={avaliacoesPage.alunoSelecionado}
            anamneseAluno={avaliacoesPage.anamneseAluno}
            avaliacaoAnterior={avaliacoesPage.avaliacaoAnterior}
            historicoAluno={avaliacoesPage.historicoAluno}
            primeiraAvaliacao={avaliacoesPage.primeiraAvaliacao}
            relatorioAtivo={avaliacoesPage.relatorioAtivo}
            ultimaAvaliacao={avaliacoesPage.ultimaAvaliacao}
            onAlternarRelatorioAnamnese={avaliacoesPage.alternarRelatorioAnamnese}
            onAlternarRelatorio={avaliacoesPage.alternarRelatorio}
            onCopiarResumo={avaliacoesPage.copiarResumoWhatsApp}
            onFechar={avaliacoesPage.fecharPerfilAluno}
            onFecharRelatorio={avaliacoesPage.fecharRelatorio}
            styles={styles}
          />
        </div>

        {avaliacoesPage.modalAvaliacao && (
          <Suspense fallback={null}>
            <AvaliacaoModal
              alunos={avaliacoesPage.alunos}
              avaliacao={avaliacoesPage.avaliacaoEditando}
              alunoIdInicial={avaliacoesPage.alunoIdInicialAvaliacao}
              onClose={avaliacoesPage.fecharModalAvaliacao}
              onSave={avaliacoesPage.salvarAvaliacao}
            />
          </Suspense>
        )}

        {avaliacoesPage.modalAnamnese && (
          <Suspense fallback={null}>
            <AnamneseModal
              alunos={avaliacoesPage.alunos}
              anamnese={avaliacoesPage.anamneseEditando}
              alunoIdInicial={avaliacoesPage.alunoIdInicialAnamnese}
              onClose={avaliacoesPage.fecharModalAnamnese}
              onSave={avaliacoesPage.salvarAnamnese}
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
};

const listaCard = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "22px",
};

const contextoAluno = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  fontSize: "14px",
  gap: "12px",
  justifyContent: "space-between",
  marginTop: "16px",
  minWidth: 0,
  padding: "12px 14px",
};

const contextoAlunoTexto = {
  display: "grid",
  gap: "4px",
  minWidth: 0,
};

const contextoAlunoTitulo = {
  color: "#111827",
  lineHeight: 1.35,
  overflowWrap: "anywhere",
};

const contextoAlunoDescricao = {
  color: "#4b5563",
  fontSize: "13px",
  lineHeight: 1.4,
};

const contextoAlunoAcoes = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  justifyContent: "flex-end",
  minWidth: 0,
};

const listaTopo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "end",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const resumoLista = { color: "#6b7280", fontSize: "14px", marginTop: "6px" };

const moduloCards = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
  marginBottom: "16px",
};

const moduloCard = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
  background: "#f9fafb",
};

const moduloBadge = {
  color: "#2563eb",
  display: "block",
  fontSize: "12px",
  fontWeight: "800",
  marginBottom: "8px",
  textTransform: "uppercase",
};

const moduloTitulo = { fontSize: "18px", margin: "0 0 8px" };
const moduloTexto = { color: "#4b5563", fontSize: "14px", lineHeight: 1.5, margin: "0 0 14px" };
const moduloAjuda = {
  fontSize: "13px",
  lineHeight: 1.45,
  margin: "0 0 14px",
};

const tabs = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "14px",
};

const tabButton = {
  background: "#eef2ff",
  border: "1px solid #dbeafe",
  borderRadius: "8px",
  color: "#1f2937",
  cursor: "pointer",
  fontWeight: "800",
  padding: "10px 12px",
};

const tabButtonActive = {
  background: "#111827",
  borderColor: "#111827",
  color: "white",
};

const filtros = {
  display: "grid",
  gridTemplateColumns: "minmax(220px, 1fr) minmax(180px, 240px)",
  gap: "10px",
  marginTop: "14px",
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

const tabela = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  borderRadius: "8px",
  overflow: "hidden",
};

const linhaCabecalho = { background: "#111827", color: "white" };
const tabelaHeader = { padding: "12px", textAlign: "left", fontSize: "13px" };
const tabelaCelula = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
};
const estadoVazio = { ...tabelaCelula, color: "#6b7280", textAlign: "center" };
const acoes = { display: "flex", gap: "8px", flexWrap: "wrap" };

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

const detalhesCard = {
  marginTop: "24px",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "20px",
};

const detalhesTopo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  marginBottom: "18px",
};

const detalhesTitulo = { margin: 0, fontSize: "22px" };

const perfilGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
  marginBottom: "18px",
};

const detalhesGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(280px, 1fr) minmax(260px, 0.8fr)",
  gap: "16px",
  marginTop: "18px",
};

const painel = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "18px",
};

const painelTitulo = { margin: "0 0 14px", fontSize: "18px" };
const subtituloSecao = { margin: "22px 0 14px", fontSize: "18px" };

const alertasGrid = {
  display: "grid",
  gap: "10px",
  marginBottom: "18px",
};

const alertaCard = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: "700",
  padding: "12px",
};

const graficosGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
};

const graficoCard = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
};

const grafico = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(48px, 1fr))",
  gap: "10px",
  minHeight: "170px",
  alignItems: "end",
};

const barraItem = {
  display: "grid",
  gridTemplateRows: "auto 100px auto",
  gap: "7px",
  textAlign: "center",
};

const barraValor = { color: "#374151", fontSize: "11px", fontWeight: "700" };
const barraTrilho = {
  display: "flex",
  alignItems: "end",
  background: "#eef2f7",
  borderRadius: "8px",
  overflow: "hidden",
};
const barra = { width: "100%", background: "#2563eb", borderRadius: "8px 8px 0 0" };
const barraLabel = { color: "#6b7280", fontSize: "11px" };

const relatorio = {
  marginTop: "16px",
};

const relatorioGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
};

const fotosRelatorioSecao = {
  gridColumn: "1 / -1",
  border: "1px solid #eef2f7",
  borderRadius: "8px",
  padding: "16px",
  background: "#f9fafb",
};

const fotosRelatorioGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
};

const fotoRelatorioCard = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "8px",
  background: "white",
  cursor: "pointer",
  textAlign: "left",
};

const fotoRelatorioImagem = {
  width: "100%",
  aspectRatio: "4 / 3",
  objectFit: "cover",
  borderRadius: "6px",
  background: "#e5e7eb",
  display: "block",
};

const fotoRelatorioLegenda = {
  display: "block",
  color: "#374151",
  fontSize: "13px",
  fontWeight: "800",
  marginTop: "8px",
};

const relatorioContainer = {
  marginTop: "22px",
  border: "1px solid #dbeafe",
  borderRadius: "8px",
  background: "white",
  padding: "18px",
  scrollMarginTop: "24px",
};

const relatorioTopo = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "4px",
};

const relatorioTitulo = { margin: 0, fontSize: "18px" };
const relatorioResumo = { margin: "6px 0 0", color: "#6b7280", fontSize: "13px" };

const infoItem = {
  border: "1px solid #eef2f7",
  borderRadius: "8px",
  padding: "12px",
  background: "#f9fafb",
  marginBottom: "10px",
};

const infoLabel = {
  display: "block",
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "700",
  marginBottom: "4px",
  textTransform: "uppercase",
};

const infoValor = { color: "#111827", fontSize: "14px" };

const styles = {
  acoes,
  alertaCard,
  alertasGrid,
  barra,
  barraItem,
  barraLabel,
  barraTrilho,
  barraValor,
  botaoPrimario,
  botaoSecundario,
  campo,
  contextoAluno,
  contextoAlunoAcoes,
  contextoAlunoDescricao,
  contextoAlunoTexto,
  contextoAlunoTitulo,
  conteudo,
  detalhesCard,
  detalhesGrid,
  detalhesTitulo,
  detalhesTopo,
  erroBox,
  estadoVazio,
  filtros,
  fotoRelatorioCard,
  fotoRelatorioImagem,
  fotoRelatorioLegenda,
  fotosRelatorioGrid,
  fotosRelatorioSecao,
  grafico,
  graficoCard,
  graficosGrid,
  infoItem,
  infoLabel,
  infoValor,
  linhaCabecalho,
  listaCard,
  listaTopo,
  moduloBadge,
  moduloCard,
  moduloCards,
  moduloAjuda,
  moduloTexto,
  moduloTitulo,
  painel,
  painelTitulo,
  perfilGrid,
  relatorio,
  relatorioContainer,
  relatorioGrid,
  relatorioResumo,
  relatorioTitulo,
  relatorioTopo,
  resumoLista,
  subtituloSecao,
  tabButton,
  tabButtonActive,
  tabs,
  tabela,
  tabelaCelula,
  tabelaHeader,
};

export default AvaliacoesList;
