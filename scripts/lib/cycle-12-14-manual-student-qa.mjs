import { createClient } from "@supabase/supabase-js";
import { getDbContainer, validateLocalGuard } from "../supabase-cycle-8-lib.mjs";
import { loadQaEnvFile, validateQaEnvironment } from "./qa-environment-guard.mjs";
import { readLocalSupabaseRuntime } from "./local-supabase-runtime.mjs";

export const FIXTURE_NAMESPACE = "cycle-12-14-manual-qa";
export const STUDENT_EMAIL = "student.qa.local@aruka.test";
export const PROFESSIONAL_EMAIL = "professional.cycle-12-14.manual@aruka.test";
export const CONTACT_EMAIL = "support-cycle-12-14@example.invalid";
export const CONTACT_WHATSAPP = "5500000000000";
export const FIXTURE_IDS = Object.freeze({
  student: "12143b00-0000-4000-8000-000000000001",
  workout: "12143b00-0000-4000-8000-000000000002",
  day: "12143b00-0000-4000-8000-000000000003",
  exercises: [
    "12143b00-0000-4000-8000-000000000004",
    "12143b00-0000-4000-8000-000000000005",
    "12143b00-0000-4000-8000-000000000006",
    "12143b00-0000-4000-8000-000000000007",
    "12143b00-0000-4000-8000-000000000008",
  ],
  historicalSession: "12143b00-0000-4000-8000-000000000010",
  historicalExercises: [
    "12143b00-0000-4000-8000-000000000011",
    "12143b00-0000-4000-8000-000000000012",
    "12143b00-0000-4000-8000-000000000013",
    "12143b00-0000-4000-8000-000000000014",
    "12143b00-0000-4000-8000-000000000015",
  ],
  assessments: [
    "12143b00-0000-4000-8000-000000000041",
    "12143b00-0000-4000-8000-000000000042",
  ],
});

export function loadAndValidateManualQaEnvironment() {
  loadQaEnvFile(".env.local");
  loadQaEnvFile(".env.qa.local");

  const password = String(process.env.QA_USER_PASSWORD || "");
  if (!password) throw new Error("MANUAL_QA_BLOCKED: QA_USER_PASSWORD ausente ou vazia.");

  const runtime = readLocalSupabaseRuntime();
  const api = new URL(runtime.apiUrl);
  if (!["127.0.0.1", "localhost"].includes(api.hostname) || api.port !== "54321" || api.protocol !== "http:") {
    throw new Error("MANUAL_QA_BLOCKED: endpoint API/Auth local nao confirmado.");
  }
  if (!runtime.dbUrl.includes("@127.0.0.1:54322/") && !runtime.dbUrl.includes("@localhost:54322/")) {
    throw new Error("MANUAL_QA_BLOCKED: host/porta do PostgreSQL local nao confirmados.");
  }

  validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });
  const repositoryGuard = validateLocalGuard(process.cwd(), []);
  if (!repositoryGuard.ok) {
    throw new Error(`MANUAL_QA_BLOCKED: guard local falhou: ${repositoryGuard.errors.join("; ")}`);
  }
  const dbContainer = getDbContainer(process.cwd());
  if (dbContainer !== "supabase_db_ConsultoriaFitness") {
    throw new Error(`MANUAL_QA_BLOCKED: container local inesperado: ${dbContainer}`);
  }

  return { runtime, password, dbContainer };
}

export async function assertLocalServices(runtime) {
  const response = await fetch(`${runtime.apiUrl}/auth/v1/health`, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`MANUAL_QA_BLOCKED: Auth local indisponivel (${response.status}).`);
}

export function createAdminClient(runtime) {
  return createClient(runtime.apiUrl, runtime.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}

export function createStudentClient(runtime) {
  return createClient(runtime.apiUrl, runtime.anonKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}

export async function findAuthUserByEmail(admin, email) {
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const match = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;
    if (data.users.length < 100) return null;
  }
  throw new Error("MANUAL_QA_BLOCKED: limite de paginacao do Auth excedido.");
}

export function assertFixtureAuthUser(user, role) {
  if (!user) throw new Error(`MANUAL_QA_BLOCKED: Auth user ${role} ausente.`);
  if (user.app_metadata?.qa_fixture !== FIXTURE_NAMESPACE || user.app_metadata?.qa_fixture_role !== role) {
    throw new Error(`MANUAL_QA_BLOCKED: email ${role} existe sem o marker esperado.`);
  }
  if (user.banned_until && new Date(user.banned_until).getTime() > Date.now()) {
    throw new Error(`MANUAL_QA_BLOCKED: Auth user ${role} esta banido.`);
  }
}

export function sqlLiteral(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}
