import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";
import { queryJson, runPsql } from "./supabase-cycle-8-lib.mjs";

const PROFESSIONAL_EMAIL = "qa.local@aruka.test";
const STUDENT_EMAIL = "student.qa.local@aruka.test";
const APP_ROUTE = "/minha-area";
const cdpPort = String(9400 + Math.floor(Math.random() * 400));

loadQaEnvFile(".env.local");
loadQaEnvFile(".env.qa.local");

const runtime = readLocalSupabaseRuntime();
const qa = validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });
const studentPassword = `LocalQa-${randomBytes(18).toString("base64url")}a1!`;

let devServer;
let chrome;

try {
  const fixture = await provisionStudentFixture();
  await assertRpcIdentity(fixture.studentUserId);
  await ensureFrontend(qa.baseUrl);
  chrome = await startChrome();

  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");

    const results = {};
    for (const viewport of [
      { name: "MOBILE_360", width: 360, height: 920, mobile: true },
      { name: "MOBILE_390", width: 390, height: 920, mobile: true },
      { name: "MOBILE_430", width: 430, height: 920, mobile: true },
      { name: "DESKTOP_1366", width: 1366, height: 900, mobile: false },
      { name: "DESKTOP_1440", width: 1440, height: 900, mobile: false },
    ]) {
      results[viewport.name] = await validateViewport(client, viewport);
    }

    assert(Object.values(results).every((item) => item.status === "PASS"), "VIEWPORT_RUNTIME_FAILED");
    console.log("STUDENT_DAILY_EXPERIENCE_RUNTIME=PASS");
    console.log(`PROFESSIONAL_AUTH_EMAIL=${PROFESSIONAL_EMAIL}`);
    console.log(`STUDENT_AUTH_EMAIL=${STUDENT_EMAIL}`);
    console.log("STUDENT_AUTH_SESSION_PRESENT=YES");
    console.log("STUDENT_IDENTITY_RESOLVED=YES");
    console.log("FIRST_POST_LOGIN_URL=/minha-area");
    console.log("PROFILE_NOT_FOUND_VISIBLE=NO");
    console.log("PERSISTED=LOCAL_FIXTURE_ONLY");
    for (const [name, result] of Object.entries(results)) console.log(`${name}=${result.status}`);
    console.log(JSON.stringify({
      runtime_model: "REAL_BROWSER_STUDENT_AUTH_SESSION",
      route: APP_ROUTE,
      production_accessed: false,
      production_mutation: false,
      db_push: false,
      professional_fixture_preserved: true,
      student_auth_email: STUDENT_EMAIL,
      student_identity_resolved: true,
      profile_not_found_visible: false,
      fixture: {
        professional_user_id_present: Boolean(fixture.professionalUserId),
        student_user_id_present: Boolean(fixture.studentUserId),
        aluno_id_present: Boolean(fixture.alunoId),
        active_workouts: fixture.activeWorkouts,
        completed_workouts: fixture.completedWorkouts,
      },
      viewports: results,
    }, null, 2));
  } finally {
    client.close();
  }
} finally {
  if (chrome) chrome.kill();
  if (devServer) devServer.kill();
}

