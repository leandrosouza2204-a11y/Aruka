const planosAssinatura = [
  {
    nome: "Mensal",
    descricao: "Acesso ao sistema por 30 dias.",
  },
  {
    nome: "Trimestral",
    descricao: "Acesso por 3 meses para operar a consultoria.",
  },
  {
    nome: "Semestral",
    descricao: "Acesso por 6 meses com melhor previsibilidade.",
  },
  {
    nome: "Anual",
    descricao: "Acesso por 12 meses para uso continuo do SaaS.",
  },
];

function EscolherPlano() {
  function solicitarLiberacao(plano) {
    const mensagem = [
      "Olá, tudo bem?",
      "",
      `Quero solicitar a liberação de acesso ao sistema CoachFlow no plano *${plano.nome}*.`,
      "",
      "Pode me enviar as informações para ativação da minha assinatura?",
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
        <h2 style={titulo}>Escolha um plano para solicitar liberação</h2>
      </div>

      <div style={grid}>
        {planosAssinatura.map((plano) => (
          <div key={plano.nome} style={card}>
            <div>
              <h3 style={cardTitulo}>{plano.nome}</h3>
              <p style={descricao}>{plano.descricao}</p>
            </div>

            <button
              onClick={() => solicitarLiberacao(plano)}
              style={botao}
            >
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
