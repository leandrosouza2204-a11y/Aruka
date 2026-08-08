# Reference-Only Baseline Separation

## Problema

O primeiro `supabase db push --dry-run` pos-alinhamento retornou `BLOCKED_DB_PUSH_BASELINE_WOULD_BE_APPLIED`.

## Resultado Do Dry-Run

- `DB_PUSH_DRY_RUN_EXIT_CODE=1`
- `DRY_RUN_PENDING_MIGRATION_COUNT=1`
- `DRY_RUN_PENDING_VERSIONS=20260716090000`
- `DRY_RUN_BASELINE_PENDING=YES`
- `DRY_RUN_AUTHORIZED_HISTORY_MIGRATIONS_PENDING=NO`
- `DRY_RUN_UNEXPECTED_MIGRATION_COUNT=0`
- `DB_PUSH_EXECUTED=NO`
- `PRODUCTION_MUTATION_EXECUTED=NO`

## Root Cause

`REFERENCE_ONLY_BASELINE_LOCATED_IN_EXECUTABLE_SUPABASE_MIGRATIONS_DIRECTORY`

A CLI se comportou corretamente: havia `7` arquivos em `supabase/migrations/`, mas o remote history canonico continha apenas as `6` migrations autorizadas. Assim, a baseline `20260716090000` foi reportada como pendente.

## Baseline Classification

`20260716090000_baseline_aruka_v1.sql` permanece `REFERENCE_ONLY_BASELINE`.

Ela nao representa uma migration executavel para a producao atual.

## Por Que Nao Usar Migration Repair

Marcar a baseline como applied criaria history artificial. O registry remoto confirmado nao contem a baseline e nao deve ser alterado para esconder uma decisao de layout local.

## Por Que Nao Usar Db Push

Executar `db push` real tentaria aplicar uma baseline historica contra uma producao ja existente. Isso e explicitamente bloqueado.

## Novo Local Da Baseline

- Antes: `supabase/migrations/20260716090000_baseline_aruka_v1.sql`
- Depois: `supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql`

`supabase/reference-baselines/**` e `NON_EXECUTABLE_DATABASE_REFERENCE`. Arquivos nesse diretorio nao devem ser enviados automaticamente por `supabase db push` ou `supabase migration up`.

## Hash Preservation

- `BASELINE_SHA256_BEFORE=67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B`
- `BASELINE_SHA256_AFTER=67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B`
- `BASELINE_CONTENT_PRESERVED=YES`

## Executable Migrations

- `EXECUTABLE_MIGRATION_COUNT=6`
- `REFERENCE_ONLY_BASELINE_COUNT=1`
- `TOTAL_DATABASE_CHANGE_ARTIFACT_COUNT=7`

Executable versions:

- `20260728030000`
- `20260730090000`
- `20260731190000`
- `20260801143335`
- `20260801173000`
- `20260801180000`

## Remote History

- `CANONICAL_REGISTRY_PRESENT=YES`
- `REMOTE_HISTORY_COUNT=6`
- `AUTHORIZED_PRESENT_COUNT=6`
- `BASELINE_HISTORY_PRESENT=NO`
- `UNEXPECTED_HISTORY_COUNT=0`
- `HISTORY_ALIGNMENT_VALIDATED=YES`

## Impacto No Supabase CLI

Com a baseline fora de `supabase/migrations/`, a CLI deixa de trata-la como migration executavel. O proximo dry-run deve observar se ainda existe qualquer migration pendente sem executar `db push` real.

## Proximo Dry-Run

Executar manualmente:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -NoExit -File C:\Backups\Aruka\run-production-db-push-dry-run.ps1
```

`DB_PUSH_ALLOWED` continua `NO`.
