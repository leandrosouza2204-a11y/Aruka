import { Activity, AlertCircle, CalendarDays, ClipboardList, Dumbbell, RefreshCcw, Scale } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buscarMeuHistoricoValidoV2,
  buscarMinhaFrequenciaAlunoV2,
  buscarMinhasAvaliacoesAlunoV2,
} from "../../../services/studentEvolutionV2Service.js";
import {
  buildAssessmentEvolution,
  buildWorkoutEvolutionHistory,
  formatEvolutionDate,
  formatMeasurement,
} from "../domain/studentEvolutionV2.js";

const loadingState = () => ({ status: "loading", data: null, error: null });

function StudentEvolutionV2() {
  const [frequency, setFrequency] = useState(loadingState);
  const [history, setHistory] = useState(loadingState);
  const [assessments, setAssessments] = useState(loadingState);

  const loadFrequency = useCallback(async () => {
    await Promise.resolve();
    setFrequency(loadingState());
    try { setFrequency({ status: "success", data: await buscarMinhaFrequenciaAlunoV2(), error: null }); }
    catch (error) { setFrequency({ status: "error", data: null, error }); }
  }, []);
  const loadHistory = useCallback(async () => {
    await Promise.resolve();
    setHistory(loadingState());
    try { setHistory({ status: "success", data: await buscarMeuHistoricoValidoV2(20), error: null }); }
    catch (error) { setHistory({ status: "error", data: null, error }); }
  }, []);
  const loadAssessments = useCallback(async () => {
    await Promise.resolve();
    setAssessments(loadingState());
    try { setAssessments({ status: "success", data: await buscarMinhasAvaliacoesAlunoV2(), error: null }); }
    catch (error) { setAssessments({ status: "error", data: null, error }); }
  }, []);

  useEffect(() => {
    let active = true;
    buscarMinhaFrequenciaAlunoV2()
      .then((data) => { if (active) setFrequency({ status: "success", data, error: null }); })
      .catch((error) => { if (active) setFrequency({ status: "error", data: null, error }); });
    buscarMeuHistoricoValidoV2(20)
      .then((data) => { if (active) setHistory({ status: "success", data, error: null }); })
      .catch((error) => { if (active) setHistory({ status: "error", data: null, error }); });
    buscarMinhasAvaliacoesAlunoV2()
      .then((data) => { if (active) setAssessments({ status: "success", data, error: null }); })
      .catch((error) => { if (active) setAssessments({ status: "error", data: null, error }); });
    return () => { active = false; };
  }, []);

  const workoutItems = useMemo(() => buildWorkoutEvolutionHistory(history.data || []), [history.data]);
  const assessmentView = useMemo(() => buildAssessmentEvolution(assessments.data || {}), [assessments.data]);

  return (
    <div className="student-evolution-v2" data-testid="student-evolution-v2">
      <header className="student-home-intro">
        <span className="student-v2-eyebrow">Sua jornada</span>
        <h1>Evolução</h1>
        <p>Treinos concluídos e medidas registradas, com períodos e comparações objetivas.</p>
      </header>

      <EvolutionSection icon={Activity} title="Frequência" subtitle="Somente sessões concluídas entram nestas contagens.">
        {frequency.status === "loading" && <SectionLoading label="Carregando frequência" />}
        {frequency.status === "error" && <SectionError onRetry={loadFrequency} text="Não foi possível carregar a frequência." />}
        {frequency.status === "success" && (
          <div className="student-evolution-frequency-grid">
            {frequency.data.frequency.map((period) => (
              <article className="student-evolution-frequency-card" key={period.key}>
                <strong>{period.completedCount}</strong>
                <span>{period.completedCount === 1 ? "sessão concluída" : "sessões concluídas"}</span>
                <small>{period.label} · {formatEvolutionDate(period.startDate)} a {formatEvolutionDate(period.endDate)}</small>
              </article>
            ))}
          </div>
        )}
      </EvolutionSection>

      <EvolutionSection icon={Dumbbell} title="Treinos recentes" subtitle="Até 20 sessões concluídas, da mais recente para a mais antiga.">
        {history.status === "loading" && <SectionLoading label="Carregando histórico de treinos" />}
        {history.status === "error" && <SectionError onRetry={loadHistory} text="Não foi possível carregar o histórico de treinos." />}
        {history.status === "success" && workoutItems.length === 0 && <SectionEmpty text="Você ainda não tem treinos concluídos para exibir." />}
        {history.status === "success" && workoutItems.length > 0 && (
          <ol className="student-evolution-timeline">
            {workoutItems.map((item) => (
              <li key={item.id}>
                <CalendarDays aria-hidden="true" size={18} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.dayName || "Sessão concluída"} · {formatEvolutionDate(item.date)}</span>
                  <small>{item.completedSetCount} {item.completedSetCount === 1 ? "série concluída" : "séries concluídas"} em {item.completedExerciseCount} {item.completedExerciseCount === 1 ? "exercício" : "exercícios"}</small>
                  {item.shortDurationConfirmed && <small>Conclusão curta confirmada</small>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </EvolutionSection>

      <EvolutionSection icon={ClipboardList} title="Avaliações físicas" subtitle="Medidas registradas pelo seu profissional, sem fotos ou observações privadas.">
        {assessments.status === "loading" && <SectionLoading label="Carregando avaliações físicas" />}
        {assessments.status === "error" && <SectionError onRetry={loadAssessments} text="Não foi possível carregar as avaliações físicas." />}
        {assessments.status === "success" && assessmentView.status === "empty" && <SectionEmpty text="Nenhuma avaliação física está disponível ainda." />}
        {assessments.status === "success" && assessmentView.status !== "empty" && (
          <>
            <div className="student-evolution-assessment-summary">
              <Scale aria-hidden="true" size={20} />
              <div>
                <strong>Última avaliação · {formatEvolutionDate(assessmentView.latest.date)}</strong>
                <span>{assessmentView.status === "baseline" ? "Esta é sua linha de base; ainda não há tendência para comparar." : `${assessmentView.comparableCount} medidas comparáveis com a avaliação anterior.`}</span>
              </div>
            </div>
            <div className="student-evolution-measure-grid">
              {assessmentView.comparisons.map((metric) => (
                <article key={metric.key}>
                  <span>{metric.label}</span>
                  <strong>{formatMeasurement(metric.current, metric.unit)}</strong>
                  <small>{metric.delta === null ? "Sem comparação equivalente" : `${formatMeasurement(metric.delta, metric.unit, true)} desde ${formatEvolutionDate(assessmentView.previous.date)}`}</small>
                </article>
              ))}
            </div>
            <details className="student-evolution-assessment-history">
              <summary>Ver datas das avaliações</summary>
              <ul>{assessmentView.items.map((item) => <li key={item.id}>{formatEvolutionDate(item.date)}</li>)}</ul>
              {assessmentView.totalCount > assessmentView.limit && <p>Exibindo as {assessmentView.limit} avaliações mais recentes de {assessmentView.totalCount}.</p>}
            </details>
          </>
        )}
      </EvolutionSection>
    </div>
  );
}

function EvolutionSection({ children, icon: Icon, subtitle, title }) {
  return (
    <section aria-labelledby={`student-evolution-${title.replace(/\s+/g, "-").toLowerCase()}`} className="student-v2-card student-evolution-section">
      <div className="student-v2-section-heading">
        <div><span className="student-v2-eyebrow">Acompanhamento</span><h2 id={`student-evolution-${title.replace(/\s+/g, "-").toLowerCase()}`}>{title}</h2></div>
        <Icon aria-hidden="true" size={22} />
      </div>
      <p>{subtitle}</p>
      {children}
    </section>
  );
}

function SectionLoading({ label }) {
  return <div aria-label={label} className="student-evolution-section-loading" role="status"><span /><span /><span /></div>;
}

function SectionError({ onRetry, text }) {
  return <div className="student-evolution-section-message is-error" role="alert"><AlertCircle aria-hidden="true" size={19} /><span>{text}</span><button className="student-v2-button student-v2-button-secondary" onClick={onRetry} type="button"><RefreshCcw aria-hidden="true" size={17} /> Tentar novamente</button></div>;
}

function SectionEmpty({ text }) {
  return <div className="student-evolution-section-message"><span>{text}</span></div>;
}

export default StudentEvolutionV2;
