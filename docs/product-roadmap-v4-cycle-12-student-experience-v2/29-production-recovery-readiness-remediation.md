# Cycle 12.15.7 — production recovery readiness remediation

## 1. Purpose and current decision

This runbook separates backup creation, backup verification, restore, restore validation, and any future production recovery. The 2026-10-05/06 remediation ended safely with:

```text
BACKUP_CREATION=BLOCKED_EXTERNAL_REQUIREMENT
RECOVERY_TECHNICAL_PROOF=BLOCKED
PRODUCTION_READINESS=NO_GO
PRODUCTION_EXECUTION_AUTHORIZED=NO
```

No production migration or mutation is part of this runbook execution without a separate future human authorization.

## 2. Preconditions

- Confirm `main`, expected commit, zero divergence, clean worktree, 40 executable migrations, and rollout `OFF`.
- Confirm source project `aruka` / `vrizeuhuhvtvbrmtvdik`; it is read-only for this operation.
- Use Supabase CLI compatible with PostgreSQL 17, Docker Desktop, `psql`, and SHA-256 tooling. Record exact versions.
- Obtain the Session Pooler connection string and database password interactively from an authorized operator. Never place either in Git, reports, shell history, process output, or chat.
- Create the backup directory outside the repository with access restricted to the operator.
- Create a new, empty, disposable PostgreSQL 17 target. Verify its host/project reference is not `vrizeuhuhvtvbrmtvdik`.
- Define a human retention policy before creating the artifact.

Abort if any identity check fails, the target is production, a secret would be logged, the worktree contains unrelated human changes that would be overwritten, or a command implies a remote schema/history/data write.

## 3. Backup creation

Follow the official [Backup and Restore using the CLI](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore) procedure. Use an environment variable or secure prompt for the source URL; examples below deliberately contain placeholders.

Create these files in the external directory:

```text
roles.sql
schema.sql
data.sql
history_schema.sql
history_data.sql
backup-metadata.json
SHA256SUMS.txt
```

Run the official logical dump sequence for roles, schema, and data. Also dump `supabase_migrations` schema and data separately, as required by the official migration-history preservation guidance. Exclude `storage.buckets_vectors` and `storage.vector_indexes` from data if required by the target version.

Record only safe metadata:

```text
BACKUP_TYPE=LOGICAL_SUPABASE_CLI
BACKUP_STARTED_AT=<UTC>
BACKUP_COMPLETED_AT=<UTC>
BACKUP_SIZE_BYTES=<integer>
BACKUP_SHA256=<sha256 of an immutable archive or manifest>
SOURCE_PROJECT_REF=vrizeuhuhvtvbrmtvdik
SOURCE_REMOTE_HISTORY_COUNT=25
CLI_VERSION=<version>
POSTGRES_VERSION=17.6
```

Database backups do not cover Storage object bytes. If Storage recovery is in scope, export objects separately with an approved secret-key workflow and a per-object manifest; do not mix object names or contents into versioned evidence.

## 4. Backup verification

1. Verify every expected file exists, is non-empty, and is outside the repository.
2. Recalculate SHA-256 and compare it to `SHA256SUMS.txt`.
3. Check that the schema dump contains tables, functions, indexes, constraints, policies, RLS, grants, and triggers.
4. Check that the data dump uses `COPY` or `INSERT` statements and that migration history contains exactly 25 entries ending at `20260909110000`.
5. Scan logs and metadata for URLs with passwords, tokens, secret keys, JWTs, emails, and phone numbers. Raw dumps are sensitive by definition and must not be scanned into console output.
6. Do not accept a successful exit code without non-empty files and matching hashes.

Abort on a missing file, hash mismatch, unexpected project reference, secret in logs, incomplete migration history, or backup completion after any production migration has begun.

## 5. Isolated restore

