import {
  EMPTY_CONTEXTUAL,
  EMPTY_FILTER,
  EMPTY_GENERAL,
  EMPTY_SEARCH,
} from "../utils/avaliacoesContext";

function AvaliacoesEmptyState({
  activeTab = "avaliacoes",
  contextualStudent,
  searchTerm = "",
  state = EMPTY_GENERAL,
  returnToSeguro,
  onClearContext,
  onClearFilters,
  onClearSearch,
  onNovaAvaliacao,
  onNovaAnamnese,
  onReturn,
}) {
  const copy = getCopy({ activeTab, contextualStudent, searchTerm, state });

  return (
    <div
      className="app-empty-state avaliacoes-empty-state app-section"
      data-testid="avaliacoes-empty-state"
    >
      <h3>{copy.title}</h3>
      <p className="app-muted">{copy.description}</p>
      <div className="avaliacoes-empty-actions">
        {copy.showAssessment && (
          <button
            className="app-button app-button-primary table-button table-button-primary"
            data-testid="avaliacoes-empty-new-assessment"
            onClick={onNovaAvaliacao}
            type="button"
          >
            Nova avaliacao
          </button>
        )}
        {copy.showAnamnese && (
          <button
            className="app-button app-button-secondary table-button table-button-secondary"
            onClick={onNovaAnamnese}
            type="button"
          >
            Nova anamnese
          </button>
        )}
        {copy.showClearSearch && (
          <button
            className="app-button app-button-secondary table-button table-button-secondary"
            data-testid="avaliacoes-empty-clear-search"
            onClick={onClearSearch}
            type="button"
          >
            Limpar busca
          </button>
        )}
        {copy.showClearContext && (
          <button
            className="app-button app-button-secondary table-button table-button-secondary"
            onClick={onClearContext}
            type="button"
          >
            Mostrar todos
          </button>
        )}
        {copy.showClearFilters && (
          <button
            className="app-button app-button-secondary table-button table-button-secondary"
            onClick={onClearFilters}
            type="button"
          >
            Limpar filtros
          </button>
        )}
        {returnToSeguro && copy.showReturn && (
          <button
            className="app-button app-button-secondary table-button table-button-secondary"
            onClick={onReturn}
            type="button"
          >
            Voltar para o aluno
          </button>
        )}
      </div>
    </div>
  );
}

function getCopy({ activeTab, contextualStudent, searchTerm, state }) {
  const isAnamnese = activeTab === "anamneses";
  const studentName = contextualStudent?.nome || "este aluno";

  if (state === EMPTY_SEARCH) {
    return {
      title: `Nenhum resultado encontrado para "${searchTerm}".`,
      description:
        "Revise a busca ou limpe o filtro para visualizar os registros disponiveis.",
      showClearSearch: true,
      showClearContext: Boolean(contextualStudent),
    };
  }

  if (state === EMPTY_FILTER) {
    return {
      title: "Nenhum registro corresponde aos filtros selecionados.",
      description: "Limpe os filtros para voltar aos registros disponiveis.",
      showClearFilters: true,
    };
  }

  if (state === EMPTY_CONTEXTUAL) {
    return {
      title: isAnamnese
        ? `Nenhuma anamnese encontrada para ${studentName}.`
        : `Nenhuma avaliacao encontrada para ${studentName}.`,
      description: isAnamnese
        ? "Cadastre a primeira anamnese para reunir informacoes relevantes sobre o aluno."
        : "Registre a primeira avaliacao para iniciar o acompanhamento da evolucao desse aluno.",
      showAssessment: true,
      showAnamnese: true,
      showClearContext: true,
      showReturn: true,
    };
  }

  if (state === EMPTY_GENERAL && isAnamnese) {
    return {
      title: "Nenhuma anamnese cadastrada ainda.",
      description:
        "Cadastre a primeira anamnese para registrar informacoes importantes antes do acompanhamento.",
      showAnamnese: true,
    };
  }

  return {
    title: "Nenhuma avaliacao cadastrada ainda.",
    description:
      "Registre a primeira avaliacao para comecar a acompanhar a evolucao dos seus alunos.",
    showAssessment: true,
    showAnamnese: true,
  };
}

export default AvaliacoesEmptyState;
