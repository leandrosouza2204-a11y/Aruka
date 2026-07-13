import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import InlineDetails from "../../../components/InlineDetails";
import { formatarData, formatarMoeda } from "../../../data/alunosUtils";
import { classeStatusAluno } from "../../../data/statusHelpers";
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

      <div
        className="alunos-page app-main page-container"
        data-page="alunos"
        data-testid="alunos-page"
        style={styles.conteudo}
      >
        <AlunosHeader
          alunosFiltradosTotal={page.alunosFiltrados.length}
          alunosTotal={page.alunos.length}
          onNovoAluno={page.abrirCadastro}
          styles={styles}
        />

        {!page.carregando && !page.erro && page.planos.length === 0 && (
          <section className="app-card app-alert" style={styles.planoAviso}>
            <div style={styles.planoAvisoTexto}>
              <h2 style={styles.planoAvisoTitulo}>
                Crie um plano antes de cadastrar alunos
              </h2>
              <p className="app-muted" style={styles.planoAvisoDescricao}>
                Os planos ajudam a organizar vencimentos, valores e o
                acompanhamento financeiro dos alunos. Cadastre o primeiro plano
                para deixar a base pronta.
              </p>
            </div>

            <Link className="app-button app-button-primary" to="/planos">
              Criar primeiro plano
            </Link>
          </section>
        )}

        <section className="app-card alunos-filter-card" style={styles.listaCard}>
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

        {page.erro && <div className="app-error">{page.erro}</div>}

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
            <div className="app-loading mobile-list-card">
              Carregando alunos...
            </div>
          ) : page.alunosFiltrados.length === 0 ? (
            <div className="app-empty-state mobile-list-card">
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
                  <AlunoDetalhesResponsivo
                    aluno={aluno}
                    nomePlano={page.nomePlano}
                    onEditar={page.abrirEdicao}
                    onFechar={() => page.setAlunoSelecionadoId("")}
                    styles={styles}
                  />
                </InlineDetails>
              </AlunoCardMobile>
            ))
          )}
        </div>

        {page.alunoSelecionado && (
          <AlunoDetalhesResponsivo
            aluno={page.alunoSelecionado}
            className="desktop-detail-panel"
            nomePlano={page.nomePlano}
            onEditar={page.abrirEdicao}
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
  const tituloId = "aluno-form-title";
  const descricaoId = "aluno-form-description";

  useEffect(() => {
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflowAnterior;
    };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    page.salvarAluno();
  }

  return createPortal(
    <div className="aluno-form-overlay" style={styles.modalOverlay}>
      <div
        aria-describedby={descricaoId}
        aria-labelledby={tituloId}
        aria-modal="true"
        className="aluno-form-modal"
        data-testid="aluno-form-modal"
        role="dialog"
        style={styles.modal}
      >
        <div className="aluno-form-header" style={styles.modalTopo}>
          <div className="aluno-form-heading">
            <h2 id={tituloId} style={styles.detalhesTitulo}>
              {page.alunoEditandoId ? "Editar Aluno" : "Cadastro Aluno"}
            </h2>
            <p id={descricaoId} style={styles.resumoLista}>Preencha os dados do aluno</p>
          </div>

          <button
            className="aluno-form-close"
            data-testid="aluno-form-close"
            onClick={page.fecharModal}
            style={styles.botaoSecundario}
            type="button"
          >
            Fechar
          </button>
        </div>

        <form className="aluno-form-shell" onSubmit={handleSubmit}>
          <div
            className="aluno-form-scroll"
            data-testid="aluno-form-scroll"
            style={styles.formScroll}
          >
            <div className="aluno-form-grid" style={styles.formGrid}>
          <Campo label="Nome do aluno" styles={styles}>
            <input
              autoComplete="name"
              data-testid="aluno-name"
              enterKeyHint="next"
              placeholder="Ex: Maria Silva"
              value={form.nome}
              onChange={(e) => page.atualizarForm("nome", e.target.value)}
              style={styles.campo}
            />
          </Campo>

          <Campo label="WhatsApp" styles={styles}>
            <input
              autoComplete="tel"
              data-testid="aluno-phone"
              enterKeyHint="next"
              inputMode="tel"
              placeholder="Ex: (11) 99999-9999"
              type="tel"
              value={form.whatsapp}
              onChange={page.handleWhatsApp}
              style={styles.campo}
            />
          </Campo>

          <Campo label="Data de nascimento" styles={styles}>
            <input
              data-testid="aluno-birth-date"
              enterKeyHint="next"
              type="date"
              value={form.nascimento}
              onChange={(e) => page.atualizarForm("nascimento", e.target.value)}
              style={styles.campo}
            />
          </Campo>

          <Campo label="Início do plano" styles={styles}>
            <input
              data-testid="aluno-plan-start"
              enterKeyHint="next"
              type="date"
              value={form.inicio}
              onChange={page.handleInicio}
              style={styles.campo}
            />
          </Campo>

          <Campo label="Plano contratado" styles={styles}>
            <select
              data-testid="aluno-plan"
              value={form.plano}
              onChange={page.handlePlano}
              style={styles.campo}
            >
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
              data-testid="aluno-due-date"
              readOnly
              placeholder="Calculado pelo plano"
              value={formatarData(form.vencimento)}
              style={{ ...styles.campo, background: "#f9fafb" }}
            />
          </Campo>

          <Campo label="Valor" styles={styles}>
            <input
              data-testid="aluno-value"
              inputMode="decimal"
              type="number"
              min="0"
              step="0.01"
              placeholder="Calculado pelo plano"
              value={form.valor}
              onChange={(e) => page.atualizarForm("valor", e.target.value)}
              style={styles.campo}
            />
          </Campo>

            </div>
          </div>

          <div
            className="aluno-form-footer"
            data-testid="aluno-form-footer"
            style={styles.formFooter}
          >
            <button
              className="aluno-form-cancel"
              data-testid="aluno-form-cancel"
              onClick={page.fecharModal}
              style={styles.botaoSecundario}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="aluno-form-submit"
              data-testid="aluno-form-submit"
              style={styles.botaoPrimario}
              disabled={page.salvando}
              type="submit"
            >
              {page.salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

// eslint-disable-next-line no-unused-vars
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

function AlunoDetalhesResponsivo({
  aluno,
  className = "",
  nomePlano,
  onEditar,
  onFechar,
  styles,
}) {
  return (
    <section
      className={`aluno-details ${className}`.trim()}
      data-testid="aluno-details"
      style={styles.detalhesAluno}
    >
      <div
        className="aluno-details-header"
        data-testid="aluno-details-header"
        style={styles.detalhesTopo}
      >
        <div className="aluno-details-heading">
          <span className={classeStatusAluno(aluno.status)}>{aluno.status}</span>
          <h2 style={styles.detalhesTitulo}>{aluno.nome}</h2>
          <p style={styles.resumoLista}>Informações completas do cadastro</p>
        </div>

        <button
          data-testid="aluno-details-close"
          onClick={onFechar}
          style={styles.botaoSecundario}
          type="button"
        >
          Fechar
        </button>
      </div>

      <div className="aluno-details-content" data-testid="aluno-details-content">
        <section className="aluno-details-section" data-testid="aluno-details-plan">
          <h3>Plano e vencimento</h3>
          <div style={styles.detalhesGrid}>
            <InfoResponsivo label="Plano" valor={nomePlano(aluno.plano)} styles={styles} />
            <InfoResponsivo label="Valor" valor={formatarMoeda(aluno.valor)} styles={styles} />
            <InfoResponsivo label="Início" valor={formatarData(aluno.inicio)} styles={styles} />
            <InfoResponsivo label="Vencimento" valor={formatarData(aluno.vencimento)} styles={styles} />
          </div>
        </section>

        <section className="aluno-details-section" data-testid="aluno-details-contact">
          <h3>Contato</h3>
          <div style={styles.detalhesGrid}>
            <InfoResponsivo label="WhatsApp" valor={aluno.whatsapp || "Não cadastrado"} styles={styles} />
          </div>
        </section>

        <section className="aluno-details-section">
          <h3>Dados pessoais e status</h3>
          <div style={styles.detalhesGrid}>
            <InfoResponsivo label="Nascimento" valor={formatarData(aluno.nascimento)} styles={styles} />
            <InfoResponsivo label="Status" valor={aluno.status} styles={styles} />
            <InfoResponsivo label="Pagamento recebido" valor={aluno.pagamentoRecebido ? "Sim" : "Não"} styles={styles} />
            <InfoResponsivo label="Data do pagamento" valor={formatarData(aluno.dataPagamento)} styles={styles} />
          </div>
        </section>

        <section className="aluno-details-section">
          <h3>Avisos</h3>
          <div style={styles.detalhesGrid}>
            <InfoResponsivo label="Aviso 7 dias" valor={formatarData(aluno.aviso7)} styles={styles} />
            <InfoResponsivo label="Aviso 1 dia" valor={formatarData(aluno.aviso1)} styles={styles} />
          </div>
        </section>

        <section
          className="aluno-details-section aluno-details-observacoes"
          data-testid="aluno-details-observacoes"
        >
          <h3>Observações</h3>
          <p>{aluno.observacoes || "Sem observações cadastradas"}</p>
        </section>

        <div className="aluno-details-actions" data-testid="aluno-details-actions">
          <button
            className="table-button table-button-primary"
            data-testid="aluno-details-edit"
            onClick={() => onEditar?.(aluno)}
            type="button"
          >
            Editar aluno
          </button>
          <button
            className="table-button table-button-secondary"
            onClick={onFechar}
            type="button"
          >
            Recolher detalhes
          </button>
        </div>
      </div>
    </section>
  );
}

function InfoResponsivo({ label, valor, styles }) {
  return (
    <div className="aluno-details-info" style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <strong style={styles.infoValor}>{valor || "Não informado"}</strong>
    </div>
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
    width: "100%",
  },
  formScroll: {
    minHeight: 0,
    overflowX: "clip",
    overflowY: "auto",
    padding: "20px 24px",
  },
  formFooter: {
    alignItems: "center",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    flex: "0 0 auto",
    gap: "10px",
    justifyContent: "flex-end",
    padding: "14px 24px",
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
  planoAviso: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    justifyContent: "space-between",
    padding: "16px",
  },
  planoAvisoTexto: {
    display: "grid",
    gap: "5px",
    minWidth: 0,
  },
  planoAvisoTitulo: {
    color: "#111827",
    fontSize: "16px",
    margin: 0,
  },
  planoAvisoDescricao: {
    fontSize: "14px",
    lineHeight: 1.5,
    margin: 0,
    maxWidth: "720px",
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
    minWidth: 0,
  },
  labelCampo: {
    color: "#374151",
    fontSize: "13px",
    fontWeight: "700",
  },
  campo: {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    minHeight: "42px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    boxSizing: "border-box",
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
    zIndex: 1200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "rgba(17, 24, 39, 0.55)",
  },
  modal: {
    width: "min(680px, 100%)",
    height: "min(760px, calc(100dvh - 48px))",
    maxHeight: "calc(100dvh - 48px)",
    overflow: "hidden",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  modalTopo: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    flex: "0 0 auto",
    padding: "24px 24px 0",
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