The destination must be a newly created disposable local PostgreSQL/Supabase environment or an explicitly non-production temporary project. Never restore onto `vrizeuhuhvtvbrmtvdik`.

1. Record `RESTORE_STARTED_AT` in UTC.
2. Verify the target database is empty/disposable and PostgreSQL-major compatible.
3. Restore roles, schema, and data in one transaction with error-stop enabled, following the official `psql` procedure and setting `session_replication_role = replica` only for the data load.
4. Restore `history_schema.sql` and `history_data.sql` to preserve migration history.
5. Record exit status, completion UTC, and duration.
6. Keep the target network-isolated from application traffic; disable jobs, webhooks, cron, replication, and outbound integrations before validation.

Abort immediately on target identity ambiguity, any route to production, restore error, extension incompatibility, unexpected outbound action, or evidence that PII could be printed.

## 6. Restore validation

Run metadata and aggregate-only checks. Never print user rows.

- Migration history: `25`; last version `20260909110000`.
- Public tables/RLS: `30/30`.
- Public function signatures: `49`.
- Public policies: `75`; direct `auth.uid()` `70`.
- Anonymous-executable `SECURITY DEFINER`: `17`.
- Private schema and rollout objects: absent.
- Legacy `alunos` policies: `4`.
- Compare column, index, constraint, function/ACL, policy/RLS, and relevant grant fingerprints to the source snapshot.
- Confirm all 52 public foreign keys are validated and no constraint is unvalidated.
- Compare aggregate counts for critical tables without returning row contents.
- Validate sequences where present and verify referential integrity with `NOT EXISTS` checks generated from catalog metadata.

Set `RESTORE_INTEGRITY=PASS` only if every comparison matches or an investigated, documented exception is accepted by a human owner.

## 7. RPO and RTO

- Recovery point is the backup's consistent snapshot/completion point evidenced by the dump process; document the exact semantics used.
- Measured RPO is the difference between the declared incident/cutover reference time and that recovery point. Do not substitute file modification time without proving it represents the snapshot.
- Measured RTO starts when restore work begins and ends only after critical validation declares the database usable.
- Record restore duration and validation duration separately.
- If no business thresholds exist, set `RPO_RTO_ACCEPTANCE=HUMAN_DECISION_REQUIRED`; technical proof alone does not promote production readiness to `GO`.

## 8. Cleanup and artifact handling

- Destroy only the disposable target after validation evidence is captured. Reconfirm its resolved identity before deletion.
- Preserve the original backup until the human retention owner authorizes disposal. Do not delete the only valid recovery artifact automatically.
- Store the backup encrypted at rest with restricted access. Keep hashes and safe metadata in the report, never raw content.
- Remove temporary connection environment variables and credential-bearing shell history.

## 9. Escalation and future production recovery

Escalate to the database owner on credential, hash, restore, integrity, or identity failure. Escalate to the privacy/security owner on possible PII or credential exposure. Escalate to the product owner for RPO/RTO acceptance.

Production recovery is a separate incident procedure. It requires explicit human authorization, a selected recovery point, maintenance communication, write freeze, verified backup, rollback criteria, and a dedicated production change record. This remediation never authorizes a restore, migration, repair, or reset on production.

## 10. Evidence from this attempt

- Free plan confirmed; managed daily backups and PITR are unavailable for this project tier.
- A historical external artifact from 2026-08-03 remains preserved, but it is stale and has no restore-drill evidence.
- Current source history is 25 migrations; the remote schema/security baseline and aggregate counts were captured read-only on 2026-10-06 UTC.
- Required current production database connection secret was absent, so no new dump or restore target was created.
- Repository safeguards now ignore `*.sql.gz`, `backups/`, and `restore-drill/`; real artifacts must still be created outside the repository.
- Measured RPO and RTO remain unavailable; Gate 4 remains `NO_GO`.

## 11. Recovery drill de 2026-10-08

### Decisão

