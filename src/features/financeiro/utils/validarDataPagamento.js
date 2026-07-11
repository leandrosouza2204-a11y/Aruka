export const ERRO_PAGAMENTO_DATA_FUTURA = "PAGAMENTO_DATA_FUTURA";
export const ERRO_PAGAMENTO_DATA_INVALIDA = "PAGAMENTO_DATA_INVALIDA";

export function obterDataLocalISO(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export function dataPagamentoEhFutura(valor, hoje = obterDataLocalISO()) {
  const data = normalizarDataPagamento(valor);

  if (!data) return false;

  return data > hoje;
}

export function validarDataPagamento(valor, hoje = obterDataLocalISO()) {
  const data = normalizarDataPagamento(valor);

  if (!data) {
    return {
      valido: false,
      codigo: ERRO_PAGAMENTO_DATA_INVALIDA,
      mensagem: "Informe uma data válida para o pagamento.",
    };
  }

  if (data > hoje) {
    return {
      valido: false,
      codigo: ERRO_PAGAMENTO_DATA_FUTURA,
      mensagem: "A data do pagamento não pode ser futura.",
    };
  }

  return {
    valido: true,
    codigo: "",
    mensagem: "",
    data,
  };
}

function normalizarDataPagamento(valor) {
  const texto = String(valor || "").trim();
  const match = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) return "";

  const data = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00`);
  if (Number.isNaN(data.getTime())) return "";

  return `${match[1]}-${match[2]}-${match[3]}`;
}
