# Production Migration History Alignment Apply

## Objetivo

Registrar o fechamento do Production Migration History Alignment em producao, limitado ao registry canonico `supabase_migrations.schema_migrations`.

## Autorizacao

A execucao foi autorizada para seis migrations aprovadas, via Supabase CLI `2.111.0`, usando `--db-url`, sem link persistente e sem `db push`.

## Estado Inicial

O registry canonico estava ausente antes da fase de alignment. A baseline local `20260716090000_baseline_aruka_v1.sql` foi mantida apenas como referencia.

## Baseline Excluida

`20260716090000` continuou `REFERENCE_ONLY_BASELINE`.

`BASELINE_REPAIR_AUTHORIZED=NO`

`BASELINE_REPAIR_EXECUTED=NO`

## Repair 01

`20260728030000` foi marcado pela CLI como `applied`. O primeiro postcheck teve falso negativo, mas diagnosticos read-only posteriores confirmaram a persistencia da entrada no registry canonico.

`REPAIR_01_ALREADY_PERSISTED=YES`

`REPAIR_01_REEXECUTED=NO`

## Incidentes

Durante a execucao supervisionada foram corrigidos bugs de automacao sem alterar schema ou dados da aplicacao:

- PowerShell null Git output handling: saida vazia de `git status --short` agora e normalizada.
- Wildcard `[YOUR-PASSWORD]`: validacao trocada para `.Contains('[YOUR-PASSWORD]')`.
- History postcheck false negative: postcheck passou a consultar diretamente `supabase_migrations.schema_migrations`.
- Privilege diagnostic Start-Process argument shape: diagnosticos passaram a usar SQL montado como arquivo.
- SQL quote double escaping: SQL gerado passou a usar here-string single-quoted.

## Confirmacao Do Repair 01

O estado canonico confirmado antes da retomada era:

- `CANONICAL_REGISTRY_PRESENT=YES`
- `REMOTE_HISTORY_COUNT=1`
- `TARGET_01_PRESENT=YES`
- `TARGET_02_PRESENT=NO`
- `BASELINE_PRESENT=NO`
- `UNEXPECTED_HISTORY_COUNT=0`

## Retomada Da Migration 02

O runner foi corrigido para retomar a partir de `20260730090000`, sem reexecutar `20260728030000`.

## Repairs 02-06

As cinco migrations restantes foram marcadas uma por vez, com postcheck read-only apos cada repair:

- `20260730090000`
- `20260731190000`
- `20260801143335`
- `20260801173000`
- `20260801180000`

## Postcheck Final

O postcheck final confirmou:

- `REMOTE_HISTORY_COUNT=6`
- `AUTHORIZED_PRESENT_COUNT=6`
- `UNEXPECTED_HISTORY_COUNT=0`
- `BASELINE_PRESENT=NO`

## Registry Final

Versoes presentes:

- `20260728030000`
- `20260730090000`
- `20260731190000`
- `20260801143335`
- `20260801173000`
- `20260801180000`

## Schema Immutability

Os snapshots before/after de contagem do schema `public` nao foram persistidos pelo runner final. A conclusao de ausencia de mutacao funcional e documentada por:

- uso exclusivo de `supabase migration repair`;
- validacao previa em laboratorio de comportamento metadata-only;
- nenhum SQL remoto de aplicacao executado nesta fase;
- protecoes finais sem diff em migrations, `src`, `.github`, `package-lock.json` e SQLs de cutover.

`PUBLIC_SCHEMA_MUTATION_DETECTED=NO`

## Recovery

Recovery automatico nao foi executado.

`RECOVERY_EXECUTED=NO`

## Persistent Link

Nenhum link persistente foi criado.

`PERSISTENT_LINK_CREATED=NO`

## Db Push

`DB_PUSH_ALLOWED=NO`

Nenhum `db push`, `migration up`, CI/CD ou PR foi executado nesta fase.

## Resultado

`PRODUCTION_MIGRATION_HISTORY_ALIGNMENT_APPLIED_AND_VALIDATED`

## Proximo Passo

`NEXT_ACTION=COMMIT_HISTORY_ALIGNMENT_AND_PREPARE_POST_ALIGNMENT_VALIDATION`
