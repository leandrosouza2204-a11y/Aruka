import { createMemoryDecisionRepository } from "../persistence/index.js";

export async function checkRepositoryConcurrency() {
  const repo = createMemoryDecisionRepository();
  const saves = await Promise.allSettled(Array.from({ length: 20 }, (_, index) => repo.save({ decisionId: `dec_${index}`, requestId: `req_${index}`, studentId: "student" })));
  return { passed: saves.every((item) => item.status === "fulfilled"), saved: (await repo.listByStudentId("student")).length };
}
