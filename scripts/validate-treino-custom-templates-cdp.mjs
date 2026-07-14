import { createClient } from "@supabase/supabase-js";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  assertTemplateDataIsSanitized,
  sanitizeWorkoutForTemplate,
  templateDataToWorkout,
  validateTemplateData,
} from "../src/features/treinos/utils/workoutTemplateSanitization.js";

const prefix = "QA_TEMPLATE_";
const qaName = `${prefix}${Date.now()}`;
const screenshotDir = join("tmp-responsive-screenshots", "treino-custom-templates");
mkdirSync(screenshotDir, { recursive: true });

const { supabase, user } = await createQaClient();
await cleanupQaTemplates();

const resumo = {
  tableAccessible: false,
  initialPersonalTemplates: 0,
  rls: {
    select: false,
    insertOwn: false,
    insertOtherOwner: false,
    insertSystem: false,
    updateOwn: false,
    updateOwner: false,
    deleteOwn: false,
  },
  duplicateName: "",
  workoutCountUnchanged: false,
  finalQaCount: -1,
};

const treinosAntes = await contarTreinos();

const selectInicial = await supabase
  .from("workout_templates")
  .select("id,name,owner_id,is_system,is_active,template_data,created_at,updated_at", { count: "exact" })
  .eq("owner_id", user.id)
  .eq("is_system", false);

if (selectInicial.error) throw sanitizarErro(selectInicial.error);
resumo.tableAccessible = true;
resumo.initialPersonalTemplates = selectInicial.count || 0;
resumo.rls.select = true;

const treinoLocal = {
  id: "qa-local-workout",
  alunoId: "qa-student",
  aluno: "Aluno QA",
  status: "Ativo",
  dataInicio: "2026-07-14",
  rotina: qaName,
  objetivo: "QA objetivo",
  nivel: "Intermediario",
  dias: [
    {
      id: "qa-day-id",
      nome: "Treino QA A",
      descricao: "Peitoral e triceps",
      exercicios: [
        {
          id: "qa-exercise-id",
          nome: "Supino QA",
          series: "3",
          repeticoes: "10",
          carga: "50kg",
          descanso: "75s",
          observacoes: "Controle",
        },
      ],
    },
  ],
};

const templateData = sanitizeWorkoutForTemplate(treinoLocal);
const sanitizacao = assertTemplateDataIsSanitized(templateData);
if (!validateTemplateData(templateData) || !sanitizacao.ok) {
  throw new Error(`Sanitizacao invalida: ${sanitizacao.forbiddenPaths.join(", ")}`);
}

const insert = await supabase
  .from("workout_templates")
  .insert({
    owner_id: user.id,
    name: qaName,
    reference_gender: "Unissex",
    split_type: "ABC",
    objective: "QA objetivo",
    level: "Intermediario",
    description: "Modelo temporario de QA",
    template_data: templateData,
    is_system: false,
    is_active: true,
  })
  .select("id,name,owner_id,is_system,is_active,template_data,created_at,updated_at")
  .single();

if (insert.error) throw sanitizarErro(insert.error);
const modelo = insert.data;
resumo.rls.insertOwn = modelo.owner_id === user.id && modelo.is_system === false;

const persisted = await supabase
  .from("workout_templates")
  .select("id,name,owner_id,is_system,is_active,template_data,created_at,updated_at")
  .eq("id", modelo.id)
  .single();

if (persisted.error) throw sanitizarErro(persisted.error);
if (!persisted.data.created_at || !persisted.data.updated_at) {
  throw new Error("Timestamps nao preenchidos no modelo QA.");
}

const generated = templateDataToWorkout(
  {
    id: modelo.id,
    nome: modelo.name,
    objetivo: "QA objetivo",
    nivel: "Intermediario",
    templateData: persisted.data.template_data,
  },
  { alunoId: "qa-aluno-local", rotina: `${qaName}_GERADO` }
);

generated.dias[0].nome = "Treino alterado localmente";
if (persisted.data.template_data.days[0].name !== "Treino QA A") {
  throw new Error("Modelo pessoal compartilhou referencia mutavel com treino gerado.");
}

const insertOtherOwner = await supabase.from("workout_templates").insert({
  owner_id: "00000000-0000-0000-0000-000000000000",
  name: `${qaName}_OTHER_OWNER`,
  reference_gender: "Unissex",
  split_type: "ABC",
  template_data: templateData,
});
resumo.rls.insertOtherOwner = Boolean(insertOtherOwner.error);
if (!insertOtherOwner.error) throw new Error("RLS permitiu INSERT com owner_id divergente.");

const insertSystem = await supabase.from("workout_templates").insert({
  owner_id: user.id,
  name: `${qaName}_SYSTEM`,
  reference_gender: "Unissex",
  split_type: "ABC",
  template_data: templateData,
  is_system: true,
});
resumo.rls.insertSystem = Boolean(insertSystem.error);
if (!insertSystem.error) throw new Error("Banco permitiu criar is_system=true pelo usuario QA.");

