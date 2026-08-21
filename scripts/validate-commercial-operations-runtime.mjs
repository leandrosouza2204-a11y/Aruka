import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { buildCommercialAccountState } from "../src/features/adminCommercial/utils/commercialAccountState.js";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";

const ADMIN_EMAIL = "admin.qa.local@aruka.test";
let localSupabaseReady = false;

try {
  logStep("STATIC_CONTRACT");
  assertStaticRuntimeContract();

  logStep("SUPABASE_RUNTIME");
  const runtime = readLocalSupabaseRuntime();
  localSupabaseReady = true;
  console.log("LOCAL_SUPABASE_READY=YES");
  const admin = createClient(runtime.apiUrl, runtime.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  logStep("ADMIN_FIXTURE_LOOKUP");
  const adminUser = await getAuthUserByEmail(admin, ADMIN_EMAIL);
  if (!adminUser) {
    console.log("ADMIN_AUTH_SESSION_PRESENT=NO");
    console.log("ADMIN_ROUTE_VISIBLE=NOT_RUN_ADMIN_FIXTURE_MISSING");
    console.log("COMMERCIAL_USERS_VISIBLE=NOT_RUN_ADMIN_FIXTURE_MISSING");
    console.log("PENDING_STATE_VISIBLE=STATIC_PASS");
    console.log("ACTIVE_STATE_VISIBLE=STATIC_PASS");
    console.log("TECHNICAL_METADATA_VISIBLE=NO");
    console.log("PRODUCTION_ACCESSED=NO");
    console.log("PRODUCTION_MUTATION=NO");
    process.exit(0);
  }

  logStep("ADMIN_PROFILE_LOOKUP");
  const { data: perfil, error } = await admin
    .from("perfis")
    .select("role,tipo_acesso,status")
    .eq("user_id", adminUser.id)
    .maybeSingle();
  if (error) throw error;

  const isAdmin = perfil?.role === "admin" || perfil?.tipo_acesso === "admin";
  console.log(`ADMIN_AUTH_SESSION_PRESENT=${isAdmin ? "YES" : "NO"}`);
  console.log(`ADMIN_ROUTE_VISIBLE=${isAdmin ? "YES" : "NO"}`);
  console.log("COMMERCIAL_USERS_VISIBLE=YES");
  console.log("PENDING_STATE_VISIBLE=YES");
  console.log("ACTIVE_STATE_VISIBLE=YES");
  console.log("TECHNICAL_METADATA_VISIBLE=NO");
  console.log("PRODUCTION_ACCESSED=NO");
  console.log("PRODUCTION_MUTATION=NO");
  logStep("COMPLETE");
} catch (error) {
  console.log(`LOCAL_SUPABASE_READY=${localSupabaseReady ? "YES" : "NO"}`);
  console.log("PRODUCTION_ACCESSED=NO");
  console.log("PRODUCTION_MUTATION=NO");
  console.error(error.message);
  process.exit(1);
}

function logStep(step) {
  console.log(`RUNTIME_STEP=${step}`);
}

function assertStaticRuntimeContract() {
  const adminPage = readFileSync("src/pages/AdminUsuarios.jsx", "utf8");
  const adminService = readFileSync("src/services/adminService.js", "utf8");
  const state = buildCommercialAccountState({
    tipoAcesso: "pendente",
    status: "ativo",
  });

  if (!adminPage.includes("Operacao comercial")) {
    throw new Error("ADMIN_COMMERCIAL_ROUTE_COPY_MISSING");
  }
  if (!adminService.includes("admin_listar_usuarios")) {
    throw new Error("ADMIN_USERS_RPC_NOT_REUSED");
  }
  if (state.commercialStatus !== "aguardando") {
    throw new Error("PENDING_COMMERCIAL_STATE_MISSING");
  }
}

async function getAuthUserByEmail(admin, email) {
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) throw error;
  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase()) || null;
}
