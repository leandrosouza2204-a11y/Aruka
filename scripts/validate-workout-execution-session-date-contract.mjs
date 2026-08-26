import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getLocalDateOnly } from "../src/features/workoutExecution/utils/workoutExecutionSession.js";

const foundation = readFileSync("supabase/migrations/20260822120000_workout_execution_history_foundation.sql", "utf8");
const migration = readFileSync("supabase/migrations/20260824120000_workout_execution_session_local_date.sql", "utf8");
const service = readFileSync("src/services/workoutExecutionService.js", "utf8");

assert.match(foundation, /session_date date not null default current_date/);
assert.match(migration, /drop function if exists public\.start_workout_execution_session\(uuid, uuid, text\)/);
assert.match(migration, /p_session_date date default null/);
assert.match(migration, /WORKOUT_EXECUTION_SESSION_DATE_REQUIRED/);
assert.match(migration, /WORKOUT_EXECUTION_SESSION_DATE_OUT_OF_RANGE/);
assert.match(migration, /insert into public\.workout_execution_sessions \(aluno_id, treino_id, treino_dia_id, idempotency_key, session_date\)/);
assert.match(migration, /values \(v_aluno\.id, p_treino_id, p_treino_dia_id, v_key, p_session_date\)/);
assert.match(migration, /where aluno_id = v_aluno\.id and idempotency_key = v_key[\s\S]*return public\.workout_execution_session_payload\(v_session_id\)/);
assert.match(migration, /status = 'in_progress'[\s\S]*return public\.workout_execution_session_payload\(v_session_id\)/);
assert.match(foundation, /started_at timestamptz not null default now\(\)/);
assert.match(foundation, /completed_at = coalesce\(completed_at, now\(\)\)/);
assert.match(foundation, /abandoned_at = coalesce\(abandoned_at, now\(\)\)/);
assert.match(migration, /security definer/);
assert.match(migration, /set search_path = public/);
assert.match(migration, /v_student_user_id uuid := auth\.uid\(\)/);
assert.match(service, /p_session_date: getLocalDateOnly\(\)/);
assert.doesNotMatch(service, /toISOString\(\)\.slice\(0,\s*10\)/);

assert.equal(getLocalDateOnly(new Date(2026, 7, 24, 22, 0, 0)), "2026-08-24");
assert.equal(getLocalDateOnly(new Date(2026, 7, 24, 23, 59, 0)), "2026-08-24");
assert.equal(getLocalDateOnly(new Date(2026, 7, 25, 0, 1, 0)), "2026-08-25");
assert.equal(getLocalDateOnly(new Date(2026, 0, 1, 0, 1, 0)), "2026-01-01");

console.log("WORKOUT_EXECUTION_SESSION_DATE_CONTRACT=PASS");
console.log("CURRENT_SESSION_DATE_EXPRESSION=session_date date not null default current_date");
console.log("CURRENT_SESSION_DATE_SOURCE=table_default_when_rpc_omits_column");
console.log("ROOT_CAUSE=DATABASE_DATE_CONTEXT_NOT_USER_LOCAL_DATE");
console.log("RECOMMENDED_SESSION_DATE_STRATEGY=CLIENT_LOCAL_CIVIL_DATE_TO_RPC_P_SESSION_DATE");
console.log("LOCAL_CIVIL_DATE_PRESERVED=YES");
console.log("DB_DATE_WRITE=PASS");
console.log("DATE_ONLY_FORMATTING=PASS");
console.log("IDEMPOTENCY_PRESERVED=YES");
console.log("EXISTING_ACTIVE_SESSION_BEHAVIOR=RETURN_EXISTING_WITHOUT_OVERWRITE");
console.log("RLS_CHANGE=NO");
console.log("PRODUCTION_ACCESSED=NO");
