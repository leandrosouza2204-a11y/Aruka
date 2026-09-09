import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeCheck, Building2, Calculator, RefreshCw } from "lucide-react";
import { listSmartManagementLocations, listSmartManagementServices } from "../../../services/smartManagementService";
import { formatServicePrice } from "../utils/servicesPricing";
import { buildLocationComparison, MAX_LOCATION_COMPARISON_LOCATIONS } from "../utils/locationComparator";
import { formatMoney, ruleSummary } from "../utils/transferRules";

export default function LocationComparatorPanel({ onNavigate }) {
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [studentCount, setStudentCount] = useState(1);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInputs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextServices, nextLocations] = await Promise.all([listSmartManagementServices("active"), listSmartManagementLocations("active")]);
      setServices(nextServices);
      setLocations(nextLocations);
      setServiceId((current) => nextServices.some((item) => item.id === current) ? current : nextServices[0]?.id || "");
      setSelectedLocationIds((current) => normalizeLocationSelection(current, nextLocations));
      setStudentCount((current) => clampStudentCount(current, nextServices[0]));
    } catch (loadError) {
      setError(loadError?.message || "Não foi possível carregar os dados do comparador.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(loadInputs); }, [loadInputs]);

  const selectedService = services.find((item) => item.id === serviceId) || null;
  const comparison = useMemo(() => buildLocationComparison({ service: selectedService, locations, selectedLocationIds, studentCount }), [locations, selectedLocationIds, selectedService, studentCount]);
  const canCompare = selectedService && selectedLocationIds.length >= 2;

  function selectService(nextServiceId) {
    const nextService = services.find((item) => item.id === nextServiceId);
    setServiceId(nextServiceId);
    setStudentCount((current) => clampStudentCount(current, nextService));
  }

  function toggleLocation(locationId) {
    setSelectedLocationIds((current) => {
      if (current.includes(locationId)) return current.filter((id) => id !== locationId);
      if (current.length >= MAX_LOCATION_COMPARISON_LOCATIONS) return current;
      return [...current, locationId];
    });
  }

  if (loading) return <div className="smart-management-state" role="status">Carregando dados para o comparador...</div>;
  if (error) return <div className="smart-management-state smart-management-error" role="alert"><span>{error}</span><button type="button" className="btn btn-secondary" onClick={loadInputs}><RefreshCw size={16} aria-hidden="true" />Tentar novamente</button></div>;
  if (services.length === 0) return <EmptyComparator icon={<Calculator size={30} aria-hidden="true" />} title="Cadastre um serviço para comparar locais." text="O comparador fixa serviço, preço, duração e quantidade de alunos." action="Ir para Serviços & Precificação" onAction={() => onNavigate("services")} />;
  if (locations.length < 2) return <EmptyComparator icon={<Building2 size={30} aria-hidden="true" />} title="Cadastre pelo menos dois locais para comparar." text="Cada local precisa de uma regra de repasse cadastrada para isolar o impacto do repasse." action="Ir para Locais & Repasses" onAction={() => onNavigate("locations")} />;

  return <section className="smart-management-location-comparator" aria-labelledby="location-comparator-title">
    <div className="smart-management-simulator-toolbar">
      <div><h2 id="location-comparator-title">Comparador de Locais</h2><p>Fixe o mesmo atendimento e varie somente o local e a regra de repasse.</p></div>
    </div>
    <div className="smart-management-location-comparator-controls">
      <div className="smart-management-profitability-form">
        <label>Serviço<select value={serviceId} onChange={(event) => selectService(event.target.value)}>{services.map((item) => <option key={item.id} value={item.id}>{item.name} - {formatServicePrice(item)}</option>)}</select></label>
        <label>Quantidade de alunos<input type="number" inputMode="numeric" min={selectedService?.minStudents || 1} max={selectedService?.maxStudents || undefined} value={studentCount} onChange={(event) => setStudentCount(Number(event.target.value))} /></label>
        <label>Duração<input readOnly value={selectedService?.sessionDurationMinutes ? `${selectedService.sessionDurationMinutes} min` : "Indisponível"} /></label>
      </div>
      <fieldset className="smart-management-location-selector">
        <legend>Locais</legend>
        <p>Selecione de 2 a {MAX_LOCATION_COMPARISON_LOCATIONS} locais ativos.</p>
        <div>{locations.map((location) => {
          const selected = selectedLocationIds.includes(location.id);
          const disabled = !selected && selectedLocationIds.length >= MAX_LOCATION_COMPARISON_LOCATIONS;
          return <label key={location.id} className={selected ? "is-selected" : ""}><input type="checkbox" checked={selected} disabled={disabled} onChange={() => toggleLocation(location.id)} /> <span>{location.name}</span><small>{ruleSummary(location.rule)}</small></label>;
        })}</div>
      </fieldset>
    </div>
    {!canCompare && <div className="smart-management-profitability-invalid" role="alert"><strong>Comparação indisponível</strong><span>Selecione pelo menos dois locais ativos para comparar.</span></div>}
    {canCompare && <>
      <LocationComparisonSummary comparison={comparison} />
      <div className="smart-management-scenario-grid">{comparison.scenarioResults.map((scenario) => <LocationResultCard key={scenario.scenarioId} scenario={scenario} comparison={comparison.comparison} />)}</div>
    </>}
  </section>;
}

function LocationComparisonSummary({ comparison }) {
  return <section className="smart-management-comparison-summary" aria-labelledby="location-comparison-summary-title">
    <div><h3 id="location-comparison-summary-title">Comparação normalizada</h3><p>Mesmo serviço, mesma quantidade de alunos e mesma duração. Apenas o local muda.</p></div>
    <div className="smart-management-comparison-list">{comparison.scenarioResults.map((scenario) => <div className={`smart-management-comparison-row ${comparison.comparison.highestHourly.scenarioIds.includes(scenario.scenarioId) ? "is-highlighted" : ""}`} key={scenario.scenarioId}><span>{scenario.label}</span><strong>{scenario.valid && scenario.result.netHourlyRate !== null ? `${formatCents(scenario.result.netHourlyRate)}/h` : "Indisponível"}</strong>{comparison.comparison.highestHourly.scenarioIds.includes(scenario.scenarioId) && <em>{comparison.comparison.highestHourly.tie ? "Empate" : "Maior valor por hora"}</em>}</div>)}</div>
  </section>;
}

function LocationResultCard({ scenario, comparison }) {
  const result = scenario.result;
  const highestNet = comparison.highestNet.scenarioIds.includes(scenario.scenarioId);
  const lowestTransfer = comparison.lowestTransfer.scenarioIds.includes(scenario.scenarioId);
  return <article className={`smart-management-scenario-card ${highestNet ? "is-highlighted" : ""}`} aria-labelledby={`${scenario.scenarioId}-location-title`}>
    <div className="smart-management-scenario-heading"><h3 id={`${scenario.scenarioId}-location-title`}>{scenario.label}</h3>{highestNet && <span className="smart-management-highlight-badge"><BadgeCheck size={15} aria-hidden="true" />{comparison.highestNet.tie ? "Empate" : "Maior receita após repasse"}</span>}{lowestTransfer && <span className="smart-management-highlight-badge"><BadgeCheck size={15} aria-hidden="true" />{comparison.lowestTransfer.tie ? "Empate" : "Menor repasse"}</span>}</div>
    <p className="smart-management-profitability-note">{ruleSummary(scenario.location.rule)}</p>
    {!result.valid ? <div className="smart-management-profitability-invalid" role="alert"><strong>Local inválido</strong><span>{result.errors[0]?.message}</span></div> : <>
      <div className="smart-management-profitability-metrics">
        <Metric label="Receita bruta" value={result.grossRevenue} />
        <Metric label="Repasse" value={result.transferAmount} />
        <Metric label="Receita após repasse" value={result.netAfterTransfer} />
        <Metric label="Valor por hora" value={result.netHourlyRate} hourly unavailable="Indisponível" />
        <Metric label="Valor por aluno" value={result.netPerStudent} />
        <Metric label="Duração" text={result.sessionDurationMinutes ? `${result.sessionDurationMinutes} min` : "Indisponível"} />
      </div>
      {result.netAfterTransfer < 0 && <p className="smart-management-profitability-note">Receita após repasse negativa.</p>}
      {result.monthlyNormalization?.policy === "WEEKLY_FREQUENCY_52_OVER_12" && <p className="smart-management-profitability-estimate">Estimativa baseada na frequência semanal, usando 52 semanas ÷ 12 meses.</p>}
      <section className="smart-management-breakdown" aria-labelledby={`${scenario.scenarioId}-breakdown-title`}><h4 id={`${scenario.scenarioId}-breakdown-title`}>Como o resultado foi calculado</h4><ol>{result.breakdown.map((item) => <li key={item.key}><div><strong>{item.label}</strong><span>{displayFormula(item, result)}</span></div><b>{formatCents(item.value)}{item.key === "hourly" ? "/h" : ""}</b></li>)}</ol></section>
    </>}
  </article>;
}

function Metric({ label, value, text, hourly = false, unavailable = "Indisponível" }) {
  const negative = Number.isFinite(value) && value < 0;
  return <div className={`smart-management-profitability-metric ${negative ? "is-negative" : ""}`}><span>{label}</span><strong>{text || (value === null ? unavailable : `${formatCents(value)}${hourly ? "/h" : ""}`)}</strong></div>;
}

function EmptyComparator({ icon, title, text, action, onAction }) { return <section className="smart-management-empty-state">{icon}<h2>{title}</h2><p>{text}</p><button type="button" className="btn btn-primary" onClick={onAction}>{action}</button></section>; }
function formatCents(value) { return formatMoney(value / 100); }
function normalizeLocationSelection(current, locations) {
  const activeIds = locations.map((location) => location.id);
  const existing = current.filter((id) => activeIds.includes(id)).slice(0, MAX_LOCATION_COMPARISON_LOCATIONS);
  if (existing.length >= 2) return existing;
  return activeIds.slice(0, MAX_LOCATION_COMPARISON_LOCATIONS);
}
function clampStudentCount(value, service) {
  const count = Number(value);
  if (!service) return Math.max(1, Number.isFinite(count) ? count : 1);
  return Math.max(service.minStudents || 1, Math.min(Number.isFinite(count) ? count : service.minStudents || 1, service.maxStudents || count || service.minStudents || 1));
}
function displayFormula(item, result) {
  if (item.key === "net") return `${formatCents(result.grossRevenue)} - ${formatCents(result.transferAmount)}`;
  if (item.key === "hourly") return `${formatCents(result.netAfterTransfer)} ÷ ${result.sessionDurationMinutes / 60}h`;
  return item.formula.replace(/\b\d{3,}\b/g, (value) => formatCents(Number(value)));
}
