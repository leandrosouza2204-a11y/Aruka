# Cycle 12 — controlled production backup without full write freeze

## Estado reconciliado

```text
DECISION=BLOCKED_ON_REQUIRED_HUMAN_INPUT
COLLECTION_MODE=CONTROLLED_NO_FULL_WRITE_FREEZE
BACKUP_STARTED=NO
PRODUCTION_CHANGED=NO
RESTORE_DRILL=PARTIAL
PRODUCTION_READINESS=NO_GO
```

A diretiva atual autoriza uma única coleta de PostgreSQL e Storage sem freeze integral. Ela substitui apenas a antiga precondição de freeze; não autoriza deploy, migration, rollout, alteração de RLS, exclusão, operação Git ou restore em produção. O pacote original de 19 arquivos permanece imutável e este documento é um adendo operacional.

## Identidade e controles invariantes

- Projeto: `vrizeuhuhvtvbrmtvdik`, região `us-east-2`, PostgreSQL 17.6.
- Destino: `B:\Aruka\Recovery\20261008-213100Z`, NTFS, BitLocker `FullyEncrypted`, proteção `On`, `XtsAes256`.
- Toolchain: Supabase CLI 2.120.0, PostgreSQL client 17.6 e AWS CLI 2.37.10, todos já presentes e fixados pelo pacote 19/19.
- O dump usa transação `REPEATABLE READ READ ONLY` e snapshot exportado compartilhado.
- `roles.sql` é global e não deve ser descrito como participante do snapshot transacional.
- Storage usa sessão JWT/RLS primeiro. Uma chave S3 plena só pode ser provisionada se um relatório sanitizado provar cobertura RLS inferior a 8/8 e a aprovação nominal ativar `allow_full_s3_access_key=true`.
- A ausência de tráfego não é prova de bloqueio de gravações. Mesmo com inventários idênticos, a consistência temporal entre Database e Storage é `NOT_PROVEN`.

## Gate humano obrigatório

Antes de qualquer leitura operacional, pausa do cron ou coleta, copiar os templates para o volume B: e preencher sem inventar valores:

- `controlled-production-backup-approval.pending.template.json`: aprovador, operador, custodiante, change record, início/fim da janela, aprovação/expiração e `production_actions_enabled=true`.
- `storage-export-approval.pending.template.json`: decisão, responsável, validade e modo RLS. A chave plena continua desabilitada nesta etapa.
- `controlled-stability-evidence.pending.template.json`: somente após confirmar janela, ausência de usuários ativos, integrações conhecidas e estado das Edge Functions/cron/Storage.

Até esses campos existirem em arquivos aprovados fora do Git, a execução permanece fail-closed. Senhas, chaves e JWT nunca entram nesses JSONs.

## Provisionamento local protegido

Executar interativamente no terminal local. Não colar valores em chat, histórico de comandos ou logs:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File scripts/initialize-aruka-recovery-credentials.ps1 `
  -RecoveryRoot 'B:\Aruka\Recovery\20261008-213100Z' `
  -DatabaseHost '<host aprovado>' `
  -StorageMode RLS_SESSION_TOKEN `
  -Create
