import { ArrowRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

function DashboardSmartManagement() {
  return (
    <section className="dashboard-panel dashboard-smart-management" aria-labelledby="dashboard-smart-management-title">
      <div className="dashboard-smart-management-header">
        <span className="dashboard-smart-management-icon" aria-hidden="true"><Building2 size={20} /></span>
        <div>
          <h2 id="dashboard-smart-management-title">Gestão Inteligente</h2>
          <p>Organize locais, serviços e cenários de atendimento.</p>
        </div>
      </div>
      <Link className="app-button app-button-secondary dashboard-smart-management-action" to="/gestao-inteligente">
        Acessar Gestão Inteligente
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </section>
  );
}

export default DashboardSmartManagement;
