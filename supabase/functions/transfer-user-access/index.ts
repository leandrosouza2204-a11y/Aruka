import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type TransferPayload = {
  userId?: string;
  novoEmail?: string;
  newEmail?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Método não permitido." }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return jsonResponse({ error: "Configuração da função incompleta." }, 500);
    }

    const authorization = req.headers.get("Authorization") || "";
    const userAgent = req.headers.get("User-Agent") || "";

    if (!authorization.toLowerCase().startsWith("bearer ")) {
      return jsonResponse({ error: "Sessão não informada." }, 401);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const {
      data: { user: adminUser },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !adminUser) {
      return jsonResponse({ error: "Sessão inválida." }, 401);
    }

    const { data: perfilAdmin, error: perfilError } = await userClient
      .from("perfis")
      .select("role,tipo_acesso,status,email,nome")
      .eq("user_id", adminUser.id)
      .maybeSingle();

    if (perfilError) throw perfilError;

    const ehAdmin =
      perfilAdmin?.status === "ativo" &&
      (perfilAdmin?.role === "admin" || perfilAdmin?.tipo_acesso === "admin");

    if (!ehAdmin) {
      return jsonResponse({ error: "Acesso negado." }, 403);
    }

    const body = (await req.json()) as TransferPayload;
    const userId = String(body.userId || "").trim();
    const novoEmail = normalizarEmail(body.novoEmail || body.newEmail || "");

    if (!userId) {
      return jsonResponse({ error: "Usuário alvo obrigatório." }, 400);
    }

    if (!emailValido(novoEmail)) {
      return jsonResponse({ error: "Informe um novo e-mail válido." }, 400);
    }

    const { data: targetUserResult, error: targetError } =
      await adminClient.auth.admin.getUserById(userId);

    if (targetError || !targetUserResult?.user) {
      return jsonResponse({ error: "Usuário alvo não encontrado." }, 404);
    }

    const emailAntigo = normalizarEmail(targetUserResult.user.email || "");

    if (novoEmail === emailAntigo) {
      return jsonResponse(
        { error: "O novo e-mail precisa ser diferente do e-mail atual." },
        400
      );
    }

    const emailJaExiste = await verificarEmailExistente(adminClient, novoEmail, userId);

    if (emailJaExiste) {
      return jsonResponse({ error: "Este e-mail já está em uso por outra conta." }, 409);
    }

    const dadosAnteriores = {
      user_id: userId,
      email: emailAntigo,
      perfil_email: null,
    };

    const { data: perfilAnterior } = await adminClient
      .from("perfis")
      .select("id,email,nome,role,tipo_acesso,status")
      .eq("user_id", userId)
      .maybeSingle();

    dadosAnteriores.perfil_email = perfilAnterior?.email || null;

    const { error: updateAuthError } = await adminClient.auth.admin.updateUserById(
      userId,
      {
        email: novoEmail,
        email_confirm: true,
      }
    );

    if (updateAuthError) throw updateAuthError;

    const { data: perfilAtualizado, error: perfilUpdateError } = await adminClient
      .from("perfis")
      .update({ email: novoEmail })
      .eq("user_id", userId)
      .select("id,email,nome,role,tipo_acesso,status")
      .maybeSingle();

    if (perfilUpdateError) throw perfilUpdateError;

    await adminClient.from("admin_logs").insert({
      admin_user_id: adminUser.id,
      target_user_id: userId,
      acao: "transfer_access",
      entidade: "auth.users/perfis",
      entidade_id: perfilAtualizado?.id || perfilAnterior?.id || null,
      dados_anteriores: {
        ...dadosAnteriores,
        perfil: perfilAnterior,
      },
      dados_novos: {
        user_id: userId,
        email: novoEmail,
        perfil: perfilAtualizado,
      },
      user_agent: userAgent,
    });

    return jsonResponse({
      ok: true,
      userId,
      emailAntigo,
      novoEmail,
      mensagem:
        "Acesso transferido com sucesso. O usuário deverá acessar usando o novo e-mail.",
    });
  } catch (error) {
    console.error(error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Erro ao transferir acesso." },
      500
    );
  }
});

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function normalizarEmail(email: string) {
  return String(email || "").trim().toLowerCase();
}

function emailValido(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function verificarEmailExistente(
  adminClient: ReturnType<typeof createClient>,
  email: string,
  userIdIgnorado: string
) {
  const { data: perfilExistente, error: perfilError } = await adminClient
    .from("perfis")
    .select("user_id")
    .ilike("email", email)
    .neq("user_id", userIdIgnorado)
    .maybeSingle();

  if (perfilError) throw perfilError;
  if (perfilExistente) return true;

  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) throw error;

    const usuario = data.users.find(
      (item) => normalizarEmail(item.email || "") === email && item.id !== userIdIgnorado
    );

    if (usuario) return true;
    if (data.users.length < perPage) return false;

    page += 1;
  }
}
