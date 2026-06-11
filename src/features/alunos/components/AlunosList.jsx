import Sidebar from "../../../components/Sidebar";
import InlineDetails from "../../../components/InlineDetails";
import { formatarData, formatarMoeda } from "../../../data/alunosUtils";
import { useAlunosPage } from "../hooks/useAlunosPage";
import AlunoCardMobile from "./AlunoCardMobile";
import AlunosFilters from "./AlunosFilters";
import AlunosHeader from "./AlunosHeader";
import AlunosTable from "./AlunosTable";

function AlunosList() {
  const page = useAlunosPage();
  const alternarDetalhesAluno = (id) => {
    page.setAlunoSelecionadoId(page.alunoSelecionadoId === id ? "" : id);
  };

  return (
    <div className="app-shell" style={{ display: "flex" }}>
      <Sidebar />

      <div className="app-main page-container" style={styles.conteudo}>
        <AlunosHeader
          alunosFiltradosTotal={page.alunosFiltrados.length}
          alunosTotal={page.alunos.length}
          onNovoAluno={page.abrirCadastro}
          styles={styles}
        />

        <section className="app-card" style={styles.listaCard}>
          <AlunosFilters
            busca={page.busca}
            filtroPlano={page.filtroPlano}
            filtroStatus={page.filtroStatus}
            onBuscaChange={page.setBusca}
            onFiltroPlanoChange={page.setFiltroPlano}
            onFiltroStatusChange={page.setFiltroStatus}
            onLimpar={page.limparFiltros}
            planos={page.planos}
            styles={styles}
          />
        </section>

        {page.erro && <div style={styles.erroBox}>{page.erro}</div>}

        {page.modalCadastroAberto && (
          <AlunoModal page={page} styles={styles} />
        )}

        <AlunosTable
          alunos={page.alunosFiltrados}
          carregando={page.carregando}
          nomePlano={page.nomePlano}
          onCheckin={page.enviarCheckinSemanal}
          onDetalhes={alternarDetalhesAluno}
          onEditar={page.abrirEdicao}
          onExcluir={page.excluirAluno}
          onNovoAluno={page.abrirCadastro}
          styles={styles}
        />

        <div className="mobile-card-list alunos-mobile-cards">
          {page.carregando ? (
            <div className="mobile-list-card">
              Carregando alunos...
            </div>
          ) : page.alunosFiltrados.length === 0 ? (
            <div className="mobile-list-card">
              Nenhum aluno encontrado.
            </div>
          ) : (
            page.alunosFiltrados.map((aluno) => (
              <AlunoCardMobile
                key={aluno.id}
                aluno={aluno}
                isExpanded={page.alunoSelecionadoId === aluno.id}
                nomePlano={page.nomePlano}
                onCheckin={page.enviarCheckinSemanal}
                onDetalhes={alternarDetalhesAluno}
                onEditar={page.abrirEdicao}
                onExcluir={page.excluirAluno}
              >
                <InlineDetails
                  className="mobile-inline-details"
                  itemId={aluno.id}
                  selectedItemId={page.alunoSelecionadoId}
                >
                  <AlunoDetalhes
                    aluno={aluno}
                    nomePlano={page.nomePlano}
                    onFechar={() => page.setAlunoSelecionadoId("")}
                    styles={styles}
                  />
                </InlineDetails>
              </AlunoCardMobile>
            ))
          )}
        </div>

        {page.alunoSelecionado && (
          <AlunoDetalhes
            aluno={page.alunoSelecionado}
            className="desktop-detail-panel"
            nomePlano={page.nomePlano}
            onFechar={() => page.setAlunoSelecionadoId("")}
            styles={styles}
          />
        )}
      </div>
    </div>
  );
}

