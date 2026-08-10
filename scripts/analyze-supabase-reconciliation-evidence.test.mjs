import assert from "node:assert/strict";
import test from "node:test";
import {
  analyzeFunctionGrants,
  analyzeNullability,
  classifyEvidence,
  classifyReconciliationGrid,
  parseCsv,
  scanSecrets,
} from "./analyze-supabase-reconciliation-evidence.mjs";

test("identifies function grants, nullability and function configuration CSVs by header", () => {
  const files = [
    fixtureFile("grants.csv", "schema_name,function_name,identity_arguments,specific_name,grantee,privilege_type,security_definer,function_config\npublic,f,,f_1,authenticated,EXECUTE,false,\n"),
    fixtureFile("nulls.csv", "table_name,column_name,total_rows,null_rows\nalunos,whatsapp,10,0\n"),
    fixtureFile("configs.csv", "schema_name,function_name,identity_arguments,security_definer,function_config\npublic,f,,true,search_path=public\n"),
  ];
  const classified = classifyEvidence(files);
  assert.equal(classified.functionGrants.category, "FUNCTION_GRANTS_SIGNATURE_EVIDENCE");
  assert.equal(classified.nullability.category, "NULLABILITY_PROFILE_EVIDENCE");
  assert.equal(classified.functionConfiguration.category, "FUNCTION_CONFIGURATION_EVIDENCE");
});

test("selects the most complete nullability CSV when multiple versions exist", () => {
  const files = [
    fixtureFile("remote-nullability-profile-old.csv", "table_name,column_name,total_rows,null_rows\nalunos,whatsapp,26,0\n"),
    fixtureFile("remote-nullability-profile-production.csv", [
      "table_name,column_name,total_rows,null_rows",
      "alunos,acompanhamento_motivo,26,0",
      "alunos,created_at,26,0",
      "alunos,inicio,26,0",
      "alunos,observacoes,26,0",
      "alunos,pagamento_recebido,26,0",
      "alunos,plano,26,0",
      "alunos,status,26,0",
      "alunos,user_id,26,0",
      "alunos,valor,26,0",
      "alunos,whatsapp,26,0",
    ].join("\n")),
  ];
  const classified = classifyEvidence(files);
  assert.equal(classified.nullability.name, "remote-nullability-profile-production.csv");
  assert.equal(classified.nullability.rows.length, 10);
});

test("classifies unknown or partial reconciliation grid", () => {
  assert.equal(classifyReconciliationGrid(["schema_name", "function_name", "identity_arguments", "security_definer", "function_config"]), "FUNCTION_CONFIGURATION_EVIDENCE");
  assert.equal(classifyReconciliationGrid(["routine_name", "grantee"]), "UNKNOWN_EVIDENCE");
});

test("parses multiline SQL CSV fields", () => {
  const rows = parseCsv('a,b\n"line 1\nline 2",x\n');
  assert.equal(rows[1][0], "line 1\nline 2");
  assert.equal(rows[1][1], "x");
});

test("compares grants by signature and keeps overloads distinct", () => {
  const remote = [
    { schema_name: "public", function_name: "f", identity_arguments: "", specific_name: "f_1", grantee: "authenticated", privilege_type: "EXECUTE", security_definer: "false", function_config: "" },
    { schema_name: "public", function_name: "f", identity_arguments: "id uuid", specific_name: "f_2", grantee: "authenticated", privilege_type: "EXECUTE", security_definer: "false", function_config: "" },
  ];
  const localFns = [{ function_name: "f", arguments: "", definition: "" }, { function_name: "f", arguments: "id uuid", definition: "" }];
  const localGrants = [{ routine_name: "f", grantee: "authenticated", privilege_type: "EXECUTE" }];
  const result = analyzeFunctionGrants(remote, localFns, localGrants);
  assert.equal(result.uniqueCanonicalGrants, 2);
  assert.equal(result.remoteGrants.length, 2);
});

test("flags public execute on security definer with absent search_path as high risk", () => {
  const result = analyzeFunctionGrants([
    { schema_name: "public", function_name: "admin_registrar_log", identity_arguments: "", specific_name: "x", grantee: "PUBLIC", privilege_type: "EXECUTE", security_definer: "true", function_config: "" },
  ], [{ function_name: "admin_registrar_log", arguments: "", definition: "" }], []);
  assert.equal(result.remoteGrants[0].priority, "P0");
  assert.equal(result.remoteGrants[0].classification, "REMOTE_EXCESS_GRANT");
});

