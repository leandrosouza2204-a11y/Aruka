import { useEffect, useMemo, useState } from "react";
import { formatarData } from "../../../data/formatters";
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

export { formatarData };

export function useTreinosPage() {
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
    carregarDados();
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
      toast.aviso(
        "Aluno obrigatório",
        "Selecione um aluno cadastrado para vincular o treino."
      );
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
      fecharModal();
      toast.sucesso("Treino salvo", "A ficha foi salva com sucesso.");
    } catch (error) {
      console.error(error);
      setErro(error.message || "Não foi possível salvar o treino.");
      toast.erro(
        "Não foi possível salvar o treino",
        "Tente novamente em alguns instantes."
      );
    }
  }

  async function duplicarTreino(treino) {
    const treinoDuplicado = {
      ...JSON.parse(JSON.stringify(treino)),
      id: undefined,
      rotina: `${treino.rotina || "Treino"} - Cópia`,
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
      toast.erro(
        "Não foi possível duplicar o treino",
        "Tente novamente em alguns instantes."
      );
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
      toast.erro(
        "Não foi possível excluir o treino",
        "Tente novamente em alguns instantes."
      );
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
    if (!fichaTreino || !treinoSelecionado) return;

    abrirWhatsApp(treinoSelecionado.alunoWhatsapp, fichaTreino);
  }

  function fecharModal() {
    setModalAberto(false);
    setTreinoEditando(null);
    setTreinoBase(null);
  }

  function visualizarTreino(id) {
    setTreinoSelecionadoId(id);
  }

  function fecharDetalhes() {
    setTreinoSelecionadoId("");
  }

  return {
    alunos,
    busca,
    carregando,
    erro,
    filtroAluno,
    filtroNivel,
    filtroObjetivo,
    filtroStatus,
    modalAberto,
    opcoesFiltro,
    treinoBase,
    treinoEditando,
    treinoSelecionado,
    treinos,
    treinosFiltrados,
    abrirEdicao,
    abrirNovoTreino,
    copiarTreinoWhatsApp,
    duplicarTreino,
    fecharDetalhes,
    fecharModal,
    gerarTreinoBase,
    limparFiltros,
    removerTreino,
    salvarTreino,
    setBusca,
    setFiltroAluno,
    setFiltroNivel,
    setFiltroObjetivo,
    setFiltroStatus,
    visualizarTreino,
  };
}

export function classeStatusTreino(status) {
  if (status === "Ativo") return "status-badge status-badge-success";
  if (String(status).toLowerCase().includes("revis")) {
    return "status-badge status-badge-warning";
  }
  if (status === "Finalizado") return "status-badge status-badge-muted";

  return "status-badge status-badge-info";
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
