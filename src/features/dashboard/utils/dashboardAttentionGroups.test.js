import assert from "node:assert/strict";
import test from "node:test";
import {
  getVisibleAttentionItems,
  groupCoachAttentionQueue,
} from "./dashboardAttentionGroups.js";

function item(id, code, priority = "REVIEW") {
  return { id, title: code, priority, signals: [{ code }] };
}

test("groupCoachAttentionQueue agrupa pendências por categoria e prioridade", () => {
  const groups = groupCoachAttentionQueue([
    item("finance-1", "FINANCE_ATTENTION"),
    item("workout-1", "NO_ACTIVE_WORKOUT", "ACTION_REQUIRED"),
    item("finance-2", "FINANCE_ATTENTION"),
  ]);

  assert.deepEqual(groups.map((group) => group.id), ["treinos", "financeiro"]);
  assert.equal(groups[1].items.length, 2);
});

test("getVisibleAttentionItems limita a prévia a três e permite ver todos", () => {
  const group = { items: [1, 2, 3, 4, 5] };
  assert.deepEqual(getVisibleAttentionItems(group), [1, 2, 3]);
  assert.deepEqual(getVisibleAttentionItems(group, true), [1, 2, 3, 4, 5]);
});
