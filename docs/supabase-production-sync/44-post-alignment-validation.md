# Post-Alignment Validation

## Objetivo

Validar o estado pos-alinhamento do Supabase apos o fechamento do Production Migration History Alignment, sem executar `db push`, `migration up`, `migration repair`, link persistente ou qualquer mutacao remota.

## Contexto

- Branch: `feat/workout-delivery-integration-v1`
- Head esperado: `8e857ce`
- History Alignment: executado e validado
- Remote history count esperado: `6`
- Baseline: `REFERENCE_ONLY_BASELINE`
- DB push: bloqueado

## Local Migrations

Foram revalidados `7` artefatos locais de mudanca de banco:

- `EXECUTABLE_MIGRATION_COUNT=6`
- `REFERENCE_ONLY_BASELINE_COUNT=1`
- `TOTAL_DATABASE_CHANGE_ARTIFACT_COUNT=7`

A baseline `20260716090000_baseline_aruka_v1.sql` continua classificada como reference-only e foi separada do diretorio executavel em `supabase/reference-baselines/`.

`LOCAL_MIGRATION_HASHES_PRESERVED=YES`

## Remote History

O ultimo postcheck final versionado pelo fechamento do History Alignment confirmou:

- `CANONICAL_REGISTRY_PRESENT=YES`
- `REMOTE_HISTORY_COUNT=6`
- `AUTHORIZED_PRESENT_COUNT=6`
- `BASELINE_PRESENT=NO`
- `UNEXPECTED_HISTORY_COUNT=0`

Versoes autorizadas:

- `20260728030000`
- `20260730090000`
- `20260731190000`
- `20260801143335`
- `20260801173000`
- `20260801180000`

## CLI x Psql

O runner externo read-only foi executado manualmente para comparar `supabase migration list --db-url` com consulta direta via Docker/psql:

`C:\Backups\Aruka\run-post-alignment-validation.ps1`

Resultado registrado:

- `CLI_MIGRATION_LIST_EXIT_CODE=0`
- `CLI_REMOTE_HISTORY_COUNT=6`
- `PSQL_REMOTE_HISTORY_COUNT=6`
- `CLI_PSQL_HISTORY_MATCH=YES`
- `CANONICAL_REGISTRY_PRESENT=YES`
- `AUTHORIZED_PRESENT_COUNT=6`
- `BASELINE_PRESENT=NO`
- `UNEXPECTED_HISTORY_COUNT=0`
- `ROLLBACK_CONFIRMED=YES`
- `HISTORY_MUTATION_EXECUTED=NO`
- `PRODUCTION_MUTATION_EXECUTED=NO`

## Baseline

`BASELINE_HISTORY_PRESENT=NO`

O output da CLI informou `CLI_BASELINE_VISIBLE=YES`. Isso significa que a CLI conhece a migration local `20260716090000_baseline_aruka_v1.sql`; nao significa que ela esteja registrada como aplicada no history remoto.

A fonte canonica para o history remoto e a consulta direta em `supabase_migrations.schema_migrations`, que confirmou `BASELINE_PRESENT=NO`.

`CLI_BASELINE_VISIBILITY_CLASSIFICATION=LOCAL_MIGRATION_VISIBLE_NOT_REMOTE_HISTORY`

O primeiro `supabase db push --dry-run` confirmou que manter a baseline dentro de `supabase/migrations/` fazia a CLI considera-la pendente. Isso foi classificado como `BLOCKED_DB_PUSH_BASELINE_WOULD_BE_APPLIED`, com root cause `REFERENCE_ONLY_BASELINE_LOCATED_IN_EXECUTABLE_SUPABASE_MIGRATIONS_DIRECTORY`.

A correcao local e separar a baseline para `supabase/reference-baselines/`, preservando o conteudo e mantendo `BASELINE_HISTORY_PRESENT=NO`.

## Pending Migrations

Modelo aprovado:

- Local migrations: `7`
- Baseline reference-only: `1`
- Remote applied authorized migrations: `6`

`PENDING_EXECUTABLE_MIGRATION_COUNT=0`

## Db Push Capability

`supabase db push --help` na CLI `2.111.0` lista `--dry-run` como flag que imprime as migrations que seriam aplicadas sem aplica-las.

`DB_PUSH_DRY_RUN_SUPPORTED=YES`

Primeiro dry-run:

- `DB_PUSH_DRY_RUN_EXIT_CODE=1`
- `DRY_RUN_PENDING_MIGRATION_COUNT=1`
- `DRY_RUN_PENDING_VERSIONS=20260716090000`
- `DRY_RUN_BASELINE_PENDING=YES`
- `DRY_RUN_AUTHORIZED_HISTORY_MIGRATIONS_PENDING=NO`
- `DRY_RUN_UNEXPECTED_MIGRATION_COUNT=0`

`DB_PUSH_EXECUTED=NO`

`DB_PUSH_ALLOWED=NO`

## CI/CD Review

O workflow encontrado e `supabase-local-quality-gates.yml`. Ele executa gates locais de Supabase e nao contem `supabase db push` automatico de producao.

`CI_REVIEW_ONLY=YES`

`CI_CD_CLASSIFICATION=CI_CD_READY_FOR_REVIEW`

## Riscos

- O dry-run remoto ainda nao foi executado.
- A validacao CLI/psql remota pos-alignment foi concluida manualmente com credenciais locais.
- Nenhum workflow deve executar mutacao de producao automaticamente apos merge.

## Decisao

`READY_FOR_POST_ALIGNMENT_AND_DRY_RUN_COMMIT`

## Non-Mutating DB Push Dry-Run

O primeiro dry-run encontrou a baseline `20260716090000` como pendente porque ela ainda estava no diretorio executavel `supabase/migrations/`.

A baseline foi separada para `supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql` como `NON_EXECUTABLE_DATABASE_REFERENCE`, com hash preservado.

O segundo dry-run nao mutavel confirmou:

- `DB_PUSH_DRY_RUN_EXIT_CODE=0`
- `DRY_RUN_PENDING_MIGRATION_COUNT=0`
- `DRY_RUN_PENDING_VERSIONS=`
- `DRY_RUN_BASELINE_PENDING=NO`
- `DRY_RUN_AUTHORIZED_HISTORY_MIGRATIONS_PENDING=NO`
- `DRY_RUN_UNEXPECTED_MIGRATION_COUNT=0`
- `DB_PUSH_NEEDED=NO`
- `DB_PUSH_EXECUTED=NO`
- `PRODUCTION_MUTATION_EXECUTED=NO`

Producao permanece inalterada.

## Proximo Passo

`NEXT_ACTION=COMMIT_POST_ALIGNMENT_AND_DRY_RUN_THEN_REVIEW_CI_CD`
