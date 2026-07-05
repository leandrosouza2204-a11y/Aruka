import { calcularComposicaoCorporal } from "../../../data/calculosCorporais";
import LoadingState from "../../../components/LoadingState";
import TableActions, { TableActionItem } from "../../../components/TableActions";
import {
  formatarCm,
  formatarData,
  formatarKg,
  formatarPercentual,
  formatarStatus,
} from "../hooks/useAvaliacoesPage";
import AvaliacoesEmptyState from "./AvaliacoesEmptyState";

function AvaliacoesTable({
  avaliacoes,
  carregando,
  onPerfil,
  onEditar,
  onAnamnese,
  onExcluir,
  onNovaAvaliacao,
  onNovaAnamnese,
  styles,
}) {
  return (
    <div className="app-table-scroll avaliacoes-table">
      <table className="app-table" style={styles.tabela}>
        <thead>
          <tr style={styles.linhaCabecalho}>
            <th style={styles.tabelaHeader}>Aluno</th>
            <th style={styles.tabelaHeader}>Última avaliação</th>
            <th style={styles.tabelaHeader}>Status</th>
            <th style={styles.tabelaHeader}>Peso</th>
            <th style={styles.tabelaHeader}>Cintura</th>
            <th style={styles.tabelaHeader}>% gordura</th>
            <th style={styles.tabelaHeader}>IMC</th>
            <th style={styles.tabelaHeader}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!carregando &&
            avaliacoes.map((avaliacao) => {
              const composicao = calcularComposicaoCorporal(avaliacao);

              return (
                <tr key={avaliacao.id}>
                  <td className="cell-wide" style={styles.tabelaCelula}>
                    {avaliacao.aluno}
                  </td>
                  <td style={styles.tabelaCelula}>{formatarData(avaliacao.data)}</td>
                  <td style={styles.tabelaCelula}>
                    {formatarStatus(avaliacao.status)}
                  </td>
                  <td style={styles.tabelaCelula}>{formatarKg(avaliacao.peso)}</td>
                  <td style={styles.tabelaCelula}>
                    {formatarCm(avaliacao.medidas?.cintura)}
                  </td>
                  <td style={styles.tabelaCelula}>
                    {formatarPercentual(composicao.percentualGordura)}
                  </td>
                  <td style={styles.tabelaCelula}>{composicao.imc || "-"}</td>
                  <td style={styles.tabelaCelula}>
                    <div className="table-actions-inline">
                      <button
                        onClick={() => onPerfil(avaliacao.alunoId)}
                        className="table-button table-button-secondary"
                        disabled={!avaliacao.alunoId}
                      >
                        Perfil
                      </button>
                      <TableActions>
                        <TableActionItem onClick={() => onEditar(avaliacao)}>
                          Editar
                        </TableActionItem>
                        <TableActionItem
                          onClick={() => onAnamnese(avaliacao.alunoId)}
                          disabled={!avaliacao.alunoId}
                        >
                          Anamnese
                        </TableActionItem>
                        <TableActionItem
                          onClick={() => onExcluir(avaliacao.id)}
                          variant="danger"
                        >
                          Excluir
                        </TableActionItem>
                      </TableActions>
                    </div>
                  </td>
                </tr>
              );
            })}

          {carregando && (
            <tr>
              <td style={styles.estadoVazio} colSpan="8">
                <LoadingState texto="Carregando avaliações..." />
              </td>
            </tr>
          )}

          {!carregando && avaliacoes.length === 0 && (
            <tr>
              <td style={styles.estadoVazio} colSpan="8">
                <AvaliacoesEmptyState
                  onNovaAvaliacao={onNovaAvaliacao}
                  onNovaAnamnese={onNovaAnamnese}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AvaliacoesTable;
