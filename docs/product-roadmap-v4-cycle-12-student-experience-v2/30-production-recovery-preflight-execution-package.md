# Cycle 12 — Production recovery backup pre-flight

## 1. Status e limite de autorização

```text
PRE_FLIGHT=PREPARED_WITH_BLOCKERS
COLLECTION_AUTHORIZED=NO
WRITE_FREEZE_ACTIVE=NO
RESTORE_DRILL=PARTIAL
PRODUCTION_READINESS=NO_GO
```

Este pacote prepara uma futura coleta consistente. Nesta execução foram permitidas apenas consultas agregadas read-only e validações locais. Nenhum dump, download de objeto, alteração de cron, mudança de configuração, interrupção de serviço ou transação persistente foi iniciado em produção.

## 2. Baseline confirmado em 2026-10-08

| Item | Evidência sanitizada |
| --- | --- |
| Projeto | `aruka`, ref `vrizeuhuhvtvbrmtvdik`, `ACTIVE_HEALTHY` |
| Região | `us-east-2` |
| PostgreSQL | Platform `17.6.1.127`; servidor reporta `17.6` |
| Banco | 16.215.187 bytes |
| Schema público | 30 tabelas, 49 funções, 75 policies |
| Migrations | 25; última `20260909110000` |
| Storage | 2 buckets privados, 8 objetos, 2.113.714 bytes segundo metadados |
| Automação | `pg_cron` e `pg_net` ativos; 1 cron ativo chama uma Edge Function |
| Database webhooks | 0 triggers associados a `supabase_functions`/`net` |
| Escrita em andamento | 0 transações de escrita ativas no instante consultado |
| Edge Functions | 2 ativas com capacidade de escrita; ambas publicadas com `verify_jwt=false` |

A inspeção local do código mostra que `processar-encerramentos-automaticos` exige um segredo de job e usa `service_role`; `student-access-invite` valida Bearer token internamente e também usa operações administrativas. Mesmo com essas validações, ambas entram no inventário de fontes de escrita e não podem ser ignoradas durante o freeze.

O changelog atual registra atualizações posteriores do PostgreSQL 17 e mudanças no Storage. Não atualizar a plataforma durante a coleta. Revalidar versão, filtros e compatibilidade se a versão de produção mudar.

## 3. Bloqueios antes da autorização

1. A unidade `C:` está `FullyDecrypted`, proteção BitLocker `Off`. O diretório atual de backups não é destino aprovado para novos dados de produção.
2. Há 15.057.530.880 bytes livres (aproximadamente 14,0 GiB), suficientes para a estimativa atual, mas espaço livre não substitui criptografia.
3. `supabase`, `psql`, `pg_dump`, `pg_dumpall`, `aws` e `rclone` não estão instalados no host. Clientes PostgreSQL 17.6 foram validados apenas dentro da imagem Docker já disponível; AWS CLI e Supabase CLI continuam pendentes.
4. Nenhuma credencial temporária de banco ou Storage está provisionada no ambiente do pre-flight.
5. A manutenção da aplicação e a pausa do cron ainda não foram aprovadas nem ativadas.
6. Os comandos nativos `pg_dump --snapshot` precisam ser mantidos em PostgreSQL major 17. A saída deve ser comparada ao conjunto oficial de filtros da versão pinada da Supabase CLI antes da janela.

Não remover nenhum bloqueio por improvisação. A coleta permanece desabilitada até todos constarem como resolvidos no modelo de aprovação.

## 4. Capacidade e janela

O footprint observado é de aproximadamente 17,5 MiB para banco mais bytes do Storage, antes de considerar expansão de SQL, journals, manifests e margem. Reservar no mínimo 5 GiB em um volume criptografado, com ACL exclusiva do operador. A restauração anterior levou 469 segundos para SQL e 905 segundos até o fim das validações. Como ainda não existe medição desta coleta, reservar inicialmente 30 minutos de manutenção, com stop condition aos 25 minutos se a reconciliação não estiver próxima de concluir. Isso é uma estimativa operacional, não RTO/RPO aprovado.

## 5. Checklist humano pré-execução

- [ ] Aprovação preenchida a partir de `production-recovery-preflight-approval.template.json`, ainda válida e fora do Git.
- [ ] Project ref, região e versão conferidos novamente.
- [ ] Volume de destino criptografado e ACL restrita comprovados.
- [ ] Pelo menos 5 GiB livres no volume aprovado.
- [ ] Supabase CLI pinada e `supabase db dump --help`/`--dry-run` revisados.
- [ ] PostgreSQL `psql`, `pg_dump` e `pg_dumpall` major 17 disponíveis.
- [ ] AWS CLI disponível e validada; nenhuma configuração global persistente criada.
- [ ] Credencial do banco custodiada fora de argumentos, logs, Git e chat.
- [ ] Credencial temporária S3/RLS custodiada; access key plena somente por exceção aprovada.
- [ ] Aplicação em manutenção e proprietário sem sessões operacionais.
- [ ] Cron ativo identificado e autorizado para pausa reversível.
- [ ] Nenhuma migration, deploy ou alteração DDL concorrente agendada.
- [ ] Operador responsável por liberar escritas identificado.

