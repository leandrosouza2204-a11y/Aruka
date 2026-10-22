export const AGENDA_DEFAULT_DURATION_MINUTES = 60;

const TIME_PATTERN = /^(\d{2}):(\d{2})$/;

export function parseAgendaTime(value) {
  const match = TIME_PATTERN.exec(value || "");
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return (hour * 60) + minute;
}

export function formatAgendaMinutes(totalMinutes) {
  if (!Number.isInteger(totalMinutes) || totalMinutes < 0 || totalMinutes >= 24 * 60) return "";
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function splitAgendaTime(value) {
  const minutes = parseAgendaTime(value);
  if (minutes === null) return { hour: "", minute: "" };
  return {
    hour: String(Math.floor(minutes / 60)).padStart(2, "0"),
    minute: String(minutes % 60).padStart(2, "0"),
  };
}

export function combineAgendaTime(hour, minute) {
  const value = `${hour}:${minute}`;
  return parseAgendaTime(value) === null ? "" : value;
}

export function suggestAgendaEndTime(startTime, durationMinutes = AGENDA_DEFAULT_DURATION_MINUTES) {
  const startMinutes = parseAgendaTime(startTime);
  if (startMinutes === null || !Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    return { value: "", crossesMidnight: false };
  }
  const endMinutes = startMinutes + durationMinutes;
  if (endMinutes >= 24 * 60) return { value: "", crossesMidnight: true };
  return { value: formatAgendaMinutes(endMinutes), crossesMidnight: false };
}
