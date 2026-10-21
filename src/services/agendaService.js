import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";
import { AGENDA_TIME_ZONE, localDateTimeToIso } from "../features/agenda/utils/agendaDate";

export async function buscarCompromissosAgenda(startIso, endIso) {
  const user = await buscarUsuarioLogado();
  const { data: rows, error } = await supabase
    .from("agenda_compromissos")
    .select("*")
    .eq("profissional_id", user.id)
    .lt("inicio", endIso)
    .gt("fim", startIso)
    .order("inicio", { ascending: true });
  if (error) throw error;
  if (!rows?.length) return [];

  const ids = rows.map((row) => row.id);
  const { data: participants, error: participantsError } = await supabase
    .from("agenda_participantes")
    .select("compromisso_id, aluno_id, alunos(id, nome)")
    .eq("profissional_id", user.id)
    .in("compromisso_id", ids);
  if (participantsError) throw participantsError;

  const byCommitment = (participants || []).reduce((map, item) => {
    map[item.compromisso_id] ||= [];
    map[item.compromisso_id].push({ id: item.aluno_id, nome: item.alunos?.nome || "Aluno" });
    return map;
  }, {});
  return rows.map((row) => mapCommitment(row, byCommitment[row.id] || []));
}

export async function criarCompromissoAgenda(form, requestId = crypto.randomUUID()) {
  const recurrence = form.frequencia === "nenhuma" ? null : {
    frequencia: form.frequencia,
    intervalo: Number(form.intervalo || 1),
    dias_semana: form.diasSemana || [],
    ...(form.terminoRecorrencia === "quantidade"
      ? { quantidade: Number(form.quantidade) }
      : { termina_em: form.terminaEm }),
  };
  const { data, error } = await supabase.rpc("agenda_criar_compromisso", {
    p_titulo: form.titulo.trim(),
    p_tipo: form.tipo,
    p_inicio: localDateTimeToIso(form.data, form.inicio),
    p_fim: localDateTimeToIso(form.data, form.fim),
    p_observacoes: form.observacoes?.trim() || "",
    p_aluno_ids: form.alunoIds || [],
    p_recorrencia: recurrence,
    p_client_request_id: requestId,
    p_fuso_horario: AGENDA_TIME_ZONE,
  });
  if (error) throw normalizeAgendaError(error);
  return data;
}

export async function atualizarCompromissoAgenda(id, scope, form) {
  const { data, error } = await supabase.rpc("agenda_atualizar_compromisso", {
    p_compromisso_id: id,
    p_escopo: scope,
    p_titulo: form.titulo.trim(),
    p_tipo: form.tipo,
    p_inicio: localDateTimeToIso(form.data, form.inicio),
    p_fim: localDateTimeToIso(form.data, form.fim),
    p_observacoes: form.observacoes?.trim() || "",
    p_aluno_ids: form.alunoIds || [],
  });
  if (error) throw normalizeAgendaError(error);
  return data;
}

export async function atualizarStatusAgenda(id, status) {
  const { data, error } = await supabase.rpc("agenda_atualizar_status", {
    p_compromisso_id: id,
    p_status: status,
  });
  if (error) throw normalizeAgendaError(error);
  return data;
}

export async function cancelarCompromissoAgenda(id, scope = "ocorrencia") {
  const { data, error } = await supabase.rpc("agenda_cancelar_compromisso", {
    p_compromisso_id: id,
    p_escopo: scope,
  });
  if (error) throw normalizeAgendaError(error);
  return data;
}

export async function buscarCompromissosDoDia(dateKey) {
  return buscarCompromissosAgenda(
    localDateTimeToIso(dateKey, "00:00"),
    localDateTimeToIso(nextDateKey(dateKey), "00:00"),
  );
}

export async function buscarProximosAtendimentos(startIso, limit = 5) {
  const end = new Date(new Date(startIso).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const commitments = await buscarCompromissosAgenda(startIso, end);
  return commitments.filter((item) => item.tipo === "atendimento" && item.status === "agendado").slice(0, limit);
}

export async function buscarResumoAgenda(dateKey) {
  const commitments = await buscarCompromissosDoDia(dateKey);
  return {
    total: commitments.length,
    agendados: commitments.filter((item) => item.status === "agendado").length,
    concluidos: commitments.filter((item) => item.status === "concluido").length,
    faltas: commitments.filter((item) => item.status === "falta").length,
  };
}

export function normalizeAgendaError(error) {
  const detail = `${error?.message || ""} ${error?.details || ""}`;
  if (error?.code === "23P01" || detail.includes("AGENDA_CONFLICT")) {
    return Object.assign(new Error("Já existe um compromisso nesse horário."), { code: "AGENDA_CONFLICT" });
  }
  if (detail.includes("AGENDA_STUDENT_OWNER_MISMATCH")) {
    return Object.assign(new Error("Um dos alunos selecionados não pertence à sua conta."), { code: "AGENDA_FORBIDDEN_STUDENT" });
  }
  if (detail.includes("AGENDA_RECURRENCE")) {
    return Object.assign(new Error("Revise os limites da recorrência."), { code: "AGENDA_INVALID_RECURRENCE" });
  }
  return error instanceof Error ? error : new Error("Não foi possível concluir a operação na agenda.");
}

function mapCommitment(row, alunos) {
  return {
    id: row.id,
    profissionalId: row.profissional_id,
    serieId: row.serie_id || "",
    ocorrenciaOriginal: row.ocorrencia_original || "",
    titulo: row.titulo,
    tipo: row.tipo,
    inicio: row.inicio,
    fim: row.fim,
    status: row.status,
    observacoes: row.observacoes || "",
    isException: Boolean(row.is_exception),
    alunos,
  };
}

function nextDateKey(dateKey) {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}