## 6. Write freeze futuro

### Ativação

1. Registrar `freeze.started_at_utc` e colocar a aplicação em manutenção pelo mecanismo de hospedagem aprovado. Não usar rollout funcional como substituto de manutenção.
2. Impedir ações manuais do proprietário durante a janela.
3. Pausar o único cron ativo pelo mecanismo suportado pelo Dashboard/pg_cron, registrando apenas identificador, estado anterior e timestamps; nunca registrar seu comando ou segredo. A chamada equivalente só poderá ser executada após aprovação explícita:

   ```sql
   select cron.alter_job(<approved_job_id>, active := false);
   ```

4. Confirmar que não existem Database Webhooks e que nenhuma Edge Function está sendo invocada. Se não for possível excluir invocação externa das duas funções ativas, interromper: o freeze não está provado.
5. Confirmar duas vezes, com intervalo operacional definido, contagens do Storage e zero transações de escrita. Não imprimir queries nem identificadores de usuário de `pg_stat_activity`.
6. Somente então marcar `application_writes_frozen`, `storage_writes_frozen` e `background_jobs_paused` no arquivo baseado em `write-freeze-evidence.template.json`.

### Liberação

1. Confirmar que dumps, inventário, download, manifesto, hashes e verificador terminaram com `PASS`.
2. Encerrar a sessão keeper com `ROLLBACK`.
3. Registrar o fim do freeze.
4. Reativar o cron pelo mesmo identificador:

   ```sql
   select cron.alter_job(<approved_job_id>, active := true);
   ```

5. Retirar a manutenção, validar uma leitura não mutante e registrar a decisão humana. Em falha, manter manutenção e escalar; não repetir comandos cegamente.

## 7. Diretório e credenciais

O caminho real deve ser criado somente no volume criptografado aprovado:

```powershell
$RecoveryRoot = '<encrypted-volume>\Aruka\aruka-recovery-<UTC timestamp>'
New-Item -ItemType Directory -Path $RecoveryRoot
```

Usar um caminho novo, vazio, sem espaços e fora do Git. Não reutilizar `C:\Backups\Aruka\aruka-recovery-20261006-175444`.

Preferir `PGPASSFILE` temporário protegido por ACL para o PostgreSQL. Para S3, usar variáveis AWS apenas no processo operador. Uma sessão token respeita RLS; access keys geradas têm acesso completo e ignoram RLS. Após a coleta: remover variáveis do processo, revogar credencial temporária e eliminar o arquivo de senha por procedimento humano seguro. Nunca executar `Get-ChildItem Env:`, `docker inspect` bruto ou tracing de comandos durante a janela.

## 8. Sequência técnica futura

Todos os placeholders abaixo são intencionais. A presença deles torna o bloco não executável até a revisão humana.

### 8.1 Pré-voo local

```powershell
supabase --version
supabase db dump --help
psql --version
pg_dump --version
pg_dumpall --version
aws --version

powershell -NoProfile -File scripts/export-supabase-storage-backup.ps1 `
  -MetadataJsonl '<external>\storage-objects.jsonl' `
  -DestinationRoot '<external>\storage-export'
```

O último comando deve retornar `PLAN_ONLY`, `NetworkAccess=NO` e `ProductionAccess=NO`.

### 8.2 Roles não vinculadas ao snapshot

Usar a sequência oficial da CLI pinada. Executar `--dry-run` primeiro e revisar que o destino é o projeto esperado. Não registrar `$env:ARUKA_DB_URL`.

```powershell
supabase db dump --db-url "$env:ARUKA_DB_URL" `
  -f "$RecoveryRoot\roles.sql" --role-only
```

### 8.3 Keeper do snapshot — Console A

```powershell
$SnapshotFile = "$RecoveryRoot\snapshot-id.transient.txt"
psql -X -q -v ON_ERROR_STOP=1 `
  -v snapshot_file="$SnapshotFile" `
  -f scripts/sql/recovery-snapshot-keeper.sql
```

Manter esse console aberto. O identificador é válido somente enquanto a transação exportadora permanecer aberta.

### 8.4 Dumps vinculados — Console B

```powershell
$snapshotId = (Get-Content -Raw -LiteralPath $SnapshotFile).Trim()
if ([string]::IsNullOrWhiteSpace($snapshotId)) { throw 'SNAPSHOT_ID_MISSING' }
$snapshotFingerprint = (Get-FileHash -LiteralPath $SnapshotFile -Algorithm SHA256).Hash.ToLowerInvariant()

pg_dump --format=plain --snapshot="$snapshotId" --schema-only `
  --schema=public --no-owner --no-privileges `
  --file="$RecoveryRoot\schema.sql"

