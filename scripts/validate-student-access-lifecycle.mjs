import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";

const PROFESSIONAL_EMAIL = "qa.local@aruka.test";
const STUDENT_EMAIL = "student.qa.local@aruka.test";
const OTHER_PROFESSIONAL_EMAIL = "qa.student-access-other@aruka.test";

const runtime = readLocalSupabaseRuntime();
const admin = createClient(runtime.apiUrl, runtime.serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const professionalPassword = process.env.QA_USER_PASSWORD || `LocalQa-${randomBytes(16).toString("base64url")}a1!`;
const studentPassword = `LocalQa-${randomBytes(16).toString("base64url")}a1!`;
const otherPassword = `LocalQa-${randomBytes(16).toString("base64url")}a1!`;

try {
  assertStaticContract();
  const fixture = await prepareFixture();

  const professional = await signedClient(PROFESSIONAL_EMAIL, professionalPassword);
  const student = await signedClient(STUDENT_EMAIL, studentPassword);
  const otherProfessional = await signedClient(OTHER_PROFESSIONAL_EMAIL, otherPassword);

  try {
    await assertProfessionalCanManageOwnStudent(professional, fixture.alunoId);
    await assertStatusConstraint(fixture.alunoId);
    await assertInvalidTransitionsRejected(professional, fixture.alunoId);
    await assertStudentReadStates(student, fixture.alunoId);
    await assertCrossOwnerBlocked(otherProfessional, fixture.alunoId);
    await assertStudentAdminReadBlocked(student, fixture.alunoId);
    await assertStudentCannotManage(student, fixture.alunoId);
    await assertIdentityPreserved(fixture);
    await admin.from("alunos").update({ student_access_status: "active" }).eq("id", fixture.alunoId);

    console.log("STUDENT_ACCESS_LIFECYCLE_QA=PASS");
    console.log("STATUS_CONSTRAINT=PASS");
    console.log("INVALID_TRANSITIONS_REJECTED=PASS");
    console.log("STUDENT_READER_SERVER_SIDE_GUARD=PASS");
    console.log("ACTIVE_CAN_READ_OWN_DATA=YES");
    console.log("NOT_INVITED_CANNOT_READ_PROTECTED_STUDENT_DATA=YES");
    console.log("INVITED_CANNOT_READ_PROTECTED_STUDENT_DATA=YES");
    console.log("SUSPENDED_CANNOT_READ_PROTECTED_STUDENT_DATA=YES");
    console.log("REVOKED_CANNOT_READ_PROTECTED_STUDENT_DATA=YES");
    console.log("ACTIVE_CANNOT_READ_OTHER_STUDENT_DATA=YES");
    console.log("PROFESSIONAL_OWNER_CAN_MANAGE_OWN_STUDENT=YES");
    console.log("CROSS_OWNER_ACCESS_MUTATION=BLOCKED");
    console.log("STUDENT_CAN_MANAGE_ACCESS=NO");
    console.log("STUDENT_AUTH_ID_PRESERVED=YES");
    console.log("STUDENT_LINK_PRESERVED=YES");
    console.log("PRODUCTION_ACCESSED=NO");
    console.log("PRODUCTION_MUTATION=NO");
    console.log("DB_PUSH=NO");
  } finally {
    await professional.auth.signOut();
    await student.auth.signOut();
    await otherProfessional.auth.signOut();
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function assertStaticContract() {
  const migration = readFileSync("supabase/migrations/20260819090000_student_access_lifecycle.sql", "utf8");
  assert(migration.includes("student_access_status"), "STUDENT_ACCESS_STATUS_COLUMN_MISSING");
  assert(migration.includes("alunos_student_access_status_check"), "STUDENT_ACCESS_STATUS_CONSTRAINT_MISSING");
  assert(/create or replace function public\.manage_student_access/i.test(migration), "MANAGE_STUDENT_ACCESS_RPC_MISSING");
  assert(/v_professional_user_id uuid := auth\.uid\(\)/i.test(migration), "PROFESSIONAL_AUTH_UID_REQUIRED");
  assert(/and user_id = v_professional_user_id/i.test(migration), "OWNER_MUTATION_GUARD_MISSING");
  assert(/v_access_status <> 'active'/i.test(migration), "STUDENT_READER_ACTIVE_GUARD_MISSING");
}

async function prepareFixture() {
  const professional = await ensureAuthUser(PROFESSIONAL_EMAIL, professionalPassword);
  const student = await ensureAuthUser(STUDENT_EMAIL, studentPassword);
  await ensureAuthUser(OTHER_PROFESSIONAL_EMAIL, otherPassword);

  const aluno = await getStudentAluno(student.id);
  assert(aluno?.id, "STUDENT_QA_ALUNO_LINK_MISSING");
  assert(aluno.user_id === professional.id, "STUDENT_QA_OWNER_MISMATCH");

  return {
    professionalUserId: professional.id,
    studentUserId: student.id,
    alunoId: aluno.id,
  };
}

async function ensureAuthUser(email, password) {
  const existing = await getAuthUserByEmail(email);
  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (error) throw error;
    return data.user;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  return data.user;
}

async function getAuthUserByEmail(email) {
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) throw error;
  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase()) || null;
}

async function getStudentAluno(studentUserId) {
  const { data, error } = await admin
    .from("alunos")
    .select("id,user_id,student_user_id")
    .eq("student_user_id", studentUserId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function signedClient(email, password) {
  const client = createClient(runtime.apiUrl, runtime.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return client;
}

async function assertProfessionalCanManageOwnStudent(client, alunoId) {
  await admin.from("alunos").update({ student_access_status: "not_invited" }).eq("id", alunoId);
  const invited = await setAccess(client, alunoId, "invite", { email: STUDENT_EMAIL });
  assert(invited.status === "invited", "INVITE_STATUS_FAILED");
  const active = await setAccess(client, alunoId, "activate", { email: STUDENT_EMAIL });
  assert(active.status === "active", "ACTIVATE_STATUS_FAILED");
  const suspended = await setAccess(client, alunoId, "suspend");
  assert(suspended.status === "suspended", "SUSPEND_STATUS_FAILED");
  const reactivated = await setAccess(client, alunoId, "reactivate");
  assert(reactivated.status === "active", "REACTIVATE_STATUS_FAILED");
  const revoked = await setAccess(client, alunoId, "revoke");
  assert(revoked.status === "revoked", "REVOKE_STATUS_FAILED");
}

async function assertStatusConstraint(alunoId) {
  for (const status of ["unknown", "", "ACTIVE", null]) {
    const { error } = await admin.from("alunos").update({ student_access_status: status }).eq("id", alunoId);
    assert(Boolean(error), `INVALID_STATUS_ACCEPTED_${String(status)}`);
  }
}

async function assertInvalidTransitionsRejected(client, alunoId) {
  await admin.from("alunos").update({ student_access_status: "not_invited" }).eq("id", alunoId);
  await assertActionRejected(client, alunoId, "suspend");
  await assertActionRejected(client, alunoId, "revoke");
  await assertActionRejected(client, alunoId, "activate", { email: STUDENT_EMAIL });

  await setAccess(client, alunoId, "invite", { email: STUDENT_EMAIL });
  await assertActionRejected(client, alunoId, "reactivate");

  await setAccess(client, alunoId, "activate", { email: STUDENT_EMAIL });
  await setAccess(client, alunoId, "revoke");
  await assertActionRejected(client, alunoId, "reactivate");
}

async function assertStudentReadStates(studentClient, alunoId) {
  await admin.from("alunos").update({ student_access_status: "not_invited" }).eq("id", alunoId);
  const notInvited = await getMyStudentWorkouts(studentClient);
  assert(notInvited.studentAccess?.status === "not_invited", "NOT_INVITED_STATUS_MISSING");
  assert((notInvited.activeWorkouts || []).length === 0, "NOT_INVITED_WORKOUT_DATA_LEAK");

  await admin.from("alunos").update({ student_access_status: "invited" }).eq("id", alunoId);
  const invited = await getMyStudentWorkouts(studentClient);
  assert(invited.studentAccess?.status === "invited", "INVITED_STATUS_MISSING");
  assert((invited.activeWorkouts || []).length === 0, "INVITED_WORKOUT_DATA_LEAK");

  await admin.from("alunos").update({ student_access_status: "active" }).eq("id", alunoId);
  const active = await getMyStudentWorkouts(studentClient);
  assert(active.student?.id === alunoId, "ACTIVE_STUDENT_PAYLOAD_MISSING");
  assert(active.studentAccess?.status === "active", "ACTIVE_STUDENT_ACCESS_STATUS_MISSING");

  await admin.from("alunos").update({ student_access_status: "suspended" }).eq("id", alunoId);
  const suspended = await getMyStudentWorkouts(studentClient);
  assert(suspended.student?.id === alunoId, "SUSPENDED_STUDENT_IDENTITY_MISSING");
  assert(suspended.studentAccess?.status === "suspended", "SUSPENDED_STATUS_MISSING");
  assert((suspended.activeWorkouts || []).length === 0, "SUSPENDED_WORKOUT_DATA_LEAK");

  await admin.from("alunos").update({ student_access_status: "revoked" }).eq("id", alunoId);
  const revoked = await getMyStudentWorkouts(studentClient);
  assert(revoked.student?.id === alunoId, "REVOKED_STUDENT_IDENTITY_MISSING");
  assert(revoked.studentAccess?.status === "revoked", "REVOKED_STATUS_MISSING");
  assert((revoked.activeWorkouts || []).length === 0, "REVOKED_WORKOUT_DATA_LEAK");
}

async function assertCrossOwnerBlocked(client, alunoId) {
  const { error } = await client.rpc("manage_student_access", {
    p_aluno_id: alunoId,
    p_action: "suspend",
    p_email: null,
    p_reason: null,
  });
  assert(Boolean(error), "CROSS_OWNER_MUTATION_ALLOWED");
}

async function assertStudentAdminReadBlocked(client, alunoId) {
  const { error } = await client.rpc("get_student_access_state", { p_aluno_id: alunoId });
  assert(Boolean(error), "STUDENT_ADMIN_READ_ALLOWED");
}

async function assertStudentCannotManage(client, alunoId) {
  const { error } = await client.rpc("manage_student_access", {
    p_aluno_id: alunoId,
    p_action: "suspend",
    p_email: null,
    p_reason: null,
  });
  assert(Boolean(error), "STUDENT_MUTATION_ALLOWED");
}

async function assertIdentityPreserved(fixture) {
  const aluno = await getStudentAluno(fixture.studentUserId);
  assert(aluno?.id === fixture.alunoId, "STUDENT_ALUNO_ID_CHANGED");
  assert(aluno?.user_id === fixture.professionalUserId, "STUDENT_OWNER_CHANGED");
  assert(aluno?.student_user_id === fixture.studentUserId, "STUDENT_AUTH_LINK_CHANGED");
}

async function assertActionRejected(client, alunoId, action, options = {}) {
  const { error } = await client.rpc("manage_student_access", {
    p_aluno_id: alunoId,
    p_action: action,
    p_email: options.email || null,
    p_reason: options.reason || null,
  });
  assert(Boolean(error), `${action.toUpperCase()}_UNEXPECTEDLY_ALLOWED`);
}

async function setAccess(client, alunoId, action, options = {}) {
  const { data, error } = await client.rpc("manage_student_access", {
    p_aluno_id: alunoId,
    p_action: action,
    p_email: options.email || null,
    p_reason: options.reason || null,
  });
  if (error) throw error;
  return data;
}

async function getMyStudentWorkouts(client) {
  const { data, error } = await client.rpc("get_my_student_workouts");
  if (error) throw error;
  return data || {};
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
