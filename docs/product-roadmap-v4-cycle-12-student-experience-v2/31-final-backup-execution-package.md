# Cycle 12 — Final encrypted backup execution package

## Estado

```text
TECHNICAL_LOCAL_READINESS=READY
COLLECTION_AUTHORIZED=NO
WRITE_FREEZE_ACTIVE=NO
BACKUP_STARTED=NO
RESTORE_DRILL=PARTIAL
PRODUCTION_READINESS=NO_GO
```

Este é o procedimento único para a próxima etapa. Preparação e execução real são separadas: nenhum bloco da seção **Execução autorizada** pode ser usado antes de uma aprovação humana válida, credenciais temporárias e write freeze comprovado.

## Identidade e destino fixados

- Project ref: `vrizeuhuhvtvbrmtvdik`.
- Região: `us-east-2`.
- Endpoint S3: `https://vrizeuhuhvtvbrmtvdik.storage.supabase.co/storage/v1/s3`.
- Recovery root preparado: `B:\Aruka\Recovery\20261008-213100Z`.
- `B:`: `ARUKA_BACKUP`, NTFS, BitLocker `FullyEncrypted`, proteção `On`, `XtsAes256`, 100%.
- VHDX: `D:\ArukaBackup.vhdx`, apenas verificado; não modificar ou desmontar durante a coleta.
- ACL do recovery root: herança removida; `ANP\lsdsouza` e `SYSTEM`, `FullControl` explícito.
- Reserva mínima: 5 GiB. O destino tinha mais de 19 GiB livres na preparação.

## Toolchain imutável

O perfil canônico está em `scripts/config/aruka-recovery-toolchain.json`.

- Supabase CLI `2.120.0`, ZIP oficial com SHA-256 `0db5224fc5d92ae5f15e675ed65dad376967326921122ab8d9a78e790874c92e`.
- PostgreSQL client `17.6`: `public.ecr.aws/supabase/postgres@sha256:be60aee15997daca475b710b734bc6bfe52cd544dcd7e9fd2ff58210b6747d83`.
- AWS CLI `2.37.10`: `public.ecr.aws/aws-cli/aws-cli@sha256:3dacc5db57c923c4223e949795f538ecf1f2212b2b7d5a028b47b97f91564c0d`.
- Node.js `24.16.0`; Docker `29.8.0` na preparação.

A tag AWS `2.37.11` foi rejeitada porque o executável se identificou como `2.37.10`; o pacote usa tag/digest cuja versão executada coincide. Nunca substituir digests por `latest`.

## Verificação prévia local

Executar em PowerShell elevado, sem credenciais:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File scripts/validate-aruka-backup-execution-readiness.ps1 `
  -RecoveryRoot 'B:\Aruka\Recovery\20261008-213100Z'

powershell -NoProfile -ExecutionPolicy Bypass `
  -File scripts/initialize-aruka-recovery-credentials.ps1 `
  -RecoveryRoot 'B:\Aruka\Recovery\20261008-213100Z' `
  -DatabaseHost '<approved-session-pooler-or-direct-host>'
