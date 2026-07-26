# Workout Library Data Integrity v1 - Summary

Decision: `READY_WITH_LIMITATIONS`

The cycle added an executable canonical workout template contract, normalized workout status handling, and replaced client-side multi-step workout persistence with the transactional RPC `public.salvar_treino_composto(jsonb)`.

The RPC is now integrated through the official baseline flow: function in `supabase/baseline-src/05-functions.sql`, grants in `supabase/baseline-src/09-grants.sql`, regenerated candidate and active baseline, and archived incremental SQL at `supabase/migrations-archive/20260725093000_workout_atomic_persistence.sql`.

Baseline SHA moved from `F7C580FD9677D4E2C6F28E2944CBA75BC17D0F88528F1372BFD3F1C0DC04000A` to `67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B`.

Follow-up review confirmed the `treino_exercicios` insert maps nine columns to nine values, including `descanso` between `carga` and `observacoes`, `video_url` from `v_exercise->>'video'`, and `ordem` from `v_exercise_index`. A static guard was added to `qa:supabase-baseline-src`.

Gate 3 local bootstrap failed in CI because runtime validation still expected 14 public functions. The baseline and manifest were already correct with 15 functions after adding `public.salvar_treino_composto(jsonb)`. The local runtime validators now derive structural counts from `supabase/baseline-candidate/manifest.json`; the baseline SHA and RPC SQL did not change.

Resolved or reduced:

- `WL-AUDIT-001`: creation now uses a single transactional RPC.
- `WL-AUDIT-003`: update still replaces days/exercises, but inside the RPC transaction.
- `WL-AUDIT-005`: canonical contract is now executable and documented.
- `WL-AUDIT-007`: status values are centralized and legacy accent variant is accepted.
- `WL-AUDIT-004`: missing `workout_templates` table now emits dev/QA diagnostics while preserving compatibility.
- CI root cause fixed: `qa:supabase-ci-static` rejected the incremental active migration because the repository enforces one official baseline SQL in `supabase/migrations`.

Limitations:

- Supabase local runtime was not applied/reset because Docker/Supabase local is unavailable in this environment.
- Rollback transaction behavior remains `ROLLBACK_RUNTIME_NOT_PROVEN` until local Supabase is operational.
- Representative CDP runner was blocked because `.env` is absent.
- Deep database validation of `template_data` was intentionally deferred to avoid brittle JSONB constraints before more real usage.
