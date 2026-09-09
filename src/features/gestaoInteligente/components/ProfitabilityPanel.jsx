import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeCheck, Calculator, Copy, Plus, RefreshCw, RotateCcw, Trash2 } from "lucide-react";
import { listSmartManagementLocations, listSmartManagementServices } from "../../../services/smartManagementService";
import { formatServicePrice } from "../utils/servicesPricing";
import { calculateProfitability } from "../utils/profitabilityEngine";
import { compareProfitabilityScenarios } from "../utils/profitabilityComparison";
import { formatMoney, ruleSummary } from "../utils/transferRules";

const MAX_SCENARIOS = 4;
const metricOptions = [
  ["netHourlyRate", "Valor por hora"],
  ["netAfterTransfer", "Receita após repasse"],
  ["netPerStudent", "Valor por aluno"],
];

export default function ProfitabilityPanel({ onNavigate }) {
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [scenarios, setScenarios] = useState([emptyScenario(1), emptyScenario(2)]);
  const [highlightMetric, setHighlightMetric] = useState("netHourlyRate");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInputs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextServices, nextLocations] = await Promise.all([listSmartManagementServices("active"), listSmartManagementLocations("active")]);
      setServices(nextServices);
      setLocations(nextLocations);
      setScenarios((current) => current.length ? current : [emptyScenario(1), emptyScenario(2)]);
    } catch (loadError) {
      setError(loadError?.message || "Não foi possível carregar os dados da simulação.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(loadInputs); }, [loadInputs]);

  const scenarioResults = useMemo(() => scenarios.map((scenario) => {
    const selectedService = services.find((item) => item.id === scenario.serviceId) || null;
    const selectedLocation = locations.find((item) => item.id === scenario.locationId) || null;
    return {
      ...scenario,
      service: selectedService,
      location: selectedLocation,
      result: calculateProfitability({ service: selectedService, location: selectedLocation, studentCount: scenario.studentCount }),
    };
  }), [locations, scenarios, services]);
  const comparison = useMemo(() => compareProfitabilityScenarios(scenarioResults), [scenarioResults]);
  const highlighted = comparison[metricToComparisonKey(highlightMetric)] || { scenarioIds: [] };

  function updateScenario(scenarioId, patch) {
    setScenarios((current) => current.map((scenario) => {
      if (scenario.scenarioId !== scenarioId) return scenario;
      const next = { ...scenario, ...patch };
      const service = services.find((item) => item.id === next.serviceId);
      return { ...next, studentCount: clampStudentCount(next.studentCount, service) };
    }));
  }

  function addScenario(source) {
    if (scenarios.length >= MAX_SCENARIOS) return;
    const nextId = nextScenarioId(scenarios);
    setScenarios((current) => [...current, source ? { ...source, scenarioId: nextId, label: `Cenário ${nextId}` } : emptyScenario(nextId)]);
  }

  if (loading) return <div className="smart-management-state" role="status">Carregando dados para a simulação...</div>;
  if (error) return <div className="smart-management-state smart-management-error" role="alert"><span>{error}</span><button type="button" className="btn btn-secondary" onClick={loadInputs}><RefreshCw size={16} aria-hidden="true" />Tentar novamente</button></div>;
  if (services.length === 0) return <EmptySimulator icon={<Calculator size={30} aria-hidden="true" />} title="Cadastre um serviço para começar a simular." text="A rentabilidade usa o preço, a duração e a capacidade definidos no serviço." action="Ir para Serviços & Precificação" onAction={() => onNavigate("services")} />;
  if (locations.length === 0) return <EmptySimulator icon={<Calculator size={30} aria-hidden="true" />} title="Cadastre um local antes de simular." text="O cálculo precisa da regra de repasse de um local cadastrado." action="Ir para Locais & Repasses" onAction={() => onNavigate("locations")} />;

  return <section className="smart-management-profitability smart-management-smart-simulator" aria-labelledby="profitability-title">
    <div className="smart-management-simulator-toolbar">
      <div><h2 id="profitability-title">Simulador Inteligente</h2><p>Compare cenários temporários usando os serviços, locais e repasses cadastrados.</p></div>
      <div className="smart-management-simulator-actions">
        <label>Métrica de destaque<select value={highlightMetric} onChange={(event) => setHighlightMetric(event.target.value)}>{metricOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <button type="button" className="btn btn-secondary" onClick={() => setScenarios([emptyScenario(1), emptyScenario(2)])}><RotateCcw size={16} aria-hidden="true" />Limpar simulação</button>
        <button type="button" className="btn btn-primary" onClick={() => addScenario()} disabled={scenarios.length >= MAX_SCENARIOS}><Plus size={16} aria-hidden="true" />Adicionar cenário</button>
      </div>
    </div>
    {scenarios.length === 0 ? <EmptySimulator icon={<Calculator size={30} aria-hidden="true" />} title="Nenhum cenário na simulação." text="Adicione ao menos dois cenários para comparar resultados." action="Adicionar cenário" onAction={() => addScenario()} /> : <>
      <ComparisonSummary comparison={comparison} highlighted={highlighted} highlightMetric={highlightMetric} />
      <div className="smart-management-scenario-grid">{scenarioResults.map((scenario) => <ScenarioCard key={scenario.scenarioId} scenario={scenario} services={services} locations={locations} isHighlighted={highlighted.scenarioIds.includes(scenario.scenarioId)} highlightTie={highlighted.tie} canRemove={scenarios.length > 1} canDuplicate={scenarios.length < MAX_SCENARIOS} onChange={updateScenario} onDuplicate={() => addScenario(scenario)} onRemove={() => setScenarios((current) => current.filter((item) => item.scenarioId !== scenario.scenarioId))} />)}</div>
    </>}
  </section>;
}

function ScenarioCard({ scenario, services, locations, isHighlighted, highlightTie, canRemove, canDuplicate, onChange, onDuplicate, onRemove }) {
  const { result } = scenario;
  return <article className={`smart-management-scenario-card ${isHighlighted ? "is-highlighted" : ""}`} aria-labelledby={`${scenario.scenarioId}-title`}>
    <div className="smart-management-scenario-heading"><h3 id={`${scenario.scenarioId}-title`}>{scenario.label}</h3>{isHighlighted && <span className="smart-management-highlight-badge"><BadgeCheck size={15} aria-hidden="true" />{highlightTie ? "Empate na métrica" : "Maior valor nesta métrica"}</span>}</div>
    <div className="smart-management-profitability-form smart-management-scenario-form">
      <label>Serviço<select value={scenario.serviceId} onChange={(event) => onChange(scenario.scenarioId, { serviceId: event.target.value })}><option value="">Selecione</option>{services.map((item) => <option key={item.id} value={item.id}>{item.name} - {formatServicePrice(item)}</option>)}</select></label>
      <label>Local<select value={scenario.locationId} onChange={(event) => onChange(scenario.scenarioId, { locationId: event.target.value })}><option value="">Selecione</option>{locations.map((item) => <option key={item.id} value={item.id}>{item.name} - {ruleSummary(item.rule)}</option>)}</select></label>
      <label>Quantidade de alunos<input type="number" inputMode="numeric" min={scenario.service?.minStudents || 1} max={scenario.service?.maxStudents || undefined} value={scenario.studentCount} onChange={(event) => onChange(scenario.scenarioId, { studentCount: Number(event.target.value) })} /></label>
    </div>
    {!result.valid ? <div className="smart-management-profitability-invalid" role="alert"><strong>Cenário inválido</strong><span>{result.errors[0]?.message}</span></div> : <ProfitabilityResult result={result} />}
    <div className="smart-management-scenario-actions">
      <button type="button" className="btn btn-secondary" onClick={onDuplicate} disabled={!canDuplicate}><Copy size={16} aria-hidden="true" />Duplicar cenário</button>
      <button type="button" className="btn btn-secondary" onClick={onRemove} disabled={!canRemove}><Trash2 size={16} aria-hidden="true" />Remover cenário</button>
    </div>
  </article>;
}

function ComparisonSummary({ comparison, highlighted, highlightMetric }) {
  const label = metricOptions.find(([value]) => value === highlightMetric)?.[1] || "Métrica";
  return <section className="smart-management-comparison-summary" aria-labelledby="comparison-title">
    <div><h3 id="comparison-title">Comparação</h3><p>{comparison.validScenarioCount} cenário(s) válido(s) neste comparativo.</p></div>
    <div className="smart-management-comparison-list">{comparison.scenarioResults.map((scenario) => {
      const value = scenario.result?.[highlightMetric];
      const winner = highlighted.scenarioIds.includes(scenario.scenarioId);
      return <div className={`smart-management-comparison-row ${winner ? "is-highlighted" : ""}`} key={scenario.scenarioId}><span>{scenario.label}</span><strong>{scenario.valid && value !== null ? `${formatCents(value)}${highlightMetric === "netHourlyRate" ? "/h" : ""}` : "Indisponível"}</strong>{winner && <em>{highlighted.tie ? "Empate" : label === "Valor por hora" ? "Maior valor por hora" : `Maior ${label.toLowerCase()}`}</em>}</div>;
    })}</div>
  </section>;
}

function ProfitabilityResult({ result }) {
  const metrics = [{ label: "Receita bruta", value: result.grossRevenue }, { label: "Repasse", value: result.transferAmount }, { label: "Receita após repasse", value: result.netAfterTransfer }, { label: "Valor por hora", value: result.netHourlyRate, unavailable: "Duração não informada" }, { label: "Valor por aluno", value: result.netPerStudent }, { label: "Duração", value: result.sessionDurationMinutes, duration: true }, { label: "Quantidade de alunos", value: result.studentCount, count: true }];
  return <div className="smart-management-profitability-result" aria-live="polite"><div className="smart-management-profitability-metrics">{metrics.map((metric) => <div className={`smart-management-profitability-metric ${metric.value !== null && metric.value < 0 ? "is-negative" : ""}`} key={metric.label}><span>{metric.label}</span><strong>{formatMetric(metric)}</strong></div>)}</div>{result.netAfterTransfer < 0 && <p className="smart-management-profitability-note">Receita após repasse negativa.</p>}{result.monthlyNormalization?.policy === "WEEKLY_FREQUENCY_52_OVER_12" && <p className="smart-management-profitability-estimate">Estimativa baseada na frequência semanal, usando 52 semanas ÷ 12 meses.</p>}<section className="smart-management-breakdown" aria-labelledby={`breakdown-title-${result.studentCount}-${result.netAfterTransfer}`}><h4 id={`breakdown-title-${result.studentCount}-${result.netAfterTransfer}`}>Como o resultado foi calculado</h4><ol>{result.breakdown.map((item) => <li key={item.key}><div><strong>{item.label}</strong><span>{displayFormula(item, result)}</span></div><b>{formatCents(item.value)}{item.key === "hourly" ? "/h" : ""}</b></li>)}</ol></section><p className="smart-management-profitability-note">Valores estimados pelas regras cadastradas. Não representam receita recebida.</p></div>;
}

function displayFormula(item, result) {
  if (item.key === "net") return `${formatCents(result.grossRevenue)} - ${formatCents(result.transferAmount)}`;
  if (item.key === "hourly") return `${formatCents(result.netAfterTransfer)} ÷ ${result.sessionDurationMinutes / 60}h`;
  return item.formula.replace(/\b\d{3,}\b/g, (value) => formatCents(Number(value)));
}

function EmptySimulator({ icon, title, text, action, onAction }) { return <section className="smart-management-empty-state">{icon}<h2>{title}</h2><p>{text}</p><button type="button" className="btn btn-primary" onClick={onAction}>{action}</button></section>; }
function formatCents(value) { return formatMoney(value / 100); }
function formatMetric(metric) {
  if (metric.value === null) return metric.unavailable || "Indisponível";
  if (metric.duration) return `${metric.value} min`;
  if (metric.count) return String(metric.value);
  return `${formatCents(metric.value)}${metric.label === "Valor por hora" ? "/h" : ""}`;
}
function emptyScenario(index) { return { scenarioId: `scenario-${Date.now()}-${index}`, label: `Cenário ${index}`, serviceId: "", locationId: "", studentCount: 1 }; }
function nextScenarioId(scenarios) { return scenarios.length + 1; }
function metricToComparisonKey(metric) {
  if (metric === "netAfterTransfer") return "highestNet";
  if (metric === "netPerStudent") return "highestPerStudent";
  return "highestHourly";
}
function clampStudentCount(value, service) {
  const count = Number(value);
  if (!Number.isFinite(count)) return service?.minStudents || 1;
  return service ? Math.max(service.minStudents || 1, Math.min(count, service.maxStudents || count)) : Math.max(1, count);
}
