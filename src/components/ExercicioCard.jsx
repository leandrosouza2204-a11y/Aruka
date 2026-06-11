import { ExternalLink, Pencil, Trash2 } from "lucide-react";

function ExercicioCard({ exercicio, onEdit, onDelete }) {
  return (
    <div className="treino-exercise-card" style={card}>
      <div className="exercise-card-top" style={topo}>
        <div className="exercise-card-title">
          <h4 style={titulo}>{exercicio.nome || "Exercício sem nome"}</h4>
          <p style={meta}>
            {exercicio.series || "-"} séries &bull; {exercicio.repeticoes || "-"} reps
          </p>
        </div>

        {(onEdit || onDelete) && (
          <div className="exercise-card-actions" style={acoes}>
            {onEdit && (
              <button onClick={onEdit} style={botaoSecundario}>
                <Pencil size={13} />
                Editar
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} style={botaoExcluir}>
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
        <Info label="Observações" valor={exercicio.observacoes} />
      </div>

      {exercicio.video && (
        <a
          href={exercicio.video}
          target="_blank"
          rel="noreferrer"
          style={linkVideo}
        >
          <ExternalLink size={13} />
          Ver vídeo
        </a>
      )}
    </div>
  );
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
  padding: "14px",
  transition: "transform 0.18s ease, box-shadow 0.18s ease",
};

const topo = {
  alignItems: "flex-start",
  display: "flex",
  gap: "12px",
  justifyContent: "space-between",
};

const titulo = {
  color: "#111827",
  fontSize: "15px",
  lineHeight: 1.25,
  margin: 0,
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
  padding: "7px 10px",
};

const botaoExcluir = {
  ...botaoSecundario,
  background: "#dc2626",
  color: "white",
};

export default ExercicioCard;