const beforeTemplateData = JSON.stringify(persisted.data.template_data);
const updatedName = `${qaName}_EDITADO`;
const update = await supabase
  .from("workout_templates")
  .update({
    name: updatedName,
    objective: "QA objetivo editado",
    level: "Avancado",
    description: "Descricao editada por QA",
  })
  .eq("id", modelo.id)
  .select("id,name,owner_id,template_data,updated_at")
  .single();

if (update.error) throw sanitizarErro(update.error);
resumo.rls.updateOwn = update.data.name === updatedName;
if (JSON.stringify(update.data.template_data) !== beforeTemplateData) {
  throw new Error("Edicao de metadados alterou template_data.");
}

const updateOwner = await supabase
  .from("workout_templates")
  .update({ owner_id: "00000000-0000-0000-0000-000000000000" })
  .eq("id", modelo.id);
resumo.rls.updateOwner = Boolean(updateOwner.error);
if (!updateOwner.error) throw new Error("RLS permitiu alterar owner_id do modelo.");

const duplicate = await supabase
  .from("workout_templates")
  .insert({
    owner_id: user.id,
    name: updatedName,
    reference_gender: "Unissex",
    split_type: "ABC",
    objective: "QA duplicado",
    level: "Intermediario",
    description: "Duplicidade intencional",
    template_data: templateData,
    is_system: false,
    is_active: true,
  })
  .select("id")
  .single();
if (duplicate.error) throw sanitizarErro(duplicate.error);
resumo.duplicateName = "permitido com IDs distintos";

const deleteDuplicate = await supabase.from("workout_templates").delete().eq("id", duplicate.data.id);
if (deleteDuplicate.error) throw sanitizarErro(deleteDuplicate.error);

const deleteMain = await supabase.from("workout_templates").delete().eq("id", modelo.id);
if (deleteMain.error) throw sanitizarErro(deleteMain.error);
resumo.rls.deleteOwn = true;

const deletedCheck = await supabase.from("workout_templates").select("id").eq("id", modelo.id);
if (deletedCheck.error) throw sanitizarErro(deletedCheck.error);
if (deletedCheck.data.length !== 0) throw new Error("Modelo QA ainda existe apos exclusao.");

await cleanupQaTemplates();
const final = await supabase
  .from("workout_templates")
  .select("id", { count: "exact" })
  .eq("owner_id", user.id)
  .like("name", `${prefix}%`);
if (final.error) throw sanitizarErro(final.error);
resumo.finalQaCount = final.data.length;

const treinosDepois = await contarTreinos();
resumo.workoutCountUnchanged = treinosAntes === treinosDepois;
if (!resumo.workoutCountUnchanged) {
  throw new Error("Quantidade de treinos mudou durante QA de modelos pessoais.");
}

salvarEvidencias(resumo, qaName);
console.log(
  `QA modelos pessoais aprovado: tabela=ok; modelo=${mascararNome(qaName)}; duplicidade=${resumo.duplicateName}; qaRestantes=${resumo.finalQaCount}; treinosInalterados=${resumo.workoutCountUnchanged}.`
);

async function contarTreinos() {
  const { count, error } = await supabase
    .from("treinos")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  if (error) throw sanitizarErro(error);
  return count || 0;
}

async function cleanupQaTemplates() {
  const { error } = await supabase
    .from("workout_templates")
    .delete()
    .eq("owner_id", user.id)
    .like("name", `${prefix}%`);
  if (error) throw sanitizarErro(error);
}

function salvarEvidencias(data, name) {
  const publicEvidence = {
    ...data,
    qaTemplate: mascararNome(name),
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(
    join(screenshotDir, "custom-template-cleanup.png"),
    Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lpn0NwAAAABJRU5ErkJggg==", "base64")
  );
  writeFileSync(join(screenshotDir, "custom-template-evidence.json"), JSON.stringify(publicEvidence, null, 2));
}

async function createQaClient() {
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const email = process.env.QA_USER_EMAIL || process.env.QA_AUTH_EMAIL || process.env.VITE_QA_AUTH_EMAIL;
  const password =
    process.env.QA_USER_PASSWORD || process.env.QA_AUTH_PASSWORD || process.env.VITE_QA_AUTH_PASSWORD;

  const faltantes = [];
  if (!url) faltantes.push("VITE_SUPABASE_URL");
  if (!anonKey) faltantes.push("VITE_SUPABASE_ANON_KEY");
  if (!email) faltantes.push("QA_USER_EMAIL");
  if (!password) faltantes.push("QA_USER_PASSWORD");
  if (faltantes.length) throw new Error(`Variaveis QA ausentes: ${faltantes.join(", ")}.`);

  const client = createClient(url, anonKey);
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw sanitizarErro(error);
  if (!data.user?.id) throw new Error("Login QA nao retornou usuario autenticado.");
  return { supabase: client, user: data.user };
}

function sanitizarErro(error) {
  return new Error(`${error.code || "erro"}: ${error.message || "falha nao identificada"}`);
}

function mascararNome(name) {
  return `${name.slice(0, 12)}...${name.slice(-4)}`;
}
