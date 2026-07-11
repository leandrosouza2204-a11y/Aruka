import {
  calcularSituacaoAcompanhamento,
} from "../features/financeiro/utils/acompanhamento";
import {
  MOTIVO_AUTOMATICO_VENCIMENTO,
} from "../features/financeiro/constants/motivosEncerramento";
import {
  ORIGEM_ENCERRAMENTO_AUTOMATICO,
} from "../features/financeiro/constants/retencaoConfig";
import { buscarUsuarioLogado } from "./authSessionService";
import { registrarEventoAcompanhamento } from "./acompanhamentoEventosService";
import { supabase } from "./supabase";

export async function buscarCandidatosEncerramentoAutomatico({
  userId,
  dataReferencia,
} = {}) {
  const usuario = userId ? { id: userId } : await buscarUsuarioLogado();
  const referencia = normalizarDataReferencia(dataReferencia);

  const [alunos, planos, eventos] = await Promise.all([
    buscarAlunosParaEncerramento(usuario.id),
    buscarPlanosParaEncerramento(usuario.id),
    buscarEventosParaEncerramento(usuario.id),
  ]);
  const planosPorId = new Map(planos.map((plano) => [plano.id, plano]));

  return alunos
    .map((aluno) =>
      montarCandidatoEncerramentoAutomatico({
        aluno,
        plano: planosPorId.get(aluno.plano),
        eventos,
        dataReferencia: referencia,
      })
    )
    .filter(Boolean);
}

export async function processarEncerramentosAutomaticos({
  userId,
  dataReferencia,
  dryRun = true,
} = {}) {
  const candidatos = await buscarCandidatosEncerramentoAutomatico({
    userId,
    dataReferencia,
  });

  if (dryRun) {
    return {
      dryRun: true,
      candidatos,
      processados: [],
      erros: [],
    };
  }

  const processados = [];
  const erros = [];

  for (const candidato of candidatos) {
    try {
      await atualizarAlunoComEncerramentoAutomatico(candidato);
      const resultado = await registrarEventoAcompanhamento(
        montarEventoEncerramentoAutomatico(candidato)
      );

      processados.push({
        alunoId: candidato.alunoId,
        eventKey: candidato.eventKey,
        duplicate: Boolean(resultado.duplicate),
      });
    } catch (error) {
      console.error("Falha ao processar encerramento automático:", {
        alunoId: candidato.alunoId,
        eventKey: candidato.eventKey,
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      });
      erros.push({
        alunoId: candidato.alunoId,
        eventKey: candidato.eventKey,
        code: error?.code || "",
        message: error?.message || "Erro desconhecido.",
      });
    }
  }

  return {
    dryRun: false,
    candidatos,
    processados,
    erros,
  };
}

export function montarCandidatoEncerramentoAutomatico({
  aluno,
  plano,
  eventos = [],
  dataReferencia,
} = {}) {
  if (!aluno?.id || !aluno?.userId || !aluno?.vencimento) return null;

  const referencia = normalizarDataReferencia(dataReferencia);
  const situacao = calcularSituacaoAcompanhamento(aluno, criarDataLocal(referencia));

  if (!situacao.encerrado || situacao.manual || situacao.diasAposVencimento <= 90) {
    return null;
  }

  const eventKey = montarEventKeyEncerramentoAutomatico(aluno.id, aluno.vencimento);
  if (eventos.some((evento) => evento.eventKey === eventKey)) return null;
  if (possuiRenovacaoPosteriorAoVencimento(aluno, eventos)) return null;

  return {
    userId: aluno.userId,
    alunoId: aluno.id,
    nome: aluno.nome || "",
    vencimento: aluno.vencimento,
    ocorridoEm: calcularDataOcorrenciaEncerramentoAutomatico(aluno.vencimento),
    diasAposVencimento: situacao.diasAposVencimento,
    statusAtual: aluno.acompanhamentoStatus || "ativo",
    eventKey,
    planoId: plano?.id || "",
    planoNome: plano?.nome || aluno.plano || "",
  };
}

export function montarEventKeyEncerramentoAutomatico(alunoId, vencimento) {
  return `encerramento_automatico:${alunoId}:${vencimento}`;
}

