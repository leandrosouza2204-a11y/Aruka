function ExercicioCard({ exercicio, onEdit, onDelete }) {
  return (
    <div style={card}>
      <div style={topo}>
        <div>
          <h4 style={titulo}>{exercicio.nome || "Exercicio sem nome"}</h4>
          <p style={meta}>
            {exercicio.series || "-"} series · {exercicio.repeticoes || "-"} reps
          </p>
        </div>

        {(onEdit || onDelete) && (
          <div style={acoes}>
            {onEdit && (
              <button onClick={onEdit} style={botaoSecundario}>
                Editar
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} style={botaoExcluir}>
                Excluir
              </button>
            )}
          </div>
        )}
      </div>

      <div style={grid}>
        <Info label="Carga" valor={exercicio.carga} />
        <Info label="Descanso" valor={exercicio.descanso} />
        <Info label="Observacoes" valor={exercicio.observacoes} />
      </div>

      {exercicio.video && (
        <a
          href={exercicio.video}
          target="_blank"
          rel="noreferrer"
          style={linkVideo}
        >
          Ver video
        </a>
      )}
    </div>
  );
}

function Info({ label, valor }) {
  return (
    <div>
      <span style={infoLabel}>{label}</span>
      <strong style={infoValor}>{valor || "-"}</strong>
    </div>
  );
}

const card = {
  background: "#f9fafb",
  border: "1px solid #eef2f7",
  borderRadius: "8px",
  padding: "14px",
};

const topo = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
};

const titulo = {
  margin: 0,
  color: "#111827",
  fontSize: "15px",
};

const meta = {
  color: "#6b7280",
  fontSize: "13px",
  marginTop: "4px",
};

const acoes = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "10px",
  marginTop: "12px",
};

const infoLabel = {
  display: "block",
  color: "#6b7280",
  fontSize: "11px",
  fontWeight: "700",
  marginBottom: "3px",
  textTransform: "uppercase",
};

const infoValor = {
  color: "#111827",
  fontSize: "13px",
};

const linkVideo = {
  display: "inline-block",
  marginTop: "12px",
  color: "#2563eb",
  fontSize: "13px",
  fontWeight: "700",
  textDecoration: "none",
};

const botaoSecundario = {
  background: "#e5e7eb",
  color: "#111827",
  border: "none",
  padding: "7px 10px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
};

const botaoExcluir = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "7px 10px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
};

export default ExercicioCard;
