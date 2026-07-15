import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("AOE_CORS_ORIGIN") || "",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, idempotency-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

type PublicActor = {
  actorId?: string;
  role?: string;
  organizationId?: string | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const env = readEnv();
    if (!env.aoeEnabled || !env.pilotEnabled) {
      return jsonResponse({ status: "ERROR", error: { code: "SERVICE_UNAVAILABLE", message: "AOE indisponível para piloto.", details: [], retryable: false } }, 503);
    }

    const authorization = req.headers.get("Authorization") || "";
    if (!authorization.toLowerCase().startsWith("bearer ")) {
      return jsonResponse({ status: "ERROR", error: { code: "UNAUTHORIZED", message: "Sessão não informada.", details: [], retryable: false } }, 401);
    }

    const userClient = createClient(env.supabaseUrl, env.anonKey, { global: { headers: { Authorization: authorization } } });
    const adminClient = createClient(env.supabaseUrl, env.serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const actor = await resolveActor(userClient);

    if (!pilotAllowed(env, actor)) {
      await recordAudit(adminClient, "PILOT_ACCESS_DENIED", actor, "FAILED");
      return jsonResponse({ status: "ERROR", error: { code: "FORBIDDEN", message: "Acesso ao piloto não autorizado.", details: [], retryable: false } }, 403);
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || inferAction(req.method, url.pathname);

    if (action === "health") {
      return jsonResponse({ status: "HEALTHY", aoeVersion: "1.7.0", publicContractVersion: "1.0.0-rc.1", catalogStatus: "AVAILABLE" });
    }

    if (req.method !== "POST" && !["getDecision", "getTrace", "getReview"].includes(action)) {
      return jsonResponse({ status: "ERROR", error: { code: "INVALID_REQUEST", message: "Método não permitido.", details: [], retryable: false } }, 405);
    }

    const body = req.method === "GET" ? {} : await safeJson(req);
    if ("error" in body) return jsonResponse(body.error, 400);

    const response = await dispatch({ action, body, actor, adminClient });
    return jsonResponse(response.body, response.status);
  } catch (_error) {
    return jsonResponse({ status: "ERROR", error: { code: "INTERNAL_ERROR", message: "Erro interno ao processar AOE.", details: [], retryable: false } }, 500);
  }
});

function readEnv() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!supabaseUrl || !anonKey || !serviceRoleKey) throw new Error("Missing Supabase env.");
  return {
    supabaseUrl,
    anonKey,
    serviceRoleKey,
    aoeEnabled: Deno.env.get("AOE_ENABLED") === "true",
    pilotEnabled: Deno.env.get("AOE_PILOT_ENABLED") === "true",
    allowedUsers: splitEnv("AOE_ALLOWED_USER_IDS"),
    allowedOrganizations: splitEnv("AOE_ALLOWED_ORGANIZATION_IDS"),
  };
}

function splitEnv(name: string) {
  return String(Deno.env.get(name) || "").split(",").map((item) => item.trim()).filter(Boolean);
}

async function resolveActor(userClient: ReturnType<typeof createClient>) {
  const { data, error } = await userClient.auth.getUser();
  if (error || !data?.user) throw new Error("Invalid user.");
  const { data: perfil } = await userClient.from("perfis").select("role,tipo_acesso,status").eq("user_id", data.user.id).maybeSingle();
  const role = perfil?.role === "admin" || perfil?.tipo_acesso === "admin" ? "ADMIN" : "PROFESSIONAL";
  return { actorId: data.user.id, role, organizationId: null };
}

function pilotAllowed(env: ReturnType<typeof readEnv>, actor: PublicActor) {
  const userAllowed = env.allowedUsers.length === 0 || env.allowedUsers.includes(String(actor.actorId));
  const orgAllowed = !actor.organizationId || env.allowedOrganizations.length === 0 || env.allowedOrganizations.includes(String(actor.organizationId));
  return userAllowed && orgAllowed;
}

async function dispatch({ action, body, actor, adminClient }: { action: string; body: Record<string, unknown>; actor: PublicActor; adminClient: ReturnType<typeof createClient> }) {
  if (action === "requestDecision") {
    const request = { ...(body as Record<string, unknown>), actor };
    return { status: 501, body: { status: "ERROR", requestId: request.requestId ?? null, error: { code: "SERVICE_UNAVAILABLE", message: "Boundary instalado; execução do bundle AOE será conectada no deploy controlado.", details: [], retryable: true } } };
  }
  if (action === "getDecision") {
    const decisionId = String(body.decisionId || "");
    const { data, error } = await adminClient.from("aoe_decisions").select("public_response").eq("id", decisionId).maybeSingle();
    if (error || !data) return { status: 404, body: { status: "ERROR", error: { code: "DECISION_NOT_FOUND", message: "Decisão não encontrada.", details: [], retryable: false } } };
    return { status: 200, body: data.public_response };
  }
  return { status: 400, body: { status: "ERROR", error: { code: "INVALID_REQUEST", message: "Ação inválida.", details: [], retryable: false } } };
}

async function safeJson(req: Request): Promise<Record<string, unknown> | { error: Record<string, unknown> }> {
  try {
    return await req.json();
  } catch {
    return { error: { status: "ERROR", error: { code: "INVALID_REQUEST", message: "JSON inválido.", details: [], retryable: false } } };
  }
}

function inferAction(method: string, pathname: string) {
  if (method === "GET" && pathname.endsWith("/health")) return "health";
  return "requestDecision";
}

async function recordAudit(adminClient: ReturnType<typeof createClient>, eventType: string, actor: PublicActor, outcome: string) {
  await adminClient.from("aoe_audit_events").insert({
    id: crypto.randomUUID(),
    event_type: eventType,
    actor_id: actor.actorId,
    actor_role: actor.role,
    organization_id: actor.organizationId,
    outcome,
    metadata: {},
    versions: { aoe: "1.7.0" },
  });
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
