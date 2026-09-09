import { useCallback, useEffect, useRef, useState } from "react";
import { Archive, Building2, Pencil, Plus, RefreshCw, RotateCcw, Trash2 } from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import AccessibleModal from "../../../components/AccessibleModal";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToast } from "../../../hooks/useToast";
import { listSmartManagementLocations, saveSmartManagementLocation, updateSmartManagementLocationStatus } from "../../../services/smartManagementService";
import { RULE_LABELS, parseBrazilianNumber, parsePercentage, ruleSummary, validateTiers } from "../utils/transferRules";

const emptyForm = () => ({ id: "", name: "", description: "", ruleType: "none", amountInput: "", tiers: [] });

function SmartManagementFoundationPage() {
  const [status, setStatus] = useState("active");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const { confirmar } = useConfirm();
  const toast = useToast();
  const loadLocations = useCallback(async () => {
    setLoading(true); setError("");
    try { setLocations(await listSmartManagementLocations(status)); }
    catch { setError("Não foi possível carregar os locais de atendimento."); }
    finally { setLoading(false); }
  }, [status]);
  useEffect(() => {
    void Promise.resolve().then(loadLocations);
  }, [loadLocations]);

  async function changeStatus(location) {
    const archiving = location.status === "active";
    const confirmed = await confirmar({ titulo: archiving ? "Arquivar local" : "Reativar local", descricao: archiving ? "Este local deixará de aparecer entre os locais ativos." : "Este local voltará a aparecer entre os locais ativos.", textoConfirmar: archiving ? "Arquivar" : "Reativar", variante: archiving ? "perigo" : "primario", testIdPrefix: "smart-management-location" });
    if (!confirmed) return;
    try { await updateSmartManagementLocationStatus(location.id, archiving ? "archived" : "active"); toast.sucesso(archiving ? "Local arquivado" : "Local reativado", archiving ? "O histórico e a regra de repasse foram preservados." : "O local voltou para a lista de ativos."); loadLocations(); }
    catch { toast.erro("Não foi possível atualizar o local", "Tente novamente em alguns instantes."); }
  }
  function editLocation(location) { setForm({ id: location.id, name: location.name, description: location.description, ruleType: location.rule?.type || "none", amountInput: location.rule?.amount === null ? "" : String(location.rule?.amount ?? ""), tiers: location.rule?.tiers || [] }); }
  async function submit(event) {
    event.preventDefault(); const name = form.name.trim(); const amount = form.ruleType === "percentage" ? parsePercentage(form.amountInput) : parseBrazilianNumber(form.amountInput); const tierResult = validateTiers(form.tiers);
    if (!name) { toast.aviso("Nome obrigatório", "Informe o nome do local de atendimento."); return; }
    if (["fixed", "per_student", "percentage"].includes(form.ruleType) && amount === null) { toast.aviso("Valor inválido", form.ruleType === "percentage" ? "Informe um percentual entre 0% e 100%." : "Informe um valor de repasse válido."); return; }
    if (form.ruleType === "tiered" && (form.tiers.length === 0 || tierResult.errors.length)) { toast.aviso("Faixas inválidas", tierResult.errors[0] || "Adicione ao menos uma faixa de alunos."); return; }
    setSaving(true);
    try { await saveSmartManagementLocation({ id: form.id, name, description: form.description, ruleType: form.ruleType, amount: ["fixed", "per_student", "percentage"].includes(form.ruleType) ? amount : null, tiers: form.ruleType === "tiered" ? tierResult.tiers : [] }); toast.sucesso(form.id ? "Alterações salvas" : "Local adicionado com sucesso.", "A configuração de repasse foi salva."); setForm(null); loadLocations(); }
    catch { toast.erro("Não foi possível salvar", "Seus dados continuam no formulário. Tente novamente."); }
    finally { setSaving(false); }
  }
  return <div className="app-shell" style={{ display: "flex" }}><Sidebar /><main className="app-main page-container smart-management-page smart-management-locations-page" data-testid="smart-management-page"><header className="smart-management-locations-header"><div><span className="smart-management-eyebrow">Gestão Inteligente</span><h1>Locais de atendimento</h1><p>Cadastre onde você atende e configure como funciona o repasse em cada local.</p></div><button type="button" className="btn btn-primary smart-management-primary-action" onClick={() => setForm(emptyForm())}><Plus size={18} aria-hidden="true" />Adicionar local</button></header><div className="smart-management-status-tabs" role="tablist" aria-label="Situação dos locais"><button type="button" role="tab" aria-selected={status === "active"} className={status === "active" ? "is-active" : ""} onClick={() => setStatus("active")}>Ativos</button><button type="button" role="tab" aria-selected={status === "archived"} className={status === "archived" ? "is-active" : ""} onClick={() => setStatus("archived")}>Arquivados</button></div>{loading && <div className="smart-management-state" role="status">Carregando locais de atendimento...</div>}{!loading && error && <div className="smart-management-state smart-management-error" role="alert"><span>{error}</span><button type="button" className="btn btn-secondary" onClick={loadLocations}><RefreshCw size={16} aria-hidden="true" />Tentar novamente</button></div>}{!loading && !error && locations.length === 0 && <section className="smart-management-empty-state"><Building2 size={30} aria-hidden="true" /><h2>{status === "active" ? "Você ainda não cadastrou nenhum local de atendimento." : "Nenhum local arquivado."}</h2><p>{status === "active" ? "Adicione academias, estúdios ou outros locais onde você atende para começar a organizar seus repasses." : "Os locais arquivados aparecerão aqui para que você possa reativá-los."}</p>{status === "active" && <button type="button" className="btn btn-primary" onClick={() => setForm(emptyForm())}><Plus size={18} aria-hidden="true" />Adicionar local</button>}</section>}{!loading && !error && locations.length > 0 && <section className="smart-management-location-list" aria-label="Locais cadastrados">{locations.map((location) => <LocationCard key={location.id} location={location} onEdit={() => editLocation(location)} onStatus={() => changeStatus(location)} />)}</section>}</main>{form && <LocationForm form={form} setForm={setForm} saving={saving} onClose={() => !saving && setForm(null)} onSubmit={submit} />}</div>;
}