```text
RESTORE_DRILL=PARTIAL
PRODUCTION_READINESS=NO_GO
PRODUCTION_EXECUTION_AUTHORIZED=NO
```

Os cinco dumps lógicos foram restaurados e validados em um ambiente descartável PostgreSQL 17.6, com Auth e Storage inicializados por seus componentes oficiais. A recuperação do banco passou nas verificações estruturais, de contagem e de integridade referencial. O resultado permanece `PARTIAL` porque o conjunto não contém os bytes dos oito objetos registrados em `storage.objects` e porque os dumps foram gerados em momentos distintos, sem prova de snapshot transacional único.

### Dependências comprovadas

- Docker Desktop 29.8.0.
- `public.ecr.aws/supabase/postgres:17.6.1.127`.
- `public.ecr.aws/supabase/gotrue:v2.197.0`; `v2.192.0` não contém as tabelas de MFA recovery codes exigidas pelo dump.
- `public.ecr.aws/supabase/storage-api:v1.70.3`; `v1.62.5` não contém `storage.buckets.versioning_status`.
- Rede Docker interna, volumes exclusivos e nenhuma porta publicada.
- Backup montado read-only em `/recovery`.

### Ordem reproduzível

1. Criar rede interna, volume novo e container PostgreSQL 17 usando `POSTGRES_USER=supabase_admin`.
2. Alinhar senhas efêmeras das roles `postgres`, `supabase_auth_admin` e `supabase_storage_admin` usando somente `supabase_admin` no destino descartável.
3. Executar Auth v2.197.0 até concluir suas migrations; confirmar `auth.users` e as tabelas `auth.mfa_recovery_code_sets` e `auth.mfa_recovery_codes`.
4. Executar Storage v1.70.3 e chamar seu script compilado oficial de migrations; confirmar as dez tabelas gerenciadas e `storage.buckets.versioning_status`.
5. Parar Auth e Storage para evitar escrita concorrente durante a carga.
6. Restaurar `roles.sql`, `schema.sql` e `history_schema.sql` com `--single-transaction` e `ON_ERROR_STOP=1`.
7. Gerar `data.recovery-drill.pg17-selfhosted.sql` com `scripts/prepare-supabase-recovery-data.ps1`. A transformação deve falhar se `lifecycle_configuration` ou `lifecycle_configuration_generation` contiver valor não nulo. Os originais nunca são alterados.
8. Restaurar o artefato derivado como `supabase_admin`, em transação única, com `session_replication_role=replica` limitado à sessão.
9. Restaurar `history_data.sql` em transação única com `ON_ERROR_STOP=1`.
10. Validar catálogos, RLS, grants, todas as contagens `COPY`, as 52 FKs e iniciar novamente Auth/Storage para o teste de compatibilidade operacional.

### Correções e resultados

- O PostgreSQL sem bootstrap Supabase foi rejeitado porque não fornecia os objetos gerenciados exigidos por `schema.sql`.
- O bootstrap inicial com `POSTGRES_USER=postgres` foi rejeitado pela própria imagem; a repetição limpa usou `supabase_admin`.
- Auth foi elevado de v2.192.0 para v2.197.0 para obter duas tabelas gerenciadas de MFA exigidas pelo dump.
- Storage foi elevado de v1.62.5 para v1.70.3 para obter `versioning_status`.
- As colunas Platform-only `lifecycle_configuration` e `lifecycle_configuration_generation` estavam nulas nas duas linhas de buckets. Elas foram removidas apenas da cópia derivada, por transformação fail-closed e hashada; nenhum valor ou constraint foi descartado silenciosamente.
- Estrutura restaurada: 30 tabelas, 49 funções, 130 índices, 12 triggers, 52 FKs validadas, 75 policies e RLS em 30/30 tabelas públicas.
- Dados: todas as 65 contagens dos blocos `COPY` coincidiram; `auth.users=8`, `storage.buckets=2`, `storage.objects=8`.
- Histórico: 25 migrations, última `20260909110000`.
- Integridade: 52 FKs verificadas por anti-join, zero órfãos; a FK autorreferente de `aluno_contratos` também teve zero órfãos.
- A fase SQL de restauração levou 469,007 segundos. O RTO observado completo, encerrado após validação e evidências, está no relatório externo; não é RTO contratual nem aprovado.

