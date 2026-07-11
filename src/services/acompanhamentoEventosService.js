import {
  isTipoEventoAcompanhamentoValido,
} from "../features/financeiro/constants/tiposEventosAcompanhamento";
import { dataOuNull } from "../data/formatters";
import { supabase } from "./supabase";

export async function registrarEventoAcompanhamento({
  userId,
  alunoId,
  tipo,
  ocorridoEm,
  motivo,
  motivoDetalhe,
  planoId,
  planoNome,
  vencimentoAnterior,
  vencimentoNovo,
  metadata,
  eventKey,
} = {}) {
  const payload = montarPayloadEventoAcompanhamento({
    userId,
    alunoId,
    tipo,
    ocorridoEm,
    motivo,
    motivoDetalhe,
    planoId,
    planoNome,
    vencimentoAnterior,
    vencimentoNovo,
    metadata,
    eventKey,
  });

  const { data, error } = await supabase
    .from("acompanhamento_eventos")
    .insert(payload)
    .select()
    .single();

  if (error?.code === "23505" && eventKey) {
    return {
      ok: true,
      duplicate: true,
      data: null,
    };
  }

  if (error) {
    console.error("Erro ao registrar evento de acompanhamento:", formatarErroSupabase(error));
    throw error;
  }

  return {
    ok: true,
    duplicate: false,
    data: rowParaEventoAcompanhamento(data),
  };
}

export async function listarEventosAcompanhamento({ userId, alunoId } = {}) {
  validarIdentificador(userId, "userId");

  let query = supabase
    .from("acompanhamento_eventos")
    .select("*")
    .eq("user_id", userId)
    .order("ocorrido_em", { ascending: false })
    .order("created_at", { ascending: false });

  if (alunoId) {
    query = query.eq("aluno_id", alunoId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao listar eventos de acompanhamento:", formatarErroSupabase(error));
    throw error;
  }

  return (data || []).map(rowParaEventoAcompanhamento);
}

export function montarPayloadEventoAcompanhamento({
  userId,
  alunoId,
  tipo,
  ocorridoEm,
  motivo,
  motivoDetalhe,
  planoId,
  planoNome,
  vencimentoAnterior,
  vencimentoNovo,
  metadata,
  eventKey,
} = {}) {
  validarIdentificador(userId, "userId");
  validarIdentificador(alunoId, "alunoId");
  validarTipoEvento(tipo);

  if (metadata !== undefined && !isPlainObject(metadata)) {
    throw new Error("metadata deve ser um objeto simples.");
  }

  return {
    user_id: userId,
    aluno_id: alunoId,
    tipo,
    ocorrido_em: ocorridoEm || undefined,
    motivo: motivo || null,
    motivo_detalhe: motivoDetalhe || null,
    plano_id: planoId || null,
    plano_nome: planoNome || null,
    vencimento_anterior: dataOuNull(vencimentoAnterior),
    vencimento_novo: dataOuNull(vencimentoNovo),
    metadata: metadata || {},
    event_key: eventKey || null,
  };
}

function rowParaEventoAcompanhamento(row) {
  return {
    id: row.id,
    userId: row.user_id,
    alunoId: row.aluno_id,
    tipo: row.tipo,
    ocorridoEm: row.ocorrido_em || "",
    motivo: row.motivo || "",
    motivoDetalhe: row.motivo_detalhe || "",
    planoId: row.plano_id || "",
    planoNome: row.plano_nome || "",
    vencimentoAnterior: row.vencimento_anterior || "",
    vencimentoNovo: row.vencimento_novo || "",
    metadata: row.metadata || {},
    eventKey: row.event_key || "",
    createdAt: row.created_at || "",
  };
}

function validarIdentificador(value, nome) {
  if (!value || typeof value !== "string") {
    throw new Error(`${nome} é obrigatório.`);
  }
}

function validarTipoEvento(tipo) {
  if (!isTipoEventoAcompanhamentoValido(tipo)) {
    throw new Error("Tipo de evento de acompanhamento inválido.");
  }
}

function isPlainObject(value) {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return false;

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function formatarErroSupabase(error) {
  return {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  };
}
