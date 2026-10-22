import { eventDateKey, formatAgendaTime } from "./agendaDate.js";
import { getInitialStudentIds } from "./studentPicker.js";
import { suggestAgendaEndTime } from "./agendaTime.js";

export function createAgendaInitialForm(editing) {
  const date = editing?.id ? eventDateKey(editing.inicio) : editing?.prefillDate;
  return {
    titulo: editing?.titulo || "",
    tipo: editing?.tipo || "atendimento",
    data: date,
    inicio: editing?.id ? formatAgendaTime(editing.inicio) : "09:00",
    fim: editing?.id ? formatAgendaTime(editing.fim) : "10:00",
    observacoes: editing?.observacoes || "",
    alunoIds: getInitialStudentIds(editing),
    frequencia: "nenhuma",
    intervalo: "1",
    diasSemana: [],
    terminoRecorrencia: "quantidade",
    quantidade: "4",
    terminaEm: date,
  };
}

export function applyAgendaStartChange(form, value) {
  const suggestion = suggestAgendaEndTime(value);
  return {
    form: { ...form, inicio: value, fim: suggestion.value },
    crossesMidnight: suggestion.crossesMidnight,
  };
}