```

O script usa `Read-Host -AsSecureString`, cria arquivos somente em `B:\...\credentials` e restringe a ACL ao operador atual e `SYSTEM`. Se o diretório já existir, interromper e reconciliar; não sobrescrever.

No modo `RLS_SESSION_TOKEN`, o script não solicita `aws_access_key_id`: ele fixa esse valor no project ref `vrizeuhuhvtvbrmtvdik`. Os prompts de Storage são exclusivamente a chave legada `anon` exigida pelo endpoint S3 (a chave `publishable` ainda não é compatível) e o `access_token` JWT de uma sessão autenticada atual. `refresh_token`, chave `service_role`, chave `secret` e credenciais S3 geradas não são permitidos nesse modo. No modo privilegiado condicionado, o script solicita o par S3 gerado e não solicita JWT.

## Estabilidade e pausa reversível do cron

Registrar imediatamente antes da coleta:

1. janela confirmada e operador identificado;
2. confirmação humana de ausência de usuários ativos;
3. integrações capazes de escrever e sua situação;
4. Edge Functions `processar-encerramentos-automaticos` e `student-access-invite`, sem alteração;
5. estado anterior do job `processar-encerramentos-automaticos-dry-run-diario`;
6. inventário Storage inicial, com nomes suprimidos nos relatórios.

Pausar apenas o job identificado pelo procedimento SQL reversível já validado, confirmar `active=false` e registrar o valor anterior. No encerramento, reativar somente se o valor anterior era `true`. Essa pausa não constitui freeze integral.

## Sequência da coleta

1. Gerar `roles.sql` fora do snapshot e registrar essa limitação.
2. Abrir o keeper `REPEATABLE READ READ ONLY` com `scripts/sql/recovery-snapshot-keeper.sql`.
3. No mesmo snapshot, gerar `schema.sql`, `data.sql`, `history_schema.sql`, `history_data.sql` e `storage-objects-before.jsonl` com os filtros fixados no toolchain.
4. Exigir exatamente oito identidades distintas no inventário.
5. Executar `test-supabase-storage-rls-coverage.ps1` com `-ExecuteRemote`. O relatório contém apenas hashes de identidade e contagens; nenhum nome original.
6. Se o resultado for `PASS`, exportar com `RLS_SESSION_TOKEN`. Se for `INSUFFICIENT`, parar, preencher a ativação nominal da exceção e reprovisionar credencial temporária com `FULL_S3_ACCESS_KEY_BYPASSES_RLS`; não criar a chave automaticamente.
7. Exportar os oito objetos com `export-supabase-storage-backup.ps1 -ControlEvidenceFile ... -ExecuteRemote`.
8. Capturar `storage-objects-after.jsonl` e comparar o hash do inventário antes/depois. Qualquer diferença torna a coleta inconsistente e impede repetição automática.
9. Construir manifesto e hashes com `build-storage-recovery-manifest.mjs`.
10. Encerrar o keeper por `ROLLBACK`, restaurar o cron, revogar as credenciais temporárias e remover os arquivos locais somente após a revogação remota.
11. Executar `verify-controlled-recovery-point.mjs` após o closeout.

Nenhum script dessa sequência deve consultar ou modificar Git.

## Critérios de resultado

```text
DATABASE_SNAPSHOT_CONSISTENCY=PASS
STORAGE_BYTE_INTEGRITY=PASS
CROSS_SERVICE_POINT_IN_TIME_CONSISTENCY=NOT_PROVEN
```

`DATABASE_SNAPSHOT_CONSISTENCY=PASS` exige um único fingerprint para os quatro artefatos snapshot-bound, hashes válidos e arquivos não vazios. `STORAGE_BYTE_INTEGRITY=PASS` exige oito downloads, tamanhos e SHA-256 válidos, zero ausente/extra/divergente e inventários antes/depois idênticos. Esses dois resultados não elevam a consistência cross-service acima de `NOT_PROVEN`.

## Stop e rollback

Interromper em campos humanos ausentes/expirados, identidade divergente, BitLocker/ACL/espaço inválidos, ferramenta divergente, credencial fora de B:, cron não confirmado como pausado, keeper encerrado, dump vazio, inventário diferente de oito, cobertura RLS incompleta sem ativação nominal da exceção, objeto ausente/extra, tamanho/hash divergente ou segredo em saída.

Em qualquer falha: preservar evidências, encerrar o keeper, restaurar o estado anterior do cron, revogar credenciais, não repetir automaticamente e manter `PRODUCTION_READINESS=NO_GO`.

## Estado desta missão

Os campos humanos nominais, a janela e as credenciais não estão disponíveis. Por isso nenhum cron foi pausado, nenhuma credencial foi criada, nenhum dump ou objeto foi coletado e produção não foi alterada. A próxima ação é humana e objetiva: preencher os campos nominais/temporais fora do Git e executar o prompt seguro local.
