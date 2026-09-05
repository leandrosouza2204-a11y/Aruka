import { supabase } from "./supabase.js";
import {
  criarErroBibliotecaExercicios,
  mapExerciseLibraryRows,
} from "./exerciseLibraryMapper.js";
import { criarPayloadExercicioPessoal } from "./exerciseLibraryForm.js";

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
  "thumbnail_path",
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
  const resultado = criarPayloadExercicioPessoal(formulario, ownerId);
  if (!resultado.valido) {
    throw criarErroValidacaoExercicio(resultado.erros);
  }

  const { data, error } = await supabase
    .from("exercise_library")
    .insert(resultado.payload)
    .select(EXERCISE_LIBRARY_SELECT)
    .single();

  if (error) throw criarErroMutacaoBibliotecaExercicios(error);

  return mapExerciseLibraryRows([data])[0];
}

export async function atualizarExercicioPessoalSupabase(exercicioId, formulario) {
  const resultado = criarPayloadExercicioPessoal(formulario, undefined);
  if (!resultado.valido) {
    throw criarErroValidacaoExercicio(resultado.erros);
  }

  const payload = { ...resultado.payload };
  delete payload.owner_id;
  delete payload.status;
  delete payload.youtube_url;
  delete payload.media_type;
  delete payload.media_path;
  delete payload.thumbnail_path;
  delete payload.media_mime_type;
  delete payload.archived_at;
  const { data, error } = await supabase
    .from("exercise_library")
    .update(payload)
    .eq("id", exercicioId)
    .eq("origin", "personal")
    .select(EXERCISE_LIBRARY_SELECT)
    .single();

  if (error) throw criarErroMutacaoBibliotecaExercicios(error);

  return mapExerciseLibraryRows([data])[0];
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
