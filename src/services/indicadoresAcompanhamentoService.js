import { DATA_CORTE_EVENTOS_ACOMPANHAMENTO } from "../features/financeiro/constants/retencaoConfig";
import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";

const TIPOS_CONTABILIZADOS = [
  "plano_renovado",
  "acompanhamento_encerrado",
  "acompanhamento_reativado",
];

export async function buscarIndicadoresAcompanhamento({
  userId,
  dataInicio,
  dataFim,
} = {}) {
  const usuario = userId ? { id: userId } : await buscarUsuarioLogado();
  const periodo = normalizarPeriodoConsulta({ dataInicio, dataFim });

  const { data, error } = await supabase
    .from("acompanhamento_eventos")
    .select("tipo,motivo,ocorrido_em")
    .eq("user_id", usuario.id)
    .in("tipo", TIPOS_CONTABILIZADOS)
    .gte("ocorrido_em", `${periodo.dataInicioEfetiva}T00:00:00`)
    .lt("ocorrido_em", `${adicionarDias(periodo.dataFim, 1)}T00:00:00`);

  if (error) {
    console.error("Erro ao buscar indicadores de acompanhamento:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    throw error;
  }

  return montarIndicadores(data || [], periodo);
}

function montarIndicadores(eventos, periodo) {
  const motivos = new Map();
  const indicadores = {
    renovacoes: 0,
    encerramentosManuais: 0,
    reativacoes: 0,
    motivosEncerramento: [],
    totalEventos: eventos.length,
    periodo,
  };

  eventos.forEach((evento) => {
    if (evento.tipo === "plano_renovado") {
      indicadores.renovacoes += 1;
      return;
    }

    if (evento.tipo === "acompanhamento_reativado") {
      indicadores.reativacoes += 1;
      return;
    }

    if (evento.tipo === "acompanhamento_encerrado") {
      indicadores.encerramentosManuais += 1;
      const motivo = normalizarMotivo(evento.motivo);
      motivos.set(motivo, (motivos.get(motivo) || 0) + 1);
    }
  });

  indicadores.motivosEncerramento = Array.from(motivos.entries())
    .map(([motivo, quantidade]) => ({ motivo, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade || a.motivo.localeCompare(b.motivo));

  return indicadores;
}

function normalizarPeriodoConsulta({ dataInicio, dataFim }) {
  const fim = normalizarDataISO(dataFim) || obterDataLocalISO();
  const inicioSolicitado = normalizarDataISO(dataInicio) || fim;
  const dataInicioEfetiva =
    inicioSolicitado < DATA_CORTE_EVENTOS_ACOMPANHAMENTO
      ? DATA_CORTE_EVENTOS_ACOMPANHAMENTO
      : inicioSolicitado;

  return {
    dataInicioSolicitada: inicioSolicitado,
    dataInicioEfetiva,
    dataFim: fim,
    limitadoPorDataCorte: inicioSolicitado < DATA_CORTE_EVENTOS_ACOMPANHAMENTO,
  };
}

function normalizarMotivo(motivo) {
  return String(motivo || "").trim() || "";
}

function normalizarDataISO(valor) {
  const texto = String(valor || "").trim();
  const match = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) return "";

  return `${match[1]}-${match[2]}-${match[3]}`;
}

function obterDataLocalISO(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function adicionarDias(dataISO, dias) {
  const data = new Date(`${dataISO}T00:00:00`);
  data.setDate(data.getDate() + Number(dias || 0));

  return obterDataLocalISO(data);
}
