import { spawnSync } from "node:child_process";

function runSupabaseStatus(command, args = ["supabase", "status", "--output", "json"]) {
  return spawnSync(command, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
  });
}

export function readLocalSupabaseRuntime() {
  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  let result = runSupabaseStatus(command);
  const output = `${result.stdout || ""}\n${result.stderr || ""}`;
  let jsonStart = output.indexOf("{");
  let jsonEnd = output.lastIndexOf("}");
  if (result.status !== 0 || jsonStart === -1 || jsonEnd === -1) {
    result = runSupabaseStatus(command, ["supabase", "status"]);
  }
  const fallbackOutput = `${result.stdout || ""}\n${result.stderr || ""}`;
  if (result.status !== 0) {
    throw new Error(`Supabase local indisponivel. npx supabase status falhou: ${sanitize(fallbackOutput)}`);
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
