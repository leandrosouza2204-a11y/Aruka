import {
  CalendarClock,
  Copy,
  Dumbbell,
  Eye,
  Layers3,
  Pencil,
  Target,
  Trash2,
} from "lucide-react";
import LoadingState from "../../../components/LoadingState";
import TableActions, { TableActionItem } from "../../../components/TableActions";
import { classeStatusTreino, formatarData } from "../hooks/useTreinosPage";
import TreinosEmptyState from "./TreinosEmptyState";

function TreinosCards({
  carregando,
  selectedId,
  treinos,
  onVisualizar,
  onEditar,
  onDuplicar,
  onExcluir,
  alunoContextual,
  onNovoTreino,
  onUsarModelo,
  styles,
}) {
  if (carregando) {
    return (
      <div style={styles.libraryLoading}>
        <LoadingState texto="Carregando treinos..." />
      </div>
    );
  }

  if (treinos.length === 0) {
    return (
      <TreinosEmptyState
        alunoContextual={alunoContextual}
        onNovoTreino={onNovoTreino}
        onUsarModelo={onUsarModelo}
      />
    );
  }

  return (
    <div className="treinos-library-grid" style={styles.libraryGrid}>
      {treinos.map((treino) => (
        <article
          key={treino.id}
          className={`treino-library-card${selectedId === treino.id ? " is-selected" : ""}`}
          data-testid="treino-mobile-card"
          style={{
            ...styles.treinoCard,
            ...(selectedId === treino.id ? styles.treinoCardSelecionado : {}),
          }}
        >
          <div style={styles.treinoCardTop}>
            <div style={styles.treinoCardIcon}>
              <Dumbbell size={18} />
            </div>
            <span className={classeStatusTreino(treino.status || "Ativo")}>
              {treino.status || "Ativo"}
            </span>
          </div>

          <div>
            <h3 style={styles.treinoCardTitulo}>{treino.rotina || "Ficha de treino"}</h3>
            <p style={styles.treinoCardAluno}>{treino.aluno || "Aluno não informado"}</p>
          </div>

          <div style={styles.treinoBadges}>
            <Badge icon={<Target size={13} />} texto={treino.objetivo || "Sem objetivo"} />
            <Badge icon={<Layers3 size={13} />} texto={treino.nivel || "Sem nível"} />
          </div>

          <div style={styles.treinoMetaGrid}>
            <Meta
              icon={<CalendarClock size={15} />}
              label="Revisão"
              valor={formatarData(treino.dataRevisao)}
              styles={styles}
            />
            <Meta
              icon={<Dumbbell size={15} />}
              label="Dias"
              valor={`${treino.dias?.length || 0} por semana`}
              styles={styles}
            />
          </div>

          <div style={styles.treinoCardActions}>
            <button
              onClick={() => onVisualizar(treino.id)}
              className="table-button table-button-primary"
              data-testid="treino-open"
              style={styles.treinoVisualizar}
            >
              <Eye size={15} />
              Visualizar
            </button>
            <TableActions label={`Mais ações de ${treino.rotina || "treino"}`} testIdPrefix="treino">
              <TableActionItem data-testid="treino-action-edit" onClick={() => onEditar(treino)}>
                <Pencil size={14} />
                Editar
              </TableActionItem>
              <TableActionItem data-testid="treino-action-duplicate" onClick={() => onDuplicar(treino)}>
                <Copy size={14} />
                Duplicar
              </TableActionItem>
              <TableActionItem
                data-testid="treino-action-delete"
                onClick={() => onExcluir(treino.id)}
                variant="danger"
              >
                <Trash2 size={14} />
                Excluir
              </TableActionItem>
            </TableActions>
          </div>
        </article>
      ))}
    </div>
  );
}

function Badge({ icon, texto }) {
  return (
    <span className="treino-library-badge">
      {icon}
      {texto}
    </span>
  );
}

function Meta({ icon, label, valor, styles }) {
  return (
    <div style={styles.treinoMetaItem}>
      <span style={styles.treinoMetaIcon}>{icon}</span>
      <div>
        <span style={styles.treinoMetaLabel}>{label}</span>
        <strong style={styles.treinoMetaValor}>{valor || "-"}</strong>
      </div>
    </div>
  );
}

export default TreinosCards;
