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
];

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
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
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main className="admin-logs-page" style={conteudo}>
        <header style={topo}>
          <div>
            <span style={eyebrow}>Administração</span>
            <h1 style={titulo}>Logs administrativos</h1>
            <p style={subtitulo}>
              Acompanhe ações sensíveis realizadas por administradores no CoachFlow.
            </p>
          </div>

          <button type="button" onClick={() => carregarLogs(filtros)} style={botaoSecundario}>
            Atualizar
          </button>
        </header>

        {erro && <div style={erroBox}>{erro}</div>}

        <section className="admin-logs-panel" style={painel}>
          <form onSubmit={aplicarFiltros} style={filtrosGrid}>
            <label style={campoGrupo}>
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

            <div style={acoesFiltro}>
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

          <div className="admin-logs-mobile-list" style={mobileList}>
            {carregando ? (
              <LoadingState texto="Carregando logs..." />
            ) : logs.length === 0 ? (
              <EmptyState
                titulo="Nenhum log administrativo encontrado."
                descricao="Ajuste os filtros ou execute uma ação administrativa para gerar registros."
              />
            ) : (
              logs.map((log) => <LogCard key={log.id} log={log} />)
            )}
          </div>

          <div className="admin-logs-table app-table-scroll" style={tabelaScroll}>
            <table className="app-table" style={tabela}>
              <thead>
                <tr style={linhaCabecalho}>
                  <th style={th}>Data</th>
                  <th style={th}>Ação</th>
                  <th style={th}>Admin</th>
                  <th style={th}>Usuário alvo</th>
                  <th style={th}>Entidade</th>
                  <th style={th}>User agent</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td style={estadoVazio} colSpan="6">
                      <LoadingState texto="Carregando logs..." />
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td style={estadoVazio} colSpan="6">
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
                        <span style={muted}>{log.targetEmail || log.targetUserId || "-"}</span>
                      </td>
                      <td style={td}>
                        <strong>{log.entidade || "-"}</strong>
                        <span style={muted}>{log.entidadeId || "-"}</span>
                      </td>
                      <td className="cell-wide" style={td}>
                        <span style={userAgent}>{log.userAgent || "-"}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function LogCard({ log }) {
  return (
    <article className="mobile-card" style={cardMobile}>
      <div style={cardTopo}>
        <span className="status-badge status-badge-info">{formatarAcao(log.acao)}</span>
        <span style={muted}>{formatarDataHora(log.createdAt)}</span>
      </div>
      <Info label="Admin" valor={log.adminNome || log.adminEmail || log.adminUserId} />
      <Info label="Usuário alvo" valor={log.targetNome || log.targetEmail || log.targetUserId || "-"} />
      <Info label="Entidade" valor={`${log.entidade || "-"} ${log.entidadeId || ""}`.trim()} />
      <Info label="User agent" valor={log.userAgent || "-"} />
    </article>
  );
}

function Info({ label, valor }) {
  return (
    <div style={infoItem}>
      <span style={labelCampo}>{label}</span>
      <strong style={infoValor}>{valor}</strong>
    </div>
  );
}

function formatarAcao(acao) {
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

const conteudo = {
  padding: "30px",
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
  padding: "18px",
};

const filtrosGrid = {
  alignItems: "end",
  display: "grid",
  gap: "12px",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
};

const campoGrupo = {
  display: "grid",
  gap: "6px",
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
  minHeight: "40px",
  padding: "9px 11px",
};

const acoesFiltro = {
  alignSelf: "end",
  display: "flex",
  gap: "8px",
  minWidth: "180px",
};

const botaoPrimario = {
  background: "#111827",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  fontWeight: "800",
  minHeight: "40px",
  padding: "9px 13px",
};

const botaoSecundario = {
  background: "#e5e7eb",
  border: "none",
  borderRadius: "8px",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "700",
  minHeight: "40px",
  padding: "9px 13px",
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
  minWidth: "920px",
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
  padding: "11px 12px",
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
  maxWidth: "260px",
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
};

const infoValor = {
  color: "#111827",
  overflowWrap: "anywhere",
};

export default AdminLogs;
