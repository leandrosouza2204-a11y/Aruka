import {
  getYouTubeMediaErrorMessage,
  parseYouTubeMediaInput,
} from "../features/exerciseLibrary/utils/youtubeMedia.js";

const LIMITS = {
  nome: 120,
  descricao: 240,
  grupoMuscular: 80,
  categoria: 80,
  instrucoes: 1200,
};

export const EXERCISE_LIBRARY_FORM_INITIAL = {
  nome: "",
  descricao: "",
  grupoMuscular: "",
  categoria: "",
  instrucoes: "",
  youtubeInput: "",
};

export function criarFormularioExercicioBiblioteca(exercicio = null) {
  if (!exercicio) return { ...EXERCISE_LIBRARY_FORM_INITIAL };

  return {
    nome: exercicio.nome || "",
    descricao: exercicio.descricao || "",
    grupoMuscular: exercicio.grupoMuscular || "",
    categoria: exercicio.categoria || "",
    instrucoes: exercicio.instrucoes || "",
    youtubeInput: exercicio.midia?.youtubeUrl || "",
  };
}

export function validarFormularioExercicioBiblioteca(formulario) {
  const valores = sanitizarFormularioExercicioBiblioteca(formulario);
  const erros = {};

  if (!valores.nome) erros.nome = "Informe o nome do exercício.";
  if (!valores.grupoMuscular) erros.grupoMuscular = "Informe o grupo muscular.";
  if (!valores.categoria) erros.categoria = "Informe a categoria.";
  if (valores.nome.length > LIMITS.nome) erros.nome = `Use até ${LIMITS.nome} caracteres.`;
  if (valores.descricao.length > LIMITS.descricao) erros.descricao = `Use até ${LIMITS.descricao} caracteres.`;
  if (valores.grupoMuscular.length > LIMITS.grupoMuscular) {
    erros.grupoMuscular = `Use até ${LIMITS.grupoMuscular} caracteres.`;
  }
  if (valores.categoria.length > LIMITS.categoria) erros.categoria = `Use até ${LIMITS.categoria} caracteres.`;
  if (valores.instrucoes.length > LIMITS.instrucoes) erros.instrucoes = `Use até ${LIMITS.instrucoes} caracteres.`;

  const youtube = parseYouTubeMediaInput(valores.youtubeInput);
  if (valores.youtubeInput && !youtube.ok) {
    erros.youtubeInput = getYouTubeMediaErrorMessage(youtube.error);
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros,
    valores,
  };
}

export function criarPayloadExercicioPessoal(formulario, ownerId) {
  const resultado = validarFormularioExercicioBiblioteca(formulario);

  if (!resultado.valido) {
    return {
      valido: false,
      erros: resultado.erros,
      payload: null,
    };
  }

  const youtube = parseYouTubeMediaInput(resultado.valores.youtubeInput);
  const youtubeMedia = youtube.ok ? youtube.media : null;

  return {
    valido: true,
    erros: {},
    payload: {
      owner_id: ownerId,
      origin: "personal",
      status: "active",
      name: resultado.valores.nome,
      description: resultado.valores.descricao,
      muscle_group: resultado.valores.grupoMuscular,
      category: resultado.valores.categoria,
      instructions: resultado.valores.instrucoes,
      youtube_url: youtubeMedia?.canonicalUrl || "",
      media_type: youtubeMedia ? "youtube" : null,
      media_path: null,
      thumbnail_path: null,
      media_mime_type: null,
      archived_at: null,
    },
  };
}

export function podeGerenciarExercicioBiblioteca(exercicio) {
  return exercicio?.origem === "personal";
}

export function sanitizarFormularioExercicioBiblioteca(formulario) {
  return {
    nome: compact(formulario?.nome),
    descricao: compact(formulario?.descricao),
    grupoMuscular: compact(formulario?.grupoMuscular),
    categoria: compact(formulario?.categoria),
    instrucoes: compact(formulario?.instrucoes),
    youtubeInput: String(formulario?.youtubeInput || "").trim(),
  };
}

function compact(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}
