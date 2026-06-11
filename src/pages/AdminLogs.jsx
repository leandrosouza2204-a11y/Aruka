import { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import { useToast } from "../hooks/useToast";
import { filtrarAdminLogs } from "../services/adminLogsService";

const filtrosIniciais = {
  acao: "",
  targetUserId: "",
  dataInicio: "",
  dataFim: "",
  busca: "",
};

const acoesAuditadas = [
  "liberar_usuario_beta",
  "liberar_assinante",
  "bloquear_usuario",
  "reativar_usuario",
  "alterar_perfil",
  "alterar_assinatura",
  "tornar_admin",
  "remover_admin",
  "cancelar_assinatura",
  "transfer_access",
];

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [logDetalhado, setLogDetalhado] = useState(null);
  const toast = useToast();

  const carregarLogs = useCallback(async (filtrosAtuais) => {
    setCarregando(true);
    setErro("");

    try {
      const lista = await filtrarAdminLogs(filtrosAtuais || filtrosIniciais);
      setLogs(lista);
    } catch (error) {
      console.error(error);
      setErro(error.message || "Não foi possível carregar os logs administrativos.");
      setLogs([]);
      toast.erro(
        "Não foi possível carregar os logs",
        "Verifique suas permissões ou tente novamente em instantes."
      );
    } finally {
      setCarregando(false);
    }
  }, [toast]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      carregarLogs(filtrosIniciais);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [carregarLogs]);

  function atualizarFiltro(campo, valor) {
    setFiltros((atuais) => ({ ...atuais, [campo]: valor }));
  }

  function aplicarFiltros(event) {
    event.preventDefault();
    carregarLogs(filtros);
  }

  function limparFiltros() {
    setFiltros(filtrosIniciais);
    carregarLogs(filtrosIniciais);
  }

  return (
    <div className="app-shell" style={{ display: "flex" }}>
      <Sidebar />

      <main className="admin-logs-page app-main page-container" style={conteudo}>
        <header style={topo}>
          <div>
            <span style={eyebrow}>Administração</span>
            <h1 style={titulo}>Logs administrativos</h1>
            <p style={subtitulo}>
              Acompanhe ações sensíveis realizadas por administradores no CoachFlow.
            </p>
          </div>

          <button
            type="button"
            onClick={() => carregarLogs(filtros)}
            style={botaoSecundario}
          >
            Atualizar
          </button>
        </header>

        {erro && <div style={erroBox}>{erro}</div>}

        <section className="admin-logs-panel" style={painel}>
          <form
            className="admin-logs-filters"
            onSubmit={aplicarFiltros}
            style={filtrosGrid}
          >
            <label className="admin-logs-filter-search" style={campoGrupo}>
              <span style={labelCampo}>Buscar</span>
              <input
                value={filtros.busca}
                onChange={(e) => atualizarFiltro("busca", e.target.value)}
                placeholder="Nome, e-mail ou ação"
                style={campo}
              />
            </label>

            <label style={campoGrupo}>
              <span style={labelCampo}>Ação</span>
              <select
                value={filtros.acao}
                onChange={(e) => atualizarFiltro("acao", e.target.value)}
                style={campo}
              >
                <option value="">Todas</option>
                {acoesAuditadas.map((acao) => (
                  <option key={acao} value={acao}>
                    {formatarAcao(acao)}
                  </option>
                ))}
              </select>
            </label>

            <label style={campoGrupo}>
              <span style={labelCampo}>Usuário alvo</span>
              <input
                value={filtros.targetUserId}
                onChange={(e) => atualizarFiltro("targetUserId", e.target.value)}
                placeholder="UUID do usuário"
                style={campo}
              />
            </label>

            <div className="admin-logs-period" style={periodoGrid}>
              <label style={campoGrupo}>
                <span style={labelCampo}>Início</span>
                <input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) => atualizarFiltro("dataInicio", e.target.value)}
                  style={campo}
                />
              </label>

              <label style={campoGrupo}>
                <span style={labelCampo}>Fim</span>
                <input
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) => atualizarFiltro("dataFim", e.target.value)}
                  style={campo}
                />
              </label>
            </div>

            <div className="admin-logs-filter-actions" style={acoesFiltro}>
              <button type="submit" style={botaoPrimario}>
                Filtrar
              </button>
              <button type="button" onClick={limparFiltros} style={botaoSecundario}>
                Limpar
              </button>
            </div>
          </form>
        </section>

        <section className="admin-logs-panel" style={painel}>
          <div style={listaTopo}>
            <div>
              <h2 style={secaoTitulo}>Eventos registrados</h2>
              <p style={subtituloLista}>
                {carregando ? "Carregando..." : `${logs.length} evento(s) exibido(s)`}
              </p>
            </div>
          </div>

          <div className="mobile-card-list admin-logs-mobile-list" style={mobileList}>
            {carregando ? (
              <LoadingState texto="Carregando logs..." />
            ) : logs.length === 0 ? (
              <EmptyState
                titulo="Nenhum log administrativo encontrado."
                descricao="Ajuste os filtros ou execute uma ação administrativa para gerar registros."
              />
            ) : (
              logs.map((log) => (
                <LogCard
                  key={log.id}
                  log={log}
                  onDetalhes={() => setLogDetalhado(log)}
                />
              ))
            )}
          </div>

          <div className="admin-logs-table app-table-scroll desktop-table" style={tabelaScroll}>
            <table className="app-table" style={tabela}>
              <thead>
                <tr style={linhaCabecalho}>
                  <th style={th}>Data</th>
                  <th style={th}>Ação</th>
                  <th style={th}>Admin</th>
                  <th style={th}>Usuário alvo</th>
                  <th style={th}>Entidade</th>
                  <th style={th}>User agent</th>
                  <th style={th}>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td style={estadoVazio} colSpan="7">
                      <LoadingState texto="Carregando logs..." />
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td style={estadoVazio} colSpan="7">
                      <EmptyState
                        titulo="Nenhum log administrativo encontrado."
                        descricao="Ajuste os filtros ou execute uma ação administrativa para gerar registros."
                      />
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td style={td}>{formatarDataHora(log.createdAt)}</td>
                      <td style={td}>
                        <span className="status-badge status-badge-info">
                          {formatarAcao(log.acao)}
                        </span>
                      </td>
                      <td className="cell-wide" style={td}>
                        <strong>{log.adminNome || "Admin"}</strong>
                        <span style={muted}>{log.adminEmail || log.adminUserId}</span>
                      </td>
                      <td className="cell-wide" style={td}>
                        <strong>{log.targetNome || "Usuário"}</strong>
                        <span style={muted}>
                          {log.targetEmail || log.targetUserId || "-"}
                        </span>
                      </td>
                      <td style={td}>
                        <strong>{log.entidade || "-"}</strong>
                        <span style={muted}>{log.entidadeId || "-"}</span>
                      </td>
                      <td className="cell-wide" style={td}>
                        <span style={userAgent} title={log.userAgent || "-"}>
                          {log.userAgent || "-"}
                        </span>
                      </td>
                      <td style={td}>
                        <button
                          type="button"
                          onClick={() => setLogDetalhado(log)}
                          style={botaoDetalhes}
                        >
                          Ver detalhes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {logDetalhado && (
        <AdminLogDetailsModal
          log={logDetalhado}
          onClose={() => setLogDetalhado(null)}
        />
      )}
    </div>
  );
}

