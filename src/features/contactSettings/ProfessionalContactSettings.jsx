import { AlertCircle, CheckCircle2, Mail, MessageCircle, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { EMPTY_CONTACT_SETTINGS, validateContactSettings } from "./contactSettings.js";
import { buscarMinhaConfiguracaoContato, salvarMinhaConfiguracaoContato } from "../../services/professionalContactSettingsService.js";

function ProfessionalContactSettings() {
  const [form, setForm] = useState(EMPTY_CONTACT_SETTINGS);
  const [status, setStatus] = useState("loading");
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    setFeedback("");
    try {
      setForm(await buscarMinhaConfiguracaoContato());
      setErrors({});
      setStatus("ready");
    } catch {
      setStatus("load-error");
    }
  }, []);

  useEffect(() => {
    let active = true;
    buscarMinhaConfiguracaoContato()
      .then((data) => {
        if (!active) return;
        setForm(data);
        setErrors({});
        setStatus("ready");
      })
      .catch(() => { if (active) setStatus("load-error"); });
    return () => { active = false; };
  }, []);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    const errorField = field.startsWith("whatsapp") ? "whatsappNumber" : "contactEmail";
    setErrors((current) => ({ ...current, [errorField]: undefined }));
    setFeedback("");
  }

  async function submit(event) {
    event.preventDefault();
    if (status === "saving") return;
    const result = validateContactSettings(form);
    if (!result.valid) {
      setErrors(result.errors);
      setFeedback("Revise os campos indicados antes de salvar.");
      return;
    }
    setStatus("saving");
    setErrors({});
    setFeedback("");
    try {
      setForm(await salvarMinhaConfiguracaoContato(result.value));
      setStatus("ready");
      setFeedback("Canais de atendimento salvos com sucesso.");
    } catch {
      setStatus("save-error");
      setFeedback("Não foi possível salvar. Seus dados continuam no formulário; tente novamente.");
    }
  }

  return (
    <div className="app-shell contact-settings-shell">
      <Sidebar />
      <main className="app-main page-container contact-settings-page">
        <header className="contact-settings-heading">
          <span>ATENDIMENTO</span>
          <h1>Contato com alunos</h1>
          <p>Escolha quais canais seus alunos vinculados poderão usar. Nenhum contato é publicado sem sua ativação explícita.</p>
        </header>

        {status === "loading" && <div className="contact-settings-state" role="status">Carregando canais de atendimento...</div>}
        {status === "load-error" && (
          <div className="contact-settings-state is-error" role="alert">
            <AlertCircle aria-hidden="true" size={20} /> Não foi possível carregar suas configurações.
            <button onClick={load} type="button"><RefreshCcw aria-hidden="true" size={17} /> Tentar novamente</button>
          </div>
        )}

        {status !== "loading" && status !== "load-error" && (
          <form className="contact-settings-form" noValidate onSubmit={submit}>
            <ContactChannel
              checked={form.whatsappEnabled}
              description="Número usado exclusivamente para atendimento pelo WhatsApp."
              error={errors.whatsappNumber}
              fieldId="contact-whatsapp"
              icon={MessageCircle}
              label="WhatsApp"
              onChecked={(value) => update("whatsappEnabled", value)}
            >
              <input aria-describedby={errors.whatsappNumber ? "contact-whatsapp-error" : "contact-whatsapp-help"} aria-invalid={Boolean(errors.whatsappNumber)} id="contact-whatsapp" inputMode="tel" maxLength={30} onChange={(event) => update("whatsappNumber", event.target.value)} placeholder="Ex.: +55 11 99999-9999" type="tel" value={form.whatsappNumber} />
              <small id="contact-whatsapp-help">Use DDD para números brasileiros ou informe o código do país.</small>
              {errors.whatsappNumber && <small className="contact-field-error" id="contact-whatsapp-error">{errors.whatsappNumber}</small>}
            </ContactChannel>

            <ContactChannel
              checked={form.emailEnabled}
              description="Endereço dedicado que ficará visível na área do aluno."
              error={errors.contactEmail}
              fieldId="contact-email"
              icon={Mail}
              label="E-mail"
              onChecked={(value) => update("emailEnabled", value)}
            >
              <input aria-describedby={errors.contactEmail ? "contact-email-error" : undefined} aria-invalid={Boolean(errors.contactEmail)} autoComplete="email" id="contact-email" maxLength={254} onChange={(event) => update("contactEmail", event.target.value)} placeholder="atendimento@exemplo.com" type="email" value={form.contactEmail} />
              {errors.contactEmail && <small className="contact-field-error" id="contact-email-error">{errors.contactEmail}</small>}
            </ContactChannel>

            <div aria-live="polite" className={`contact-settings-feedback${status === "save-error" ? " is-error" : ""}`}>
              {feedback && (status === "ready" ? <CheckCircle2 aria-hidden="true" size={18} /> : <AlertCircle aria-hidden="true" size={18} />)}
              {feedback}
            </div>
            <button className="contact-settings-save" disabled={status === "saving"} type="submit">
              {status === "saving" ? "Salvando..." : "Salvar canais"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

function ContactChannel({ checked, children, description, fieldId, icon: Icon, label, onChecked }) {
  return (
    <fieldset className="contact-channel-card">
      <legend className="sr-only">Canal {label}</legend>
      <div className="contact-channel-header">
        <div className="contact-channel-title"><Icon aria-hidden="true" size={21} /><div><strong>{label}</strong><p>{description}</p></div></div>
        <label className="contact-channel-toggle"><input checked={checked} onChange={(event) => onChecked(event.target.checked)} type="checkbox" /><span>Disponibilizar {label}</span></label>
      </div>
      <label className="contact-field-label" htmlFor={fieldId}>{label === "WhatsApp" ? "Número de atendimento" : "E-mail de atendimento"}</label>
      {children}
    </fieldset>
  );
}

export default ProfessionalContactSettings;
