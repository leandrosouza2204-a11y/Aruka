import {
  getYouTubeMediaErrorMessage,
  parseYouTubeMediaInput,
} from "../features/exerciseLibrary/utils/youtubeMedia.js";
import { criarPayloadSemMidia } from "../features/exerciseLibrary/utils/uploadedVideoMedia.js";

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
  mediaMode: "none",
  youtubeInput: "",
  uploadedVideoPath: "",
  uploadedVideoMimeType: "",
};

export function criarFormularioExercicioBiblioteca(exercicio = null) {
  if (!exercicio) return { ...EXERCISE_LIBRARY_FORM_INITIAL };

  return {
    nome: exercicio.nome || "",
    descricao: exercicio.descricao || "",
    grupoMuscular: exercicio.grupoMuscular || "",
    categoria: exercicio.categoria || "",
    instrucoes: exercicio.instrucoes || "",
    mediaMode: exercicio.midia?.type === "uploaded_video" ? "upload" : exercicio.midia?.type === "youtube" ? "youtube" : "none",
    youtubeInput: exercicio.midia?.youtubeUrl || "",
    uploadedVideoPath: exercicio.midia?.mediaPath || "",
    uploadedVideoMimeType: exercicio.midia?.mimeType || "",
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
  if (valores.mediaMode === "youtube" && !youtube.ok) {
    erros.youtubeInput = getYouTubeMediaErrorMessage(youtube.error);
  }
  if (valores.mediaMode === "upload" && !formulario?.uploadFile && (!valores.uploadedVideoPath || !valores.uploadedVideoMimeType)) {
    erros.uploadFile = "Selecione um vídeo válido.";
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

  const mediaPayload = criarPayloadMidiaFormulario(resultado.valores);

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
      ...mediaPayload,
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
    mediaMode: normalizeMediaMode(formulario),
    youtubeInput: String(formulario?.youtubeInput || "").trim(),
    uploadedVideoPath: String(formulario?.uploadedVideoPath || "").trim(),
    uploadedVideoMimeType: String(formulario?.uploadedVideoMimeType || "").trim(),
  };
}

function criarPayloadMidiaFormulario(valores) {
  if (valores.mediaMode === "youtube") {
    const youtube = parseYouTubeMediaInput(valores.youtubeInput);
    return {
      youtube_url: youtube.media.canonicalUrl,
      media_type: "youtube",
      media_path: null,
      thumbnail_path: null,
      media_mime_type: null,
    };
  }

  if (valores.mediaMode === "upload" && valores.uploadedVideoPath && valores.uploadedVideoMimeType) {
    return {
      youtube_url: "",
      media_type: "uploaded_video",
      media_path: valores.uploadedVideoPath,
      thumbnail_path: null,
      media_mime_type: valores.uploadedVideoMimeType,
    };
  }

  return criarPayloadSemMidia();
}

function normalizeMediaMode(formulario) {
  if (formulario?.mediaMode === "none") return "none";
  if (formulario?.mediaMode === "youtube" || formulario?.mediaMode === "upload") return formulario.mediaMode;
  if (String(formulario?.youtubeInput || "").trim()) return "youtube";
  if (String(formulario?.uploadedVideoPath || "").trim()) return "upload";
  return "none";
}

function compact(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}