```

Resultados obrigatórios: readiness `PASS/READY`; credenciais `PLAN_ONLY`, sem prompts ou arquivos. O segundo comando só cria credenciais quando um humano acrescenta `-Create` e responde aos prompts seguros.

## Compatibilidade comprovada dos dumps

O `supabase db dump --dry-run` da CLI 2.120.0 foi executado com conexão sintética para roles, schema, data e histórico. O perfil versionado preserva:

- roles customizadas sem senhas e sem alterar roles reservadas;
- schema aplicativo, grants, policies, RLS, funções e triggers, excluindo schemas gerenciados;
- dados de `public`, `auth` e `storage`, além de outros schemas não internos;
- exclusão das tabelas de migration internas e das tabelas vetoriais incompatíveis;
- `supabase_migrations` em schema/data separados;
- oito registros de `storage.objects`, cujos bytes seguem por exportação S3 separada.

Os dumps snapshot-aware usam os mesmos filtros da CLI, registrados no JSON do toolchain, e depois passam por `normalize-supabase-snapshot-dump.mjs`. O raw é preservado, a saída normalizada é nova e o script nunca sobrescreve arquivo.

## Ações humanas obrigatórias

1. Preencher, fora do Git, o modelo `production-recovery-preflight-approval.template.json` e obter aprovação específica para coleta e freeze.
2. Obter host/porta/usuário do banco e credencial temporária, sem enviar valores ao chat.
3. Obter credencial temporária S3 baseada em session token/RLS. Access key plena permanece exceção separada.
4. Executar `initialize-aruka-recovery-credentials.ps1 ... -Create` localmente. Os valores são lidos com `Read-Host -AsSecureString` e gravados somente no volume criptografado com ACL restrita.
5. Ativar manutenção da aplicação, impedir ações do proprietário, pausar o cron ativo e impedir invocações das Edge Functions.
6. Confirmar duas leituras consecutivas com zero transações de escrita e estabilidade das contagens do Storage; preencher `write-freeze-evidence.json` como `ACTIVE`.

Se qualquer item falhar, não iniciar o backup.

## Execução autorizada

### 1. Variáveis não secretas e volume descartável de credencial

```powershell
$RecoveryRoot = 'B:\Aruka\Recovery\20261008-213100Z'
$ProjectRef = 'vrizeuhuhvtvbrmtvdik'
$Region = 'us-east-2'
$DbHost = '<approved-session-pooler-or-direct-host>'
$DbPort = '5432'
$DbUser = 'postgres.vrizeuhuhvtvbrmtvdik'
$DbName = 'postgres'
$PgImage = 'public.ecr.aws/supabase/postgres@sha256:be60aee15997daca475b710b734bc6bfe52cd544dcd7e9fd2ff58210b6747d83'
$AwsImage = 'public.ecr.aws/aws-cli/aws-cli@sha256:3dacc5db57c923c4223e949795f538ecf1f2212b2b7d5a028b47b97f91564c0d'
$Repo = (Resolve-Path '.').Path
$CredentialVolume = 'aruka-backup-credentials-20261008-213100Z'

docker volume create $CredentialVolume
docker run --rm --network none `
  --mount "type=bind,source=$RecoveryRoot\credentials,target=/source,readonly" `
  --mount "type=volume,source=$CredentialVolume,target=/run/secrets" `
  --entrypoint sh $PgImage `
  -c 'cp /source/pgpass.conf /run/secrets/pgpass && chmod 600 /run/secrets/pgpass'
```

Não avançar se o volume já existir, se o container retornar erro ou se o arquivo de origem estiver fora do recovery root.

### 2. Roles

```powershell
New-Item -ItemType Directory -Path "$RecoveryRoot\raw" -ErrorAction Stop
docker run --rm --network bridge `
  --mount "type=bind,source=$RecoveryRoot,target=/backup" `
  --mount "type=volume,source=$CredentialVolume,target=/run/secrets,readonly" `
  --env PGPASSFILE=/run/secrets/pgpass `
  --entrypoint pg_dumpall $PgImage `
  --host=$DbHost --port=$DbPort --username=$DbUser --database=$DbName `
  --roles-only --role=postgres --quote-all-identifiers --no-role-passwords --no-comments `
  --file=/backup/raw/roles.raw.sql

node scripts/normalize-supabase-snapshot-dump.mjs `
  --mode roles --input "$RecoveryRoot\raw\roles.raw.sql" `
  --output "$RecoveryRoot\roles.sql"
```

### 3. Snapshot keeper

No Console A, abrir `psql -qAt` na imagem pinada, com o volume de credenciais e o repositório montado read-only, e executar `scripts/sql/recovery-snapshot-keeper.sql`. Direcionar `snapshot_file` para `/backup/snapshot-id.transient.txt`. Manter o console aberto no prompt; não pressionar Enter antes da conclusão de todos os dumps e do inventário.

