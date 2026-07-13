import TableActions, { TableActionItem } from "../../../components/TableActions";
import LoadingState from "../../../components/LoadingState";
import { formatarData, formatarMoeda } from "../../../data/alunosUtils";
import { classeStatusAluno } from "../../../data/statusHelpers";
import { normalizarTelefoneWhatsApp } from "../../../services/whatsappService";
import AlunosEmptyState from "./AlunosEmptyState";

function AlunosTable({
  alunos,
  carregando,
  nomePlano,
  onCheckin,
  onDetalhes,
  onEditar,
  onExcluir,
  onNovoAluno,
  styles,
}) {
  return (
    <div className="app-table-scroll desktop-table alunos-table">
      <table className="app-table" style={styles.tabela}>
        <thead>
          <tr style={styles.linhaCabecalho}>
            <th style={styles.tabelaHeader}>Nome</th>
            <th style={styles.tabelaHeader}>WhatsApp</th>
            <th style={styles.tabelaHeader}>Plano</th>
            <th style={styles.tabelaHeader}>Valor</th>
            <th style={styles.tabelaHeader}>Vencimento</th>
            <th style={styles.tabelaHeader}>Status</th>
            <th style={styles.tabelaHeader}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {!carregando &&
            alunos.map((aluno) => (
              <tr key={aluno.id}>
                <td className="cell-wide" style={styles.tabelaCelula}>{aluno.nome}</td>
                <td style={styles.tabelaCelula}>{aluno.whatsapp || "-"}</td>
                <td style={styles.tabelaCelula}>{nomePlano(aluno.plano)}</td>
                <td style={styles.tabelaCelula}>{formatarMoeda(aluno.valor)}</td>
                <td style={styles.tabelaCelula}>{formatarData(aluno.vencimento)}</td>
                <td style={styles.tabelaCelula}>
                  <span className={classeStatusAluno(aluno.status)}>
                    {aluno.status}
                  </span>
                </td>
                <td style={styles.tabelaCelula}>
                  <div className="table-actions-inline">
                    <button
                      onClick={() => onDetalhes(aluno.id)}
                      className="table-button table-button-secondary"
                      data-testid="aluno-action-details"
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => onCheckin(aluno)}
                      className="table-button table-button-success"
                      data-testid="aluno-action-whatsapp"
                      disabled={!normalizarTelefoneWhatsApp(aluno.whatsapp)}
                      title={
                        normalizarTelefoneWhatsApp(aluno.whatsapp)
                          ? "Enviar check-in semanal pelo WhatsApp"
                          : "WhatsApp não cadastrado"
                      }
                    >
                      Check-in
                    </button>
                    <TableActions>
                      <TableActionItem
                        data-testid="aluno-action-edit"
                        onClick={() => onEditar(aluno)}
                      >
                        Editar
                      </TableActionItem>
                      <TableActionItem
                        data-testid="aluno-action-delete"
                        onClick={() => onExcluir(aluno.id)}
                        variant="danger"
                      >
                        Excluir
                      </TableActionItem>
                    </TableActions>
                  </div>
                </td>
              </tr>
            ))}

          {carregando && (
            <tr>
              <td style={styles.estadoVazio} colSpan="7">
                <LoadingState texto="Carregando alunos..." />
              </td>
            </tr>
          )}

          {!carregando && alunos.length === 0 && (
            <tr>
              <td style={styles.estadoVazio} colSpan="7">
                <AlunosEmptyState onNovoAluno={onNovoAluno} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AlunosTable;
