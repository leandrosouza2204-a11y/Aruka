# Auditoria de sincronizacao Supabase local/remoto

## Decisao

Decisao principal: `BLOCKED_REMOTE_SCHEMA_DRIFT`.

Bloqueios adicionais:

- `BLOCKED_LOCAL_STORAGE_BOOTSTRAP`
- `REMOTE_DIFF_SECRET_FORMAT_ERROR`
- `HML_LINK_NOT_RESTORED`

Nenhuma alteracao remota de schema foi executada. Nao houve `db push`, `db pull`, `migration repair`, `db reset --linked`, SQL remoto, commit, push ou PR.

## Semantica Supabase

- `audit_round_supabase_change`: `NO`
- `staged_release_supabase_change`: `YES`
- `staged_release_migrations`: `supabase/migrations/20260730090000_student_identity_contract.sql`
- `production_action_required`: `RECONCILIATION_REQUIRED`

O dry-run e o historico remoto indicaram migrations locais ausentes no remoto. A evidencia manual de catalogo, exportada por SQL somente leitura, agora comprova que o schema remoto nao e equivalente ao schema local reconstruido pelas migrations. As migrations continuam nao aplicaveis diretamente sem reconciliacao previa.

## Estado inicial

- Branch: `feat/workout-delivery-integration-v1`.
- Commit atual: `71297a3 docs: registra bloqueio de identidade do aluno`.
- Diff unstaged inicial: vazio.
- Staging inicial preservado: contrato backend de identidade do aluno e relatorios da auditoria de sincronizacao.
- Nenhum commit da implementacao backend foi criado.

## Projeto de producao confirmado

Confirmado manualmente pelo usuario:

- Nome: `aruka`
- Ref mascarado: `vriz...vdik`
- Dashboard: Healthy
- CLI: `ACTIVE_HEALTHY`

Projeto originalmente vinculado:

- Nome: `Aruka_HML`
- Ref mascarado: `xrmq...adnf`
- CLI: `INACTIVE`

O link temporario para `aruka` foi executado e confirmado na rodada anterior. A tentativa de restaurar o link para HML falhou porque a API Supabase retornou `project is paused`.

Nesta rodada, `Aruka_HML` continuou `INACTIVE`; por seguranca, foi executado o comando oficial `npx.cmd supabase unlink`. A confirmacao posterior mostrou nenhum projeto marcado como linked.

Na validacao posterior da auditoria de equivalencia, `projects list` mostrou `aruka` e `Aruka_HML` como `ACTIVE_HEALTHY`, ambos com `linked:false`. O repositorio permaneceu sem link remoto.

Estado final do link: `UNLINKED_FOR_SAFETY`.

WARNING anterior removido: o repositorio nao permanece linked em producao. Enquanto HML estiver pausado, manter o repositorio sem link remoto salvo auditoria temporaria explicitamente aprovada.

## Ferramentas

- Supabase CLI: `2.110.0`
- Docker Client: `29.6.2`
- Docker Server: `29.6.2`
- Docker context: `desktop-linux`

## Diagnostico do Storage local

Container: `supabase_storage_ConsultoriaFitness`.

Sintoma: `supabase db reset` aplicou migrations e seed, mas encerrou com `supabase_storage_ConsultoriaFitness container is not ready: unhealthy`.

Healthcheck posterior:

- status: `healthy`
- failing streak: `0`
- saida: `remote file exists`

Logs relevantes:

- Storage executou migrations internas `vector_store`.
- Servidor iniciou em `127.0.0.1:5000`.
- O healthcheck falhou inicialmente com conexao recusada e depois passou.

Recursos observados:

- Docker memory limit: `3.749GiB`.
- Storage observado: aproximadamente `136.5MiB`.
- Docker images: `12.81GB`.
- Docker volumes: `167.7MB`.

Classificacao: falha de prontidao/timeout de bootstrap do Storage, nao erro SQL das migrations.

## Replay local

Comando:

`npx.cmd supabase db reset`

Resultado: `BLOCKED_LOCAL_STORAGE_BOOTSTRAP`.

Migrations SQL aplicadas antes da falha:

- `20260716090000_baseline_aruka_v1.sql`
- `20260728030000_workout_delivery_integration_v1.sql`
- `20260730090000_student_identity_contract.sql`

Seed: `supabase/seed.sql` aplicado antes da falha.

## Migration list local

`npx.cmd supabase migration list --local` retornou:

| Local | Remote exibido pela CLI local | Time |
| --- | --- | --- |
| 20260716090000 | 20260716090000 | 2026-07-16 09:00:00 |
| 20260728030000 | 20260728030000 | 2026-07-28 03:00:00 |
| 20260730090000 | 20260730090000 | 2026-07-30 09:00:00 |

## Drift local

