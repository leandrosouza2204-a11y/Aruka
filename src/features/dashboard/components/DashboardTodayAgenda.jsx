import { CalendarDays, Clock3, Plus, RefreshCcw, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatAgendaDate, formatAgendaTime, todayKey } from "../../agenda/utils/agendaDate";
import { STATUS_LABELS, TYPE_LABELS } from "../../agenda/components/AgendaEventCard";
import { useDashboardAgenda } from "../hooks/useDashboardAgenda";
import { statusAgendaNoMomento } from "../utils/dashboardAgenda";

const MOMENT_STATUS_LABELS = { ...STATUS_LABELS, em_andamento: "Em andamento" };

export default function DashboardTodayAgenda() {
  const agenda = useDashboardAgenda();
  const dateKey = todayKey();

  return (
    <section className="dashboard-today-agenda app-card" aria-labelledby="dashboard-today-agenda-title">
      <div className="dashboard-today-agenda-header">
        <div>
          <span className="dashboard-today-agenda-eyebrow"><CalendarDays aria-hidden="true" size={16} /> Agenda de hoje</span>
          <h2 id="dashboard-today-agenda-title">{formatAgendaDate(dateKey, { weekday: true, year: true })}</h2>
          {agenda.resumo && <p>{agenda.resumo.total} {agenda.resumo.total === 1 ? "compromisso" : "compromissos"} no dia · {agenda.proximosAtendimentos.length} {agenda.proximosAtendimentos.length === 1 ? "atendimento próximo" : "atendimentos próximos"}</p>}
        </div>
        <div className="dashboard-today-agenda-actions">
          <Link className="app-button app-button-secondary" to="/agenda">Ver agenda completa</Link>
          <Link className="app-button app-button-primary" to={`/agenda?novo=${dateKey}`}><Plus aria-hidden="true" size={17} /> Novo compromisso</Link>
        </div>
      </div>

      {agenda.status === "loading" && <div className="dashboard-agenda-skeleton" aria-label="Carregando agenda de hoje" aria-busy="true"><span /><span /><span /></div>}
      {agenda.status === "error" && <div className="dashboard-agenda-error" role="alert"><span>Agenda indisponível no momento. O restante do Dashboard continua atualizado.</span><button className="app-button app-button-secondary" onClick={agenda.retry} type="button"><RefreshCcw aria-hidden="true" size={16} /> Tentar novamente</button></div>}
      {agenda.status === "ready" && !agenda.itens.length && <div className="dashboard-agenda-empty"><strong>Nenhum compromisso pendente para hoje.</strong><span>Concluídos e cancelados continuam disponíveis na agenda completa.</span></div>}
      {agenda.status === "ready" && agenda.itens.length > 0 && <ol className="dashboard-agenda-list">
        {agenda.itens.map((item) => {
          const status = statusAgendaNoMomento(item);
          const alunos = item.alunos || [];
          return <li key={item.id}>
            <Link className="dashboard-agenda-item" to={`/agenda?compromisso=${encodeURIComponent(item.id)}`} aria-label={`Abrir ${item.titulo} na agenda`}>
              <span className="dashboard-agenda-time"><Clock3 aria-hidden="true" size={16} /> {formatAgendaTime(item.inicio)}–{formatAgendaTime(item.fim)}</span>
              <span className="dashboard-agenda-main"><strong>{item.titulo}</strong><small>{TYPE_LABELS[item.tipo] || "Compromisso"}</small></span>
              <span className={`dashboard-agenda-status is-${status}`}>{MOMENT_STATUS_LABELS[status] || status}</span>
              <span className="dashboard-agenda-students"><Users aria-hidden="true" size={15} /> {alunos.length ? alunos.map((aluno) => aluno.nome).join(", ") : item.tipo === "atendimento" ? "Aluno não informado" : "Compromisso pessoal"}</span>
            </Link>
          </li>;
        })}
      </ol>}
    </section>
  );
}
