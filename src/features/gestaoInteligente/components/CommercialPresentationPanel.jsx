import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ClipboardCopy, MessageSquareText, RefreshCw } from "lucide-react";
import AccessibleModal from "../../../components/AccessibleModal";
import { useToast } from "../../../hooks/useToast";
import { listSmartManagementServices } from "../../../services/smartManagementService";
import { copyTextToClipboard } from "../../../utils/clipboard";
import { buildCommercialPresentation } from "../utils/commercialPresentation";
import { buildServiceSummary, formatServicePrice } from "../utils/servicesPricing";

function CommercialPresentationPanel({ onNavigate }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setServices(await listSmartManagementServices("active"));
    } catch {
      setError("Não foi possível carregar os serviços ativos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadServices);
  }, [loadServices]);

  return (
    <section className="smart-management-commercial" aria-labelledby="commercial-presentation-title">
      <div className="smart-management-simulator-toolbar">
        <div>
          <h2 id="commercial-presentation-title">Apresentação Comercial</h2>
          <p>Monte uma mensagem curta com seus serviços e preços para copiar e enviar no aplicativo que preferir.</p>
        </div>
        <button type="button" className="btn btn-primary smart-management-primary-action" onClick={() => setIsModalOpen(true)} disabled={loading || Boolean(error) || services.length === 0}>
          <MessageSquareText size={18} aria-hidden="true" />
          Montar apresentação
        </button>
      </div>

      {loading && <div className="smart-management-state" role="status">Carregando serviços ativos...</div>}
      {!loading && error && <div className="smart-management-state smart-management-error" role="alert"><span>{error}</span><button type="button" className="btn btn-secondary" onClick={loadServices}><RefreshCw size={16} aria-hidden="true" />Tentar novamente</button></div>}
      {!loading && !error && services.length === 0 && (
        <section className="smart-management-empty-state">
          <ClipboardCopy size={30} aria-hidden="true" />
          <h2>Você ainda não possui serviços ativos para apresentar.</h2>
          <p>Cadastre sua oferta comercial antes de montar uma mensagem para clientes.</p>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate?.("services")}>Ir para Serviços & Precificação</button>
        </section>
      )}
      {!loading && !error && services.length > 0 && (
        <div className="smart-management-commercial-summary" aria-label="Resumo da apresentação comercial">
          <strong>{services.length} serviço{services.length === 1 ? "" : "s"} ativo{services.length === 1 ? "" : "s"} disponível{services.length === 1 ? "" : "is"}</strong>
          <span>Arquivados ficam fora da mensagem por padrão.</span>
        </div>
      )}

      {isModalOpen && <CommercialPresentationModal services={services} onClose={() => setIsModalOpen(false)} />}
    </section>
  );
}

function CommercialPresentationModal({ services, onClose }) {
  const initialSelected = useMemo(() => services.map((service) => service.id), [services]);
  const [selectedIds, setSelectedIds] = useState(initialSelected);
  const [message, setMessage] = useState(() => buildCommercialPresentation({ services }));
  const [outdated, setOutdated] = useState(false);
  const [copying, setCopying] = useState(false);
  const [copyError, setCopyError] = useState("");
  const textareaRef = useRef(null);
  const toast = useToast();

  const selectedServices = services.filter((service) => selectedIds.includes(service.id));
  const canCopy = selectedServices.length > 0 && message.trim().length > 0 && !outdated && !copying;

  function toggleService(serviceId) {
    setSelectedIds((current) => {
      const next = current.includes(serviceId) ? current.filter((id) => id !== serviceId) : [...current, serviceId];
      return next;
    });
    setOutdated(true);
  }

  function updateMessage() {
    setMessage(buildCommercialPresentation({ services: selectedServices }));
    setOutdated(false);
    setCopyError("");
  }

  async function copyMessage() {
    if (!canCopy) return;
    setCopying(true);
    setCopyError("");
    try {
      await copyTextToClipboard(message);
      toast.sucesso("Mensagem copiada!", "Cole no WhatsApp ou em outro aplicativo quando quiser.");
    } catch {
      setCopyError("Não foi possível copiar a mensagem. Tente novamente.");
      toast.erro("Não foi possível copiar a mensagem", "Tente novamente em alguns instantes.");
    } finally {
      setCopying(false);
    }
  }

  return (
    <AccessibleModal
      isOpen
      onClose={onClose}
      title="Apresentação Comercial"
      description="Monte uma mensagem com seus serviços e preços para enviar aos seus clientes."
      size="xl"
      initialFocusRef={textareaRef}
      contentClassName="smart-management-commercial-modal"
      footer={<><button type="button" className="btn btn-secondary" onClick={onClose} disabled={copying}>Cancelar</button><button type="button" className="btn btn-primary" onClick={copyMessage} disabled={!canCopy}><ClipboardCopy size={18} aria-hidden="true" />{copying ? "Copiando..." : "Copiar mensagem"}</button></>}
    >
      <div className="smart-management-commercial-modal-grid">
        <fieldset className="smart-management-location-selector smart-management-commercial-services">
          <legend>Selecionar serviços</legend>
          <p>Escolha quais ofertas entram na mensagem.</p>
          <div>
            {services.map((service) => (
              <label key={service.id} className={selectedIds.includes(service.id) ? "is-selected" : ""}>
                <input type="checkbox" checked={selectedIds.includes(service.id)} onChange={() => toggleService(service.id)} />
                <span>{service.name}</span>
                <small>{formatServicePrice(service)} - {buildServiceSummary(service)}</small>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="smart-management-commercial-editor">
          <div className="smart-management-commercial-editor-header">
            <label htmlFor="commercial-presentation-message">Mensagem da apresentação</label>
            <button type="button" className="btn btn-secondary" onClick={updateMessage} disabled={selectedServices.length === 0}>
              <RefreshCw size={16} aria-hidden="true" />
              Atualizar mensagem
            </button>
          </div>
          {selectedServices.length === 0 && <p className="smart-management-field-error" role="alert">Selecione pelo menos um serviço.</p>}
          {outdated && <p className="smart-management-commercial-warning" role="status"><Check size={16} aria-hidden="true" />A seleção mudou. Clique em Atualizar mensagem para regerar sem perder edições sem aviso.</p>}
          <textarea id="commercial-presentation-message" ref={textareaRef} value={message} onChange={(event) => { setMessage(event.target.value); }} rows={16} />
          <span className="smart-management-commercial-counter">{message.length} caracteres</span>
          {copyError && <p className="smart-management-field-error" role="alert">{copyError}</p>}
        </div>
      </div>
    </AccessibleModal>
  );
}

export default CommercialPresentationPanel;
