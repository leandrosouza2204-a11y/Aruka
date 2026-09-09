import { useCallback, useEffect, useMemo, useState } from "react";
import { Calculator, RefreshCw } from "lucide-react";
import { listSmartManagementLocations, listSmartManagementServices } from "../../../services/smartManagementService";
import { formatServicePrice } from "../utils/servicesPricing";
import { calculateProfitability } from "../utils/profitabilityEngine";
import { formatMoney, ruleSummary } from "../utils/transferRules";

export default function ProfitabilityPanel({ onNavigate }) {
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [studentCount, setStudentCount] = useState(1);
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
      setLocationId((current) => nextLocations.some((item) => item.id === current) ? current : nextLocations[0]?.id || "");
      setStudentCount((current) => clampStudentCount(current, nextServices[0]));
    } catch (loadError) {
      setError(loadError?.message || "Não foi possível carregar os dados da simulação.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(loadInputs); }, [loadInputs]);
  const selectedService = services.find((item) => item.id === serviceId) || null;
  const selectedLocation = locations.find((item) => item.id === locationId) || null;
  const result = useMemo(() => calculateProfitability({ service: selectedService, location: selectedLocation, studentCount }), [selectedService, selectedLocation, studentCount]);

  function selectService(nextServiceId) {
    const nextService = services.find((item) => item.id === nextServiceId);
    setServiceId(nextServiceId);
    setStudentCount((current) => clampStudentCount(current, nextService));
  }

  if (loading) return <div className="smart-management-state" role="status">Carregando dados para a simulação...</div>;
  if (error) return <div className="smart-management-state smart-management-error" role="alert"><span>{error}</span><button type="button" className="btn btn-secondary" onClick={loadInputs}><RefreshCw size={16} aria-hidden="true" />Tentar novamente</button></div>;
  if (services.length === 0) return <EmptySimulator icon={<Calculator size={30} aria-hidden="true" />} title="Cadastre um serviço antes de simular." text="A rentabilidade usa o preço, a duração e a capacidade definidos no serviço." action="Ir para Serviços & Precificação" onAction={() => onNavigate("services")} />;
  if (locations.length === 0) return <EmptySimulator icon={<Calculator size={30} aria-hidden="true" />} title="Cadastre um local antes de simular." text="O cálculo precisa da regra de repasse de um local cadastrado." action="Ir para Locais & Repasses" onAction={() => onNavigate("locations")} />;

  return <section className="smart-management-profitability" aria-labelledby="profitability-title"><div className="smart-management-simulator-inputs"><div><h2 id="profitability-title">Cenário</h2><p>Escolha as entradas para calcular uma sessão operacional.</p></div><div className="smart-management-profitability-form"><label>Serviço<select value={serviceId} onChange={(event) => selectService(event.target.value)}>{services.map((item) => <option key={item.id} value={item.id}>{item.name} - {formatServicePrice(item)}</option>)}</select></label><label>Local<select value={locationId} onChange={(event) => setLocationId(event.target.value)}>{locations.map((item) => <option key={item.id} value={item.id}>{item.name} - {ruleSummary(item.rule)}</option>)}</select></label><label>Quantidade de alunos<input type="number" inputMode="numeric" min={selectedService?.minStudents || 1} max={selectedService?.maxStudents || undefined} value={studentCount} onChange={(event) => setStudentCount(Number(event.target.value))} /></label></div></div>{!result.valid ? <div className="smart-management-profitability-invalid" role="alert"><strong>Cenário inválido</strong><span>{result.errors[0]?.message}</span></div> : <ProfitabilityResult result={result} />}</section>;
}

function ProfitabilityResult({ result }) {
  const metrics = [{ label: "Receita bruta", value: result.grossRevenue }, { label: "Repasse", value: result.transferAmount }, { label: "Receita após repasse", value: result.netAfterTransfer }, { label: "Valor por hora", value: result.netHourlyRate, unavailable: "Duração não informada" }, { label: "Valor por aluno", value: result.netPerStudent }];
  return <div className="smart-management-profitability-result" aria-live="polite"><div className="smart-management-profitability-metrics">{metrics.map((metric) => <div className={`smart-management-profitability-metric ${metric.value !== null && metric.value < 0 ? "is-negative" : ""}`} key={metric.label}><span>{metric.label}</span><strong>{metric.value === null ? metric.unavailable : formatCents(metric.value)}{metric.label === "Valor por hora" && metric.value !== null ? "/h" : ""}</strong></div>)}</div>{result.monthlyNormalization?.policy === "WEEKLY_FREQUENCY_52_OVER_12" && <p className="smart-management-profitability-estimate">Estimativa baseada na frequência semanal, usando 52 semanas ÷ 12 meses.</p>}<section className="smart-management-breakdown" aria-labelledby="breakdown-title"><h2 id="breakdown-title">Como o resultado foi calculado</h2><ol>{result.breakdown.map((item) => <li key={item.key}><div><strong>{item.label}</strong><span>{displayFormula(item, result)}</span></div><b>{formatCents(item.value)}{item.key === "hourly" ? "/h" : ""}</b></li>)}</ol></section><p className="smart-management-profitability-note">Valores estimados pelas regras cadastradas. Não representam receita recebida.</p></div>;
}

function displayFormula(item, result) {
  if (item.key === "net") return `${formatCents(result.grossRevenue)} - ${formatCents(result.transferAmount)}`;
  if (item.key === "hourly") return `${formatCents(result.netAfterTransfer)} ÷ ${result.sessionDurationMinutes / 60}h`;
  return item.formula.replace(/\b\d{3,}\b/g, (value) => formatCents(Number(value)));
}

function EmptySimulator({ icon, title, text, action, onAction }) { return <section className="smart-management-empty-state">{icon}<h2>{title}</h2><p>{text}</p><button type="button" className="btn btn-primary" onClick={onAction}>{action}</button></section>; }
function formatCents(value) { return formatMoney(value / 100); }
function clampStudentCount(value, service) { return service ? Math.max(service.minStudents || 1, Math.min(value, service.maxStudents || value)) : value; }
