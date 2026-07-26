import { WORKOUT_STATUS } from "../features/treinos/utils/workoutDataContract.js";

export const GENEROS_MODELO_TREINO = ["Masculino", "Feminino"];
export const DIVISOES_MODELO_TREINO = ["ABC", "ABCD", "ABCDE", "Full Body", "Upper/Lower"];
export const modelosTreinoDisponiveis = DIVISOES_MODELO_TREINO;

const avisoModeloEditavel =
  "Modelo inicial editavel. Ajuste o treino conforme objetivo, experiencia, disponibilidade e necessidades do aluno.";

const prescricao = {
  composto: { series: "3", repeticoes: "8-12", descanso: "90s" },
  pesado: { series: "4", repeticoes: "6-10", descanso: "120s" },
  acessorio: { series: "3", repeticoes: "10-15", descanso: "60s" },
  core: { series: "3", repeticoes: "12-15", descanso: "60s" },
};

const exercicio = (nome, tipo = "acessorio", observacoes = "") => ({
  id: crypto.randomUUID(),
  nome,
  series: prescricao[tipo].series,
  repeticoes: prescricao[tipo].repeticoes,
  carga: "",
  descanso: prescricao[tipo].descanso,
  observacoes,
  video: "",
});

const dia = (nome, descricao, exercicios) => ({
  id: crypto.randomUUID(),
  nome,
  descricao,
  exercicios,
});