Comando:

`npx.cmd supabase db diff --local --schema public`

Resultado: `NO_LOCAL_SCHEMA_DRIFT`.

Saida: `No schema changes found`.

## Inspecao local da migration de identidade

Validado no Postgres local:

- `public.alunos.student_user_id`: `uuid`, nullable.
- FK `alunos_student_user_id_fkey`: `ON DELETE SET NULL`.
- Indice unico parcial: `alunos_student_user_id_uidx`.
- Indice de busca: `alunos_student_user_id_idx`.
- `perfis_role_check` aceita `admin`, `user`, `student`.
- RPCs `vincular_aluno_usuario`, `desvincular_aluno_usuario`, `get_my_student_workouts` sao `SECURITY DEFINER` com `search_path=public`.
- Grants de execucao para `authenticated` nas tres RPCs.

## Testes

Passaram:

- `qa:student-identity-contract`
- `qa:student-workout-rls`
- `qa:student-workout-data-minimization`
- `qa:student-account-linking`
- `qa:student-identity-runtime`
- `qa:supabase-baseline-src`
- `supabase:preflight`
- QAs de entrega do Ciclo 1.7
- unitarios de treinos: `82/82`
- `lint`
- `build`

O QA runtime validou isolamento multiusuario, leitura minimizada do aluno, bloqueio de drafts/archived, bloqueio de dados de outro aluno, bloqueio de escrita pelo aluno, duplicidade de vinculo e `ON DELETE SET NULL` ao remover `auth.users`.

## Auditoria remota em producao

Projeto linked temporario: `aruka` (`vriz...vdik`).

### Migration list remoto

`npx.cmd supabase migration list` retornou as tres migrations com coluna remota vazia:

| Local | Remote | Time | Classificacao |
| --- | --- | --- | --- |
| 20260716090000 | vazio | 2026-07-16 09:00:00 | `LOCAL_ONLY_PENDING_REMOTE_BY_HISTORY` |
| 20260728030000 | vazio | 2026-07-28 03:00:00 | `LOCAL_ONLY_PENDING_REMOTE_BY_HISTORY` |
| 20260730090000 | vazio | 2026-07-30 09:00:00 | `LOCAL_ONLY_PENDING_REMOTE_BY_HISTORY` |

### Dry-run

`npx.cmd supabase db push --dry-run` nao aplicou nada e informou que empurraria:

- `20260716090000_baseline_aruka_v1.sql`
- `20260728030000_workout_delivery_integration_v1.sql`
- `20260730090000_student_identity_contract.sql`

### Diff remoto

`npx.cmd supabase db diff --linked --schema public` falhou no pg-delta na rodada anterior:

`unsupported or invalid secret format`

Classificacao: `REMOTE_DIFF_SECRET_FORMAT_ERROR`.

Investigacao estrutural desta rodada:

