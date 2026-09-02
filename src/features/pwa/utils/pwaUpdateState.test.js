import assert from "node:assert/strict";
import { test } from "node:test";
import { getUpdatePromptCopy, shouldShowUpdatePrompt } from "./pwaUpdateState.js";

test("update prompt aparece somente com worker esperando e sem treino ativo", () => {
  assert.equal(shouldShowUpdatePrompt({ hasWaitingWorker: true }), true);
  assert.equal(shouldShowUpdatePrompt({ hasWaitingWorker: false }), false);
  assert.equal(
    shouldShowUpdatePrompt({ hasWaitingWorker: true, activeWorkout: true }),
    false
  );
  assert.equal(
    shouldShowUpdatePrompt({ hasWaitingWorker: true, updateDismissed: true }),
    false
  );
});

test("copy de update exige acao explicita do usuario", () => {
  const copy = getUpdatePromptCopy();

  assert.match(copy.title, /Nova versão/);
  assert.equal(copy.actionLabel, "Atualizar");
  assert.equal(copy.laterLabel, "Depois");
});
