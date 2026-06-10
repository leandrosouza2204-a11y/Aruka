import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Dumbbell,
  Eye,
  Layers3,
  MessageCircle,
  Target,
  TimerReset,
  X,
} from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import TableActions, { TableActionItem } from "../../../components/TableActions";
import EmptyState from "../../../components/EmptyState";
import LoadingState from "../../../components/LoadingState";
import TreinoModal from "../../../components/TreinoModal";
import ExercicioCard from "../../../components/ExercicioCard";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import { buscarAlunosSupabase } from "../../../services/alunosService";
import {
  adicionarTreinoSupabase,
  atualizarTreinoSupabase,
  buscarTreinosSupabase,
  excluirTreinoSupabase,
} from "../../../services/treinosService";
import { abrirWhatsApp } from "../../../services/whatsappService";

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
  const toast = useToast();
  const { confirmar } = useConfirm();

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
        setErro(error.message || "Não foi possível carregar os treinos.");
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
      setErro(error.message || "Não foi possível carregar os treinos.");
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
      toast.aviso("Aluno obrigatório", "Selecione um aluno cadastrado para vincular o treino.");
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
      toast.sucesso("Treino salvo", "A ficha foi salva com sucesso.");
    } catch (error) {
      console.error(error);
      setErro(error.message || "Não foi possível salvar o treino.");
      toast.erro("Não foi possível salvar o treino", "Tente novamente em alguns instantes.");
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
      toast.sucesso("Treino duplicado", "Uma cópia foi criada para edição.");
    } catch (error) {
      console.error(error);
      setErro(error.message || "Não foi possível duplicar o treino.");
      toast.erro("Não foi possível duplicar o treino", "Tente novamente em alguns instantes.");
    }
  }

  async function removerTreino(id) {
    const confirmado = await confirmar({
      titulo: "Excluir treino?",
      descricao: "Esta ação remove a ficha de treino selecionada.",
      textoConfirmar: "Excluir",
    });

    if (!confirmado) return;

    try {
      setErro("");
      await excluirTreinoSupabase(id);
      await carregarDados();

      if (treinoSelecionadoId === id) {
        setTreinoSelecionadoId("");
      }
      toast.sucesso("Treino excluído", "A ficha foi removida com sucesso.");
    } catch (error) {
      console.error(error);
      setErro(error.message || "Não foi possível excluir o treino.");
      toast.erro("Não foi possível excluir o treino", "Tente novamente em alguns instantes.");
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

      <div className="treinos-page" style={conteudo}>
        <section className="treinos-list-card" style={listaCard}>
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

          <div className="treinos-modelos" style={modelosRapidos}>
            <div>
              <span style={modelosTitulo}>Modelos rápidos</span>
              <p style={modelosLegenda}>Comece por uma estrutura pronta e ajuste depois.</p>
            </div>
            <div style={modelosLinha}>
              {["ABC", "ABCD", "ABCDE", "Full Body", "Upper/Lower"].map(
                (modelo) => (
                  <button
                    key={modelo}
                    onClick={() => gerarTreinoBase(modelo)}
                    style={botaoPill}
                  >
                    Gerar {modelo}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="treinos-filtros" style={filtros}>
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
              <option value="todos">Todos os níveis</option>
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

        <div className="app-table-scroll">
          <table className="app-table" style={tabela}>
            <thead>
              <tr style={linhaCabecalho}>
                <th style={tabelaHeader}>Aluno</th>
                <th style={tabelaHeader}>Rotina</th>
                <th style={tabelaHeader}>Objetivo</th>
                <th style={tabelaHeader}>Nível</th>
                <th style={tabelaHeader}>Status</th>
                <th style={tabelaHeader}>Revisão</th>
                <th style={tabelaHeader}>Dias</th>
                <th style={tabelaHeader}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {carregando && (
                <tr>
                  <td style={estadoVazio} colSpan="8">
                    <LoadingState texto="Carregando treinos..." />
                  </td>
                </tr>
              )}

              {!carregando &&
                treinosFiltrados.map((treino) => (
                  <tr key={treino.id}>
                    <td className="cell-wide" style={tabelaCelula}>{treino.aluno || "-"}</td>
                    <td className="cell-wide" style={tabelaCelula}>{treino.rotina || "-"}</td>
                    <td style={tabelaCelula}>{treino.objetivo || "-"}</td>
                    <td style={tabelaCelula}>{treino.nivel || "-"}</td>
                    <td style={tabelaCelula}>
                      <span className={classeStatusTreino(treino.status || "Ativo")}>
                        {treino.status || "Ativo"}
                      </span>
                    </td>
                    <td style={tabelaCelula}>{formatarData(treino.dataRevisao)}</td>
                    <td style={tabelaCelula}>{treino.dias?.length || 0}</td>
                    <td style={tabelaCelula}>
                      <div className="table-actions-inline">
                        <button
                          onClick={() => setTreinoSelecionadoId(treino.id)}
                          className="table-button table-button-primary"
                        >
                          Visualizar
                        </button>
                        <TableActions>
                          <TableActionItem onClick={() => abrirEdicao(treino)}>
                            Editar
                          </TableActionItem>
                          <TableActionItem onClick={() => duplicarTreino(treino)}>
                            Duplicar
                          </TableActionItem>
                          <TableActionItem
                            onClick={() => removerTreino(treino.id)}
                            variant="danger"
                          >
                            Excluir
                          </TableActionItem>
                        </TableActions>
                      </div>
                    </td>
                  </tr>
                ))}

              {!carregando && treinosFiltrados.length === 0 && (
                <tr>
                  <td style={estadoVazio} colSpan="8">
                    <EmptyState
                      titulo="Nenhum treino cadastrado."
                      descricao="Crie uma rotina para organizar dias, exercícios e envio por WhatsApp."
                      acaoLabel="Novo treino"
                      onAcao={() => setModalAberto(true)}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {treinoSelecionado && (
          <section className="treinos-details-card" style={detalhesCard}>
            <div style={detalhesHero}>
              <div>
                <span style={detalhesEyebrow}>Treino selecionado</span>
                <h2 style={detalhesTitulo}>
                  {treinoSelecionado.rotina || "Ficha de Treino"}
                </h2>
                <p style={detalhesSubtitulo}>
                  {treinoSelecionado.aluno || "Aluno não informado"}
                </p>
                <div style={heroBadges}>
                  <span className={classeStatusTreino(treinoSelecionado.status || "Ativo")}>
                    {treinoSelecionado.status || "Ativo"}
                  </span>
                  <span className="status-badge status-badge-info">
                    {treinoSelecionado.nivel || "Nível não informado"}
                  </span>
                  <span className="status-badge status-badge-muted">
                    {treinoSelecionado.objetivo || "Objetivo não informado"}
                  </span>
                </div>
              </div>

              <div style={detalhesAcoes}>
                <button onClick={copiarTreinoWhatsApp} style={botaoWhatsApp}>
                  <MessageCircle size={16} />
                  Enviar pelo WhatsApp
                </button>
                <button
                  onClick={() => setTreinoSelecionadoId("")}
                  style={botaoFechar}
                >
                  <X size={15} />
                  Fechar
                </button>
              </div>
            </div>

            <div className="treinos-info-grid" style={infoGrid}>
              <Info
                label="Objetivo"
                valor={treinoSelecionado.objetivo}
                icon={<Target size={17} />}
              />
              <Info
                label="Nível"
                valor={treinoSelecionado.nivel}
                icon={<Layers3 size={17} />}
              />
              <Info
                label="Status"
                valor={treinoSelecionado.status || "Ativo"}
                icon={<Eye size={17} />}
              />
              <Info
                label="Início"
                valor={formatarData(treinoSelecionado.dataInicio)}
                icon={<CalendarClock size={17} />}
              />
              <Info
                label="Revisão"
                valor={formatarData(treinoSelecionado.dataRevisao)}
                icon={<TimerReset size={17} />}
              />
              <Info
                label="Dias por semana"
                valor={treinoSelecionado.diasPorSemana}
                icon={<Dumbbell size={17} />}
              />
              <Info
                label="Observações"
                valor={treinoSelecionado.observacoes || "-"}
                destaque
              />
            </div>

            <section className="treinos-days-block" style={diasBloco}>
              <div style={diasHeader}>
                <div>
                  <h3 style={diasTitulo}>Dias do treino</h3>
                  <p style={diasLegenda}>
                    Organize a execução por sessões e acompanhe os exercícios de cada dia.
                  </p>
                </div>
                <span style={diasContador}>
                  {(treinoSelecionado.dias || []).length} dias
                </span>
              </div>

              <div style={diasDetalhes}>
                {(treinoSelecionado.dias || []).map((dia, index) => (
                  <details
                    key={dia.id}
                    className="treino-day"
                    open={index === 0}
                    style={diaDetalhe}
                  >
                    <summary style={diaResumo}>
                      <div>
                        <h4 style={diaTitulo}>{dia.nome || `Dia ${index + 1}`}</h4>
                        <p style={diaDescricao}>
                          {dia.descricao || "Sem descrição"} - {dia.exercicios?.length || 0} exercícios
                        </p>
                      </div>
                      <span style={diaBadge}>{dia.exercicios?.length || 0}</span>
                    </summary>

                    <div style={exerciciosGrid}>
                      {(dia.exercicios || []).map((exercicio) => (
                        <ExercicioCard key={exercicio.id} exercicio={exercicio} />
                      ))}

                      {(!dia.exercicios || dia.exercicios.length === 0) && (
                        <div style={estadoDiaVazio}>
                          Nenhum exercício cadastrado para este dia.
                        </div>
                      )}
                    </div>
                  </details>
                ))}

                {(!treinoSelecionado.dias || treinoSelecionado.dias.length === 0) && (
                  <div style={estadoTreinoVazio}>
                    Nenhum dia cadastrado para este treino.
                  </div>
                )}
              </div>
            </section>
          </section>
        )}

        {!treinoSelecionado && !carregando && (
          <section className="treinos-empty-card" style={semTreinoCard}>
            <div style={semTreinoIcone}>
              <Dumbbell size={22} />
            </div>
            <div>
              <h2 style={semTreinoTitulo}>Nenhum treino selecionado.</h2>
              <p style={semTreinoTexto}>
                Selecione um treino na tabela para visualizar os detalhes organizados por dia.
              </p>
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

function Info({ label, valor, icon, destaque = false }) {
  return (
    <div
      className="treino-info-card"
      style={{ ...infoItem, ...(destaque ? infoItemDestaque : {}) }}
    >
      {icon && <span style={infoIcon}>{icon}</span>}
      <div>
        <span style={infoLabel}>{label}</span>
        <strong style={infoValor}>{valor || "-"}</strong>
      </div>
    </div>
  );
}

function classeStatusTreino(status) {
  if (status === "Ativo") return "status-badge status-badge-success";
  if (String(status).toLowerCase().includes("revis")) return "status-badge status-badge-warning";
  if (status === "Finalizado") return "status-badge status-badge-muted";

  return "status-badge status-badge-info";
}

function formatarData(data) {
  if (!data) return "-";
  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

function criarModeloTreino(modelo) {
  const modelos = {
    ABC: [
      ["Treino A", "Peito, Ombro e Tríceps"],
      ["Treino B", "Costas e Bíceps"],
      ["Treino C", "Pernas"],
    ],
    ABCD: [
      ["Treino A", "Peito e Tríceps"],
      ["Treino B", "Costas e Bíceps"],
      ["Treino C", "Pernas"],
      ["Treino D", "Ombros e Abdômen"],
    ],
    ABCDE: [
      ["Treino A", "Peito"],
      ["Treino B", "Costas"],
      ["Treino C", "Pernas"],
      ["Treino D", "Ombros"],
      ["Treino E", "Braços e Abdômen"],
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
    `Nível: ${treino.nivel || "-"}`,
    `Status: ${treino.status || "Ativo"}`,
    `Início: ${formatarData(treino.dataInicio)}`,
    `Revisão: ${formatarData(treino.dataRevisao)}`,
    "",
  ];

  (treino.dias || []).forEach((dia) => {
    linhas.push(`*${dia.nome} - ${dia.descricao || ""}*`.trim());

    if (!dia.exercicios?.length) {
      linhas.push("- Exercícios a definir");
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
        linhas.push(`Vídeo: ${exercicio.video}`);
      }
    });

    linhas.push("");
  });

  if (treino.observacoes) {
    linhas.push(`Observações gerais: ${treino.observacoes}`);
  }

  return linhas.join("\n");
}

const conteudo = {
  padding: "30px",
  marginLeft: "260px",
  width: "calc(100% - 260px)",
  background:
    "radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 320px), linear-gradient(180deg, rgba(239, 246, 255, 0.84), rgba(245, 247, 251, 1) 300px)",
  minHeight: "100vh",
};

const listaCard = {
  background: "rgba(255, 255, 255, 0.86)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255, 255, 255, 0.72)",
  borderRadius: "8px",
  boxShadow: "0 22px 52px rgba(15, 23, 42, 0.08)",
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

const modelosRapidos = {
  alignItems: "center",
  background: "linear-gradient(135deg, rgba(248, 250, 252, 0.96), rgba(219, 234, 254, 0.58))",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.75)",
  borderRadius: "8px",
  display: "flex",
  gap: "16px",
  justifyContent: "space-between",
  marginBottom: "16px",
  padding: "14px",
};

const modelosTitulo = {
  color: "#111827",
  display: "block",
  fontSize: "13px",
  fontWeight: "850",
};

const modelosLegenda = {
  color: "#6b7280",
  fontSize: "12px",
  marginTop: "3px",
};

const modelosLinha = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  justifyContent: "flex-end",
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

const detalhesAcoes = {
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

const botaoPill = {
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(191, 219, 254, 0.9)",
  borderRadius: "999px",
  color: "#1d4ed8",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "850",
  minHeight: "34px",
  padding: "8px 12px",
};

const detalhesCard = {
  marginTop: "24px",
  background: "rgba(255, 255, 255, 0.88)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.72)",
  borderRadius: "8px",
  boxShadow: "0 28px 70px rgba(15, 23, 42, 0.13)",
  overflow: "hidden",
  padding: "0",
};

const detalhesHero = {
  background:
    "linear-gradient(135deg, rgba(15, 23, 42, 0.99), rgba(29, 78, 216, 0.94))",
  boxShadow: "0 18px 42px rgba(30, 64, 175, 0.22)",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "18px",
  padding: "28px",
  position: "relative",
  flexWrap: "wrap",
};

const detalhesTitulo = {
  margin: 0,
  fontSize: "28px",
  lineHeight: 1.15,
};

const detalhesEyebrow = {
  color: "#bfdbfe",
  display: "block",
  fontSize: "12px",
  fontWeight: "850",
  letterSpacing: "0.04em",
  marginBottom: "8px",
  textTransform: "uppercase",
};

const detalhesSubtitulo = {
  color: "rgba(255, 255, 255, 0.76)",
  fontSize: "15px",
  marginTop: "8px",
};

const heroBadges = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "14px",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: "12px",
  background: "linear-gradient(180deg, rgba(248, 250, 252, 0.72), rgba(255, 255, 255, 0.88))",
  padding: "20px",
};

const infoItem = {
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.78)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(226, 232, 240, 0.48)",
  borderRadius: "8px",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.055)",
  display: "flex",
  gap: "10px",
  minHeight: "74px",
  padding: "12px",
  transition: "transform 0.18s ease, box-shadow 0.18s ease",
};

const infoItemDestaque = {
  gridColumn: "span 2",
  alignItems: "flex-start",
};

const infoIcon = {
  alignItems: "center",
  background: "#eff6ff",
  borderRadius: "8px",
  color: "#2563eb",
  display: "inline-flex",
  flex: "0 0 auto",
  height: "34px",
  justifyContent: "center",
  width: "34px",
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

const botaoWhatsApp = {
  alignItems: "center",
  background: "#16a34a",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  display: "inline-flex",
  gap: "8px",
  fontWeight: "850",
  minHeight: "38px",
  padding: "9px 13px",
};

const botaoFechar = {
  alignItems: "center",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  display: "inline-flex",
  gap: "7px",
  fontWeight: "800",
  minHeight: "38px",
  padding: "9px 12px",
};

const diasBloco = {
  background: "linear-gradient(180deg, rgba(241, 245, 249, 0.78), rgba(248, 250, 252, 0.96))",
  borderTop: "1px solid rgba(226, 232, 240, 0.42)",
  padding: "20px",
};

const diasHeader = {
  alignItems: "flex-start",
  display: "flex",
  gap: "14px",
  justifyContent: "space-between",
  marginBottom: "14px",
};

const diasTitulo = {
  color: "#111827",
  fontSize: "20px",
  margin: 0,
};

const diasLegenda = {
  color: "#6b7280",
  fontSize: "13px",
  marginTop: "5px",
};

const diasContador = {
  background: "#dbeafe",
  borderRadius: "999px",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "850",
  padding: "7px 10px",
};

const diasDetalhes = {
  display: "grid",
  gap: "12px",
};

const diaDetalhe = {
  background: "rgba(255, 255, 255, 0.82)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(226, 232, 240, 0.42)",
  borderRadius: "8px",
  boxShadow: "0 14px 32px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
};

const diaResumo = {
  alignItems: "center",
  cursor: "pointer",
  display: "flex",
  gap: "12px",
  justifyContent: "space-between",
  listStyle: "none",
  padding: "16px",
};

const diaTitulo = {
  color: "#111827",
  margin: 0,
  fontSize: "16px",
};

const diaDescricao = {
  color: "#6b7280",
  fontSize: "13px",
  marginTop: "4px",
};

const diaBadge = {
  alignItems: "center",
  background: "#eef2ff",
  borderRadius: "999px",
  color: "#1d4ed8",
  display: "inline-flex",
  fontSize: "12px",
  fontWeight: "850",
  height: "30px",
  justifyContent: "center",
  minWidth: "30px",
  padding: "0 9px",
};

const exerciciosGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "12px",
  background: "rgba(248, 250, 252, 0.72)",
  padding: "0 16px 16px",
};

const estadoDiaVazio = {
  background: "#f8fafc",
  borderRadius: "8px",
  color: "#6b7280",
  fontSize: "13px",
  fontWeight: "700",
  padding: "14px",
};

const estadoTreinoVazio = {
  background: "white",
  borderRadius: "8px",
  color: "#6b7280",
  fontWeight: "750",
  padding: "18px",
  textAlign: "center",
};

const semTreinoCard = {
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.78)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.72)",
  borderRadius: "8px",
  boxShadow: "0 18px 44px rgba(15, 23, 42, 0.075)",
  display: "flex",
  gap: "14px",
  marginTop: "24px",
  padding: "20px",
};

const semTreinoIcone = {
  alignItems: "center",
  background: "#eff6ff",
  borderRadius: "8px",
  color: "#2563eb",
  display: "inline-flex",
  flex: "0 0 auto",
  height: "46px",
  justifyContent: "center",
  width: "46px",
};

const semTreinoTitulo = {
  color: "#111827",
  fontSize: "18px",
  margin: 0,
};

const semTreinoTexto = {
  color: "#6b7280",
  fontSize: "14px",
  marginTop: "5px",
};

export default Treinos;


