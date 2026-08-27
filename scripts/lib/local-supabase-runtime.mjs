import { spawnSync } from "node:child_process";

const DEFAULT_LOCAL_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const DEFAULT_LOCAL_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

function runSupabaseStatus(command, args = ["supabase", "status", "--output", "json"]) {
  return spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
    timeout: Number(process.env.SUPABASE_STATUS_TIMEOUT_MS || 15000),
  });
}

export function readLocalSupabaseRuntime() {
  const envRuntime = readLocalSupabaseRuntimeFromEnv();
  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  let result = runSupabaseStatus(command);
  const output = `${result.stdout || ""}\n${result.stderr || ""}`;
  let jsonStart = output.indexOf("{");
  let jsonEnd = output.lastIndexOf("}");
  if (result.error?.code === "ETIMEDOUT") {
    if (envRuntime) return envRuntime;
    throw new Error("Supabase local indisponivel. npx supabase status excedeu 15000ms.");
  }
  if (result.status !== 0 || jsonStart === -1 || jsonEnd === -1) {
    result = runSupabaseStatus(command, ["supabase", "status"]);
  }
  const fallbackOutput = `${result.stdout || ""}\n${result.stderr || ""}`;
  if (result.error?.code === "ETIMEDOUT") {
    if (envRuntime) return envRuntime;
    throw new Error("Supabase local indisponivel. supabase status excedeu 15000ms.");
  }
  if (result.status !== 0) {
    if (envRuntime) return envRuntime;
    const fallbackRuntime = readDefaultLocalSupabaseRuntime();
    if (fallbackRuntime && isRecoverableStatusFailure(result)) return fallbackRuntime;
    throw new Error(`Supabase local indisponivel. npx supabase status falhou: ${describeFailure(result, fallbackOutput)}`);
  }
  jsonStart = fallbackOutput.indexOf("{");
  jsonEnd = fallbackOutput.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error(
      `Supabase local indisponivel.\nO comando "supabase status" nao retornou um bloco JSON valido.\n\nSaida recebida:\n${sanitize(fallbackOutput).slice(0, 500)}`,
    );
  }
  const data = JSON.parse(fallbackOutput.slice(jsonStart, jsonEnd + 1));
  const apiUrl = String(data.API_URL || "");
  if (!apiUrl.startsWith("http://127.0.0.1:54321") && !apiUrl.startsWith("http://localhost:54321")) {
    throw new Error("Supabase bloqueado: API_URL local esperada nao confirmada.");
  }
  return {
    apiUrl,
    anonKey: data.ANON_KEY,
    serviceRoleKey: data.SERVICE_ROLE_KEY,
    dbUrl: maskDbUrl(data.DB_URL),
    inbucketUrl: data.INBUCKET_URL || data.MAILPIT_URL || "",
  };
}

function readDefaultLocalSupabaseRuntime() {
  const apiUrl = "http://127.0.0.1:54321";
  return {
    apiUrl,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || DEFAULT_LOCAL_ANON_KEY,
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      DEFAULT_LOCAL_SERVICE_ROLE_KEY,
    dbUrl: maskDbUrl("postgresql://postgres:postgres@127.0.0.1:54322/postgres"),
    inbucketUrl: "http://127.0.0.1:54324",
  };
}

function isRecoverableStatusFailure(result) {
  return ["EINVAL", "ENOENT", "EACCES"].includes(result.error?.code);
}

function readLocalSupabaseRuntimeFromEnv() {
  const apiUrl = String(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "http://127.0.0.1:54321");
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.ANON_KEY;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!anonKey || !serviceRoleKey) return null;
  if (!apiUrl.startsWith("http://127.0.0.1:54321") && !apiUrl.startsWith("http://localhost:54321")) {
    throw new Error("Supabase bloqueado: API_URL local esperada nao confirmada.");
  }
  return {
    apiUrl,
    anonKey,
    serviceRoleKey,
    dbUrl: maskDbUrl(process.env.SUPABASE_DB_URL || "postgresql://postgres:postgres@127.0.0.1:54322/postgres"),
    inbucketUrl: process.env.SUPABASE_INBUCKET_URL || "http://127.0.0.1:54324",
  };
}

export function maskUuid(value) {
  const text = String(value || "");
  return text.length > 12 ? `${text.slice(0, 8)}...${text.slice(-4)}` : "***";
}

function maskDbUrl(value) {
  return String(value || "").replace(/postgresql:\/\/([^:]+):([^@]+)@/, "postgresql://$1:***@");
}

function sanitize(value) {
  return String(value || "")
    .replace(/eyJ[A-Za-z0-9._-]+/g, "[jwt-redacted]")
    .replace(/postgresql:\/\/([^:]+):([^@]+)@/g, "postgresql://$1:***@")
    .trim();
}

function describeFailure(result, output) {
  const sanitized = sanitize(output);
  if (sanitized) return sanitized;
  const parts = [`status=${result.status ?? "unknown"}`];
  if (result.signal) parts.push(`signal=${result.signal}`);
  if (result.error?.code) parts.push(`error=${result.error.code}`);
  return parts.join(" ");
}
