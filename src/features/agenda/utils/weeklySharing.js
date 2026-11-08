import { addDays, startOfWeek, todayKey, eventDateKey, formatAgendaTime, AGENDA_TIME_ZONE } from './agendaDate.js';

// Convert midnight in the agenda timezone to an instant, independently of the device timezone.
export function agendaMidnight(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const target = Date.UTC(year, month - 1, day);
  let instant = target;
  const formatter = new Intl.DateTimeFormat('en-GB', { timeZone: AGENDA_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  for (let i = 0; i < 3; i++) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(instant)).map(({ type, value }) => [type, value]));
    const represented = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
    instant += target - represented;
  }
  return new Date(instant).toISOString();
}
export function weeklyRange(next = false, now = new Date()) {
  const start = addDays(startOfWeek(todayKey(now)), next ? 7 : 0);
  return { start, end: addDays(start, 7), last: addDays(start, 6) };
}
function activeEventsInRange(events, range) {
  const start = Date.parse(agendaMidnight(range.start));
  const end = Date.parse(agendaMidnight(range.end));
  return events.filter(e => e.tipo === 'atendimento' && e.status === 'agendado' && Date.parse(e.inicio) < end && Date.parse(e.fim) > start);
}
export function individualEvents(events, studentId, range) {
  const seen = new Set();
  return activeEventsInRange(events, range).filter(e => e.alunos?.some(a => a.id === studentId))
    .filter(event => { if (seen.has(event.id)) return false; seen.add(event.id); return true; })
    .map(({ id, inicio, fim }) => ({ id, inicio, fim })).sort((a, b) => Date.parse(a.inicio) - Date.parse(b.inicio));
}
export function eligibleWeeklyStudents(students, events, range) {
  const participants = new Set(activeEventsInRange(events, range).flatMap(event => (event.alunos || []).map(student => student.id)));
  return students.filter(student => student.status !== 'Inativo' || participants.has(student.id));
}
export function dateBR(key) { return key.split('-').reverse().join('/'); }
export function eventLabel(event) {
  const key = eventDateKey(event.inicio);
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: AGENDA_TIME_ZONE }).format(new Date(event.inicio));
  const endKey = eventDateKey(event.fim);
  const endDate = endKey === key ? '' : `, ${dateBR(endKey)}`;
  return `${weekday}, ${dateBR(key)} — ${formatAgendaTime(event.inicio)} às ${formatAgendaTime(event.fim)}${endDate}`;
}
export function messageFor(student, range, events) {
  return `Olá, ${student.nome.trim().split(/\s+/)[0] || 'aluno'}! Tudo bem? 😊💪\n\nSegue nossa agenda de treinos para a semana de ${dateBR(range.start)} a ${dateBR(range.last)}:\n\n${events.map(e => `📅 ${eventLabel(e)}`).join('\n')}\n\n📌 Cancelamentos e remarcações devem ser solicitados com pelo menos 24 horas de antecedência. Solicitações fora desse prazo e faltas sem aviso serão consideradas como aula realizada, sem direito à reposição.\n\n⏰ A tolerância para atrasos é de até 15 minutos. Após esse período, não será possível garantir a realização da aula devido aos atendimentos seguintes.\n\nQualquer dúvida, é só me chamar! 👊`;
}
export function brazilPhone(value) {
  const raw = (value || '').trim();
  const digits = raw.replace(/\D/g, '');
  if ((raw.startsWith('+') || raw.startsWith('00')) && !digits.startsWith(raw.startsWith('00') ? '0055' : '55')) return '';
  const normalized = raw.startsWith('00') ? digits.slice(2) : digits;
  if ((raw.startsWith('+') || raw.startsWith('00')) && ![12, 13].includes(normalized.length)) return '';
  const local = normalized.length === 12 || normalized.length === 13 ? (normalized.startsWith('55') ? normalized.slice(2) : '') : normalized;
  if (!/^[1-9][1-9](?:9[0-9]{8}|[2-5][0-9]{7})$/.test(local)) return '';
  return `55${local}`;
}
export function escapeIcs(value) { return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;'); }
export function foldIcs(line) {
  const encoder = new TextEncoder(); let result = ''; let length = 0;
  for (const char of line) { const bytes = encoder.encode(char).length; if (length + bytes > 75) { result += '\r\n '; length = 1; } result += char; length += bytes; }
  return result;
}
function icsDate(value) { return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z'); }
export function makeIcs(events, now = new Date()) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Aruka//Agenda//PT-BR', 'CALSCALE:GREGORIAN'];
  for (const event of events) lines.push('BEGIN:VEVENT', `UID:${event.id}@agenda.aruka`, `DTSTAMP:${icsDate(now)}`, `DTSTART:${icsDate(event.inicio)}`, `DTEND:${icsDate(event.fim)}`, `SUMMARY:${escapeIcs('Treino com Personal')}`, 'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Lembrete de treino', 'END:VALARM', 'END:VEVENT');
  lines.push('END:VCALENDAR'); return `${lines.map(foldIcs).join('\r\n')}\r\n`;
}
export function calendarFilename(student, range) {
  const name = student.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'aluno';
  return `aruka-agenda-${name}-${range.start}.ics`;
}
