import { useEffect, useMemo, useState } from "react";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import {
  atualizarAlunoSupabase,
  buscarAlunosSupabase,
} from "../../../services/alunosService";
import {
  buscarPagamentosSupabase,
  desfazerUltimoPagamento,
  montarRankingFinanceiroAlunos,
  montarResumoFinanceiroAluno,
  registrarPagamento as registrarPagamentoService,
  registrarPagamentoRenovacao,
} from "../../../services/pagamentosService";
import { buscarPlanosSupabase } from "../../../services/planosService";
import {
  abrirWhatsApp,
  obterPrimeiroNome,
} from "../../../services/whatsappService";
import {
  dataHojeISO,
  calcularAvisosVencimento,
  calcularStatus,
  formatarData,
  formatarNomePlano,
  statusEstaVencido,
} from "../../../data/alunosUtils";
import { calcularSituacaoParcelamento } from "../utils/parcelamento";
import { calcularSituacaoAcompanhamento } from "../utils/acompanhamento";

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

export const renovacaoInicial = {
  novoPlanoId: "",
  dataInicio: "",
  registrarPagamentoAgora: true,
  formaPagamento: "Pix",
  observacao: "",
};

export function useFinanceiroPage() {
  const [alunos, setAlunos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroPagamento, setFiltroPagamento] = useState("todos");
  const [visaoAcompanhamento, setVisaoAcompanhamento] = useState("em_acompanhamento");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizandoId, setAtualizandoId] = useState("");
  const [modalPagamento, setModalPagamento] = useState(null);
  const [modalHistorico, setModalHistorico] = useState(null);
  const [modalRenovacao, setModalRenovacao] = useState(null);
  const [modalRelatorioAluno, setModalRelatorioAluno] = useState(null);
  const [modalRelatorioGeral, setModalRelatorioGeral] = useState(false);
  const [formPagamento, setFormPagamento] = useState(pagamentoInicial);
  const [formRenovacao, setFormRenovacao] = useState(renovacaoInicial);
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
        const combinaVisao = registro.grupoAcompanhamento === visaoAcompanhamento;
        const combinaStatus =
          filtroStatus === "todos" || registro.statusAcompanhamento === filtroStatus;
        const combinaPagamento =
          filtroPagamento === "todos" ||
          (filtroPagamento === "recebidos" && registro.pagamentoRecebido) ||
          (filtroPagamento === "pendentes" && !registro.pagamentoRecebido);

        return combinaBusca && combinaVisao && combinaStatus && combinaPagamento;
      })
      .sort((a, b) =>
        String(a.aluno.vencimento).localeCompare(String(b.aluno.vencimento))
      );
  }, [busca, filtroPagamento, filtroStatus, registrosFinanceiros, visaoAcompanhamento]);

  const resumo = useMemo(() => {
    const registrosOperacionais = registrosFinanceiros.filter(
      (registro) => registro.grupoAcompanhamento === "em_acompanhamento"
    );
    const receitaPrevista = registrosOperacionais.reduce(
      (total, registro) => total + registro.valorContrato,
      0
    );
    const receitaRecebida = registrosOperacionais.reduce(
      (total, registro) => total + registro.totalRecebido,
      0
    );
    const receitaPendente = registrosOperacionais.reduce(
      (total, registro) => total + registro.valorPendente,
      0
    );

    return {
      receitaPrevista,
      receitaRecebida,
      receitaPendente,
      alunosAtivos: registrosOperacionais.filter(
        (registro) => registro.statusAcompanhamento === "Ativo"
      ).length,
      alunosVencidos: registrosOperacionais.filter(
        (registro) => registro.statusAcompanhamento === "Aguardando renovação"
      ).length,
    };
  }, [registrosFinanceiros]);

  const rankingFinanceiro = useMemo(
    () => montarRankingFinanceiroAlunos(alunos, pagamentos, planos),
    [alunos, pagamentos, planos]
  );

  const planosAtivos = useMemo(
    () => planos.filter((plano) => plano.ativo !== false),
    [planos]
  );

  const planoRenovacaoSelecionado = useMemo(
    () => planos.find((plano) => plano.id === formRenovacao.novoPlanoId) || null,
    [formRenovacao.novoPlanoId, planos]
  );

  const dadosRenovacaoCalculados = useMemo(() => {
    if (!modalRenovacao || !planoRenovacaoSelecionado || !formRenovacao.dataInicio) {
      return {
        novoVencimento: "",
        aviso7: "",
        aviso1: "",
        valor: 0,
      };
    }

    const datas = calcularDatasRenovacao(
      formRenovacao.dataInicio,
      obterDuracaoPlanoMeses(planoRenovacaoSelecionado)
    );

    return {
      novoVencimento: datas.vencimento,
      aviso7: datas.aviso7,
      aviso1: datas.aviso1,
      valor: Number(planoRenovacaoSelecionado.valor || 0),
    };
  }, [formRenovacao.dataInicio, modalRenovacao, planoRenovacaoSelecionado]);

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

  function abrirRenovacaoPlano(registro) {
    const planosDisponiveis = planosAtivos;
    const planoPadrao =
      planosDisponiveis.find((item) => item.id === registro.aluno.plano) ||
      planosDisponiveis[0] ||
      null;

    if (!planoPadrao) {
      toast.aviso(
        "Nenhum plano disponivel",
        "Cadastre ou ative um plano antes de renovar o aluno."
      );
      return;
    }

    setModalRenovacao(registro);
    setFormRenovacao({
      novoPlanoId: planoPadrao.id,
      dataInicio: statusEstaVencido(registro.statusFinanceiro)
        ? dataHojeISO()
        : registro.aluno.vencimento || dataHojeISO(),
      registrarPagamentoAgora: true,
      formaPagamento: "Pix",
      observacao: "",
    });
  }

  async function confirmarRenovacaoPlano() {
    if (!modalRenovacao) return;

    const aluno = modalRenovacao.aluno;
    const novoPlano = planos.find((plano) => plano.id === formRenovacao.novoPlanoId);
    const valor = Number(novoPlano?.valor || 0);

    if (!novoPlano || !formRenovacao.dataInicio) {
      toast.aviso("Renovacao incompleta", "Informe o novo plano e a data de inicio.");
      return;
    }

    if (valor <= 0) {
      toast.aviso("Valor invalido", "O novo plano precisa ter um valor valido.");
      return;
    }

    const datasRenovacao = calcularDatasRenovacao(
      formRenovacao.dataInicio,
      obterDuracaoPlanoMeses(novoPlano)
    );

    setAtualizandoId(aluno.id);
    setErro("");

    try {
      await atualizarAlunoSupabase(aluno.id, {
        ...aluno,
        plano: novoPlano.id,
        valor,
        inicio: formRenovacao.dataInicio,
        vencimento: datasRenovacao.vencimento,
        aviso7: datasRenovacao.aviso7,
        aviso1: datasRenovacao.aviso1,
        pagamentoRecebido: Boolean(formRenovacao.registrarPagamentoAgora),
        dataPagamento: formRenovacao.registrarPagamentoAgora ? dataHojeISO() : "",
        status: "Ativo",
        acompanhamentoStatus: "ativo",
        acompanhamentoEncerradoEm: "",
        acompanhamentoMotivo: "",
      });

      if (formRenovacao.registrarPagamentoAgora) {
        await registrarPagamentoRenovacao(
          aluno,
          {
            dataPagamento: dataHojeISO(),
            valor,
            formaPagamento: formRenovacao.formaPagamento,
            plano: novoPlano.nome,
            vencimentoAnterior: aluno.vencimento || "",
            vencimentoNovo: datasRenovacao.vencimento,
            observacao: formRenovacao.observacao,
          },
          novoPlano
        );
      }

      await carregarDados();
      fecharRenovacaoPlano();
      toast.sucesso("Plano renovado", "O aluno foi atualizado com o novo vencimento.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao renovar plano: ${error.message}`);
      toast.erro("Nao foi possivel renovar o plano", "Tente novamente em alguns instantes.");
    } finally {
      setAtualizandoId("");
    }
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

  async function marcarComoNaoRenovado(registro) {
    const confirmado = await confirmar({
      titulo: "Marcar como não renovado?",
      descricao:
        "Este aluno será removido da lista operacional e movido para Encerrados. Pagamentos, avaliações e treinos permanecerão disponíveis.",
      textoConfirmar: "Marcar como não renovado",
    });

    if (!confirmado) return;

    setAtualizandoId(registro.aluno.id);
    setErro("");

    try {
      await atualizarAlunoSupabase(registro.aluno.id, {
        ...registro.aluno,
        acompanhamentoStatus: "nao_renovado",
        acompanhamentoEncerradoEm: dataHojeISO(),
        acompanhamentoMotivo: "Não renovou",
      });
      await carregarDados();
      toast.sucesso("Aluno movido para Encerrados", "O histórico foi preservado.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao marcar aluno como não renovado: ${error.message}`);
      toast.erro("Não foi possível atualizar o acompanhamento", "Tente novamente em instantes.");
    } finally {
      setAtualizandoId("");
    }
  }

  async function reativarAluno(registro) {
    const confirmado = await confirmar({
      titulo: "Reativar aluno?",
      descricao:
        "O aluno voltará para a lista operacional, mas nenhuma renovação será criada automaticamente. Renove o plano para iniciar um novo ciclo.",
      textoConfirmar: "Reativar aluno",
    });

    if (!confirmado) return;

    setAtualizandoId(registro.aluno.id);
    setErro("");

    try {
      await atualizarAlunoSupabase(registro.aluno.id, {
        ...registro.aluno,
        acompanhamentoStatus: "ativo",
        acompanhamentoEncerradoEm: "",
        acompanhamentoMotivo: "",
      });
      await carregarDados();
      toast.sucesso("Aluno reativado", "Agora renove o plano para iniciar um novo ciclo.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao reativar aluno: ${error.message}`);
      toast.erro("Não foi possível reativar o aluno", "Tente novamente em instantes.");
    } finally {
      setAtualizandoId("");
    }
  }

  function fecharModalPagamento() {
    setModalPagamento(null);
    setFormPagamento(pagamentoInicial);
  }

  function fecharRenovacaoPlano() {
    setModalRenovacao(null);
    setFormRenovacao(renovacaoInicial);
  }

  function limparFiltros() {
    setBusca("");
    setFiltroStatus("todos");
    setFiltroPagamento("todos");
    setVisaoAcompanhamento("em_acompanhamento");
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
    confirmarRenovacaoPlano,
    dadosRenovacaoCalculados,
    desfazerPagamento,
    enviarAvisoWhatsApp,
    erro,
    fecharHistorico: () => setModalHistorico(null),
    fecharModalPagamento,
    fecharRenovacaoPlano,
    fecharRelatorioAluno: () => setModalRelatorioAluno(null),
    fecharRelatorioGeral: () => setModalRelatorioGeral(false),
    filtroPagamento,
    filtroStatus,
    formPagamento,
    formRenovacao,
    limparFiltros,
    marcarComoNaoRenovado,
    modalHistorico,
    modalPagamento,
    modalRenovacao,
    modalRelatorioAluno,
    modalRelatorioGeral,
    planosAtivos,
    rankingFinanceiro,
    registrarPagamento,
    reativarAluno,
    registrosFiltrados,
    resumo,
    setBusca,
    setFiltroPagamento,
    setFiltroStatus,
    setFormPagamento,
    setFormRenovacao,
    setVisaoAcompanhamento,
    visaoAcompanhamento,
  };
}

function montarRegistroFinanceiro(aluno, plano, pagamentosAluno) {
  const valorContrato = Number(aluno.valor || 0);
  const totalParcelas = calcularTotalParcelas(aluno, plano);
  const pagamentosContratoAtual = filtrarPagamentosContratoAtual(aluno, pagamentosAluno);
  const situacaoParcelamento = calcularSituacaoParcelamento({
    aluno,
    plano,
    pagamentos: pagamentosContratoAtual,
    totalParcelas,
  });
  const parcelado = situacaoParcelamento.parcelado;
  const parcelaAtual = parcelado
    ? situacaoParcelamento.proximaParcela || situacaoParcelamento.ultimaParcelaPaga || 1
    : calcularParcelaAtual(aluno.inicio, totalParcelas);
  const valorParcela =
    totalParcelas > 1
      ? Number(plano?.valorParcela || 0) || valorContrato / totalParcelas
      : valorContrato;
  const pagamentosOrdenados = ordenarPagamentos(pagamentosAluno);
  const pagamentosContratoAtualOrdenados = ordenarPagamentos(pagamentosContratoAtual);
  const vencimentoParcelaAtual = parcelado
    ? situacaoParcelamento.proximoVencimento
    : "";
  const avisosParcela = vencimentoParcelaAtual
    ? calcularAvisosVencimento(vencimentoParcelaAtual)
    : { aviso7: "", aviso1: "" };
  const statusFinanceiro = parcelado
    ? situacaoParcelamento.quitado
      ? "Quitado"
      : calcularStatus(situacaoParcelamento.proximoVencimento, "trimestralParcelado")
    : calcularStatus(aluno.vencimento);
  const statusPagamento = calcularStatusPagamento({
    parcelado,
    quitado: situacaoParcelamento.quitado,
    valorPendente: Math.max(
      valorContrato -
        pagamentosContratoAtual.reduce(
          (total, pagamento) => total + Number(pagamento.valor || 0),
          0
        ),
      0
    ),
    statusFinanceiro,
  });
  const acompanhamento = calcularSituacaoAcompanhamento(aluno);
  const pagamentoCiclo = parcelado
    ? pagamentosContratoAtualOrdenados.find(
        (pagamento) => String(pagamento.parcela) === String(parcelaAtual)
      )
    : encontrarPagamentoContratoAtual(aluno, pagamentosContratoAtualOrdenados);
  const recebidoNoCiclo = parcelado
    ? situacaoParcelamento.quitado
    : Boolean(pagamentoCiclo) && !statusEstaVencido(statusFinanceiro);
  const totalRecebido = pagamentosAluno.reduce(
    (total, pagamento) => total + Number(pagamento.valor || 0),
    0
  );
  const totalRecebidoContratoAtual = pagamentosContratoAtual.reduce(
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
    statusParcela: parcelado ? statusFinanceiro : "",
    statusFinanceiro,
    statusPagamento,
    statusAcompanhamento: acompanhamento.status,
    grupoAcompanhamento: acompanhamento.grupo,
    acompanhamento,
    tipoMovimentoSugerido: inferirTipoMovimentoRegistro(aluno, plano, totalParcelas),
    pagamentoCiclo,
    ultimoPagamento: pagamentosOrdenados[0] || null,
    parcelado,
    parcelasPagas: situacaoParcelamento.parcelasPagas,
    ultimaParcelaPaga: situacaoParcelamento.ultimaParcelaPaga,
    dataUltimoPagamento: situacaoParcelamento.dataUltimoPagamento,
    proximaParcela: situacaoParcelamento.proximaParcela,
    proximoVencimento: situacaoParcelamento.proximoVencimento,
    parcelasRestantes: situacaoParcelamento.parcelasRestantes,
    quitado: situacaoParcelamento.quitado,
    pagamentoUltimaParcela: situacaoParcelamento.pagamentoUltimaParcela,
    recebidoNoCiclo,
    pagamentoRecebido: statusPagamento === "Pago" || statusPagamento === "Quitado",
    totalRecebido,
    valorPendente: Math.max(valorContrato - totalRecebidoContratoAtual, 0),
    resumoAluno: montarResumoFinanceiroAluno(aluno, pagamentosAluno, plano),
  };
}

function filtrarPagamentosContratoAtual(aluno, pagamentosAluno) {
  if (!aluno.inicio && !aluno.vencimento) return pagamentosAluno;

  return pagamentosAluno.filter((pagamento) => {
    if (pagamento.vencimentoNovo && pagamento.vencimentoNovo === aluno.vencimento) {
      return true;
    }

    if (
      pagamento.vencimentoParcela &&
      aluno.inicio &&
      aluno.vencimento &&
      pagamento.vencimentoParcela >= aluno.inicio &&
      pagamento.vencimentoParcela <= aluno.vencimento
    ) {
      return true;
    }

    if (!pagamento.dataPagamento || !aluno.inicio) return false;
    if (pagamento.dataPagamento < aluno.inicio) return false;
    if (aluno.vencimento && pagamento.dataPagamento > aluno.vencimento) return false;

    return true;
  });
}

function calcularTotalParcelas(aluno, plano) {
  if (plano?.permiteParcelamento) return Math.max(Number(plano.quantidadeParcelas || 1), 1);
  if (aluno.plano === "trimestralParcelado") return 3;
  if (!plano) return 1;

  return 1;
}

function calcularDatasRenovacao(dataInicio, duracaoMeses) {
  const vencimento = adicionarMesesISO(dataInicio, duracaoMeses);
  const avisos = calcularAvisosVencimento(vencimento);

  return {
    vencimento,
    aviso7: avisos.aviso7,
    aviso1: avisos.aviso1,
  };
}

function obterDuracaoPlanoMeses(plano) {
  if (plano?.duracaoMeses) return Math.max(Number(plano.duracaoMeses || 1), 1);

  const textoPlano = `${plano?.id || ""} ${plano?.nome || ""}`.toLowerCase();

  if (textoPlano.includes("anual")) return 12;
  if (textoPlano.includes("semestral")) return 6;
  if (textoPlano.includes("trimestral")) return 3;

  return 1;
}

function adicionarMesesISO(dataISO, meses) {
  const data = new Date(`${dataISO}T00:00:00`);
  const diaOriginal = data.getDate();

  data.setMonth(data.getMonth() + Number(meses || 1));

  if (data.getDate() !== diaOriginal) {
    data.setDate(0);
  }

  return data.toISOString().split("T")[0];
}

function inferirTipoMovimentoRegistro(aluno, plano, totalParcelas) {
  if (totalParcelas > 1) return "pagamento_parcela";

  return "pagamento_avulso";
}

function calcularStatusPagamento({ parcelado, quitado, valorPendente, statusFinanceiro }) {
  if (parcelado && quitado) return "Quitado";
  if (valorPendente <= 0) return "Pago";
  if (statusEstaVencido(statusFinanceiro)) return "Vencido";

  return "Pendente";
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

  return registro.proximaParcela || registro.totalParcelas;
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
