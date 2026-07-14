import { createClient } from "@supabase/supabase-js";

const prefix = "QA_TEMPLATE_";
const { supabase, user } = await createQaClient();

const antes = await listarQaTemplates();
if (antes.error) throw sanitizarErro(antes.error);

if (antes.data.length > 0) {
  const { error } = await supabase
    .from("workout_templates")
    .delete()
    .eq("owner_id", user.id)
    .like("name", `${prefix}%`);

  if (error) throw sanitizarErro(error);
}

const depois = await listarQaTemplates();
if (depois.error) throw sanitizarErro(depois.error);

if (depois.data.length !== 0) {
  throw new Error(`Cleanup incompleto: ${depois.data.length} registro(s) QA ainda existem.`);
}

console.log(`Cleanup workout_templates: removidos=${antes.data.length}; restantes=0.`);

async function listarQaTemplates() {
  return supabase
    .from("workout_templates")
    .select("id,name,owner_id", { count: "exact" })
    .eq("owner_id", user.id)
    .like("name", `${prefix}%`);
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

  if (faltantes.length) {
    throw new Error(`Variaveis QA ausentes: ${faltantes.join(", ")}.`);
  }

  const client = createClient(url, anonKey);
  const { data, error } = await client.auth.signInWithPassword({ email, password });

  if (error) throw sanitizarErro(error);
  if (!data.user?.id) throw new Error("Login QA nao retornou usuario autenticado.");

  return { supabase: client, user: data.user };
}

function sanitizarErro(error) {
  return new Error(`${error.code || "erro"}: ${error.message || "falha nao identificada"}`);
}
