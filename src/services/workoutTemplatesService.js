import {
  assertTemplateDataIsSanitized,
  sanitizeWorkoutForTemplate,
  templateDataToPreviewDays,
  validateTemplateData,
} from "../features/treinos/utils/workoutTemplateSanitization";
import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";

export async function buscarModelosPessoaisSupabase() {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("workout_templates")
    .select("*")
    .eq("owner_id", user.id)
    .eq("is_active", true)
    .eq("is_system", false)
    .order("updated_at", { ascending: false });

  if (tabelaAusente(error)) return [];
  if (error) throw error;

  return (data || []).map(rowParaModeloPessoal);
}

export async function buscarModeloPessoalPorIdSupabase(id) {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("workout_templates")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .eq("is_system", false)
    .single();

  if (error) throw error;

  return rowParaModeloPessoal(data);
}

export async function criarModeloPessoalSupabase(metadata, treino) {
  const user = await buscarUsuarioLogado();
  const templateData = sanitizeWorkoutForTemplate(treino);
  validarTemplate(templateData);

  const { data, error } = await supabase
    .from("workout_templates")
    .insert({
      owner_id: user.id,
      name: metadata.name,
      reference_gender: metadata.referenceGender,
      split_type: metadata.splitType,
      objective: metadata.objective,
      level: metadata.level,
      description: metadata.description,
      template_data: templateData,
      is_system: false,
      is_active: true,
    })
    .select("*")
    .single();

  if (error) throw error;

  return rowParaModeloPessoal(data);
}

export async function atualizarModeloPessoalSupabase(id, metadata) {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("workout_templates")
    .update({
      name: metadata.name,
      reference_gender: metadata.referenceGender,
      split_type: metadata.splitType,
      objective: metadata.objective,
      level: metadata.level,
      description: metadata.description,
    })
    .eq("id", id)
    .eq("owner_id", user.id)
    .eq("is_system", false)
    .select("*")
    .single();

  if (error) throw error;

  return rowParaModeloPessoal(data);
}

export async function excluirModeloPessoalSupabase(id) {
  const user = await buscarUsuarioLogado();

  const { error } = await supabase
    .from("workout_templates")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id)
    .eq("is_system", false);

  if (error) throw error;

  return id;
}

function rowParaModeloPessoal(row) {
  const templateData = row.template_data || {};

  return {
    id: row.id,
    nome: row.name || "",
    genero: row.reference_gender || "Unissex",
    divisao: row.split_type || "Outro",
    objetivo: row.objective || "",
    nivel: row.level || "",
    descricao: row.description || "",
    isSystem: false,
    origem: "personal",
    templateData,
    dias: templateDataToPreviewDays(templateData),
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };
}

function validarTemplate(templateData) {
  const estruturaValida = validateTemplateData(templateData);
  const sanitizacao = assertTemplateDataIsSanitized(templateData);

  if (!estruturaValida || !sanitizacao.ok) {
    const detalhes = sanitizacao.forbiddenPaths.join(", ");
    throw new Error(
      detalhes
        ? `Modelo contem dados proibidos: ${detalhes}.`
        : "Modelo sem dias ou exercicios validos."
    );
  }
}

function tabelaAusente(error) {
  return (
    error?.code === "42P01" ||
    String(error?.message || "").toLowerCase().includes("relation") &&
      String(error?.message || "").includes("workout_templates")
  );
}