```powershell
docker run --rm -it --network bridge `
  --mount "type=bind,source=$RecoveryRoot,target=/backup" `
  --mount "type=bind,source=$Repo,target=/workspace,readonly" `
  --mount "type=volume,source=$CredentialVolume,target=/run/secrets,readonly" `
  --env PGPASSFILE=/run/secrets/pgpass `
  --entrypoint psql $PgImage -qAt -X -v ON_ERROR_STOP=1 `
  -h $DbHost -p $DbPort -U $DbUser -d $DbName `
  -v snapshot_file=/backup/snapshot-id.transient.txt `
  -f /workspace/scripts/sql/recovery-snapshot-keeper.sql
```

### 4. Dumps no mesmo snapshot

No Console B, ler o identificador transitório sem imprimi-lo e executar `pg_dump` na mesma imagem. Usar literalmente os filtros de `scripts/config/aruka-recovery-toolchain.json`: schema excludes para `schema.raw.sql`; data excludes e cinco exclusões de tabela para `data.raw.sql`; `supabase_migrations` para os dois arquivos de histórico. Todos os quatro comandos recebem `--snapshot=$snapshotId`, `--quote-all-identifiers`, `--role=postgres` e gravam em `$RecoveryRoot\raw`.

```powershell
$snapshotId = (Get-Content -Raw -LiteralPath "$RecoveryRoot\snapshot-id.transient.txt").Trim()
if ([string]::IsNullOrWhiteSpace($snapshotId)) { throw 'SNAPSHOT_ID_MISSING' }
$toolchain = Get-Content -Raw scripts/config/aruka-recovery-toolchain.json | ConvertFrom-Json
$common = @(
  'run','--rm','--network','bridge',
  '--mount',"type=bind,source=$RecoveryRoot,target=/backup",
  '--mount',"type=volume,source=$CredentialVolume,target=/run/secrets,readonly",
  '--env','PGPASSFILE=/run/secrets/pgpass','--entrypoint','pg_dump',$PgImage,
  "--host=$DbHost","--port=$DbPort","--username=$DbUser","--dbname=$DbName",
  "--snapshot=$snapshotId",'--quote-all-identifiers','--role=postgres'
)

& docker @common --schema-only `
  "--exclude-schema=$($toolchain.supabase_dump_profile.schema_excludes)" `
  --file=/backup/raw/schema.raw.sql
if ($LASTEXITCODE) { throw 'SCHEMA_DUMP_FAILED' }

$dataArgs = @('--data-only',"--exclude-schema=$($toolchain.supabase_dump_profile.data_excludes)",'--schema=*')
foreach ($table in $toolchain.supabase_dump_profile.data_excluded_tables) { $dataArgs += "--exclude-table=$table" }
& docker @common @dataArgs --file=/backup/raw/data.raw.sql
if ($LASTEXITCODE) { throw 'DATA_DUMP_FAILED' }

& docker @common --schema-only --schema=supabase_migrations `
  --file=/backup/raw/history_schema.raw.sql
if ($LASTEXITCODE) { throw 'HISTORY_SCHEMA_DUMP_FAILED' }

& docker @common --data-only --schema=supabase_migrations `
  --exclude-table=auth.schema_migrations `
  --exclude-table=storage.migrations `
  --exclude-table=supabase_functions.migrations `
  --file=/backup/raw/history_data.raw.sql
if ($LASTEXITCODE) { throw 'HISTORY_DATA_DUMP_FAILED' }

docker run --rm --network bridge `
  --mount "type=bind,source=$RecoveryRoot,target=/backup" `
  --mount "type=bind,source=$Repo,target=/workspace,readonly" `
  --mount "type=volume,source=$CredentialVolume,target=/run/secrets,readonly" `
  --env PGPASSFILE=/run/secrets/pgpass `
  --entrypoint psql $PgImage -qAt -X -v ON_ERROR_STOP=1 `
  -h $DbHost -p $DbPort -U $DbUser -d $DbName -v snapshot_id="$snapshotId" `
  -f /workspace/scripts/sql/storage-recovery-inventory-at-snapshot.sql `
  -o /backup/storage-objects.jsonl
