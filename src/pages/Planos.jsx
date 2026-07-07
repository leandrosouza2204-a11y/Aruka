import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import TableActions, { TableActionItem } from "../components/TableActions";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import PageHero from "../components/PageHero";
import { useConfirm } from "../hooks/useConfirm";
import { useToast } from "../hooks/useToast";
import {
  adicionarPlanoSupabase,
  atualizarPlanoSupabase,
  buscarPlanosSupabase,
  excluirPlanoSupabase,
} from "../services/planosService";
import { formatarMoeda } from "../data/alunosUtils";

const PlanoModal = lazy(() => import("../components/PlanoModal"));

function Planos() {
  const [planos, setPlanos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [planoEditando, setPlanoEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const toast = useToast();
  const { confirmar } = useConfirm();

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
      toast.sucesso("Plano salvo", "As informações do plano foram atualizadas.");
      fecharModal();
    } catch (error) {
      console.error(error);
      setErro(`Erro ao salvar plano: ${error.message}`);
      toast.erro("Não foi possível salvar o plano", "Tente novamente em alguns instantes.");
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
      toast.sucesso("Status atualizado", "O status do plano foi alterado.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao alterar status: ${error.message}`);
      toast.erro("Não foi possível alterar o status", "Tente novamente em alguns instantes.");
    }
  }

  async function removerPlano(id) {
    const confirmado = await confirmar({
      titulo: "Excluir plano?",
      descricao: "Esta ação remove o plano selecionado. Deseja continuar?",
      textoConfirmar: "Excluir",
    });

    if (!confirmado) return;

    setErro("");

    try {
      await excluirPlanoSupabase(id);
      await carregarPlanos();
      toast.sucesso("Plano excluído", "O plano foi removido com sucesso.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao excluir plano: ${error.message}`);
      toast.erro("Não foi possível excluir o plano", "Tente novamente em alguns instantes.");
    }
  }

  function limparFiltros() {
    setBusca("");
    setFiltroStatus("todos");
  }

  return (
    <div className="app-shell" style={{ display: "flex" }}>
      <Sidebar />

      <div className="planos-page app-main page-container" style={conteudo}>
        <PageHero
          eyebrow="PLANOS"
          title="Planos personalizados"
          description="Cadastre e gerencie planos, valores e parcelamentos da sua consultoria."
          meta={`${planosFiltrados.length} de ${planos.length} planos exibidos`}
          actions={
            <button onClick={abrirNovoPlano} style={botaoPrimario}>
              + Novo Plano
            </button>
          }
        />

        <section className="app-card" style={listaCard}>
          <div className="app-filter-grid planos-filtros" style={filtros}>
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

        {erro && <div className="app-error">{erro}</div>}

        <div className="app-table-scroll desktop-table planos-table">
          <table className="app-table" style={tabela}>
            <thead>
              <tr style={linhaCabecalho}>
                <th style={header}>Plano</th>
                <th style={header}>Descrição</th>
                <th style={header}>Duração</th>
                <th style={header}>Valor</th>
                <th style={header}>Parcelamento</th>
                <th style={header}>Status</th>
                <th style={header}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando && (
                <tr>
                  <td style={estadoVazio} colSpan="7">
                    <LoadingState texto="Carregando planos..." />
                  </td>
                </tr>
              )}

              {!carregando &&
                planosFiltrados.map((plano) => (
                  <tr key={plano.id}>
                    <td className="cell-wide" style={celula}>{plano.nome}</td>
                    <td className="cell-wide" style={celula}>{plano.descricao || "-"}</td>
                    <td style={celula}>
                      {plano.duracaoMeses} {plano.duracaoMeses === 1 ? "mês" : "meses"}
                    </td>
                    <td style={celula}>{formatarMoeda(plano.valor)}</td>
                    <td style={celula}>{formatarParcelamento(plano)}</td>
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
                  <td style={estadoVazio} colSpan="7">
                    <EmptyState
                      titulo="Nenhum plano criado."
                      descricao="Crie planos para padronizar duração, valor e disponibilidade."
                      acaoLabel="Novo plano"
                      onAcao={() => setModalAberto(true)}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mobile-card-list planos-mobile-cards">
          {carregando ? (
            <div className="mobile-list-card">
              <LoadingState texto="Carregando planos..." />
            </div>
          ) : planosFiltrados.length === 0 ? (
            <div className="mobile-list-card">
              <EmptyState
                titulo="Nenhum plano criado."
                descricao="Crie planos para padronizar duração, valor e disponibilidade."
                acaoLabel="Novo plano"
                onAcao={() => setModalAberto(true)}
              />
            </div>
          ) : (
            planosFiltrados.map((plano) => (
              <PlanoCard
                key={plano.id}
                plano={plano}
                onEditar={abrirEdicao}
                onAlternarStatus={alternarStatus}
                onExcluir={removerPlano}
              />
            ))
          )}
        </div>

        {modalAberto && (
          <Suspense fallback={null}>
            <PlanoModal
              plano={planoEditando}
              salvando={salvando}
              onClose={fecharModal}
              onSave={salvarPlano}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}

function PlanoCard({ plano, onEditar, onAlternarStatus, onExcluir }) {
  return (
    <article className="mobile-list-card plano-mobile-card">
      <div className="mobile-card-header">
        <div>
          <span className="card-label">Nome do plano</span>
          <strong className="card-value card-title">{plano.nome || "-"}</strong>
        </div>
        <span
          className={`status-badge ${
            plano.ativo ? "status-badge-success" : "status-badge-muted"
          }`}
        >
          {plano.ativo ? "Ativo" : "Inativo"}
        </span>
      </div>

      <div className="card-row card-row-block">
        <span className="card-label">Descrição</span>
        <strong className="card-value">{plano.descricao || "-"}</strong>
      </div>
      <div className="card-row">
        <span className="card-label">Duração</span>
        <strong className="card-value">
          {plano.duracaoMeses} {plano.duracaoMeses === 1 ? "mês" : "meses"}
        </strong>
      </div>
      <div className="card-row">
        <span className="card-label">Valor</span>
        <strong className="card-value card-money">{formatarMoeda(plano.valor)}</strong>
      </div>
      <div className="card-row">
        <span className="card-label">Parcelamento</span>
        <strong className="card-value">{formatarParcelamento(plano)}</strong>
      </div>

      <div className="card-actions">
        <button
          type="button"
          onClick={() => onEditar(plano)}
          className="table-button table-button-primary"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onAlternarStatus(plano)}
          className="table-button table-button-secondary"
        >
          {plano.ativo ? "Inativar" : "Ativar"}
        </button>
        <button
          type="button"
          onClick={() => onExcluir(plano.id)}
          className="table-button table-button-danger"
        >
          Excluir
        </button>
      </div>
    </article>
  );
}

function formatarParcelamento(plano) {
  if (!plano.permiteParcelamento) return "Não permitido";

  return `${plano.quantidadeParcelas}x de ${formatarMoeda(plano.valorParcela)} (${plano.intervaloParcelasMeses} mês${plano.intervaloParcelasMeses === 1 ? "" : "es"})`;
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

export default Planos;
