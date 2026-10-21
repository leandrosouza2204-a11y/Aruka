import { Clock3, Repeat2, Users } from "lucide-react";
import { formatAgendaTime } from "../utils/agendaDate";

const TYPE_LABELS = {
  atendimento: "Atendimento",
  pessoal: "Pessoal",
  bloqueio: "Indisponível",
  outro: "Outro",
};

const STATUS_LABELS = {
  agendado: "Agendado",
  concluido: "Concluído",
  falta: "Falta",
  cancelado: "Cancelado",
};

export function AgendaEventCard({ event, onOpen, compact = false }) {
  const studentNames = event.alunos.map((student) => student.nome).join(", ");
  return (
    <button
      type="button"
      className={`agenda-event agenda-event-${event.tipo} agenda-event-${event.status}${compact ? " is-compact" : ""}`}
      onClick={() => onOpen(event)}
      aria-label={`Abrir ${event.titulo}, ${formatAgendaTime(event.inicio)} até ${formatAgendaTime(event.fim)}`}
    >
      <span className="agenda-event-time"><Clock3 aria-hidden="true" size={14} /> {formatAgendaTime(event.inicio)}–{formatAgendaTime(event.fim)}</span>
      <strong>{event.titulo}</strong>
      {!compact && <span className="agenda-event-meta">{TYPE_LABELS[event.tipo]} · {STATUS_LABELS[event.status]}</span>}
      {!compact && studentNames && <span className="agenda-event-students"><Users aria-hidden="true" size={14} /> {studentNames}</span>}
      {event.serieId && <span className="agenda-event-repeat" title="Compromisso recorrente"><Repeat2 aria-label="Recorrente" size={14} /></span>}
    </button>
  );
}

export { STATUS_LABELS, TYPE_LABELS };