async function provisionStudentFixture() {
  const supabase = createClient(runtime.apiUrl, runtime.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const professional = await getAuthUserByEmail(supabase, PROFESSIONAL_EMAIL);
  assert(professional?.id, "PROFESSIONAL_QA_AUTH_USER_NOT_FOUND");

  const existingStudent = await getAuthUserByEmail(supabase, STUDENT_EMAIL);
  const student = existingStudent
    ? await updateAuthUserPassword(supabase, existingStudent.id)
    : await createAuthStudentUser(supabase);

  const sql = `
begin;

with ids as (
  select
    '${professional.id}'::uuid as professional_user_id,
    '${student.id}'::uuid as student_user_id
),
professional_profile as (
  update public.perfis p
  set email = '${PROFESSIONAL_EMAIL}',
      role = 'user',
      tipo_acesso = 'assinante',
      status = 'ativo'
  from ids
  where p.user_id = ids.professional_user_id
  returning user_id
),
professional_profile_insert as (
  insert into public.perfis (user_id, nome, email, role, tipo_acesso, status)
  select professional_user_id, 'QA Local Aruka', '${PROFESSIONAL_EMAIL}', 'user', 'assinante', 'ativo'
  from ids
  where not exists (select 1 from professional_profile)
  returning user_id
),
student_profile as (
  update public.perfis p
  set nome = 'Student QA Local Aruka',
      email = '${STUDENT_EMAIL}',
      role = 'student',
      tipo_acesso = 'pendente',
      status = 'ativo'
  from ids
  where p.user_id = ids.student_user_id
  returning user_id
),
student_profile_insert as (
  insert into public.perfis (user_id, nome, email, role, tipo_acesso, status)
  select student_user_id, 'Student QA Local Aruka', '${STUDENT_EMAIL}', 'student', 'pendente', 'ativo'
  from ids
  where not exists (select 1 from student_profile)
  returning user_id
),
student_row_update as (
  update public.alunos a
  set user_id = ids.professional_user_id,
      nome = 'Student QA Daily Experience',
      whatsapp = '11990001991',
      status = 'Ativo',
      pagamento_recebido = true,
      student_access_status = 'active',
      student_access_email = '${STUDENT_EMAIL}',
      student_access_activated_at = coalesce(a.student_access_activated_at, now()),
      observacoes = 'Canonical local student QA fixture'
  from ids
  where a.student_user_id = ids.student_user_id
  returning a.id, a.user_id, a.student_user_id
),
student_row as (
  insert into public.alunos (
    user_id, student_user_id, nome, whatsapp, nascimento, inicio, vencimento,
    aviso7, aviso1, plano, valor, status, pagamento_recebido, observacoes,
    student_access_status, student_access_email, student_access_activated_at
  )
  select professional_user_id, student_user_id, 'Student QA Daily Experience', '11990001991',
    '1995-01-01'::date, current_date - 40, current_date + 80,
    current_date + 73, current_date + 79, 'LOCAL_QA_STUDENT', 0, 'Ativo', true,
    'Canonical local student QA fixture',
    'active', '${STUDENT_EMAIL}', now()
  from ids
  where not exists (select 1 from student_row_update)
  returning id, user_id, student_user_id
),
student_row_resolved as (
  select * from student_row_update
  union all
  select * from student_row
),
other_student as (
  insert into public.alunos (
    user_id, nome, whatsapp, nascimento, inicio, vencimento, aviso7, aviso1,
    plano, valor, status, pagamento_recebido, observacoes
  )
  select professional_user_id, 'Student QA Isolation Control', '11990001992',
    '1994-01-01'::date, current_date - 30, current_date + 60,
    current_date + 53, current_date + 59, 'LOCAL_QA_STUDENT', 0, 'Ativo', true,
    'Canonical local isolation control fixture'
  from ids
  on conflict do nothing
  returning id, user_id
),
upsert_active as (
  insert into public.treinos (
    user_id, aluno_id, nome_rotina, objetivo, nivel, dias_semana, observacoes, status,
    lifecycle_status, delivered_by, delivered_at, data_inicio, data_revisao, application_idempotency_key
  )
  select user_id, id, 'Ficha atual QA Student', 'Forca', 'Intermediario', 3,
    'Prescricao atual visivel para aluno', 'Ativo', 'active', user_id, now() - interval '3 days',
    current_date - 3, current_date + 25, 'cycle-04-student-daily-active'
  from student_row_resolved
  on conflict (user_id, application_idempotency_key) where application_idempotency_key is not null
  do update set
    aluno_id = excluded.aluno_id,
    nome_rotina = excluded.nome_rotina,
    lifecycle_status = excluded.lifecycle_status,
    delivered_at = excluded.delivered_at,
    completed_at = null,
    archived_at = null
  returning id, aluno_id, user_id
),
upsert_completed as (
  insert into public.treinos (
    user_id, aluno_id, nome_rotina, objetivo, nivel, dias_semana, observacoes, status,
    lifecycle_status, delivered_by, delivered_at, completed_at, data_inicio, data_revisao, application_idempotency_key
  )
  select user_id, id, 'Ficha anterior QA Student', 'Hipertrofia', 'Intermediario', 3,
    'Prescricao anterior visivel apenas no historico', 'Finalizado', 'completed', user_id,
    now() - interval '35 days', now() - interval '8 days', current_date - 35, current_date - 8,
    'cycle-04-student-daily-completed'
  from student_row_resolved
  on conflict (user_id, application_idempotency_key) where application_idempotency_key is not null
  do update set
    aluno_id = excluded.aluno_id,
    nome_rotina = excluded.nome_rotina,
    lifecycle_status = excluded.lifecycle_status,
    completed_at = excluded.completed_at,
    archived_at = null
  returning id, aluno_id, user_id
),
delete_days as (
  delete from public.treino_dias d
  using (
    select id from upsert_active
    union all
    select id from upsert_completed
  ) t
  where d.treino_id = t.id
  returning d.id
),
insert_days as (
  insert into public.treino_dias (treino_id, nome, grupo_muscular, ordem)
  select id, 'Dia A', 'Peito e costas', 1 from upsert_active
  union all
  select id, 'Dia B', 'Pernas', 2 from upsert_active
  union all
  select id, 'Dia A', 'Full body', 1 from upsert_completed
  returning id, treino_id, nome
)
insert into public.treino_exercicios (treino_dia_id, nome, series, repeticoes, carga, descanso, observacoes, ordem)
select id, 'Supino reto', '3', '10', '24 kg', '90s', 'Executar com controle', 1
from insert_days
where nome = 'Dia A'
union all
select id, 'Agachamento livre', '4', '8', '32 kg', '120s', 'Manter amplitude segura', 1
from insert_days
where nome = 'Dia B';

commit;
`;
  runPsql(process.cwd(), sql);

  const [fixture] = queryJson(process.cwd(), `
    select
      p.id as professional_user_id,
      s.id as student_user_id,
      a.id as aluno_id,
      (select count(*)::int from public.treinos t where t.aluno_id = a.id and t.lifecycle_status = 'active') as active_workouts,
      (select count(*)::int from public.treinos t where t.aluno_id = a.id and t.lifecycle_status = 'completed') as completed_workouts
    from auth.users p
    join auth.users s on lower(s.email) = lower('${STUDENT_EMAIL}')
    join public.alunos a on a.student_user_id = s.id
    where lower(p.email) = lower('${PROFESSIONAL_EMAIL}')
    limit 1
  `);
  assert(fixture?.active_workouts > 0, "ACTIVE_WORKOUT_FIXTURE_MISSING");
  assert(fixture?.completed_workouts > 0, "COMPLETED_WORKOUT_FIXTURE_MISSING");

  return {
    professionalUserId: fixture.professional_user_id,
    studentUserId: fixture.student_user_id,
    alunoId: fixture.aluno_id,
    activeWorkouts: fixture.active_workouts,
    completedWorkouts: fixture.completed_workouts,
  };
}

async function getAuthUserByEmail(supabase, email) {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;
  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase()) || null;
}

