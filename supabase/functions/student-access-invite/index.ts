import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const defaultCorsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Payload = {
  alunoId?: string;
  email?: string;
  action?: string;
};

type AlunoRow = {
  id: string;
  user_id: string;
  student_user_id: string | null;
  student_access_status: string;
  student_access_email: string | null;
};

Deno.serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Metodo nao permitido." }, 405, corsHeaders);

  try {
    const env = readEnv();
    if (!env.ok) return jsonResponse({ error: env.error }, 500, corsHeaders);

    const authorization = req.headers.get("Authorization") || "";
    const accessToken = extractBearerToken(authorization);
    if (!accessToken) {
      return jsonResponse({ error: "Sessao nao informada." }, 401, corsHeaders);
    }

    const userClient = createClient(env.supabaseUrl, env.anonKey, {
      global: { headers: { Authorization: authorization } },
    });
    const authEmailClient = createClient(env.supabaseUrl, env.anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const adminClient = createClient(env.supabaseUrl, env.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const authResult = await verifyAuthenticatedUser(userClient, accessToken, env.supabaseUrl);
    if (!authResult.ok) return jsonResponse({ error: "Sessao invalida." }, 401, corsHeaders);
    const user = authResult.user;

    const body = await safeJson(req);
    if ("error" in body) return jsonResponse({ error: body.error }, 400, corsHeaders);

    const action = normalizeAction(body.action);
    if (!action) return jsonResponse({ error: "Acao de convite invalida." }, 400, corsHeaders);

    const alunoId = String(body.alunoId || "").trim();
    if (!uuidValido(alunoId)) return jsonResponse({ error: "Aluno invalido." }, 400, corsHeaders);

    const { data: aluno, error: alunoError } = await adminClient
      .from("alunos")
      .select("id,user_id,student_user_id,student_access_status,student_access_email")
      .eq("id", alunoId)
      .maybeSingle<AlunoRow>();

    if (alunoError) throw alunoError;
    if (!aluno) return jsonResponse({ error: "Aluno nao encontrado." }, 404, corsHeaders);
    if (aluno.user_id !== user.id) return jsonResponse({ error: "Aluno nao encontrado." }, 403, corsHeaders);
    if (aluno.student_user_id) {
      return jsonResponse({ error: "Este aluno ja possui uma conta vinculada." }, 409, corsHeaders);
    }

    const persistedInviteEmail = normalizarEmail(aluno.student_access_email || "");
    const requestedEmail = normalizarEmail(body.email || "");
    const email = action === "resend"
      ? persistedInviteEmail
      : requestedEmail;

    if (!emailValido(email)) return jsonResponse({ error: "Informe um e-mail valido." }, 400, corsHeaders);

    if (action === "send" && !["not_invited", "revoked"].includes(aluno.student_access_status)) {
      return jsonResponse({ error: "Convite indisponivel para o estado atual." }, 409, corsHeaders);
    }

    if (action === "resend" && aluno.student_access_status !== "invited") {
      return jsonResponse({ error: "Reenvio disponivel apenas para convite pendente." }, 409, corsHeaders);
    }

    if (action === "resend" && requestedEmail && requestedEmail !== persistedInviteEmail) {
      return jsonResponse({
        error: "O e-mail do convite pendente nao corresponde ao e-mail informado.",
        code: "INVITE_EMAIL_MISMATCH",
      }, 409, corsHeaders);
    }

    const existingUserId = await findAuthUserIdByEmail(adminClient, email);
    if (action === "send" && existingUserId) {
      return jsonResponse({
        error: "Este e-mail ja possui uma conta. Use o fluxo seguro de vinculacao antes de ativar o acesso.",
        code: "ALREADY_REGISTERED_UNLINKED",
      }, 409, corsHeaders);
    }

    if (action === "resend" && !existingUserId) {
      return jsonResponse({ error: "Convite pendente nao encontrado para este e-mail." }, 409, corsHeaders);
    }

    const redirectTo = buildRedirectTo(req, env.redirectTo);
    if (!redirectTo) {
      return jsonResponse({ error: "Redirect de convite nao configurado." }, 500, corsHeaders);
    }

    if (action === "resend") {
      const { error: recoveryError } = await authEmailClient.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (recoveryError) {
        return jsonResponse(mapInviteError(recoveryError), statusForInviteError(recoveryError), corsHeaders);
      }

      const accessState = await persistResend(adminClient, alunoId, user.id, email);

      return jsonResponse({
        ok: true,
        action,
        redirectTo,
        access: accessState,
      }, 200, corsHeaders);
    }

    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo,
    });

    if (inviteError) {
      return jsonResponse(mapInviteError(inviteError), statusForInviteError(inviteError), corsHeaders);
    }

    let accessState;
    try {
      accessState = await persistNewInvite(userClient, alunoId, email);
    } catch (persistError) {
      const invitedUserId = String(inviteData?.user?.id || "");
      if (invitedUserId) {
        await adminClient.auth.admin.deleteUser(invitedUserId).catch((cleanupError) => {
          console.error("student-access-invite cleanup failed", cleanupError);
        });
      }
      throw persistError;
    }

    return jsonResponse({
      ok: true,
      action,
      redirectTo,
      access: accessState,
    }, 200, corsHeaders);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Nao foi possivel enviar o convite agora." }, 500, corsHeaders);
  }
});