export const modelosTreinoOficiais = [
  modelo("masculino-abc", "Masculino", "ABC", "Masculino - ABC", "Intermediario", [
    dia("Treino A", "Peitoral, deltoides e triceps", [
      exercicio("Supino reto", "pesado"),
      exercicio("Supino inclinado com halteres", "composto"),
      exercicio("Desenvolvimento militar", "composto"),
      exercicio("Elevacao lateral", "acessorio"),
      exercicio("Triceps na polia", "acessorio"),
    ]),
    dia("Treino B", "Costas e biceps", [
      exercicio("Puxada na frente", "composto"),
      exercicio("Remada curvada", "pesado"),
      exercicio("Remada baixa", "composto"),
      exercicio("Rosca direta", "acessorio"),
      exercicio("Rosca martelo", "acessorio"),
    ]),
    dia("Treino C", "Quadriceps, posteriores, gluteos e panturrilhas", [
      exercicio("Agachamento livre", "pesado"),
      exercicio("Leg press", "composto"),
      exercicio("Cadeira extensora", "acessorio"),
      exercicio("Mesa flexora", "acessorio"),
      exercicio("Panturrilha em pe", "acessorio"),
    ]),
  ]),
  modelo("masculino-abcd", "Masculino", "ABCD", "Masculino - ABCD", "Intermediario", [
    dia("Treino A", "Peitoral e triceps", [
      exercicio("Supino reto", "pesado"),
      exercicio("Supino inclinado", "composto"),
      exercicio("Crucifixo inclinado", "acessorio"),
      exercicio("Triceps testa", "acessorio"),
      exercicio("Triceps corda", "acessorio"),
    ]),
    dia("Treino B", "Costas e biceps", [
      exercicio("Barra fixa assistida", "composto"),
      exercicio("Remada unilateral", "composto"),
      exercicio("Pulldown", "acessorio"),
      exercicio("Rosca direta", "acessorio"),
      exercicio("Rosca alternada", "acessorio"),
    ]),
    dia("Treino C", "Membros inferiores", [
      exercicio("Agachamento livre", "pesado"),
      exercicio("Levantamento terra romeno", "composto"),
      exercicio("Leg press", "composto"),
      exercicio("Cadeira extensora", "acessorio"),
      exercicio("Mesa flexora", "acessorio"),
    ]),
    dia("Treino D", "Deltoides, bracos e core", [
      exercicio("Desenvolvimento com halteres", "composto"),
      exercicio("Elevacao lateral", "acessorio"),
      exercicio("Face pull", "acessorio"),
      exercicio("Rosca martelo", "acessorio"),
      exercicio("Prancha", "core"),
    ]),
  ]),
  modelo("masculino-abcde", "Masculino", "ABCDE", "Masculino - ABCDE", "Intermediario", [
    dia("Treino A", "Peitoral", [
      exercicio("Supino reto", "pesado"),
      exercicio("Supino inclinado com halteres", "composto"),
      exercicio("Crucifixo na maquina", "acessorio"),
      exercicio("Crossover", "acessorio"),
    ]),
    dia("Treino B", "Costas", [
      exercicio("Puxada aberta", "composto"),
      exercicio("Remada curvada", "pesado"),
      exercicio("Remada baixa", "composto"),
      exercicio("Pullover na polia", "acessorio"),
    ]),
    dia("Treino C", "Pernas", [
      exercicio("Agachamento livre", "pesado"),
      exercicio("Leg press", "composto"),
      exercicio("Stiff", "composto"),
      exercicio("Panturrilha sentado", "acessorio"),
    ]),
    dia("Treino D", "Deltoides", [
      exercicio("Desenvolvimento militar", "composto"),
      exercicio("Elevacao lateral", "acessorio"),
      exercicio("Elevacao posterior", "acessorio"),
      exercicio("Encolhimento", "acessorio"),
    ]),
    dia("Treino E", "Bracos e core", [
      exercicio("Rosca direta", "acessorio"),
      exercicio("Rosca martelo", "acessorio"),
      exercicio("Triceps testa", "acessorio"),
      exercicio("Triceps corda", "acessorio"),
      exercicio("Abdominal na polia", "core"),
    ]),
  ]),
  modelo("masculino-full-body", "Masculino", "Full Body", "Masculino - Full Body", "Iniciante", fullBody("Masculino")),
  modelo("masculino-upper-lower", "Masculino", "Upper/Lower", "Masculino - Upper/Lower", "Intermediario", upperLower("Masculino")),
  modelo("feminino-abc", "Feminino", "ABC", "Feminino - ABC", "Intermediario", [
    dia("Treino A", "Quadriceps e panturrilhas", [
      exercicio("Agachamento livre", "composto"),
      exercicio("Leg press", "composto"),
      exercicio("Cadeira extensora", "acessorio"),
      exercicio("Passada", "acessorio"),
      exercicio("Panturrilha em pe", "acessorio"),
    ]),
    dia("Treino B", "Membros superiores", [
      exercicio("Puxada na frente", "composto"),
      exercicio("Remada baixa", "composto"),
      exercicio("Supino com halteres", "composto"),
      exercicio("Elevacao lateral", "acessorio"),
      exercicio("Triceps corda", "acessorio"),
    ]),
    dia("Treino C", "Posteriores e gluteos", [
      exercicio("Levantamento terra romeno", "composto"),
      exercicio("Mesa flexora", "acessorio"),
      exercicio("Hip thrust", "pesado"),
      exercicio("Abducao de quadril", "acessorio"),
      exercicio("Gluteo na polia", "acessorio"),
    ]),
  ]),
  modelo("feminino-abcd", "Feminino", "ABCD", "Feminino - ABCD", "Intermediario", [
    dia("Treino A", "Quadriceps", [
      exercicio("Agachamento livre", "composto"),
      exercicio("Leg press", "composto"),
      exercicio("Cadeira extensora", "acessorio"),
      exercicio("Afundo", "acessorio"),
    ]),
    dia("Treino B", "Costas, bracos e deltoides", [
      exercicio("Puxada na frente", "composto"),
      exercicio("Remada baixa", "composto"),
      exercicio("Elevacao lateral", "acessorio"),
      exercicio("Rosca direta", "acessorio"),
      exercicio("Triceps corda", "acessorio"),
    ]),
    dia("Treino C", "Posteriores e gluteos", [
      exercicio("Stiff", "composto"),
      exercicio("Mesa flexora", "acessorio"),
      exercicio("Hip thrust", "pesado"),
      exercicio("Abducao de quadril", "acessorio"),
    ]),
    dia("Treino D", "Gluteos, quadriceps complementares e core", [
      exercicio("Agachamento sumo", "composto"),
      exercicio("Cadeira abdutora", "acessorio"),
      exercicio("Gluteo na polia", "acessorio"),
      exercicio("Cadeira extensora", "acessorio"),
      exercicio("Prancha", "core"),
    ]),
  ]),
  modelo("feminino-abcde", "Feminino", "ABCDE", "Feminino - ABCDE", "Intermediario", [
    dia("Treino A", "Quadriceps", [
      exercicio("Agachamento livre", "composto"),
      exercicio("Leg press", "composto"),
      exercicio("Cadeira extensora", "acessorio"),
      exercicio("Passada", "acessorio"),
    ]),
    dia("Treino B", "Costas e biceps", [
      exercicio("Puxada aberta", "composto"),
      exercicio("Remada baixa", "composto"),
      exercicio("Pulldown", "acessorio"),
      exercicio("Rosca alternada", "acessorio"),
    ]),
    dia("Treino C", "Posteriores", [
      exercicio("Levantamento terra romeno", "composto"),
      exercicio("Mesa flexora", "acessorio"),
      exercicio("Cadeira flexora", "acessorio"),
      exercicio("Good morning", "acessorio"),
    ]),
    dia("Treino D", "Deltoides, peitoral e triceps", [
      exercicio("Desenvolvimento com halteres", "composto"),
      exercicio("Elevacao lateral", "acessorio"),
      exercicio("Supino com halteres", "composto"),
      exercicio("Triceps corda", "acessorio"),
    ]),
    dia("Treino E", "Gluteos e core", [
      exercicio("Hip thrust", "pesado"),
      exercicio("Abducao de quadril", "acessorio"),
      exercicio("Gluteo na polia", "acessorio"),
      exercicio("Prancha lateral", "core"),
    ]),
  ]),
  modelo("feminino-full-body", "Feminino", "Full Body", "Feminino - Full Body", "Iniciante", fullBody("Feminino")),
  modelo("feminino-upper-lower", "Feminino", "Upper/Lower", "Feminino - Upper/Lower", "Intermediario", upperLower("Feminino")),
];