async function createAuthStudentUser(supabase) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: STUDENT_EMAIL,
    password: studentPassword,
    email_confirm: true,
    user_metadata: { fixture: "cycle-04-student-daily-experience" },
  });
  if (error) throw error;
  return data.user;
}

async function updateAuthUserPassword(supabase, userId) {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    password: studentPassword,
    email_confirm: true,
    user_metadata: { fixture: "cycle-04-student-daily-experience" },
  });
  if (error) throw error;
  return data.user;
}

async function assertRpcIdentity(studentUserId) {
  const supabase = createClient(runtime.apiUrl, runtime.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
    email: STUDENT_EMAIL,
    password: studentPassword,
  });
  if (loginError) throw loginError;
  assert(session.user?.id === studentUserId, "STUDENT_AUTH_USER_MISMATCH");
  const { data, error } = await supabase.rpc("get_my_student_workouts");
  if (error) throw error;
  assert(data?.student?.id, "STUDENT_IDENTITY_NOT_RESOLVED_BY_RPC");
  assert(Array.isArray(data?.activeWorkouts) && data.activeWorkouts.length > 0, "RPC_ACTIVE_WORKOUT_MISSING");
  assert(Array.isArray(data?.completedWorkouts) && data.completedWorkouts.length > 0, "RPC_HISTORY_MISSING");
  await supabase.auth.signOut();
}

