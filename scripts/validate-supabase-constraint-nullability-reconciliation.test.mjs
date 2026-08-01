import assert from "node:assert/strict";
import test from "node:test";
import { validateConstraintNullabilityReconciliation } from "./validate-supabase-constraint-nullability-reconciliation.mjs";

const validCombined = `begin;
alter table public.alunos
  alter column created_at set not null,
  alter column user_id set not null,
  alter column whatsapp set not null;
commit;`;

test("passes exactly the three approved columns", () => {
  assert.deepEqual(validateConstraintNullabilityReconciliation(validCombined), []);
});

test("passes equivalent separate statements", () => {
  const sql = `begin;
alter table public.alunos alter column created_at set not null;
alter table public.alunos alter column user_id set not null;
alter table public.alunos alter column whatsapp set not null;
commit;`;
  assert.deepEqual(validateConstraintNullabilityReconciliation(sql), []);
});

test("allows transaction wrapper", () => {
  assert.deepEqual(validateConstraintNullabilityReconciliation(validCombined), []);
});

for (const column of ["inicio", "pagamento_recebido", "plano", "status", "valor", "acompanhamento_motivo", "observacoes"]) {
  test(`rejects forbidden column ${column}`, () => {
    const sql = `${validCombined}\nalter table public.alunos alter column ${column} set not null;`;
    assert.match(validateConstraintNullabilityReconciliation(sql).join("\n"), new RegExp(column));
  });
}

test("rejects a fourth column", () => {
  const sql = `${validCombined}\nalter table public.alunos alter column nome set not null;`;
  assert.match(validateConstraintNullabilityReconciliation(sql).join("\n"), /nome set not null/);
});

for (const [label, sql] of [
  ["UPDATE", `${validCombined}\nupdate public.alunos set whatsapp = 'x';`],
  ["policy", `${validCombined}\ncreate policy "x" on public.alunos for select using (true);`],
  ["grant", `${validCombined}\ngrant select on table public.alunos to authenticated;`],
  ["function", `${validCombined}\ncreate function public.x() returns void language sql as $$ select 1 $$;`],
  ["add column", `${validCombined}\nalter table public.alunos add column x text;`],
  ["student_user_id", `${validCombined}\n-- student_user_id\nalter table public.alunos alter column student_user_id set not null;`],
  ["lifecycle", `${validCombined}\n-- lifecycle`],
  ["constraint", `${validCombined}\nalter table public.alunos add constraint alunos_x_check check (true);`],
]) {
  test(`rejects ${label}`, () => {
    assert.notDeepEqual(validateConstraintNullabilityReconciliation(sql), []);
  });
}