export const modelosTreino = DIVISOES_MODELO_TREINO.reduce((acc, divisao) => {
  const primeiro = modelosTreinoOficiais.find((item) => item.divisao === divisao);
  acc[divisao] = primeiro?.dias.map((item) => [item.nome, item.descricao]) || [];
  return acc;
}, {});

export function criarModeloTreino(modeloOuId, opcoes = {}) {
  const template =
    modelosTreinoOficiais.find((item) => item.id === modeloOuId) ||
    modelosTreinoOficiais.find((item) => item.divisao === modeloOuId);

  if (!template) return criarTreinoVazio(modeloOuId);

  const dias = template.dias.map((item) =>
    dia(
      item.nome,
      item.descricao,
      item.exercicios.map((exercicioTemplate) => ({
        ...exercicioTemplate,
        id: crypto.randomUUID(),
      }))
    )
  );

  return {
    alunoId: opcoes.alunoId || "",
    aluno: "",
    rotina: opcoes.rotina || template.nome,
    objetivo: template.objetivo,
    nivel: template.nivel,
    status: WORKOUT_STATUS.IN_REVIEW,
    dataInicio: opcoes.dataInicio || "",
    dataRevisao: opcoes.dataRevisao || "",
    diasPorSemana: dias.length,
    observacoes: avisoModeloEditavel,
    dias,
    templateId: template.id,
  };
}

export function obterModelosTreino({ genero = "Todos", divisao = "" } = {}) {
  return modelosTreinoOficiais.filter((modelo) => {
    const combinaGenero = genero === "Todos" || modelo.genero === genero;
    const combinaDivisao = !divisao || modelo.divisao === divisao;
    return combinaGenero && combinaDivisao;
  });
}

