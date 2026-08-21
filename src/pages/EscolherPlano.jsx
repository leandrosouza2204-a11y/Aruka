import { commercialPlans } from "../data/commercialPlans";

function EscolherPlano() {
  function solicitarLiberacao(plano) {
    const mensagem = [
      "Ola, tudo bem?",
      "",
      `Quero solicitar a liberacao de acesso ao sistema Aruka no plano *${plano.nome}*.`,
      "",
      "Se o pagamento for confirmado externamente, pode registrar a liberacao administrativa da minha assinatura?",
    ].join("\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(mensagem)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section style={secao}>
      <div style={topo}>
        <span style={etiqueta}>Assinatura</span>
        <h2 style={titulo}>Escolha um plano para solicitar liberacao</h2>
        <p style={texto}>
          A solicitacao abre uma conversa no WhatsApp. A liberacao do painel
          continua sendo feita por um administrador apos confirmacao externa.
        </p>
      </div>

      <div style={grid}>
        {commercialPlans.map((plano) => (
          <div key={plano.id} style={card}>
            <div>
              <h3 style={cardTitulo}>{plano.nome}</h3>
              <p style={descricao}>{plano.descricao}</p>
            </div>

            <button onClick={() => solicitarLiberacao(plano)} style={botao}>
              Solicitar pelo WhatsApp
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

const secao = {
  marginTop: "24px",
};

const topo = {
  display: "grid",
  gap: "6px",
};

const etiqueta = {
  color: "#2563eb",
  fontSize: "13px",
  fontWeight: "800",
  textTransform: "uppercase",
};

const titulo = {
  color: "#111827",
  fontSize: "24px",
  margin: 0,
};

const texto = {
  color: "#4b5563",
  lineHeight: 1.55,
  margin: "4px 0 0",
  maxWidth: "720px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "14px",
  marginTop: "18px",
};

const card = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  display: "grid",
  gap: "18px",
  padding: "18px",
};

const cardTitulo = {
  color: "#111827",
  fontSize: "19px",
  margin: 0,
};

const descricao = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: 1.5,
  marginTop: "8px",
};

const botao = {
  background: "#16a34a",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  fontWeight: "800",
  minHeight: "42px",
  padding: "10px 12px",
};

export default EscolherPlano;
