import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatarData } from "../../../data/formatters";
import { criarModeloTreino } from "../../../data/treinosModelos";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import { buscarAlunosSupabase } from "../../../services/alunosService";
import {
  adicionarTreinoSupabase,
  alterarEstadoTreinoSupabase,
  atualizarTreinoSupabase,
  buscarTreinosPorAlunoSupabase,
  buscarTreinosSupabase,
  entregarTreinoSupabase,
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
  idAlunoBemFormado,
  normalizarAlunoIdContextual,
  removerAlunoIdDoContexto,
  resolverContextoAlunoTreinos,
} from "../utils/treinosContextoAluno";
import {
  atualizarFiltroTreinosNaUrl,
  lerFiltrosTreinosDaUrl,
  limparFiltrosTreinosDaUrl,
} from "../utils/treinosListQueryState";
import { criarErroTreinos } from "../utils/treinosErrorState";
import { templateDataToWorkout } from "../utils/workoutTemplateSanitization";
import {
  WORKOUT_STATUS,
  WORKOUT_LIFECYCLE_STATUS,
  duplicateWorkoutDraft,
} from "../utils/workoutDataContract";
import {
  WORKOUT_LIFECYCLE_FILTER_OPTIONS,
  getWorkoutLifecycleStatus,
} from "../utils/workoutLifecyclePresentation";
import { getWorkoutLifecycleFeedback } from "../utils/workoutLifecycleFeedback";
import { prepareWorkoutTemplateApplicationPayload } from "../utils/workoutTemplateApplication";

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
  const [carregando, setCarregando] = useState(true);
  const contextoAluno = useMemo(
    () => resolverContextoAlunoTreinos({ searchParams, alunos, carregando }),
    [alunos, carregando, searchParams]
  );
  const filtroAluno = contextoAluno.alunoId || "todos";
  const filtrosUrl = useMemo(() => lerFiltrosTreinosDaUrl(searchParams), [searchParams]);
  const busca = filtrosUrl.busca;
  const filtroObjetivo = filtrosUrl.objetivo;
  const filtroNivel = filtrosUrl.nivel;
  const filtroStatus = filtrosUrl.status;
  const alunoIdParametro = useMemo(
    () => normalizarAlunoIdContextual(searchParams),
    [searchParams]
  );
  const [erro, setErro] = useState(null);
  const [retryEmAndamento, setRetryEmAndamento] = useState(false);
  const [acaoTreino, setAcaoTreino] = useState(null);
  const [aplicandoModelo, setAplicandoModelo] = useState(false);
  const [entregandoTreinoId, setEntregandoTreinoId] = useState("");
  const [alterandoEstadoTreinoId, setAlterandoEstadoTreinoId] = useState("");
  const toast = useToast();
  const { confirmar } = useConfirm();

  const opcoesFiltro = useMemo(() => {
    const unicos = (campo) =>
      [...new Set(treinos.map((treino) => treino[campo]).filter(Boolean))].sort();

    return {
      alunos: alunos.map((aluno) => ({ id: aluno.id, nome: aluno.nome })),
      objetivos: unicos("objetivo"),
      niveis: unicos("nivel"),
      status: WORKOUT_LIFECYCLE_FILTER_OPTIONS,
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
      const lifecycleStatus = getWorkoutLifecycleStatus(treino);
      const combinaStatus =
        filtroStatus === "todos"
          ? lifecycleStatus !== WORKOUT_LIFECYCLE_STATUS.ARCHIVED
          : lifecycleStatus === filtroStatus;

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
  const treinosDoAlunoSelecionado = useMemo(
    () =>
      treinoSelecionado?.alunoId
        ? treinos.filter((treino) => treino.alunoId === treinoSelecionado.alunoId)
        : [],
    [treinoSelecionado, treinos]
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
      setErroModelos(error.message || "Não foi possível carregar seus modelos.");
      return [];
    } finally {
      setCarregandoModelos(false);
    }
  }, []);

  const carregarDados = useCallback(async function carregarDados(options = {}) {
    const silencioso = Boolean(options.silencioso);
    if (!silencioso) setCarregando(true);
    setErro(null);

    try {
      const buscarTreinos = idAlunoBemFormado(alunoIdParametro)
        ? buscarTreinosPorAlunoSupabase(alunoIdParametro)
        : buscarTreinosSupabase();
      const [alunosSupabase, treinosSupabase, modelosSupabase] = await Promise.all([
        buscarAlunosSupabase(),
        buscarTreinos,
        carregarModelosPessoais(),
      ]);

      const treinosNormalizados = normalizarRegistrosAluno(treinosSupabase, alunosSupabase);

      setAlunos(alunosSupabase);
      setTreinos(treinosNormalizados);
      setModelosPessoais(modelosSupabase);
      return treinosNormalizados;
    } catch (error) {
      console.error(error);
      setErro(criarErroTreinos("load", error));
      return [];
    } finally {
      if (!silencioso) setCarregando(false);
    }
  }, [alunoIdParametro, carregarModelosPessoais]);

  useEffect(() => {
    const carregamentoInicial = window.setTimeout(() => {
      carregarDados();
    }, 0);

    return () => window.clearTimeout(carregamentoInicial);
  }, [carregarDados]);

  useEffect(() => {
    const resetContextoAluno = window.setTimeout(() => {
      setTreinoSelecionadoId("");
      setTreinoEditando(null);
      setTreinoBase(null);
      setModalAberto(false);
      setModalModelosAberto(false);
    }, 0);

    return () => window.clearTimeout(resetContextoAluno);
  }, [alunoIdParametro]);

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

  async function tentarCarregarNovamente() {
    if (retryEmAndamento || carregando) return;

    setRetryEmAndamento(true);
    try {
      await aguardarProximoFrame();
      await aguardarFeedbackRetry();
      await carregarDados({ silencioso: treinos.length > 0 || alunos.length > 0 });
    } finally {
      setRetryEmAndamento(false);
    }
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

  async function aplicarModeloTreino({ template, student, options } = {}) {
    if (aplicandoModelo) return null;
    const payload = prepareWorkoutTemplateApplicationPayload({ template, student, options });

    try {
      setErro(null);
      setAplicandoModelo(true);
      const treinoSalvo = await adicionarTreinoSupabase(payload);
      await carregarDados();
      setTreinoSelecionadoId(treinoSalvo?.id || "");
      toast.sucesso("Treino criado como rascunho", "Revise a ficha antes de entregar ao aluno.");
      return treinoSalvo;
    } catch (error) {
      console.error(error);
      setErro(criarErroTreinos("save", error));
      toast.erro("Não foi possível aplicar o modelo", error.message || "Revise os dados e tente novamente.");
      throw error;
    } finally {
      setAplicandoModelo(false);
    }
  }

  async function entregarTreino(treino) {
    const id = treino?.id || treino;
    if (!id || entregandoTreinoId || alterandoEstadoTreinoId) return null;
    const feedback = getWorkoutLifecycleFeedback("deliver");

    try {
      setErro(null);
      setEntregandoTreinoId(id);
      const treinoEntregue = await entregarTreinoSupabase(id);
      await carregarDados({ silencioso: true });
      setTreinoSelecionadoId(treinoEntregue?.id || id);
      toast.sucesso(feedback.successTitle, feedback.successDescription);
      return treinoEntregue;
    } catch (error) {
      console.error(error);
      setErro(criarErroTreinos("save", error));
      toast.erro("Não foi possível entregar o treino", error.message || "Tente novamente em instantes.");
      throw error;
    } finally {
      setEntregandoTreinoId("");
    }
  }

  async function alterarLifecycleTreino(treino, lifecycleStatus) {
    const id = treino?.id || treino;
    if (!id || entregandoTreinoId || alterandoEstadoTreinoId) return null;
    const action =
      lifecycleStatus === WORKOUT_LIFECYCLE_STATUS.COMPLETED
        ? "complete"
        : lifecycleStatus === WORKOUT_LIFECYCLE_STATUS.ARCHIVED
          ? "archive"
          : "update";
    const feedback = getWorkoutLifecycleFeedback(action);

    try {
      setErro(null);
      setAlterandoEstadoTreinoId(id);
      const treinoAtualizado = await alterarEstadoTreinoSupabase(id, lifecycleStatus);
      await carregarDados({ silencioso: true });
      setTreinoSelecionadoId(treinoAtualizado?.id || id);
      toast.sucesso(feedback.successTitle, feedback.successDescription);
      return treinoAtualizado;
    } catch (error) {
      console.error(error);
      setErro(criarErroTreinos("save", error));
      toast.erro("Não foi possível alterar o estado", error.message || "Tente novamente em instantes.");
      throw error;
    } finally {
      setAlterandoEstadoTreinoId("");
    }
  }

  function concluirTreino(treino) {
    return alterarLifecycleTreino(treino, WORKOUT_LIFECYCLE_STATUS.COMPLETED);
  }

  function arquivarTreino(treino) {
    return alterarLifecycleTreino(treino, WORKOUT_LIFECYCLE_STATUS.ARCHIVED);
  }

  async function salvarModeloPessoal(metadata, treino) {
    try {
      setErroModelos("");
      const payload = metadata?.metadata ? metadata : null;
      const modelo = await criarModeloPessoalSupabase(
        payload?.metadata || metadata,
        payload?.templateData || treino
      );
      setModelosPessoais((atuais) => [modelo, ...atuais]);
      toast.sucesso("Modelo salvo", mensagemModeloSalvo(payload?.mode));
      setTreinoSelecionadoId(modelo?.id || "");
    } catch (error) {
      console.error(error);
      setErroModelos(error.message || "Não foi possível salvar o modelo.");
      toast.erro("Não foi possível salvar o modelo", "Revise os dados e tente novamente.");
      throw error;
    }
  }

  async function atualizarModeloPessoal(id, metadata, treino) {
    try {
      setErroModelos("");
      const payload = metadata?.metadata ? metadata : null;
      const modelo = await atualizarModeloPessoalSupabase(
        id,
        payload?.metadata || metadata,
        payload?.templateData || treino
      );
      setModelosPessoais((atuais) =>
        atuais.map((item) => (item.id === id ? modelo : item))
      );
      await carregarModelosPessoais().then(setModelosPessoais);
      toast.sucesso("Modelo atualizado", "O modelo pessoal foi atualizado.");
    } catch (error) {
      console.error(error);
      setErroModelos(error.message || "Não foi possível atualizar o modelo.");
      toast.erro("Não foi possível atualizar o modelo", "Tente novamente em instantes.");
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
      setErroModelos(error.message || "Não foi possível excluir o modelo.");
      toast.erro("Não foi possível excluir o modelo", "Tente novamente em instantes.");
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
      setErro(null);

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
      setErro(criarErroTreinos("save", error));
      toast.erro(
        "Não foi possível salvar o treino",
        "Tente novamente em alguns instantes."
      );
      return false;
    }
  }

  async function duplicarTreino(treino) {
    if (acaoTreino) return;

    const treinoDuplicado = duplicateWorkoutDraft(treino);

    try {
      setErro(null);
      setAcaoTreino({ id: treino.id, tipo: "duplicar" });
      const novoTreino = await adicionarTreinoSupabase(treinoDuplicado);
      await carregarDados();
      setTreinoSelecionadoId(novoTreino.id);
      toast.sucesso("Treino duplicado", "Uma cópia foi criada para edição.");
    } catch (error) {
      console.error(error);
      setErro(criarErroTreinos("duplicate", error));
      toast.erro(
        "Não foi possível duplicar o treino",
        "Tente novamente em alguns instantes."
      );
    } finally {
      setAcaoTreino(null);
    }
  }

  async function removerTreino(id) {
    if (acaoTreino) return;

    const confirmado = await confirmar({
      titulo: "Excluir treino?",
      descricao: "Esta ação remove a ficha de treino selecionada.",
      textoConfirmar: "Excluir",
      testIdPrefix: "treino",
    });

    if (!confirmado) return;

    try {
      setErro(null);
      setAcaoTreino({ id, tipo: "excluir" });
      await excluirTreinoSupabase(id);
      await carregarDados();

      if (treinoSelecionadoId === id) {
        setTreinoSelecionadoId("");
      }

      toast.sucesso("Treino excluído", "A ficha foi removida com sucesso.");
    } catch (error) {
      console.error(error);
      setErro(criarErroTreinos("delete", error));
      toast.erro(
        "Não foi possível excluir o treino",
        "Tente novamente em alguns instantes."
      );
    } finally {
      setAcaoTreino(null);
    }
  }

  function limparFiltros() {
    setSearchParams(limparFiltrosTreinosDaUrl(searchParams), { replace: false });
  }

  function setFiltroAluno(valor) {
    const proximos = criarSearchParamsAtuais(searchParams);
    if (!valor || valor === "todos") proximos.delete("alunoId");
    else proximos.set("alunoId", valor);
    setSearchParams(proximos, { replace: false });
  }

  function setBusca(valor) {
    setSearchParams(atualizarFiltroTreinosNaUrl(criarSearchParamsAtuais(searchParams), "busca", valor), {
      replace: true,
    });
  }

  function setFiltroObjetivo(valor) {
    setSearchParams(atualizarFiltroTreinosNaUrl(criarSearchParamsAtuais(searchParams), "objetivo", valor), {
      replace: false,
    });
  }

  function setFiltroNivel(valor) {
    setSearchParams(atualizarFiltroTreinosNaUrl(criarSearchParamsAtuais(searchParams), "nivel", valor), {
      replace: false,
    });
  }

  function setFiltroStatus(valor) {
    setSearchParams(atualizarFiltroTreinosNaUrl(criarSearchParamsAtuais(searchParams), "status", valor), {
      replace: false,
    });
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
    acaoTreino,
    contextoAluno,
    busca,
    carregando,
    erro,
    retryEmAndamento,
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
    treinosDoAlunoSelecionado,
    treinos,
    treinosFiltrados,
    aplicandoModelo,
    carregandoModelos,
    entregandoTreinoId,
    alterandoEstadoTreinoId,
    erroModelos,
    abrirBibliotecaModelos,
    abrirEdicao,
    abrirNovoTreino,
    arquivarTreino,
    aplicarModeloTreino,
    alterarLifecycleTreino,
    concluirTreino,
    copiarTreinoWhatsApp,
    duplicarTreino,
    entregarTreino,
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
    tentarCarregarNovamente,
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
  const normalized = status === WORKOUT_STATUS.IN_REVIEW || status === "Em revisão"
    ? WORKOUT_STATUS.IN_REVIEW
    : status === WORKOUT_STATUS.FINISHED
      ? WORKOUT_STATUS.FINISHED
      : WORKOUT_STATUS.ACTIVE;
  if (normalized === WORKOUT_STATUS.ACTIVE) return "status-badge status-badge-success";
  if (normalized === WORKOUT_STATUS.IN_REVIEW) {
    return "status-badge status-badge-warning";
  }
  if (normalized === WORKOUT_STATUS.FINISHED) return "status-badge status-badge-muted";

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
    const nomeAluno = alunoResolvido?.nome || registro.aluno || "Aluno não identificado";

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

function mensagemModeloSalvo(mode) {
  if (mode === "duplicateOfficial" || mode === "duplicatePersonal") {
    return "Modelo duplicado com sucesso.";
  }
  if (mode === "createFromWorkout") return "Treino salvo como modelo com sucesso.";
  return "Modelo criado com sucesso.";
}

export function mensagemLifecycleAtualizado(lifecycleStatus) {
  if (lifecycleStatus === WORKOUT_LIFECYCLE_STATUS.COMPLETED) {
    return "A ficha foi marcada como concluída.";
  }
  if (lifecycleStatus === WORKOUT_LIFECYCLE_STATUS.ARCHIVED) {
    return "A ficha foi arquivada.";
  }
  if (lifecycleStatus === WORKOUT_LIFECYCLE_STATUS.ACTIVE) {
    return "A ficha ficou ativa.";
  }
  return "A ficha voltou para rascunho.";
}

export function tituloLifecycleAtualizado(lifecycleStatus) {
  if (lifecycleStatus === WORKOUT_LIFECYCLE_STATUS.COMPLETED) return "Treino concluído.";
  if (lifecycleStatus === WORKOUT_LIFECYCLE_STATUS.ARCHIVED) return "Treino arquivado.";
  return "Treino atualizado.";
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

function criarSearchParamsAtuais(fallback) {
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search);
  }

  return new URLSearchParams(fallback);
}

function aguardarProximoFrame() {
  if (typeof window === "undefined") return Promise.resolve();

  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

function aguardarFeedbackRetry() {
  if (typeof window === "undefined") return Promise.resolve();

  return new Promise((resolve) => {
    window.setTimeout(resolve, 120);
  });
}
