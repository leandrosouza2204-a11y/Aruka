import { useEffect, useMemo, useState } from "react";

import {
  DATA_CORTE_EVENTOS_ACOMPANHAMENTO,
  OPCOES_PERIODO_ACOMPANHAMENTO,
  PERIODO_ACOMPANHAMENTO_PADRAO,
} from "../constants/retencaoConfig";
import { buscarIndicadoresAcompanhamento } from "../../../services/indicadoresAcompanhamentoService";

const INDICADORES_VAZIOS = {
  renovacoes: 0,
  encerramentosManuais: 0,
  reativacoes: 0,
  motivosEncerramento: [],
  totalEventos: 0,
  periodo: {
    dataInicioSolicitada: DATA_CORTE_EVENTOS_ACOMPANHAMENTO,
    dataInicioEfetiva: DATA_CORTE_EVENTOS_ACOMPANHAMENTO,
    dataFim: DATA_CORTE_EVENTOS_ACOMPANHAMENTO,
    limitadoPorDataCorte: false,
  },
};

export function useIndicadoresAcompanhamento() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState(PERIODO_ACOMPANHAMENTO_PADRAO);
  const [indicadores, setIndicadores] = useState(INDICADORES_VAZIOS);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const periodo = useMemo(
    () => calcularPeriodoAcompanhamento(periodoSelecionado),
    [periodoSelecionado]
  );

  useEffect(() => {
    let ativo = true;

    async function carregarIndicadores() {
      setCarregando(true);
      setErro("");

      try {
        const dados = await buscarIndicadoresAcompanhamento(periodo);

        if (!ativo) return;

        setIndicadores(dados);
      } catch (error) {
        if (!ativo) return;

        console.error("Erro ao carregar indicadores de acompanhamento:", {
          code: error?.code,
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
        });
        setIndicadores({
          ...INDICADORES_VAZIOS,
          periodo: {
            ...INDICADORES_VAZIOS.periodo,
            dataInicioSolicitada: periodo.dataInicio,
            dataInicioEfetiva:
              periodo.dataInicio < DATA_CORTE_EVENTOS_ACOMPANHAMENTO
                ? DATA_CORTE_EVENTOS_ACOMPANHAMENTO
                : periodo.dataInicio,
            dataFim: periodo.dataFim,
            limitadoPorDataCorte: periodo.dataInicio < DATA_CORTE_EVENTOS_ACOMPANHAMENTO,
          },
        });
        setErro("Não foi possível carregar os indicadores de acompanhamento.");
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarIndicadores();

    return () => {
      ativo = false;
    };
  }, [periodo]);

  return {
    carregando,
    erro,
    indicadores,
    opcoesPeriodo: OPCOES_PERIODO_ACOMPANHAMENTO,
    periodoSelecionado,
    setPeriodoSelecionado,
  };
}

function calcularPeriodoAcompanhamento(periodoSelecionado) {
  const hoje = new Date();
  const dataFim = obterDataLocalISO(hoje);
  const opcao = OPCOES_PERIODO_ACOMPANHAMENTO.find(
    (item) => item.value === periodoSelecionado
  );

  if (opcao?.value === "ano_atual") {
    return {
      dataInicio: `${hoje.getFullYear()}-01-01`,
      dataFim,
    };
  }

  const dias = Math.max(Number(opcao?.dias || 90), 1);
  const dataInicio = new Date(hoje);
  dataInicio.setDate(dataInicio.getDate() - dias + 1);

  return {
    dataInicio: obterDataLocalISO(dataInicio),
    dataFim,
  };
}

function obterDataLocalISO(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}
