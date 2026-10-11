# G3 production migration readiness runbook

## Status

`NOT_READY`. This is an operational plan only. It does not authorize a production connection, migration, repair, deployment, rollout change or any other write.

The isolated production-copy rehearsal proves the 15-file chain and its recovery checkpoints. Production execution is nevertheless stopped because two inherited `SECURITY DEFINER` functions were proven writable by `anon` with synthetic data. Security remediation and a new complete rehearsal are mandatory first.

## Hard prerequisite: security remediation

Create a new forward-only migration; do not edit or reorder the existing 15 source files. The remediation must:

1. enumerate every public `SECURITY DEFINER` signature and define an explicit execute allowlist;
2. revoke `PUBLIC` and `anon` execute from all non-public entry points;
3. make `processar_encerramento_automatico_aluno(...)` internal/service-only or bind its professional/student identifiers to a trusted authenticated caller;
4. make `aoe_idempotency_get_or_create(...)` internal/service-only or derive actor/organization identity from trusted context;
5. pin privileged functions to an empty or otherwise provably safe `search_path` with qualified object names;
6. preserve only the minimum authenticated/service-role grants;
7. add negative runtime tests for anon and cross-tenant calls;
8. repeat restore, complete pending-chain rehearsal, integrity, application and CI gates on a fresh production backup.

Until those steps pass, stop before any production write.

## Future preflight

All items require recorded evidence and two-operator review:

- explicit change authorization and ticket;
- `main == origin/main`, clean mission worktree, expected migration hashes;
- fresh read-only production history and schema/security fingerprint;
- exact project identity and no concurrent migration/deploy;
- current verified database backup and accepted restore RTO;
- explicit Storage recovery decision; never describe database-only backup as full DR;
- maintenance active: write, login, background-job and deploy freeze;
- rollout OFF, emergency false, zero real targets;
- security remediation migration present and its isolated rehearsal PASS;
- dry-run output exactly matches the newly approved pending set.

Any mismatch means `ABORT_BEFORE_FIRST_WRITE`. Never use `migration repair` to conceal history/schema divergence.

## Approved sequence after remediation and separate authorization

Use the pinned Supabase CLI version approved by the future change record. Build temporary manifests byte-for-byte; never modify repository migrations.

1. Push P01–P03; require history 28 and the intended function/grant checkpoint.
2. Push P04–P06; validate canonical reads, Home and Library.
3. Push P07–P10; validate Player, set tracking, server clock and completion feedback.
4. Push P11–P12; require history 37 and the expected pre-reconciliation fingerprint.
5. Push reconciliation `20261004133801` from a manifest that excludes hardening and rollout; require history 38, canonical policies, default ACL and the full privileged-function remediation matrix.
6. Run a full physical manifest dry-run with `--include-all`; its missing set must be exactly the older hardening, rollout foundation and the new security remediation in the approved logical order. If the new version cannot preserve this ordering, redesign and rehearse the manifest—do not improvise.
7. Apply the approved include-all manifest serially. Require direct-auth expressions 0, optimized expressions 69, all security negative tests PASS, rollout OFF, emergency false and targets 0.
8. Require final migration list equality and an empty next dry-run.
9. Run authenticated student smoke tests while maintenance remains active: route decision, Home, Library/detail, start/resume, set completion, skip, rest clock, completion feedback, Evolution and Profile.
10. Reopen services in the approved order while keeping rollout OFF; observe errors, locks, auth, jobs and latency before ending the freeze.

Do not copy these commands into production until the new migration changes the expected pending inventory and a new evidence package records the exact manifests/hashes.

## Stop conditions

Stop immediately on unexpected project/history/hash/schema/policy/function/ACL; unavailable backup/restore operator; writes during freeze; unknown long lock; migration absent from history after uncertain commit; any anon privileged write; cross-professional/student visibility; rollout not OFF; nonzero target; invalid index; orphan; row-count loss; Storage assumption mismatch; or dry-run output different from the approved manifest.

Keep maintenance active. If a migration is absent and atomic rollback is proven, retry only from the missing checkpoint. If commit state is uncertain, data integrity changes, or history/schema diverges, restore using the separately approved recovery procedure. Do not mark history manually without DBA authorization and exact schema proof.

## Evidence boundary

The full Markdown/JSON report, restore logs, catalog and per-migration outputs are retained only in the restricted local recovery evidence directory. They are intentionally excluded from Git because the remote destination has not been approved for production-derived metadata. The repository retains the reproducible runner, validators and synthetic security proof.

- The clean isolated restore, all pending migrations, integrity checks and application QA completed.
- History advanced from the exact restored prefix to the exact repository set.
- Critical row counts remained unchanged; FK orphan and invalid-index checks returned zero.
- Rollout remained OFF with no targets.
- Security blocker proof: `scripts/sql/audit-aruka-g3-legacy-definer-runtime.sql`; all synthetic rows are rolled back.

## Storage recovery boundary

The backup is database-only and does not preserve Storage object bytes. The restricted local evidence records the observed bucket/object aggregates. Student V2 missing media is non-blocking by design, but a separately authorized object-byte backup is still required before full disaster-recovery coverage can be claimed.
