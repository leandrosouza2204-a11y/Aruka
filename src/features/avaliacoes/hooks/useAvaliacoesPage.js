import { useEffect, useMemo, useState } from "react";
import { calcularComposicaoCorporal } from "../../../data/calculosCorporais";
import { formatarData, formatarDataCurta } from "../../../data/formatters";
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
  formatarErroSupabase,
} from "../../../services/avaliacoesService";
import { formatarEscala } from "../utils/formatters";

export { formatarData, formatarDataCurta, formatarEscala };

export function useAvaliacoesPage() {
  const [alunos, setAlunos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [anamneses, setAnamneses] = useState([]);
  const [modalAvaliacao, setModalAvaliacao] = useState(false);
  const [modalAnamnese, setModalAnamnese] = useState(false);
  const [avaliacaoEditando, setAvaliacaoEditando] = useState(null);
  const [anamneseEditando, setAnamneseEditando] = useState(null);
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState("");
  const [relatorioAberto, setRelatorioAberto] = useState(false);
  const [relatorioAnamneseAberto, setRelatorioAnamneseAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroAluno, setFiltroAluno] = useState("todos");
  const [abaAtiva, setAbaAtiva] = useState("avaliacoes");
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
      const chaveAluno = avaliacao.alunoId || `nome:${avaliacao.aluno}`;
      const atual = porAluno.get(chaveAluno);
      if (!atual || String(avaliacao.data).localeCompare(String(atual.data)) > 0) {
        porAluno.set(chaveAluno, avaliacao);
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
        filtroAluno === "todos" || avaliacao.alunoId === filtroAluno;

      return combinaBusca && combinaAluno;
    });
  }, [busca, filtroAluno, ultimasAvaliacoes]);

  const anamnesesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return [...anamneses]
      .filter((anamnese) => {
        const combinaBusca = anamnese.aluno.toLowerCase().includes(termo);
        const combinaAluno =
          filtroAluno === "todos" || anamnese.alunoId === filtroAluno;

        return combinaBusca && combinaAluno;
      })
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }, [anamneses, busca, filtroAluno]);

  const historicoAluno = useMemo(
    () =>
      avaliacoes
        .filter((avaliacao) => avaliacao.alunoId === alunoSelecionadoId)
        .sort((a, b) => String(a.data).localeCompare(String(b.data))),
    [alunoSelecionadoId, avaliacoes]
  );

  const ultimaAvaliacao = historicoAluno[historicoAluno.length - 1] || null;
  const avaliacaoAnterior =
    historicoAluno.length > 1 ? historicoAluno[historicoAluno.length - 2] : null;
  const primeiraAvaliacao = historicoAluno[0] || null;
  const alunoCadastro = alunos.find((aluno) => aluno.id === alunoSelecionadoId);
  const alunoSelecionado = alunoCadastro?.nome || ultimaAvaliacao?.aluno || "";
  const anamneseAluno =
    [...anamneses]
      .filter((anamnese) => anamnese.alunoId === alunoSelecionadoId)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] ||
    null;
  const alertas = useMemo(
    () => gerarAlertas(avaliacaoAnterior, ultimaAvaliacao, anamneseAluno),
    [avaliacaoAnterior, ultimaAvaliacao, anamneseAluno]
  );

  async function salvarAvaliacao(avaliacao) {
    const aluno = alunos.find((item) => item.id === avaliacao.alunoId);

    if (!aluno) {
      toast.aviso("Aluno obrigatório", "Selecione um aluno cadastrado.");
      return;
    }

    try {
      const payload = {
        ...avaliacao,
        alunoId: aluno.id,
        aluno: aluno.nome,
        nomeAluno: aluno.nome,
      };

      if (avaliacaoEditando) {
        await atualizarAvaliacaoSupabase(avaliacaoEditando.id, payload);
      } else {
        await adicionarAvaliacaoSupabase(payload);
      }

      await carregarDados();
      setAlunoSelecionadoId(aluno.id);
      setAbaAtiva("avaliacoes");
      fecharModalAvaliacao();
      toast.sucesso("Avaliação salva", "Os dados da avaliação foram atualizados.");
    } catch (error) {
      console.error("Erro ao salvar avaliação no Supabase:", formatarErroSupabase(error) || error);
      setErro(`Erro ao salvar avaliação: ${error.message}`);
      const erroSchema = error.code === "AVALIACAO_SCHEMA_INCOMPATIVEL";
      toast.erro(
        erroSchema ? "Banco de dados desatualizado" : "Não foi possível salvar a avaliação",
        erroSchema
          ? "A migration de avaliações precisa ser aplicada antes de salvar estes campos."
          : "Verifique aluno e data da avaliação. Se o problema continuar, tente novamente em alguns instantes."
      );
    }
  }

  async function salvarAnamnese(anamnese) {
    const aluno = alunos.find((item) => item.id === anamnese.alunoId);

    if (!aluno) {
      toast.aviso("Aluno obrigatório", "Selecione um aluno cadastrado.");
      return;
    }

    try {
      const payload = {
        ...anamnese,
        alunoId: aluno.id,
        aluno: aluno.nome,
        nomeAluno: aluno.nome,
      };

      if (anamneseEditando) {
        await atualizarAnamneseSupabase(anamneseEditando.id, payload);
      } else {
        await adicionarAnamneseSupabase(payload);
      }

      await carregarDados();
      setAlunoSelecionadoId(aluno.id);
      setAbaAtiva("anamneses");
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

  function editarAnamneseAluno(alunoId) {
    setAnamneseEditando(
      [...anamneses]
        .filter((anamnese) => anamnese.alunoId === alunoId)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] ||
        null
    );
    setModalAnamnese(true);
  }

  function abrirEdicaoAnamnese(anamnese) {
    setAnamneseEditando(anamnese);
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

  function selecionarPerfilAluno(alunoId) {
    setAlunoSelecionadoId(alunoId);
    setRelatorioAberto(false);
    setRelatorioAnamneseAberto(false);
  }

  function abrirRelatorioAnamnese(anamnese) {
    setAlunoSelecionadoId(anamnese.alunoId || "");
    setRelatorioAberto(false);
    setRelatorioAnamneseAberto(true);
  }

  function fecharPerfilAluno() {
    setAlunoSelecionadoId("");
  }

  function alternarRelatorio() {
    setRelatorioAberto((valor) => !valor);
  }

  function alternarRelatorioAnamnese() {
    if (!anamneseAluno) return;
    setRelatorioAnamneseAberto((valor) => !valor);
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
    abaAtiva,
    alertas,
    alunoCadastro,
    alunoSelecionado,
    alunoSelecionadoId,
    anamneseAluno,
    anamneseEditando,
    anamneses,
    anamnesesFiltradas,
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
    relatorioAnamneseAberto,
    relatorioAberto,
    ultimaAvaliacao,
    abrirEdicaoAvaliacao,
    abrirEdicaoAnamnese,
    abrirNovaAnamnese,
    abrirNovaAvaliacao,
    abrirRelatorioAnamnese,
    alternarRelatorio,
    alternarRelatorioAnamnese,
    copiarResumoWhatsApp,
    editarAnamneseAluno,
    fecharModalAnamnese,
    fecharModalAvaliacao,
    fecharPerfilAluno,
    removerAvaliacao,
    salvarAnamnese,
    salvarAvaliacao,
    selecionarPerfilAluno,
    setAbaAtiva,
    setBusca,
    setFiltroAluno,
  };
}

export function vincularAlunos(registros, alunos) {
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
  if (!anterior) return "Sem registro anterior.";
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
  if (!temValor(atual) || !temValor(anterior)) return "Sem registro anterior";
  const valorAtual = Number(String(atual).replace(",", "."));
  const valorAnterior = Number(String(anterior).replace(",", "."));
  if (!Number.isFinite(valorAtual) || !Number.isFinite(valorAnterior)) {
    return "Sem registro anterior";
  }
  const diferenca = valorAtual - valorAnterior;
  const sinal = diferenca > 0 ? "+" : "";
  return `${sinal}${diferenca.toFixed(1)} ${unidade}`;
}

export function formatarKg(valor) {
  if (!temValor(valor)) return "-";
  const numero = Number(String(valor).replace(",", "."));
  return Number.isFinite(numero) ? `${numero.toFixed(1)} kg` : "-";
}

export function formatarCm(valor) {
  if (!temValor(valor)) return "-";
  const numero = Number(String(valor).replace(",", "."));
  return Number.isFinite(numero) ? `${numero.toFixed(1)} cm` : "-";
}

export function formatarPercentual(valor) {
  if (!temValor(valor)) return "-";
  const numero = Number(String(valor).replace(",", "."));
  return Number.isFinite(numero) ? `${numero.toFixed(1)}%` : "-";
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

function temValor(valor) {
  return valor !== "" && valor !== null && valor !== undefined;
}
