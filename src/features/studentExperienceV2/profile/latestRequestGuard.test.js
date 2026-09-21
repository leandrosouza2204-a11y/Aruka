import assert from "node:assert/strict";
import test from "node:test";
import { createLatestRequestGuard } from "./latestRequestGuard.js";

test("somente a tentativa mais recente pode atualizar a tela após retry", () => {
  const guard = createLatestRequestGuard();
  const first = guard.start();
  const retry = guard.start();
  assert.equal(guard.isCurrent(first), false);
  assert.equal(guard.isCurrent(retry), true);
});

test("logout, troca de sessão ou unmount invalidam a requisição pendente", () => {
  const guard = createLatestRequestGuard();
  const pending = guard.start();
  guard.invalidate();
  assert.equal(guard.isCurrent(pending), false);
});
