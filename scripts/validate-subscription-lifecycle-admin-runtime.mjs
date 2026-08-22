import { createClient } from "@supabase/supabase-js";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";

const runtime = readLocalSupabaseRuntime();
const admin = createClient(runtime.apiUrl, runtime.serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const probeEmail = "subscription.lifecycle.qa.local@aruka.test";
const started = new Date();
const startDate = started.toISOString().slice(0, 10);
const endDate = new Date(started);
endDate.setDate(endDate.getDate() + 30);
const dueDate = endDate.toISOString().slice(0, 10);

const user = await ensureUser();
await ensureProfile(user.id);
await upsertSubscription(user.id, {
  status: "ativo",
  data_vencimento: dueDate,
  cancel_at_period_end: false,
  grace_until: null,
  suspended_at: null,
  cancelled_at: null,
});

await assertState(user.id, "ativo", false);
await upsertSubscription(user.id, { status: "vencido", grace_until: addDays(7), suspended_at: null });
await assertState(user.id, "vencido", false);
await upsertSubscription(user.id, { status: "vencido", grace_until: null, suspended_at: startDate });
await assertState(user.id, "vencido", false);
await upsertSubscription(user.id, { status: "ativo", data_vencimento: dueDate, grace_until: null, suspended_at: null, reactivated_at: startDate });
await assertState(user.id, "ativo", false);
await upsertSubscription(user.id, { status: "ativo", data_vencimento: dueDate, cancel_at_period_end: true });
await assertState(user.id, "ativo", true);
await upsertSubscription(user.id, { status: "cancelado", cancel_at_period_end: false, cancelled_at: startDate });
await assertState(user.id, "cancelado", false);
await upsertSubscription(user.id, { status: "ativo", data_vencimento: dueDate, cancelled_at: null, reactivated_at: startDate });
await admin.from("perfis").update({ tipo_acesso: "bloqueado", status: "inativo" }).eq("user_id", user.id);
await upsertSubscription(user.id, { status: "ativo", data_vencimento: dueDate, reactivated_at: startDate });
const { data: blocked } = await admin.from("perfis").select("tipo_acesso,status").eq("user_id", user.id).maybeSingle();
if (blocked?.tipo_acesso !== "bloqueado" || blocked?.status !== "inativo") {
  throw new Error("PAYMENT_REACTIVATION_CLEARED_ADMIN_BLOCK");
}

console.log("SUBSCRIPTION_LIFECYCLE_ADMIN_RUNTIME=PASS");
console.log("PAYMENT_REACTIVATION_CANNOT_CLEAR_ADMIN_BLOCK=YES");
console.log("PRODUCTION_ACCESSED=NO");
console.log("PRODUCTION_MUTATION=NO");
console.log("DB_PUSH=NO");

async function ensureUser() {
  const { data: listed, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw listError;
  const existing = listed.users.find((item) => item.email?.toLowerCase() === probeEmail);
  if (existing) return existing;
  const { data, error } = await admin.auth.admin.createUser({
    email: probeEmail,
    email_confirm: true,
    password: `LocalLifecycle-${Date.now()}a1!`,
  });
  if (error) throw error;
  return data.user;
}

async function ensureProfile(userId) {
  const { error } = await admin.from("perfis").upsert({
    user_id: userId,
    email: probeEmail,
    nome: "Subscription Lifecycle QA",
    role: "user",
    tipo_acesso: "assinante",
    status: "ativo",
  }, { onConflict: "user_id" });
  if (error) throw error;
}

async function upsertSubscription(userId, patch) {
  const { data: current, error: currentError } = await admin
    .from("assinaturas")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (currentError) throw currentError;

  const payload = {
    user_id: userId,
    plano: "LOCAL_QA",
    data_inicio: startDate,
    ...patch,
  };
  const result = current
    ? await admin.from("assinaturas").update(payload).eq("id", current.id)
    : await admin.from("assinaturas").insert(payload);
  if (result.error) throw result.error;
}

async function assertState(userId, status, cancelAtPeriodEnd) {
  const { data, error } = await admin
    .from("assinaturas")
    .select("status,cancel_at_period_end")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (data?.status !== status || Boolean(data?.cancel_at_period_end) !== cancelAtPeriodEnd) {
    throw new Error(`UNEXPECTED_SUBSCRIPTION_STATE_${status}`);
  }
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}
