# Reference Baseline CI Contract

The historical baseline `20260716090000_baseline_aruka_v1.sql` is a reference-only artifact at:

`supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql`

It must remain out of `supabase/migrations/` in the repository.

Production contract:

- Executable migration chain: 6 incremental migrations.
- Reference baseline count: 1.
- DB push needed: no.
- Production history remains aligned to the 6 executable migrations.

Fresh local/CI bootstrap contract:

- Materialize the reference baseline ephemerally before `supabase start` or `supabase db reset`.
- Apply the reference baseline first, then the 6 incremental migrations.
- Remove the temporary executable baseline after the runner completes.
- Never commit the temporary baseline under `supabase/migrations/`.
