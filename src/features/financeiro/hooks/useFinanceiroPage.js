import { useEffect, useMemo, useState } from "react";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import {
  atualizarAlunoSupabase,
  buscarAlunosSupabase,
} from "../../../services/alunosService";
import {
  adicionarPagamentoSupabase,
  buscarPagamentosSupabase,
  excluirPagamentoSupabase,
} from "../../../services/pagamentosService";
import { buscarPlanosSupabase } from "../../../services/planosService";
import { abrirWhatsApp } from "../../../services/whatsappService";
import {
  calcularStatus,
  dataHojeISO,
  formatarData,
  formatarNomePlano,
  normalizarAluno,
} from "../../../data/alunosUtils";

export const pagamentoInicial = {
  dataPagamento: dataHojeISO(),
  valor: "",
  formaPagamento: "Pix",
  parcela: 1,
  totalParcelas: 1,
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

  function abrirRegistroPagamento(registro) {
    setModalPagamento(registro);
    setFormPagamento({
      dataPagamento: dataHojeISO(),
      valor: registro.valorParcela.toFixed(2),
      formaPagamento: "Pix",
      parcela: registro.parcelaAtual,
      totalParcelas: registro.totalParcelas,
      observacoes: "",
    });
  }

  async function registrarPagamento() {
    if (!modalPagamento) return;

    const valor = Number(formPagamento.valor || 0);

    if (!formPagamento.dataPagamento || valor <= 0) {
      toast.aviso("Pagamento incompleto", "Informe a data e um valor válido para o pagamento.");
      return;
    }

    const aluno = modalPagamento.aluno;
    setAtualizandoId(aluno.id);
    setErro("");

    try {
      const novoPagamento = await adicionarPagamentoSupabase({
        alunoId: aluno.id,
        dataPagamento: formPagamento.dataPagamento,
        valor,
        formaPagamento: formPagamento.formaPagamento,
        parcela: formPagamento.parcela,
        totalParcelas: formPagamento.totalParcelas,
        observacoes: formPagamento.observacoes,
      });

      await sincronizarStatusPagamento(aluno, [
        ...modalPagamento.pagamentos,
        novoPagamento,
      ]);
      setPagamentos((pagamentosAtuais) => [novoPagamento, ...pagamentosAtuais]);
      await carregarDados();
      fecharModalPagamento();
      toast.sucesso("Pagamento registrado", "O aluno foi atualizado automaticamente.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao registrar pagamento: ${error.message}`);
      toast.erro("Não foi possível registrar o pagamento", "Tente novamente em alguns instantes.");
    } finally {
      setAtualizandoId("");
    }
  }

  async function desfazerPagamento(registro) {
    const pagamento = registro.pagamentoCiclo || registro.ultimoPagamento;

    if (!pagamento) return;
    const confirmado = await confirmar({
      titulo: "Desfazer pagamento?",
      descricao: "O pagamento selecionado será removido do histórico financeiro.",
      textoConfirmar: "Desfazer",
    });

    if (!confirmado) return;

    setAtualizandoId(registro.aluno.id);
    setErro("");

    try {
      await excluirPagamentoSupabase(pagamento.id);
      await sincronizarStatusPagamento(
        registro.aluno,
        registro.pagamentos.filter((item) => item.id !== pagamento.id)
      );
      await carregarDados();
      toast.sucesso("Pagamento desfeito", "O registro foi removido com sucesso.");
    } catch (error) {
      console.error(error);
      setErro(`Erro ao desfazer pagamento: ${error.message}`);
      toast.erro("Não foi possível desfazer o pagamento", "Tente novamente em alguns instantes.");
    } finally {
      setAtualizandoId("");
    }
  }

  async function sincronizarStatusPagamento(aluno, pagamentosAluno) {
    const valorContrato = Number(aluno.valor || 0);
    const planoAluno = planos.find((plano) => plano.id === aluno.plano);
    const totalParcelas = calcularTotalParcelas(aluno, planoAluno);
    const totalRecebido = pagamentosAluno.reduce(
      (total, pagamento) => total + Number(pagamento.valor || 0),
      0
    );
    const ultimoPagamento = [...pagamentosAluno].sort((a, b) =>
      String(b.dataPagamento).localeCompare(String(a.dataPagamento))
    )[0];
    const pagamentoRecebido = valorContrato > 0 && totalRecebido >= valorContrato - 0.01;
    const datasRenovacao = calcularRenovacaoPagamento({
      aluno,
      plano: planoAluno,
      pagamentosAluno,
      totalParcelas,
      pagamentoRecebido,
      dataPagamento: ultimoPagamento?.dataPagamento,
    });
    const vencimentoAtualizado = datasRenovacao.vencimento || aluno.vencimento;
    const alunoAtualizado = await atualizarAlunoSupabase(aluno.id, {
      ...aluno,
      ...datasRenovacao,
      pagamentoRecebido,
      dataPagamento: ultimoPagamento?.dataPagamento || "",
      status: ultimoPagamento ? calcularStatus(vencimentoAtualizado, aluno.plano) : aluno.status,
    });

    setAlunos((alunosAtuais) =>
      alunosAtuais.map((item) =>
        item.id === alunoAtualizado.id ? normalizarAluno(alunoAtualizado) : item
      )
    );
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
    atualizandoId,
    busca,
    carregando,
    desfazerPagamento,
    erro,
    fecharModalPagamento,
    filtroPagamento,
    filtroStatus,
    formPagamento,
    limparFiltros,
    modalPagamento,
    registrarPagamento,
    registrosFiltrados,
    resumo,
    abrirRegistroPagamento,
    enviarAvisoWhatsApp,
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
  const pagamentosOrdenados = [...pagamentosAluno].sort((a, b) =>
    String(b.dataPagamento).localeCompare(String(a.dataPagamento))
  );
  const pagamentoCiclo = pagamentosOrdenados.find(
    (pagamento) => Number(pagamento.parcela) === parcelaAtual
  );
  const totalRecebido = pagamentosAluno.reduce(
    (total, pagamento) => total + Number(pagamento.valor || 0),
    0
  );

  return {
    aluno,
    plano,
    nomePlano: plano?.nome || formatarNomePlano(aluno.plano),
    pagamentos: pagamentosAluno,
    valorContrato,
    totalParcelas,
    parcelaAtual,
    valorParcela,
    pagamentoCiclo,
    ultimoPagamento: pagamentosOrdenados[0] || null,
    recebidoNoCiclo: Boolean(pagamentoCiclo),
    totalRecebido,
    valorPendente: Math.max(valorContrato - totalRecebido, 0),
  };
}

function calcularRenovacaoPagamento({
  aluno,
  plano,
  totalParcelas,
  dataPagamento,
}) {
  const mesesRenovacao = totalParcelas > 1 ? 1 : calcularMesesRenovacao(aluno, plano);
  const dataBase = aluno.vencimento || dataPagamento || aluno.inicio || dataHojeISO();
  const vencimento = adicionarMesesISO(dataBase, mesesRenovacao);

  return montarDatasAviso(vencimento);
}

function calcularMesesRenovacao(aluno, plano) {
  if (aluno.plano === "trimestralParcelado") return 1;
  if (plano?.duracaoMeses) return Math.max(Number(plano.duracaoMeses || 1), 1);

  const textoPlano = `${aluno.plano || ""} ${plano?.nome || ""}`.toLowerCase();

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

function montarDatasAviso(vencimento) {
  const aviso7 = new Date(`${vencimento}T00:00:00`);
  aviso7.setDate(aviso7.getDate() - 7);

  const aviso1 = new Date(`${vencimento}T00:00:00`);
  aviso1.setDate(aviso1.getDate() - 1);

  return {
    vencimento,
    aviso7: aviso7.toISOString().split("T")[0],
    aviso1: aviso1.toISOString().split("T")[0],
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

  return Math.min(Math.max(mesesCompletos, 1), totalParcelas);
}

function montarMensagemVencimentoWhatsApp(registro) {
  const dataVencimento = formatarData(registro.aluno.vencimento);
  const dias = calcularDiasAte(registro.aluno.vencimento);
  const nomeAluno = registro.aluno.nome || "aluno";

  if (dias < 0) {
    return [
      "Oi, tudo bem? 😊",
      "",
      "Passando para informar que o seu plano de acompanhamento já está vencido.",
      "",
      "Caso tenha interesse em continuar com a assessoria, suporte e atualizações dos treinos, me avise para que possamos dar continuidade ao seu acompanhamento e manter sua evolução da melhor forma possível 💪🏼",
      "",
      "Qualquer dúvida ou necessidade de ajuste, estou à disposição!",
      "",
      "CoachFlow - Organize. Guie. Transforme.",
    ].join("\n");
  }

  if (dias === 0) {
    return [
      "🚨 *Vencimento da consultoria hoje*",
      "",
      `Olá, *${nomeAluno}*! Tudo bem? 😊`,
      "",
      `Hoje é a data de vencimento do seu plano de consultoria (*${dataVencimento}*).`,
      "",
      "Para manter seu acompanhamento ativo, atualizações de treino e suporte normalmente, peço que realize o pagamento referente à renovação do plano.",
      "",
      "Qualquer dúvida pode me chamar por aqui. 👊",
      "Obrigado pela confiança no meu trabalho!",
    ].join("\n");
  }

  if (dias === 1) {
    return [
      "⏰ *Seu plano vence amanhã*",
      "",
      `Olá, *${nomeAluno}*! Tudo certo? 😊`,
      "",
      `Passando para lembrar que o vencimento do seu plano de consultoria será *amanhã*, dia *${dataVencimento}*.`,
      "",
      "Caso já tenha realizado o pagamento, pode desconsiderar esta mensagem. 🙏",
      "",
      "Se precisar de qualquer suporte ou tiver alguma dúvida, estou à disposição! 👊",
    ].join("\n");
  }

  return [
    "📅 *Lembrete de vencimento da sua consultoria*",
    "",
    `Olá, *${nomeAluno}*! Tudo bem? 😊`,
    "",
    `Passando para lembrar que o vencimento do seu plano de consultoria acontece daqui a *7 dias*, no dia *${dataVencimento}*.`,
    "",
    "Seu acompanhamento continua normalmente com:",
    "✅ Treino personalizado no aplicativo",
    "✅ Ajustes sempre que necessário",
    "✅ Suporte direto comigo",
    "✅ Acompanhamento da sua evolução",
    "",
    "Qualquer dúvida estou à disposição! 👊",
  ].join("\n");
}

function montarMensagemVencimento(registro) {
  if (registro) return montarMensagemVencimentoWhatsApp(registro);

  const dataVencimento = formatarData(registro.aluno.vencimento);
  const dias = calcularDiasAte(registro.aluno.vencimento);
  const tipoCobranca =
    registro.totalParcelas > 1 ? "próxima parcela da sua assessoria" : "seu plano";

  if (dias === 0) {
    return [
      "Olá, tudo bem?",
      "",
      `Passando para lembrar que ${tipoCobranca} vence hoje, dia ${dataVencimento}.`,
      "",
      "Qualquer dúvida estou à disposição. 💪🏽",
    ].join("\n");
  }

  if (dias === 1) {
    return [
      "Olá, tudo bem?",
      "",
      `Passando para lembrar que ${tipoCobranca} vence amanhã, dia ${dataVencimento}.`,
      "",
      "Qualquer dúvida estou à disposição. 💪🏽",
    ].join("\n");
  }

  return [
    "Olá, tudo bem?",
    "",
    `Passando para lembrar que ${tipoCobranca} vence no dia ${dataVencimento}.`,
    "",
    "Qualquer dúvida estou à disposição. 💪🏽",
  ].join("\n");
}

function calcularDiasAte(data) {
  if (!data) return null;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const alvo = new Date(`${data}T00:00:00`);

  return Math.ceil((alvo - hoje) / (1000 * 60 * 60 * 24));
}
