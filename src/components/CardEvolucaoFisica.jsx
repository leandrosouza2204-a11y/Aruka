import { calcularComposicaoCorporal } from "../data/calculosCorporais";

function CardEvolucaoFisica({ primeira, ultima }) {
  if (!primeira || !ultima) {
    return (
      <div style={grid}>
        <Card titulo="Evolução" valor="-" detalhe="Cadastre ao menos duas avaliações." />
      </div>
    );
  }

  const composicaoPrimeira = calcularComposicaoCorporal(primeira);
  const composicaoUltima = calcularComposicaoCorporal(ultima);

  const cards = [
    ["Peso", diferenca(ultima.peso, primeira.peso, "kg")],
    [
      "Cintura",
      diferenca(ultima.medidas?.cintura, primeira.medidas?.cintura, "cm"),
    ],
    [
      "Quadril",
      diferenca(ultima.medidas?.quadril, primeira.medidas?.quadril, "cm"),
    ],
    [
      "% gordura",
      diferenca(
        composicaoUltima.percentualGordura,
        composicaoPrimeira.percentualGordura,
        "%"
      ),
    ],
    [
      "Massa magra",
      diferenca(composicaoUltima.massaMagra, composicaoPrimeira.massaMagra, "kg"),
    ],
  ];

  return (
    <div style={grid}>
      {cards.map(([titulo, valor]) => (
        <Card key={titulo} titulo={titulo} valor={valor} detalhe="Primeira x ultima" />
      ))}
    </div>
  );
}

function Card({ titulo, valor, detalhe }) {
  return (
    <div style={card}>
      <span style={label}>{titulo}</span>
      <strong style={valorStyle}>{valor}</strong>
      <small style={detalheStyle}>{detalhe}</small>
    </div>
  );
}

function diferenca(atual, anterior, unidade) {
  if (!temValor(atual) || !temValor(anterior)) return "Sem registro anterior";

  const valorAtual = Number(String(atual).replace(",", "."));
  const valorAnterior = Number(String(anterior).replace(",", "."));

  if (!Number.isFinite(valorAtual) || !Number.isFinite(valorAnterior)) {
    return "Sem registro anterior";
  }

  const diferencaValor = valorAtual - valorAnterior;
  const sinal = diferencaValor > 0 ? "+" : "";
  return `${sinal}${diferencaValor.toFixed(1)} ${unidade}`;
}

function temValor(valor) {
  return valor !== "" && valor !== null && valor !== undefined;
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "12px",
};

const card = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
};

const label = {
  color: "#6b7280",
  display: "block",
  fontSize: "13px",
  fontWeight: "700",
};

const valorStyle = {
  color: "#111827",
  display: "block",
  fontSize: "24px",
  marginTop: "8px",
};

const detalheStyle = {
  color: "#6b7280",
  display: "block",
  marginTop: "6px",
};

export default CardEvolucaoFisica;
