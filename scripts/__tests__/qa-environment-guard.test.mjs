import assert from "node:assert/strict";
import test from "node:test";
import {
  buildQaUrl,
  extractSupabaseProjectRef,
  validateQaEnvironment,
} from "../lib/qa-environment-guard.mjs";

const localQaEnv = {
  QA_ENVIRONMENT: "local_qa",
  QA_BASE_URL: "http://127.0.0.1:5173",
  QA_EXPECTED_SUPABASE_HOST: "127.0.0.1",
  QA_EXPECTED_SUPABASE_PORT: "54321",
  QA_FORBIDDEN_PRODUCTION_HOST: "aruka.com.br",
  QA_FORBIDDEN_PRODUCTION_PROJECT_REF: "prodref123",
};

test("accepts localhost frontend and localhost Supabase for LOCAL_QA", () => {
  const result = validateQaEnvironment({ ...localQaEnv, QA_BASE_URL: "http://localhost:5173" }, {
    detectedSupabaseUrl: "http://localhost:54321/rest/v1/alunos",
  });

  assert.equal(result.declaredEnvironment, "local_qa");
  assert.equal(result.host, "localhost");
});

test("accepts 127.0.0.1 frontend and 127.0.0.1 Supabase for LOCAL_QA", () => {
  const result = validateQaEnvironment(localQaEnv, {
    detectedSupabaseUrl: "http://127.0.0.1:54321/rest/v1/alunos",
  });

  assert.equal(result.host, "127.0.0.1");
});

test("blocks missing environment", () => {
  assert.throws(
    () => validateQaEnvironment({ ...localQaEnv, QA_ENVIRONMENT: "" }),
    /QA_ENVIRONMENT ausente/
  );
});

test("blocks localhost frontend connected to Supabase Cloud", () => {
  assert.throws(
    () =>
      validateQaEnvironment(localQaEnv, {
        detectedSupabaseUrl: "https://abc123.supabase.co/rest/v1/alunos",
      }),
    /Supabase Cloud/
  );
});

test("blocks production frontend with local Supabase", () => {
  assert.throws(
    () =>
      validateQaEnvironment({
        ...localQaEnv,
        QA_BASE_URL: "https://aruka.com.br",
      }, {
        detectedSupabaseUrl: "http://127.0.0.1:54321",
      }),
    /LOCAL_QA aceita somente/
  );
});

test("blocks staging without staging configuration", () => {
  assert.throws(
    () => validateQaEnvironment({ QA_ENVIRONMENT: "staging", QA_BASE_URL: "https://staging.example.invalid" }),
    /QA_EXPECTED_SUPABASE_PROJECT_REF/
  );
});

test("blocks production host", () => {
  assert.throws(
    () =>
      validateQaEnvironment({
        ...localQaEnv,
        QA_BASE_URL: "https://aruka.com.br",
      }),
    /LOCAL_QA aceita somente/
  );
});

test("blocks unknown public domain", () => {
  assert.throws(
    () =>
      validateQaEnvironment({
        ...localQaEnv,
        QA_BASE_URL: "https://qa.example.com",
      }),
    /LOCAL_QA aceita somente/
  );
});

test("blocks redirect to production", () => {
  assert.throws(
    () =>
      validateQaEnvironment(localQaEnv, {
        finalUrl: "https://aruka.com.br/dashboard",
        detectedSupabaseUrl: "http://127.0.0.1:54321",
      }),
    /LOCAL_QA aceita somente/
  );
});

test("blocks incompatible local Supabase port when explicitly configured", () => {
  assert.throws(
    () =>
      validateQaEnvironment(localQaEnv, {
        detectedSupabaseUrl: "http://127.0.0.1:54322/rest/v1/alunos",
      }),
    /porta do Supabase local/
  );
});

test("builds dashboard URL from QA_BASE_URL", () => {
  assert.equal(
    buildQaUrl("/dashboard", localQaEnv),
    "http://127.0.0.1:5173/dashboard"
  );
});

test("extracts Supabase project ref", () => {
  assert.equal(
    extractSupabaseProjectRef("https://abc123.supabase.co/auth/v1/token"),
    "abc123"
  );
});
