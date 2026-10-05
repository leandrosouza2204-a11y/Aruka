# Cycle 12.15.6 — production upgrade path and recovery rehearsal

## 1. Decisão

`CYCLE_12_15_6_DESIGN_COMPLETE_READY_FOR_HUMAN_REVIEW`

O caminho recomendado é o mecanismo oficial da CLI Supabase em três manifests temporários, construídos somente com cópias byte-for-byte das migrations versionadas:

1. `db push` de P01–P12;
2. `db push` da reconciliation, mantendo 12.13 e 12.15.2 fora desse manifest;
3. `db push --include-all` da árvore física completa para aplicar 12.13 e 12.15.2, que agora são versões ausentes anteriores à reconciliation já registrada.

Esse caminho foi ensaiado integralmente no Supabase local com CLI `2.109.1`. Não usa `migration repair` no happy path, não altera migrations históricas, registra a versão real de cada arquivo e deixa o próximo `db push` sem trabalho pendente.

Produção continua `NO_GO`: esta missão não autoriza escrita remota e PITR/backup ainda precisam ser comprovados imediatamente antes da futura janela.

## 2. Baseline e integridade

| Item | Resultado |
| --- | --- |
| Branch | `main` |
| HEAD | `ac2d71fd96bb1f331f567d7cc79f4174b1d3959e` |
| `origin/main` | `ac2d71fd96bb1f331f567d7cc79f4174b1d3959e` |
| Divergência | `0 0` |
| Worktree inicial | clean |
| PR #147 | incorporado pelo commit atual |
| Migrations SQL executáveis | 40 |
| Última migration física | `20261004133801` |
| CLI validada | `2.109.1` |

Hashes SHA-256:

| Migration | SHA-256 |
| --- | --- |
| P01 `20260914130000` | `E51FDBAAB26FA372B7B7FFB5E25690FFA9DE926E3DEB518E383D91C0438D2137` |
| P03 `20260914132000` | `62675EB140D55797822ACC3828FA8F316CF32F9FA1007720350920F6D79B48F2` |
| P12 `20260921010053` | `FC7AB0F7878CEB545F7021750CA9DEA7674F4589C52BF8E4C1433A37F853796C` |
| 12.13 `20260926174027` | `C4E01665FF8E55D0CDF5BD4A7B0692301E9E224E3EFFDBD9E6748AD2625DE770` |
| 12.15.2 `20261003163830` | `9D236465C9A7DBA35E2845CA965DD1E1806A73A1DB0D712D04CBBB068E4E6FDB` |
| reconciliation `20261004133801` | `D15B85C13B9B72E67E10DF7A3A40A20D7CDD14DBA27937181820A0DACA4E1708` |

## 3. Revalidação remota somente leitura

Revalidado em 2026-10-04 por metadados, migration list e dois `SELECT`s de catálogo. Nenhum comando de mutation foi chamado.

```text
REMOTE_PROJECT=aruka
REMOTE_PROJECT_REF=vrizeuhuhvtvbrmtvdik
REMOTE_REGION=us-east-2
REMOTE_STATUS=ACTIVE_HEALTHY
REMOTE_POSTGRES_VERSION=17.6
REMOTE_MIGRATION_COUNT=25
REMOTE_LAST_MIGRATION=20260909110000
REMOTE_PENDING_COUNT=15
REMOTE_DRIFT_CHANGED=NO
```

O `transaction_read_only` padrão da conexão retornou `off`; portanto a credencial não é tratada como tecnicamente read-only. A garantia desta missão foi operacional: todas as consultas enviadas eram `SELECT`, e as ferramentas de DDL/history não foram chamadas.

Confirmado:

- as 25 versões remotas formam o prefixo exato da cadeia local;
- P01–P12, 12.13, 12.15.2 e reconciliation estão ausentes;
- quatro policies legadas de `alunos` permanecem;
- as 17 assinaturas relevantes existem, são `SECURITY DEFINER`, pertencem a `postgres` e ainda permitem `anon` no snapshot remoto;
- os cinco overloads administrativos permanecem;
- `private` não existe e há zero objetos de rollout;
- 75 policies públicas, sendo 70 com expressão direta de `auth.uid()`;
- default/function ACL legado continua permissivo.

