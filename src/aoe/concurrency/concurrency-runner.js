import { checkIdempotencyConcurrency } from "./idempotency-concurrency-check.js";
import { checkRepositoryConcurrency } from "./repository-concurrency-check.js";
import { summarizeConcurrency } from "./concurrency-result.js";

export async function runConcurrencyValidation() {
  const idempotency = await checkIdempotencyConcurrency();
  const repository = await checkRepositoryConcurrency();
  return summarizeConcurrency([
    { name: "idempotency same key and conflicts", ...idempotency },
    { name: "repository parallel saves", ...repository },
  ]);
}
