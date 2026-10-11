import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./App.jsx", import.meta.url), "utf8");

test("expired recovery hashes render recovery UX instead of the landing page", () => {
  assert.match(source, /function LandingPageOrRecoveryError\(\)/);
  assert.match(source, /isExpiredRecoveryUrlError\(window\.location\.hash\)/);
  assert.match(source, /<InvalidRecoveryLink \/>/);
  assert.match(source, /path="\/" element=\{<LandingPageOrRecoveryError \/>\}/);
});

test("student V2 routes are isolated behind the dedicated guard while legacy remains registered", () => {
  assert.match(source, /path="\/minha-area"/);
  assert.match(source, /<MinhaArea \/>/);
  assert.match(source, /<StudentEntryRoute>[\s\S]*<MinhaArea \/>[\s\S]*<\/StudentEntryRoute>/);
  assert.match(source, /StudentExperienceV2Route/);
  assert.match(source, /path="treinos" element={<StudentTrainingLibraryV2 \/>}/);
  assert.match(source, /path="treinos\/:workoutId" element={<StudentTrainingLibraryV2 \/>}/);
  assert.match(source, /path="inicio"/);
  assert.match(source, /path="\/workout\/:sessionId"/);
  assert.match(source, /path="\/minha-area\/treino\/:sessionId"/);
  assert.match(source, /<StudentWorkoutPlayerV2 \/>/);
  assert.match(source, /path="perfil" element={<StudentProfileV2 \/>}/);
  assert.match(source, /path="\/contato-alunos"/);
  assert.match(source, /<ProfessionalRoute>[\s\S]*<ProfessionalContactSettings \/>/);
});

test("PROFESSIONAL-02/04: professional refresh and deep links retain authentication and role guards", () => {
  const professionalRoutes = [
    ["dashboard", "Dashboard"],
    ["alunos", "Alunos"],
    ["financeiro", "Financeiro"],
    ["planos", "Planos"],
    ["gestao-inteligente", "GestaoInteligente"],
    ["avaliacoes", "Avaliacoes"],
    ["treinos", "Treinos"],
    ["exercicios", "Exercicios"],
    ["contato-alunos", "ProfessionalContactSettings"],
  ];

  for (const [path, component] of professionalRoutes) {
    const route = new RegExp(`path="/${path}"[\\s\\S]*?<ProtectedRoute>[\\s\\S]*?<ProfessionalRoute>[\\s\\S]*?<${component} \\/>`);
    assert.match(source, route, `${path} must validate both the restored session and professional role`);
  }
});

test("STUDENT-02 and SECURITY-01: administrative routes keep explicit authorization guards", () => {
  assert.match(source, /path="\/admin\/usuarios"[\s\S]*?<ProtectedRoute>[\s\S]*?<AdminRoute>[\s\S]*?<AdminUsuarios \/>/);
  assert.match(source, /path="\/admin\/logs"[\s\S]*?<ProtectedRoute>[\s\S]*?<AdminRoute>[\s\S]*?<AdminLogs \/>/);
});