### Migration inventory

As 25 versões até `20260909110000` estão `APPLIED`. As 15 seguintes estão `LOCAL_ONLY_EXPECTED` e `PENDING`; não há `UNEXPECTED_REMOTE`:

| Ordem lógica | Version | Nome |
| ---: | --- | --- |
| 1 | `20260914130000` | `cycle12_execution_tracking_and_safety` |
| 2 | `20260914131000` | `cycle12_execution_commands` |
| 3 | `20260914132000` | `cycle12_completion_and_grants` |
| 4 | `20260914185833` | `cycle12_canonical_execution_reads` |
| 5 | `20260915014848` | `cycle12_student_home_v2` |
| 6 | `20260915140229` | `cycle12_student_training_library_v2` |
| 7 | `20260915201101` | `cycle12_workout_player_v2` |
| 8 | `20260919120000` | `cycle12_set_tracking_player_payload` |
| 9 | `20260919231657` | `cycle12_rest_timer_server_clock` |
| 10 | `20260920104727` | `cycle12_workout_completion_feedback` |
| 11 | `20260920144904` | `cycle12_student_evolution_v2` |
| 12 | `20260921010053` | `cycle12_profile_secondary_flows` |
| 13 | `20261004133801` | `cycle12_forward_schema_security_reconciliation` |
| 14 | `20260926174027` | `cycle12_schema_rls_hardening` |
| 15 | `20261003163830` | `cycle12_controlled_rollout_foundation` |

## 4. Problema de ordering

```text
PHYSICAL_REPOSITORY_ORDER:
REMOTE_CURRENT → P01–P12 → 12.13 → 12.15.2 → reconciliation

REQUIRED_LOGICAL_ORDER:
REMOTE_CURRENT → P01–P12 → reconciliation → 12.13 → 12.15.2
```

Um `supabase db push` normal usa a ordem de versões e tenta 12.13 antes da reconciliation. A precondition 62/62 de 12.13 rejeita o drift legado; isso é uma proteção válida e não deve ser removida. No rehearsal, o push físico normal após registrar a reconciliation também recusou corretamente as versões anteriores ausentes e exigiu `--include-all`.

## 5. Comparação de estratégias

| Campo | A — repair oficial | B — SQL + history | C — forward bridge | D — staged CLI |
| --- | --- | --- | --- | --- |
| Suporte oficial | sim, para history | parcial | migration normal não resolve | sim |
| Preserva arquivos | sim | sim | sim, mas adiciona artefato | sim |
| Auditabilidade | média | média | baixa para ordering | alta |
| Muta history | sim | sim | não resolve por si | apenas registro normal |
| Risco de false history | alto se schema não validado | médio/alto | baixo, mas ineficaz | baixo |
| Risco de double apply | médio | médio | alto | baixo |
| Rollback/recovery | complexo | complexo | complexo | por checkpoint |
| Próximo `db push` | compatível se repair exato | compatível se alinhado | ordering segue quebrado | compatível |
| Complexidade operacional | média | alta | alta | média |
| Downtime | sim | sim | sim | sim |
| Fail-fast | médio | configurável | insuficiente | alto |
| Rehearsal | F8 PASS | não escolhido | análise REJECTED | happy path PASS |
| Classificação | `VIABLE_FALLBACK` somente recovery | `VIABLE_FALLBACK` condicionado | `REJECTED` | `PREFERRED` |

### Estratégia A

`migration repair --status applied|reverted` insere/remove registros do histórico e não executa SQL. É adequada para F8 quando o schema já foi provado e o history está errado. Não é o caminho primário porque separa schema e history e pode criar false history.

### Estratégia B

Aplicar SQL controladamente e depois marcar cada versão pode funcionar, mas existe uma janela schema/history, maior carga de evidência e risco de dupla aplicação. Só é fallback se a CLI staged deixar de ser suportada e após novo rehearsal da versão exata.