async function persistNewInvite(
  userClient: ReturnType<typeof createClient>,
  alunoId: string,
  email: string,
) {
  const { data, error } = await userClient.rpc("manage_student_access", {
    p_aluno_id: alunoId,
    p_action: "invite",
    p_email: email,
    p_reason: null,
  });
  if (error) throw error;
  return data;
}

async function persistResend(
  adminClient: ReturnType<typeof createClient>,
  alunoId: string,
  professionalUserId: string,
  email: string,
) {
  const { data, error } = await adminClient
    .from("alunos")
    .update({
      student_access_email: email,
      student_access_invited_at: new Date().toISOString(),
      student_access_reason: "",
    })
    .eq("id", alunoId)
    .eq("user_id", professionalUserId)
    .eq("student_access_status", "invited")
    .is("student_user_id", null)
    .select("id,student_access_status,student_access_email,student_access_invited_at,student_access_activated_at,student_access_suspended_at,student_access_revoked_at,student_access_reason,student_user_id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("STUDENT_ACCESS_RESEND_STATE_CHANGED");

  return {
    alunoId: data.id,
    status: data.student_access_status,
    email: data.student_access_email || "",
    hasStudentUser: Boolean(data.student_user_id),
    invitedAt: data.student_access_invited_at,
    activatedAt: data.student_access_activated_at,
    suspendedAt: data.student_access_suspended_at,
    revokedAt: data.student_access_revoked_at,
    reason: data.student_access_reason || "",
  };
}

async function findAuthUserIdByEmail(
  adminClient: ReturnType<typeof createClient>,
  email: string,
) {
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const found = data.users.find((user) => normalizarEmail(user.email || "") === email);
    if (found) return found.id;
    if (data.users.length < perPage) return "";
    page += 1;
  }
}

function readEnv() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const redirectTo = Deno.env.get("STUDENT_INVITE_REDIRECT_TO") || "";

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return { ok: false as const, error: "Configuracao da funcao incompleta." };
  }

  return { ok: true as const, supabaseUrl, anonKey, serviceRoleKey, redirectTo };
}

async function verifyAuthenticatedUser(
  userClient: ReturnType<typeof createClient>,
  accessToken: string,
  supabaseUrl: string,
) {
  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser(accessToken);

  if (userError || !user) return { ok: false as const };

  const claims = decodeJwtPayload(accessToken);
  const expectedIssuer = `${supabaseUrl.replace(/\/$/, "")}/auth/v1`;
  if (claims?.iss !== expectedIssuer || claims?.aud !== "authenticated") {
    return { ok: false as const };
  }

  return { ok: true as const, user };
}

function extractBearerToken(authorization: string) {
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function decodeJwtPayload(accessToken: string) {
  try {
    const [, payload] = accessToken.split(".");
    if (!payload) return null;
    return JSON.parse(atob(base64UrlToBase64(payload))) as { iss?: string; aud?: string };
  } catch {
    return null;
  }
}

function base64UrlToBase64(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  return base64.padEnd(base64.length + ((4 - base64.length % 4) % 4), "=");
}

async function safeJson(req: Request): Promise<Payload | { error: string }> {
  try {
    return (await req.json()) as Payload;
  } catch {
    return { error: "JSON invalido." };
  }
}

function normalizeAction(action?: string) {
  const normalized = String(action || "send").trim().toLowerCase();
  if (["send", "resend"].includes(normalized)) return normalized;
  return "";
}

function buildRedirectTo(req: Request, configuredRedirect: string) {
  if (configuredRedirect) return configuredRedirect;
  const origin = allowedRequestOrigin(req);
  if (!origin) return "";
  return `${origin.replace(/\/$/, "")}/criar-senha`;
}

function mapInviteError(error: { message?: string; status?: number }) {
  const message = String(error.message || "");
  if (/rate|limit|too many/i.test(message)) {
    return { error: "Muitas tentativas de convite. Aguarde alguns instantes e tente novamente.", code: "RATE_LIMIT" };
  }
  return { error: "Nao foi possivel enviar o convite agora.", code: "INVITE_PROVIDER_ERROR" };
}

function statusForInviteError(error: { message?: string; status?: number }) {
  if (error.status && error.status >= 400 && error.status < 500) return error.status;
  if (/rate|limit|too many/i.test(String(error.message || ""))) return 429;
  return 502;
}

function buildCorsHeaders(req: Request) {
  const allowedOrigin = allowedRequestOrigin(req);

  return {
    ...defaultCorsHeaders,
    "Access-Control-Allow-Origin": allowedOrigin,
    "Vary": "Origin",
  };
}

function allowedRequestOrigin(req: Request) {
  const origin = req.headers.get("Origin") || "";
  return allowedInviteOrigins().includes(origin) ? origin : "";
}

function allowedInviteOrigins() {
  return [
    ...splitEnv("STUDENT_INVITE_ALLOWED_ORIGINS"),
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://www.aruka.com.br",
  ];
}

function splitEnv(name: string) {
  return String(Deno.env.get(name) || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function jsonResponse(body: Record<string, unknown>, status = 200, headers = defaultCorsHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

function normalizarEmail(email: string) {
  return String(email || "").trim().toLowerCase();
}

function emailValido(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function uuidValido(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
