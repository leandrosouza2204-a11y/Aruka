import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const migration = read("supabase/migrations/20260921010053_cycle12_profile_secondary_flows.sql");
const app = read("src/App.jsx");
const sidebar = read("src/components/Sidebar.jsx");
const mobile = read("src/components/MobileBottomNavigation.jsx");
const professionalScreen = read("src/features/contactSettings/ProfessionalContactSettings.jsx");
const studentScreen = read("src/features/studentExperienceV2/profile/StudentProfileV2.jsx");
const studentService = read("src/services/studentProfileV2Service.js");
const logoutService = read("src/services/logoutService.js");
const shell = read("src/features/studentExperienceV2/layout/StudentShell.jsx");
const autoLogout = read("src/hooks/useAutoLogout.js");
const profileRequest = read("src/services/studentProfileRequestContract.js");
const flag = read("src/features/studentExperienceV2/config/studentExperienceV2Config.js");

const checks = [
  ["professional route and direct desktop/mobile navigation are registered", /path="\/contato-alunos"/.test(app) && /ProfessionalRoute/.test(app) && /Contato com alunos/.test(sidebar) && /Contato com alunos/.test(mobile)],
  ["only the profile placeholder is replaced", /path="perfil" element={<StudentProfileV2 \/>}/.test(app) && /path="evolucao" element={<StudentEvolutionV2 \/>}/.test(app)],
  ["rollout remains explicit and off by default", /String\(configuredValue \|\| ""\)[\s\S]*=== "true"/.test(flag)],
  ["dedicated settings table starts disabled and has RLS", /create table if not exists public\.professional_contact_settings/.test(migration) && (migration.match(/enabled boolean not null default false/g) || []).length === 2 && /enable row level security/.test(migration)],
  ["table grants are denied and RPC execute is authenticated only", /revoke all on table public\.professional_contact_settings from public, anon, authenticated/.test(migration) && (migration.match(/revoke all on function/g) || []).length === 3 && (migration.match(/grant execute on function/g) || []).length === 3],
  ["RPCs derive identity without caller-selected professional or student ids", (migration.match(/v_user_id uuid := auth\.uid\(\)/g) || []).length === 3 && !/create or replace function public\.(?:get_my|save_my)[^(]*\([^)]*(?:student|professional).*id/i.test(migration)],
  ["definer functions pin an empty search path", (migration.match(/security definer\s+set search_path = ''/gi) || []).length === 3],
  ["student contract requires active access and returns a minimized payload", /student_access_status <> 'active'/.test(migration) && /'student'.*'name'/s.test(migration) && /'professional'.*'whatsappNumber'.*'contactEmail'/s.test(migration) && !/'role'|'tipoAcesso'|'assinatura'|'financeiro'/.test(migration.match(/create or replace function public\.get_my_student_profile_v2[\s\S]*/)?.[0] || "")],
  ["disabled channels and inactive-professional contacts are removed server-side", /when v_settings\.whatsapp_enabled/.test(migration) && /when v_settings\.email_enabled/.test(migration) && /join public\.perfis p[\s\S]*p\.status = 'ativo'[\s\S]*s\.professional_user_id = v_aluno\.user_id/.test(migration)],
  ["professional form includes loading, retry, validation, save lock and accessible feedback", /status === "loading"/.test(professionalScreen) && /Tentar novamente/.test(professionalScreen) && /validateContactSettings/.test(professionalScreen) && /status === "saving"/.test(professionalScreen) && /aria-live="polite"/.test(professionalScreen)],
  ["student profile includes own account email, both contact actions, empty state, retry and logout", /user\.email/.test(studentService) && /Conversar pelo WhatsApp/.test(studentScreen) && /Enviar e-mail/.test(studentScreen) && /ainda não disponibilizou/.test(studentScreen) && /Tentar novamente/.test(studentScreen) && /Sair da conta/.test(studentScreen)],
  ["logout only navigates after confirmed signOut and handles returned errors", /result\?\.error/.test(read("src/services/logoutContract.js")) && /await completeLogout/.test(logoutService) && !/finally\s*\{\s*navigate/.test(shell + studentScreen + sidebar + mobile + autoLogout)],
  ["profile invalidates stale requests and verifies the authenticated identity", /onAuthStateChange/.test(studentScreen) && /requestGuard(?:Ref\.current)?\.invalidate/.test(studentScreen) && /currentUser\.id !== initialUser\.id/.test(profileRequest)],
  ["contact links add no automatic message subject or body", !/[?&](?:text|subject|body)=/i.test(studentScreen + read("src/features/studentExperienceV2/domain/studentProfileV2.js"))],
];

let failed = false;
for (const [label, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${label}`);
  if (!pass) failed = true;
}
assert.equal(failed, false, "Cycle 12.10 static contract failed");