### Estratégia C

Uma migration nova terá timestamp posterior a 12.13 e 12.15.2. Adicioná-la ao diretório não a faz executar antes dessas migrations; portanto não resolve o ordering sem outro mecanismo, que recai em A, B ou D.

### Estratégia D — recomendada

`db push --local` e `--include-all` foram confirmados pela ajuda da CLI 2.109.1 e pelo rehearsal. Os manifests são views temporárias da mesma árvore: nenhuma migration é renomeada ou editada. Os hashes devem ser verificados antes e depois da cópia.

## 6. Ambiente remote-equivalent

O harness `scripts/validate-cycle-12-15-6-production-upgrade-rehearsal.mjs`:

- restaura a reference baseline e as 25 migrations remotas;
- remove somente no banco local o registro da reference baseline, que não existe em produção;
- reproduz quatro policies legadas, default ACL, grants das 17 funções e cinco assinaturas de overload;
- confirma 25 registros, última versão `20260909110000`, 75 policies e ausência de `private`;
- usa home isolado, token vazio, `--local` e workdirs no diretório temporário;
- restaura a cadeia física oficial em `finally`.

`REMOTE_EQUIVALENCE_GAP`: os corpos dos cinco overloads não foram exportados de produção por segurança. O harness usa stubs de assinatura em banco descartável. Isso não reduz a prova de ordering porque reconciliation, 12.13 e 12.15.2 não removem nem dependem dos corpos desses overloads.

Nenhum dado pessoal real foi copiado.

## 7. Happy path e checkpoints

| Checkpoint | Prova |
| --- | --- |
| 0 | remote-equivalent 25/25, drift e ausência de rollout |
| 1 | P01–P03; recovery de P03 e history correto |
| 2 | P04–P06 aplicadas |
| 3 | P07–P10 aplicadas |
| 4 | P11–P12; 62 direct-auth esperadas |
| 5 | reconciliation; 62/62, matrix 17/17, default ACL PASS |
| 6 | 12.13; direct-auth 0, optimized expressions 69 |
| 7 | 12.15.2; rollout OFF, emergency false, targets 0 |

Resultado: `HAPPY_PATH_REHEARSAL=PASS`.

## 8. Failure injection e recovery

| Falha | Detection / estado | Stop | Retry / recovery |
| --- | --- | --- | --- |
| F1 P01–P03 | P01/P02 no history; P03 ausente; P03 sem estado parcial | não avançar | corrigir causa, validar fingerprint, retomar em P03 |
| F2 antes da reconciliation | P01–P12 no history; drift esperado | manter maintenance | seguro pausar sem tráfego; retomar na reconciliation |
| F3 precondition da reconciliation | reconciliation ausente; policy/ACL fingerprint inalterado | STOP | remover apenas causa conhecida, revalidar, repetir reconciliation |
| F4 entre reconciliation/12.13 | reconciliation no history; 62/62 e ACL reconciliado | manter freeze | seguro retomar em 12.13 após fingerprint |
| F5 12.13 aborta | 12.13 e 12.15.2 ausentes; sem partial state | STOP | corrigir somente drift previamente entendido; repetir fase 12.13 |
| F6 entre 12.13/12.15.2 | hardening no history; direct-auth 0; `private` ausente | manter freeze | seguro retomar em 12.15.2 |
| F7 12.15.2 aborta | history ausente; transaction rollback; rollout inexistente | STOP | validar 12.13, repetir 12.15.2 |
| F8 schema/history divergem | dry-run anuncia versão já presente no schema | STOP | validar schema; `migration repair --status applied` apenas com aprovação DBA |

F1, F3, F5, F7 e F8 foram executadas localmente. F2, F4 e F6 foram materializadas como checkpoints reais e tiveram seus fingerprints verificados. `RECOVERY_REHEARSAL=PASS`.

Retry é preferido somente quando a migration falhou atomicamente e o history confirma ausência. Restore é obrigatório se atomicidade não puder ser provada, houver DML de negócio parcial, conexão instável em etapa não idempotente ou fingerprint desconhecido.

