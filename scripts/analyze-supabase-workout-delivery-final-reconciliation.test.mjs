import test from "node:test";
import assert from "node:assert/strict";
import {
  buildMatrix,
  classifyWorkoutObject,
  summarize,
  validateResult
} from "./analyze-supabase-workout-delivery-final-reconciliation.mjs";

test("object covered by existing migration is remote pending", () => {
  const result = classifyWorkoutObject({
    object_type: "constraint",
    object: "public.treinos.treinos_lifecycle_dates_check",
    existing_migration: "supabase/migrations/20260728030000_workout_delivery_integration_v1.sql"
  });
  assert.equal(result.classification, "LOCAL_IMPLEMENTED_REMOTE_PENDING");
  assert.equal(result.local_drift, false);
  assert.equal(result.remote_pending, true);
});

test("object missing local migration coverage requires migration", () => {
  const result = classifyWorkoutObject({ object_type: "index", object: "public.treinos.missing_idx" });
  assert.equal(result.classification, "LOCAL_GAP_NEW_MIGRATION_REQUIRED");
  assert.equal(result.new_migration_required, true);
});

test("semantic false positive is not a blocker", () => {
  const result = classifyWorkoutObject({
    object_type: "constraint",
    object: "public.treino_eventos.treino_eventos_metadata_object_check",
    existing_migration: "supabase/migrations/20260728030000_workout_delivery_integration_v1.sql"
  });
  assert.equal(result.classification, "SEMANTIC_FALSE_POSITIVE");
  assert.equal(result.local_drift, false);
});

test("grant resolved by Phase 1 stays remote pending", () => {
  const result = classifyWorkoutObject({
    object_type: "grant",
    object: "public.entregar_treino(uuid) authenticated execute",
    existing_migration: "supabase/migrations/20260728030000_workout_delivery_integration_v1.sql"
  });
  assert.equal(result.classification, "RESOLVED_BY_PHASE1_REMOTE_PENDING");
  assert.equal(result.remote_pending, true);
});

test("student identity dependency is deferred", () => {
  const result = classifyWorkoutObject({
    object_type: "function",
    object: "public.get_my_student_workouts()",
    existing_migration: "supabase/migrations/20260730090000_student_identity_contract.sql"
  });
  assert.equal(result.classification, "DEFERRED_TO_STUDENT_IDENTITY");
  assert.equal(result.local_drift, false);
});

test("duplicated migration attempt fails when final result requires no migration", () => {
  assert.throws(() => validateResult({
    final_local_drift_count: 0,
    new_migration_required: false,
    next_safe_group: "STUDENT_IDENTITY_DEPLOYMENT_DESIGN",
    migration_path: "supabase/migrations/20260802000000_reconcile_remaining_workout_delivery.sql"
  }), /WORKOUT_DELIVERY_DUPLICATE_MIGRATION_FORBIDDEN|WORKOUT_DELIVERY_MIGRATION_MISSING/);
});

test("final local drift zero is ready", () => {
  const rows = buildMatrix();
  const summary = summarize(rows);
  assert.equal(summary.final_local_drift_count, 0);
  assert.equal(summary.new_migration_required_count, 0);
});
