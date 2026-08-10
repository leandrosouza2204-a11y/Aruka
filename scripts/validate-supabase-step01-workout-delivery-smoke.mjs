import { existsSync, readFileSync } from "node:fs";

export const DEFAULT_SMOKE_PATH =
  "reports/supabase-production-sync/production-cutover-sql/01-workout-delivery-smoke.sql";

const STRUCTURAL_DDL_PATTERN = /\b(drop|alter|create\s+(?:table|function|policy|index|trigger|view|schema)|grant|revoke)\b/i;
const STEP02_PATTERN = /\b(student_user_id|vincular_aluno_usuario|desvincular_aluno_usuario|get_my_student_workouts|student identity|step\s*0?2)\b/i;
const FINANCIAL_PATTERN = /\b(public\.)?(planos|assinaturas|pagamentos|financeiro)\b/i;
const ADMIN_PATTERN = /\badmin[_a-z]*|public\.admin_/i;
const AOE_PATTERN = /\baoe[_a-z]*|public\.aoe_/i;

export function validateSmoke(sql) {
  const checks = [];
  const add = (name, passed, details = "") => checks.push({ name, passed: Boolean(passed), details });

  add("smoke file exists", typeof sql === "string" && sql.length > 0);
  add("psql stops on first error", /\\set\s+ON_ERROR_STOP\s+on/i.test(sql));
  add("uses transaction", /\bbegin\s*;/i.test(sql) && /\brollback\s*;/i.test(sql));
  add("uses authenticated role", /\bset\s+local\s+role\s+authenticated\b/i.test(sql));
  add("uses jwt claim auth strategy", /request\.jwt\.claim\.sub/.test(sql));
  add("controlled fixtures", /smoke-step01-/i.test(sql) && /gen_random_uuid\(\)/i.test(sql) && /example\.invalid/i.test(sql));
  add("create or apply assert", /SMOKE_01_CREATE_OR_APPLY/.test(sql) && /salvar_treino_composto/.test(sql));
  add("deliver assert", /SMOKE_02_DELIVER/.test(sql) && /entregar_treino/.test(sql));
  add("lifecycle assert", /SMOKE_03_LIFECYCLE_TRANSITION/.test(sql) && /alterar_estado_treino/.test(sql) && /completed/.test(sql));
  add("event assert", /SMOKE_04_EVENT_AUDIT/.test(sql) && /treino_eventos/.test(sql) && /applied/.test(sql) && /delivered/.test(sql));
  add("idempotency assert", /SMOKE_05_IDEMPOTENCY/.test(sql) && /applicationIdempotencyKey|application_idempotency_key/.test(sql));
  add("ownership negative assert", /SMOKE_06_OWNERSHIP_PROTECTION/.test(sql) && /WORKOUT_NOT_FOUND|WORKOUT_STUDENT_FORBIDDEN|WORKOUT_FORBIDDEN/.test(sql));
  add("cleanup assert", /SMOKE_07_CLEANUP/.test(sql) && /SMOKE_RESIDUAL_ROWS=0/.test(sql) && /\bdelete\s+from\s+public\.treinos\b/i.test(sql));
  add("deterministic pass marker", /SMOKE_RESULT=PASS/.test(sql));
  add("no structural DDL", !STRUCTURAL_DDL_PATTERN.test(sql));
  add("no Step02 references", !STEP02_PATTERN.test(sql));
  add("no financial references", !FINANCIAL_PATTERN.test(sql.replace(/\bplano\b/gi, "allowed_aluno_required_column")));
  add("no admin references", !ADMIN_PATTERN.test(sql));
  add("no AOE references", !AOE_PATTERN.test(sql));
  add("no obvious secrets", !/(postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@|sb_secret_|eyJ[a-zA-Z0-9_-]{20,})/.test(sql));

  return checks;
}

export function validateSmokeFile(path = DEFAULT_SMOKE_PATH) {
  const sql = existsSync(path) ? readFileSync(path, "utf8") : "";
  return validateSmoke(sql);
}

if (import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/")}`) {
  const checks = validateSmokeFile(process.argv[2] || DEFAULT_SMOKE_PATH);
  const failed = checks.filter((check) => !check.passed);

  for (const check of checks) {
    console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}${check.details ? ` - ${check.details}` : ""}`);
  }

  if (failed.length) {
    process.exitCode = 1;
  }
}
