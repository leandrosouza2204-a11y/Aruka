import LoadingState from "../../../components/LoadingState";
import TableActions, { TableActionItem } from "../../../components/TableActions";
import { classeStatusTreino, formatarData } from "../hooks/useTreinosPage";
import TreinosEmptyState from "./TreinosEmptyState";

function TreinosTable({
  carregando,
  treinos,
  onVisualizar,
  onEditar,
  onDuplicar,
  onExcluir,
  onNovoTreino,
  styles,
}) {
  return (
    <div className="app-table-scroll treinos-table">
      <table className="app-table" style={styles.tabela}>
        <thead>
          <tr style={styles.linhaCabecalho}>
            <th style={styles.tabelaHeader}>Aluno</th>
            <th style={styles.tabelaHeader}>Rotina</th>
            <th style={styles.tabelaHeader}>Objetivo</th>
            <th style={styles.tabelaHeader}>Nível</th>
            <th style={styles.tabelaHeader}>Status</th>
            <th style={styles.tabelaHeader}>Revisão</th>
            <th style={styles.tabelaHeader}>Dias</th>
            <th style={styles.tabelaHeader}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {carregando && (
            <tr>
              <td style={styles.estadoVazio} colSpan="8">
                <LoadingState texto="Carregando treinos..." />
              </td>
            </tr>
          )}

          {!carregando &&
            treinos.map((treino) => (
              <tr key={treino.id}>
                <td className="cell-wide" style={styles.tabelaCelula}>
                  {treino.aluno || "-"}
                </td>
                <td className="cell-wide" style={styles.tabelaCelula}>
                  {treino.rotina || "-"}
                </td>
                <td style={styles.tabelaCelula}>{treino.objetivo || "-"}</td>
                <td style={styles.tabelaCelula}>{treino.nivel || "-"}</td>
                <td style={styles.tabelaCelula}>
                  <span className={classeStatusTreino(treino.status || "Ativo")}>
                    {treino.status || "Ativo"}
                  </span>
                </td>
                <td style={styles.tabelaCelula}>
                  {formatarData(treino.dataRevisao)}
                </td>
                <td style={styles.tabelaCelula}>{treino.dias?.length || 0}</td>
                <td style={styles.tabelaCelula}>
                  <div className="table-actions-inline">
                    <button
                      onClick={() => onVisualizar(treino.id)}
                      className="table-button table-button-primary"
                    >
                      Visualizar
                    </button>
                    <TableActions>
                      <TableActionItem onClick={() => onEditar(treino)}>
                        Editar
                      </TableActionItem>
                      <TableActionItem onClick={() => onDuplicar(treino)}>
                        Duplicar
                      </TableActionItem>
                      <TableActionItem
                        onClick={() => onExcluir(treino.id)}
                        variant="danger"
                      >
                        Excluir
                      </TableActionItem>
                    </TableActions>
                  </div>
                </td>
              </tr>
            ))}

          {!carregando && treinos.length === 0 && (
            <tr>
              <td style={styles.estadoVazio} colSpan="8">
                <TreinosEmptyState onNovoTreino={onNovoTreino} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TreinosTable;
