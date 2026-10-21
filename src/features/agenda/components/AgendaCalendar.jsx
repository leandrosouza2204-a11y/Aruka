import { CalendarClock } from "lucide-react";
import EmptyState from "../../../components/EmptyState";
import { AgendaEventCard } from "./AgendaEventCard";
import { eventsByDate, formatAgendaDate, visibleDateKeys } from "../utils/agendaDate";

export function AgendaCalendar({ dateKey, events, onNew, onOpen, view }) {
  const grouped = eventsByDate(events);
  const dateKeys = visibleDateKeys(dateKey, view);

  if (view === "dia") {
    const dayEvents = grouped[dateKey] || [];
    return (
      <section className="agenda-day-list app-card" aria-label={`Compromissos de ${formatAgendaDate(dateKey, { year: true })}`}>
        <AgendaDayHeader dateKey={dateKey} count={dayEvents.length} />
        {dayEvents.length ? dayEvents.map((event) => <AgendaEventCard event={event} key={event.id} onOpen={onOpen} />) : (
          <EmptyState titulo="Nenhum compromisso neste dia." descricao="O horário está livre para um novo atendimento ou bloqueio." acaoLabel="Novo compromisso" onAcao={() => onNew(dateKey)} />
        )}
      </section>
    );
  }

  return (
    <section className={`agenda-calendar app-card agenda-calendar-${view}`} aria-label={`Visualização por ${view}`}>
      <div className="agenda-calendar-grid">
        {dateKeys.map((key) => {
          const dayEvents = grouped[key] || [];
          return (
            <article className="agenda-calendar-day" key={key}>
              <button className="agenda-calendar-day-heading" onClick={() => onNew(key)} type="button" aria-label={`Novo compromisso em ${formatAgendaDate(key, { year: true })}`}>
                <span>{formatAgendaDate(key, { weekday: view === "semana" })}</span>
                <strong>{key.slice(-2)}</strong>
              </button>
              <div className="agenda-calendar-events">
                {dayEvents.map((event) => <AgendaEventCard compact={view === "mes"} event={event} key={event.id} onOpen={onOpen} />)}
                {!dayEvents.length && <span className="agenda-calendar-empty"><CalendarClock aria-hidden="true" size={16} /> Livre</span>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AgendaDayHeader({ count, dateKey }) {
  return (
    <header className="agenda-day-header">
      <div><span>Agenda do dia</span><h2>{formatAgendaDate(dateKey, { weekday: true, year: true })}</h2></div>
      <strong>{count} {count === 1 ? "compromisso" : "compromissos"}</strong>
    </header>
  );
}
