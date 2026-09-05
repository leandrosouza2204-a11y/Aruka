import { supabase } from "./supabase.js";
import {
  criarErroBibliotecaExercicios,
  mapExerciseLibraryRows,
} from "./exerciseLibraryMapper.js";

export {
  criarErroBibliotecaExercicios,
  criarOpcoesBibliotecaExercicios,
  filtrarExerciciosBiblioteca,
  mapExerciseLibraryRows,
  rowParaExercicioBiblioteca,
} from "./exerciseLibraryMapper.js";

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