function LogCard({ log, onDetalhes }) {
  return (
    <article className="mobile-list-card admin-log-card" style={cardMobile}>
      <div className="admin-log-card-top" style={cardTopo}>
        <span className="status-badge status-badge-info">{formatarAcao(log.acao)}</span>
        <strong className="card-value">{formatarDataHora(log.createdAt)}</strong>
      </div>
      <CardInfo label="Admin" valor={log.adminNome || log.adminEmail || abreviarUUID(log.adminUserId)} />
      <CardInfo
        label="Usuário alvo"
        valor={log.targetNome || log.targetEmail || abreviarUUID(log.targetUserId) || "-"}
      />
      <CardInfo
        label="Entidade"
        valor={`${log.entidade || "-"} ${abreviarUUID(log.entidadeId) || ""}`.trim()}
      />
      <button
        type="button"
        className="admin-log-details-button"
        onClick={onDetalhes}
        style={botaoDetalhes}
      >
        Ver detalhes
      </button>
    </article>
  );
}

function CardInfo({ label, valor }) {
  return (
    <div className="card-row card-row-block">
      <span className="card-label">{label}</span>
      <strong className="card-value card-break">{valor || "-"}</strong>
    </div>
  );
}

function AdminLogDetailsModal({ log, onClose }) {
  return (
    <div style={modalOverlay}>
      <div className="admin-log-modal" style={modalCard}>
        <div style={modalTopo}>
          <div>
            <span style={eyebrow}>Auditoria</span>
            <h2 style={modalTitulo}>Detalhes do log</h2>
            <p style={subtitulo}>{formatarAcao(log.acao)}</p>
          </div>
          <button type="button" onClick={onClose} style={botaoSecundario}>
            Fechar
          </button>
        </div>

        <div style={detalhesGrid}>
          <Info label="Data" valor={formatarDataHora(log.createdAt)} />
          <Info label="Admin" valor={log.adminNome || log.adminEmail || log.adminUserId} />
          <Info
            label="Usuário alvo"
            valor={log.targetNome || log.targetEmail || log.targetUserId || "-"}
          />
          <Info label="Entidade" valor={`${log.entidade || "-"} ${log.entidadeId || ""}`.trim()} />
          <Info label="User agent" valor={log.userAgent || "-"} />
        </div>

        <div style={jsonGrid}>
          <JsonBox titulo="Dados anteriores" valor={log.dadosAnteriores} />
          <JsonBox titulo="Dados novos" valor={log.dadosNovos} />
        </div>
      </div>
    </div>
  );
}

