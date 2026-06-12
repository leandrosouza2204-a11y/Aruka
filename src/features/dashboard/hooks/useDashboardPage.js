import { useEffect, useMemo, useState } from "react";
import {
  calcularResumoParcelasAluno,
  calcularStatus,
  formatarMoeda,
  normalizarAluno,
} from "../../../data/alunosUtils";
import { buscarAlunosSupabase } from "../../../services/alunosService";
import { buscarPagamentosSupabase } from "../../../services/pagamentosService";
import { buscarPlanosSupabase } from "../../../services/planosService";

export function useDashboardPage() {
  const [alunos, setAlunos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [modalCheckinAberto, setModalCheckinAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDashboard() {
      setCarregando(true);
      setErro("");

      try {
        const [alunosSupabase, pagamentosSupabase, planosSupabase] = await Promise.all([
          buscarAlunosSupabase(),
          buscarPagamentosSupabase(),
          buscarPlanosSupabase(),
        ]);

        setAlunos(alunosSupabase.map(normalizarAluno));
        setPagamentos(pagamentosSupabase);
        setPlanos(planosSupabase);
      } catch (error) {
        setErro(`Erro ao carregar dashboard: ${error.message}`);
        setAlunos([]);
        setPagamentos([]);
        setPlanos([]);
      } finally {
        setCarregando(false);
      }
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

  const receitaPendente = Math.max(receitaPrevista - receitaRecebida, 0);

  const alunosVencendo = useMemo(
    () =>
      alunos.filter((aluno) =>
        ["Vencendo", "Vencendo parcela"].includes(
          calcularStatusDashboard(aluno, pagamentos, planos)
        )
      ).length,
    [alunos, pagamentos, planos]
  );

  const alunosAtrasados = useMemo(
    () =>
      alunos.filter((aluno) =>
        ["Atrasado", "Parcela atrasada"].includes(
          calcularStatusDashboard(aluno, pagamentos, planos)
        )
      ).length,
    [alunos, pagamentos, planos]
  );

  const alunosAtivosCheckin = useMemo(
    () =>
      alunos
        .map(normalizarAluno)
        .filter(
          (aluno) =>
            !["Atrasado", "Parcela atrasada"].includes(
              calcularStatusDashboard(aluno, pagamentos, planos)
            )
        ),
    [alunos, pagamentos, planos]
  );

  const receitaMensal = useMemo(() => gerarReceitaMensal(pagamentos), [pagamentos]);
  const maiorReceitaMensal = Math.max(
    ...receitaMensal.map((mes) => mes.total),
    0
  );

  const alertasConsultoria = useMemo(
    () =>
      montarAlertasConsultoria({
        alunosAtrasados,
        alunosVencendo,
        alunosAtivosCheckin,
        receitaPendente,
      }),
    [alunosAtrasados, alunosAtivosCheckin, alunosVencendo, receitaPendente]
  );

  const metricas = useMemo(
    () => [
      {
        titulo: "Total de Alunos",
        valor: carregando ? "..." : totalAlunos,
        legenda: "Alunos cadastrados",
        tipo: "alunos",
      },
      {
        titulo: "Receita Prevista",
        valor: carregando ? "..." : formatarMoeda(receitaPrevista),
        legenda: "Total previsto no período",
        tipo: "prevista",
      },
      {
        titulo: "Receita Recebida",
        valor: carregando ? "..." : formatarMoeda(receitaRecebida),
        legenda: "Pagamentos já confirmados",
        tipo: "recebida",
        destaque: "#16a34a",
      },
      {
        titulo: "Receita Pendente",
        valor: carregando ? "..." : formatarMoeda(receitaPendente),
        legenda: "Valores ainda pendentes",
        tipo: "pendente",
        destaque: "#dc2626",
      },
      {
        titulo: "Alunos Vencendo",
        valor: carregando ? "..." : alunosVencendo,
        legenda: "Próximos do vencimento",
        tipo: "vencendo",
        destaque: "#f59e0b",
      },
      {
        titulo: "Alunos Atrasados",
        valor: carregando ? "..." : alunosAtrasados,
        legenda: "Necessitam atenção",
        tipo: "atrasados",
        destaque: "#dc2626",
      },
    ],
    [
      alunosAtrasados,
      alunosVencendo,
      carregando,
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
    receitaMensal,
    abrirModalCheckin,
    fecharModalCheckin,
  };
}

function calcularStatusDashboard(aluno, pagamentos, planos) {
  const plano = planos.find((item) => item.id === aluno.plano);
  const pagamentosAluno = pagamentos.filter((pagamento) => pagamento.alunoId === aluno.id);
  const totalParcelas = plano?.permiteParcelamento
    ? plano.quantidadeParcelas
    : aluno.plano === "trimestralParcelado"
      ? 3
      : 1;
  const resumoParcelas = calcularResumoParcelasAluno(
    aluno,
    pagamentosAluno,
    totalParcelas,
    plano?.intervaloParcelasMeses || 1
  );

  return resumoParcelas.statusParcela || calcularStatus(aluno.vencimento, aluno.plano);
}

export function montarAlertasConsultoria({
  alunosAtrasados,
  alunosVencendo,
  alunosAtivosCheckin,
  receitaPendente,
}) {
  const alertas = [];

  if (alunosAtrasados > 0) {
    alertas.push({
      titulo: "Regularizar alunos atrasados",
      texto: "Priorize contato e renegociação para evitar perda de acompanhamento.",
      rotulo: "Atenção",
      tom: "danger",
    });
  }

  if (alunosVencendo > 0) {
    alertas.push({
      titulo: "Enviar lembretes de vencimento",
      texto: "Há contratos ou parcelas próximos do vencimento que podem ser tratados com antecedência.",
      rotulo: "Agenda",
      tom: "warning",
    });
  }

  if (receitaPendente > 0) {
    alertas.push({
      titulo: "Revisar pagamentos pendentes",
      texto: "Confira o financeiro e registre recebimentos já confirmados.",
      rotulo: "Financeiro",
      tom: "info",
    });
  }

  if (alunosAtivosCheckin.length > 0) {
    alertas.push({
      titulo: "Rodar check-in semanal",
      texto: "Use a rotina de contato para manter proximidade com alunos ativos.",
      rotulo: "Check-in",
      tom: "success",
    });
  }

  return alertas;
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
