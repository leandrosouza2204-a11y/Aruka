import assert from "node:assert/strict";
import test from "node:test";
import {
  validateDesign,
  validateExecutionBoundary,
  validateNullabilityComplete,
  validatePhaseOrder,
} from "./validate-supabase-reconciliation-design.mjs";

test("valid design passes", () => {
  assert.deepEqual(validateDesign(validDesign()), []);
});

test("complete nullability profile passes", () => {
  assert.deepEqual(validateNullabilityComplete(validDesign().evidence.nullability), []);
});

test("missing nullability column fails", () => {
  const data = validDesign();
  data.evidence.nullability.expected.pop();
  assert.match(validateNullabilityComplete(data.evidence.nullability).join("\n"), /expected columns/);
});

test("nullability null rows fail", () => {
  const data = validDesign();
  data.evidence.nullability.profiles[0].null_rows = "1";
  assert.match(validateNullabilityComplete(data.evidence.nullability).join("\n"), /null rows remain/);
});

test("phase order fails when not increasing", () => {
  const data = validDesign();
  data.matrix[3].phase = "1";
  assert.match(validatePhaseOrder(data.matrix).join("\n"), /strictly increasing/);
});

test("history before schema fails", () => {
  const data = validDesign();
  data.matrix.find((row) => row.phase_name === "migration_history_and_baseline").phase = "2";
  assert.match(validatePhaseOrder(data.matrix).join("\n"), /final phase/);
});

test("student identity before prerequisites fails", () => {
  const data = validDesign();
  data.matrix.find((row) => row.phase_name === "student_identity_contract").phase = "1";
  assert.match(validatePhaseOrder(data.matrix).join("\n"), /student identity/);
});

test("new real migration fails", () => {
  assert.match(validateExecutionBoundary({ ...validDesign(), stagedMigrations: ["supabase/migrations/20260731000000_apply_reconciliation.sql"] }).join("\n"), /unexpected staged migration/);
});

test("write SQL in docs fails", () => {
  assert.match(validateExecutionBoundary({ ...validDesign(), docs: "alter table public.alunos alter column valor set not null;" }).join("\n"), /write SQL/);
});

test("missing rollback fails", () => {
  const data = validDesign();
  data.matrix[0].rollback_concept = "";
  assert.match(validateDesign(data).join("\n"), /rollback/);
});

test("missing financial risk fails", () => {
  const data = validDesign();
  data.matrix[0].financial_impact = "";
  assert.match(validateDesign(data).join("\n"), /financial impact/);
});

function validDesign() {
  const nullability = {
    expected: Array.from({ length: 10 }, (_, index) => ({ table_name: "alunos", column_name: `c${index}` })),
    missing: [],
    profiles: Array.from({ length: 10 }, (_, index) => ({
      table_name: "alunos",
      column_name: `c${index}`,
      total_rows: "26",
      null_rows: "0",
      current_data_classification: "CURRENT_DATA_COMPATIBLE_WITH_NOT_NULL",
    })),
  };
  const matrix = [
    "evidence_freeze",
    "security_policies",
    "function_and_table_grants",
    "constraints_and_nullability",
    "function_definitions",
    "workout_delivery_contract",
    "student_identity_contract",
    "post_reconciliation_validation",
    "migration_history_and_baseline",
  ].map((phase_name, phase) => ({
    phase: String(phase),
    phase_name,
    rollback_concept: "restore previous state",
    financial_impact: "classified",
    approval_required: "required",
    executable_sql_present: "false",
  }));
  return {
    result: { decision: "READY_FOR_RECONCILIATION_DESIGN", productionAction: "RECONCILIATION_DESIGN_REQUIRED", nullability },
    evidence: { decision: "READY_FOR_RECONCILIATION_DESIGN", nullability },
    futurePlan: { phases: matrix },
    matrix,
    docs: "design only\n",
    stagedMigrations: ["supabase/migrations/20260730090000_student_identity_contract.sql"],
  };
}