## 9. Backup, PITR e restore

`PITR_STATUS=UNVERIFIED`.

A documentação oficial informa RPO de pior caso de aproximadamente dois minutos quando PITR está habilitado. Isso não comprova que o projeto `aruka` possui PITR. A futura janela exige:

1. comprovação no Dashboard/API de PITR ou backup físico utilizável;
2. restore point imediatamente anterior à primeira escrita, com horário UTC registrado;
3. backup lógico criptografado e testado quando compatível com a política de dados;
4. RTO medido em restore drill; até lá `RTO=UNVERIFIED`;
5. instruções de reativação de subscriptions/replication slots, se existirem;
6. validação pós-restore de history, policies, funções, ACL, row counts críticos e rollout OFF.

Abandonar retry e restaurar quando: atomicidade for incerta, history/schema não puder ser reconciliado por evidência, houver corrupção/indisponibilidade persistente, ou a janela aprovada expirar. Durante recovery, aplicação, jobs e rollout permanecem bloqueados.

## 10. Maintenance e segurança da aplicação

```text
MAINTENANCE_REQUIRED=YES
WRITE_FREEZE_REQUIRED=YES
DEPLOY_FREEZE_REQUIRED=YES
```

Bloquear logins e writes, pausar jobs/background tasks e congelar deploys/migrations durante toda a sequência. P01/P02 podem criar funções antes das correções de grant de P03; P12 ainda deixa o drift pré-reconciliation; 12.13 e 12.15.2 dependem dos fingerprints do checkpoint anterior. Não há benefício operacional em reabrir tráfego entre fases.

## 11. Preflight obrigatório

Todos devem ser `PASS`; qualquer falha resulta em `ABORT_BEFORE_FIRST_WRITE`:

- P00 autorização humana explícita;
- P01 PRs merged;
- P02 `main == origin/main`;
- P03 worktree clean;
- P04 seis hashes críticos confirmados;
- P05 project ref exatamente `vrizeuhuhvtvbrmtvdik`;
- P06 history remoto revalidado imediatamente antes da janela;
- P07 nenhum drift novo;
- P08 backup/PITR e restore point confirmados;
- P09 recovery disponível e operador de restore presente;
- P10 operador autenticado com perfil correto;
- P11 rollout OFF;
- P12 zero real targets;
- P13 emergency state conhecido e `false` antes da janela;
- P14 application/deploy/migration freeze ativo;
- P15 maintenance aprovada e comunicada;
- P16 stop conditions compreendidas por dois operadores.

## 12. Runbook futuro — design, não executar nesta missão

Todos os comandos abaixo são para uma missão futura explicitamente autorizada. O operador deve usar CLI 2.109.1, registrar stdout/stderr e nunca improvisar repair.

### Phase 0 — authorization

- **Operation:** registrar P00–P16, dois operadores e change ticket.
- **Expected:** todos PASS.
- **Validation:** dupla assinatura.
- **Stop:** qualquer item incompleto.
- **Recovery:** nenhuma; não houve escrita.
- **Next:** Phase 1 somente com autorização.

### Phase 1 — preflight

- **Operation:** executar o validator read-only de history/catálogo e SHA-256; comparar com este documento.
- **Expected:** 25 versões, last `20260909110000`, pending 15, drift idêntico.
- **Validation:** salvar fingerprint JSON e `db push --dry-run` esperado no manifest P01–P12.
- **Stop:** qualquer diferença.
- **Recovery:** abortar antes da primeira escrita.
- **Next:** Phase 2.

### Phase 2 — backup/recovery readiness

- **Operation:** criar/confirmar restore point pré-write e registrar earliest/latest recovery point.
- **Expected:** restore disponível e RTO dentro da janela.
- **Validation:** evidência do Dashboard/API revisada por segundo operador.
- **Stop:** PITR/backup ou operador de restore indisponível.
- **Recovery:** abortar.
- **Next:** Phase 3.

