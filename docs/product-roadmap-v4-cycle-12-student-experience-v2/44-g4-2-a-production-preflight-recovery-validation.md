# G4.2-A production preflight and recovery validation

DECISION: `READY_FOR_PRODUCTION_MIGRATION`

G4.2-A completed the authorized read-only production preflight and local recovery validation. Production remains on 25 migrations, ending at `20260909110000`; the approved 16-migration chain remains pending, and Student Experience V2 remains OFF/fail-closed.

## Recovery evidence

A fresh PostgreSQL custom, database-only dump was created and independently validated. Its size is 758,846 bytes and SHA-256 is `BCD249D670596B1F9B0D0A45AC33B0A85E953917398DB884742AC80175E34E1B`. The archive catalog was readable, and an isolated PostgreSQL 17.6 restore completed with zero restore errors, zero foreign-key orphans and zero invalid indexes. Storage object bytes are not included.

The current snapshot was rehearsed in a mission-owned Docker clone with networking disabled and no published ports. All 16 pending migrations passed in the approved operational order, moving the clone history from 25 to 41. Critical row counts were preserved, the rollout remained OFF, runtime RLS/grant checks passed, and anonymous execution of privileged `SECURITY DEFINER` functions was zero after hardening.

The canonical LF SHA-256 of `20261011232512_harden_privileged_function_execution.sql` is `8673CF833854A1FA6F3572E8E4D1121F1D2E51CABE65CB367FA18D6A1A58EB21`. A different raw worktree hash on Windows is attributable only to CRLF line endings; package preparation normalizes LF and fails closed on any content mismatch.

## QA and operational state

- Recovery and deployment tooling tests: 15/15 PASS.
- Student Experience V2 domain tests: 54/54 PASS.
- Login, routing and workout-session compatibility tests: 28/28 PASS.
- Migration, RLS, security and rollout runtime validators: PASS.
- ESLint: PASS.
- Vite build: PASS, 2,069 modules.
- Current Vercel Production deployment: READY; canonical root and login route return HTTP 200.
- Production writes, migrations, Storage/Auth/RLS changes, Vercel configuration changes and deployments during G4.2-A: zero.

The protected evidence set contains the backup manifest, restore report, rehearsal report, security validation, operational checklist, G4.2-B runbook, risk matrix, checkpoints and a prepared-but-not-executed 16-step package. No credentials, tokens, personal data, photographs, dumps or private production inventories are included in Git.

Two fail-closed local observations were resolved and preserved in the private evidence. Restore attempt 01 stopped because the isolated fixture lacked the managed `dashboard_user` role; the runner was corrected and a fresh attempt 02 passed. The security harness also initially treated an expected permission denial in an already-protected pre-state as fatal; it now accepts only denial of the two explicitly tested privileged functions, and the complete validation passed. Neither event connected to or changed production.

## G4.2-B gate

`READY_FOR_PRODUCTION_MIGRATION` is a technical readiness result, not authorization to modify production. G4.2-B still requires a separate explicit authorization, named operators, a scheduled window, confirmed freeze, active monitoring and a fresh snapshot immediately before execution if production may have changed. Any history, hash, health or rollout mismatch is a NO-GO condition.

The eight existing `avaliacoes-fotos` objects remain covered only by the previously recorded owner waiver for confirmed test data. That waiver does not apply to new objects, real student files or other buckets. No Storage object was read, copied or deleted in this mission.
