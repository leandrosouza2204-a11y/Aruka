# Workout Library Data Integrity v1 - Summary

Decision: `READY_WITH_LIMITATIONS`

The cycle added an executable canonical workout template contract, normalized workout status handling, and replaced client-side multi-step workout persistence with the transactional RPC `public.salvar_treino_composto(jsonb)`.

Resolved or reduced:

- `WL-AUDIT-001`: creation now uses a single transactional RPC.
- `WL-AUDIT-003`: update still replaces days/exercises, but inside the RPC transaction.
- `WL-AUDIT-005`: canonical contract is now executable and documented.
- `WL-AUDIT-007`: status values are centralized and legacy accent variant is accepted.
- `WL-AUDIT-004`: missing `workout_templates` table now emits dev/QA diagnostics while preserving compatibility.

Limitations:

- Supabase local runtime was not applied/reset in this cycle.
- Representative CDP runner was blocked because `.env` is absent.
- Deep database validation of `template_data` was intentionally deferred to avoid brittle JSONB constraints before more real usage.
