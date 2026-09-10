import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Building2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { getSmartManagementDashboardSummary } from "../../../services/smartManagementService";
import { buildSmartManagementDashboardSummary } from "../../gestaoInteligente/utils/dashboardSummary";

function DashboardSmartManagement() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setSummary(buildSmartManagementDashboardSummary(await getSmartManagementDashboardSummary()));
    } catch {
      setSummary(null);
      setError("Não foi possível carregar o resumo da Gestão Inteligente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return (
    <section className="dashboard-panel dashboard-smart-management" aria-labelledby="dashboard-smart-management-title">
      <div className="dashboard-smart-management-header">
        <span className="dashboard-smart-management-icon" aria-hidden="true"><Building2 size={20} /></span>
        <div>
          <h2 id="dashboard-smart-management-title">Gestão Inteligente</h2>
          <p>Organize locais, serviços e cenários de atendimento.</p>
        </div>
      </div>

      {loading ? (
        <div className="dashboard-smart-management-skeleton" role="status" aria-live="polite">
          <span className="dashboard-smart-management-skeleton-line" />
          <span className="dashboard-smart-management-skeleton-line is-short" />
          <span className="sr-only">Carregando resumo da Gestão Inteligente...</span>
        </div>
      ) : error ? (
        <div className="dashboard-smart-management-error" role="alert">
          <p>{error}</p>
          <button type="button" className="app-button app-button-secondary" onClick={loadSummary}>
            <RefreshCw size={16} aria-hidden="true" />
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          <p className="dashboard-smart-management-message" data-state={summary.state}>{summary.message}</p>
          <dl className="dashboard-smart-management-counts" aria-label="Resumo de configuração">
            <div><dt>Locais ativos</dt><dd>{summary.activeLocationsCount}</dd></div>
            <div><dt>Serviços ativos</dt><dd>{summary.activeServicesCount}</dd></div>
          </dl>
        </>
      )}

      <Link className="app-button app-button-primary dashboard-smart-management-action" to="/gestao-inteligente">
        {summary?.state === "empty" ? "Configurar agora" : "Acessar Gestão Inteligente"}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </section>
  );
}

export default DashboardSmartManagement;