function JsonBox({ titulo, valor }) {
  return (
    <div className="admin-log-json-box" style={jsonBox}>
      <h3 style={jsonTitulo}>{titulo}</h3>
      <pre style={jsonPre}>{valor ? JSON.stringify(valor, null, 2) : "-"}</pre>
    </div>
  );
}

function Info({ label, valor }) {
  return (
    <div style={infoItem}>
      <span style={labelCampo}>{label}</span>
      <strong style={infoValor}>{valor || "-"}</strong>
    </div>
  );
}

function formatarAcao(acao) {
  const mapa = {
    transfer_access: "Transferir acesso",
  };

  if (mapa[acao]) return mapa[acao];

  return String(acao || "-")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function formatarDataHora(valor) {
  if (!valor) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(valor));
}

function abreviarUUID(valor) {
  if (!valor) return "";

  const texto = String(valor);
  if (texto.length <= 18) return texto;

  return `${texto.slice(0, 8)}...${texto.slice(-7)}`;
}

const conteudo = {
  padding: "24px",
  marginLeft: "260px",
  width: "calc(100% - 260px)",
};

const topo = {
  alignItems: "flex-start",
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  justifyContent: "space-between",
};

const eyebrow = {
  color: "#2563eb",
  fontSize: "12px",
  fontWeight: "900",
  textTransform: "uppercase",
};

const titulo = {
  color: "#111827",
  fontSize: "30px",
  margin: "4px 0 0",
};

const subtitulo = {
  color: "#6b7280",
  marginTop: "6px",
};

const painel = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
  marginTop: "20px",
  padding: "20px",
};

const filtrosGrid = {
  alignItems: "end",
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "minmax(260px, 1.4fr) minmax(180px, 0.7fr) minmax(220px, 0.9fr)",
};