export function obterModeloTreinoPorId(id) {
  return modelosTreinoOficiais.find((modelo) => modelo.id === id) || null;
}

export { avisoModeloEditavel };

function modelo(id, genero, divisao, nome, nivel, dias) {
  return {
    id,
    nome,
    genero,
    divisao,
    objetivo: divisao === "Full Body" ? "Condicionamento geral" : "Forca e hipertrofia",
    nivel,
    descricao: `${divisao} de referencia ${genero.toLowerCase()} com estrutura inicial editavel.`,
    isSystem: true,
    dias,
  };
}

function fullBody(genero) {
  const enfaseFinal = genero === "Feminino" ? "Gluteos e core" : "Posterior e core";
  return [
    dia("Full Body A", "Empurrar, puxar, agachar e core", [
      exercicio("Agachamento livre", "composto"),
      exercicio("Supino com halteres", "composto"),
      exercicio("Puxada na frente", "composto"),
      exercicio("Prancha", "core"),
    ]),
    dia("Full Body B", "Extensao de quadril, remada e estabilidade", [
      exercicio("Levantamento terra romeno", "composto"),
      exercicio("Remada baixa", "composto"),
      exercicio("Desenvolvimento com halteres", "composto"),
      exercicio("Abdominal dead bug", "core"),
    ]),
    dia("Full Body C", enfaseFinal, [
      exercicio(genero === "Feminino" ? "Hip thrust" : "Leg press", "composto"),
      exercicio("Supino inclinado com halteres", "composto"),
      exercicio("Remada unilateral", "composto"),
      exercicio("Prancha lateral", "core"),
    ]),
  ];
}

function upperLower(genero) {
  const lowerA = genero === "Feminino" ? "Quadriceps e gluteos" : "Quadriceps e posteriores";
  const lowerB = genero === "Feminino" ? "Posteriores, gluteos e panturrilhas" : "Posteriores e panturrilhas";
  return [
    dia("Upper A", "Empurrar e puxar horizontal", [
      exercicio("Supino reto", "composto"),
      exercicio("Remada baixa", "composto"),
      exercicio("Desenvolvimento com halteres", "composto"),
      exercicio("Rosca direta", "acessorio"),
      exercicio("Triceps corda", "acessorio"),
    ]),
    dia("Lower A", lowerA, [
      exercicio("Agachamento livre", "composto"),
      exercicio("Leg press", "composto"),
      exercicio("Cadeira extensora", "acessorio"),
      exercicio(genero === "Feminino" ? "Abducao de quadril" : "Mesa flexora", "acessorio"),
    ]),
    dia("Upper B", "Empurrar e puxar vertical", [
      exercicio("Puxada na frente", "composto"),
      exercicio("Supino inclinado com halteres", "composto"),
      exercicio("Elevacao lateral", "acessorio"),
      exercicio("Face pull", "acessorio"),
    ]),
    dia("Lower B", lowerB, [
      exercicio("Levantamento terra romeno", "composto"),
      exercicio(genero === "Feminino" ? "Hip thrust" : "Stiff", "composto"),
      exercicio("Mesa flexora", "acessorio"),
      exercicio("Panturrilha sentado", "acessorio"),
    ]),
  ];
}

function criarTreinoVazio(modelo) {
  const dias = (modelosTreino[modelo] || []).map(([nome, descricao]) =>
    dia(nome, descricao, [])
  );

  return {
    alunoId: "",
    aluno: "",
    rotina: `Modelo ${modelo}`,
    objetivo: "",
    nivel: "",
    status: WORKOUT_STATUS.IN_REVIEW,
    dataInicio: "",
    dataRevisao: "",
    diasPorSemana: dias.length,
    observacoes: avisoModeloEditavel,
    dias,
  };
}