### Phase 3 — maintenance/freeze

- **Operation:** ativar maintenance, bloquear writes/login, pausar jobs e congelar deploy/migrations.
- **Expected:** zero tráfego mutável.
- **Validation:** métricas/logs e confirmação dos owners.
- **Stop:** writes continuam.
- **Recovery:** manter aplicação fechada ou abortar antes da primeira migration.
- **Next:** Phase 4.

### Phase 4 — P01–P03

- **Operation:** gerar manifest temporário A com as 25 migrations remotas + P01–P03, verificar hashes e executar `npx -y supabase@2.109.1 --workdir <manifest-A> db push --linked --yes`.
- **Expected:** versões P01–P03 registradas.
- **Validation:** history 28; funções/grants do checkpoint 1.
- **Stop:** erro, versão extra ou ACL inesperada.
- **Recovery:** se migration ausente no history, validar rollback e repetir a partir dela; caso contrário restore.
- **Next:** Phase 5.

### Phase 5 — P04–P06

- **Operation:** ampliar A byte-for-byte até P06, revalidar hashes, mesmo `db push`.
- **Expected:** P04–P06 registradas.
- **Validation:** read models/home/library.
- **Stop/Recovery:** regra geral de atomicidade/history.
- **Next:** Phase 6.

### Phase 6 — P07–P10

- **Operation:** ampliar A até P10 e executar o mesmo push.
- **Expected:** P07–P10 registradas.
- **Validation:** workout/player/execution/rest/completion.
- **Stop/Recovery:** regra geral.
- **Next:** Phase 7.

### Phase 7 — P11–P12

- **Operation:** ampliar A até P12 e executar o mesmo push.
- **Expected:** P11/P12 registradas; total 37.
- **Validation:** evolution/profile, 62 direct-auth e drift conhecido.
- **Stop:** qualquer estado diferente do fingerprint pré-reconciliation.
- **Recovery:** manter maintenance; retry somente da versão ausente e atômica.
- **Next:** Phase 8.

### Phase 8 — reconciliation

- **Operation:** gerar manifest B com as 25 migrations + P01–P12 + reconciliation, explicitamente sem 12.13/12.15.2; confirmar SHA `D15B...1708`; executar o mesmo `db push` sem `--include-all`.
- **Expected:** reconciliation registrada; total 38.
- **Validation:** 62/62, zero `anon` nas 17 assinaturas, ACL matrix 17/17, default ACL probe em transaction rollback, cinco overloads presentes.
- **Stop:** precondition ou postcondition falhar.
- **Recovery:** como F3; não marcar history manualmente.
- **Next:** Phase 9.

### Phase 9 — 12.13

- **Operation:** gerar manifest C com as 40 migrations físicas; confirmar todos os hashes; executar primeiro `db push --linked --include-all --dry-run`, exigir somente 12.13 e 12.15.2; então executar `db push --linked --include-all --yes`.
- **Expected:** 12.13 e 12.15.2 aplicadas nessa ordem pelo conjunto de versões ausentes.
- **Validation após 12.13:** history contém 12.13, direct-auth 0, optimized 69.
- **Stop:** dry-run diferente ou 12.13 abortar.
- **Recovery:** F5; restore se atomicidade incerta.
- **Next:** Phase 10 é validada no mesmo push; não emitir segundo push concorrente.

### Phase 10 — 12.15.2

- **Operation:** continuação serial do push da Phase 9.
- **Expected:** migration registrada após 12.13.
- **Validation:** config OFF, emergency false, targets 0, quatro tabelas privadas.
- **Stop:** qualquer ativação/target ou failure.
- **Recovery:** F7; retry somente se 12.15.2 ausente e rollback provado.
- **Next:** Phase 11.

### Phase 11 — final schema/security

- **Operation:** SELECTs do validator final.
- **Expected:** 62/62 transformadas, direct-auth 0, optimized 69, ACL 17/17, overloads 5.
- **Validation:** fingerprint assinado.
- **Stop:** mismatch.
- **Recovery:** manter maintenance e decidir retry versus restore.
- **Next:** Phase 12.

