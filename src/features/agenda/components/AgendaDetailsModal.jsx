import AccessibleModal from "../../../components/AccessibleModal";
import { CalendarDays, Clock3, FileText, Repeat2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { eventDateKey, formatAgendaDate, formatAgendaTime } from "../utils/agendaDate";
import { STATUS_LABELS, TYPE_LABELS } from "./AgendaEventCard";

export function AgendaDetailsModal({ event, busy, onCancel, onChangeStatus, onClose, onEdit }) {
  return (
    <AccessibleModal isOpen title={event.titulo} description={`${TYPE_LABELS[event.tipo]} · ${STATUS_LABELS[event.status]}`} onClose={busy ? undefined : onClose} closeOnEscape={!busy} closeOnOverlayClick={!busy} showCloseButton={!busy} size="md" contentClassName="agenda-details-modal" aria-busy={busy || undefined}>
      <dl className="agenda-details-list">
        <div><dt><CalendarDays aria-hidden="true" size={17} /> Data</dt><dd>{formatAgendaDate(eventDateKey(event.inicio), { weekday: true, year: true })}</dd></div>
        <div><dt><Clock3 aria-hidden="true" size={17} /> Horário</dt><dd>{formatAgendaTime(event.inicio)}–{formatAgendaTime(event.fim)}</dd></div>
        <div><dt><Users aria-hidden="true" size={17} /> Participantes</dt><dd>{event.alunos.length ? <span className="agenda-details-students">{event.alunos.map((student) => <Link key={student.id} to={`/alunos?alunoId=${encodeURIComponent(student.id)}&origem=agenda`}>{student.nome}</Link>)}</span> : "Sem alunos vinculados"}</dd></div>
        {event.serieId && <div><dt><Repeat2 aria-hidden="true" size={17} /> Recorrência</dt><dd>{event.isException ? "Ocorrência alterada" : "Parte de uma série"}</dd></div>}
        {event.observacoes && <div><dt><FileText aria-hidden="true" size={17} /> Observações</dt><dd>{event.observacoes}</dd></div>}
      </dl>
      <div className="agenda-details-actions">
        {event.status !== "cancelado" && <button className="app-button app-button-secondary" disabled={busy} onClick={() => onEdit(event)} type="button">Editar ou remarcar</button>}
        {event.status === "agendado" && <><button className="app-button app-button-primary" disabled={busy} onClick={() => onChangeStatus(event, "concluido")} type="button">Concluir</button><button className="app-button app-button-secondary" disabled={busy} onClick={() => onChangeStatus(event, "falta")} type="button">Registrar falta</button></>}
        {event.status !== "agendado" && event.status !== "cancelado" && <button className="app-button app-button-secondary" disabled={busy} onClick={() => onChangeStatus(event, "agendado")} type="button">Voltar para agendado</button>}
        {event.status !== "cancelado" && <button className="app-button app-button-danger" disabled={busy} onClick={() => onCancel(event, "ocorrencia")} type="button">Cancelar ocorrência</button>}
        {event.serieId && event.status !== "cancelado" && <button className="agenda-cancel-series" disabled={busy} onClick={() => onCancel(event, "serie")} type="button">Cancelar série inteira</button>}
      </div>
    </AccessibleModal>
  );
}
