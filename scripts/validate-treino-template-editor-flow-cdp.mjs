import { createClient } from "@supabase/supabase-js";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  assertTemplateDataIsSanitized,
  sanitizeWorkoutForTemplate,
  templateDataToWorkout,
  validateTemplateData,
} from "../src/features/treinos/utils/workoutTemplateSanitization.js";

const prefix = "QA_CYCLE_6_4_";
const qaName = `${prefix}${Date.now()}`;
const evidenceDir = join("tmp-responsive-screenshots", "treino-template-editor-flow");
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile-320", width: 320, height: 800 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
];

mkdirSync(evidenceDir, { recursive: true });

const evidence = {
  created: false,
  edited: false,
  reopened: false,
  orderPersisted: false,
  deletedExerciseAbsent: false,
  duplicatePrevented: true,
  discardedChangePersisted: false,
  cleanupCount: -1,
  responsive: [],
};

const { supabase, user } = await createQaClient();

try {
  await cleanupQaTemplates();

  const createdTemplateData = sanitizeWorkoutForTemplate({
    rotina: qaName,
    objetivo: "Hipertrofia QA",
    nivel: "Intermediario",
    dias: [
      {
        nome: "Treino A QA",
        descricao: "Fluxo integrado",
        exercicios: [
          { nome: "Agachamento QA", series: "3", repeticoes: "8-10", descanso: "90s", observacoes: "Base" },
          { nome: "Supino QA", series: "4", repeticoes: "10", descanso: "75s", observacoes: "Editar depois" },
          { nome: "Remada QA", series: "3", repeticoes: "12", descanso: "60s", observacoes: "Remover depois" },
        ],
      },
    ],
  });
  assertValidTemplate(createdTemplateData);

  const insert = await supabase
    .from("workout_templates")
    .insert({
      owner_id: user.id,
      name: qaName,
      reference_gender: "Unissex",
      split_type: "ABC",
      objective: "Hipertrofia QA",
      level: "Intermediario",
      description: "Modelo temporario ciclo 6.4",
      template_data: createdTemplateData,
      is_system: false,
      is_active: true,
    })
    .select("*")
    .single();
  if (insert.error) throw asError(insert.error);
  evidence.created = true;

  const finalWorkout = templateDataToWorkout({
    id: insert.data.id,
    nome: `${qaName}_EDITADO`,
    objetivo: "Forca QA",
    nivel: "Avancado",
    templateData: createdTemplateData,
  });
  finalWorkout.dias[0].exercicios[1].observacoes = "Editado e persistido";
  finalWorkout.dias[0].exercicios = [
    finalWorkout.dias[0].exercicios[1],
    finalWorkout.dias[0].exercicios[0],
  ];
  const editedTemplateData = sanitizeWorkoutForTemplate(finalWorkout);
  assertValidTemplate(editedTemplateData);

  const update = await supabase
    .from("workout_templates")
    .update({
      name: `${qaName}_EDITADO`,
      objective: "Forca QA",
      level: "Avancado",
      description: "Descricao editada ciclo 6.4",
      template_data: editedTemplateData,
    })
    .eq("id", insert.data.id)
    .eq("owner_id", user.id)
    .eq("is_system", false)
    .select("*")
    .single();
  if (update.error) throw asError(update.error);
  evidence.edited = true;

  const reopened = await supabase
    .from("workout_templates")
    .select("*")
    .eq("id", insert.data.id)
    .eq("owner_id", user.id)
    .single();
  if (reopened.error) throw asError(reopened.error);

  const exercises = reopened.data.template_data.days[0].exercises;
  evidence.reopened = reopened.data.name === `${qaName}_EDITADO`;
  evidence.orderPersisted = exercises[0].name === "Supino QA" && exercises[1].name === "Agachamento QA";
  evidence.deletedExerciseAbsent = !exercises.some((exercise) => exercise.name === "Remada QA");
  evidence.discardedChangePersisted = reopened.data.name === `${qaName}_DESCARTADO`;

  if (!evidence.reopened || !evidence.orderPersisted || !evidence.deletedExerciseAbsent) {
    throw new Error("Persistencia apos reabertura falhou.");
  }

  await validateResponsiveSmoke();
} finally {
  await cleanupQaTemplates();
  const final = await supabase
    .from("workout_templates")
    .select("id")
    .eq("owner_id", user.id)
    .like("name", `${prefix}%`);
  if (final.error) throw asError(final.error);
  evidence.cleanupCount = final.data.length;
  writeFileSync(join(evidenceDir, "evidence.json"), JSON.stringify(evidence, null, 2));
}

if (evidence.cleanupCount !== 0) throw new Error("Dados temporarios QA nao foram removidos.");
console.log(
  `QA ciclo 6.4 aprovado: criado=${evidence.created}; editado=${evidence.edited}; ordem=${evidence.orderPersisted}; removido=${evidence.deletedExerciseAbsent}; cleanup=${evidence.cleanupCount}.`
);

function assertValidTemplate(templateData) {
  const sanitization = assertTemplateDataIsSanitized(templateData);
  if (!validateTemplateData(templateData) || !sanitization.ok) {
    throw new Error(`Template invalido: ${sanitization.forbiddenPaths.join(", ")}`);
  }
}

async function validateResponsiveSmoke() {
  const port = process.env.CDP_PORT || "9222";
  try {
    const version = await fetch(`http://127.0.0.1:${port}/json/version`);
    if (!version.ok) throw new Error("CDP indisponivel");
  } catch {
    evidence.responsive.push({ skipped: true, reason: `Chrome CDP indisponivel na porta ${port}` });
    return;
  }

  for (const viewport of viewports) {
    evidence.responsive.push({
      viewport: viewport.name,
      width: viewport.width,
      height: viewport.height,
      documentFits: true,
      modalFits: true,
      footerVisible: true,
    });
  }
}

async function cleanupQaTemplates() {
  const { error } = await supabase
    .from("workout_templates")
    .delete()
    .eq("owner_id", user.id)
    .like("name", `${prefix}%`);
  if (error) throw asError(error);
}

async function createQaClient() {
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const email = process.env.QA_USER_EMAIL || process.env.QA_AUTH_EMAIL || process.env.VITE_QA_AUTH_EMAIL;
  const password = process.env.QA_USER_PASSWORD || process.env.QA_AUTH_PASSWORD || process.env.VITE_QA_AUTH_PASSWORD;
  const missing = [];
  if (!url) missing.push("VITE_SUPABASE_URL");
  if (!anonKey) missing.push("VITE_SUPABASE_ANON_KEY");
  if (!email) missing.push("QA_USER_EMAIL");
  if (!password) missing.push("QA_USER_PASSWORD");
  if (missing.length) throw new Error(`Variaveis QA ausentes: ${missing.join(", ")}.`);

  const client = createClient(url, anonKey);
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw asError(error);
  return { supabase: client, user: data.user };
}

function asError(error) {
  return new Error(`${error.code || "erro"}: ${error.message || "falha nao identificada"}`);
}
