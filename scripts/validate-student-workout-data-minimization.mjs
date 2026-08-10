import { readFileSync } from "node:fs";

const functions = readFileSync("supabase/baseline-src/05-functions.sql", "utf8");
const migration = readFileSync("supabase/migrations/20260730090000_student_identity_contract.sql", "utf8");
const studentReader = functionBody(functions, "get_my_student_workouts");
const migrationReader = functionBody(migration, "get_my_student_workouts");
const combinedReader = `${studentReader}\n${migrationReader}`;
const checks = [];

add("student reader returns explicit json payload", /jsonb_build_object/.test(combinedReader));
add("student reader does not use select star in output contract", !/select\s+\*/i.test(combinedReader));
add("student reader excludes template snapshot", !/template_origin_snapshot|templateOriginSnapshot/.test(combinedReader));
add("student reader excludes idempotency key", !/application_idempotency_key|applicationIdempotencyKey/.test(combinedReader));
add("student reader excludes professional operation fields", !/applied_by|delivered_by|archived_at|template_origin_id|template_origin_type|template_origin_name/.test(combinedReader));
add("student payload includes only prescription fields", ["series", "repetitions", "rest", "prescribedLoad", "videoUrl"].every((field) => combinedReader.includes(`'${field}'`)));
add("student payload separates active and completed", /'activeWorkouts'/.test(combinedReader) && /'completedWorkouts'/.test(combinedReader));
add("student no service role", !/service_role|SUPABASE_SERVICE/i.test(combinedReader));

report();

function add(name, passed) {
  checks.push({ name, passed: Boolean(passed) });
}

function functionBody(source, name) {
  return source.match(new RegExp(`create or replace function public\\.${name}[\\s\\S]*?\\n\\$\\$;`, "i"))?.[0] || "";
}

function report() {
  for (const check of checks) console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}`);
  if (checks.some((check) => !check.passed)) process.exitCode = 1;
}
