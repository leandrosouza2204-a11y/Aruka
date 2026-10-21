const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const AGENDA_TIME_ZONE = "America/Sao_Paulo";
export const AGENDA_VIEWS = ["dia", "semana", "mes"];

export function todayKey(now = new Date(), timeZone = AGENDA_TIME_ZONE) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDays(dateKey, amount) {
  assertDateKey(dateKey);
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function startOfWeek(dateKey) {
  assertDateKey(dateKey);
  const day = new Date(`${dateKey}T00:00:00.000Z`).getUTCDay();
  return addDays(dateKey, day === 0 ? -6 : 1 - day);
}

export function agendaRange(dateKey, view) {
  assertDateKey(dateKey);
  if (view === "dia") return { startKey: dateKey, endKey: addDays(dateKey, 1) };
  if (view === "semana") {
    const startKey = startOfWeek(dateKey);
    return { startKey, endKey: addDays(startKey, 7) };
  }
  const [year, month] = dateKey.split("-").map(Number);
  const startKey = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);
  return { startKey, endKey: nextMonth };
}

export function visibleDateKeys(dateKey, view) {
  const { startKey, endKey } = agendaRange(dateKey, view);
  const keys = [];
  for (let cursor = startKey; cursor < endKey; cursor = addDays(cursor, 1)) keys.push(cursor);
  return keys;
}

export function moveAgendaDate(dateKey, view, direction) {
  if (view === "dia") return addDays(dateKey, direction);
  if (view === "semana") return addDays(dateKey, direction * 7);
  const [year, month, day] = dateKey.split("-").map(Number);
  const moved = new Date(Date.UTC(year, month - 1 + direction, Math.min(day, 28)));
  return moved.toISOString().slice(0, 10);
}

export function localDateTimeToIso(dateKey, time) {
  assertDateKey(dateKey);
  if (!/^\d{2}:\d{2}$/.test(time)) throw new Error("Horário inválido.");
  const date = new Date(`${dateKey}T${time}:00`);
  if (Number.isNaN(date.getTime())) throw new Error("Data ou horário inválido.");
  return date.toISOString();
}

export function eventDateKey(isoValue, timeZone = AGENDA_TIME_ZONE) {
  return todayKey(new Date(isoValue), timeZone);
}

export function formatAgendaDate(dateKey, options = {}) {
  assertDateKey(dateKey);
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: options.year ? "numeric" : undefined,
    weekday: options.weekday ? "short" : undefined,
  }).format(new Date(`${dateKey}T12:00:00.000Z`));
}

export function formatAgendaTime(isoValue, timeZone = AGENDA_TIME_ZONE) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(isoValue));
}

export function eventsByDate(events, timeZone = AGENDA_TIME_ZONE) {
  return events.reduce((groups, event) => {
    const key = eventDateKey(event.inicio, timeZone);
    groups[key] ||= [];
    groups[key].push(event);
    groups[key].sort((a, b) => new Date(a.inicio) - new Date(b.inicio));
    return groups;
  }, {});
}

export function validateAgendaForm(form) {
  const errors = {};
  if (!form.titulo?.trim()) errors.titulo = "Informe um título.";
  if (!form.data) errors.data = "Informe a data.";
  if (!form.inicio) errors.inicio = "Informe o início.";
  if (!form.fim) errors.fim = "Informe o término.";
  if (form.data && form.inicio && form.fim) {
    const start = new Date(`${form.data}T${form.inicio}:00`);
    const end = new Date(`${form.data}T${form.fim}:00`);
    if (end <= start) errors.fim = "O término deve ser posterior ao início.";
    if (end - start > 24 * 60 * 60 * 1000) errors.fim = "A duração máxima é de 24 horas.";
  }
  if (form.tipo === "atendimento" && !form.alunoIds?.length) {
    errors.alunoIds = "Selecione ao menos um aluno para o atendimento.";
  }
  if (form.frequencia !== "nenhuma") {
    if (form.frequencia === "dias_semana" && !form.diasSemana?.length) {
      errors.diasSemana = "Selecione ao menos um dia da semana.";
    }
    if (form.terminoRecorrencia === "quantidade") {
      const amount = Number(form.quantidade);
      if (!Number.isInteger(amount) || amount < 1 || amount > 366) {
        errors.quantidade = "Use entre 1 e 366 ocorrências.";
      }
    } else if (!form.terminaEm || form.terminaEm < form.data) {
      errors.terminaEm = "Informe uma data final válida.";
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

function assertDateKey(dateKey) {
  if (!DATE_KEY_PATTERN.test(dateKey || "")) throw new Error("Data inválida.");
}
