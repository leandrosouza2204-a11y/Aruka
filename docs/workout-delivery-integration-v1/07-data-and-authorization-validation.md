# Ciclo 1.7 - Validacao de dados e autorizacao

## Arquivos alterados

- `supabase/migrations/20260728030000_workout_delivery_integration_v1.sql`
- `supabase/baseline-src/02-tables.sql`
- `supabase/baseline-src/03-constraints.sql`
- `supabase/baseline-src/04-indexes.sql`
- `supabase/baseline-src/05-functions.sql`
- `supabase/baseline-src/08-policies.sql`
- `src/features/treinos/utils/workoutDataContract.js`
- `src/features/treinos/utils/workoutDataContract.test.js`
- `src/services/treinosService.js`
- `scripts/validate-workout-delivery-contract.mjs`
- `scripts/validate-workout-delivery-data.mjs`
- `scripts/validate-workout-delivery-authorization.mjs`
- `package.json`
- documentos e relatorios do ciclo.

## Validacoes planejadas

- `node --test src\features\treinos\utils\*.test.js`
- `npm.cmd run qa:workout-template-sanitization`
- `npm.cmd run qa:workout-templates-data`
- `npm.cmd run qa:workout-template-discovery`
- `npm.cmd run qa:workout-template-guided-application`
- `npm.cmd run qa:personal-workout-template-management`
- `npm.cmd run qa:workout-library-mobile-flow`
- `npm.cmd run qa:workout-delivery-contract`
- `npm.cmd run qa:workout-delivery-data`
- `npm.cmd run qa:workout-delivery-authorization`
- `npm.cmd run qa:supabase-baseline-src`
- `npm.cmd run lint`
- `npm.cmd run build`
- JSON e diff checks.

## QA mobile

`qa:workout-delivery-mobile` nao foi criado nesta etapa. Ele pertence a Etapa 3, quando a interface profissional for alterada.

## Limitacoes

- Antes do hardening, `qa:workout-template-discovery`, `qa:workout-template-guided-application`, `qa:personal-workout-template-management` e `qa:workout-library-mobile-flow` falharam apenas no guard de Supabase inalterado. Os checks funcionais de cada QA foram executados e preservados.
- Depois do hardening, as quatro QAs legadas passaram. A correcao foi contextual: somente os arquivos Supabase autorizados do Ciclo 1.7 sao aceitos; qualquer outro caminho Supabase continua bloqueante.
- Antes do hardening, `supabase:preflight` retornou `PREFLIGHT_FAILED`: Docker Server unavailable, Docker context diferente de `desktop-linux`, Supabase CLI indisponivel via npx e regra esperando somente a baseline na pasta ativa.
- Depois do hardening, `supabase:preflight` nao reporta mais erro de compatibilidade com migrations. Ele reconhece baseline e `20260728030000_workout_delivery_integration_v1.sql` como cadeia ativa esperada, sem migrations inesperadas, ausentes ou com timestamp invalido.
- O preflight segue bloqueado por infraestrutura local: Docker Server unavailable, Docker context must be desktop-linux e Supabase CLI unavailable through npx.
- Nao houve runtime Supabase local nem aplicacao remota de migration.

## Validacao local apos restauracao do Docker

- Docker Client: 29.6.2.
- Docker Server: 29.6.2.
- Contexto Docker: `desktop-linux`.
- Supabase CLI: 2.109.1 no preflight; 2.110.0 em chamada direta via `npx.cmd supabase --version`.
- `npm.cmd run supabase:preflight`: PASS.
- `npx.cmd supabase db reset`: PASS local, com baseline e `20260728030000_workout_delivery_integration_v1.sql` aplicadas.
- Historico local de migrations: `20260716090000`, `20260728030000`.
- `public.treinos`: 13/13 colunas novas presentes.
- `public.treino_eventos`: tabela presente.
- RPCs locais presentes: `salvar_treino_composto(jsonb)`, `entregar_treino(uuid)`, `alterar_estado_treino(uuid, text)`.
- RLS habilitada em `treinos`, `treino_dias`, `treino_exercicios` e `treino_eventos`.
- Policy de leitura de `treino_eventos` presente.

## Bloqueio runtime

O teste transacional autenticado criou usuarios/alunos temporarios com rollback e iniciou a validacao das RPCs. A criacao manual passou ate a verificacao do treino `draft`; a aplicacao por modelo criou evento `applied`, mas a consulta desse evento como papel `authenticated` falhou com:

`permission denied for table treino_eventos`

Classificacao: `BLOCKED_LOCAL_RLS`.

Diagnostico: a policy de SELECT em `treino_eventos` existe, mas o papel `authenticated` nao possui privilegio de SELECT na tabela. Sem esse grant, a policy nao e exercida pelo cliente autenticado. Nao foi feita alteracao funcional nesta rodada para mascarar a falha.

## Correcao do grant e reteste

- Causa raiz: privilegio SQL de tabela ausente para leitura de `public.treino_eventos` pelo papel `authenticated`.
- Correcao aplicada na migration e no baseline: `revoke all on table public.treino_eventos from authenticated; grant select on table public.treino_eventos to authenticated;`.
- `anon`: sem grant de tabela.
- `authenticated`: somente `SELECT` em `treino_eventos`.
- Escrita direta: `INSERT`, `UPDATE` e `DELETE` bloqueados para o cliente autenticado; eventos seguem gravados internamente pelas RPCs `SECURITY DEFINER`.
- RLS: preservada; policy SELECT continua exigindo `auth.uid() = user_id` e treino relacionado pertencente ao mesmo usuario.
- `npx.cmd supabase db reset`: PASS.
- `npm.cmd run supabase:preflight`: PASS.
- Grants runtime: PASS, `authenticated:SELECT`.
- Criacao manual: PASS, treino `draft`, origem nula, `applied_by`/`applied_at` nulos, dias e exercicios criados, sem evento `applied`.
- Aplicacao por modelo: PASS, origem persistida, `applied_by`/`applied_at` preenchidos, evento `applied` criado e legivel pelo dono.
- Idempotencia da aplicacao: PASS, sem duplicar treino, dias, exercicios ou evento.
- Entrega: PASS, muda para `active`, define `delivered_by`/`delivered_at`, cria evento `delivered`.
- Idempotencia da entrega: PASS, `delivered_at` preservado e sem segundo evento `delivered`.
- Treino incompleto: PASS, entrega bloqueada.
- Transicoes permitidas: PASS para `active -> completed`, `draft -> archived`, `active -> archived`, `completed -> archived`.
- Transicoes proibidas: PASS para `archived -> active`, `completed -> active`, `active -> draft`, `archived -> draft`.
- RLS multiusuario: PASS, leitura propria permitida e leitura/entrega/alteracao/aplicacao cruzada bloqueadas.
- Protecao financeira: PASS, sem diff financeiro, tabelas/policies financeiras presentes localmente e nenhum evento de treino em `acompanhamento_eventos`.
- Bateria completa: unitarios 74/74, QAs anteriores, QAs do Ciclo 1.7, baseline QA, lint, build, JSON e diff checks passaram.

## Decisao esperada

`READY_FOR_SERVICE_INTEGRATION`.
