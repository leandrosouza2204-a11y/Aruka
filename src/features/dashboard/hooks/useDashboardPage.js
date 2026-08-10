import { useEffect, useMemo, useState } from "react";
import {
  formatarMoeda,
  normalizarAluno,
  statusEstaVencido,
} from "../../../data/alunosUtils";
import { buscarAlunosSupabase } from "../../../services/alunosService";
import { buscarAvaliacoesSupabase } from "../../../services/avaliacoesService";
import { buscarPagamentosSupabase } from "../../../services/pagamentosService";
import { buscarPlanosSupabase } from "../../../services/planosService";
import { buscarTreinosSupabase } from "../../../services/treinosService";
import {
  gerarResumoReceitaMensal,
  montarAlertasConsultoria,
  montarSinaisFitness,
} from "../utils/dashboardInsights";
import { montarAtencaoCobranca } from "../../financeiro/utils/billingAttention";

export function useDashboardPage() {
  const [alunos, setAlunos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [modalCheckinAberto, setModalCheckinAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [avisoSinais, setAvisoSinais] = useState("");

  useEffect(() => {
    async function carregarDashboard() {
      setCarregando(true);
      setErro("");
      setAvisoSinais("");

      const [
        alunosResultado,
        pagamentosResultado,
        planosResultado,
        treinosResultado,
        avaliacoesResultado,
      ] = await Promise.allSettled([
          buscarAlunosSupabase(),
          buscarPagamentosSupabase(),
          buscarPlanosSupabase(),
          buscarTreinosSupabase(),
          buscarAvaliacoesSupabase(),
      ]);

      if (
        alunosResultado.status === "fulfilled" &&
        pagamentosResultado.status === "fulfilled" &&
        planosResultado.status === "fulfilled"
      ) {
        setAlunos(alunosResultado.value.map(normalizarAluno));
        setPagamentos(pagamentosResultado.value);
        setPlanos(planosResultado.value);
      } else {
        setErro("Não foi possível carregar os dados principais do dashboard. Tente novamente em instantes.");
        setAlunos([]);
        setPagamentos([]);
        setPlanos([]);
      }

      if (treinosResultado.status === "fulfilled") {
        setTreinos(treinosResultado.value);
      } else {
        setTreinos([]);
        setAvisoSinais("Sinais de treinos indisponiveis nesta carga.");
      }

      if (avaliacoesResultado.status === "fulfilled") {
        setAvaliacoes(avaliacoesResultado.value);
      } else {
        setAvaliacoes([]);
        setAvisoSinais((atual) =>
          atual
            ? `${atual} Sinais de avaliacoes indisponiveis nesta carga.`
            : "Sinais de avaliacoes indisponiveis nesta carga."
        );
      }

      setCarregando(false);
    }

    carregarDashboard();
  }, []);

  const totalAlunos = alunos.length;

  const receitaPrevista = useMemo(
    () => alunos.reduce((total, aluno) => total + Number(aluno.valor || 0), 0),
    [alunos]
  );

  const receitaRecebida = useMemo(
    () =>
      pagamentos.reduce(
        (total, pagamento) => total + Number(pagamento.valor || 0),
        0
      ),
    [pagamentos]
  );

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

  const receitaPendente = useMemo(
    () =>
      alunos.reduce((total, aluno) => {
        const pagamentosContratoAtual = filtrarPagamentosContratoAtual(
          aluno,
          pagamentosPorAluno.get(aluno.id) || []
        );
        const totalRecebidoContratoAtual = pagamentosContratoAtual.reduce(
          (subtotal, pagamento) => subtotal + Number(pagamento.valor || 0),
          0
        );

        return total + Math.max(Number(aluno.valor || 0) - totalRecebidoContratoAtual, 0);
      }, 0),
    [alunos, pagamentosPorAluno]
  );

  const statusPorAluno = useMemo(
    () =>
      new Map(
        alunos.map((aluno) => [
          aluno.id,
          calcularStatusDashboard(
            aluno,
            filtrarPagamentosContratoAtual(aluno, pagamentosPorAluno.get(aluno.id) || []),
            planosPorId.get(aluno.plano)
          ),
        ])
      ),
    [alunos, pagamentosPorAluno, planosPorId]
  );

  const contratosVencendo = useMemo(
    () => alunos.filter((aluno) => statusPorAluno.get(aluno.id)?.contrato?.vencendo).length,
    [alunos, statusPorAluno]
  );

  const parcelasVencendo = useMemo(
    () =>
      alunos.filter((aluno) => {
        const parcela = statusPorAluno.get(aluno.id)?.parcela;
        return parcela?.vencendo || parcela?.vencido;
      }).length,
    [alunos, statusPorAluno]
  );

  const alunosVencidos = useMemo(
    () =>
      alunos.filter((aluno) =>
        statusPorAluno.get(aluno.id)?.contrato?.vencido ||
          statusEstaVencido(statusPorAluno.get(aluno.id)?.contrato?.status)
      ).length,
    [alunos, statusPorAluno]
  );

  const alunosAtivosCheckin = useMemo(
    () =>
      alunos
        .map(normalizarAluno)
        .filter(
          (aluno) =>
            !statusPorAluno.get(aluno.id)?.contrato?.vencido
        ),
    [alunos, statusPorAluno]
  );

  const receitaMensal = useMemo(() => gerarReceitaMensal(pagamentos), [pagamentos]);
  const resumoReceitaMensal = useMemo(
    () => gerarResumoReceitaMensal(receitaMensal),
    [receitaMensal]
  );
  const maiorReceitaMensal = Math.max(
    ...receitaMensal.map((mes) => mes.total),
    0
  );

  const sinaisFitness = useMemo(
    () =>
      montarSinaisFitness({
        alunos,
        avaliacoes,
        statusPorAluno,
        treinos,
      }),
    [alunos, avaliacoes, statusPorAluno, treinos]
  );

  const alertasConsultoria = useMemo(
    () =>
      montarAlertasConsultoria({
        alunosVencidos,
        alunosVencendo: contratosVencendo,
        parcelasVencendo,
        alunosAtivosCheckin,
        receitaPendente,
      }),
    [alunosVencidos, alunosAtivosCheckin, contratosVencendo, parcelasVencendo, receitaPendente]
  );

  const onboardingStatus = useMemo(
    () => ({
      temPlano: planos.length > 0,
      temAluno: alunos.length > 0,
      temPagamento: pagamentos.length > 0,
    }),
    [alunos.length, pagamentos.length, planos.length]
  );

  const metricas = useMemo(
    () => [
      {
        titulo: "Total de Alunos",
        valor: carregando ? "..." : totalAlunos,
        legenda: "Alunos cadastrados",
        tipo: "alunos",
        acao: {
          label: "Ver alunos",
          to: "/alunos?origem=dashboard",
          ariaLabel: "Ver lista de alunos cadastrados",
        },
      },
      {
        titulo: "Receita Prevista",
        valor: carregando ? "..." : formatarMoeda(receitaPrevista),
        legenda: "Contratos atuais cadastrados",
        contexto: "Soma do valor vigente de cada aluno.",
        tipo: "prevista",
      },
      {
        titulo: "Receita Recebida",
        valor: carregando ? "..." : formatarMoeda(receitaRecebida),
        legenda: "Historico carregado de pagamentos",
        contexto: "Inclui recebimentos confirmados registrados.",
        tipo: "recebida",
        destaque: "#16a34a",
      },
      {
        titulo: "Receita Pendente",
        valor: carregando ? "..." : formatarMoeda(receitaPendente),
        legenda: "Em aberto nos contratos atuais",
        contexto: "Desconta pagamentos vinculados ao contrato vigente.",
        tipo: "pendente",
        destaque: "#dc2626",
        acao: {
          label: "Revisar financeiro",
          to: "/financeiro?pagamento=pendentes",
          ariaLabel: "Abrir financeiro para revisar pagamentos pendentes",
        },
      },
      {
        titulo: "Contratos vencendo",
        valor: carregando ? "..." : contratosVencendo,
        legenda: "Próximos do vencimento",
        tipo: "vencendo",
        destaque: "#f59e0b",
        acao: {
          label: "Ver contratos",
          to: "/alunos?status=Vencendo&origem=dashboard",
          ariaLabel: "Ver alunos com contrato proximo do vencimento",
        },
      },
      {
        titulo: "Parcelas vencendo",
        valor: carregando ? "..." : parcelasVencendo,
        legenda: "Parcelas em alerta de cobranca",
        tipo: "vencendo",
        destaque: "#f97316",
        acao: {
          label: "Ver parcelas",
          to: "/alunos?status=Vencendo%20parcela&origem=dashboard",
          ariaLabel: "Ver alunos com parcela proxima do vencimento",
        },
      },
      {
        titulo: "Alunos Vencidos",
        valor: carregando ? "..." : alunosVencidos,
        legenda: "Necessitam atenção",
        tipo: "atrasados",
        destaque: "#dc2626",
        acao: {
          label: "Ver vencidos",
          to: "/alunos?status=Vencido&origem=dashboard",
          ariaLabel: "Ver alunos vencidos",
        },
      },
    ],
    [
      alunosVencidos,
      contratosVencendo,
      carregando,
      parcelasVencendo,
      receitaPendente,
      receitaPrevista,
      receitaRecebida,
      totalAlunos,
    ]
  );

  function abrirModalCheckin() {
    setModalCheckinAberto(true);
  }

  function fecharModalCheckin() {
    setModalCheckinAberto(false);
  }

  return {
    alertasConsultoria,
    alunosAtivosCheckin,
    carregando,
    erro,
    maiorReceitaMensal,
    metricas,
    modalCheckinAberto,
    onboardingStatus,
    receitaMensal,
    resumoReceitaMensal,
    sinaisFitness,
    avisoSinais,
    abrirModalCheckin,
    fecharModalCheckin,
  };
}

function calcularStatusDashboard(aluno, pagamentosAluno, plano) {
  return montarAtencaoCobranca({
    aluno,
    plano,
    pagamentos: pagamentosAluno,
  });
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

export function gerarReceitaMensal(pagamentos) {
  const hoje = new Date();

  const meses = Array.from({ length: 6 }, (_, index) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - index), 1);
    const chave = data.toISOString().slice(0, 7);
    const rotulo = data.toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
    });

    return {
      chave,
      rotulo: rotulo.replace(".", ""),
      total: 0,
    };
  });

  const indicePorMes = new Map(meses.map((mes, index) => [mes.chave, index]));

  pagamentos.forEach((pagamento) => {
    if (!pagamento.dataPagamento) return;

    const chave = pagamento.dataPagamento.slice(0, 7);
    const indice = indicePorMes.get(chave);

    if (indice === undefined) return;

    meses[indice].total += Number(pagamento.valor || 0);
  });

  return meses;
}