function AlunoModal({ page, styles }) {
  const form = page.form;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalTopo}>
          <div>
            <h2 style={styles.detalhesTitulo}>
              {page.alunoEditandoId ? "Editar Aluno" : "Cadastro Aluno"}
            </h2>
            <p style={styles.resumoLista}>Preencha os dados do aluno</p>
          </div>

          <button onClick={page.fecharModal} style={styles.botaoSecundario}>
            Fechar
          </button>
        </div>

        <div style={styles.formGrid}>
          <Campo label="Nome do aluno" styles={styles}>
            <input
              placeholder="Ex: Maria Silva"
              value={form.nome}
              onChange={(e) => page.atualizarForm("nome", e.target.value)}
              style={styles.campo}
            />
          </Campo>

          <Campo label="WhatsApp" styles={styles}>
            <input
              placeholder="Ex: (11) 99999-9999"
              value={form.whatsapp}
              onChange={page.handleWhatsApp}
              style={styles.campo}
            />
          </Campo>

          <Campo label="Data de nascimento" styles={styles}>
            <input
              type="date"
              value={form.nascimento}
              onChange={(e) => page.atualizarForm("nascimento", e.target.value)}
              style={styles.campo}
            />
          </Campo>

          <Campo label="Início do plano" styles={styles}>
            <input
              type="date"
              value={form.inicio}
              onChange={page.handleInicio}
              style={styles.campo}
            />
          </Campo>

          <Campo label="Plano contratado" styles={styles}>
            <select value={form.plano} onChange={page.handlePlano} style={styles.campo}>
              <option value="">Selecione o plano</option>
              {page.planosAtivos.map((plano) => (
                <option key={plano.id} value={plano.id}>
                  {plano.nome}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Vencimento" styles={styles}>
            <input
              readOnly
              placeholder="Calculado pelo plano"
              value={formatarData(form.vencimento)}
              style={{ ...styles.campo, background: "#f9fafb" }}
            />
          </Campo>

          <Campo label="Valor" styles={styles}>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Calculado pelo plano"
              value={form.valor}
              onChange={(e) => page.atualizarForm("valor", e.target.value)}
              style={styles.campo}
            />
          </Campo>

          <button onClick={page.salvarAluno} style={styles.botaoPrimario} disabled={page.salvando}>
            {page.salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AlunoDetalhes({ aluno, className = "", nomePlano, onFechar, styles }) {
  return (
    <section className={className} style={styles.detalhesAluno}>
      <div style={styles.detalhesTopo}>
        <div>
          <h2 style={styles.detalhesTitulo}>{aluno.nome}</h2>
          <p style={styles.resumoLista}>Informações completas do cadastro</p>
        </div>

        <button onClick={onFechar} style={styles.botaoSecundario}>
          Fechar
        </button>
      </div>

      <div style={styles.detalhesGrid}>
        <Info label="WhatsApp" valor={aluno.whatsapp} styles={styles} />
        <Info label="Nascimento" valor={formatarData(aluno.nascimento)} styles={styles} />
        <Info label="Início" valor={formatarData(aluno.inicio)} styles={styles} />
        <Info label="Plano" valor={nomePlano(aluno.plano)} styles={styles} />
        <Info label="Valor" valor={formatarMoeda(aluno.valor)} styles={styles} />
        <Info label="Vencimento" valor={formatarData(aluno.vencimento)} styles={styles} />
        <Info label="Aviso 7 dias" valor={formatarData(aluno.aviso7)} styles={styles} />
        <Info label="Aviso 1 dia" valor={formatarData(aluno.aviso1)} styles={styles} />
        <Info label="Status" valor={aluno.status} styles={styles} />
        <Info label="Pagamento recebido" valor={aluno.pagamentoRecebido ? "Sim" : "Não"} styles={styles} />
        <Info label="Data do pagamento" valor={formatarData(aluno.dataPagamento)} styles={styles} />
        <Info label="Observações" valor={aluno.observacoes || "-"} styles={styles} />
      </div>
    </section>
  );
}

function Campo({ label, children, styles }) {
  return (
    <label style={styles.campoGrupo}>
      <span style={styles.labelCampo}>{label}</span>
      {children}
    </label>
  );
}

function Info({ label, valor, styles }) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <strong style={styles.infoValor}>{valor || "-"}</strong>
    </div>
  );
}

const styles = {
  formGrid: {
    display: "grid",
    gap: "14px",
    maxWidth: "620px",
    marginTop: "20px",
  },
  conteudo: {
    padding: "24px",
    marginLeft: "260px",
    width: "calc(100% - 260px)",
  },
  listaCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "22px",
  },
  listaTopo: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "end",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  resumoLista: {
    color: "#6b7280",
    fontSize: "14px",
    marginTop: "6px",
  },
  filtros: {
    display: "grid",
    gridTemplateColumns:
      "minmax(220px, 1fr) minmax(170px, 220px) minmax(170px, 220px) auto",
    gap: "10px",
    alignItems: "center",
    width: "100%",
    maxWidth: "820px",
  },
  campoFiltro: {
    minWidth: 0,
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
    background: "white",
    borderRadius: "8px",
    overflow: "hidden",
  },
  linhaCabecalho: {
    background: "#111827",
    color: "white",
  },
  tabelaHeader: {
    padding: "12px",
    textAlign: "left",
    fontSize: "13px",
  },
  tabelaCelula: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
  },
  estadoVazio: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#6b7280",
    textAlign: "center",
  },
  botaoPrimario: {
    background: "#111827",
    color: "white",
    border: "none",
    padding: "11px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },
  botaoSecundario: {
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
  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "rgba(17, 24, 39, 0.55)",
  },
  modal: {
    width: "min(680px, 100%)",
    maxHeight: "calc(100vh - 48px)",
    overflowY: "auto",
    background: "white",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)",
  },
  modalTopo: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
  },
  detalhesAluno: {
    marginTop: "24px",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "20px",
  },
  detalhesTopo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "18px",
  },
  detalhesTitulo: {
    margin: 0,
    fontSize: "20px",
  },
  detalhesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  infoItem: {
    border: "1px solid #eef2f7",
    borderRadius: "8px",
    padding: "12px",
    background: "#f9fafb",
  },
  infoLabel: {
    display: "block",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "4px",
    textTransform: "uppercase",
  },
  infoValor: {
    color: "#111827",
    fontSize: "14px",
  },
};

export default AlunosList;
