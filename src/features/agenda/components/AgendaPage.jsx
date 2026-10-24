import { ChevronLeft, ChevronRight, Plus, RefreshCcw } from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import PageHero from "../../../components/PageHero";
import LoadingState from "../../../components/LoadingState";
import { useAgendaPage } from "../hooks/useAgendaPage";
import { AgendaCalendar } from "./AgendaCalendar";
import { AgendaDetailsModal } from "./AgendaDetailsModal";
import { AgendaFormModal } from "./AgendaFormModal";
import { formatAgendaDate } from "../utils/agendaDate";

export default function AgendaPage() {
  const agenda = useAgendaPage();
  return (
    <div className="app-shell agenda-shell">
      <Sidebar />
      <main className="app-main page-container agenda-page">
        <PageHero eyebrow="AGENDA" title="Agenda profissional" description="Organize atendimentos, compromissos pessoais e indisponibilidades em um só lugar." meta={`${agenda.events.length} compromissos no período`} actions={<button className="app-button app-button-primary agenda-new-button" onClick={() => agenda.openNew()} type="button"><Plus aria-hidden="true" size={18} /> Novo compromisso</button>} />

        <section className="agenda-toolbar app-card" aria-label="Controles da agenda">
          <div className="agenda-date-navigation">
            <button aria-label="Período anterior" className="agenda-icon-button" onClick={() => agenda.move(-1)} type="button"><ChevronLeft aria-hidden="true" size={20} /></button>
            <button className="app-button app-button-secondary" onClick={agenda.goToday} type="button">Hoje</button>
            <button aria-label="Próximo período" className="agenda-icon-button" onClick={() => agenda.move(1)} type="button"><ChevronRight aria-hidden="true" size={20} /></button>
            <strong>{formatAgendaDate(agenda.dateKey, { weekday: agenda.view === "dia", year: true })}</strong>
          </div>
          <div className="agenda-view-switch" role="group" aria-label="Visualização da agenda">
            {[['dia', 'Dia'], ['semana', 'Semana'], ['mes', 'Mês']].map(([value, label]) => <button aria-pressed={agenda.view === value} className={agenda.view === value ? "is-active" : ""} key={value} onClick={() => agenda.setView(value)} type="button">{label}</button>)}
          </div>
        </section>

        {agenda.error && <div className="app-error agenda-error" role="alert">{agenda.error}<button onClick={agenda.load} type="button"><RefreshCcw aria-hidden="true" size={16} /> Tentar novamente</button></div>}
        {agenda.status === "loading" ? <div className="agenda-loading app-card"><LoadingState texto="Carregando agenda..." /></div> : agenda.status === "ready" && <AgendaCalendar dateKey={agenda.dateKey} events={agenda.events} onNew={agenda.openNew} onOpen={agenda.openDetails} view={agenda.view} />}

        <button aria-label="Novo compromisso" className="agenda-mobile-fab" onClick={() => agenda.openNew()} type="button"><Plus aria-hidden="true" size={24} /></button>
        {agenda.formOpen && <AgendaFormModal busy={agenda.mutation === "save"} editing={agenda.editing} onClose={agenda.closeForm} onRetryStudents={agenda.loadStudents} onSave={agenda.save} students={agenda.students} studentsError={agenda.studentsError} studentsStatus={agenda.studentsStatus} />}
        {agenda.details && <AgendaDetailsModal busy={Boolean(agenda.mutation)} error={agenda.actionError?.message || ""} event={agenda.details} onCancel={agenda.cancel} onChangeStatus={agenda.changeStatus} onClose={agenda.closeDetails} onEdit={agenda.openEdit} onRetryCancel={() => agenda.cancel(agenda.details, agenda.actionError?.scope || "ocorrencia")} />}
      </main>
    </div>
  );
}
