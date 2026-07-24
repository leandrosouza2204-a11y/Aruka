import LoadingState from "../../../components/LoadingState";
import TableActions, { TableActionItem } from "../../../components/TableActions";
import { formatarData, formatarEscala } from "../hooks/useAvaliacoesPage";
import AvaliacoesEmptyState from "./AvaliacoesEmptyState";

function AnamnesesTable({
  anamneses,
  carregando,
  onEditar,
  onPerfil,
  onRelatorio,
  onNovaAvaliacao,
  onNovaAnamnese,
  emptyState,
  contextualStudent,
  searchTerm,
  returnToSeguro,
  onClearContext,
  onClearFilters,
  onClearSearch,
  onReturn,
  styles,
}) {
  return (
    <div className="app-table-scroll avaliacoes-table">
      <table className="app-table" style={styles.tabela}>
        <thead>
          <tr style={styles.linhaCabecalho}>
            <th style={styles.tabelaHeader}>Aluno</th>
            <th style={styles.tabelaHeader}>Data</th>
            <th style={styles.tabelaHeader}>Objetivo</th>
            <th style={styles.tabelaHeader}>Sono</th>
            <th style={styles.tabelaHeader}>Estresse</th>
            <th style={styles.tabelaHeader}>Dores/lesões</th>
            <th style={styles.tabelaHeader}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!carregando &&
            anamneses.map((anamnese) => (
              <tr
                key={anamnese.id}
                data-testid="anamnese-row"
                data-aluno-id={anamnese.alunoId || ""}
              >
                <td className="cell-wide" style={styles.tabelaCelula}>
                  {anamnese.aluno}
                </td>
                <td style={styles.tabelaCelula}>{formatarData(anamnese.createdAt)}</td>
                <td style={styles.tabelaCelula}>{anamnese.objetivoPrincipal || "-"}</td>
                <td style={styles.tabelaCelula}>{formatarEscala(anamnese.escalaSono)}</td>
                <td style={styles.tabelaCelula}>
                  {formatarEscala(anamnese.escalaEstresse)}
                </td>
                <td style={styles.tabelaCelula}>{anamnese.doresLesoes || "-"}</td>
                <td style={styles.tabelaCelula}>
                  <div className="table-actions-inline">
                    <button
                      onClick={() => onPerfil(anamnese.alunoId)}
                      className="table-button table-button-secondary"
                      disabled={!anamnese.alunoId}
                    >
                      Perfil
                    </button>
                    <TableActions>
                      <TableActionItem onClick={() => onEditar(anamnese)}>
                        Editar
                      </TableActionItem>
                      <TableActionItem
                        onClick={() => onRelatorio(anamnese)}
                        disabled={!anamnese.alunoId}
                      >
                        Relatório
                      </TableActionItem>
                    </TableActions>
                  </div>
                </td>
              </tr>
            ))}

          {carregando && (
            <tr>
              <td style={styles.estadoVazio} colSpan="7">
                <LoadingState texto="Carregando anamneses..." />
              </td>
            </tr>
          )}

          {!carregando && anamneses.length === 0 && (
            <tr data-testid="avaliacoes-empty-row">
              <td style={styles.estadoVazio} colSpan="7">
                <AvaliacoesEmptyState
                  activeTab="anamneses"
                  contextualStudent={contextualStudent}
                  returnToSeguro={returnToSeguro}
                  searchTerm={searchTerm}
                  state={emptyState}
                  onClearContext={onClearContext}
                  onClearFilters={onClearFilters}
                  onClearSearch={onClearSearch}
                  onNovaAvaliacao={onNovaAvaliacao}
                  onNovaAnamnese={onNovaAnamnese}
                  onReturn={onReturn}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AnamnesesTable;
