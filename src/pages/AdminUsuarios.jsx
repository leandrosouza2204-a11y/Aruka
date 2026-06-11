import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import AdminUsuarioModal from "../components/AdminUsuarioModal";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import TableActions, { TableActionItem } from "../components/TableActions";
import { useConfirm } from "../hooks/useConfirm";
import { formatarData } from "../data/alunosUtils";
import {
  atualizarPerfilAdmin,
  bloquearUsuarioAdmin,
  liberarAssinanteAdmin,
  liberarBetaAdmin,
  listarUsuariosAdmin,
  transferirAcessoAdmin,
  upsertAssinaturaAdmin,
} from "../services/adminService";
import { useToast } from "../hooks/useToast";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioTransferindo, setUsuarioTransferindo] = useState(null);
  const toast = useToast();
  const { confirmar } = useConfirm();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    setCarregando(true);
    setErro("");

    try {
      const lista = await listarUsuariosAdmin();
      setUsuarios(lista);
    } catch (error) {
      setErro(error.message || "Não foi possível carregar usuários.");
      setUsuarios([]);
    } finally {
      setCarregando(false);
    }
  }

  const resumo = useMemo(() => {
    return {
      total: usuarios.length,
      pendentes: usuarios.filter((usuario) => usuario.tipoAcesso === "pendente")
        .length,
      betas: usuarios.filter((usuario) => usuario.tipoAcesso === "beta").length,
      assinantes: usuarios.filter(
        (usuario) =>
          usuario.tipoAcesso === "assinante" &&
          usuario.assinaturaStatus === "ativo"
      ).length,
      bloqueados: usuarios.filter(
        (usuario) =>
          usuario.tipoAcesso === "bloqueado" || usuario.status === "inativo"
      ).length,
    };
  }, [usuarios]);

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const combinaBusca =
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo);
      const combinaFiltro =
        filtro === "todos" ||
        (filtro === "pendentes" && usuario.tipoAcesso === "pendente") ||
        (filtro === "beta" && usuario.tipoAcesso === "beta") ||
        (filtro === "assinantes" && usuario.tipoAcesso === "assinante") ||
        (filtro === "bloqueados" &&
          (usuario.tipoAcesso === "bloqueado" || usuario.status === "inativo")) ||
        (filtro === "admins" &&
          (usuario.role === "admin" || usuario.tipoAcesso === "admin"));

      return combinaBusca && combinaFiltro;
    });
  }, [busca, filtro, usuarios]);

  async function executarAcao(acao, mensagemSucesso) {
    setErro("");
    setMensagem("");
    setSalvando(true);

    try {
      await acao();
      await carregarUsuarios();
      setMensagem(mensagemSucesso);
      toast.sucesso("Ação concluída", mensagemSucesso);
    } catch (error) {
      console.error(error);
      setErro(error.message || "Não foi possível concluir a ação.");
      toast.erro("Não foi possível concluir a ação", "Tente novamente em alguns instantes.");
    } finally {
      setSalvando(false);
    }
  }

  async function salvarEdicao(dados) {
    if (!usuarioEditando) return;

    await executarAcao(async () => {
      await atualizarPerfilAdmin(usuarioEditando.userId, {
        nome: dados.nome,
        role: dados.role,
        tipoAcesso: dados.tipoAcesso,
        status: dados.status,
      });

      await upsertAssinaturaAdmin(usuarioEditando.userId, dados.assinatura);
      setUsuarioEditando(null);
    }, "Usuário atualizado com sucesso.");
  }

  function liberarComoBeta(usuario) {
    executarAcao(
      () => liberarBetaAdmin(usuario.userId),
      "Usuário liberado como beta."
    );
  }

  function liberarComoAssinante(usuario) {
    const hoje = new Date();
    const vencimento = new Date(hoje);
    vencimento.setMonth(vencimento.getMonth() + 1);

    executarAcao(
      () =>
        liberarAssinanteAdmin(
          usuario.userId,
          usuario.assinaturaPlano || "Mensal",
          hoje.toISOString().split("T")[0],
          vencimento.toISOString().split("T")[0]
        ),
      "Usuário liberado como assinante."
    );
  }

  function tornarAdmin(usuario) {
    executarAcao(
      () =>
        atualizarPerfilAdmin(usuario.userId, {
          nome: usuario.nome,
          role: "admin",
          tipoAcesso: "admin",
          status: "ativo",
        }),
      "Usuário promovido a admin."
    );
  }

  function removerAdmin(usuario) {
    executarAcao(
      () =>
        atualizarPerfilAdmin(usuario.userId, {
          nome: usuario.nome,
          role: "user",
          tipoAcesso: "pendente",
          status: "ativo",
        }),
      "Permissao de admin removida."
    );
  }

  async function bloquearUsuario(usuario) {
    const confirmado = await confirmar({
      titulo: "Bloquear usuário?",
      descricao: "O usuário perderá o acesso ao sistema até ser reativado.",
      textoConfirmar: "Bloquear",
    });

    if (!confirmado) return;

    executarAcao(
      () => bloquearUsuarioAdmin(usuario.userId),
      "Usuário bloqueado."
    );
  }

  function reativarUsuario(usuario) {
    executarAcao(
      () =>
        atualizarPerfilAdmin(usuario.userId, {
          nome: usuario.nome,
          role: usuario.role,
          tipoAcesso: usuario.tipoAcesso === "bloqueado" ? "pendente" : usuario.tipoAcesso,
          status: "ativo",
        }),
      "Usuário reativado."
    );
  }

  function cancelarAssinatura(usuario) {
    executarAcao(
      () =>
        upsertAssinaturaAdmin(usuario.userId, {
          plano: usuario.assinaturaPlano || "pendente",
          status: "cancelado",
          dataInicio: usuario.dataInicio || null,
          dataVencimento: usuario.dataVencimento || null,
        }),
      "Assinatura cancelada."
    );
  }

  function limparFiltros() {
    setBusca("");
    setFiltro("todos");
  }

  async function transferirAcesso({ novoEmail }) {
    if (!usuarioTransferindo) return;

    await executarAcao(async () => {
      await transferirAcessoAdmin(usuarioTransferindo.userId, novoEmail);
      setUsuarioTransferindo(null);
    }, "Acesso transferido com sucesso. O usuário deverá acessar usando o novo e-mail.");
  }

  return (
    <div className="app-shell" style={{ display: "flex" }}>
      <Sidebar />

      <main className="app-main page-container" style={conteudo}>
        <div style={topo}>
          <div>
            <h1>Administração de Usuários</h1>
            <p style={subtitulo}>
              Gerencie perfis, liberações beta, assinaturas e bloqueios.
            </p>
          </div>

          <button onClick={carregarUsuarios} style={botaoSecundario}>
            Atualizar lista
          </button>
        </div>

        <div className="admin-summary-grid" style={cards}>
          <CardResumo titulo="Total de usuários" valor={resumo.total} />
          <CardResumo titulo="Pendentes" valor={resumo.pendentes} destaque="#f59e0b" />
          <CardResumo titulo="Betas" valor={resumo.betas} destaque="#2563eb" />
          <CardResumo
            titulo="Assinantes ativos"
            valor={resumo.assinantes}
            destaque="#16a34a"
          />
          <CardResumo titulo="Bloqueados" valor={resumo.bloqueados} destaque="#dc2626" />
        </div>

        {erro && <div style={erroBox}>{erro}</div>}
        {mensagem && <div style={sucessoBox}>{mensagem}</div>}

        <section style={painel}>
          <div style={listaTopo}>
            <div>
              <h2>Usuários cadastrados</h2>
              <p style={subtituloLista}>
                {usuariosFiltrados.length} de {usuarios.length} usuários exibidos
              </p>
            </div>

            <div className="app-filter-grid admin-filters" style={filtros}>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou e-mail"
                style={campoFiltro}
              />

              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                style={campoFiltro}
              >
                <option value="todos">Todos</option>
                <option value="pendentes">Pendentes</option>
                <option value="beta">Beta</option>
                <option value="assinantes">Assinantes</option>
                <option value="bloqueados">Bloqueados</option>
                <option value="admins">Admins</option>
              </select>

              <button onClick={limparFiltros} style={botaoSecundario}>
                Limpar
              </button>
            </div>
          </div>

          <div className="admin-table-scroll app-table-scroll desktop-table" style={tabelaScroll}>
            <table className="app-table" style={tabela}>
              <thead>
                <tr style={linhaCabecalho}>
                  <th style={th}>Usuário</th>
                  <th style={th}>Role</th>
                  <th style={th}>Acesso</th>
                  <th style={th}>Status</th>
                  <th style={th}>Criado em</th>
                  <th style={th}>Assinatura</th>
                  <th style={th}>Vencimento</th>
                  <th style={th}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {carregando ? (
                  <tr>
                    <td style={estadoVazio} colSpan="8">
                      <LoadingState texto="Carregando usuários..." />
                    </td>
                  </tr>
                ) : usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td style={estadoVazio} colSpan="8">
                      <EmptyState
                        titulo="Nenhum usuário encontrado."
                        descricao="Ajuste a busca ou o filtro para localizar usuários cadastrados."
                      />
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.userId}>
                      <td className="cell-wide" style={td}>
                        <strong>{usuario.nome || "Sem nome"}</strong>
                        <span style={email}>{usuario.email}</span>
                      </td>
                      <td style={td}>
                        <span className={classeBadgeAcesso(usuario.role)}>
                          {usuario.role}
                        </span>
                      </td>
                      <td style={td}>
                        <span className={classeBadgeAcesso(usuario.tipoAcesso)}>
                          {usuario.tipoAcesso}
                        </span>
                      </td>
                      <td style={td}>
                        <span className={classeBadgeStatus(usuario.status)}>
                          {usuario.status}
                        </span>
                      </td>
                      <td style={td}>{formatarData(usuario.createdAt?.split("T")[0])}</td>
                      <td style={td}>
                        <strong>{usuario.assinaturaStatus || "-"}</strong>
                        <span style={email}>{usuario.assinaturaPlano || "-"}</span>
                      </td>
                      <td style={td}>{formatarData(usuario.dataVencimento)}</td>
                      <td style={td}>
                        <div className="table-actions-inline">
                          <button
                            onClick={() => setUsuarioEditando(usuario)}
                            className="table-button table-button-primary"
                          >
                            Editar
                          </button>
                          <TableActions>
                            <TableActionItem
                              onClick={() => liberarComoBeta(usuario)}
                              disabled={salvando}
                              variant="primary"
                            >
                              Beta
                            </TableActionItem>
                            <TableActionItem
                              onClick={() => liberarComoAssinante(usuario)}
                              disabled={salvando}
                              variant="primary"
                            >
                              Assinante
                            </TableActionItem>
                            {usuario.role === "admin" ||
                            usuario.tipoAcesso === "admin" ? (
                              <TableActionItem
                                onClick={() => removerAdmin(usuario)}
                                disabled={salvando}
                              >
                                Remover admin
                              </TableActionItem>
                            ) : (
                              <TableActionItem
                                onClick={() => tornarAdmin(usuario)}
                                disabled={salvando}
                                variant="primary"
                              >
                                Admin
                              </TableActionItem>
                            )}
                            {usuario.status === "inativo" ||
                            usuario.tipoAcesso === "bloqueado" ? (
                              <TableActionItem
                                onClick={() => reativarUsuario(usuario)}
                                disabled={salvando}
                                variant="success"
                              >
                                Reativar
                              </TableActionItem>
                            ) : (
                              <TableActionItem
                                onClick={() => bloquearUsuario(usuario)}
                                disabled={salvando}
                                variant="danger"
                              >
                                Bloquear
                              </TableActionItem>
                            )}
                            <TableActionItem
                              onClick={() => cancelarAssinatura(usuario)}
                              disabled={salvando}
                              variant="danger"
                            >
                              Cancelar assinatura
                            </TableActionItem>
                            <TableActionItem
                              onClick={() => setUsuarioTransferindo(usuario)}
                              disabled={salvando}
                            >
                              Transferir acesso
                            </TableActionItem>
                          </TableActions>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mobile-card-list admin-users-mobile-list">
            {carregando ? (
              <div className="mobile-list-card">
                <LoadingState texto="Carregando usuários..." />
              </div>
            ) : usuariosFiltrados.length === 0 ? (
              <div className="mobile-list-card">
                <EmptyState
                  titulo="Nenhum usuário encontrado."
                  descricao="Ajuste a busca ou o filtro para localizar usuários cadastrados."
                />
              </div>
            ) : (
              usuariosFiltrados.map((usuario) => (
                <UsuarioCard
                  key={usuario.userId}
                  salvando={salvando}
                  usuario={usuario}
                  onAssinante={liberarComoAssinante}
                  onBeta={liberarComoBeta}
                  onBloquear={bloquearUsuario}
                  onCancelarAssinatura={cancelarAssinatura}
                  onEditar={setUsuarioEditando}
                  onReativar={reativarUsuario}
                  onRemoverAdmin={removerAdmin}
                  onTornarAdmin={tornarAdmin}
                  onTransferir={setUsuarioTransferindo}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {usuarioEditando && (
        <AdminUsuarioModal
          usuario={usuarioEditando}
          onClose={() => setUsuarioEditando(null)}
          onSave={salvarEdicao}
          salvando={salvando}
        />
      )}

      {usuarioTransferindo && (
        <TransferirAcessoModal
          usuario={usuarioTransferindo}
          onClose={() => setUsuarioTransferindo(null)}
          onSave={transferirAcesso}
          salvando={salvando}
        />
      )}
    </div>
  );
}

function UsuarioCard({
  salvando,
  usuario,
  onAssinante,
  onBeta,
  onBloquear,
  onCancelarAssinatura,
  onEditar,
  onReativar,
  onRemoverAdmin,
  onTornarAdmin,
  onTransferir,
}) {
  const admin = usuario.role === "admin" || usuario.tipoAcesso === "admin";
  const bloqueado = usuario.status === "inativo" || usuario.tipoAcesso === "bloqueado";

  return (
    <article className="mobile-list-card admin-user-card">
      <div className="mobile-card-header">
        <div>
          <span className="card-label">Nome</span>
          <strong className="card-value card-title">{usuario.nome || "Sem nome"}</strong>
        </div>
        <span className={classeBadgeStatus(usuario.status)}>{usuario.status}</span>
      </div>

      <div className="card-row card-row-block">
        <span className="card-label">E-mail</span>
        <strong className="card-value card-break">{usuario.email || "-"}</strong>
      </div>
      <div className="card-row">
        <span className="card-label">Role</span>
        <span className={classeBadgeAcesso(usuario.role)}>{usuario.role}</span>
      </div>
      <div className="card-row">
        <span className="card-label">Acesso</span>
        <span className={classeBadgeAcesso(usuario.tipoAcesso)}>
          {usuario.tipoAcesso}
        </span>
      </div>
      <div className="card-row">
        <span className="card-label">Assinatura</span>
        <strong className="card-value">
          {usuario.assinaturaStatus || "-"} / {usuario.assinaturaPlano || "-"}
        </strong>
      </div>

      <div className="card-actions">
        <button
          type="button"
          onClick={() => onEditar(usuario)}
          className="table-button table-button-primary"
        >
          Editar
        </button>
        <TableActions label="Ações administrativas">
          <TableActionItem onClick={() => onBeta(usuario)} disabled={salvando} variant="primary">
            Beta
          </TableActionItem>
          <TableActionItem
            onClick={() => onAssinante(usuario)}
            disabled={salvando}
            variant="primary"
          >
            Assinante
          </TableActionItem>
          {admin ? (
            <TableActionItem onClick={() => onRemoverAdmin(usuario)} disabled={salvando}>
              Remover admin
            </TableActionItem>
          ) : (
            <TableActionItem
              onClick={() => onTornarAdmin(usuario)}
              disabled={salvando}
              variant="primary"
            >
              Admin
            </TableActionItem>
          )}
          {bloqueado ? (
            <TableActionItem
              onClick={() => onReativar(usuario)}
              disabled={salvando}
              variant="success"
            >
              Reativar
            </TableActionItem>
          ) : (
            <TableActionItem
              onClick={() => onBloquear(usuario)}
              disabled={salvando}
              variant="danger"
            >
              Bloquear
            </TableActionItem>
          )}
          <TableActionItem
            onClick={() => onCancelarAssinatura(usuario)}
            disabled={salvando}
            variant="danger"
          >
            Cancelar assinatura
          </TableActionItem>
          <TableActionItem onClick={() => onTransferir(usuario)} disabled={salvando}>
            Transferir acesso
          </TableActionItem>
        </TableActions>
      </div>
    </article>
  );
}

function TransferirAcessoModal({ usuario, onClose, onSave, salvando }) {
  const [novoEmail, setNovoEmail] = useState("");
  const [identidadeValidada, setIdentidadeValidada] = useState(false);
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState("");

  async function enviar(event) {
    event.preventDefault();
    setErro("");

    const emailNormalizado = novoEmail.trim().toLowerCase();
    const emailAtual = String(usuario.email || "").trim().toLowerCase();

    if (!emailNormalizado) {
      setErro("Informe o novo e-mail.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
      setErro("Informe um e-mail válido.");
      return;
    }

    if (emailNormalizado === emailAtual) {
      setErro("O novo e-mail precisa ser diferente do e-mail atual.");
      return;
    }

    if (!identidadeValidada) {
      setErro("Confirme que a identidade do usuário foi validada.");
      return;
    }

    if (confirmacao !== "TRANSFERIR") {
      setErro("Digite TRANSFERIR para confirmar a operação.");
      return;
    }

    await onSave({ novoEmail: emailNormalizado });
  }

  return (
    <div style={modalOverlay}>
      <form onSubmit={enviar} style={modalTransferencia}>
        <div style={modalTopo}>
          <div>
            <h2 style={modalTitulo}>Transferir acesso da conta</h2>
            <p style={modalTexto}>
              Altere o e-mail de login mantendo o mesmo user_id e todos os dados vinculados.
            </p>
          </div>
          <button type="button" onClick={onClose} style={botaoSecundario}>
            Cancelar
          </button>
        </div>

        <div style={resumoTransferencia}>
          <InfoTransferencia label="Nome do usuário" valor={usuario.nome || "Sem nome"} />
          <InfoTransferencia label="E-mail atual" valor={usuario.email} />
          <InfoTransferencia label="User ID" valor={usuario.userId} />
        </div>

        <label style={campoTransferencia}>
          <span style={labelTransferencia}>Novo e-mail</span>
          <input
            type="email"
            value={novoEmail}
            onChange={(event) => setNovoEmail(event.target.value)}
            placeholder="novo@email.com"
            style={inputTransferencia}
            disabled={salvando}
          />
        </label>

        <label style={checkboxLinha}>
          <input
            type="checkbox"
            checked={identidadeValidada}
            onChange={(event) => setIdentidadeValidada(event.target.checked)}
            disabled={salvando}
          />
          <span>
            Confirmo que validei a identidade do usuário antes de transferir o acesso.
          </span>
        </label>

        <label style={campoTransferencia}>
          <span style={labelTransferencia}>Digite TRANSFERIR para confirmar.</span>
          <input
            value={confirmacao}
            onChange={(event) => setConfirmacao(event.target.value)}
            style={inputTransferencia}
            disabled={salvando}
          />
        </label>

        {erro && <div style={erroBox}>{erro}</div>}

        <div style={modalAcoes}>
          <button type="button" onClick={onClose} style={botaoSecundario} disabled={salvando}>
            Cancelar
          </button>
          <button type="submit" style={botaoPerigo} disabled={salvando}>
            {salvando ? "Transferindo..." : "Transferir acesso"}
          </button>
        </div>
      </form>
    </div>
  );
}

function InfoTransferencia({ label, valor }) {
  return (
    <div style={infoTransferencia}>
      <span style={labelTransferencia}>{label}</span>
      <strong style={valorTransferencia}>{valor || "-"}</strong>
    </div>
  );
}

function CardResumo({ titulo, valor, destaque = "#111827" }) {
  return (
    <div style={card}>
      <span style={cardTitulo}>{titulo}</span>
      <strong style={{ ...cardValor, color: destaque }}>{valor}</strong>
    </div>
  );
}

function classeBadgeAcesso(valor) {
  if (valor === "admin") return "status-badge status-badge-info";
  if (valor === "assinante" || valor === "beta") {
    return "status-badge status-badge-success";
  }
  if (valor === "pendente") return "status-badge status-badge-warning";
  if (valor === "bloqueado") return "status-badge status-badge-danger";

  return "status-badge status-badge-muted";
}

function classeBadgeStatus(status) {
  if (status === "ativo") return "status-badge status-badge-success";
  if (status === "inativo") return "status-badge status-badge-danger";

  return "status-badge status-badge-muted";
}

const conteudo = {
  padding: "24px",
  marginLeft: "260px",
  width: "calc(100% - 260px)",
};

const topo = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const subtitulo = {
  color: "#6b7280",
  marginTop: "6px",
};

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
  marginTop: "24px",
};

const card = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "18px",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
};

const cardTitulo = {
  color: "#4b5563",
  fontSize: "13px",
  fontWeight: "800",
};

const cardValor = {
  display: "block",
  fontSize: "30px",
  marginTop: "10px",
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

const sucessoBox = {
  background: "#ecfdf5",
  border: "1px solid #bbf7d0",
  borderRadius: "8px",
  color: "#166534",
  fontWeight: "700",
  marginTop: "16px",
  padding: "12px",
};

const painel = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  marginTop: "24px",
  padding: "20px",
};

const listaTopo = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "flex-end",
  flexWrap: "wrap",
};

const subtituloLista = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "5px",
};

