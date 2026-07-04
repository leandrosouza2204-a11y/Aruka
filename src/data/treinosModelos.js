export const modelosTreinoDisponiveis = ["ABC", "ABCD", "ABCDE", "Full Body", "Upper/Lower"];

export const modelosTreino = {
  ABC: [
    ["Treino A", "Peito, Ombro e Tríceps"],
    ["Treino B", "Costas e Bíceps"],
    ["Treino C", "Pernas"],
  ],
  ABCD: [
    ["Treino A", "Peito e Tríceps"],
    ["Treino B", "Costas e Bíceps"],
    ["Treino C", "Pernas"],
    ["Treino D", "Ombros e Abdômen"],
  ],
  ABCDE: [
    ["Treino A", "Peito"],
    ["Treino B", "Costas"],
    ["Treino C", "Pernas"],
    ["Treino D", "Ombros"],
    ["Treino E", "Braços e Abdômen"],
  ],
  "Full Body": [
    ["Treino Full Body 1", "Corpo inteiro"],
    ["Treino Full Body 2", "Corpo inteiro"],
    ["Treino Full Body 3", "Corpo inteiro"],
  ],
  "Upper/Lower": [
    ["Upper 1", "Membros superiores"],
    ["Lower 1", "Membros inferiores"],
    ["Upper 2", "Membros superiores"],
    ["Lower 2", "Membros inferiores"],
  ],
};

export function criarModeloTreino(modelo) {
  const dias = (modelosTreino[modelo] || []).map(([nome, descricao]) => ({
    id: crypto.randomUUID(),
    nome,
    descricao,
    exercicios: [],
  }));

  return {
    aluno: "",
    rotina: `Modelo ${modelo}`,
    objetivo: "",
    nivel: "",
    status: "Em revisão",
    dataInicio: "",
    dataRevisao: "",
    diasPorSemana: dias.length,
    observacoes: "",
    dias,
  };
}
