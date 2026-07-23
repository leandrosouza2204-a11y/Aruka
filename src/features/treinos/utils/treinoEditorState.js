const emptyWorkout = {
  alunoId: "",
  rotina: "",
  objetivo: "",
  nivel: "",
  status: "Ativo",
  dataInicio: "",
  dataRevisao: "",
  diasPorSemana: "",
  observacoes: "",
  dias: [],
};

export function normalizeTreinoEditorState(state = {}) {
  const form = { ...emptyWorkout, ...(state.form || state) };
  const exerciseDrafts = state.exerciseDrafts || state.exercicioPorDia || {};

  return {
    alunoId: texto(form.alunoId),
    rotina: texto(form.rotina),
    objetivo: texto(form.objetivo),
    nivel: texto(form.nivel),
    status: texto(form.status || "Ativo"),
    dataInicio: texto(form.dataInicio),
    dataRevisao: texto(form.dataRevisao),
    diasPorSemana: texto(form.diasPorSemana),
    observacoes: texto(form.observacoes),
    dias: (form.dias || []).map((dia) => ({
      nome: texto(dia.nome),
      descricao: texto(dia.descricao),
      exercicios: (dia.exercicios || [])
        .filter((exercicio) => !exercicio.removido && !exercicio._deleted)
        .map((exercicio) => ({
          nome: texto(exercicio.nome),
          series: texto(exercicio.series),
          repeticoes: texto(exercicio.repeticoes),
          carga: texto(exercicio.carga),
          descanso: texto(exercicio.descanso),
          observacoes: texto(exercicio.observacoes),
          video: texto(exercicio.video),
        })),
    })),
    exerciseDrafts: Object.fromEntries(
      Object.entries(exerciseDrafts)
        .map(([diaId, draft]) => [diaId, normalizeExerciseDraft(draft)])
        .filter(([, draft]) => hasExerciseContent(draft))
        .sort(([left], [right]) => left.localeCompare(right))
    ),
  };
}

export function areTreinoEditorStatesEqual(left, right) {
  return stableStringify(normalizeTreinoEditorState(left)) === stableStringify(normalizeTreinoEditorState(right));
}

export function validateTreinoEditorState(state = {}, alunos = []) {
  const normalized = normalizeTreinoEditorState(state);
  const alunosIds = new Set((alunos || []).map((aluno) => aluno.id));
  const errors = {};

  if (!normalized.rotina) errors.name = "Preencha o nome do treino.";
  if (!normalized.alunoId || !alunosIds.has(normalized.alunoId)) {
    errors.student = "Selecione um aluno.";
  }
  if (normalized.dias.length === 0) {
    errors.days = "Adicione pelo menos um dia ao treino.";
  }
  if (!normalized.dias.some((dia) => dia.exercicios.some(isValidExercise))) {
    errors.exercises = "Adicione pelo menos um exercicio antes de salvar.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    normalized,
  };
}

export function isValidExercise(exercise) {
  return Boolean(texto(exercise?.nome));
}

function normalizeExerciseDraft(draft = {}) {
  return {
    nome: texto(draft.nome),
    series: texto(draft.series),
    repeticoes: texto(draft.repeticoes),
    carga: texto(draft.carga),
    descanso: texto(draft.descanso),
    observacoes: texto(draft.observacoes),
    video: texto(draft.video),
  };
}

function hasExerciseContent(draft) {
  return Object.values(draft).some(Boolean);
}

function texto(value) {
  return String(value || "").trim();
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
}