const periodoGrid = {
  display: "grid",
  gap: "12px",
  gridColumn: "1 / span 2",
  gridTemplateColumns: "repeat(2, minmax(160px, 1fr))",
};

const campoGrupo = {
  display: "grid",
  gap: "7px",
  minWidth: 0,
};

const labelCampo = {
  color: "#374151",
  fontSize: "12px",
  fontWeight: "800",
};

const campo = {
  background: "white",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  color: "#111827",
  minHeight: "42px",
  minWidth: 0,
  padding: "9px 11px",
  width: "100%",
};

const acoesFiltro = {
  alignSelf: "end",
  display: "flex",
  gap: "10px",
  justifyContent: "flex-end",
};

const botaoPrimario = {
  background: "#111827",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  fontWeight: "800",
  minHeight: "42px",
  padding: "9px 14px",
};

const botaoSecundario = {
  background: "#e5e7eb",
  border: "none",
  borderRadius: "8px",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "700",
  minHeight: "42px",
  padding: "9px 14px",
};

const botaoDetalhes = {
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "8px",
  color: "#1d4ed8",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "800",
  minHeight: "34px",
  padding: "7px 10px",
};

const erroBox = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#991b1b",
  fontWeight: "700",
  marginTop: "16px",
  padding: "12px",
};

const listaTopo = {
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "14px",
};

const secaoTitulo = {
  margin: 0,
};

const subtituloLista = {
  color: "#6b7280",
  marginTop: "4px",
};

const tabelaScroll = {
  overflowX: "auto",
};

const tabela = {
  borderCollapse: "collapse",
  minWidth: "1060px",
  width: "100%",
};

const linhaCabecalho = {
  background: "#111827",
  color: "white",
};

const th = {
  fontSize: "13px",
  padding: "12px",
  textAlign: "left",
};

const td = {
  borderBottom: "1px solid #eef2f7",
  color: "#111827",
  padding: "12px",
  verticalAlign: "top",
};

const estadoVazio = {
  ...td,
  textAlign: "center",
};

const muted = {
  color: "#6b7280",
  display: "block",
  fontSize: "12px",
  marginTop: "4px",
};

const userAgent = {
  color: "#4b5563",
  display: "block",
  fontSize: "12px",
  maxWidth: "220px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const mobileList = {
  display: "none",
};

const cardMobile = {
  display: "grid",
  gap: "10px",
};

const cardTopo = {
  alignItems: "center",
  display: "flex",
  gap: "8px",
  justifyContent: "space-between",
};

const infoItem = {
  display: "grid",
  gap: "3px",
  minWidth: 0,
};

const infoValor = {
  color: "#111827",
  overflowWrap: "anywhere",
};

const modalOverlay = {
  alignItems: "center",
  background: "rgba(15, 23, 42, 0.58)",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  padding: "20px",
  position: "fixed",
  zIndex: 60,
};

const modalCard = {
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.3)",
  maxHeight: "calc(100vh - 40px)",
  overflowY: "auto",
  padding: "22px",
  width: "min(920px, 100%)",
};

const modalTopo = {
  alignItems: "flex-start",
  display: "flex",
  gap: "16px",
  justifyContent: "space-between",
  marginBottom: "16px",
};

const modalTitulo = {
  color: "#111827",
  fontSize: "22px",
  margin: "4px 0 0",
};

const detalhesGrid = {
  display: "grid",
  gap: "12px",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

const jsonGrid = {
  display: "grid",
  gap: "12px",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  marginTop: "16px",
};

const jsonBox = {
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "12px",
};

const jsonTitulo = {
  color: "#111827",
  fontSize: "14px",
  margin: "0 0 8px",
};

const jsonPre = {
  color: "#334155",
  fontSize: "12px",
  margin: 0,
  maxHeight: "260px",
  overflow: "auto",
  whiteSpace: "pre-wrap",
};

export default AdminLogs;
