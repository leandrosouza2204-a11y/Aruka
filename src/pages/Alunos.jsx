import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  adicionarAlunoSupabase,
  atualizarAlunoSupabase,
  buscarAlunosSupabase,
  excluirAlunoSupabase,
} from "../services/alunosService";
import { buscarPlanosSupabase } from "../services/planosService";
import {
  calcularDatas,
  calcularStatus,
  corStatus,
  formatarData,
  formatarMoeda,
  normalizarAluno,
  ordenarPorVencimento,
} from "../data/alunosUtils";

const formInicial = {
  id: "",
  nome: "",
  whatsapp: "",
  nascimento: "",
  inicio: "",
  vencimento: "",
  aviso7: "",
  aviso1: "",
  plano: "",
  valor: "",
  status: "Ativo",
  pagamentoRecebido: false,
  dataPagamento: "",
  observacoes: "",
};

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [alunoEditandoId, setAlunoEditandoId] = useState("");
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPlano, setFiltroPlano] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      setErro("");

      try {
        const [alunosSupabase, planosSupabase] = await Promise.all([
          buscarAlunosSupabase(),
          buscarPlanosSupabase(),
        ]);
        setAlunos(alunosSupabase.map(normalizarAluno));
        setPlanos(planosSupabase);
      } catch (error) {
        setErro(`Erro ao buscar dados: ${error.message}`);
        setAlunos([]);
        setPlanos([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const planosAtivos = useMemo(
    () => planos.filter((plano) => plano.ativo),
    [planos]
  );

  const alunosFiltrados = useMemo(() => {
    const termoBusca = busca.trim().toLowerCase();

    return ordenarPorVencimento(
      alunos
        .map(normalizarAluno)
        .filter((aluno) => {
          const combinaNome = aluno.nome.toLowerCase().includes(termoBusca);
          const combinaStatus =
            filtroStatus === "todos" || aluno.status === filtroStatus;
          const combinaPlano =
            filtroPlano === "todos" || aluno.plano === filtroPlano;

          return combinaNome && combinaStatus && combinaPlano;
        })
    );
  }, [alunos, busca, filtroPlano, filtroStatus]);

  const alunoSelecionado = useMemo(
    () =>
      alunos
        .map(normalizarAluno)
        .find((aluno) => aluno.id === alunoSelecionadoId),
    [alunos, alunoSelecionadoId]
  );

  function handlePlano(e) {
    const planoSelecionado = e.target.value;
    const plano = planos.find((item) => item.id === planoSelecionado);

    if (!plano) {
      setForm({
        ...form,
        plano: "",
        valor: "",
        vencimento: "",
        aviso7: "",
        aviso1: "",
      });
      return;
    }

    const datas = calcularDatas(
      form.inicio,
      plano.duracaoMeses,
      planoSelecionado
    );

    setForm({
      ...form,
      plano: planoSelecionado,
      valor: plano.valor,
      ...datas,
    });
  }

  function handleInicio(e) {
    const inicio = e.target.value;

    if (!form.plano) {
      setForm({
        ...form,
        inicio,
      });
      return;
    }

    const plano = planos.find((item) => item.id === form.plano);
    const datas = calcularDatas(inicio, plano?.duracaoMeses || 1, form.plano);

    setForm({
      ...form,
      inicio,
      ...datas,
    });
  }

  function handleWhatsApp(e) {
    setForm({ ...form, whatsapp: formatarWhatsApp(e.target.value) });
  }

  function abrirCadastro() {
    setForm(formInicial);
    setAlunoEditandoId("");
    setModalCadastroAberto(true);
  }

  function abrirEdicao(aluno) {
    setForm({
      ...formInicial,
      ...normalizarAluno(aluno),
    });
    setAlunoEditandoId(aluno.id);
    setModalCadastroAberto(true);
  }

  function fecharModal() {
    setModalCadastroAberto(false);
    setForm(formInicial);
    setAlunoEditandoId("");
  }

  async function salvarAluno() {
    if (!form.nome.trim()) {
      alert("Informe o nome do aluno.");
      return;
    }

    if (!form.whatsapp.trim()) {
      alert("Informe o WhatsApp do aluno.");
      return;
    }

    if (!form.plano || !form.inicio) {
      alert("Informe o inicio e o plano do aluno.");
      return;
    }

    setSalvando(true);
    setErro("");

    const alunoNormalizado = normalizarAluno({
      ...form,
      nome: form.nome.trim(),
      whatsapp: formatarWhatsApp(form.whatsapp),
      status: calcularStatus(form.vencimento, form.plano),
    });

    try {
      const alunoSalvo = alunoEditandoId
        ? await atualizarAlunoSupabase(alunoEditandoId, alunoNormalizado)
        : await adicionarAlunoSupabase(alunoNormalizado);
      const alunoSalvoNormalizado = normalizarAluno(alunoSalvo);

      setAlunos((alunosAtuais) => {
        if (alunoEditandoId) {
          return alunosAtuais.map((aluno) =>
            aluno.id === alunoEditandoId ? alunoSalvoNormalizado : aluno
          );
        }

        return [...alunosAtuais, alunoSalvoNormalizado];
      });

      alert(
        alunoEditandoId
          ? "Aluno atualizado com sucesso!"
          : "Aluno cadastrado com sucesso!"
      );
      setAlunoSelecionadoId(alunoSalvoNormalizado.id);
      fecharModal();
    } catch (error) {
      setErro(`Erro ao salvar aluno: ${error.message}`);
      alert(`Erro ao salvar aluno: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  }

  async function excluirAluno(id) {
    if (!window.confirm("Deseja realmente excluir este aluno?")) return;

    setErro("");

    try {
      await excluirAlunoSupabase(id);

      if (alunoSelecionadoId === id) {
        setAlunoSelecionadoId("");
      }

      setAlunos((alunosAtuais) =>
        alunosAtuais.filter((aluno) => aluno.id !== id)
      );
    } catch (error) {
      setErro(`Erro ao excluir aluno: ${error.message}`);
      alert(`Erro ao excluir aluno: ${error.message}`);
    }
  }

  function limparFiltros() {
    setBusca("");
    setFiltroStatus("todos");
    setFiltroPlano("todos");
  }

  function nomePlano(plano) {
    return planos.find((item) => item.id === plano)?.nome || plano || "-";
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={conteudo}>
        <section style={listaCard}>
          <div style={listaTopo}>
            <div>
              <h1 style={tituloPagina}>Lista de Alunos</h1>
              <p style={resumoLista}>
                {alunosFiltrados.length} de {alunos.length} alunos exibidos
              </p>
            </div>

            <button onClick={abrirCadastro} style={botaoPrimario}>
              + Novo Aluno
            </button>
          </div>

          <div style={filtros}>
            <input
              placeholder="Buscar por nome"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ ...campo, ...campoFiltro }}
            />

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={{ ...campo, ...campoFiltro }}
            >
              <option value="todos">Todos os status</option>
              <option value="Ativo">Ativo</option>
              <option value="Vencendo">Vencendo</option>
              <option value="Vencendo parcela">Vencendo parcela</option>
              <option value="Atrasado">Atrasado</option>
              <option value="Parcela atrasada">Parcela atrasada</option>
            </select>

            <select
              value={filtroPlano}
              onChange={(e) => setFiltroPlano(e.target.value)}
              style={{ ...campo, ...campoFiltro }}
            >
              <option value="todos">Todos os planos</option>
              {planos.map((plano) => (
                <option key={plano.id} value={plano.id}>
                  {plano.nome}
                </option>
              ))}
            </select>

            <button onClick={limparFiltros} style={botaoSecundario}>
              Limpar
            </button>
          </div>
        </section>

        {erro && <div style={erroBox}>{erro}</div>}

        {modalCadastroAberto && (
          <div style={modalOverlay}>
            <div style={modal}>
              <div style={modalTopo}>
                <div>
                  <h2 style={detalhesTitulo}>
                    {alunoEditandoId ? "Editar Aluno" : "Cadastro Aluno"}
                  </h2>
                  <p style={resumoLista}>Preencha os dados do aluno</p>
                </div>

                <button onClick={fecharModal} style={botaoSecundario}>
                  Fechar
                </button>
              </div>

              <div style={formGrid}>
                <Campo label="Nome do aluno">
                  <input
                    placeholder="Ex: Maria Silva"
                    value={form.nome}
                    onChange={(e) =>
                      setForm({ ...form, nome: e.target.value })
                    }
                    style={campo}
                  />
                </Campo>

                <Campo label="WhatsApp">
                  <input
                    placeholder="Ex: (11) 99999-9999"
                    value={form.whatsapp}
                    onChange={handleWhatsApp}
                    style={campo}
                  />
                </Campo>

                <Campo label="Data de nascimento">
                  <input
                    type="date"
                    value={form.nascimento}
                    onChange={(e) =>
                      setForm({ ...form, nascimento: e.target.value })
                    }
                    style={campo}
                  />
                </Campo>

                <Campo label="Inicio do plano">
                  <input
                    type="date"
                    value={form.inicio}
                    onChange={handleInicio}
                    style={campo}
                  />
                </Campo>

                <Campo label="Plano contratado">
                  <select value={form.plano} onChange={handlePlano} style={campo}>
                    <option value="">Selecione o plano</option>
                    {planosAtivos.map((plano) => (
                      <option key={plano.id} value={plano.id}>
                        {plano.nome}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo label="Vencimento">
                  <input
                    readOnly
                    placeholder="Calculado pelo plano"
                    value={formatarData(form.vencimento)}
                    style={{ ...campo, background: "#f9fafb" }}
                  />
                </Campo>

                <Campo label="Valor">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Calculado pelo plano"
                    value={form.valor}
                    onChange={(e) =>
                      setForm({ ...form, valor: e.target.value })
                    }
                    style={campo}
                  />
                </Campo>

                <button onClick={salvarAluno} style={botaoPrimario} disabled={salvando}>
                  {salvando ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table style={tabela}>
            <thead>
              <tr style={linhaCabecalho}>
                <th style={tabelaHeader}>Nome</th>
                <th style={tabelaHeader}>WhatsApp</th>
                <th style={tabelaHeader}>Plano</th>
                <th style={tabelaHeader}>Valor</th>
                <th style={tabelaHeader}>Vencimento</th>
                <th style={tabelaHeader}>Status</th>
                <th style={tabelaHeader}>Acoes</th>
              </tr>
            </thead>

            <tbody>
              {!carregando &&
                alunosFiltrados.map((aluno) => (
                  <tr key={aluno.id}>
                    <td style={tabelaCelula}>{aluno.nome}</td>
                    <td style={tabelaCelula}>{aluno.whatsapp || "-"}</td>
                    <td style={tabelaCelula}>{nomePlano(aluno.plano)}</td>
                    <td style={tabelaCelula}>{formatarMoeda(aluno.valor)}</td>
                    <td style={tabelaCelula}>{formatarData(aluno.vencimento)}</td>
                    <td style={tabelaCelula}>
                      <span
                        style={{
                          color: corStatus(aluno.status),
                          fontWeight: "bold",
                        }}
                      >
                        {aluno.status}
                      </span>
                    </td>
                    <td style={tabelaCelula}>
                      <div style={acoes}>
                        <button
                          onClick={() => setAlunoSelecionadoId(aluno.id)}
                          style={botaoSecundario}
                        >
                          Detalhes
                        </button>
                        <button
                          onClick={() => abrirEdicao(aluno)}
                          style={botaoSecundario}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => excluirAluno(aluno.id)}
                          style={botaoExcluir}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {carregando && (
                <tr>
                  <td style={estadoVazio} colSpan="7">
                    Carregando alunos...
                  </td>
                </tr>
              )}

              {!carregando && alunosFiltrados.length === 0 && (
                <tr>
                  <td style={estadoVazio} colSpan="7">
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {alunoSelecionado && (
          <section style={detalhesAluno}>
            <div style={detalhesTopo}>
              <div>
                <h2 style={detalhesTitulo}>{alunoSelecionado.nome}</h2>
                <p style={resumoLista}>Informacoes completas do cadastro</p>
              </div>

              <button
                onClick={() => setAlunoSelecionadoId("")}
                style={botaoSecundario}
              >
                Fechar
              </button>
            </div>

            <div style={detalhesGrid}>
              <Info label="WhatsApp" valor={alunoSelecionado.whatsapp} />
              <Info
                label="Nascimento"
                valor={formatarData(alunoSelecionado.nascimento)}
              />
              <Info
                label="Inicio"
                valor={formatarData(alunoSelecionado.inicio)}
              />
              <Info label="Plano" valor={nomePlano(alunoSelecionado.plano)} />
              <Info label="Valor" valor={formatarMoeda(alunoSelecionado.valor)} />
              <Info
                label="Vencimento"
                valor={formatarData(alunoSelecionado.vencimento)}
              />
              <Info
                label="Aviso 7 dias"
                valor={formatarData(alunoSelecionado.aviso7)}
              />
              <Info
                label="Aviso 1 dia"
                valor={formatarData(alunoSelecionado.aviso1)}
              />
              <Info label="Status" valor={alunoSelecionado.status} />
              <Info
                label="Pagamento recebido"
                valor={alunoSelecionado.pagamentoRecebido ? "Sim" : "Nao"}
              />
              <Info
                label="Data do pagamento"
                valor={formatarData(alunoSelecionado.dataPagamento)}
              />
              <Info
                label="Observacoes"
                valor={alunoSelecionado.observacoes || "-"}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <label style={campoGrupo}>
      <span style={labelCampo}>{label}</span>
      {children}
    </label>
  );
}

function formatarWhatsApp(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  if (!numeros) return "";
  if (numeros.length <= 2) return `(${numeros}`;

  const ddd = numeros.slice(0, 2);
  const numero = numeros.slice(2);

  if (numero.length <= 5) {
    return `(${ddd}) ${numero}`;
  }

  return `(${ddd}) ${numero.slice(0, 5)}-${numero.slice(5)}`;
}

function Info({ label, valor }) {
  return (
    <div style={infoItem}>
      <span style={infoLabel}>{label}</span>
      <strong style={infoValor}>{valor || "-"}</strong>
    </div>
  );
}

const formGrid = {
  display: "grid",
  gap: "14px",
  maxWidth: "620px",
  marginTop: "20px",
};

const conteudo = {
  padding: "30px",
  marginLeft: "260px",
  width: "calc(100% - 260px)",
};

const tituloPagina = {
  fontSize: "30px",
  letterSpacing: 0,
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

const resumoLista = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "6px",
};

const filtros = {
  display: "grid",
  gridTemplateColumns:
    "minmax(220px, 1fr) minmax(170px, 220px) minmax(170px, 220px) auto",
  gap: "10px",
  alignItems: "center",
  width: "100%",
  maxWidth: "820px",
};

const campoFiltro = {
  minWidth: 0,
};

const campoGrupo = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const labelCampo = {
  color: "#374151",
  fontSize: "13px",
  fontWeight: "700",
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

const tabelaHeader = {
  padding: "12px",
  textAlign: "left",
  fontSize: "13px",
};

const tabelaCelula = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
};

const estadoVazio = {
  ...tabelaCelula,
  color: "#6b7280",
  textAlign: "center",
};

const acoes = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
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

const botaoExcluir = {
  background: "#dc2626",
  color: "white",
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

const modalOverlay = {
  position: "fixed",
  inset: 0,
  zIndex: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  background: "rgba(17, 24, 39, 0.55)",
};

const modal = {
  width: "min(680px, 100%)",
  maxHeight: "calc(100vh - 48px)",
  overflowY: "auto",
  background: "white",
  borderRadius: "8px",
  padding: "24px",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)",
};

const modalTopo = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "16px",
};

const detalhesAluno = {
  marginTop: "24px",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "20px",
};

const detalhesTopo = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "18px",
};

const detalhesTitulo = {
  margin: 0,
  fontSize: "20px",
};

const detalhesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
};

const infoItem = {
  border: "1px solid #eef2f7",
  borderRadius: "8px",
  padding: "12px",
  background: "#f9fafb",
};

const infoLabel = {
  display: "block",
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "700",
  marginBottom: "4px",
  textTransform: "uppercase",
};

const infoValor = {
  color: "#111827",
  fontSize: "14px",
};

export default Alunos;
