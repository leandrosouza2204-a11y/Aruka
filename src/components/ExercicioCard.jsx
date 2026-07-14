import { ArrowDown, ArrowUp, ExternalLink, Pencil, Trash2 } from "lucide-react";

function ExercicioCard({
  exercicio,
  index = 0,
  total = 1,
  onEdit,
  onDelete,
  onMoveDown,
  onMoveUp,
}) {
  const videoSeguro = obterUrlVideoSegura(exercicio.video);
  const ordem = index + 1;

  return (
    <div
      className="treino-exercise-card"
      style={card}
      data-testid="exercise-card"
      data-exercise-id={exercicio.id}
    >
      <div className="exercise-card-top" style={topo}>
        <div className="exercise-card-title">
          <span className="exercise-card-order" style={ordemBadge}>
            #{ordem}
          </span>
          <h4 style={titulo} title={exercicio.nome || "Exercicio sem nome"}>
            {exercicio.nome || "Exercicio sem nome"}
          </h4>
          <p style={meta}>
            {exercicio.series || "-"} series &bull; {exercicio.repeticoes || "-"} reps
          </p>
        </div>

        {(onEdit || onDelete || onMoveUp || onMoveDown) && (
          <div className="exercise-card-actions" style={acoes}>
            {onMoveUp && (
              <button
                type="button"
                onClick={onMoveUp}
                style={index === 0 ? botaoDesabilitado : botaoSecundario}
                disabled={index === 0}
                aria-label={`Mover exercicio ${exercicio.nome || ordem} para cima`}
                data-testid="exercise-move-up"
              >
                <ArrowUp size={13} />
                Subir
              </button>
            )}
            {onMoveDown && (
              <button
                type="button"
                onClick={onMoveDown}
                style={index >= total - 1 ? botaoDesabilitado : botaoSecundario}
                disabled={index >= total - 1}
                aria-label={`Mover exercicio ${exercicio.nome || ordem} para baixo`}
                data-testid="exercise-move-down"
              >
                <ArrowDown size={13} />
                Descer
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                style={botaoSecundario}
                data-testid="exercise-edit"
              >
                <Pencil size={13} />
                Editar
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                style={botaoExcluir}
                data-testid="exercise-delete"
              >
                <Trash2 size={13} />
                Excluir
              </button>
            )}
          </div>
        )}
      </div>

      <div className="exercise-card-grid" style={grid}>
        <Info label="Carga" valor={exercicio.carga} />
        <Info label="Descanso" valor={exercicio.descanso} />
        <Info label="Observacoes" valor={exercicio.observacoes} />
      </div>

      {videoSeguro && (
        <a
          href={videoSeguro}
          target="_blank"
          rel="noreferrer"
          style={linkVideo}
        >
          <ExternalLink size={13} />
          Ver video
        </a>
      )}
    </div>
  );
}

function obterUrlVideoSegura(url) {
  if (!url) return "";

  try {
    const parsed = new URL(String(url));
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
}

function Info({ label, valor }) {
  return (
    <div style={infoBox}>
      <span style={infoLabel}>{label}</span>
      <strong style={infoValor}>{valor || "-"}</strong>
    </div>
  );
}

const card = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(248,250,252,0.9))",
  border: "1px solid rgba(226, 232, 240, 0.38)",
  borderRadius: "8px",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.065)",
  minWidth: 0,
  padding: "14px",
  transition: "transform 0.18s ease, box-shadow 0.18s ease",
};

const topo = {
  alignItems: "flex-start",
  display: "flex",
  gap: "12px",
  justifyContent: "space-between",
  minWidth: 0,
};

const titulo = {
  color: "#111827",
  fontSize: "15px",
  lineHeight: 1.25,
  margin: "5px 0 0",
  maxWidth: "100%",
  overflowWrap: "anywhere",
  whiteSpace: "normal",
};

const ordemBadge = {
  background: "#eef2ff",
  borderRadius: "999px",
  color: "#1d4ed8",
  display: "inline-flex",
  fontSize: "11px",
  fontWeight: "850",
  lineHeight: 1,
  padding: "5px 7px",
};

const meta = {
  color: "#2563eb",
  fontSize: "13px",
  fontWeight: "800",
  marginTop: "4px",
};

const acoes = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const grid = {
  display: "grid",
  gap: "8px",
  gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))",
  marginTop: "14px",
};

const infoBox = {
  background: "rgba(239, 246, 255, 0.68)",
  border: "1px solid rgba(191, 219, 254, 0.32)",
  borderRadius: "8px",
  minHeight: "58px",
  minWidth: 0,
  padding: "9px",
};

const infoLabel = {
  color: "#6b7280",
  display: "block",
  fontSize: "11px",
  fontWeight: "800",
  marginBottom: "4px",
  textTransform: "uppercase",
};

const infoValor = {
  color: "#111827",
  display: "block",
  fontSize: "13px",
  lineHeight: 1.35,
  overflowWrap: "anywhere",
};

const linkVideo = {
  alignItems: "center",
  color: "#2563eb",
  display: "inline-flex",
  fontSize: "13px",
  fontWeight: "800",
  gap: "6px",
  marginTop: "12px",
  textDecoration: "none",
};

const botaoSecundario = {
  alignItems: "center",
  background: "#e5e7eb",
  border: "none",
  borderRadius: "6px",
  color: "#111827",
  cursor: "pointer",
  display: "inline-flex",
  fontSize: "13px",
  gap: "5px",
  minHeight: "36px",
  padding: "7px 10px",
};

const botaoDesabilitado = {
  ...botaoSecundario,
  cursor: "not-allowed",
  opacity: 0.48,
};

const botaoExcluir = {
  ...botaoSecundario,
  background: "#dc2626",
  color: "white",
};

export default ExercicioCard;
