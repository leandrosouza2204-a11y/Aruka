export function formatarData(data) {
  if (!data) return "-";

  const texto = String(data);
  const valor = texto.includes("T") ? texto : `${texto}T00:00:00`;

  return new Date(valor).toLocaleDateString("pt-BR");
}

export function formatarDataCurta(data) {
  if (!data) return "-";

  const texto = String(data);
  const valor = texto.includes("T") ? texto : `${texto}T00:00:00`;

  return new Date(valor).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function dataOuNull(data) {
  return data || null;
}