### Phase 12 — history

- **Operation:** `migration list --linked` e `db push --linked --include-all --dry-run`.
- **Expected:** 40 versões locais/remotas e nenhum push pendente.
- **Validation:** nomes/versions/hashes do relatório.
- **Stop:** divergence; não normalizar silenciosamente.
- **Recovery:** procedimento F8 somente com aprovação DBA e schema comprovado.
- **Next:** Phase 13.

### Phase 13 — rollout remains OFF

- **Operation:** SELECT config/targets.
- **Expected:** OFF, emergency false, targets 0.
- **Validation:** duas leituras consecutivas.
- **Stop:** qualquer diferença.
- **Recovery:** manter maintenance e executar plano específico de segurança, não improvisar.
- **Next:** Phase 14.

### Phase 14 — reopen traffic

- **Operation:** reativar serviços na ordem aprovada; manter deploy freeze.
- **Expected:** health checks e smoke tests passam.
- **Validation:** erros, auth, jobs e latência.
- **Stop:** regressão.
- **Recovery:** voltar a maintenance e aplicar decisão retry/restore.
- **Next:** Phase 15.

### Phase 15 — observation

- **Operation:** observar pelo período aprovado; só então encerrar freeze.
- **Expected:** sem regressão e rollout ainda OFF.
- **Validation:** métricas/logs e sign-off.
- **Stop:** anomalia de segurança/dados.
- **Recovery:** incident runbook.
- **Next:** encerramento; rollout é outra missão.

## 13. Stop conditions

`STOP` imediato para: project ref, history ou hash diferente; schema/policy/function/ACL inesperado; backup/PITR não confirmado; rollout não OFF; targets reais; precondition SQL; history/schema divergence; conexão instável em etapa não idempotente; atomicidade não comprovada; manifest com arquivo transformado; dry-run com conjunto diferente; ou ausência do segundo operador.

Não corrigir produção durante a janela fora de um recovery já ensaiado.

## 14. Estado final esperado do history

Após sucesso, as 40 versões SQL existentes em `supabase/migrations` estarão `applied`. A reconciliation será o registro normal `20261004133801`, embora tenha sido executada logicamente antes de `20260926174027` e `20261003163830`. History representa conjunto de versões aplicadas; a ordem lógica fica preservada pela evidência do runbook.

O próximo `db push --include-all --dry-run` e o próximo `db push` normal não devem listar migrations. Nenhum comando especial permanece necessário após o upgrade. A prova contra reexecução é: history 40/40 + dry-run vazio + fingerprints finais.

## 15. Cinco overloads legados

Continuam `DEFERRED_HUMAN_DECISION`. Não são removidos. Não interferem nas preconditions da reconciliation ou 12.13, não são alterados por 12.15.2 e não afetam o próximo `db push` porque não correspondem a versões pendentes. A estratégia não depende da remoção deles.

## 16. Segurança e GO/NO-GO

```text
LOCAL_REHEARSAL=PASS
UPGRADE_STRATEGY=PASS
RECOVERY_REHEARSAL=PASS
RUNBOOK_READINESS=PASS
REMOTE_PREFLIGHT=PASS_READ_ONLY_SNAPSHOT
REMOTE_MIGRATION_READINESS=NO_GO
PRODUCTION_EXECUTION_AUTHORIZED=NO
PRODUCTION_GO=NO_GO
```

Supabase-specific security review: reconciliation remove `anon`/PUBLIC das 17 funções privilegiadas, restringe policies a `authenticated`, mantém ownership predicates e endurece default ACL; 12.13 elimina expressões diretas e 12.15.2 nasce OFF/zero targets. Nenhum segredo ou dado real foi persistido.

## 17. Referências oficiais verificadas

- Supabase CLI 2.109.1 `db push --help`, `migration up --help`, `migration repair --help`;
- [Repair migration history](https://supabase.com/docs/reference/cli/supabase-migration-repair);
- [Database backups and PITR](https://supabase.com/docs/guides/platform/backups).
