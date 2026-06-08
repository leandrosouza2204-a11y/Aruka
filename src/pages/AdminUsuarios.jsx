import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import AdminUsuarioModal from "../components/AdminUsuarioModal";
import { formatarData } from "../data/alunosUtils";
import {
  atualizarPerfilAdmin,
  bloquearUsuarioAdmin,
  liberarAssinanteAdmin,
  liberarBetaAdmin,
  listarUsuariosAdmin,
  upsertAssinaturaAdmin,
} from "../services/adminService";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);

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
      setErro(error.message || "Nao foi possivel carregar usuarios.");
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
    } catch (error) {
      setErro(error.message || "Nao foi possivel concluir a acao.");
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
    }, "Usuario atualizado com sucesso.");
  }

  function liberarComoBeta(usuario) {
    executarAcao(
      () => liberarBetaAdmin(usuario.userId),
      "Usuario liberado como beta."
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
      "Usuario liberado como assinante."
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
      "Usuario promovido a admin."
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

  function bloquearUsuario(usuario) {
    executarAcao(
      () => bloquearUsuarioAdmin(usuario.userId),
      "Usuario bloqueado."
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
      "Usuario reativado."
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

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main style={conteudo}>
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

            <div className="admin-filters" style={filtros}>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou email"
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

          <div className="admin-table-scroll" style={tabelaScroll}>
            <table style={tabela}>
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
                      Carregando usuários...
                    </td>
                  </tr>
                ) : usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td style={estadoVazio} colSpan="8">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.userId}>
                      <td style={td}>
                        <strong>{usuario.nome || "Sem nome"}</strong>
                        <span style={email}>{usuario.email}</span>
                      </td>
                      <td style={td}>{usuario.role}</td>
                      <td style={td}>{usuario.tipoAcesso}</td>
                      <td style={td}>{usuario.status}</td>
                      <td style={td}>{formatarData(usuario.createdAt?.split("T")[0])}</td>
                      <td style={td}>
                        <strong>{usuario.assinaturaStatus || "-"}</strong>
                        <span style={email}>{usuario.assinaturaPlano || "-"}</span>
                      </td>
                      <td style={td}>{formatarData(usuario.dataVencimento)}</td>
                      <td style={td}>
                        <div className="admin-actions" style={acoes}>
                          <button
                            onClick={() => setUsuarioEditando(usuario)}
                            style={botaoAcao}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => liberarComoBeta(usuario)}
                            style={botaoAcao}
                            disabled={salvando}
                          >
                            Beta
                          </button>
                          <button
                            onClick={() => liberarComoAssinante(usuario)}
                            style={botaoAcao}
                            disabled={salvando}
                          >
                            Assinante
                          </button>
                          {usuario.role === "admin" ||
                          usuario.tipoAcesso === "admin" ? (
                            <button
                              onClick={() => removerAdmin(usuario)}
                              style={botaoAcao}
                              disabled={salvando}
                            >
                              Remover admin
                            </button>
                          ) : (
                            <button
                              onClick={() => tornarAdmin(usuario)}
                              style={botaoAcao}
                              disabled={salvando}
                            >
                              Admin
                            </button>
                          )}
                          {usuario.status === "inativo" ||
                          usuario.tipoAcesso === "bloqueado" ? (
                            <button
                              onClick={() => reativarUsuario(usuario)}
                              style={botaoSucesso}
                              disabled={salvando}
                            >
                              Reativar
                            </button>
                          ) : (
                            <button
                              onClick={() => bloquearUsuario(usuario)}
                              style={botaoPerigo}
                              disabled={salvando}
                            >
                              Bloquear
                            </button>
                          )}
                          <button
                            onClick={() => cancelarAssinatura(usuario)}
                            style={botaoPerigo}
                            disabled={salvando}
                          >
                            Cancelar assinatura
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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

const conteudo = {
  padding: "30px",
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
  minWidth: "1080px",
};

const tabelaScroll = {
  overflowX: "auto",
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

const acoes = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  minWidth: "310px",
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

const botaoAcao = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "800",
  padding: "8px 10px",
};

const botaoPerigo = {
  ...botaoAcao,
  background: "#dc2626",
};

const botaoSucesso = {
  ...botaoAcao,
  background: "#16a34a",
};

export default AdminUsuarios;