function LocationCard({ location, onEdit, onStatus }) { return <article className="smart-management-location-card"><div className="smart-management-location-copy"><div className="smart-management-card-heading"><h2>{location.name}</h2><span className={`smart-management-status smart-management-status-${location.status}`}>{location.status === "active" ? "Ativo" : "Arquivado"}</span></div>{location.description && <p>{location.description}</p>}<strong>{ruleSummary(location.rule)}</strong></div><div className="smart-management-card-actions"><button type="button" className="btn btn-secondary" onClick={onEdit}><Pencil size={16} aria-hidden="true" />Editar</button><button type="button" className="btn btn-secondary" onClick={onStatus}>{location.status === "active" ? <Archive size={16} aria-hidden="true" /> : <RotateCcw size={16} aria-hidden="true" />}{location.status === "active" ? "Arquivar" : "Reativar"}</button></div></article>; }

function LocationForm({ form, setForm, saving, onClose, onSubmit }) {
  const nameRef = useRef(null); const tierResult = form.ruleType === "tiered" ? validateTiers(form.tiers) : { errors: [] };
  function update(next) { setForm((current) => ({ ...current, ...next })); }
  function updateTier(index, key, value) { update({ tiers: form.tiers.map((tier, current) => current === index ? { ...tier, [key]: value } : tier) }); }
  return <AccessibleModal isOpen onClose={onClose} title={form.id ? "Editar local" : "Adicionar local"} description="Configure os dados do local e a regra de repasse." size="lg" initialFocusRef={nameRef} closeOnOverlayClick={!saving} footer={<><button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancelar</button><button type="submit" form="smart-management-location-form" className="btn btn-primary" disabled={saving}>{saving ? "Salvando..." : form.id ? "Salvar alterações" : "Adicionar local"}</button></>}><form id="smart-management-location-form" className="smart-management-form" onSubmit={onSubmit}><label>Nome do local<input ref={nameRef} required maxLength="255" value={form.name} onChange={(event) => update({ name: event.target.value })} /></label><label>Observações<textarea maxLength="2000" value={form.description} onChange={(event) => update({ description: event.target.value })} /></label><fieldset><legend>Configuração de repasse</legend><div className="smart-management-rule-options">{Object.entries(RULE_LABELS).map(([value, label]) => <label key={value} className={form.ruleType === value ? "is-selected" : ""}><input type="radio" name="ruleType" checked={form.ruleType === value} onChange={() => update({ ruleType: value, amountInput: "", tiers: value === "tiered" ? form.tiers : [] })} />{label}</label>)}</div>{form.ruleType === "none" && <p className="smart-management-hint">Este local não tem custo de repasse.</p>}{["fixed", "per_student", "percentage"].includes(form.ruleType) && <label>{form.ruleType === "fixed" ? "Valor do repasse" : form.ruleType === "per_student" ? "Valor por aluno" : "Percentual do repasse"}<div className="smart-management-amount-input"><span>{form.ruleType === "percentage" ? "%" : "R$"}</span><input inputMode="decimal" value={form.amountInput} onChange={(event) => update({ amountInput: event.target.value })} placeholder={form.ruleType === "percentage" ? "20" : "75,00"} /></div><small>{form.ruleType === "fixed" ? "Valor cobrado por atendimento, independente da quantidade de alunos." : form.ruleType === "per_student" ? "Valor de repasse para cada aluno no atendimento." : "Parcela percentual destinada ao repasse."}</small></label>}{form.ruleType === "tiered" && <TierEditor tiers={form.tiers} errors={tierResult.errors} onAdd={() => update({ tiers: [...form.tiers, { minStudents: "", maxStudents: "", amount: "" }] })} onChange={updateTier} onRemove={(index) => update({ tiers: form.tiers.filter((_, current) => current !== index) })} />}</fieldset></form></AccessibleModal>;
}

function TierEditor({ tiers, errors, onAdd, onChange, onRemove }) { return <div className="smart-management-tier-editor"><div className="smart-management-tier-header"><div><h3>Faixas de repasse</h3><p>Defina a quantidade de alunos e o valor para cada faixa.</p></div><button type="button" className="btn btn-secondary" onClick={onAdd}><Plus size={16} aria-hidden="true" />Adicionar faixa</button></div>{tiers.map((tier, index) => <div className="smart-management-tier-row" key={index}><label>A partir de<input type="number" min="1" value={tier.minStudents} onChange={(event) => onChange(index, "minStudents", event.target.value)} /></label><label>Até<input type="number" min="1" value={tier.maxStudents ?? ""} onChange={(event) => onChange(index, "maxStudents", event.target.value)} placeholder="ou mais" /></label><label>Repasse<input inputMode="decimal" value={tier.amount} onChange={(event) => onChange(index, "amount", event.target.value)} placeholder="R$ 0,00" /></label><button type="button" className="smart-management-icon-button" onClick={() => onRemove(index)} aria-label="Remover faixa"><Trash2 size={18} aria-hidden="true" /></button></div>)}{errors.length > 0 && <p className="smart-management-field-error" role="alert">{errors[0]}</p>}{tiers.length === 0 && <p className="smart-management-hint">Adicione faixas como 1 aluno, 2 alunos e 3 ou mais.</p>}</div>; }

export default SmartManagementFoundationPage;