const filtros = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const campoFiltro = {
  minHeight: "40px",
  minWidth: "190px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "8px 10px",
};

const tabela = {
  width: "100%",
  borderCollapse: "collapse",
};

const tabelaScroll = {
  overflowX: "visible",
  marginTop: "18px",
  WebkitOverflowScrolling: "touch",
};

const linhaCabecalho = {
  background: "#111827",
  color: "white",
};

const th = {
  padding: "12px",
  textAlign: "left",
  fontSize: "13px",
};

const td = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px",
  verticalAlign: "top",
};

const email = {
  color: "#6b7280",
  display: "block",
  fontSize: "12px",
  marginTop: "4px",
};

const estadoVazio = {
  ...td,
  color: "#6b7280",
  textAlign: "center",
};

const botaoSecundario = {
  background: "#e5e7eb",
  color: "#111827",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  padding: "10px 14px",
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

const modalTransferencia = {
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.3)",
  display: "grid",
  gap: "16px",
  maxHeight: "calc(100vh - 40px)",
  overflowY: "auto",
  padding: "22px",
  width: "min(620px, 100%)",
};

const modalTopo = {
  alignItems: "flex-start",
  display: "flex",
  gap: "16px",
  justifyContent: "space-between",
};

const modalTitulo = {
  color: "#111827",
  fontSize: "22px",
  margin: 0,
};

const modalTexto = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: 1.45,
  marginTop: "6px",
};

const resumoTransferencia = {
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  display: "grid",
  gap: "10px",
  padding: "14px",
};

const infoTransferencia = {
  display: "grid",
  gap: "3px",
};

const labelTransferencia = {
  color: "#374151",
  fontSize: "12px",
  fontWeight: "800",
};

const valorTransferencia = {
  color: "#111827",
  fontSize: "14px",
  overflowWrap: "anywhere",
};

const campoTransferencia = {
  display: "grid",
  gap: "7px",
};

const inputTransferencia = {
  background: "white",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  color: "#111827",
  minHeight: "42px",
  padding: "9px 11px",
};

const checkboxLinha = {
  alignItems: "flex-start",
  color: "#374151",
  display: "flex",
  fontSize: "14px",
  fontWeight: "700",
  gap: "10px",
  lineHeight: 1.4,
};

const modalAcoes = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  justifyContent: "flex-end",
};

const botaoPerigo = {
  background: "#dc2626",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  fontWeight: "800",
  padding: "10px 14px",
};

export default AdminUsuarios;
