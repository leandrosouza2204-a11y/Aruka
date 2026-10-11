# Cycle 12 — G2 isolated production backup restore

## Decision

`G2_DATABASE_BACKUP_RESTORE=PASS`

The production database backup was restored in a clean, isolated PostgreSQL 17.6 instance and validated without connecting to production. The backup is database-only; Supabase Storage object bytes remain outside its scope.

Canonical evidence: `reports/aruka-g2-restore-20261011-02/report.md` and `report.json`.

## Reusable runner

Run from a Windows PowerShell 5.1 session with Docker available:

```powershell
powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass `
  -File .\scripts\invoke-aruka-g2-isolated-restore.ps1 `
  -BackupPath 'B:\Aruka\Recovery\20261008-213100Z\backups\aruka-production-20261011-143722Z.dump' `
  -RunId 'YYYYMMDD-NN'
```

The runner fails closed on a hash or catalog mismatch, an existing resource identity mismatch, a partial restore, lost isolation, `pg_restore` errors or warnings, missing extensions, object-count drift, invalid indexes, unexpected constraint state, referential-integrity failures, or critical PostgreSQL log entries.

Each `RunId` owns exactly one labeled container and one labeled volume. The runner never removes Docker resources. A completed labeled container is resumable: subsequent runs revalidate the backup, container identity, isolation, database, and evidence without rerunning `pg_restore`. If an incomplete container contains partial application tables, the runner refuses reuse and requires a new `RunId`.

## Isolation and compatibility

- Image: `public.ecr.aws/supabase/postgres:17.6.1.143`.
- Network: `none`.
- Published ports: zero.
- Persistent storage: exclusive named Docker volume.
- Preloaded libraries: `pg_stat_statements`, `pg_cron`, and `pg_net`.
- Database bindings: `cron.database_name=postgres` and `pg_net.database_name=postgres`.
- Logical replication compatibility: `wal_level=logical` before restore.
- Backup transfer: binary-safe `docker cp`, followed by SHA-256 and byte-size verification inside the container.
- PostgreSQL PID 1 is never restarted.

## Validations

The SQL validator checks expected schemas and extensions, dump-owned tables/functions/sequences, 81 validated foreign keys, all foreign-key rows for orphans, policies/RLS, invalid indexes, expected constraint state, migration history, aggregate row presence, and read-only counts on critical application tables.

`realtime.messages.messages_payload_exclusive` is intentionally `NOT VALID` in the dump. The restore preserves that exact state and the validator proves that the restored table contains zero violating rows.

## Next gate

The next gate is the separately authorized Student Experience V2 production migration gate. This G2 result does not authorize the 15 production migrations, a deployment, or any production write. Before that gate, reviewers must accept this evidence and make an explicit decision about separate Supabase Storage file coverage.

## References

- [Supabase self-hosted PostgreSQL 17 change](https://supabase.com/changelog/46080-self-hosted-supabase-upgrading-from-pg-15-to-17-breaking-change)
- [Supabase pg_net configuration](https://github.com/supabase/pg_net)
