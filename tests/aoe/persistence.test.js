import test from "node:test";
import assert from "node:assert/strict";
import { createMemoryDecisionRepository, createMemoryUnitOfWork } from "../../src/aoe/index.js";

test("memory repositories save defensive copies and isolate instances", async () => {
  const repo = createMemoryDecisionRepository();
  const other = createMemoryDecisionRepository();
  const record = { decisionId: "dec_1", requestId: "req_1", studentId: "stu_1" };
  await repo.save(record);
  record.studentId = "mutated";
  const found = await repo.findById("dec_1");
  assert.equal(found.studentId, "stu_1");
  assert.equal(await other.findById("dec_1"), null);
});

test("memory unit of work rolls back on failure", async () => {
  const repo = createMemoryDecisionRepository();
  const uow = createMemoryUnitOfWork([repo]);
  await assert.rejects(() => uow.execute(async () => {
    await repo.save({ decisionId: "dec_rollback", requestId: "req", studentId: "stu" });
    throw new Error("boom");
  }));
  assert.equal(await repo.findById("dec_rollback"), null);
});
