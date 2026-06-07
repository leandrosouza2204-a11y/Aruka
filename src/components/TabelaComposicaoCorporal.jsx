import { calcularComposicaoCorporal } from "../data/calculosCorporais";

function TabelaComposicaoCorporal({ avaliacao }) {
  const composicao = calcularComposicaoCorporal(avaliacao);

  const linhas = [
    ["Peso", formatarKg(composicao.peso)],
    ["% gordura estimado", formatarPercentual(composicao.percentualGordura)],
    ["Massa gorda", formatarKg(composicao.massaGorda)],
    ["% massa magra", formatarPercentual(composicao.percentualMassaMagra)],
    ["Massa magra", formatarKg(composicao.massaMagra)],
    ["Relacao cintura/quadril", composicao.relacaoCinturaQuadril || "-"],
    [
      "Classificacao cintura/quadril",
      composicao.classificacaoRelacaoCinturaQuadril,
    ],
    ["IMC", composicao.imc || "-"],
    ["Classificacao IMC", composicao.classificacaoIMC],
  ];

  return (
    <div style={container}>
      <h3 style={titulo}>Composicao corporal</h3>
      <table style={tabela}>
        <tbody>
          {linhas.map(([label, valor]) => (
            <tr key={label}>
              <td style={celulaLabel}>{label}</td>
              <td style={celulaValor}>{valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={nota}>
        Calculos estimados por medidas antropometricas, apenas para acompanhamento.
      </p>
    </div>
  );
}

function formatarKg(valor) {
  return valor !== "" ? `${Number(valor).toFixed(1)} kg` : "-";
}

function formatarPercentual(valor) {
  return valor !== "" ? `${Number(valor).toFixed(1)}%` : "-";
}

const container = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "18px",
};

const titulo = {
  margin: "0 0 14px",
  fontSize: "18px",
};

const tabela = {
  width: "100%",
  borderCollapse: "collapse",
};

const celulaLabel = {
  color: "#6b7280",
  borderBottom: "1px solid #eef2f7",
  fontSize: "14px",
  padding: "10px",
};

const celulaValor = {
  borderBottom: "1px solid #eef2f7",
  color: "#111827",
  fontSize: "14px",
  fontWeight: "700",
  padding: "10px",
  textAlign: "right",
};

const nota = {
  color: "#6b7280",
  fontSize: "12px",
  marginTop: "12px",
};

export default TabelaComposicaoCorporal;