### Riscos residuais e nova execução

- Exportar os bytes do Storage, com manifesto por objeto, antes de repetir o drill; os dumps SQL recuperam apenas metadados.
- Gerar roles, schema, data e histórico sob um mecanismo que prove consistência temporal comum, ou documentar formalmente a janela e a semântica de consistência.
- Fixar versões compatíveis de Auth e Storage no procedimento e revalidá-las contra o schema Platform a cada novo backup.
- Repetir o drill a partir de recursos novos; não reutilizar a base restaurada como evidência limpa.
- Uma configuração sensível local apareceu no output transitório durante a inspeção inicial do container. Ela não foi copiada para as evidências externas, cuja varredura terminou limpa. Revisar e, se aplicável, rotacionar essa credencial local sob autorização separada; esta missão não modifica o Supabase local.
- Preservar as evidências externas e obter decisão humana sobre RPO/RTO. Nenhum desses resultados autoriza rollout ou recuperação em produção.

## 12. Fechamento das lacunas antes do próximo drill

Esta seção prepara a próxima coleta; ela não torna o backup atual completo e não autoriza produção. O estado continua:

```text
RESTORE_DRILL=PARTIAL
PRODUCTION_READINESS=NO_GO
```

### 12.1 Storage: bytes, manifesto e reconciliação

O backup lógico do banco preserva os metadados em `storage.buckets` e `storage.objects`, mas não os bytes dos objetos. Uma coleta futura autorizada deve:

1. Abrir uma janela de backup aprovada e ativar o congelamento descrito em 12.2.
2. Capturar `storage.objects` no snapshot do banco com `scripts/sql/storage-recovery-inventory.sql`, direcionando o JSONL para fora do Git.
3. Preencher `storage-export-approval.template.json` e `write-freeze-evidence.template.json` fora do Git. Os arquivos são evidência de autorização, não armazenam credenciais.
4. Executar primeiro `scripts/export-supabase-storage-backup.ps1` sem `-ExecuteRemote`. O resultado esperado é `PLAN_ONLY`, `NetworkAccess=NO` e `ProductionAccess=NO`.
5. Somente durante uma janela futura autorizada, fornecer endpoint HTTPS validado, project ref, região e os dois arquivos de evidência; então usar `-ExecuteRemote`. As credenciais S3 devem existir apenas nas variáveis padrão da AWS e nunca em argumentos, arquivos de evidência ou logs.
6. Preferir credencial temporária de sessão emitida para uma identidade dedicada de backup com políticas RLS somente de leitura. Uma access key S3 gerada pelo projeto ignora RLS e possui acesso completo; seu uso exige aprovação explícita no arquivo de autorização, custódia restrita e revogação após a coleta.
7. Executar `scripts/build-storage-recovery-manifest.mjs` usando o inventário, o journal de download e o diretório de objetos. O script verifica existência, tamanho remoto observado, tamanho registrado nos metadados quando disponível, SHA-256, duplicatas, ausências e extras.

Os bytes usam nomes locais derivados por SHA-256 de `bucket + NUL + caminho`, evitando PII nos nomes de arquivos. O manifesto externo preserva bucket, nome e caminho originais e, portanto, continua sensível. Objetos, journal, manifesto e hashes devem ficar em diretório novo, vazio, criptografado e fora do repositório. Uma divergência mantém o conjunto incompleto e interrompe a coleta.

Exemplo deliberadamente não executável sem a aprovação futura (substituir todos os placeholders e manter os caminhos fora do Git):

