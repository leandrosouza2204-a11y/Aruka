import {
  CalendarClock,
  Dumbbell,
  Eye,
  Layers3,
  MessageCircle,
  Send,
  Target,
  TimerReset,
  X,
} from "lucide-react";
import ExercicioCard from "../../../components/ExercicioCard";
import { formatarData } from "../hooks/useTreinosPage";
import {
  getWorkoutLifecyclePresentation,
  getWorkoutPrimaryLifecycleAction,
  getWorkoutRelevantDate,
} from "../utils/workoutLifecyclePresentation";
import WorkoutLifecycleBadge from "./WorkoutLifecycleBadge";
import WorkoutOriginLabel from "./WorkoutOriginLabel";

function TreinoDetalhesModal({
  treino,
  alterandoEstadoTreinoId = "",
  entregandoTreinoId = "",
  onEnviarWhatsApp,
  onFechar,
  onLifecycleAction,
  styles,
}) {
  if (!treino) return null;

  const lifecycle = getWorkoutLifecyclePresentation(treino);
  const relevantDate = getWorkoutRelevantDate(treino);
  const primaryAction = getWorkoutPrimaryLifecycleAction(treino);
  const lifecycleLoading =
    entregandoTreinoId === treino.id || alterandoEstadoTreinoId === treino.id;

  return (
    <section className="treinos-details-card" style={styles.detalhesCard}>
      <div className="treino-details-hero" style={styles.detalhesHero}>
        <div className="treino-details-copy">
          <span style={styles.detalhesEyebrow}>Treino selecionado</span>
          <h2 style={styles.detalhesTitulo}>{treino.rotina || "Ficha de Treino"}</h2>
          <p style={styles.detalhesSubtitulo}>{treino.aluno || "Aluno não informado"}</p>
          <div className="treino-details-badges" style={styles.heroBadges}>
            <WorkoutLifecycleBadge treino={treino} />
            <span className="status-badge status-badge-info">
              {treino.nivel || "Nível não informado"}
            </span>
            <span className="status-badge status-badge-muted">
              {treino.objetivo || "Objetivo não informado"}
            </span>
          </div>
        </div>

        <div className="treino-details-actions" style={styles.detalhesAcoes}>
          {primaryAction !== "view" && (
            <button
              className="table-button table-button-primary"
              data-testid={`workout-detail-primary-action-${primaryAction}`}
              onClick={() => onLifecycleAction(primaryAction, treino)}
              disabled={lifecycleLoading}
              aria-busy={lifecycleLoading}
              style={styles.botaoPrimario}
            >
              <Send size={16} />
              {detailPrimaryLabel(primaryAction, lifecycleLoading)}
            </button>
          )}
          <button
            className="treino-whatsapp-button"
            onClick={onEnviarWhatsApp}
            style={styles.botaoWhatsApp}
          >
            <MessageCircle size={16} />
            Enviar pelo WhatsApp
          </button>
          <button className="treino-close-button" onClick={onFechar} style={styles.botaoFechar}>
            <X size={15} />
            Fechar
          </button>
        </div>
      </div>

      <div className="treinos-info-grid" style={styles.infoGrid}>
        <Info label="Objetivo" valor={treino.objetivo} icon={<Target size={17} />} styles={styles} />
        <Info label="Nível" valor={treino.nivel} icon={<Layers3 size={17} />} styles={styles} />
        <Info
          label="Estado"
          valor={`${lifecycle.label} - ${lifecycle.description}`}
          icon={<Eye size={17} />}
          styles={styles}
        />
        <Info label="Origem" valor={<WorkoutOriginLabel treino={treino} />} styles={styles} />
        <Info
          label="Início"
          valor={formatarData(treino.dataInicio)}
          icon={<CalendarClock size={17} />}
          styles={styles}
        />
        <Info
          label={relevantDate.label}
          valor={formatarData(relevantDate.value)}
          icon={<TimerReset size={17} />}
          styles={styles}
        />
        <Info label="Aplicado em" valor={formatarData(treino.appliedAt)} styles={styles} />
        <Info label="Entregue em" valor={formatarData(treino.deliveredAt)} styles={styles} />
        <Info label="Concluído em" valor={formatarData(treino.completedAt)} styles={styles} />
        <Info label="Arquivado em" valor={formatarData(treino.archivedAt)} styles={styles} />
        <Info
          label="Dias por semana"
          valor={treino.diasPorSemana}
          icon={<Dumbbell size={17} />}
          styles={styles}
        />
        <Info label="Observações" valor={treino.observacoes || "-"} destaque styles={styles} />
      </div>

      <section className="treinos-days-block" style={styles.diasBloco}>
        <div style={styles.diasHeader}>
          <div>
            <h3 style={styles.diasTitulo}>Dias do treino</h3>
            <p style={styles.diasLegenda}>
              Organize a execução por sessões e acompanhe os exercícios de cada dia.
            </p>
          </div>
          <span style={styles.diasContador}>{(treino.dias || []).length} dias</span>
        </div>

        <div className="treino-days-list" style={styles.diasDetalhes}>
          {(treino.dias || []).map((dia, index) => (
            <details key={dia.id} className="treino-day" open={index === 0} style={styles.diaDetalhe}>
              <summary style={styles.diaResumo}>
                <div>
                  <h4 style={styles.diaTitulo}>{dia.nome || `Dia ${index + 1}`}</h4>
                  <p style={styles.diaDescricao}>
                    {dia.descricao || "Sem descrição"} - {dia.exercicios?.length || 0} exercícios
                  </p>
                </div>
                <span style={styles.diaBadge}>{dia.exercicios?.length || 0}</span>
              </summary>

              <div className="treino-exercises-grid" style={styles.exerciciosGrid}>
                {(dia.exercicios || []).map((exercicio) => (
                  <ExercicioCard key={exercicio.id} exercicio={exercicio} />
                ))}

                {(!dia.exercicios || dia.exercicios.length === 0) && (
                  <div style={styles.estadoDiaVazio}>
                    Nenhum exercício cadastrado para este dia.
                  </div>
                )}
              </div>
            </details>
          ))}

          {(!treino.dias || treino.dias.length === 0) && (
            <div style={styles.estadoTreinoVazio}>Nenhum dia cadastrado para este treino.</div>
          )}
        </div>
      </section>
    </section>
  );
}

function Info({ label, valor, icon, destaque = false, styles }) {
  return (
    <div
      className={`treino-info-card${destaque ? " treino-info-card-highlight treino-observacoes-card" : ""}`}
      style={{
        ...styles.infoItem,
        ...(destaque ? styles.infoItemDestaque : {}),
      }}
    >
      {icon && (
        <span className="treino-info-card-icon" style={styles.infoIcon}>
          {icon}
        </span>
      )}
      <div className="treino-info-card-content">
        <span className="treino-info-card-label" style={styles.infoLabel}>
          {label}
        </span>
        <strong className="treino-info-card-value" style={styles.infoValor}>
          {valor || "-"}
        </strong>
      </div>
    </div>
  );
}

function detailPrimaryLabel(action, loading) {
  if (loading && action === "deliver") return "Entregando...";
  if (loading && action === "complete") return "Concluindo...";
  if (action === "deliver") return "Entregar treino";
  return "Concluir treino";
}

export default TreinoDetalhesModal;
