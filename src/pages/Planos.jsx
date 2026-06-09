import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import TableActions, { TableActionItem } from "../components/TableActions";
import PlanoModal from "../components/PlanoModal";
import {
  adicionarPlanoSupabase,
  atualizarPlanoSupabase,
  buscarPlanosSupabase,
  excluirPlanoSupabase,
} from "../services/planosService";
import { formatarMoeda } from "../data/alunosUtils";

function Planos() {
  const [planos, setPlanos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [planoEditando, setPlanoEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarPlanos();
  }, []);

  async function carregarPlanos() {
    setCarregando(true);
    setErro("");

    try {
      const planosSupabase = await buscarPlanosSupabase();
      setPlanos(planosSupabase);
    } catch (error) {
      setErro(`Erro ao carregar planos: ${error.message}`);
      setPlanos([]);
    } finally {
      setCarregando(false);
    }
  }

  const planosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return planos.filter((plano) => {
      const combinaBusca =
        plano.nome.toLowerCase().includes(termo) ||
        plano.descricao.toLowerCase().includes(termo);
      const combinaStatus =
        filtroStatus === "todos" ||
        (filtroStatus === "ativos" && plano.ativo) ||
        (filtroStatus === "inativos" && !plano.ativo);

      return combinaBusca && combinaStatus;
    });
  }, [busca, filtroStatus, planos]);

  function abrirNovoPlano() {
    setPlanoEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(plano) {
    setPlanoEditando(plano);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setPlanoEditando(null);
  }

  async function salvarPlano(plano) {
    setSalvando(true);
    setErro("");

    try {
      if (planoEditando) {
        await atualizarPlanoSupabase(planoEditando.id, plano);
      } else {
        await adicionarPlanoSupabase(plano);
      }

      await carregarPlanos();
      fecharModal();
    } catch (error) {
      setErro(`Erro ao salvar plano: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  }

  async function alternarStatus(plano) {
    setErro("");

    try {
      await atualizarPlanoSupabase(plano.id, {
        ...plano,
        ativo: !plano.ativo,
      });
      await carregarPlanos();
    } catch (error) {
      setErro(`Erro ao alterar status: ${error.message}`);
    }
  }

  async function removerPlano(id) {
    if (!window.confirm("Deseja excluir este plano?")) return;

    setErro("");

    try {
      await excluirPlanoSupabase(id);
      await carregarPlanos();
    } catch (error) {
      setErro(`Erro ao excluir plano: ${error.message}`);
    }
  }

  function limparFiltros() {
    setBusca("");
    setFiltroStatus("todos");
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={conteudo}>
        <section style={listaCard}>
          <div style={listaTopo}>
            <div>
              <h1 style={tituloPagina}>Planos</h1>
              <p style={resumoLista}>
                {planosFiltrados.length} de {planos.length} planos exibidos
              </p>
            </div>

            <button onClick={abrirNovoPlano} style={botaoPrimario}>
              + Novo Plano
            </button>
          </div>

          <div style={filtros}>
            <input
              placeholder="Buscar por plano"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={campo}
            />

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={campo}
            >
              <option value="todos">Todos os status</option>
              <option value="ativos">Ativos</option>
              <option value="inativos">Inativos</option>
            </select>

            <button onClick={limparFiltros} style={botaoSecundario}>
              Limpar
            </button>
          </div>
        </section>

        {erro && <div style={erroBox}>{erro}</div>}

        <div className="app-table-scroll">
          <table className="app-table" style={tabela}>
            <thead>
              <tr style={linhaCabecalho}>
                <th style={header}>Plano</th>
                <th style={header}>Descricao</th>
                <th style={header}>Duracao</th>
                <th style={header}>Valor</th>
                <th style={header}>Status</th>
                <th style={header}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {carregando && (
                <tr>
                  <td style={estadoVazio} colSpan="6">
                    Carregando planos...
                  </td>
                </tr>
              )}

              {!carregando &&
                planosFiltrados.map((plano) => (
                  <tr key={plano.id}>
                    <td className="cell-wide" style={celula}>{plano.nome}</td>
                    <td className="cell-wide" style={celula}>{plano.descricao || "-"}</td>
                    <td style={celula}>
                      {plano.duracaoMeses} {plano.duracaoMeses === 1 ? "mes" : "meses"}
                    </td>
                    <td style={celula}>{formatarMoeda(plano.valor)}</td>
                    <td style={celula}>
                      <span
                        className={`status-badge ${
                          plano.ativo ? "status-badge-success" : "status-badge-muted"
                        }`}
                      >
                        {plano.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td style={celula}>
                      <div className="table-actions-inline">
                        <button
                          onClick={() => abrirEdicao(plano)}
                          className="table-button table-button-primary"
                        >
                          Editar
                        </button>
                        <TableActions>
                          <TableActionItem onClick={() => alternarStatus(plano)}>
                            {plano.ativo ? "Inativar" : "Ativar"}
                          </TableActionItem>
                          <TableActionItem
                            onClick={() => removerPlano(plano.id)}
                            variant="danger"
                          >
                            Excluir
                          </TableActionItem>
                        </TableActions>
                      </div>
                    </td>
                  </tr>
                ))}

              {!carregando && planosFiltrados.length === 0 && (
                <tr>
                  <td style={estadoVazio} colSpan="6">
                    Nenhum plano encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {modalAberto && (
          <PlanoModal
            plano={planoEditando}
            salvando={salvando}
            onClose={fecharModal}
            onSave={salvarPlano}
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
  gap: "20px",
  alignItems: "end",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const tituloPagina = {
  fontSize: "30px",
  letterSpacing: 0,
};

const resumoLista = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "6px",
};

const filtros = {
  display: "grid",
  gridTemplateColumns: "minmax(220px, 1fr) minmax(170px, 220px) auto",
  gap: "10px",
  alignItems: "center",
  maxWidth: "720px",
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

const linhaCabecalho = {
  background: "#111827",
  color: "white",
};

const header = {
  padding: "12px",
  textAlign: "left",
};

const celula = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};

const estadoVazio = {
  ...celula,
  color: "#6b7280",
  textAlign: "center",
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

export default Planos;
