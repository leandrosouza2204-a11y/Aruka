import { parseYouTubeMediaInput } from "../features/exerciseLibrary/utils/youtubeMedia.js";

export function mapExerciseLibraryRows(rows) {
  return rows.map(rowParaExercicioBiblioteca);
}

export function rowParaExercicioBiblioteca(row = {}) {
  const origin = normalizeExerciseOrigin(row.origin);
  const media = buildExerciseMedia(row);

  return {
    id: row.id || "",
    nome: sanitizeText(row.name),
    descricao: sanitizeText(row.description),
    origem: origin,
    origemLabel: origin === "personal" ? "Pessoal" : "Oficial",
    grupoMuscular: sanitizeText(row.muscle_group),
    categoria: sanitizeText(row.category),
    instrucoes: sanitizeText(row.instructions),
    possuiMidia: Boolean(media.type),
    midia: media,
    criadoEm: row.created_at || "",
    atualizadoEm: row.updated_at || "",
  };
}

export function filtrarExerciciosBiblioteca(exercicios, filtros = {}) {
  const termo = normalizeSearch(filtros.busca);
  const origem = filtros.origem || "todos";
  const grupoMuscular = filtros.grupoMuscular || "todos";
  const categoria = filtros.categoria || "todos";
  const midia = filtros.midia || "todos";

  return exercicios.filter((exercicio) => {
    const textoBusca = normalizeSearch([
      exercicio.nome,
      exercicio.descricao,
      exercicio.grupoMuscular,
      exercicio.categoria,
      exercicio.instrucoes,
    ].join(" "));
    const combinaBusca = !termo || textoBusca.includes(termo);
    const combinaOrigem = origem === "todos" || exercicio.origem === origem;
    const combinaGrupo = grupoMuscular === "todos" || exercicio.grupoMuscular === grupoMuscular;
    const combinaCategoria = categoria === "todos" || exercicio.categoria === categoria;
    const combinaMidia =
      midia === "todos" ||
      (midia === "com_midia" && exercicio.possuiMidia) ||
      (midia === "sem_midia" && !exercicio.possuiMidia);

    return combinaBusca && combinaOrigem && combinaGrupo && combinaCategoria && combinaMidia;
  });
}

export function criarOpcoesBibliotecaExercicios(exercicios) {
  return {
    gruposMusculares: uniqueSorted(exercicios.map((exercicio) => exercicio.grupoMuscular)),
    categorias: uniqueSorted(exercicios.map((exercicio) => exercicio.categoria)),
  };
}

export function criarErroBibliotecaExercicios(error) {
  return new Error(
    error?.message
      ? "Não foi possível carregar a biblioteca de exercícios."
      : "Biblioteca de exercícios indisponível."
  );
}

function buildExerciseMedia(row) {
  if (row.media_type === "youtube") {
    const parsed = parseYouTubeMediaInput(row.youtube_url);

    return {
      type: "youtube",
      label: "YouTube",
      youtubeUrl: row.youtube_url || "",
      videoId: parsed.ok ? parsed.media.videoId : "",
      embedUrl: parsed.ok ? parsed.media.embedUrl : "",
      thumbnailUrl: parsed.ok ? parsed.media.thumbnailUrl : "",
      thumbnailPath: "",
    };
  }

  if (row.media_type === "uploaded_video") {
    return {
      type: "uploaded_video",
      label: "Video",
      youtubeUrl: "",
      videoId: "",
      embedUrl: "",
      thumbnailUrl: "",
      mediaPath: row.media_path || "",
      mimeType: row.media_mime_type || "",
      thumbnailPath: row.thumbnail_path || "",
    };
  }

  return {
    type: "",
    label: "Sem midia",
    youtubeUrl: "",
    videoId: "",
    embedUrl: "",
    thumbnailUrl: "",
    mediaPath: "",
    mimeType: "",
    thumbnailPath: "",
  };
}

function normalizeExerciseOrigin(origin) {
  return origin === "personal" ? "personal" : "official";
}

function sanitizeText(value) {
  return String(value || "").trim();
}

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function uniqueSorted(values) {
  return [...new Set(values.map(sanitizeText).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "pt-BR", { sensitivity: "base" })
  );
}