- Nenhuma variavel de ambiente Supabase/Postgres sensivel estava presente no processo.
- `.env.local` contem nomes `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
- `.env` e `.env.example` nao estavam presentes.
- `.env*` esta ignorado em `.gitignore`.
- `supabase/config.toml` nao contem senha de banco hardcoded; configuracoes sensiveis exemplificadas usam `env(...)`.

Nao foi executado logout/login porque a autenticacao da CLI funcionou para `projects list`, `link`, `unlink`, `migration list` e `db push --dry-run`; o erro ocorreu especificamente no pg-delta durante o diff.

## Inspecao manual somente leitura

Como o diff remoto continua inconclusivo e nao se deve executar `db pull`, foi criado:

`reports/supabase-production-sync/remote-schema-readonly-inspection.sql`

O arquivo contem apenas consultas `SELECT` de catalogo para:

- tabelas do schema `public`;
- colunas;
- constraints;
- indices;
- policies RLS;
- funcoes publicas;
- grants de tabelas;
- grants de rotinas;
- existencia e conteudo do historico `supabase_migrations.schema_migrations`.

Esse arquivo deve ser executado manualmente no SQL Editor do projeto `aruka` somente para leitura. Ele nao substitui migrations e nao deve ser concatenado com SQL de implantacao.

## Baseline e conflitos

Status: `REMOTE_BASELINE_DIVERGENT`.

Como o diff remoto nao concluiu, a equivalencia foi auditada a partir dos CSVs manuais gerados pelo SQL somente leitura. A comparacao objeto a objeto confirmou divergencias entre o schema local e o catalogo remoto.

Portanto, as migrations sao pendentes por historico/dry-run, mas nao sao consideradas aplicaveis nesta rodada.

## Auditoria de equivalencia de schema

Comando local:

`npm.cmd run qa:supabase-schema-equivalence`

Resultado: `SUPABASE_SCHEMA_EQUIVALENCE_AUDITED BLOCKED_REMOTE_SCHEMA_DRIFT`.

Evidencia de entrada:

- 9 CSVs exportados manualmente para `reports/supabase-production-sync/remote-schema-input/`.
- CSVs brutos mantidos como evidencia temporaria local e ignorados pelo Git.
- Nenhuma alteracao remota executada durante a comparacao.

Resumo da equivalencia apos hardening do auditor:

| Categoria | Equivalente | Local-only | Remote-only | Diferente | Parcial |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tabelas | 20 | 0 | 0 | 0 | 0 |
| Colunas | 255 | 1 | 0 | 70 | 0 |
| Constraints | 65 | 1 | 0 | 5 | 0 |
| Indices | 85 | 2 | 0 | 0 | 0 |
| RLS | 20 | 0 | 0 | 0 | 0 |
| Policies | 3 | 4 | 4 | 48 | 0 |
| Funcoes | 11 | 3 | 5 | 6 | 0 |
| Grants de tabelas | 467 | 0 | 80 | 0 | 0 |
| Grants de funcoes | 0 | 9 | 11 | 0 | 43 |

Impacto da normalizacao:

- Decisao do auditor: `AUDITOR_FALSE_POSITIVES_CORRECTED`.
- Critical: 480 -> 242.
- Defaults diferentes: 169 -> 0.
- Constraints diferentes: 70 -> 5.
- Policies diferentes: 51 -> 48.
- Funcoes diferentes: 17 -> 6.
- Equivalentes: 737 -> 926.
- Ordem fisica de colunas: `COLUMN_ORDER_DIFFERENT_NON_MATERIAL`, severity `informational`.
- Grants de funcoes: `PARTIALLY_VERIFIED`, porque o CSV remoto contem `routine_name`, mas nao contem argumentos/specific_name.

Cobertura por migration:

- Baseline: `divergent`.
- Workout delivery: `divergent`.
- Student identity: `absent`.

Classificacao:

- `production_action_required`: `RECONCILIATION_REQUIRED`.
- `migration_repair_assessment`: `REPAIR_NOT_SAFE`.
- `critical_differences`: 242.
- `local_only_objects`: 20.
- `remote_only_objects`: 100.

Artefatos:

- `reports/supabase-production-sync/schema-equivalence-result.json`
- `reports/supabase-production-sync/schema-equivalence-matrix.csv`
- `reports/supabase-production-sync/schema-equivalence-summary.md`
- `docs/supabase-production-sync/02-schema-equivalence-audit.md`
- `reports/supabase-production-sync/local-schema-catalog/*.json`

## Migrations pendentes

Pendentes por historico e dry-run:

- `20260716090000_baseline_aruka_v1.sql`
- `20260728030000_workout_delivery_integration_v1.sql`
- `20260730090000_student_identity_contract.sql`

Aplicaveis comprovadas: nenhuma.

Nao foi criado `reports/supabase-production-sync/pending-migrations-review.sql`, porque o status de aplicabilidade permanece inconclusivo.

## Riscos

- HML continua pausado/inactive e nao pode ser restaurado como link original nesta rodada.
- Produção nao esta mais linked; o estado final e sem link remoto.
- O baseline pode conflitar se producao ja possuir tabelas/funcoes/policies criadas manualmente.
- O diff remoto precisa ser reexecutado depois de resolver a falha `unsupported or invalid secret format`.
- Nao usar `migration repair` apenas porque o Dashboard mostra `No migrations`.

## Acao recomendada

1. Manter o repositorio sem link remoto enquanto HML estiver pausado.
2. Executar manualmente `reports/supabase-production-sync/remote-schema-readonly-inspection.sql` no SQL Editor do projeto `aruka`.
3. Retornar os resultados de catalogo para comparar objeto por objeto contra as migrations locais.
4. Reexecutar `npx.cmd supabase db diff --linked --schema public` somente em auditoria temporaria aprovada ou depois de resolver a falha do pg-delta.
5. Somente em uma rodada futura, com evidencia de catalogo/diff remoto limpo, avaliar `npx.cmd supabase db push`.

## Politica operacional permanente

Sempre que uma etapa alterar `supabase/**`, a saida final deve informar `SUPABASE_CHANGE: YES` ou `NO` e `PRODUCTION_ACTION_REQUIRED: YES`, `NO` ou `UNKNOWN`.

Quando `SUPABASE_CHANGE: YES`, incluir migration criada, caminho, conteudo SQL integral, baseline, tabelas, colunas, constraints, indices, RLS, policies, RPCs, funcoes, triggers, grants, revokes, dados afetados, resultado do db reset, testes SQL, migration list, dry-run, diff remoto, status de producao, acao do usuario, comando recomendado, rollback conceitual e confirmacao de que `db push` real nao foi executado.
