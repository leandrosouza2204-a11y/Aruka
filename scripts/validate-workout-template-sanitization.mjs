import {
  assertTemplateDataIsSanitized,
  countTemplateExercises,
  sanitizeWorkoutForTemplate,
  validateTemplateData,
} from "../src/features/treinos/utils/workoutTemplateSanitization.js";

const treino = {
  id: "treino-proibido",
  userId: "user-proibido",
  alunoId: "aluno-proibido",
  aluno: "Aluno QA",
  nomeAluno: "Aluno QA",
  alunoWhatsapp: "11999999999",
  rotina: "QA_TEMPLATE_ROTINA",
  status: "Ativo",
  dataInicio: "2026-07-14",
  dataRevisao: "2026-08-14",
  dias: [
    {
      id: "dia-proibido",
      nome: "Treino A",
      descricao: "Peitoral",
      exercicios: [
        {
          id: "exercicio-proibido",
          nome: "Supino reto",
          series: "4",
          repeticoes: "8",
          carga: "80kg",
          descanso: "90s",
          observacoes: "Ajustar amplitude",
          video: "https://example.com/video",
        },
      ],
    },
  ],
};

const templateData = sanitizeWorkoutForTemplate(treino);
const sanitizacao = assertTemplateDataIsSanitized(templateData);

if (!validateTemplateData(templateData)) {
  throw new Error("Template sanitizado ficou estruturalmente invalido.");
}

if (!sanitizacao.ok) {
  throw new Error(`Template contem campos proibidos: ${sanitizacao.forbiddenPaths.join(", ")}`);
}

if (JSON.stringify(templateData).includes("80kg") || JSON.stringify(templateData).includes("Aluno QA")) {
  throw new Error("Template vazou carga individual ou dados do aluno.");
}

if (countTemplateExercises(templateData) !== 1) {
  throw new Error("Contagem de exercicios sanitizados inesperada.");
}

console.log("Sanitizacao de modelos de treino aprovada.");
