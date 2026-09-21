import assert from "node:assert/strict";
import test from "node:test";
import { completeLogout } from "./logoutContract.js";

test("confirma o logout e sincroniza as abas somente depois do signOut", async () => {
  const events = [];
  await completeLogout({
    signOut: async () => { events.push("signOut"); return { error: null }; },
    markLoggedOut: () => events.push("markLoggedOut"),
  });
  assert.deepEqual(events, ["signOut", "markLoggedOut"]);
});

test("não comunica logout quando signOut retorna error sem lançar", async () => {
  let marked = false;
  await assert.rejects(
    completeLogout({
      signOut: async () => ({ error: new Error("network") }),
      markLoggedOut: () => { marked = true; },
    }),
    (error) => error.code === "LOGOUT_FAILED"
  );
  assert.equal(marked, false);
});

test("não comunica logout quando signOut lança exceção", async () => {
  let marked = false;
  await assert.rejects(
    completeLogout({
      signOut: async () => { throw new Error("network"); },
      markLoggedOut: () => { marked = true; },
    }),
    /network/
  );
  assert.equal(marked, false);
});
