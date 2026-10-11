# Aruka G2 isolated backup restore â€” 20261011-02

DECISION: PASS

## Backup

- File: B:\Aruka\Recovery\20261008-213100Z\backups\aruka-production-20261011-143722Z.dump
- SHA-256: 7C95D044F7F4A6483B3B9EE0E7CA70E8B1FB35A361D31EB7FD9D3246D9D94E91
- Size: 632622 bytes
- Integrity: PASS on host and inside the isolated container
- Format/catalog: PostgreSQL custom dump; 850 catalog output lines, 841 archive TOC entries, 835 selected catalog records
- Coverage: database only; Supabase Storage object bytes are not included

## Restore

- Environment: aruka-g2-restore-20261011-02 using public.ecr.aws/supabase/postgres:17.6.1.143
- Isolation: Docker network none, zero published ports, restart policy no
- Persistence: exclusive named volume aruka-g2-restore-20261011-02-data
- Configuration: wal_level=logical; pg_stat_statements,pg_cron,pg_net preloaded; cron and pg_net bound to database postgres
- pg_restore: exit 0; 71/71 catalog data blocks processed; zero errors; zero warnings; 12.815 seconds

## Validation

- Schemas: auth,extensions,graphql,graphql_public,pgbouncer,public,realtime,storage,supabase_migrations,vault
- Extensions: pg_cron:1.6.4,pg_net:0.20.3,pg_stat_statements:1.11,pgcrypto:1.3,supabase_vault:0.3.1,uuid-ossp:1.1
- Dump-owned tables/functions/sequences: 69/95/2
- Foreign keys: 81/81 validated; 0 orphan rows
- RLS/policies: 55/83
- Invalid indexes: 0
- Expected NOT VALID constraints: 1 (realtime.messages.messages_payload_exclusive); violating rows: 0
- Restored data: 34 non-empty tables; 676 total rows across 69 dump-owned tables
- Critical reads: auth.users=8; alunos=30; treinos=8; treino_exercicios=76; workout_execution_sessions=3
- Migration history: 25 rows; latest 20260909110000
- Critical PostgreSQL log lines: 0
- Failures: None.

## Evidence

- Full restore log: pg-restore-full.txt
- Validation output: validation-results.txt
- PostgreSQL log: postgres-log.txt
- Machine-readable report: report.json
- Persistent checkpoint: checkpoint.json

## Corrections applied

1. Replaced the partial pg_cron-only attempt with a clean, uniquely labeled instance.
2. Preloaded pg_net, pg_cron, and pg_stat_statements before restore.
3. Bound cron.database_name and pg_net.database_name to the restored postgres database.
4. Used a persistent volume and did not restart PostgreSQL PID 1.
5. Set wal_level=logical before restore so the publication is recreated without warnings.
6. Copied the custom dump with docker cp and revalidated its bytes inside the container.
7. Preserved the dump's intentional NOT VALID state for realtime.messages.messages_payload_exclusive and verified zero violating rows.

## Final gate

G2 is PASS for the database backup. No production connection, migration, deployment, or production write occurred. The next gate is ready for evidence review; the 15 production migrations remain unauthorized and were not executed.