if ($LASTEXITCODE) { throw 'STORAGE_INVENTORY_FAILED' }
```

Não acrescentar `--no-privileges`: grants e ACLs fazem parte da cobertura. O normalizador remove somente ACLs internas incompatíveis conforme o `dry-run` oficial. Não imprimir `$snapshotId`.

Normalizar sem sobrescrever:

```powershell
node scripts/normalize-supabase-snapshot-dump.mjs --mode schema `
  --input "$RecoveryRoot\raw\schema.raw.sql" --output "$RecoveryRoot\schema.sql"
node scripts/normalize-supabase-snapshot-dump.mjs --mode data `
  --input "$RecoveryRoot\raw\data.raw.sql" --output "$RecoveryRoot\data.sql"
node scripts/normalize-supabase-snapshot-dump.mjs --mode schema `
  --input "$RecoveryRoot\raw\history_schema.raw.sql" --output "$RecoveryRoot\history_schema.sql"
node scripts/normalize-supabase-snapshot-dump.mjs --mode data `
  --input "$RecoveryRoot\raw\history_data.raw.sql" --output "$RecoveryRoot\history_data.sql"
```

Capturar `storage.objects` no mesmo snapshot com `storage-recovery-inventory-at-snapshot.sql`. O inventário vai para `$RecoveryRoot\storage-objects.jsonl`; não imprimi-lo.

### 5. Storage

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File scripts/export-supabase-storage-backup.ps1 `
  -MetadataJsonl "$RecoveryRoot\storage-objects.jsonl" `
  -DestinationRoot "$RecoveryRoot\storage-export" `
  -Endpoint 'https://vrizeuhuhvtvbrmtvdik.storage.supabase.co/storage/v1/s3' `
  -Region 'us-east-2' -ExpectedProjectRef 'vrizeuhuhvtvbrmtvdik' `
  -HumanApprovalFile "$RecoveryRoot\production-recovery-approval.json" `
  -FreezeEvidenceFile "$RecoveryRoot\write-freeze-evidence.json" `
  -AwsCliMode Docker -AwsCliImage $AwsImage `
  -AwsCredentialsFile "$RecoveryRoot\credentials\aws-credentials" `
  -CredentialMode RLS_SESSION_TOKEN -ExecuteRemote

node scripts/build-storage-recovery-manifest.mjs `
  --metadata-jsonl "$RecoveryRoot\storage-objects.jsonl" `
  --download-journal-jsonl "$RecoveryRoot\storage-export\storage-download-journal.jsonl" `
  --object-root "$RecoveryRoot\storage-export" `
  --output-directory "$RecoveryRoot\storage-evidence"
```

### 6. Verificação, encerramento e retomada

Preencher o checkpoint com SHA-256 e fingerprint do snapshot; executar `verify-consistent-recovery-point.mjs`. Somente após `PASS`: pressionar Enter no Console A para `ROLLBACK`, registrar fim do freeze, reativar cron, liberar manutenção e validar uma leitura não mutante.

O estado é retomável pelos arquivos externos: raw, normalizados, journal, manifests, hashes e checkpoint. Nunca reutilizar saída parcial como `PASS`; scripts recusam sobrescrita e inconsistências.

### 7. Revogação e limpeza

Revogar primeiro as credenciais temporárias no Supabase. Depois:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File scripts/remove-aruka-recovery-credentials.ps1 `
  -RecoveryRoot $RecoveryRoot -ExecuteAfterRevocation
docker volume rm $CredentialVolume
```

Confirmar o nome exato do volume descartável antes da remoção. Não remover arquivos de backup, evidence ou o VHDX.

## Stop conditions

Interromper em autorização ausente/expirada, identidade divergente, BitLocker/ACL/espaço inválido, versão ou digest diferente, credential file fora de `B:`, freeze incompleto, cron/Edge Function ativa, transação de escrita, snapshot keeper encerrado, dump vazio, cobertura inferior à baseline, segredo em log, objeto ausente/extra ou tamanho/hash divergente. Não liberar escritas automaticamente após uma falha.
