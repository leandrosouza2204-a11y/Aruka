import { useEffect, useMemo, useState } from "react";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import { buscarAlunosSupabase } from "../../../services/alunosService";
import {
  buscarPagamentosSupabase,
  desfazerUltimoPagamento,
  montarRankingFinanceiroAlunos,
  montarResumoFinanceiroAluno,
  registrarPagamento as registrarPagamentoService,
} from "../../../services/pagamentosService";
import { buscarPlanosSupabase } from "../../../services/planosService";
import {
  abrirWhatsApp,
  obterPrimeiroNome,
} from "../../../services/whatsappService";
import {
  dataHojeISO,
  calcularAvisosVencimento,
  calcularResumoParcelasAluno,
  calcularStatus,
  formatarData,
  formatarNomePlano,
  statusEstaVencido,
} from "../../../data/alunosUtils";

export const pagamentoInicial = {
  dataPagamento: dataHojeISO(),
  valor: "",
  formaPagamento: "Pix",
  parcela: 1,
  totalParcelas: 1,
  tipoMovimento: "pagamento_avulso",
  vencimentoParcela: "",
  observacao: "",
  observacoes: "",
};

export function useFinanceiroPage() {
  const [alunos, setAlunos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPagamento, setFiltroPagamento] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizandoId, setAtualizandoId] = useState("");
  const [modalPagamento, setModalPagamento] = useState(null);
  const [modalHistorico, setModalHistorico] = useState(null);
  const [modalRelatorioAluno, setModalRelatorioAluno] = useState(null);
  const [modalRelatorioGeral, setModalRelatorioGeral] = useState(false);
  const [formPagamento, setFormPagamento] = useState(pagamentoInicial);
  const toast = useToast();
  const { confirmar } = useConfirm();

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {
      const [alunosSupabase, pagamentosSupabase, planosSupabase] = await Promise.all([
        buscarAlunosSupabase(),
        buscarPagamentosSupabase(),
        buscarPlanosSupabase(),
      ]);

      setAlunos(alunosSupabase);
      setPagamentos(pagamentosSupabase);
      setPlanos(planosSupabase);
    } catch (error) {
      setErro(`Erro ao carregar dados financeiros: ${error.message}`);
      setAlunos([]);
      setPagamentos([]);
      setPlanos([]);
    } finally {
      setCarregando(false);
    }
  }

  const planosPorId = useMemo(
    () => new Map(planos.map((plano) => [plano.id, plano])),
    [planos]
  );

  const pagamentosPorAluno = useMemo(() => {
    const mapa = new Map();

    pagamentos.forEach((pagamento) => {
      const pagamentosAluno = mapa.get(pagamento.alunoId) || [];
      pagamentosAluno.push(pagamento);
      mapa.set(pagamento.alunoId, pagamentosAluno);
    });

    return mapa;
  }, [pagamentos]);

  const registrosFinanceiros = useMemo(
    () =>
      alunos.map((aluno) =>
        montarRegistroFinanceiro(
          aluno,
          planosPorId.get(aluno.plano),
          pagamentosPorAluno.get(aluno.id) || []
        )
      ),
    [alunos, pagamentosPorAluno, planosPorId]
  );

  const registrosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return registrosFinanceiros
      .filter((registro) => {
        const combinaBusca = registro.aluno.nome.toLowerCase().includes(termo);
        const combinaStatus =
          filtroStatus === "todos" || registro.statusFinanceiro === filtroStatus;
        const combinaPagamento =
          filtroPagamento === "todos" ||
          (filtroPagamento === "recebidos" && registro.recebidoNoCiclo) ||
          (filtroPagamento === "pendentes" && !registro.recebidoNoCiclo);

        return combinaBusca && combinaStatus && combinaPagamento;
      })
      .sort((a, b) =>
        String(a.aluno.vencimento).localeCompare(String(b.aluno.vencimento))
      );
  }, [busca, filtroPagamento, filtroStatus, registrosFinanceiros]);

  const resumo = useMemo(() => {
    const receitaPrevista = registrosFinanceiros.reduce(
      (total, registro) => total + registro.valorContrato,
      0
    );
    const receitaRecebida = registrosFinanceiros.reduce(
      (total, registro) => total + registro.totalRecebido,
      0
    );
    const receitaPendente = registrosFinanceiros.reduce(
      (total, registro) => total + registro.valorPendente,
      0
    );

    return {
      receitaPrevista,
      receitaRecebida,
      receitaPendente,
      alunosAtivos: registrosFinanceiros.filter(
        (registro) => registro.statusFinanceiro === "Ativo"
      ).length,
      alunosVencidos: registrosFinanceiros.filter((registro) =>
        statusEstaVencido(registro.statusFinanceiro)
      ).length,
    };
  }, [registrosFinanceiros]);

  const rankingFinanceiro = useMemo(
    () => montarRankingFinanceiroAlunos(alunos, pagamentos, planos),
    [alunos, pagamentos, planos]
  );

  function abrirRegistroPagamento(registro) {
    setModalPagamento(registro);
    setFormPagamento({
      dataPagamento: dataHojeISO(),
      valor: registro.valorParcela.toFixed(2),
      formaPagamento: "Pix",
      parcela: proximaParcela(registro),
      totalParcelas: registro.totalParcelas,
      tipoMovimento: registro.tipoMovimentoSugerido,
      vencimentoParcela: registro.vencimentoParcelaAtual,
      observacao: "",
      observacoes: "",
    });
  }

  function abrirHistorico(registro) {
    setModalHistorico(registro);
  }

  function abrirRelatorioAluno(registro) {
    setModalRelatorioAluno(registro);
  }

  function abrirRenovacaoPlano() {
    toast.aviso(
      "Renovação em etapa futura",
      "O recebimento agora não renova planos parcelados. Use esta ação futuramente para renovar o plano separado do pagamento."
    );
  }

  async function registrarPagamento() {
    if (!modalPagamento) return;

    const valor = Number(formPagamento.valor || 0);

    if (!formPagamento.dataPagamento || valor <= 0) {
      toast.aviso("Pagamento incompleto", "Informe a data e um valor válido para o pagamento.");
      return;
    }

    const aluno = modalPagamento.aluno;
    const plano = planos.find((item) => item.id === aluno.plano);
    setAtualizandoId(aluno.id);
    setErro("");

    try {
      await registrarPagamentoService(
        aluno,
        {
          dataPagamento: formPagamento.dataPagamento,
          valor,
          formaPagamento: formPagamento.formaPagamento,
          parcela: formPagamento.parcela,
          totalParcelas: formPagamento.totalParcelas,
          tipoMovimento: formPagamento.tipoMovimento,
          vencimentoParcela: formPagamento.vencimentoParcela,
          observacao: formPagamento.observacao ?? formPagamento.observacoes ?? "",
          plano: plano?.nome || modalPagamento.nomePlano,
        },
        plano
      );

      await carregarDados();
      fecharModalPagamento();
      toast.sucesso("Pagamento registrado", "Histórico financeiro atualizado.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao registrar pagamento: ${error.message}`);
      toast.erro("Não foi possível registrar o pagamento", "Tente novamente em alguns instantes.");
    } finally {
      setAtualizandoId("");
    }
  }

  async function desfazerPagamento(registro) {
    const pagamento = registro.ultimoPagamento;

    if (!pagamento) return;

    const confirmado = await confirmar({
      titulo: "Desfazer último pagamento?",
      descricao: `Apenas o último pagamento de ${registro.aluno.nome} será removido. Os pagamentos anteriores permanecem no histórico.`,
      textoConfirmar: "Desfazer último",
    });

    if (!confirmado) return;

    setAtualizandoId(registro.aluno.id);
    setErro("");

    try {
      await desfazerUltimoPagamento(registro.aluno.id);
      await carregarDados();
      toast.sucesso("Pagamento desfeito", "O último pagamento foi removido com segurança.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao desfazer pagamento: ${error.message}`);
      toast.erro("Não foi possível desfazer o pagamento", "Tente novamente em alguns instantes.");
    } finally {
      setAtualizandoId("");
    }
  }

  function fecharModalPagamento() {
    setModalPagamento(null);
    setFormPagamento(pagamentoInicial);
  }

  function limparFiltros() {
    setBusca("");
    setFiltroStatus("todos");
    setFiltroPagamento("todos");
  }

  function enviarAvisoWhatsApp(registro) {
    const mensagem = montarMensagemVencimento(registro);
    abrirWhatsApp(registro.aluno.whatsapp, mensagem);
  }

  return {
    abrirHistorico,
    abrirRegistroPagamento,
    abrirRelatorioAluno,
    abrirRenovacaoPlano,
    abrirRelatorioGeral: () => setModalRelatorioGeral(true),
    atualizandoId,
    busca,
    carregando,
    desfazerPagamento,
    enviarAvisoWhatsApp,
    erro,
    fecharHistorico: () => setModalHistorico(null),
    fecharModalPagamento,
    fecharRelatorioAluno: () => setModalRelatorioAluno(null),
    fecharRelatorioGeral: () => setModalRelatorioGeral(false),
    filtroPagamento,
    filtroStatus,
    formPagamento,
    limparFiltros,
    modalHistorico,
    modalPagamento,
    modalRelatorioAluno,
    modalRelatorioGeral,
    rankingFinanceiro,
    registrarPagamento,
    registrosFiltrados,
    resumo,
    setBusca,
    setFiltroPagamento,
    setFiltroStatus,
    setFormPagamento,
  };
}

function montarRegistroFinanceiro(aluno, plano, pagamentosAluno) {
  const valorContrato = Number(aluno.valor || 0);
  const totalParcelas = calcularTotalParcelas(aluno, plano);
  const resumoParcelas = calcularResumoParcelasAluno(
    aluno,
    pagamentosAluno,
    totalParcelas,
    plano?.intervaloParcelasMeses || 1
  );
  const parcelaAtual = resumoParcelas.parcelado
    ? resumoParcelas.parcelaAtual
    : calcularParcelaAtual(aluno.inicio, totalParcelas);
  const valorParcela =
    totalParcelas > 1
      ? Number(plano?.valorParcela || 0) || valorContrato / totalParcelas
      : valorContrato;
  const pagamentosOrdenados = ordenarPagamentos(pagamentosAluno);
  const vencimentoParcelaAtual = resumoParcelas.vencimentoParcelaAtual;
  const avisosParcela = vencimentoParcelaAtual
    ? calcularAvisosVencimento(vencimentoParcelaAtual)
    : { aviso7: "", aviso1: "" };
  const statusFinanceiro =
    resumoParcelas.statusParcela || calcularStatus(aluno.vencimento);
  const pagamentoCiclo = resumoParcelas.parcelado
    ? pagamentosOrdenados.find((pagamento) => String(pagamento.parcela) === String(parcelaAtual))
    : encontrarPagamentoContratoAtual(aluno, pagamentosOrdenados);
  const recebidoNoCiclo = Boolean(pagamentoCiclo) && !statusEstaVencido(statusFinanceiro);
  const totalRecebido = pagamentosAluno.reduce(
    (total, pagamento) => total + Number(pagamento.valor || 0),
    0
  );

  return {
    aluno,
    plano,
    nomePlano: plano?.nome || formatarNomePlano(aluno.plano),
    pagamentos: pagamentosOrdenados,
    valorContrato,
    totalParcelas,
    parcelaAtual,
    valorParcela,
    vencimentoParcelaAtual,
    aviso7Parcela: avisosParcela.aviso7,
    aviso1Parcela: avisosParcela.aviso1,
    statusParcela: resumoParcelas.statusParcela,
    statusFinanceiro,
    tipoMovimentoSugerido: inferirTipoMovimentoRegistro(aluno, plano, totalParcelas),
    pagamentoCiclo,
    ultimoPagamento: pagamentosOrdenados[0] || null,
    recebidoNoCiclo,
    totalRecebido,
    valorPendente: Math.max(valorContrato - totalRecebido, 0),
    resumoAluno: montarResumoFinanceiroAluno(aluno, pagamentosAluno, plano),
  };
}

function calcularTotalParcelas(aluno, plano) {
  if (plano?.permiteParcelamento) return Math.max(Number(plano.quantidadeParcelas || 1), 1);
  if (aluno.plano === "trimestralParcelado") return 3;
  if (!plano) return 1;

  return 1;
}

function inferirTipoMovimentoRegistro(aluno, plano, totalParcelas) {
  if (totalParcelas > 1) return "pagamento_parcela";

  return calcularMesesRenovacao(aluno, plano) <= 1 ? "renovacao_plano" : "pagamento_avulso";
}

function calcularMesesRenovacao(aluno, plano) {
  if (plano?.duracaoMeses) return Math.max(Number(plano.duracaoMeses || 1), 1);
  if (aluno.plano === "trimestralParcelado") return 3;

  const textoPlano = `${aluno.plano || ""} ${plano?.nome || ""}`.toLowerCase();

  if (textoPlano.includes("semestral")) return 6;
  if (textoPlano.includes("trimestral")) return 3;

  return 1;
}

function calcularParcelaAtual(inicio, totalParcelas) {
  if (totalParcelas <= 1 || !inicio) return 1;

  const dataInicio = new Date(`${inicio}T00:00:00`);
  const hoje = new Date();
  let mesesCompletos =
    (hoje.getFullYear() - dataInicio.getFullYear()) * 12 +
    hoje.getMonth() -
    dataInicio.getMonth();

  if (hoje.getDate() < dataInicio.getDate()) {
    mesesCompletos -= 1;
  }

  return Math.min(Math.max(mesesCompletos + 1, 1), totalParcelas);
}

function proximaParcela(registro) {
  if (registro.totalParcelas <= 1) return 1;

  const parcelasPagas = registro.pagamentos.length;
  const proxima = (parcelasPagas % registro.totalParcelas) + 1;

  return proxima;
}

function ordenarPagamentos(pagamentos) {
  return [...pagamentos].sort((a, b) => {
    const data = String(b.dataPagamento).localeCompare(String(a.dataPagamento));
    if (data !== 0) return data;

    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
}

function encontrarPagamentoContratoAtual(aluno, pagamentosOrdenados) {
  if (!aluno.vencimento) return null;

  return pagamentosOrdenados.find(
    (pagamento) =>
      pagamento.vencimentoNovo === aluno.vencimento ||
      pagamento.vencimentoParcela === aluno.vencimento
  );
}

export function montarMensagemVencimento(registro) {
  const cobrancaParcela = registro.totalParcelas > 1 && registro.vencimentoParcelaAtual;
  const dataReferencia = cobrancaParcela
    ? registro.vencimentoParcelaAtual
    : registro.aluno.vencimento;
  const dataVencimento = formatarData(dataReferencia);
  const dias = calcularDiasAte(dataReferencia);
  const primeiroNome = obterPrimeiroNome(registro.aluno.nome);

  if (dias < 0) {
    return [
      "⚠️ *Consultoria com vencimento pendente*",
      "",
      `Olá, *${primeiroNome}*! Tudo bem? 😊`,
      "",
      `Identifiquei que o vencimento do seu plano de consultoria estava previsto para o dia *${dataVencimento}* e consta como *pendente*.`,
      "",
      "Para regularizar seu acompanhamento e manter o suporte ativo normalmente, peço que realize o pagamento assim que possível.",
      "",
      "📲 Qualquer dúvida, estou à disposição.",
    ].join("\n");
  }

  if (dias === 0) {
    return [
      "🚨 *Vencimento da consultoria hoje*",
      "",
      `Olá, *${primeiroNome}*! Tudo bem? 😊`,
      "",
      "Hoje é a data de vencimento do seu plano de consultoria.",
      "",
      "💪 Para manter seu acompanhamento ativo, com:",
      "✅ Treino atualizado",
      "✅ Ajustes sempre que necessário",
      "✅ Suporte direto",
      "✅ Acompanhamento da sua evolução",
      "",
      "Peço que realize o pagamento referente à renovação do plano.",
      "",
      "📲 Qualquer dúvida, estou à disposição.",
    ].join("\n");
  }

  if (dias === 1) {
    return [
      "⏰ *Lembrete de vencimento da consultoria*",
      "",
      `Olá, *${primeiroNome}*! Tudo bem? 😊`,
      "",
      `Passando para lembrar que o vencimento do seu plano de consultoria será *amanhã*, dia *${dataVencimento}*.`,
      "",
      "💪 Para manter seu acompanhamento ativo, com:",
      "✅ Treino atualizado",
      "✅ Ajustes sempre que necessário",
      "✅ Suporte direto",
      "✅ Acompanhamento da sua evolução",
      "",
      "Peço que realize o pagamento até a data de vencimento.",
      "",
      "📲 Qualquer dúvida, estou à disposição.",
    ].join("\n");
  }

  return [
    "📅 *Lembrete de vencimento da consultoria*",
    "",
    `Olá, *${primeiroNome}*! Tudo bem? 😊`,
    "",
    `Passando para lembrar que o vencimento do seu plano de consultoria será em *${dias} dias*, no dia *${dataVencimento}*.`,
    "",
    "💪 Para manter seu acompanhamento ativo, com:",
    "✅ Treino atualizado",
    "✅ Ajustes sempre que necessário",
    "✅ Suporte direto",
    "✅ Acompanhamento da sua evolução",
    "",
    "Peço que se programe para realizar o pagamento até a data de vencimento.",
    "",
    "📲 Qualquer dúvida, estou à disposição.",
  ].join("\n");
}

export function calcularDiasAte(data, hoje = new Date()) {
  if (!data) return null;

  const dataAlvo = extrairPartesData(data);
  const dataAtual = extrairPartesData(hoje);

  if (!dataAlvo || !dataAtual) return null;

  const alvoUtc = Date.UTC(dataAlvo.ano, dataAlvo.mes - 1, dataAlvo.dia);
  const hojeUtc = Date.UTC(dataAtual.ano, dataAtual.mes - 1, dataAtual.dia);

  return Math.round((alvoUtc - hojeUtc) / (1000 * 60 * 60 * 24));
}

function extrairPartesData(data) {
  if (data instanceof Date) {
    if (Number.isNaN(data.getTime())) return null;

    return {
      ano: data.getFullYear(),
      mes: data.getMonth() + 1,
      dia: data.getDate(),
    };
  }

  const correspondencia = String(data).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!correspondencia) return null;

  return {
    ano: Number(correspondencia[1]),
    mes: Number(correspondencia[2]),
    dia: Number(correspondencia[3]),
  };
}
