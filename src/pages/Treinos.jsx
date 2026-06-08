import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import TreinoModal from "../components/TreinoModal";
import ExercicioCard from "../components/ExercicioCard";
import { buscarAlunosSupabase } from "../services/alunosService";
import {
  adicionarTreinoSupabase,
  atualizarTreinoSupabase,
  buscarTreinosSupabase,
  excluirTreinoSupabase,
} from "../services/treinosService";
import { abrirWhatsApp } from "../services/whatsappService";

function Treinos() {
  const [treinos, setTreinos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [treinoEditando, setTreinoEditando] = useState(null);
  const [treinoBase, setTreinoBase] = useState(null);
  const [treinoSelecionadoId, setTreinoSelecionadoId] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroAluno, setFiltroAluno] = useState("todos");
  const [filtroObjetivo, setFiltroObjetivo] = useState("todos");
  const [filtroNivel, setFiltroNivel] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarInicial() {
      setCarregando(true);
      setErro("");

      try {
        const [alunosSupabase, treinosSupabase] = await Promise.all([
          buscarAlunosSupabase(),
          buscarTreinosSupabase(),
        ]);

        setAlunos(alunosSupabase);
        setTreinos(treinosSupabase);
      } catch (error) {
        setErro(error.message || "Nao foi possivel carregar os treinos.");
      } finally {
        setCarregando(false);
      }
    }

    carregarInicial();
  }, []);

  const opcoesFiltro = useMemo(() => {
    const unicos = (campo) =>
      [...new Set(treinos.map((treino) => treino[campo]).filter(Boolean))].sort();

    return {
      alunos: unicos("aluno"),
      objetivos: unicos("objetivo"),
      niveis: unicos("nivel"),
      status: ["Ativo", "Em revisão", "Finalizado"],
    };
  }, [treinos]);

  const treinosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return treinos.filter((treino) => {
      const textoBusca = [treino.aluno, treino.rotina].join(" ").toLowerCase();
      const combinaBusca = textoBusca.includes(termo);
      const combinaAluno = filtroAluno === "todos" || treino.aluno === filtroAluno;
      const combinaObjetivo =
        filtroObjetivo === "todos" || treino.objetivo === filtroObjetivo;
      const combinaNivel = filtroNivel === "todos" || treino.nivel === filtroNivel;
      const combinaStatus =
        filtroStatus === "todos" || (treino.status || "Ativo") === filtroStatus;

      return (
        combinaBusca &&
        combinaAluno &&
        combinaObjetivo &&
        combinaNivel &&
        combinaStatus
      );
    });
  }, [busca, filtroAluno, filtroNivel, filtroObjetivo, filtroStatus, treinos]);

  const treinoSelecionado = useMemo(
    () => treinos.find((treino) => treino.id === treinoSelecionadoId),
    [treinoSelecionadoId, treinos]
  );

  const fichaTreino = useMemo(
    () => (treinoSelecionado ? formatarTreinoWhatsApp(treinoSelecionado) : ""),
    [treinoSelecionado]
  );

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {
      const [alunosSupabase, treinosSupabase] = await Promise.all([
        buscarAlunosSupabase(),
        buscarTreinosSupabase(),
      ]);

      setAlunos(alunosSupabase);
      setTreinos(treinosSupabase);
      return treinosSupabase;
    } catch (error) {
      setErro(error.message || "Nao foi possivel carregar os treinos.");
      return [];
    } finally {
      setCarregando(false);
    }
  }

  function abrirNovoTreino() {
    setTreinoEditando(null);
    setTreinoBase(null);
    setModalAberto(true);
  }

  function abrirEdicao(treino) {
    setTreinoEditando(treino);
    setTreinoBase(null);
    setModalAberto(true);
  }

  function gerarTreinoBase(modelo) {
    setTreinoEditando(null);
    setTreinoBase(criarModeloTreino(modelo));
    setModalAberto(true);
  }

  async function salvarTreino(treino) {
    const alunoSelecionado = alunos.find((aluno) => aluno.nome === treino.aluno);

    if (!alunoSelecionado) {
      alert("Selecione um aluno cadastrado para vincular o treino.");
      return;
    }

    try {
      setErro("");

      const payload = {
        ...treino,
        alunoId: alunoSelecionado.id,
      };

      const treinoSalvo = treinoEditando
        ? await atualizarTreinoSupabase(treinoEditando.id, payload)
        : await adicionarTreinoSupabase(payload);

      await carregarDados();
      setTreinoSelecionadoId(treinoSalvo?.id || "");
      setModalAberto(false);
      setTreinoEditando(null);
      setTreinoBase(null);
    } catch (error) {
      setErro(error.message || "Nao foi possivel salvar o treino.");
    }
  }

  async function duplicarTreino(treino) {
    const treinoDuplicado = {
      ...JSON.parse(JSON.stringify(treino)),
      id: undefined,
      rotina: `${treino.rotina || "Treino"} - Copia`,
      status: "Em revisão",
      alunoId: treino.alunoId,
      dias: (treino.dias || []).map((dia) => ({
        ...dia,
        id: undefined,
        exercicios: (dia.exercicios || []).map((exercicio) => ({
          ...exercicio,
          id: undefined,
        })),
      })),
    };

    try {
      setErro("");
      const novoTreino = await adicionarTreinoSupabase(treinoDuplicado);
      await carregarDados();
      setTreinoSelecionadoId(novoTreino.id);
    } catch (error) {
      setErro(error.message || "Nao foi possivel duplicar o treino.");
    }
  }

  async function removerTreino(id) {
    if (!window.confirm("Deseja excluir este treino?")) return;

    try {
      setErro("");
      await excluirTreinoSupabase(id);
      await carregarDados();

      if (treinoSelecionadoId === id) {
        setTreinoSelecionadoId("");
      }
    } catch (error) {
      setErro(error.message || "Nao foi possivel excluir o treino.");
    }
  }

  function limparFiltros() {
    setBusca("");
    setFiltroAluno("todos");
    setFiltroObjetivo("todos");
    setFiltroNivel("todos");
    setFiltroStatus("todos");
  }

  function copiarTreinoWhatsApp() {
    if (!fichaTreino) return;

    abrirWhatsApp(treinoSelecionado.alunoWhatsapp, fichaTreino);
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={conteudo}>
        <section style={listaCard}>
          <div style={listaTopo}>
            <div>
              <h1 style={tituloPagina}>Sistema de Treinos</h1>
              <p style={resumoLista}>
                {treinosFiltrados.length} de {treinos.length} treinos exibidos
              </p>
            </div>

            <button onClick={abrirNovoTreino} style={botaoPrimario}>
              + Novo Treino
            </button>
          </div>

          <div style={modelosLinha}>
            {["ABC", "ABCD", "ABCDE", "Full Body", "Upper/Lower"].map(
              (modelo) => (
                <button
                  key={modelo}
                  onClick={() => gerarTreinoBase(modelo)}
                  style={botaoSecundario}
                >
                  Gerar {modelo}
                </button>
              )
            )}
          </div>

          <div style={filtros}>
            <input
              placeholder="Buscar por aluno ou rotina"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={campo}
            />

            <select
              value={filtroAluno}
              onChange={(e) => setFiltroAluno(e.target.value)}
              style={campo}
            >
              <option value="todos">Todos os alunos</option>
              {opcoesFiltro.alunos.map((aluno) => (
                <option key={aluno} value={aluno}>
                  {aluno}
                </option>
              ))}
            </select>

            <select
              value={filtroObjetivo}
              onChange={(e) => setFiltroObjetivo(e.target.value)}
              style={campo}
            >
              <option value="todos">Todos os objetivos</option>
              {opcoesFiltro.objetivos.map((objetivo) => (
                <option key={objetivo} value={objetivo}>
                  {objetivo}
                </option>
              ))}
            </select>

            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
              style={campo}
            >
              <option value="todos">Todos os niveis</option>
              {opcoesFiltro.niveis.map((nivel) => (
                <option key={nivel} value={nivel}>
                  {nivel}
                </option>
              ))}
            </select>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={campo}
            >
              <option value="todos">Todos os status</option>
              {opcoesFiltro.status.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button onClick={limparFiltros} style={botaoSecundario}>
              Limpar
            </button>
          </div>
        </section>

        {erro && <div style={erroBox}>{erro}</div>}

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table style={tabela}>
            <thead>
              <tr style={linhaCabecalho}>
                <th style={tabelaHeader}>Aluno</th>
                <th style={tabelaHeader}>Rotina</th>
                <th style={tabelaHeader}>Objetivo</th>
                <th style={tabelaHeader}>Nivel</th>
                <th style={tabelaHeader}>Status</th>
                <th style={tabelaHeader}>Revisao</th>
                <th style={tabelaHeader}>Dias</th>
                <th style={tabelaHeader}>Acoes</th>
              </tr>
            </thead>

            <tbody>
              {carregando && (
                <tr>
                  <td style={estadoVazio} colSpan="8">
                    Carregando treinos...
                  </td>
                </tr>
              )}

              {!carregando &&
                treinosFiltrados.map((treino) => (
                  <tr key={treino.id}>
                    <td style={tabelaCelula}>{treino.aluno || "-"}</td>
                    <td style={tabelaCelula}>{treino.rotina || "-"}</td>
                    <td style={tabelaCelula}>{treino.objetivo || "-"}</td>
                    <td style={tabelaCelula}>{treino.nivel || "-"}</td>
                    <td style={tabelaCelula}>{treino.status || "Ativo"}</td>
                    <td style={tabelaCelula}>{formatarData(treino.dataRevisao)}</td>
                    <td style={tabelaCelula}>{treino.dias?.length || 0}</td>
                    <td style={tabelaCelula}>
                      <div style={acoes}>
                        <button
                          onClick={() => setTreinoSelecionadoId(treino.id)}
                          style={botaoSecundario}
                        >
                          Visualizar
                        </button>
                        <button
                          onClick={() => abrirEdicao(treino)}
                          style={botaoSecundario}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => duplicarTreino(treino)}
                          style={botaoSecundario}
                        >
                          Duplicar
                        </button>
                        <button
                          onClick={() => removerTreino(treino.id)}
                          style={botaoExcluir}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!carregando && treinosFiltrados.length === 0 && (
                <tr>
                  <td style={estadoVazio} colSpan="8">
                    Nenhum treino cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {treinoSelecionado && (
          <section style={detalhesCard}>
            <div style={detalhesTopo}>
              <div>
                <h2 style={detalhesTitulo}>{treinoSelecionado.rotina}</h2>
                <p style={resumoLista}>{treinoSelecionado.aluno}</p>
              </div>

              <div style={acoes}>
                <button onClick={copiarTreinoWhatsApp} style={botaoPrimario}>
                  Enviar pelo WhatsApp
                </button>
                <button
                  onClick={() => setTreinoSelecionadoId("")}
                  style={botaoSecundario}
                >
                  Fechar
                </button>
              </div>
            </div>

            <div style={infoGrid}>
              <Info label="Objetivo" valor={treinoSelecionado.objetivo} />
              <Info label="Nivel" valor={treinoSelecionado.nivel} />
              <Info label="Status" valor={treinoSelecionado.status || "Ativo"} />
              <Info label="Inicio" valor={formatarData(treinoSelecionado.dataInicio)} />
              <Info label="Revisao" valor={formatarData(treinoSelecionado.dataRevisao)} />
              <Info
                label="Dias por semana"
                valor={treinoSelecionado.diasPorSemana}
              />
              <Info
                label="Observacoes"
                valor={treinoSelecionado.observacoes || "-"}
              />
            </div>

            <div style={fichaTopo}>
              <h3 style={diaTitulo}>Ficha de treino</h3>
            </div>

            <pre style={fichaTexto}>{fichaTreino}</pre>

            <div style={diasDetalhes}>
              {(treinoSelecionado.dias || []).map((dia) => (
                <div key={dia.id} style={diaDetalhe}>
                  <div style={diaTopo}>
                    <h3 style={diaTitulo}>{dia.nome}</h3>
                    <span style={diaDescricao}>{dia.descricao}</span>
                  </div>

                  <div style={exerciciosGrid}>
                    {(dia.exercicios || []).map((exercicio) => (
                      <ExercicioCard key={exercicio.id} exercicio={exercicio} />
                    ))}

                    {(!dia.exercicios || dia.exercicios.length === 0) && (
                      <p style={resumoLista}>
                        Nenhum exercicio cadastrado neste dia.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {modalAberto && (
          <TreinoModal
            alunos={alunos}
            treino={treinoEditando || treinoBase}
            onClose={() => {
              setModalAberto(false);
              setTreinoEditando(null);
              setTreinoBase(null);
            }}
            onSave={salvarTreino}
          />
        )}
      </div>
    </div>
  );
}

function Info({ label, valor }) {
  return (
    <div style={infoItem}>
      <span style={infoLabel}>{label}</span>
      <strong style={infoValor}>{valor || "-"}</strong>
    </div>
  );
}

function formatarData(data) {
  if (!data) return "-";
  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

function criarModeloTreino(modelo) {
  const modelos = {
    ABC: [
      ["Treino A", "Peito, Ombro e Triceps"],
      ["Treino B", "Costas e Biceps"],
      ["Treino C", "Pernas"],
    ],
    ABCD: [
      ["Treino A", "Peito e Triceps"],
      ["Treino B", "Costas e Biceps"],
      ["Treino C", "Pernas"],
      ["Treino D", "Ombros e Abdomen"],
    ],
    ABCDE: [
      ["Treino A", "Peito"],
      ["Treino B", "Costas"],
      ["Treino C", "Pernas"],
      ["Treino D", "Ombros"],
      ["Treino E", "Bracos e Abdomen"],
    ],
    "Full Body": [
      ["Treino Full Body 1", "Corpo inteiro"],
      ["Treino Full Body 2", "Corpo inteiro"],
      ["Treino Full Body 3", "Corpo inteiro"],
    ],
    "Upper/Lower": [
      ["Upper 1", "Membros superiores"],
      ["Lower 1", "Membros inferiores"],
      ["Upper 2", "Membros superiores"],
      ["Lower 2", "Membros inferiores"],
    ],
  };

  const dias = (modelos[modelo] || []).map(([nome, descricao]) => ({
    id: crypto.randomUUID(),
    nome,
    descricao,
    exercicios: [],
  }));

  return {
    aluno: "",
    rotina: `Modelo ${modelo}`,
    objetivo: "",
    nivel: "",
    status: "Em revisão",
    dataInicio: "",
    dataRevisao: "",
    diasPorSemana: dias.length,
    observacoes: "",
    dias,
  };
}

function formatarTreinoWhatsApp(treino) {
  const linhas = [
    `*${treino.rotina || "Ficha de Treino"}*`,
    `Aluno: ${treino.aluno || "-"}`,
    `Objetivo: ${treino.objetivo || "-"}`,
    `Nivel: ${treino.nivel || "-"}`,
    `Status: ${treino.status || "Ativo"}`,
    `Inicio: ${formatarData(treino.dataInicio)}`,
    `Revisao: ${formatarData(treino.dataRevisao)}`,
    "",
  ];

  (treino.dias || []).forEach((dia) => {
    linhas.push(`*${dia.nome} - ${dia.descricao || ""}*`.trim());

    if (!dia.exercicios?.length) {
      linhas.push("- Exercicios a definir");
    }

    (dia.exercicios || []).forEach((exercicio, index) => {
      linhas.push(
        `${index + 1}. ${exercicio.nome || "-"} | ${exercicio.series || "-"}x${
          exercicio.repeticoes || "-"
        } | Carga: ${exercicio.carga || "-"} | Descanso: ${
          exercicio.descanso || "-"
        }`
      );

      if (exercicio.observacoes) {
        linhas.push(`Obs: ${exercicio.observacoes}`);
      }

      if (exercicio.video) {
        linhas.push(`Video: ${exercicio.video}`);
      }
    });

    linhas.push("");
  });

  if (treino.observacoes) {
    linhas.push(`Observacoes gerais: ${treino.observacoes}`);
  }

  return linhas.join("\n");
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

const modelosLinha = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginBottom: "14px",
};

const filtros = {
  display: "grid",
  gridTemplateColumns:
    "minmax(220px, 1fr) repeat(4, minmax(150px, 190px)) auto",
  gap: "10px",
  alignItems: "center",
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

const erroBox = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#991b1b",
  marginTop: "16px",
  padding: "12px",
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

const detalhesTitulo = {
  margin: 0,
  fontSize: "22px",
};

const infoGrid = {
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

const fichaTopo = {
  marginTop: "22px",
};

const fichaTexto = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  color: "#111827",
  fontFamily: "Consolas, monospace",
  fontSize: "13px",
  lineHeight: 1.6,
  marginTop: "10px",
  overflowX: "auto",
  padding: "14px",
  whiteSpace: "pre-wrap",
};

const diasDetalhes = {
  display: "grid",
  gap: "16px",
  marginTop: "20px",
};

const diaDetalhe = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
};

const diaTopo = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "baseline",
  flexWrap: "wrap",
};

const diaTitulo = {
  margin: 0,
  fontSize: "17px",
};

const diaDescricao = {
  color: "#6b7280",
  fontSize: "14px",
};

const exerciciosGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "12px",
  marginTop: "14px",
};

export default Treinos;
