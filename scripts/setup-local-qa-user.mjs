import { createClient } from "@supabase/supabase-js";
import { spawnSync } from "node:child_process";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";
import { maskUuid, readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";

loadQaEnvFile();
const runtime = readLocalSupabaseRuntime();
validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });

const email = process.env.QA_USER_EMAIL;
const password = process.env.QA_USER_PASSWORD;
if (!email || !password) throw new Error("QA_USER_EMAIL e QA_USER_PASSWORD sao obrigatorios.");
if (password.length < 20) throw new Error("QA_USER_PASSWORD deve ter pelo menos 20 caracteres.");

const supabase = createClient(runtime.apiUrl, runtime.serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

await repairLocalAuthNulls();
const user = await findOrCreateUser();
await ensureProfile(user);
await ensureSubscription(user);
await ensureLegalAcceptance(user);

console.log(JSON.stringify({
  status: "LOCAL_QA_USER_READY",
  email,
  userIdMasked: maskUuid(user.id),
  profile: "assinante ativo",
  subscription: "ativo",
  legalAcceptance: "1.0",
}, null, 2));

async function findOrCreateUser() {
  const existing = await findUserByEmail(email);
  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: { nome: "QA Local Aruka" },
    });
    if (error) throw error;
    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nome: "QA Local Aruka" },
  });
  if (error) throw error;
  return data.user;
}

async function findUserByEmail(targetEmail) {
  let page = 1;
  while (page < 20) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const found = data.users.find((item) => item.email?.toLowerCase() === targetEmail.toLowerCase());
    if (found) return found;
    if (data.users.length < 100) return null;
    page += 1;
  }
  return null;
}

async function ensureProfile(user) {
  const { error } = await supabase.from("perfis").upsert({
    user_id: user.id,
    nome: "QA Local Aruka",
    email,
    role: "user",
    tipo_acesso: "assinante",
    status: "ativo",
  }, { onConflict: "user_id" });
  if (error) throw error;
}

async function ensureSubscription(user) {
  const today = new Date();
  const end = new Date(today);
  end.setFullYear(end.getFullYear() + 1);
  const payload = {
    user_id: user.id,
    plano: "LOCAL_QA",
    status: "ativo",
    data_inicio: today.toISOString().slice(0, 10),
    data_vencimento: end.toISOString().slice(0, 10),
    pagamento_id: "local-qa-fixture",
  };
  const { data: current, error: currentError } = await supabase
    .from("assinaturas")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (currentError) throw currentError;
  const { error } = current
    ? await supabase.from("assinaturas").update(payload).eq("id", current.id)
    : await supabase.from("assinaturas").insert(payload);
  if (error) throw error;
}

async function ensureLegalAcceptance(user) {
  const { error } = await supabase.from("aceites_legais").upsert({
    user_id: user.id,
    politica_versao: "1.0",
    termos_versao: "1.0",
    politica_aceita: true,
    termos_aceitos: true,
    aceito_em: new Date().toISOString(),
    ip: null,
    user_agent: "LOCAL_QA setup",
  }, { onConflict: "user_id,politica_versao,termos_versao" });
  if (error) throw error;
}

async function repairLocalAuthNulls() {
  const sql = [
    "update auth.users set confirmation_token = '' where confirmation_token is null;",
    "update auth.users set recovery_token = '' where recovery_token is null;",
    "update auth.users set email_change_token_new = '' where email_change_token_new is null;",
    "update auth.users set email_change_token_current = '' where email_change_token_current is null;",
    "update auth.users set email_change = '' where email_change is null;",
    "update auth.users set phone_change = '' where phone_change is null;",
    "update auth.users set phone_change_token = '' where phone_change_token is null;",
    "update auth.users set reauthentication_token = '' where reauthentication_token is null;",
  ].join(" ");
  const result = spawnSync("docker", [
    "exec",
    "supabase_db_ConsultoriaFitness",
    "psql",
    "-U",
    "postgres",
    "-d",
    "postgres",
    "-v",
    "ON_ERROR_STOP=1",
    "-c",
    sql,
  ], { encoding: "utf8", shell: false });
  if (result.status !== 0) {
    throw new Error("Falha ao reparar Auth local para uso da API Admin.");
  }
}
