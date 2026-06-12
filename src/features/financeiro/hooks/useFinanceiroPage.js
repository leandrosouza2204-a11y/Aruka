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
import { abrirWhatsApp } from "../../../services/whatsappService";
import {
  dataHojeISO,
  formatarData,
  formatarNomePlano,
} from "../../../data/alunosUtils";

export const pagamentoInicial = {
  dataPagamento: dataHojeISO(),
  valor: "",
  formaPagamento: "Pix",
  parcela: 1,
  totalParcelas: 1,
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

  const registrosFinanceiros = useMemo(
    () =>
      alunos.map((aluno) =>
        montarRegistroFinanceiro(
          aluno,
          planos.find((plano) => plano.id === aluno.plano),
          pagamentos.filter((pagamento) => pagamento.alunoId === aluno.id)
        )
      ),
    [alunos, pagamentos, planos]
  );

  const registrosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return registrosFinanceiros
      .filter((registro) => {
        const combinaBusca = registro.aluno.nome.toLowerCase().includes(termo);
        const combinaStatus =
          filtroStatus === "todos" || registro.aluno.status === filtroStatus;
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
      alunosAtivos: alunos.filter((aluno) => aluno.status === "Ativo").length,
      alunosVencidos: alunos.filter((aluno) => aluno.status === "Atrasado").length,
    };
  }, [alunos, registrosFinanceiros]);

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

  async function registrarPagamento() {
    if (!modalPagamento) return;

    const valor = Number(formPagamento.valor || 0);

    if (!formPagamento.dataPagamento || valor <= 0) {
      toast.aviso("Pagamento incompleto", "Informe a data e um valor valido para o pagamento.");
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
          observacao: formPagamento.observacao ?? formPagamento.observacoes ?? "",
          plano: plano?.nome || modalPagamento.nomePlano,
        },
        plano
      );

      await carregarDados();
      fecharModalPagamento();
      toast.sucesso("Pagamento registrado", "Historico e vencimento foram atualizados.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao registrar pagamento: ${error.message}`);
      toast.erro("Nao foi possivel registrar o pagamento", "Tente novamente em alguns instantes.");
    } finally {
      setAtualizandoId("");
    }
  }

  async function desfazerPagamento(registro) {
    const pagamento = registro.ultimoPagamento;

    if (!pagamento) return;

    const confirmado = await confirmar({
      titulo: "Desfazer ultimo pagamento?",
      descricao: `Apenas o ultimo pagamento de ${registro.aluno.nome} sera removido. Os pagamentos anteriores permanecem no historico.`,
      textoConfirmar: "Desfazer ultimo",
    });

    if (!confirmado) return;

    setAtualizandoId(registro.aluno.id);
    setErro("");

    try {
      await desfazerUltimoPagamento(registro.aluno.id);
      await carregarDados();
      toast.sucesso("Pagamento desfeito", "O ultimo pagamento foi removido com seguranca.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao desfazer pagamento: ${error.message}`);
      toast.erro("Nao foi possivel desfazer o pagamento", "Tente novamente em alguns instantes.");
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
  const parcelaAtual = calcularParcelaAtual(aluno.inicio, totalParcelas);
  const valorParcela = totalParcelas > 1 ? valorContrato / totalParcelas : valorContrato;
  const pagamentosOrdenados = ordenarPagamentos(pagamentosAluno);
  const pagamentoCiclo = pagamentosOrdenados.find(
    (pagamento) => String(pagamento.parcela) === String(parcelaAtual)
  );
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
    pagamentoCiclo,
    ultimoPagamento: pagamentosOrdenados[0] || null,
    recebidoNoCiclo: Boolean(pagamentoCiclo),
    totalRecebido,
    valorPendente: Math.max(valorContrato - totalRecebido, 0),
    resumoAluno: montarResumoFinanceiroAluno(aluno, pagamentosAluno, plano),
  };
}

function calcularTotalParcelas(aluno, plano) {
  if (aluno.plano === "trimestralParcelado") return 3;
  if (!plano) return 1;

  const nome = plano.nome.toLowerCase();

  return nome.includes("parcelado") ? Math.max(Number(plano.duracaoMeses || 1), 1) : 1;
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

function montarMensagemVencimento(registro) {
  const dataVencimento = formatarData(registro.aluno.vencimento);
  const dias = calcularDiasAte(registro.aluno.vencimento);
  const nomeAluno = registro.aluno.nome || "aluno";
  const tipoCobranca =
    registro.totalParcelas > 1 ? "proxima parcela da sua assessoria" : "seu plano";

  if (dias < 0) {
    return [
      "Oi, tudo bem?",
      "",
      `Passando para informar que ${tipoCobranca} ja esta vencido desde ${dataVencimento}.`,
      "",
      "Caso tenha interesse em continuar com a assessoria, me avise para darmos continuidade ao seu acompanhamento.",
      "",
      "Qualquer duvida, estou a disposicao!",
      "",
      "CoachFlow - Organize. Guie. Transforme.",
    ].join("\n");
  }

  if (dias === 0) {
    return [
      "Vencimento da consultoria hoje",
      "",
      `Ola, ${nomeAluno}! Tudo bem?`,
      "",
      `Hoje e a data de vencimento de ${tipoCobranca}: ${dataVencimento}.`,
      "",
      "Para manter seu acompanhamento ativo, peco que realize o pagamento referente a renovacao.",
      "",
      "Qualquer duvida pode me chamar por aqui.",
    ].join("\n");
  }

  if (dias === 1) {
    return [
      "Seu plano vence amanha",
      "",
      `Ola, ${nomeAluno}! Tudo certo?`,
      "",
      `Passando para lembrar que ${tipoCobranca} vence amanha, dia ${dataVencimento}.`,
      "",
      "Caso ja tenha realizado o pagamento, pode desconsiderar esta mensagem.",
    ].join("\n");
  }

  return [
    "Lembrete de vencimento da sua consultoria",
    "",
    `Ola, ${nomeAluno}! Tudo bem?`,
    "",
    `Passando para lembrar que ${tipoCobranca} vence no dia ${dataVencimento}.`,
    "",
    "Qualquer duvida estou a disposicao.",
  ].join("\n");
}

function calcularDiasAte(data) {
  if (!data) return null;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const alvo = new Date(`${data}T00:00:00`);

  return Math.ceil((alvo - hoje) / (1000 * 60 * 60 * 24));
}
