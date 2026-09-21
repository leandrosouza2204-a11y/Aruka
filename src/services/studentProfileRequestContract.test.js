import assert from "node:assert/strict";
import test from "node:test";
import { loadProfileForSession } from "./studentProfileRequestContract.js";

test("aceita resposta quando a identidade autenticada permanece a mesma", async () => {
  const result = await loadProfileForSession({
    expectedUserId: "student-a",
    getUser: async () => ({ id: "student-a", email: "a@example.com" }),
    fetchProfile: async () => ({ student: { name: "A" } }),
  });
  assert.equal(result.user.id, "student-a");
  assert.equal(result.payload.student.name, "A");
});

test("descarta resposta que termina depois de uma troca de conta", async () => {
  const users = [{ id: "student-a" }, { id: "student-b" }];
  await assert.rejects(
    loadProfileForSession({
      expectedUserId: "student-a",
      getUser: async () => users.shift(),
      fetchProfile: async () => ({ student: { name: "Dados antigos" } }),
    }),
    (error) => error.code === "STUDENT_PROFILE_SESSION_CHANGED"
  );
});

test("não inicia leitura para uma sessão diferente da esperada", async () => {
  let fetched = false;
  await assert.rejects(
    loadProfileForSession({
      expectedUserId: "student-b",
      getUser: async () => ({ id: "student-a" }),
      fetchProfile: async () => { fetched = true; return {}; },
    }),
    (error) => error.code === "STUDENT_PROFILE_SESSION_CHANGED"
  );
  assert.equal(fetched, false);
});