```powershell
# Pré-voo seguro: não cria o destino e não acessa rede.
powershell -NoProfile -File scripts/export-supabase-storage-backup.ps1 `
  -MetadataJsonl '<external>\storage-objects.jsonl' `
  -DestinationRoot '<external>\storage-export'

# Coleta futura: somente após aprovação e freeze ativos.
powershell -NoProfile -File scripts/export-supabase-storage-backup.ps1 `
  -MetadataJsonl '<external>\storage-objects.jsonl' `
  -DestinationRoot '<external>\storage-export' `
  -Endpoint 'https://<project-ref>.storage.supabase.co/storage/v1/s3' `
  -Region '<region>' -ExpectedProjectRef '<project-ref>' `
  -HumanApprovalFile '<external>\storage-export-approval.json' `
  -FreezeEvidenceFile '<external>\write-freeze-evidence.json' `
  -ExecuteRemote

node scripts/build-storage-recovery-manifest.mjs `
  --metadata-jsonl '<external>\storage-objects.jsonl' `
  --download-journal-jsonl '<external>\storage-export\storage-download-journal.jsonl' `
  --object-root '<external>\storage-export' `
  --output-directory '<external>\storage-evidence'
```

### 12.2 Recovery point temporalmente consistente

A fronteira escolhida é uma janela aprovada de congelamento de todas as mutações relevantes: escritas da aplicação, uploads, deletes e upserts do Storage, DDL/migrations, cron, webhooks e jobs assíncronos. O congelamento deve permanecer ativo desde antes do snapshot até a reconciliação final dos bytes. Sem essa fronteira não existe prova atômica entre PostgreSQL e Storage.

Durante a janela:

1. Confirmar a identidade do projeto e registrar início, responsável, aprovação, serviços pausados e prazo máximo no checkpoint baseado em `recovery-point-checkpoint.template.json`.
2. Em conexão direta ou session pooler compatível, abrir uma transação `REPEATABLE READ, READ ONLY`, chamar `pg_export_snapshot()` e manter a sessão exportadora aberta.
3. Usar binários PostgreSQL 17 compatíveis e passar o mesmo `--snapshot=<id>` a cada `pg_dump` que cobre schema, data e `supabase_migrations`. Registrar um fingerprint não secreto do snapshot em cada artefato. Roles são globais e devem ser registradas como não vinculadas ao snapshot.
4. Capturar o inventário de `storage.objects` nesse mesmo snapshot. Não assumir que dumps separados do Supabase CLI compartilham snapshot: ou todos os dumps compatíveis recebem explicitamente o snapshot exportado, com filtros revisados, ou o congelamento permanece até o fim da sequência oficial e a limitação é documentada.
5. Ainda sob congelamento, exportar os bytes e gerar o manifesto reconciliado. Somente `PASS`, sem ausentes, extras ou divergências de tamanho/hash, pode avançar.
6. Executar `scripts/verify-consistent-recovery-point.mjs`. Ele verifica janela, hashes dos artefatos, fingerprint único nos dumps vinculados ao snapshot e reconciliação do Storage. Encerrar a transação e liberar escritas apenas depois da verificação e da decisão humana registrada.

```powershell
node scripts/verify-consistent-recovery-point.mjs `
  --checkpoint '<external>\recovery-point-checkpoint.json' `
  --output '<external>\consistent-recovery-point-report.json'

node scripts/prepare-next-recovery-drill.mjs `
  --checkpoint '<external>\recovery-point-checkpoint.json' `
  --consistency-report '<external>\consistent-recovery-point-report.json' `
  --output '<external>\next-restore-drill-plan.json'
```

O plano atual não oferece PITR como substituto desta coleta e os downloads de backup do banco não incluem os objetos do Storage. Nenhum timestamp isolado de arquivo prova RPO. A consistência só poderá ser declarada quando o verificador produzir `PASS` em evidência externa sanitizada.

