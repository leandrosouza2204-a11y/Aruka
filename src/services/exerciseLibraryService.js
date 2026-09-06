import { supabase } from "./supabase.js";
import {
  criarErroBibliotecaExercicios,
  mapExerciseLibraryRows,
} from "./exerciseLibraryMapper.js";
import { criarPayloadExercicioPessoal } from "./exerciseLibraryForm.js";
import {
  EXERCISE_VIDEO_BUCKET,
  EXERCISE_VIDEO_SIGNED_URL_TTL_SECONDS,
  buildExerciseVideoPath,
  criarPayloadMidiaUpload,
  isExerciseVideoPath,
  validateExerciseVideoFile,
} from "../features/exerciseLibrary/utils/uploadedVideoMedia.js";

export {
  criarErroBibliotecaExercicios,
  criarOpcoesBibliotecaExercicios,
  filtrarExerciciosBiblioteca,
  mapExerciseLibraryRows,
  rowParaExercicioBiblioteca,
} from "./exerciseLibraryMapper.js";
export {
  EXERCISE_LIBRARY_FORM_INITIAL,
  criarFormularioExercicioBiblioteca,
  criarPayloadExercicioPessoal,
  podeGerenciarExercicioBiblioteca,
  sanitizarFormularioExercicioBiblioteca,
  validarFormularioExercicioBiblioteca,
} from "./exerciseLibraryForm.js";

const EXERCISE_LIBRARY_SELECT = [
  "id",
  "origin",
  "name",
  "description",
  "muscle_group",
  "category",
  "instructions",
  "youtube_url",
  "media_type",
  "media_path",
  "thumbnail_path",
  "media_mime_type",
  "status",
  "created_at",
  "updated_at",
].join(",");

export async function buscarBibliotecaExerciciosSupabase() {
  const { data, error } = await supabase
    .from("exercise_library")
    .select(EXERCISE_LIBRARY_SELECT)
    .eq("status", "active")
    .order("origin", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw criarErroBibliotecaExercicios(error);

  return mapExerciseLibraryRows(data || []);
}

export async function criarExercicioPessoalSupabase(formulario) {
  const ownerId = await buscarUsuarioAtualId();
  const exerciseId = formulario?.mediaMode === "upload" ? crypto.randomUUID() : undefined;
  const formularioComMidia = await prepararFormularioComUpload({
    formulario,
    ownerId,
    exerciseId,
  });
  const resultado = criarPayloadExercicioPessoal(formularioComMidia, ownerId);
  if (!resultado.valido) {
    throw criarErroValidacaoExercicio(resultado.erros);
  }
  if (exerciseId) resultado.payload.id = exerciseId;

  const { data, error } = await supabase
    .from("exercise_library")
    .insert(resultado.payload)
    .select(EXERCISE_LIBRARY_SELECT)
    .single();

  if (error) {
    await limparUploadOrfao(formularioComMidia.uploadedVideoPath);
    throw criarErroMutacaoBibliotecaExercicios(error);
  }

  return mapExerciseLibraryRows([data])[0];
}

export async function atualizarExercicioPessoalSupabase(exercicioId, formulario) {
  const ownerId = await buscarUsuarioAtualId();
  const oldMediaPath = formulario?.previousMediaPath || "";
  const formularioComMidia = await prepararFormularioComUpload({
    formulario,
    ownerId,
    exerciseId: exercicioId,
  });
  const resultado = criarPayloadExercicioPessoal(formularioComMidia, undefined);
  if (!resultado.valido) {
    throw criarErroValidacaoExercicio(resultado.erros);
  }

  const payload = { ...resultado.payload };
  delete payload.owner_id;
  delete payload.status;
  delete payload.archived_at;
  const { data, error } = await supabase
    .from("exercise_library")
    .update(payload)
    .eq("id", exercicioId)
    .eq("origin", "personal")
    .select(EXERCISE_LIBRARY_SELECT)
    .single();

  if (error) {
    await limparUploadOrfao(formularioComMidia.uploadedVideoPath, oldMediaPath);
    throw criarErroMutacaoBibliotecaExercicios(error);
  }

  await limparMidiaAntiga(oldMediaPath, data?.media_path);

  return mapExerciseLibraryRows([data])[0];
}

export async function criarSignedExerciseMediaUrl(path) {
  if (!isExerciseVideoPath(path)) return "";

  const { data, error } = await supabase.storage
    .from(EXERCISE_VIDEO_BUCKET)
    .createSignedUrl(path, EXERCISE_VIDEO_SIGNED_URL_TTL_SECONDS);

  if (error) return "";
  return data?.signedUrl || "";
}

export async function arquivarExercicioPessoalSupabase(exercicioId) {
  const { data, error } = await supabase
    .from("exercise_library")
    .update({
      status: "archived",
      archived_at: new Date().toISOString(),
    })
    .eq("id", exercicioId)
    .eq("origin", "personal")
    .select(EXERCISE_LIBRARY_SELECT)
    .single();

  if (error) throw criarErroMutacaoBibliotecaExercicios(error);

  return mapExerciseLibraryRows([data])[0];
}

async function buscarUsuarioAtualId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id) {
    throw new Error("Não foi possível identificar o usuário atual.");
  }

  return user.id;
}

async function prepararFormularioComUpload({ formulario, ownerId, exerciseId }) {
  if (formulario?.mediaMode !== "upload") return formulario;
  if (!formulario.uploadFile) return formulario;

  const validation = validateExerciseVideoFile(formulario.uploadFile);
  if (!validation.ok) {
    const erro = criarErroValidacaoExercicio({ uploadFile: validation.message });
    throw erro;
  }

  const path = buildExerciseVideoPath({
    userId: ownerId,
    exerciseId,
    file: formulario.uploadFile,
    assetId: crypto.randomUUID(),
  });
  const { error } = await supabase.storage
    .from(EXERCISE_VIDEO_BUCKET)
    .upload(path, formulario.uploadFile, {
      cacheControl: "3600",
      contentType: formulario.uploadFile.type,
      upsert: false,
    });

  if (error) throw criarErroUploadVideo(error);

  return {
    ...formulario,
    ...criarPayloadMidiaUpload({ path, mimeType: formulario.uploadFile.type }),
    uploadedVideoPath: path,
    uploadedVideoMimeType: formulario.uploadFile.type,
  };
}

async function limparUploadOrfao(path, oldPath = "") {
  if (path && path !== oldPath && isExerciseVideoPath(path)) {
    await supabase.storage.from(EXERCISE_VIDEO_BUCKET).remove([path]);
  }
}

async function limparMidiaAntiga(oldPath, currentPath) {
  if (oldPath && oldPath !== currentPath && isExerciseVideoPath(oldPath)) {
    await supabase.storage.from(EXERCISE_VIDEO_BUCKET).remove([oldPath]);
  }
}

function criarErroUploadVideo(error) {
  const erro = new Error(
    error?.statusCode === "403"
      ? "Você não tem permissão para alterar este exercício."
      : "Não foi possível enviar o vídeo. Tente novamente."
  );
  erro.supabaseError = error;
  return erro;
}

function criarErroMutacaoBibliotecaExercicios(error) {
  return new Error(
    error?.message
      ? "Não foi possível salvar o exercício pessoal."
      : "Exercício pessoal indisponível."
  );
}

function criarErroValidacaoExercicio(erros) {
  const erro = new Error("Revise os campos do exercício.");
  erro.validationErrors = erros;
  return erro;
}
