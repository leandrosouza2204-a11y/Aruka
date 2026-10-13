# G4.2-PRE — Storage test-data risk acceptance

## Decision

`READY_FOR_G4_2_AUTHORIZATION`

The project owner formally chose `STORAGE_RECOVERY_DECISION=ACCEPT_DATABASE_ONLY` for the exact eight objects currently present in the private `avaliacoes-fotos` bucket. They are confirmed test data. Their future deletion is authorized but deferred, and no Storage object was deleted or downloaded by this mission.

This waiver does not cover a new object, a real student file, another bucket, or an inventory change. Any such drift requires a new decision.

## Read-only verification

- Project `vrizeuhuhvtvbrmtvdik` is healthy.
- `avaliacoes-fotos`: private, 8 objects, 2,113,714 bytes; sanitized inventory fingerprint unchanged.
- `exercise-media`: private, 0 objects.
- Production migration history: 25 entries, latest `20260909110000`.
- Pending package: 16 migrations; canonical hashes remain represented by the protected package manifest.
- Student Experience V2 rollout table and resolver remain absent; rollout is OFF.
- The existing PostgreSQL dump, isolated restore evidence and protected G4.2 package remain available and hash-verifiable.
- The recovery volume remains healthy, fully encrypted with BitLocker and protected by the run-directory ACL.

## Referential impact

Six of the eight Storage objects are referenced exactly six times by `public.avaliacoes.foto_frente_url`, `foto_lateral_url`, and `foto_costas_url`. Those references occur across two evaluation rows associated with two student records and two owner records. The other two objects are unreferenced. No database view or stored function directly depends on these URL columns.

Deleting the six referenced objects in a future operation without separately authorized database cleanup will leave broken photo references. The columns are nullable, but clearing them is production DML and requires its own authorization. The future cleanup procedure therefore fails closed on inventory drift, requires a fresh database snapshot and freeze, and distinguishes Storage deletion authorization from database-reference cleanup authorization.

## Remaining G4.2 prerequisites

- Fresh PostgreSQL snapshot and isolated validation immediately before the window.
- Named operator, reviewer, recovery custodian and monitoring owner.
- Explicitly confirmed freeze; it is not currently active.
- Vercel linkage/deployment precheck without configuration changes.
- Revalidation of history, all 16 migration hashes, Student V2 OFF and V1 fallback health.
- Separate formal authorization before migrations, deployment, Storage cleanup, database cleanup or rollout activation.

## Safety outcome

`BACKUP_STORAGE=WAIVED_BY_OWNER`

`STORAGE_RECOVERY_RISK=ACCEPTED_FOR_TEST_DATA`

`DATABASE_BACKUP=FRESH_SNAPSHOT_STILL_REQUIRED`

`PRODUCTION_MIGRATIONS=NOT_AUTHORIZED`

`STUDENT_V2_ROLLOUT=NOT_AUTHORIZED`

No production mutation, Storage deletion, migration, deployment, Auth change, RLS change, Vercel configuration change or Student V2 activation occurred.