pg_dump --format=plain --snapshot="$snapshotId" --data-only `
  --schema=public --schema=auth --schema=storage --no-owner --no-privileges `
  --exclude-table-data=storage.buckets_vectors `
  --exclude-table-data=storage.vector_indexes `
  --file="$RecoveryRoot\data.sql"

pg_dump --format=plain --snapshot="$snapshotId" --schema-only `
  --schema=supabase_migrations --no-owner --no-privileges `
  --file="$RecoveryRoot\history_schema.sql"

pg_dump --format=plain --snapshot="$snapshotId" --data-only `
  --schema=supabase_migrations --no-owner --no-privileges `
  --file="$RecoveryRoot\history_data.sql"

psql -X -qAt -v ON_ERROR_STOP=1 -v snapshot_id="$snapshotId" `
  -f scripts/sql/storage-recovery-inventory-at-snapshot.sql `
  -o "$RecoveryRoot\storage-objects.jsonl"
```

Antes da janela, comparar os filtros nativos acima ao `supabase db dump --dry-run` da versão pinada. Interromper se houver schema customizado além de `public`, mudança nas tabelas gerenciadas, permissão insuficiente ou diferença não explicada. `cron` é schema de extensão e não deve ser restaurado como schema aplicativo; sua configuração ativa deve ser inventariada separadamente e sanitizada.

### 8.5 Storage ainda sob freeze

```powershell
powershell -NoProfile -File scripts/export-supabase-storage-backup.ps1 `
  -MetadataJsonl "$RecoveryRoot\storage-objects.jsonl" `
  -DestinationRoot "$RecoveryRoot\storage-export" `
  -Endpoint 'https://vrizeuhuhvtvbrmtvdik.storage.supabase.co/storage/v1/s3' `
  -Region 'us-east-2' `
  -ExpectedProjectRef 'vrizeuhuhvtvbrmtvdik' `
  -HumanApprovalFile '<external>\storage-export-approval.json' `
  -FreezeEvidenceFile '<external>\write-freeze-evidence.json' `
  -ExecuteRemote

node scripts/build-storage-recovery-manifest.mjs `
  --metadata-jsonl "$RecoveryRoot\storage-objects.jsonl" `
  --download-journal-jsonl "$RecoveryRoot\storage-export\storage-download-journal.jsonl" `
  --object-root "$RecoveryRoot\storage-export" `
  --output-directory "$RecoveryRoot\storage-evidence"
```

### 8.6 Hashes e recovery point

Preencher `recovery-point-checkpoint.template.json` com caminhos absolutos, SHA-256, timestamps e o mesmo `$snapshotFingerprint` para os quatro artefatos vinculados. `roles.sql` deve permanecer `snapshot_bound=false`.

```powershell
node scripts/verify-consistent-recovery-point.mjs `
  --checkpoint "$RecoveryRoot\recovery-point-checkpoint.json" `
  --output "$RecoveryRoot\consistent-recovery-point-report.json"

node scripts/prepare-next-recovery-drill.mjs `
  --checkpoint "$RecoveryRoot\recovery-point-checkpoint.json" `
  --consistency-report "$RecoveryRoot\consistent-recovery-point-report.json" `
  --output "$RecoveryRoot\next-restore-drill-plan.json"
```

Somente o primeiro `PASS` autoriza liberar o freeze. O segundo comando gera plano, não executa restore.

## 9. Stop conditions e rollback

Interromper em project ref/endpoint/região divergente, autorização vencida, volume sem criptografia, menos de 5 GiB livres, ferramenta/major incompatível, segredo em output, aplicação acessível, cron ativo, invocação de Edge Function, transação de escrita, snapshot keeper encerrado, dump vazio, hash divergente, objeto ausente/extra, tamanho divergente, tempo de janela excedido ou qualquer tentativa de mutação não prevista.

Rollback antes da coleta: não há dados a remover; restaurar manutenção/cron apenas por decisão humana. Durante a coleta: preservar checkpoint e journal, não apagar o backup anterior, encerrar o keeper com `ROLLBACK`, revogar credenciais temporárias e liberar escritas somente após avaliar se a falha deixou algum risco operacional. A exportação S3 é somente leitura e não tem rollback remoto.

## 10. QA deste pre-flight

- `PLAN_ONLY`: confirmado sem rede e sem criação do destino.
- Clientes `psql`, `pg_dump` e `pg_dumpall` 17.6: confirmados em container descartável `--network none` e sem volumes.
- Scripts de recovery gap: testes sintéticos obrigatórios devem permanecer verdes.
- Containers, volumes e redes existentes: inventariados e não modificados.
- Produção: somente consultas agregadas e APIs read-only; nenhuma linha pessoal retornada.
- Segredos: somente presença/ausência de variáveis foi verificada; valores não foram lidos ou impressos.