async function validateViewport(client, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
  await client.send("Page.navigate", { url: `${qa.baseUrl}/login` });
  await waitFor(client, "document.readyState !== 'loading'");
  await clearStorage(client);
  await client.send("Page.navigate", { url: `${qa.baseUrl}/login` });
  await waitFor(client, "document.readyState !== 'loading'");
  await waitFor(
    client,
    "document.querySelector('input[type=\"email\"], input[name=\"email\"], #email') && document.querySelector('input[type=\"password\"], input[name=\"password\"], #password')",
    20000,
  );
  await fillAndSubmitLogin(client, STUDENT_EMAIL, studentPassword);
  await waitFor(client, "!location.pathname.includes('/login')", 20000);
  const firstPostLoginPath = await evaluate(client, "location.pathname");
  assert(firstPostLoginPath === APP_ROUTE, `FIRST_POST_LOGIN_URL=${firstPostLoginPath}`);
  await client.send("Page.navigate", { url: `${qa.baseUrl}${APP_ROUTE}` });
  await waitFor(client, "document.readyState !== 'loading'");
  await waitFor(client, "document.querySelector('[data-testid=\"student-daily-page\"]')", 20000);
  await waitFor(client, "!document.querySelector('[data-testid=\"student-daily-loading\"]')", 30000);

  await evaluate(client, `(() => {
    document.querySelector('[data-testid="student-daily-view-workout"]')?.click?.();
    return true;
  })()`);
  await waitFor(client, "document.querySelector('[data-testid=\"student-daily-workout-days\"]')", 10000);

  const state = await evaluate(client, `(() => {
    const text = document.body.innerText || "";
    const visible = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };
    return {
      path: location.pathname,
      text,
      page: visible('[data-testid="student-daily-page"]'),
      activeWorkout: visible('[data-testid="student-daily-active-workout"]'),
      nextAction: visible('[data-testid="student-daily-next-action"]'),
      history: visible('[data-testid="student-daily-history"]'),
      workoutDaysAfterOpen: Boolean(document.querySelector('[data-testid="student-daily-workout-days"]')),
      profileNotFound: /Perfil de aluno n[aã]o encontrado/i.test(text),
      ownActive: /Ficha atual QA Student/i.test(text),
      ownHistory: /Ficha anterior QA Student/i.test(text),
      otherStudentHistory: /Student QA Isolation Control/i.test(text),
      technicalMetadata: /auth\\.uid|student_user_id|aluno_id|rpc|uuid|sqlstate|constraint|service_role/i.test(text),
      executionClaim: /voc[eê] realizou|voc[eê] treinou|desempenho melhorou|performance real|ader[eê]ncia/i.test(text),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    };
  })()`);

  const failures = [];
  if (state.path !== APP_ROUTE) failures.push("ROUTE_NOT_STUDENT_AREA");
  if (!state.page) failures.push("STUDENT_DAILY_PAGE_MISSING");
  if (!state.activeWorkout || !state.ownActive) failures.push("ACTIVE_WORKOUT_VISIBLE_NO");
  if (!state.nextAction) failures.push("NEXT_ACTION_VISIBLE_NO");
  if (!state.history || !state.ownHistory) failures.push("OWN_HISTORY_VISIBLE_NO");
  if (!state.workoutDaysAfterOpen) failures.push("CURRENT_WORKOUT_OPEN_FAILED");
  if (state.profileNotFound) failures.push("PROFILE_NOT_FOUND_VISIBLE");
  if (state.otherStudentHistory) failures.push("OTHER_STUDENT_HISTORY_VISIBLE");
  if (state.technicalMetadata) failures.push("TECHNICAL_METADATA_VISIBLE");
  if (state.executionClaim) failures.push("EXECUTION_CLAIM_VISIBLE");
  if (state.overflow) failures.push("HORIZONTAL_OVERFLOW_VISIBLE");

  if (failures.length) {
    const excerpt = String(state.text || "").replace(/\s+/g, " ").slice(0, 500);
    throw new Error(`${viewport.name}: ${failures.join(", ")}. Visible text: ${excerpt}`);
  }
  return {
    status: "PASS",
    width: viewport.width,
    first_post_login_url: firstPostLoginPath,
    student_daily_experience_visible: true,
    active_workout_visible: true,
    next_action_visible: true,
    own_history_visible: true,
    profile_not_found_visible: false,
    other_student_history_visible: false,
    technical_metadata_visible: false,
  };
}