### 12.3 Segurança da configuração local observada

A revisão sanitizada identificou a configuração transitória como a chave raiz de inicialização do pgSodium presente no entrypoint do container PostgreSQL local. Ela é material sensível operacional do ambiente local, não um valor textual de teste e não uma credencial de produção. O valor apareceu apenas no output transitório da inspeção anterior; não foi reproduzido nesta revisão nem localizado nas evidências externas do drill ou nos arquivos versionáveis preparados aqui.

Não rotacionar automaticamente. Uma rotação pode afetar Vault e dados locais cifrados; antes dela, o responsável de segurança deve autorizar uma janela local, inventariar dependências e segredos do Vault sem expor valores, definir backup e rollback e aceitar a indisponibilidade. Até essa decisão, restringir acesso à sessão e ao Docker local e evitar qualquer `docker inspect` bruto que imprima entrypoint ou ambiente.

### 12.4 Execução segura, rollback e interrupção

- Pré-requisitos futuros: aprovação nominal e válida, write freeze comprovado, binários PostgreSQL 17, AWS CLI, destino externo vazio e criptografado, espaço suficiente e credencial temporária de menor privilégio.
- Rollback: a exportação remota é somente leitura. Em erro, manter o freeze enquanto for seguro, fechar a coleta como falha e preservar journal/checkpoint para análise. Remover ou colocar em quarentena uma cópia local incompleta somente após conferir seu caminho absoluto e mediante decisão humana; nunca alterar o backup original.
- Interromper em identidade de projeto divergente, endpoint que não seja o S3 HTTPS do project ref aprovado, autorização expirada, freeze incompleto/expirado, segredo em evidência, ferramenta ausente, destino não vazio ou dentro do Git, download falho, objeto extra/ausente, tamanho/hash divergente ou snapshots diferentes.
- `scripts/prepare-next-recovery-drill.mjs` somente gera um plano não executável após uma prova de consistência válida. Ele rejeita destino de produção e não inicia restore.

Validação local: `npm run qa:cycle12:recovery-gap-closure`. Os testes usam apenas dados sintéticos, não acessam rede, não modificam o Supabase local ou backups existentes e exercitam tanto sucesso quanto falhas fechadas.

## 13. Production recovery pre-flight de 2026-10-08

O pre-flight read-only confirmou a identidade `vrizeuhuhvtvbrmtvdik`, região `us-east-2`, PostgreSQL 17.6, os oito objetos distribuídos em dois buckets privados e a baseline de 30 tabelas/49 funções/75 policies/25 migrations. Um cron ativo chama uma Edge Function com capacidade de escrita; outra Edge Function autenticada também escreve e ambas integram o plano de freeze.

O pacote executável está em `30-production-recovery-preflight-execution-package.md`. A coleta permanece desautorizada porque a unidade `C:` não é criptografada, as ferramentas de host e credenciais temporárias ainda não foram provisionadas e o write freeze não recebeu aprovação específica. O modo `PLAN_ONLY` foi comprovado sem rede. Nenhum dump, download, freeze, interrupção, migration ou deploy ocorreu.

## 14. Final backup preparation de 2026-10-08

O destino final foi transferido para `B:\Aruka\Recovery\20261008-213100Z`, em VHDX externo NTFS com BitLocker `FullyEncrypted`, proteção `On` e `XtsAes256`. A ACL é explícita apenas para o operador e `SYSTEM`. O pacote final está em `31-final-backup-execution-package.md`.

Foram fixados e verificados: Supabase CLI 2.120.0 por checksum oficial; PostgreSQL clients 17.6 por imagem/digest; AWS CLI 2.37.10 por imagem/digest. O `db dump --dry-run` foi comparado aos filtros snapshot-aware e o perfil foi versionado. Credenciais continuam ausentes, write freeze inativo e coleta desautorizada. Nenhum backup de produção foi iniciado.
