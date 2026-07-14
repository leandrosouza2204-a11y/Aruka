export const TEMPLATE_SCHEMA_VERSION = 1;

export const GENEROS_REFERENCIA_MODELO = ["Masculino", "Feminino", "Unissex"];
export const DIVISOES_MODELO_PESSOAL = [
  "ABC",
  "ABCD",
  "ABCDE",
  "Full Body",
  "Upper/Lower",
  "Outro",
];

const CAMPOS_PROIBIDOS = new Set([
  "id",
  "userId",
  "user_id",
  "owner_id",
  "alunoId",
  "aluno_id",
  "aluno",
  "nomeAluno",
  "alunoWhatsapp",
  "status",
  "dataInicio",
  "data_inicio",
  "dataRevisao",
  "data_revisao",
  "createdAt",
  "created_at",
  "updatedAt",
  "updated_at",
  "templateId",
  "carga",
]);

export function sanitizeWorkoutForTemplate(treino) {
  const dias = (treino?.dias || [])
    .map((dia, diaIndex) => ({
      name: textoSeguro(dia.nome),
      notes: textoSeguro(dia.descricao),
      order: diaIndex + 1,
      exercises: (dia.exercicios || [])
        .map((exercicio, exercicioIndex) => ({
          name: textoSeguro(exercicio.nome),
          sets: textoSeguro(exercicio.series),
          repetitions: textoSeguro(exercicio.repeticoes),
          rest: textoSeguro(exercicio.descanso),
          technique: textoSeguro(exercicio.tecnica || exercicio.technique),
          notes: textoSeguro(exercicio.observacoes),
          video: textoSeguro(exercicio.video),
          order: exercicioIndex + 1,
        }))
        .filter((exercicio) => exercicio.name),
    }))
    .filter((dia) => dia.name || dia.exercises.length > 0);

  return {
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    source: "workout-editor",
    days: dias,
  };
}

export function validateTemplateData(templateData) {
  if (!templateData || typeof templateData !== "object" || Array.isArray(templateData)) {
    return false;
  }

  if (!Array.isArray(templateData.days) || templateData.days.length === 0) {
    return false;
  }

  return templateData.days.every(
    (dia) =>
      typeof dia?.name === "string" &&
      Array.isArray(dia.exercises) &&
      dia.exercises.every((exercicio) => typeof exercicio?.name === "string")
  );
}

export function assertTemplateDataIsSanitized(templateData) {
  const encontrados = [];

  function percorrer(valor, caminho = "") {
    if (!valor || typeof valor !== "object") return;

    Object.entries(valor).forEach(([chave, conteudo]) => {
      const caminhoAtual = caminho ? `${caminho}.${chave}` : chave;

      if (CAMPOS_PROIBIDOS.has(chave)) {
        encontrados.push(caminhoAtual);
      }

      if (conteudo && typeof conteudo === "object") {
        percorrer(conteudo, caminhoAtual);
      }
    });
  }

  percorrer(templateData);

  return {
    ok: encontrados.length === 0,
    forbiddenPaths: encontrados,
  };
}

export function templateDataToWorkout(template, opcoes = {}) {
  const data = template.templateData || template.template_data || {};
  const dias = (data.days || []).map((dia) => ({
    id: crypto.randomUUID(),
    nome: dia.name || "",
    descricao: dia.notes || "",
    exercicios: (dia.exercises || []).map((exercicio) => ({
      id: crypto.randomUUID(),
      nome: exercicio.name || "",
      series: exercicio.sets || "",
      repeticoes: exercicio.repetitions || "",
      carga: "",
      descanso: exercicio.rest || "",
      observacoes: exercicio.notes || exercicio.technique || "",
      video: exercicio.video || "",
    })),
  }));

  return {
    alunoId: opcoes.alunoId || "",
    aluno: "",
    rotina: opcoes.rotina || template.nome || template.name || "Treino por modelo",
    objetivo: template.objetivo || template.objective || "",
    nivel: template.nivel || template.level || "",
    status: "Em revisão",
    dataInicio: opcoes.dataInicio || "",
    dataRevisao: "",
    diasPorSemana: dias.length,
    observacoes:
      "Modelo pessoal editavel. Ajuste o treino conforme objetivo, experiencia, disponibilidade e necessidades do aluno.",
    dias,
    templateId: template.id,
  };
}

export function templateDataToPreviewDays(templateData) {
  return (templateData?.days || []).map((dia) => ({
    id: `preview-${dia.order || dia.name}`,
    nome: dia.name || "",
    descricao: dia.notes || "",
    exercicios: (dia.exercises || []).map((exercicio) => ({
      id: `preview-${dia.order || dia.name}-${exercicio.order || exercicio.name}`,
      nome: exercicio.name || "",
      series: exercicio.sets || "",
      repeticoes: exercicio.repetitions || "",
      carga: "",
      descanso: exercicio.rest || "",
      observacoes: exercicio.notes || exercicio.technique || "",
      video: exercicio.video || "",
    })),
  }));
}

export function inferSplitFromWorkout(treino) {
  const totalDias = Number(treino?.dias?.length || 0);
  if (totalDias === 3) return "ABC";
  if (totalDias === 4) return "ABCD";
  if (totalDias === 5) return "ABCDE";
  if (totalDias === 2) return "Upper/Lower";
  if (totalDias === 1) return "Full Body";
  return "Outro";
}

export function countTemplateExercises(templateData) {
  return (templateData?.days || []).reduce(
    (total, dia) => total + Number(dia.exercises?.length || 0),
    0
  );
}

function textoSeguro(valor) {
  return String(valor || "").trim();
}
