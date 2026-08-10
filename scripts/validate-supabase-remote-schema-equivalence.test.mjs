import assert from "node:assert/strict";
import test from "node:test";
import {
  compareColumn,
  compareConstraint,
  compareFunction,
  compareIndex,
  comparePolicy,
  normalizeConstraintType,
  normalizeDefault,
  normalizeFunctionArguments,
  normalizePolicyExpression,
  normalizeRoles,
  normalizeVolatility,
} from "./validate-supabase-remote-schema-equivalence.mjs";

test("normalizes absent defaults without masking real defaults", () => {
  assert.equal(normalizeDefault(""), null);
  assert.equal(normalizeDefault(null), null);
  assert.equal(normalizeDefault(undefined), null);
  assert.equal(normalizeDefault("   "), null);
  assert.equal(normalizeDefault("null"), null);
  assert.notEqual(normalizeDefault("''"), null);
  assert.notEqual(normalizeDefault("NULL"), null);
  assert.notEqual(normalizeDefault("null::text"), null);
  assert.notEqual(normalizeDefault("0"), null);
  assert.notEqual(normalizeDefault("false"), null);
});

test("normalizes constraint type codes", () => {
  assert.equal(normalizeConstraintType("p"), "PRIMARY_KEY");
  assert.equal(normalizeConstraintType("PRIMARY KEY"), "PRIMARY_KEY");
  assert.equal(normalizeConstraintType("f"), "FOREIGN_KEY");
  assert.equal(normalizeConstraintType("FOREIGN KEY"), "FOREIGN_KEY");
  assert.equal(normalizeConstraintType("u"), "UNIQUE");
  assert.equal(normalizeConstraintType("UNIQUE"), "UNIQUE");
  assert.equal(normalizeConstraintType("c"), "CHECK");
  assert.equal(normalizeConstraintType("CHECK"), "CHECK");
  assert.equal(normalizeConstraintType("x"), "EXCLUSION");
  assert.equal(normalizeConstraintType("EXCLUSION"), "EXCLUSION");
});

test("normalizes volatility codes", () => {
  assert.equal(normalizeVolatility("i"), "IMMUTABLE");
  assert.equal(normalizeVolatility("s"), "STABLE");
  assert.equal(normalizeVolatility("v"), "VOLATILE");
  assert.equal(normalizeVolatility("VOLATILE"), "VOLATILE");
});

test("classifies physical column order as informational when material fields match", () => {
  const local = { ordinal_position: "1", data_type: "timestamp with time zone", udt_name: "timestamptz", is_nullable: "YES", column_default: "" };
  const remote = { ordinal_position: "7", data_type: "timestamptz", udt_name: "timestamp with time zone", is_nullable: "YES", column_default: null };
  const [status, severity] = compareColumn(local, remote);
  assert.equal(status, "COLUMN_ORDER_DIFFERENT_NON_MATERIAL");
  assert.equal(severity, "informational");
});

test("keeps nullable drift critical", () => {
  const local = { ordinal_position: "1", data_type: "boolean", udt_name: "bool", is_nullable: "NO", column_default: "false" };
  const remote = { ordinal_position: "1", data_type: "bool", udt_name: "boolean", is_nullable: "YES", column_default: "false" };
  const [status, severity] = compareColumn(local, remote);
  assert.equal(status, "NULLABILITY_DIFFERENT");
  assert.equal(severity, "critical");
});

test("keeps real default drift critical", () => {
  const local = { ordinal_position: "1", data_type: "integer", udt_name: "int4", is_nullable: "NO", column_default: "0" };
  const remote = { ordinal_position: "1", data_type: "int4", udt_name: "integer", is_nullable: "NO", column_default: "1" };
  const [status, severity] = compareColumn(local, remote);
  assert.equal(status, "DEFAULT_DIFFERENT");
  assert.equal(severity, "critical");
});

test("normalizes safe constraint representation differences", () => {
  const local = { constraint_type: "PRIMARY KEY", definition: "PRIMARY KEY (id)" };
  const remote = { constraint_type: "p", definition: "primary key(id)" };
  const [status] = compareConstraint(local, remote);
  assert.match(status, /^EQUIVALENT/);
});

test("normalizes redundant check parentheses and ANY array order", () => {
  const local = { constraint_type: "c", definition: "CHECK ((status = ANY (ARRAY['ativo'::text, 'encerrado'::text, 'cancelado'::text])))" };
  const remote = { constraint_type: "CHECK", definition: "CHECK (status = ANY (ARRAY['cancelado'::text, 'ativo'::text, 'encerrado'::text]))" };
  const [status] = compareConstraint(local, remote);
  assert.match(status, /^EQUIVALENT/);
});

test("keeps FK delete rule drift material", () => {
  const local = { constraint_type: "f", definition: "FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE" };
  const remote = { constraint_type: "FOREIGN KEY", definition: "FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE SET NULL" };
  const [status, severity] = compareConstraint(local, remote);
  assert.equal(status, "MATERIAL_DIFFERENCE");
  assert.equal(severity, "critical");
});