async function ensureFrontend(url) {
  if (await responds(url)) return;
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  devServer = spawn(npm, ["run", "dev", "--", "--host", "127.0.0.1"], {
    stdio: "ignore",
    shell: process.platform === "win32",
    env: { ...process.env },
  });
  const started = Date.now();
  while (Date.now() - started < 45000) {
    if (await responds(url)) return;
    await sleep(500);
  }
  throw new Error("Frontend local nao respondeu em tempo habil.");
}

async function responds(url) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function startChrome() {
  const chromePath = process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "google-chrome";
  const userDataDir = `${process.env.TEMP || "."}\\aruka-student-daily-${process.pid}`;
  const child = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${cdpPort}`,
    "about:blank",
  ], { stdio: "ignore", shell: false });
  const started = Date.now();
  while (Date.now() - started < 15000) {
    try {
      const response = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
      if (response.ok) return child;
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Chrome CDP nao iniciou.");
}

async function getWebSocketUrl() {
  const targetResponse = await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`, { method: "PUT" });
  if (targetResponse.ok) return (await targetResponse.json()).webSocketDebuggerUrl;
  const versionResponse = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
  return (await versionResponse.json()).webSocketDebuggerUrl;
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 1;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { method, resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(`${method}: ${message.error.message}`));
    else resolve(message.result);
  });
  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    send(method, params = {}) {
      const id = nextId++;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { method, resolve, reject }));
    },
    close() {
      socket.close();
    },
  };
}

async function clearStorage(client) {
  await evaluate(client, `(() => {
    localStorage.clear();
    sessionStorage.clear();
    return true;
  })()`);
}

async function fillAndSubmitLogin(client, emailValue, passwordValue) {
  const ok = await evaluate(client, `(() => {
    const email = document.querySelector('input[type="email"], input[name="email"], #email');
    const password = document.querySelector('input[type="password"], input[name="password"], #password');
    if (!email || !password) return false;
    const setValue = (input, value) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    setValue(email, ${JSON.stringify(emailValue)});
    setValue(password, ${JSON.stringify(passwordValue)});
    document.querySelector('button[type="submit"]')?.click?.();
    return true;
  })()`);
  if (!ok) throw new Error("Campos de login do aluno QA nao encontrados.");
}

async function waitFor(client, expression, timeout = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(client, `Boolean(${expression})`)) return;
    await sleep(300);
  }
  throw new Error(`Timeout aguardando: ${expression}`);
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Erro ao avaliar expressao.");
  return result.result.value;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