test("recognizes platform managed service_role grants without treating as secret", () => {
  const result = analyzeFunctionGrants([
    { schema_name: "public", function_name: "f", identity_arguments: "", specific_name: "x", grantee: "service_role", privilege_type: "EXECUTE", security_definer: "true", function_config: "search_path=public" },
  ], [{ function_name: "f", arguments: "", definition: "" }], []);
  assert.equal(result.remoteGrants[0].classification, "PLATFORM_MANAGED_EXPECTED");
  assert.equal(scanSecrets("service_role", "x.csv")[0].kind, "service_role_role_name");
});

test("classifies nullability zero nulls, rows with nulls, empty table and invalid profile", () => {
  const matrix = [
    { status: "NULLABILITY_DIFFERENT", object: "alunos", subobject: "whatsapp" },
    { status: "NULLABILITY_DIFFERENT", object: "alunos", subobject: "valor" },
    { status: "NULLABILITY_DIFFERENT", object: "alunos", subobject: "plano" },
    { status: "NULLABILITY_DIFFERENT", object: "alunos", subobject: "status" },
  ];
  const result = analyzeNullability([
    { table_name: "alunos", column_name: "whatsapp", total_rows: "10", null_rows: "0" },
    { table_name: "alunos", column_name: "valor", total_rows: "10", null_rows: "2" },
    { table_name: "alunos", column_name: "plano", total_rows: "0", null_rows: "0" },
    { table_name: "alunos", column_name: "status", total_rows: "1", null_rows: "2" },
  ], matrix);
  assert.equal(result.profiles[0].classification, "CURRENT_DATA_COMPATIBLE_WITH_NOT_NULL");
  assert.equal(result.profiles[0].functional_classification, "NOT_NULL_REQUIRED_BY_CONTRACT");
  assert.equal(result.profiles[1].classification, "BACKFILL_REQUIRED");
  assert.equal(result.profiles[2].classification, "EMPTY_TABLE_NEEDS_CONTRACT_REVIEW");
  assert.equal(result.profiles[3].classification, "INVALID_PROFILE_RESULT");
});

test("accepts the complete production nullability profile", () => {
  const rows = ["acompanhamento_motivo", "created_at", "inicio", "observacoes", "pagamento_recebido", "plano", "status", "user_id", "valor", "whatsapp"].map((column_name) => ({ table_name: "alunos", column_name, total_rows: "26", null_rows: "0" }));
  const result = analyzeNullability(rows);
  assert.equal(result.completeness, "REMOTE_NULLABILITY_PROFILE_COMPLETE");
  assert.equal(result.missing.length, 0);
  assert.equal(result.profiles.every((profile) => profile.current_data_classification === "CURRENT_DATA_COMPATIBLE_WITH_NOT_NULL"), true);
});

test("detects unexpected and duplicated nullability rows", () => {
  const rows = [
    { table_name: "alunos", column_name: "whatsapp", total_rows: "26", null_rows: "0" },
    { table_name: "alunos", column_name: "whatsapp", total_rows: "26", null_rows: "0" },
    { table_name: "alunos", column_name: "extra", total_rows: "26", null_rows: "0" },
  ];
  const result = analyzeNullability(rows, [{ status: "NULLABILITY_DIFFERENT", object: "alunos", subobject: "whatsapp" }]);
  assert.deepEqual(result.duplicates, ["alunos.whatsapp"]);
  assert.deepEqual(result.unknown, ["alunos.extra"]);
});

test("detects incomplete nullability profile", () => {
  const matrix = [
    { status: "NULLABILITY_DIFFERENT", object: "alunos", subobject: "whatsapp" },
    { status: "NULLABILITY_DIFFERENT", object: "alunos", subobject: "valor" },
  ];
  const result = analyzeNullability([{ table_name: "alunos", column_name: "whatsapp", total_rows: "10", null_rows: "0" }], matrix);
  assert.equal(result.completeness, "REMOTE_NULLABILITY_PROFILE_INCOMPLETE");
  assert.deepEqual(result.missing, ["alunos.valor"]);
});

test("detects blocking secret patterns", () => {
  const hits = scanSecrets(["postgresql", "://user:pass@example/db"].join(""), "secret.csv");
  assert.equal(hits[0].kind, "connection_string");
});

function fixtureFile(name, text) {
  return { name, text, rows: parseCsv(text), bytes: text.length, lines: text.split(/\r?\n/).length, header: parseCsv(text)[0].join(","), bom: false };
}