test("normalizes trim and btrim index expressions", () => {
  const local = { indexdef: "CREATE UNIQUE INDEX planos_user_nome_normalizado_unique_idx ON public.planos USING btree (user_id, btrim(nome))" };
  const remote = { indexdef: "CREATE UNIQUE INDEX planos_user_nome_normalizado_unique_idx ON public.planos USING btree (user_id, TRIM(BOTH FROM nome))" };
  const [status] = compareIndex(local, remote);
  assert.equal(status, "EQUIVALENT_EXPRESSION_REPRESENTATION");
});

test("normalizes null and empty policy expressions", () => {
  assert.equal(normalizePolicyExpression(""), null);
  assert.equal(normalizePolicyExpression(null), null);
  assert.equal(normalizePolicyExpression("   "), null);
});

test("classifies remote public policy role as more permissive than authenticated", () => {
  const local = { permissive: "PERMISSIVE", roles: "{authenticated}", cmd: "SELECT", qual: "auth.uid() = user_id", with_check: "" };
  const remote = { permissive: "PERMISSIVE", roles: "{public}", cmd: "SELECT", qual: "(auth.uid() = public.user_id)", with_check: null };
  const [status, severity] = comparePolicy(local, remote);
  assert.equal(status, "REMOTE_MORE_PERMISSIVE");
  assert.equal(severity, "critical");
});

test("normalizes role array syntax without changing role meaning", () => {
  assert.deepEqual(normalizeRoles("{authenticated, anon}"), ["anon", "authenticated"]);
  assert.deepEqual(normalizeRoles("authenticated"), ["authenticated"]);
  assert.notDeepEqual(normalizeRoles("{public}"), normalizeRoles("{authenticated}"));
});

test("normalizes function overload signatures", () => {
  assert.equal(normalizeFunctionArguments("id uuid, force boolean DEFAULT false"), "id uuid, force boolean");
});

test("keeps security definer drift critical", () => {
  const base = { return_type: "integer", volatility: "v", definition: "CREATE OR REPLACE FUNCTION public.f() RETURNS integer LANGUAGE sql AS $$ select 1 $$;" };
  const [status, severity] = compareFunction({ ...base, security_definer: "true" }, { ...base, security_definer: "false" });
  assert.equal(status, "MATERIAL_DIFFERENCE");
  assert.equal(severity, "critical");
});

test("keeps function body drift critical after normalization", () => {
  const local = { return_type: "integer", security_definer: "false", volatility: "VOLATILE", definition: "CREATE OR REPLACE FUNCTION public.f() RETURNS integer LANGUAGE sql AS $$ select 1 $$;" };
  const remote = { return_type: "int4", security_definer: "false", volatility: "v", definition: "CREATE OR REPLACE FUNCTION public.f() RETURNS integer LANGUAGE sql AS $$ select 2 $$;" };
  const [status, severity] = compareFunction(local, remote);
  assert.equal(status, "BODY_DIFFERENT");
  assert.equal(severity, "critical");
});

test("normalizes redundant CHECK parentheses around jsonb object constraints", () => {
  const [status, severity] = compareConstraint(
    {
      constraint_type: "c",
      definition: "CHECK (((metadata IS NULL) OR (jsonb_typeof(metadata) = 'object'::text)))",
    },
    {
      constraint_type: "c",
      definition: "CHECK (metadata IS NULL OR jsonb_typeof(metadata) = 'object'::text)",
    }
  );

  assert.equal(status, "EQUIVALENT_REPRESENTATION_DIFFERENCE");
  assert.equal(severity, "info");
});

test("normalizes redundant CHECK parentheses around template snapshot constraints", () => {
  const [status, severity] = compareConstraint(
    {
      constraint_type: "c",
      definition: "CHECK (((template_origin_snapshot IS NULL) OR (jsonb_typeof(template_origin_snapshot) = 'object'::text)))",
    },
    {
      constraint_type: "c",
      definition: "CHECK (template_origin_snapshot IS NULL OR jsonb_typeof(template_origin_snapshot) = 'object'::text)",
    }
  );

  assert.equal(status, "EQUIVALENT_REPRESENTATION_DIFFERENCE");
  assert.equal(severity, "info");
});

test("normalizes equivalent ANY array template origin checks", () => {
  const [status, severity] = compareConstraint(
    {
      constraint_type: "c",
      definition: "CHECK (((template_origin_type IS NULL) OR (template_origin_type = ANY (ARRAY['official'::text, 'personal'::text]))))",
    },
    {
      constraint_type: "c",
      definition: "CHECK (template_origin_type IS NULL OR (template_origin_type = ANY (ARRAY['official'::text, 'personal'::text])))",
    }
  );

  assert.equal(status, "EQUIVALENT_REPRESENTATION_DIFFERENCE");
  assert.equal(severity, "info");
});
