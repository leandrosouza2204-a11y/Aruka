import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatarData } from "../../../data/formatters";
import { criarModeloTreino } from "../../../data/treinosModelos";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import { buscarAlunosSupabase } from "../../../services/alunosService";
import {
  adicionarTreinoSupabase,
  atualizarTreinoSupabase,
  buscarTreinosSupabase,
  excluirTreinoSupabase,
} from "../../../services/treinosService";
import {
  atualizarModeloPessoalSupabase,
  buscarModelosPessoaisSupabase,
  criarModeloPessoalSupabase,
  excluirModeloPessoalSupabase,
} from "../../../services/workoutTemplatesService";
import { abrirWhatsApp } from "../../../services/whatsappService";
import {
  criarTreinoBaseContextual,
  removerAlunoIdDoContexto,
  resolverContextoAlunoTreinos,
} from "../utils/treinosContextoAluno";
import { templateDataToWorkout } from "../utils/workoutTemplateSanitization";

export { formatarData };

export function useTreinosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [treinos, setTreinos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalModelosAberto, setModalModelosAberto] = useState(false);
  const [modelosPessoais, setModelosPessoais] = useState([]);
  const [carregandoModelos, setCarregandoModelos] = useState(false);
  const [erroModelos, setErroModelos] = useState("");
  const [treinoEditando, setTreinoEditando] = useState(null);
  const [treinoBase, setTreinoBase] = useState(null);
  const [treinoSelecionadoId, setTreinoSelecionadoId] = useState("");
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const contextoAluno = useMemo(
    () => resolverContextoAlunoTreinos({ searchParams, alunos, carregando }),
    [alunos, carregando, searchParams]
  );
  const filtroAluno = contextoAluno.alunoId || "todos";
  const [filtroObjetivo, setFiltroObjetivo] = useState("todos");
  const [filtroNivel, setFiltroNivel] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [erro, setErro] = useState("");
  const toast = useToast();
  const { confirmar } = useConfirm();

  const opcoesFiltro = useMemo(() => {
    const unicos = (campo) =>
      [...new Set(treinos.map((treino) => treino[campo]).filter(Boolean))].sort();

    return {
      alunos: alunos.map((aluno) => ({ id: aluno.id, nome: aluno.nome })),
      objetivos: unicos("objetivo"),
      niveis: unicos("nivel"),
      status: ["Ativo", "Em revisão", "Finalizado"],
    };
  }, [alunos, treinos]);

  const treinosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return treinos.filter((treino) => {
      const textoBusca = [treino.aluno, treino.rotina].join(" ").toLowerCase();
      const combinaBusca = textoBusca.includes(termo);
      const combinaAluno = filtroAluno === "todos" || treino.alunoId === filtroAluno;
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

  const alunoContextual = contextoAluno.aluno;

  const fichaTreino = useMemo(
    () => (treinoSelecionado ? formatarTreinoWhatsApp(treinoSelecionado) : ""),
    [treinoSelecionado]
  );

  const carregarModelosPessoais = useCallback(async function carregarModelosPessoais() {
    setCarregandoModelos(true);

    try {
      setErroModelos("");
      return await buscarModelosPessoaisSupabase();
    } catch (error) {
      console.error(error);
      setErroModelos(error.message || "Nao foi possivel carregar seus modelos.");
      return [];
    } finally {
      setCarregandoModelos(false);
    }
  }, []);

  const carregarDados = useCallback(async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {
      const [alunosSupabase, treinosSupabase, modelosSupabase] = await Promise.all([
        buscarAlunosSupabase(),
        buscarTreinosSupabase(),
        carregarModelosPessoais(),
      ]);

      const treinosNormalizados = normalizarRegistrosAluno(treinosSupabase, alunosSupabase);

      setAlunos(alunosSupabase);
      setTreinos(treinosNormalizados);
      setModelosPessoais(modelosSupabase);
      return treinosNormalizados;
    } catch (error) {
      setErro(error.message || "Não foi possível carregar os treinos.");
      return [];
    } finally {
      setCarregando(false);
    }
  }, [carregarModelosPessoais]);

  useEffect(() => {
    const carregamentoInicial = window.setTimeout(() => {
      carregarDados();
    }, 0);

    return () => window.clearTimeout(carregamentoInicial);
  }, [carregarDados]);

  function abrirNovoTreino() {
    setTreinoEditando(null);
    setTreinoBase(criarTreinoBaseContextual(alunoContextual));
    setModalAberto(true);
  }

  function abrirEdicao(treino) {
    setTreinoEditando(treino);
    setTreinoBase(null);
    setModalAberto(true);
  }

  function abrirBibliotecaModelos() {
    setModalModelosAberto(true);
  }

  function gerarTreinoBase(modelo, opcoes = {}) {
    setTreinoEditando(null);
    setTreinoBase(
      typeof modelo === "object" && !modelo.isSystem
        ? templateDataToWorkout(modelo, opcoes)
        : criarModeloTreino(modelo, opcoes)
    );
    setModalModelosAberto(false);
    setModalAberto(true);
  }

  async function salvarModeloPessoal(metadata, treino) {
    try {
      setErroModelos("");
      const modelo = await criarModeloPessoalSupabase(metadata, treino);
      setModelosPessoais((atuais) => [modelo, ...atuais]);
      toast.sucesso("Modelo salvo", "O modelo pessoal foi salvo na sua biblioteca.");
    } catch (error) {
      console.error(error);
      setErroModelos(error.message || "Nao foi possivel salvar o modelo.");
      toast.erro("Nao foi possivel salvar o modelo", "Revise os dados e tente novamente.");
      throw error;
    }
  }

  async function atualizarModeloPessoal(id, metadata, treino) {
    try {
      setErroModelos("");
      const modelo = await atualizarModeloPessoalSupabase(id, metadata, treino);
      setModelosPessoais((atuais) =>
        atuais.map((item) => (item.id === id ? modelo : item))
      );
      toast.sucesso("Modelo atualizado", "O modelo pessoal foi atualizado.");
    } catch (error) {
      console.error(error);
      setErroModelos(error.message || "Nao foi possivel atualizar o modelo.");
      toast.erro("Nao foi possivel atualizar o modelo", "Tente novamente em instantes.");
      throw error;
    }
  }

  async function removerModeloPessoal(modelo) {
    const confirmado = await confirmar({
      titulo: "Excluir modelo pessoal?",
      descricao: "Esta acao remove apenas o modelo da sua biblioteca. Treinos ja criados nao sao alterados.",
      textoConfirmar: "Excluir",
      testIdPrefix: "custom-template",
    });

    if (!confirmado) return;

    try {
      setErroModelos("");
      await excluirModeloPessoalSupabase(modelo.id);
      setModelosPessoais((atuais) => atuais.filter((item) => item.id !== modelo.id));
      toast.sucesso("Modelo excluido", "O modelo pessoal foi removido.");
    } catch (error) {
      console.error(error);
      setErroModelos(error.message || "Nao foi possivel excluir o modelo.");
      toast.erro("Nao foi possivel excluir o modelo", "Tente novamente em instantes.");
    }
  }

  async function salvarTreino(treino) {
    const alunoSelecionado = alunos.find((aluno) => aluno.id === treino.alunoId);

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
        aluno: alunoSelecionado.nome,
        nomeAluno: alunoSelecionado.nome,
      };

      const treinoSalvo = treinoEditando
        ? await atualizarTreinoSupabase(treinoEditando.id, payload)
        : await adicionarTreinoSupabase(payload);

      await carregarDados();
      setTreinoSelecionadoId(treinoSalvo?.id || "");
      fecharModal();
      toast.sucesso("Treino salvo", "A ficha foi salva com sucesso.");
      return true;
    } catch (error) {
      console.error(error);
      setErro(error.message || "Não foi possível salvar o treino.");
      toast.erro(
        "Não foi possível salvar o treino",
        "Tente novamente em alguns instantes."
      );
      return false;
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
      testIdPrefix: "treino",
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

  function setFiltroAluno(valor) {
    const proximos = new URLSearchParams(searchParams);
    if (!valor || valor === "todos") proximos.delete("alunoId");
    else proximos.set("alunoId", valor);
    setSearchParams(proximos, { replace: false });
  }

  function limparContextoAluno() {
    setSearchParams(removerAlunoIdDoContexto(searchParams), { replace: false });
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

  function fecharBibliotecaModelos() {
    setModalModelosAberto(false);
  }

  function visualizarTreino(id) {
    setTreinoSelecionadoId(id);
  }

  function fecharDetalhes() {
    setTreinoSelecionadoId("");
  }

  return {
    alunos,
    alunoContextual,
    contextoAluno,
    busca,
    carregando,
    erro,
    filtroAluno,
    filtroNivel,
    filtroObjetivo,
    filtroStatus,
    modalAberto,
    modalModelosAberto,
    modelosPessoais,
    opcoesFiltro,
    treinoBase,
    treinoEditando,
    treinoSelecionado,
    treinos,
    treinosFiltrados,
    carregandoModelos,
    erroModelos,
    abrirBibliotecaModelos,
    abrirEdicao,
    abrirNovoTreino,
    copiarTreinoWhatsApp,
    duplicarTreino,
    fecharBibliotecaModelos,
    fecharDetalhes,
    fecharModal,
    gerarTreinoBase,
    limparFiltros,
    limparContextoAluno,
    removerTreino,
    removerModeloPessoal,
    salvarModeloPessoal,
    salvarTreino,
    atualizarModeloPessoal,
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

function normalizarRegistrosAluno(registros, alunos) {
  const alunosPorId = new Map(alunos.map((aluno) => [aluno.id, aluno]));
  const alunosPorNome = agruparAlunosPorNome(alunos);

  return registros.map((registro) => {
    const alunoPorId = registro.alunoId ? alunosPorId.get(registro.alunoId) : null;
    const alunoUnicoPorNome = !registro.alunoId
      ? obterAlunoUnicoPorNome(registro.aluno, alunosPorNome)
      : null;
    const alunoResolvido = alunoPorId || alunoUnicoPorNome;
    const nomeAluno = alunoResolvido?.nome || registro.aluno || "Aluno nao identificado";

    return {
      ...registro,
      alunoId: alunoResolvido?.id || registro.alunoId || "",
      aluno: nomeAluno,
      nomeAluno,
      alunoWhatsapp: alunoResolvido?.whatsapp || registro.alunoWhatsapp || "",
      alunoIdentificado: Boolean(alunoResolvido),
    };
  });
}

function agruparAlunosPorNome(alunos) {
  const grupos = new Map();

  alunos.forEach((aluno) => {
    const chave = normalizarNome(aluno.nome);
    if (!chave) return;

    grupos.set(chave, [...(grupos.get(chave) || []), aluno]);
  });

  return grupos;
}

function obterAlunoUnicoPorNome(nome, alunosPorNome) {
  const candidatos = alunosPorNome.get(normalizarNome(nome)) || [];

  return candidatos.length === 1 ? candidatos[0] : null;
}

function normalizarNome(nome) {
  return String(nome || "").trim().toLowerCase();
}