export function calcularDataOcorrenciaEncerramentoAutomatico(vencimento) {
  return adicionarDiasISO(vencimento, 91);
}

function montarEventoEncerramentoAutomatico(candidato) {
  return {
    userId: candidato.userId,
    alunoId: candidato.alunoId,
    tipo: "acompanhamento_encerrado",
    ocorridoEm: candidato.ocorridoEm,
    motivo: MOTIVO_AUTOMATICO_VENCIMENTO,
    motivoDetalhe: "",
    planoId: candidato.planoId || null,
    planoNome: candidato.planoNome,
    vencimentoAnterior: candidato.vencimento,
    metadata: {
      origem: ORIGEM_ENCERRAMENTO_AUTOMATICO,
      dias_apos_vencimento: candidato.diasAposVencimento,
      status_anterior: candidato.statusAtual,
    },
    eventKey: candidato.eventKey,
  };
}

async function atualizarAlunoComEncerramentoAutomatico(candidato) {
  const { error } = await supabase
    .from("alunos")
    .update({
      acompanhamento_status: "encerrado",
      acompanhamento_encerrado_em: candidato.ocorridoEm,
      acompanhamento_motivo: MOTIVO_AUTOMATICO_VENCIMENTO,
      acompanhamento_motivo_detalhe: "",
    })
    .eq("id", candidato.alunoId)
    .eq("user_id", candidato.userId);

  if (error) throw error;
}

async function buscarAlunosParaEncerramento(userId) {
  const { data, error } = await supabase
    .from("alunos")
    .select(
      "id,user_id,nome,vencimento,plano,acompanhamento_status,acompanhamento_encerrado_em,acompanhamento_motivo,acompanhamento_motivo_detalhe"
    )
    .eq("user_id", userId);

  if (error) throw error;

  return (data || []).map(rowParaAluno);
}

async function buscarPlanosParaEncerramento(userId) {
  const { data, error } = await supabase
    .from("planos")
    .select("id,nome")
    .eq("user_id", userId);

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    nome: row.nome || "",
  }));
}

async function buscarEventosParaEncerramento(userId) {
  const { data, error } = await supabase
    .from("acompanhamento_eventos")
    .select("aluno_id,tipo,event_key,motivo,vencimento_anterior,vencimento_novo,metadata")
    .eq("user_id", userId)
    .in("tipo", ["acompanhamento_encerrado", "plano_renovado"]);

  if (error) throw error;

  return (data || []).map(rowParaEvento);
}

function rowParaAluno(row) {
  return {
    id: row.id,
    userId: row.user_id,
    nome: row.nome || "",
    vencimento: row.vencimento || "",
    plano: row.plano || "",
    acompanhamentoStatus: row.acompanhamento_status || "ativo",
    acompanhamentoEncerradoEm: row.acompanhamento_encerrado_em || "",
    acompanhamentoMotivo: row.acompanhamento_motivo || "",
    acompanhamentoMotivoDetalhe: row.acompanhamento_motivo_detalhe || "",
  };
}

function rowParaEvento(row) {
  return {
    alunoId: row.aluno_id,
    tipo: row.tipo,
    eventKey: row.event_key || "",
    motivo: row.motivo || "",
    vencimentoAnterior: row.vencimento_anterior || "",
    vencimentoNovo: row.vencimento_novo || "",
    metadata: row.metadata || {},
  };
}

function possuiRenovacaoPosteriorAoVencimento(aluno, eventos) {
  return eventos.some(
    (evento) =>
      evento.alunoId === aluno.id &&
      evento.tipo === "plano_renovado" &&
      evento.vencimentoAnterior === aluno.vencimento &&
      evento.vencimentoNovo > aluno.vencimento
  );
}

function normalizarDataReferencia(dataReferencia = new Date()) {
  if (dataReferencia instanceof Date) {
    return dataLocalISO(dataReferencia);
  }

  const match = String(dataReferencia || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;

  return dataLocalISO();
}

function criarDataLocal(dataISO) {
  return new Date(`${dataISO}T00:00:00`);
}

function adicionarDiasISO(dataISO, dias) {
  const data = criarDataLocal(dataISO);
  data.setDate(data.getDate() + Number(dias || 0));

  return dataLocalISO(data);
}

function dataLocalISO(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}
