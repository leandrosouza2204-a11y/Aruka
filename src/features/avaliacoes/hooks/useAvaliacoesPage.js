import { useEffect, useMemo, useState } from "react";
import { calcularComposicaoCorporal } from "../../../data/calculosCorporais";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import { buscarAlunosSupabase } from "../../../services/alunosService";
import {
  adicionarAnamneseSupabase,
  atualizarAnamneseSupabase,
  buscarAnamnesesSupabase,
} from "../../../services/anamnesesService";
import {
  adicionarAvaliacaoSupabase,
  atualizarAvaliacaoSupabase,
  buscarAvaliacoesSupabase,
  excluirAvaliacaoSupabase,
} from "../../../services/avaliacoesService";

export function useAvaliacoesPage() {
  const [alunos, setAlunos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [anamneses, setAnamneses] = useState([]);
  const [modalAvaliacao, setModalAvaliacao] = useState(false);
  const [modalAnamnese, setModalAnamnese] = useState(false);
  const [avaliacaoEditando, setAvaliacaoEditando] = useState(null);
  const [anamneseEditando, setAnamneseEditando] = useState(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState("");
  const [relatorioAberto, setRelatorioAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroAluno, setFiltroAluno] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const toast = useToast();
  const { confirmar } = useConfirm();

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {
      const [alunosSupabase, avaliacoesSupabase, anamnesesSupabase] =
        await Promise.all([
          buscarAlunosSupabase(),
          buscarAvaliacoesSupabase(),
          buscarAnamnesesSupabase(),
        ]);

      setAlunos(alunosSupabase);
      setAvaliacoes(vincularAlunos(avaliacoesSupabase, alunosSupabase));
      setAnamneses(vincularAlunos(anamnesesSupabase, alunosSupabase));
    } catch (error) {
      setErro(`Erro ao carregar avaliações: ${error.message}`);
      setAlunos([]);
      setAvaliacoes([]);
      setAnamneses([]);
    } finally {
      setCarregando(false);
    }
  }

  const ultimasAvaliacoes = useMemo(() => {
    const porAluno = new Map();

    avaliacoes.forEach((avaliacao) => {
      const atual = porAluno.get(avaliacao.aluno);
      if (!atual || String(avaliacao.data).localeCompare(String(atual.data)) > 0) {
        porAluno.set(avaliacao.aluno, avaliacao);
      }
    });

    return [...porAluno.values()].sort((a, b) =>
      String(b.data).localeCompare(String(a.data))
    );
  }, [avaliacoes]);

  const avaliacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return ultimasAvaliacoes.filter((avaliacao) => {
      const combinaBusca = avaliacao.aluno.toLowerCase().includes(termo);
      const combinaAluno =
        filtroAluno === "todos" || avaliacao.aluno === filtroAluno;

      return combinaBusca && combinaAluno;
    });
  }, [busca, filtroAluno, ultimasAvaliacoes]);

  const historicoAluno = useMemo(
    () =>
      avaliacoes
        .filter((avaliacao) => avaliacao.aluno === alunoSelecionado)
        .sort((a, b) => String(a.data).localeCompare(String(b.data))),
    [alunoSelecionado, avaliacoes]
  );

  const ultimaAvaliacao = historicoAluno[historicoAluno.length - 1] || null;
  const avaliacaoAnterior =
    historicoAluno.length > 1 ? historicoAluno[historicoAluno.length - 2] : null;
  const primeiraAvaliacao = historicoAluno[0] || null;
  const alunoCadastro = alunos.find((aluno) => aluno.nome === alunoSelecionado);
  const anamneseAluno =
    anamneses.find((anamnese) => anamnese.aluno === alunoSelecionado) || null;
  const alertas = useMemo(
    () => gerarAlertas(avaliacaoAnterior, ultimaAvaliacao, anamneseAluno),
    [avaliacaoAnterior, ultimaAvaliacao, anamneseAluno]
  );

  async function salvarAvaliacao(avaliacao) {
    const aluno = alunos.find((item) => item.nome === avaliacao.aluno);

    if (!aluno) {
      toast.aviso("Aluno obrigatório", "Selecione um aluno cadastrado.");
      return;
    }

    try {
      const payload = { ...avaliacao, alunoId: aluno.id };

      if (avaliacaoEditando) {
        await atualizarAvaliacaoSupabase(avaliacaoEditando.id, payload);
      } else {
        await adicionarAvaliacaoSupabase(payload);
      }

      await carregarDados();
      setAlunoSelecionado(avaliacao.aluno);
      fecharModalAvaliacao();
      toast.sucesso("Avaliação salva", "Os dados da avaliação foram atualizados.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao salvar avaliação: ${error.message}`);
      toast.erro(
        "Não foi possível salvar a avaliação",
        "Tente novamente em alguns instantes."
      );
    }
  }

  async function salvarAnamnese(anamnese) {
    const aluno = alunos.find((item) => item.nome === anamnese.aluno);

    if (!aluno) {
      toast.aviso("Aluno obrigatório", "Selecione um aluno cadastrado.");
      return;
    }

    try {
      const payload = { ...anamnese, alunoId: aluno.id };

      if (anamneseEditando) {
        await atualizarAnamneseSupabase(anamneseEditando.id, payload);
      } else {
        await adicionarAnamneseSupabase(payload);
      }

      await carregarDados();
      setAlunoSelecionado(anamnese.aluno);
      fecharModalAnamnese();
      toast.sucesso("Anamnese salva", "As informações foram atualizadas.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao salvar anamnese: ${error.message}`);
      toast.erro(
        "Não foi possível salvar a anamnese",
        "Tente novamente em alguns instantes."
      );
    }
  }

  function abrirNovaAvaliacao() {
    setAvaliacaoEditando(null);
    setModalAvaliacao(true);
  }

  function abrirNovaAnamnese() {
    setAnamneseEditando(null);
    setModalAnamnese(true);
  }

  function abrirEdicaoAvaliacao(avaliacao) {
    setAvaliacaoEditando(avaliacao);
    setModalAvaliacao(true);
  }

  function editarAnamneseAluno(aluno) {
    setAnamneseEditando(
      anamneses.find((anamnese) => anamnese.aluno === aluno) || null
    );
    setModalAnamnese(true);
  }

  async function removerAvaliacao(id) {
    const confirmado = await confirmar({
      titulo: "Excluir avaliação?",
      descricao: "Esta ação remove a avaliação selecionada.",
      textoConfirmar: "Excluir",
    });

    if (!confirmado) return;

    try {
      await excluirAvaliacaoSupabase(id);
      await carregarDados();
      toast.sucesso("Avaliação excluída", "O registro foi removido com sucesso.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao excluir avaliação: ${error.message}`);
      toast.erro(
        "Não foi possível excluir a avaliação",
        "Tente novamente em alguns instantes."
      );
    }
  }

  async function copiarResumoWhatsApp() {
    if (!ultimaAvaliacao) return;

    const texto = gerarResumoWhatsApp(
      ultimaAvaliacao,
      avaliacaoAnterior,
      anamneseAluno
    );

    try {
      await navigator.clipboard.writeText(texto);
      toast.sucesso("Resumo copiado", "Agora você pode enviar pelo WhatsApp.");
    } catch {
      window.prompt("Copie o resumo abaixo:", texto);
    }
  }

  function selecionarPerfilAluno(aluno) {
    setAlunoSelecionado(aluno);
    setRelatorioAberto(false);
  }

  function fecharPerfilAluno() {
    setAlunoSelecionado("");
  }

  function alternarRelatorio() {
    setRelatorioAberto((valor) => !valor);
  }

  function fecharModalAvaliacao() {
    setModalAvaliacao(false);
    setAvaliacaoEditando(null);
  }

  function fecharModalAnamnese() {
    setModalAnamnese(false);
    setAnamneseEditando(null);
  }

  return {
    alunos,
    alertas,
    alunoCadastro,
    alunoSelecionado,
    anamneseAluno,
    anamneseEditando,
    avaliacaoAnterior,
    avaliacaoEditando,
    avaliacoes,
    avaliacoesFiltradas,
    busca,
    carregando,
    erro,
    filtroAluno,
    historicoAluno,
    modalAnamnese,
    modalAvaliacao,
    primeiraAvaliacao,
    relatorioAberto,
    ultimaAvaliacao,
    abrirEdicaoAvaliacao,
    abrirNovaAnamnese,
    abrirNovaAvaliacao,
    alternarRelatorio,
    copiarResumoWhatsApp,
    editarAnamneseAluno,
    fecharModalAnamnese,
    fecharModalAvaliacao,
    fecharPerfilAluno,
    removerAvaliacao,
    salvarAnamnese,
    salvarAvaliacao,
    selecionarPerfilAluno,
    setBusca,
    setFiltroAluno,
  };
}

export function vincularAlunos(registros, alunos) {
  const nomesPorId = new Map(alunos.map((aluno) => [aluno.id, aluno.nome]));

  return registros.map((registro) => ({
    ...registro,
    aluno: nomesPorId.get(registro.alunoId) || registro.aluno || "",
  }));
}

export function gerarResumoWhatsApp(avaliacao, anterior, anamnese) {
  const composicao = calcularComposicaoCorporal(avaliacao);
  return [
    `Resumo da avaliação - ${avaliacao.aluno}`,
    `Data: ${formatarData(avaliacao.data)}`,
    `Peso atual: ${formatarKg(avaliacao.peso)}`,
    `% gordura estimado: ${formatarPercentual(composicao.percentualGordura)}`,
    `Massa magra: ${formatarKg(composicao.massaMagra)}`,
    `IMC: ${composicao.imc || "-"}`,
    `Evolução desde a avaliação anterior: ${gerarLinhaEvolucao(
      avaliacao,
      anterior
    )}`,
    `Mensagem: ${mensagemMotivacional(anamnese)}`,
  ].join("\n");
}

export function gerarLinhaEvolucao(atual, anterior) {
  if (!anterior) return "primeira avaliação registrada.";
  const composicaoAtual = calcularComposicaoCorporal(atual);
  const composicaoAnterior = calcularComposicaoCorporal(anterior);
  return `peso ${comparar(atual.peso, anterior.peso, "kg")}, cintura ${comparar(
    atual.medidas?.cintura,
    anterior.medidas?.cintura,
    "cm"
  )}, massa magra ${comparar(
    composicaoAtual.massaMagra,
    composicaoAnterior.massaMagra,
    "kg"
  )}.`;
}

export function mensagemMotivacional(anamnese) {
  if (Number(anamnese?.escalaAdesaoRotina || 0) <= 2) {
    return "Vamos focar em consistência nesta fase. Pequenas entregas bem feitas toda semana geram progresso real.";
  }
  return "Você está construindo resultado com consistência. Mantenha o plano, ajuste o necessário e siga evoluindo.";
}

export function gerarAlertas(anterior, atual, anamnese) {
  if (!atual) return [];
  const alertas = [];
  const cinturaAtual = Number(atual.medidas?.cintura || 0);
  const cinturaAnterior = Number(anterior?.medidas?.cintura || 0);
  const pesoAtual = Number(atual.peso || 0);
  const pesoAnterior = Number(anterior?.peso || 0);
  const adesaoBaixa =
    Number(anamnese?.escalaAdesaoRotina || 0) > 0 &&
    Number(anamnese?.escalaAdesaoRotina || 0) <= 2;
  const dorLesao = String(anamnese?.doresLesoes || "").toLowerCase() === "sim";

  if (cinturaAnterior && cinturaAtual > cinturaAnterior) {
    alertas.push("Alerta: cintura aumentou desde a avaliação anterior.");
  }
  if (
    pesoAnterior &&
    cinturaAnterior &&
    pesoAtual > pesoAnterior &&
    cinturaAtual > cinturaAnterior
  ) {
    alertas.push("Alerta: peso e cintura subiram juntos.");
  }
  if (adesaoBaixa) {
    alertas.push("Alerta: adesão à rotina está baixa.");
  }
  if (dorLesao) {
    alertas.push("Alerta: aluno relatou dor ou lesão na anamnese.");
  }

  return alertas;
}

export function gerarRecomendacoes(avaliacao, anamnese) {
  const itens = [];
  if (Number(anamnese?.escalaSono || 0) <= 2) itens.push("priorizar ajuste de sono");
  if (Number(anamnese?.escalaEstresse || 0) >= 4) {
    itens.push("monitorar estresse e recuperação");
  }
  if (String(anamnese?.doresLesoes || "").toLowerCase() === "sim") {
    itens.push("adaptar exercícios conforme dor ou lesão relatada");
  }
  if (String(avaliacao?.aderenciaTreino || "").toLowerCase().includes("baixa")) {
    itens.push("simplificar rotina para aumentar aderência");
  }
  return itens.length
    ? itens.join("; ")
    : "manter acompanhamento regular e revisar medidas no próximo ciclo.";
}

export function comparar(atual, anterior, unidade) {
  const valorAtual = Number(atual || 0);
  const valorAnterior = Number(anterior || 0);
  if (!valorAtual || !valorAnterior) return "-";
  const diferenca = valorAtual - valorAnterior;
  const sinal = diferenca > 0 ? "+" : "";
  return `${sinal}${diferenca.toFixed(1)} ${unidade}`;
}

export function formatarData(data) {
  if (!data) return "-";
  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

export function formatarDataCurta(data) {
  if (!data) return "-";
  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function formatarKg(valor) {
  return valor ? `${Number(valor).toFixed(1)} kg` : "-";
}

export function formatarCm(valor) {
  return valor ? `${Number(valor).toFixed(1)} cm` : "-";
}

export function formatarPercentual(valor) {
  return valor !== "" ? `${Number(valor).toFixed(1)}%` : "-";
}

export function formatarStatus(status) {
  const mapa = {
    inicial: "Inicial",
    acompanhamento: "Acompanhamento",
    retorno: "Retorno",
    final: "Final",
  };
  return mapa[status] || "Inicial";
}

export function formatarEscala(valor) {
  return valor ? `${valor}/5` : "-";
}
