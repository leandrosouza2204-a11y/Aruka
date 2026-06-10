import Sidebar from "../../../components/Sidebar";
import AnamneseModal from "../../../components/AnamneseModal";
import AvaliacaoModal from "../../../components/AvaliacaoModal";
import { useAvaliacoesPage } from "../hooks/useAvaliacoesPage";
import AvaliacaoCardMobile from "./AvaliacaoCardMobile";
import AvaliacaoDetalhesModal from "./AvaliacaoDetalhesModal";
import AvaliacoesFilters from "./AvaliacoesFilters";
import AvaliacoesHeader from "./AvaliacoesHeader";
import AvaliacoesTable from "./AvaliacoesTable";

function AvaliacoesList() {
  const avaliacoesPage = useAvaliacoesPage();

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div className="avaliacoes-page" style={styles.conteudo}>
        <AvaliacoesHeader
          quantidadeExibida={avaliacoesPage.avaliacoesFiltradas.length}
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
          <div style={styles.erroBox}>{avaliacoesPage.erro}</div>
        )}

        <AvaliacoesTable
          avaliacoes={avaliacoesPage.avaliacoesFiltradas}
          carregando={avaliacoesPage.carregando}
          onPerfil={avaliacoesPage.selecionarPerfilAluno}
          onEditar={avaliacoesPage.abrirEdicaoAvaliacao}
          onAnamnese={avaliacoesPage.editarAnamneseAluno}
          onExcluir={avaliacoesPage.removerAvaliacao}
          onNovaAvaliacao={avaliacoesPage.abrirNovaAvaliacao}
          styles={styles}
        />

        {!avaliacoesPage.carregando &&
          avaliacoesPage.avaliacoesFiltradas.length > 0 && (
            <div className="mobile-card-list avaliacoes-mobile-cards">
              {avaliacoesPage.avaliacoesFiltradas.map((avaliacao) => (
                <AvaliacaoCardMobile
                  key={avaliacao.id}
                  avaliacao={avaliacao}
                  onPerfil={avaliacoesPage.selecionarPerfilAluno}
                  onEditar={avaliacoesPage.abrirEdicaoAvaliacao}
                  onAnamnese={avaliacoesPage.editarAnamneseAluno}
                  onExcluir={avaliacoesPage.removerAvaliacao}
                />
              ))}
            </div>
          )}

        <AvaliacaoDetalhesModal
          alertas={avaliacoesPage.alertas}
          alunoCadastro={avaliacoesPage.alunoCadastro}
          alunoSelecionado={avaliacoesPage.alunoSelecionado}
          anamneseAluno={avaliacoesPage.anamneseAluno}
          avaliacaoAnterior={avaliacoesPage.avaliacaoAnterior}
          historicoAluno={avaliacoesPage.historicoAluno}
          primeiraAvaliacao={avaliacoesPage.primeiraAvaliacao}
          relatorioAnamneseAberto={avaliacoesPage.relatorioAnamneseAberto}
          relatorioAberto={avaliacoesPage.relatorioAberto}
          ultimaAvaliacao={avaliacoesPage.ultimaAvaliacao}
          onAlternarRelatorioAnamnese={avaliacoesPage.alternarRelatorioAnamnese}
          onAlternarRelatorio={avaliacoesPage.alternarRelatorio}
          onCopiarResumo={avaliacoesPage.copiarResumoWhatsApp}
          onFechar={avaliacoesPage.fecharPerfilAluno}
          styles={styles}
        />

        {avaliacoesPage.modalAvaliacao && (
          <AvaliacaoModal
            alunos={avaliacoesPage.alunos}
            avaliacao={avaliacoesPage.avaliacaoEditando}
            onClose={avaliacoesPage.fecharModalAvaliacao}
            onSave={avaliacoesPage.salvarAvaliacao}
          />
        )}

        {avaliacoesPage.modalAnamnese && (
          <AnamneseModal
            alunos={avaliacoesPage.alunos}
            anamnese={avaliacoesPage.anamneseEditando}
            onClose={avaliacoesPage.fecharModalAnamnese}
            onSave={avaliacoesPage.salvarAnamnese}
          />
        )}
      </div>
    </div>
  );
}

const conteudo = {
  padding: "30px",
  marginLeft: "260px",
  width: "calc(100% - 260px)",
};

const listaCard = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
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

const tituloPagina = { fontSize: "30px", letterSpacing: 0 };
const resumoLista = { color: "#6b7280", fontSize: "14px", marginTop: "6px" };

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
  marginTop: "22px",
  borderTop: "1px solid #e5e7eb",
  paddingTop: "18px",
};

const relatorioGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
};

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
  conteudo,
  detalhesCard,
  detalhesGrid,
  detalhesTitulo,
  detalhesTopo,
  erroBox,
  estadoVazio,
  filtros,
  grafico,
  graficoCard,
  graficosGrid,
  infoItem,
  infoLabel,
  infoValor,
  linhaCabecalho,
  listaCard,
  listaTopo,
  painel,
  painelTitulo,
  perfilGrid,
  relatorio,
  relatorioGrid,
  resumoLista,
  subtituloSecao,
  tabela,
  tabelaCelula,
  tabelaHeader,
  tituloPagina,
};

export default AvaliacoesList;
