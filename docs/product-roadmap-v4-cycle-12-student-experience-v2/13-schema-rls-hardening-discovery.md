# Cycle 12.13 — Schema/RLS Hardening Discovery

## 1. Objetivo

Auditar, em modo read-only, o schema PostgreSQL/Supabase local, reproduzir os findings da Cycle 12.11 e definir uma implementação forward-only segura para a Cycle 12.13.2. Nenhuma migration, função, policy, grant, dado, código funcional ou configuração foi alterado nesta missão. A Student Experience V2 permaneceu com rollout OFF.

**Decisão: `DISCOVERY_COMPLETE`.** Há evidência suficiente para iniciar a 12.13.2 com o escopo REQUIRED descrito abaixo.

## 2. Estado inicial

| Item | Estado observado |
| --- | --- |
| Branch | `main` |
| HEAD | `f83d61b77e6ed1e70ea8a56fa5fc3ba59ebcaca0` |
| `origin/main` | `f83d61b77e6ed1e70ea8a56fa5fc3ba59ebcaca0` |
| Working tree | limpa |
| Últimos commits | `f83d61b` merge PR #138; `87555bb` Cycle 12.12; `c9ef3f8` merge PR #137; `5079f0c` Cycle 12.11; `d3caa30` merge PR #136 |
| Migrations incrementais | 37 arquivos SQL; migrations da Cycle 12.10 presentes até `20260921010053` |
| Histórico local | 38 entradas incluindo o baseline histórico; última `20260921010053` |
| PostgreSQL | 17.6, imagem `public.ecr.aws/supabase/postgres:17.6.1.143` |
| Supabase CLI | 2.109.1 via `npx` |
| Docker | 29.8.0; DB/Auth/REST/Storage/Kong/Mailpit locais ativos; DB saudável há 5 dias |
| Schema local | 32 tabelas públicas, 52 funções `SECURITY DEFINER`, 73 policies públicas |
| Rollout V2 | OFF por padrão |

O wrapper PowerShell `npx.ps1` estava bloqueado pela execution policy do host. O uso explícito de `npx.cmd`/`cmd.exe` resolveu a limitação sem alterar configuração. Não houve reset, bootstrap, seed ou sincronização Git.

## 3. Fontes analisadas

- `docs/product-roadmap-v4-cycle-12-student-experience-v2/11-integrated-experience-audit.md`;
- `reports/cycle-12-11-integrated-experience-audit.md`;
- `docs/product-roadmap-v4-cycle-12-student-experience-v2/12-qa-harness-stabilization.md`;
- `reports/cycle-12-12-qa-harness-stabilization.md`;
- baseline, 37 migrations incrementais, migrations arquivadas relevantes e catálogo PostgreSQL local;
- serviços frontend, especialmente `adminService.js` e os serviços da Student Experience V2;
- validadores runtime/RLS existentes das Cycles 12.2–12.10 e de subscription lifecycle;
- documentação oficial atual do Supabase sobre RLS, advisors e lint.

## 4. Reprodução dos findings

| Finding | Comando/mecanismo | Resultado atual |
| --- | --- | --- |
| SQLSTATE 42725 | `supabase db lint --local --schema public --level warning` | reproduzido em `admin_liberar_assinante`; chamada de `admin_upsert_assinatura` não é única |
| Variáveis não lidas | mesmo lint | `v_status` e `v_plan` em `admin_subscription_lifecycle_action` |
| `auth_rls_initplan` | `supabase db advisors --local --type all` | exatamente 62 WARN, todos em policies de `public` |
| Catálogo RLS | `pg_class`, `pg_policy`, `pg_policies`, transação `READ ONLY` | 32 tabelas públicas, todas com RLS; 73 policies |
| SECURITY DEFINER | `pg_proc`, ACLs, definições e migrations | 52 funções revisadas; findings LOW/INFO abaixo |

O advisor emitiu um finding por policy, mesmo quando a mesma policy contém chamadas em `USING` e `WITH CHECK`. A inspeção complementar encontrou 78 expressões (`USING`/`WITH CHECK`) e 94 ocorrências diretas de `auth.uid()` dentro das 62 policies. Oito policies de `storage.objects` também usam o padrão direto, mas não fazem parte dos 62 resultados do comando nem do inventário mínimo solicitado para `public`; ficaram em DEFERRED.

## 5. SQLSTATE 42725 — análise da ambiguidade

### Objetos atuais

| Função | Defaults | Retorno | Segurança/owner | `search_path` | ACL explícita | Origem |
| --- | --- | --- | --- | --- | --- | --- |
| `admin_upsert_assinatura(uuid,text,text,date,date,text)` | `p_user_agent = null` | `void` | DEFINER / `postgres` | `public, auth` | `authenticated`, `service_role` | baseline `20260716090000` |
| `admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean)` | argumentos 6–8: `null`, `null`, `false` | `void` | DEFINER / `postgres` | `public, auth` | `authenticated`, `service_role` | `20260821120000_subscription_lifecycle_policy.sql` |
| `admin_liberar_assinante(uuid,text,date,date,text)` | `p_user_agent = null` | `void` | DEFINER / `postgres` | `public, auth` | `authenticated`, `service_role` | baseline |

`admin_liberar_assinante` chama:

```sql
perform public.admin_upsert_assinatura(
  p_user_id, p_plano, 'ativo', p_data_inicio, p_data_vencimento, p_user_agent
);
```

Os seis tipos iniciais dos dois overloads são idênticos. Como o overload moderno aceita omitir `p_grace_until` e `p_cancel_at_period_end`, ambos são candidatos válidos para uma chamada de seis argumentos. O literal `unknown` `'ativo'` aparece na mensagem do lint, mas **não é a causa suficiente**: converter apenas o literal para `text` continua deixando dois candidatos com os mesmos seis tipos efetivos. A causa raiz é a combinação de overload legado preservado + defaults no overload de oito argumentos + call site posicional de seis argumentos.

Não há dependência entre funções registrada por `pg_depend` para esses corpos PL/pgSQL; portanto, o catálogo não protege contra quebra de call sites. A busca estática encontrou os consumidores locais em `adminService.js`, `admin_liberar_assinante` e documentos/testes de reconciliação. O frontend atual envia os oito parâmetros ao RPC moderno e cinco ao RPC `admin_liberar_assinante`. Artefatos históricos registram explicitamente que consumidores externos dos overloads legados não foram comprovados ausentes.

### Remediação recomendada

**REQUIRED e menor risco:** `CREATE OR REPLACE` somente de `admin_liberar_assinante(uuid,text,date,date,text)` e fazer a chamada moderna com oito argumentos explícitos:

```sql
perform public.admin_upsert_assinatura(
  p_user_id, p_plano, 'ativo'::text, p_data_inicio, p_data_vencimento,
  p_user_agent, null::date, false
);
```

Isso elimina o 42725 observado, não muda assinatura, grants nem consumidores do wrapper e define os novos campos com os mesmos defaults do overload moderno. O cast documenta o contrato, mas os argumentos 7 e 8 é que tornam a resolução única.

**RECOMMENDED após inventário externo:** descontinuar o overload de seis argumentos ou remover defaults que tornem contratos sobrepostos. Não fazer isso na 12.13.2 sem evidência de consumidores remotos/externos. Remover já o overload legado tem risco maior do que corrigir o call site.

Testes obrigatórios: schema lint sem 42725; admin autenticado libera assinante e persiste estado/log; não-admin e anon são negados; chamada moderna de oito parâmetros continua funcional; overloads e grants permanecem os esperados.

## 6. `admin_subscription_lifecycle_action`

`v_status` e `v_plan` são carregadas tanto na leitura inicial quanto após a criação da assinatura, mas nunca são lidas. `v_start`, `v_end` e `v_grace` são usadas nos branches de ação. A inspeção do fluxo completo não encontrou branch, log ou validação que dependa de `v_status`/`v_plan`.

Classificação de ambas: **A — realmente mortas**. Elas parecem ter sido reservadas durante a modelagem genérica do lifecycle, mas o código final usa diretamente colunas no `UPDATE` e parâmetros. Não há evidência de comportamento futuro contratado.

Remediação mínima futura: remover as duas declarações e remover `status, plano`/as duas posições correspondentes dos dois pares `SELECT ... INTO`. Não alterar branches, validações, logs ou assinatura. Regressão: executar todas as ações (`mark_paid`, `enter_grace`, `extend_grace`, `suspend_subscription`, `reactivate_subscription`, `schedule_cancellation`, `cancel_now`) e os casos inválidos.

## 7. Inventário RLS público

Todas as 32 tabelas públicas têm RLS habilitado; nenhuma usa `FORCE ROW LEVEL SECURITY`. Todas as 73 policies são `PERMISSIVE` e dirigidas a `authenticated`. Não há tabela pública com RLS desabilitado. `workout_execution_session_feedback` tem RLS sem policy e sem grant direto de escrita: acesso é mediado pelas RPCs V2, portanto isso é deny-by-default intencional, não vulnerabilidade.

| Tabela | Policies (comando → predicado atual resumido) |
| --- | --- |
| `aceites_legais` | SELECT own `auth.uid=user_id`; INSERT own + termos/política verdadeiros |
| `acompanhamento_eventos` | SELECT own; INSERT own + aluno own + plano own/opcional |
| `admin_logs` | SELECT `admin_eh_admin()`; INSERT sempre false |
| `aluno_contratos` | SELECT own com `(select auth.uid())` + vínculo de aluno |
| `alunos` | SELECT/INSERT/DELETE own; UPDATE own em USING e CHECK |
| `anamneses` | SELECT/DELETE own; INSERT e UPDATE own + aluno own |
| `aoe_audit_events` | SELECT admin |
| `aoe_decision_traces` | SELECT decisão do ator ou admin |
| `aoe_decisions` | SELECT ator/admin/ownership; INSERT ator + ownership |
| `aoe_human_reviews` | SELECT ator/admin; INSERT ator; UPDATE ator em USING/CHECK |
| `aoe_idempotency_keys` | ALL ator ou admin em USING/CHECK |
| `assinaturas` | SELECT own; INSERT own somente `pendente` |
| `avaliacoes` | SELECT/DELETE own; INSERT e UPDATE own + aluno own |
| `exercise_favorites` | SELECT/DELETE own; INSERT own + exercício oficial/próprio ativo |
| `exercise_library` | SELECT oficial ativo/próprio/prescrito; INSERT/UPDATE pessoal own + profissional ativo; DELETE false |
| `pagamentos` | SELECT own + aluno own; INSERT/UPDATE own + aluno own; DELETE own |
| `perfis` | SELECT own; INSERT own com role/tipo/status padrão |
| `planos` | SELECT/INSERT/DELETE own; UPDATE own em USING/CHECK |
| `professional_contact_settings` | SELECT/INSERT/UPDATE own; todas já usam `(select auth.uid())` |
| `smart_management_locations` | ALL own + profissional válido em USING/CHECK |
| `smart_management_services` | ALL own + profissional válido em USING/CHECK |
| `smart_management_transfer_rules` | ALL own + profissional válido em USING/CHECK |
| `smart_management_transfer_tiers` | ALL own + profissional válido em USING/CHECK |
| `treino_dias` | SELECT/INSERT/DELETE via treino own; UPDATE idem em USING/CHECK |
| `treino_eventos` | SELECT own + treino own |
| `treino_exercicios` | SELECT/INSERT/DELETE via dia→treino own; UPDATE idem em USING/CHECK |
| `treinos` | SELECT/DELETE own; INSERT/UPDATE own + aluno own |
| `workout_execution_exercises` | SELECT sessão cujo aluno é student/professional autorizado, já com initplan |
| `workout_execution_session_feedback` | sem policy; deny direto intencional, RPC-only |
| `workout_execution_sessions` | SELECT aluno ou profissional autorizado, já com initplan |
| `workout_execution_sets` | SELECT via exercício→sessão→aluno autorizado, já com initplan |
| `workout_templates` | SELECT own ativo não-system; INSERT/UPDATE/DELETE own não-system |

Separação semântica:

- Student V2: três policies de leitura `workout_execution_*`, três policies de `professional_contact_settings` e deny-by-default de feedback; todas fora dos 62 warnings.
- Produto ativo profissional/legado: ownership policies de perfis, alunos, planos, assinaturas, pagamentos, avaliações, anamneses, treinos, templates, biblioteca e favoritos.
- Administrativo/AOE: policies de logs e AOE; helpers DEFINER fazem a autorização adicional.
- Smart management: quatro policies ativas do módulo profissional, mas fora do caminho Student V2.
- Redundância: não foi encontrada policy permissiva duplicada com mesmo comando/role/predicado. Policies separadas por comando são intencionais.

## 8. Inventário `auth_rls_initplan`

### Contagem e classificação

| Classe | Policies | Classificação | Transformação segura |
| --- | ---: | --- | --- |
| Core/treino: ownership simples ou relacional | 45 | P2 | substituir somente `auth.uid()`; manter correlação de linha e joins |
| Biblioteca/favoritos | 6 | P2 | substituir chamadas Auth; não encapsular helper dependente de `id` |
| Smart management | 4 | P3 | substituir Auth; manter helper profissional e ambos USING/CHECK |
| AOE | 7 | P3 | substituir Auth; não encapsular `aoe_user_owns_student(student_id)` porque depende da linha |
| Student V2 diretamente | 0 | P1 | nenhuma mudança |
| Sem mudança/investigação | 0 | P4 | — |
| **Total** | **62** | 51 P2, 11 P3 | — |

### Lista individual auditável

Cada item abaixo é um finding do advisor. `U` indica `USING`, `C` indica `WITH CHECK`; UPDATE/ALL preservam ambos.

- `aceites_legais`: listar SELECT/U; registrar INSERT/C — P2.
- `acompanhamento_eventos`: listar SELECT/U; cadastrar INSERT/C — P2.
- `alunos`: listar SELECT/U; cadastrar INSERT/C; atualizar UPDATE/U+C; excluir DELETE/U — P2.
- `anamneses`: listar SELECT/U; cadastrar INSERT/C; atualizar UPDATE/U+C; excluir DELETE/U — P2.
- `assinaturas`: listar SELECT/U; cadastrar INSERT/C — P2.
- `avaliacoes`: listar SELECT/U; cadastrar INSERT/C; atualizar UPDATE/U+C; excluir DELETE/U — P2.
- `pagamentos`: listar SELECT/U; cadastrar INSERT/C; atualizar UPDATE/U+C; excluir DELETE/U — P2.
- `perfis`: listar SELECT/U; criar INSERT/C — P2.
- `planos`: listar SELECT/U; cadastrar INSERT/C; atualizar UPDATE/U+C; excluir DELETE/U — P2.
- `treino_dias`: listar SELECT/U; cadastrar INSERT/C; atualizar UPDATE/U+C; excluir DELETE/U — P2.
- `treino_eventos`: listar SELECT/U — P2.
- `treino_exercicios`: listar SELECT/U; cadastrar INSERT/C; atualizar UPDATE/U+C; excluir DELETE/U — P2.
- `treinos`: listar SELECT/U; cadastrar INSERT/C; atualizar UPDATE/U+C; excluir DELETE/U — P2.
- `workout_templates`: listar SELECT/U; cadastrar INSERT/C; atualizar UPDATE/U+C; excluir DELETE/U — P2.
- `exercise_favorites`: ler SELECT/U; favoritar INSERT/C; remover DELETE/U — P2.
- `exercise_library`: ler SELECT/U; criar INSERT/C; atualizar UPDATE/U+C — P2. A policy DELETE=false não gera warning.
- `aoe_decision_traces`: consultar SELECT/U — P3.
- `aoe_decisions`: listar SELECT/U; criar INSERT/C — P3.
- `aoe_human_reviews`: consultar SELECT/U; criar INSERT/C; atualizar UPDATE/U+C — P3.
- `aoe_idempotency_keys`: ALL/U+C — P3.
- `smart_management_locations`: ALL/U+C — P3.
- `smart_management_services`: ALL/U+C — P3.
- `smart_management_transfer_rules`: ALL/U+C — P3.
- `smart_management_transfer_tiers`: ALL/U+C — P3.

As contagens por bloco são 45 core/treino, 6 biblioteca, 7 AOE e 4 smart management = 62. Os nomes completos e expressões vigentes foram confrontados com `pg_policies`; a migration futura deve usar esses nomes exatos.

Inventário exato dos 62 findings (tabela | policy | comando | cláusula | prioridade):

| Tabela | Policy exata | Comando/cláusula | Classe |
| --- | --- | --- | --- |
| aceites_legais | Usuarios podem listar seus aceites legais | SELECT/U | P2 |
| aceites_legais | Usuarios podem registrar seus aceites legais | INSERT/C | P2 |
| acompanhamento_eventos | Usuarios podem cadastrar seus eventos de acompanhamento | INSERT/C | P2 |
| acompanhamento_eventos | Usuarios podem listar seus eventos de acompanhamento | SELECT/U | P2 |
| alunos | Usuarios podem atualizar seus alunos | UPDATE/U+C | P2 |
| alunos | Usuarios podem cadastrar seus alunos | INSERT/C | P2 |
| alunos | Usuarios podem excluir seus alunos | DELETE/U | P2 |
| alunos | Usuarios podem listar seus alunos | SELECT/U | P2 |
| anamneses | Usuarios podem atualizar suas anamneses | UPDATE/U+C | P2 |
| anamneses | Usuarios podem cadastrar suas anamneses | INSERT/C | P2 |
| anamneses | Usuarios podem excluir suas anamneses | DELETE/U | P2 |
| anamneses | Usuarios podem listar suas anamneses | SELECT/U | P2 |
| aoe_decision_traces | Traces AOE restritos ao profissional autorizado | SELECT/U | P3 |
| aoe_decisions | Usuarios podem criar decisoes AOE dos seus alunos | INSERT/C | P3 |
| aoe_decisions | Usuarios podem listar decisoes AOE dos seus alunos | SELECT/U | P3 |
| aoe_human_reviews | Usuarios podem atualizar reviews AOE autorizadas | UPDATE/U+C | P3 |
| aoe_human_reviews | Usuarios podem consultar reviews AOE autorizadas | SELECT/U | P3 |
| aoe_human_reviews | Usuarios podem criar reviews AOE autorizadas | INSERT/C | P3 |
| aoe_idempotency_keys | Idempotencia AOE restrita ao ator | ALL/U+C | P3 |
| assinaturas | Usuarios podem cadastrar suas assinaturas | INSERT/C | P2 |
| assinaturas | Usuarios podem listar suas assinaturas | SELECT/U | P2 |
| avaliacoes | Usuarios podem atualizar suas avaliacoes | UPDATE/U+C | P2 |
| avaliacoes | Usuarios podem cadastrar suas avaliacoes | INSERT/C | P2 |
| avaliacoes | Usuarios podem excluir suas avaliacoes | DELETE/U | P2 |
| avaliacoes | Usuarios podem listar suas avaliacoes | SELECT/U | P2 |
| exercise_favorites | Profissionais favoritam exercicios visiveis | INSERT/C | P2 |
| exercise_favorites | Profissionais leem seus favoritos | SELECT/U | P2 |
| exercise_favorites | Profissionais removem seus favoritos | DELETE/U | P2 |
| exercise_library | Profissionais atualizam exercicios pessoais | UPDATE/U+C | P2 |
| exercise_library | Profissionais criam exercicios pessoais | INSERT/C | P2 |
| exercise_library | Profissionais leem biblioteca oficial e propria | SELECT/U | P2 |
| pagamentos | Usuarios podem atualizar seus pagamentos | UPDATE/U+C | P2 |
| pagamentos | Usuarios podem cadastrar seus pagamentos | INSERT/C | P2 |
| pagamentos | Usuarios podem excluir seus pagamentos | DELETE/U | P2 |
| pagamentos | Usuarios podem listar seus pagamentos | SELECT/U | P2 |
| perfis | Usuarios podem criar seu perfil padrao | INSERT/C | P2 |
| perfis | Usuarios podem listar seu perfil | SELECT/U | P2 |
| planos | Usuarios podem atualizar seus planos | UPDATE/U+C | P2 |
| planos | Usuarios podem cadastrar seus planos | INSERT/C | P2 |
| planos | Usuarios podem excluir seus planos | DELETE/U | P2 |
| planos | Usuarios podem listar seus planos | SELECT/U | P2 |
| smart_management_locations | Profissionais gerenciam seus locais inteligentes | ALL/U+C | P3 |
| smart_management_services | Profissionais gerenciam seus servicos inteligentes | ALL/U+C | P3 |
| smart_management_transfer_rules | Profissionais gerenciam suas regras inteligentes | ALL/U+C | P3 |
| smart_management_transfer_tiers | Profissionais gerenciam suas faixas inteligentes | ALL/U+C | P3 |
| treino_dias | Usuarios podem atualizar dias dos seus treinos | UPDATE/U+C | P2 |
| treino_dias | Usuarios podem cadastrar dias dos seus treinos | INSERT/C | P2 |
| treino_dias | Usuarios podem excluir dias dos seus treinos | DELETE/U | P2 |
| treino_dias | Usuarios podem listar dias dos seus treinos | SELECT/U | P2 |
| treino_eventos | Usuarios podem listar eventos dos seus treinos | SELECT/U | P2 |
| treino_exercicios | Usuarios podem atualizar exercicios dos seus treinos | UPDATE/U+C | P2 |
| treino_exercicios | Usuarios podem cadastrar exercicios dos seus treinos | INSERT/C | P2 |
| treino_exercicios | Usuarios podem excluir exercicios dos seus treinos | DELETE/U | P2 |
| treino_exercicios | Usuarios podem listar exercicios dos seus treinos | SELECT/U | P2 |
| treinos | Usuarios podem atualizar seus treinos | UPDATE/U+C | P2 |
| treinos | Usuarios podem cadastrar seus treinos | INSERT/C | P2 |
| treinos | Usuarios podem excluir seus treinos | DELETE/U | P2 |
| treinos | Usuarios podem listar seus treinos | SELECT/U | P2 |
| workout_templates | Usuarios podem atualizar seus modelos de treino | UPDATE/U+C | P2 |
| workout_templates | Usuarios podem cadastrar seus modelos de treino | INSERT/C | P2 |
| workout_templates | Usuarios podem excluir seus modelos de treino | DELETE/U | P2 |
| workout_templates | Usuarios podem listar seus modelos de treino | SELECT/U | P2 |

### Semântica antes/depois

`auth.uid()` é estável durante uma statement e não depende da linha. O scalar subquery `(select auth.uid())` retorna exatamente um valor, inclusive `NULL`, então comparações, `AND`, `OR`, `EXISTS`, SELECT, INSERT, UPDATE e DELETE mantêm a lógica ternária atual. Roles, comandos, modo permissivo, colunas correlacionadas e helpers não serão alterados.

Não fazer substituição global de outras funções. `aoe_user_owns_student(student_id)` e `exercise_is_prescribed_to_current_student(id)` dependem da linha e não podem virar initplans constantes. `admin_eh_admin()` e helpers sem argumento podem ser avaliados separadamente, mas não são necessários para resolver os 62 findings.

## 9. SECURITY DEFINER review

Foram revisadas 52 funções DEFINER: owner, `search_path`, ACL, acesso anon/authenticated, presença de `auth.uid()`, vínculos e SQL dinâmico. Nenhuma usa SQL dinâmico. Dezoito usam `search_path=''`; 24 usam `public`; 10 usam `public, auth`. `anon` e `authenticated` têm USAGE, mas não CREATE, em `public` ou `auth`.

### Student Experience V2

As RPCs V2 de Home, Biblioteca/detalhe, Player, histórico/performance, comandos de série/skip/cancelamento/conclusão, Evolução/avaliações, Perfil e contato usam `search_path=''`, relações qualificadas, identidade derivada de `auth.uid()`, vínculo ativo quando aplicável e revogação de `PUBLIC`/`anon`. Helpers internos de payload/snapshot não são executáveis por clientes. Não foi encontrada escalada ou cross-student read confirmada.

### Findings confirmados

| Severidade | Finding | Evidência | Decisão |
| --- | --- | --- | --- |
| CRITICAL | nenhum | — | — |
| HIGH | nenhum | — | — |
| MEDIUM | nenhum confirmado | nenhum bypass de auth/ownership demonstrado | — |
| LOW | `renovar_aluno_contrato(...)` mantém `PUBLIC EXECUTE` | ACL contém `=X/postgres`; anon pode invocar, embora o corpo rejeite `auth.uid() is null` e valide ownership de aluno/plano | revogar de PUBLIC/anon em hardening separado, após teste de contrato |
| LOW | 34 funções legadas usam `search_path=public` ou `public, auth` | catálogo local; risco de resolução futura/mudança de grants, mas roles da API não podem criar objetos nesses schemas hoje | harden gradual para `''` com qualificação completa; não misturar mecanicamente na migration RLS |
| INFO | 48 funções DEFINER são executáveis por `authenticated` | em grande parte RPCs intencionais; autorização interna revisada por grupos | manter apenas quando API pública intencional; adicionar assert de ACL |

As 12 funções admin/subscription chamam direta ou indiretamente `admin_validar_acesso()`/`admin_eh_admin()`. O defeito 42725 é funcional, não um bypass de autorização. Funções service-role-only e triggers sem `auth.uid()` não precisam validar usuário final. O grant PUBLIC de renovação não resultou em escalada comprovada porque há `AUTH_REQUIRED` e ownership em `alunos`/`planos`; ainda assim viola menor privilégio.

## 10. Impacto sobre Student Experience V2

| Fluxo | Fronteira principal | Policies/tabelas | Impacto da 12.13.2 |
| --- | --- | --- | --- |
| Home | `get_my_student_home_v2()` | `alunos`, `treinos`, execução; DEFINER com aluno ativo | nenhum warning P1; regressão obrigatória |
| Biblioteca/detalhe | duas RPCs V2 | treino/dias/exercícios/biblioteca; identidade do aluno | policies profissionais P2 mudam só forma de avaliar Auth |
| Player/tracking/timer | Player + comandos V2 | três policies `workout_execution_*` já otimizadas | nenhuma alteração de policy V2 |
| Conclusão/feedback | `complete_workout_execution_session_v2` | feedback sem acesso direto | nenhuma alteração |
| Evolução | frequência + avaliações V2 | aluno ativo e vínculo profissional | policy legada `avaliacoes` muda semântica-preservando; RPC segue igual |
| Perfil | `get_my_student_profile_v2` | aluno/perfil/contact settings | contact policies já otimizadas |
| Contato profissional | get/save contact | ownership derivado de Auth | nenhuma alteração |

Aluno cross-student, profissional sem vínculo, suspenso/revogado e anon continuam negados pelos mesmos predicados/RPCs. Dados administrativos continuam fora dos payloads. A implementação não deve ativar rollout nem alterar respostas.

## 11. Performance

`EXPLAIN` read-only em `perfis` mostrou o padrão direto expandindo `current_setting(...)` no filtro de scan. O padrão com scalar subquery criou `InitPlan 1` e reutilizou o valor. Isso comprova a mudança de forma do plano. A tabela local é pequena e o plano permaneceu `Seq Scan`; não foi executado `ANALYZE` nem benchmark, portanto não há percentual de ganho comprovado.

- Comprovado: criação de InitPlan/valor único por statement.
- Esperado: menor custo por linha em scans maiores, conforme advisor/documentação Supabase.
- Não medido: ganho de latência/capacidade em carga real.

## 12. Plano de migration forward-only

Na 12.13.2, criar uma migration nova por `supabase migration new cycle12_schema_rls_hardening`; não editar baseline ou migrations históricas.

Ordem transacional recomendada:

1. Assertions de precondição: assinaturas exatas dos overloads, 62 nomes/predicados esperados e grants atuais.
2. `CREATE OR REPLACE` de `admin_liberar_assinante` com chamada explícita de oito argumentos. Não mudar assinatura, owner, `search_path` ou ACL nesse passo.
3. `CREATE OR REPLACE` de `admin_subscription_lifecycle_action` removendo apenas `v_status`/`v_plan` e os campos/targets correspondentes.
4. `ALTER POLICY` nas 62 policies. Como comando, roles e permissividade não mudam, `DROP/CREATE` é desnecessário; alterar somente `USING` e/ou `WITH CHECK` reduz a janela de risco.
5. Assertions pós-mudança: hashes/expressões, RLS, roles, grants e overloads.
6. Executar lint, advisors e matriz runtime antes de qualquer entrega.

Nenhum `DROP FUNCTION` é necessário no escopo REQUIRED. `CREATE OR REPLACE` preserva grants porque as assinaturas não mudam. Se no futuro o overload legado for removido, será necessária migration separada, prova de ausência de consumidor e `DROP FUNCTION` com assinatura completa, sem CASCADE.

Recuperação lógica local: uma nova migration corretiva restaura as duas definições anteriores e os predicados exatos capturados neste documento; não reescrever histórico. Falha transacional deve abortar tudo.

## 13. Matriz de regressão da 12.13.2

| Gate | Reuso existente | Lacuna/novo teste requerido |
| --- | --- | --- |
| A bootstrap/migrations | `supabase:bootstrap`, `supabase:validate`, migration list | bootstrap efêmero limpo e assert de 62 ALTERs |
| B schema inventory | validadores Supabase existentes | snapshot exato: 32 tabelas, RLS, 73 policies e ACLs |
| C lint/advisors | `db lint`, `db advisors` | lint sem 42725/variáveis; zero `auth_rls_initplan` em public |
| D runtime/RLS | matrizes de RLS existentes | teste genérico antes/depois para cada grupo de policy |
| E isolamento aluno/aluno | `qa:cycle-12-2-runtime-matrix`, runtimes 12.3–12.10 | garantir cross-student deny em leitura e escrita |
| F aluno/profissional | mesmos runtimes | profissional sem vínculo e identidade profissional em RPC aluno negados |
| G profissional válido | services/treinos/exercise/smart runtimes | CRUD permitido apenas para ownership válido |
| H revogado/suspenso | runtimes 12.2–12.10 | repetir todos os RPCs V2 sensíveis |
| I SECURITY DEFINER | scripts de segurança 12.2–12.10 | snapshot de owner/search_path/ACL; anon negado; renovar sem PUBLIC se incluído depois |
| J assinatura/admin | `qa:subscription-lifecycle-admin-runtime` | admin/non-admin/anon, wrapper liberar, overload moderno, todas ações lifecycle |
| K Student V2 | static/runtime 12.2–12.10 | executar sequência completa; rollout continua OFF |
| L build | `npm run build` | PASS sem mudança de bundle funcional |
| M ESLint | `npm run lint` | PASS |
| N whitespace | `git diff --check` | PASS e delta restrito à migration/testes/docs da implementação |

Testes novos essenciais: compile/exec do wrapper sem 42725; assert dos defaults novos (`grace_until null`, `cancel_at_period_end false`); catalog test individual das 62 policies; matriz anon/authenticated e own/cross-own por classe; teste de equivalência de NULL; assert de que helpers dependentes de linha não foram encapsulados.

## 14. Plano exato da implementação 12.13.2

### REQUIRED

1. `admin_liberar_assinante`: chamada explícita de oito argumentos; evidência 42725; risco baixo; depende dos dois overloads atuais; testar admin/negações/log/defaults.
2. `admin_subscription_lifecycle_action`: remover duas variáveis e targets mortos; evidência lint; risco baixo; testar sete ações e erros.
3. 62 policies públicas listadas: envolver apenas chamadas Auth constantes em scalar subquery, preservando toda autorização; risco médio pelo volume; testar inventário, advisor e matrizes por classe.
4. Nova migration forward-only transacional com assertions; risco baixo/médio; testar bootstrap limpo e schema final.

### RECOMMENDED

1. Adicionar teste automatizado de catálogo que falha se surgir overload com defaults sobrepostos.
2. Adicionar snapshot auditável de policies e advisor count ao CI.
3. Revogar `PUBLIC`/`anon` de `renovar_aluno_contrato` em migration própria, com regressão de renovação.
4. Harden gradual das 34 funções legadas para `search_path=''` e nomes qualificados, por domínio e com testes.

### DEFERRED

1. Remoção do overload legado de seis argumentos até revisão de consumidores externos.
2. Oito policies de `storage.objects` com `auth.uid()` direto, fora dos 62/public desta missão.
3. Otimização de helpers RLS não sinalizados; funções com argumento de linha exigem análise específica.
4. Benchmark com volume representativo; não necessário para provar preservação semântica.

## 15. Riscos

- Uma substituição textual global pode encapsular função dependente da linha e mudar autorização/performance.
- UPDATE/ALL exigem preservar simultaneamente `USING` e `WITH CHECK`.
- Recriar policy por DROP/CREATE aumenta risco de janela sem policy; preferir `ALTER POLICY` na transação.
- Remover overload legado agora pode quebrar consumidor externo não inventariado.
- Misturar search_path/grants com os 62 ALTERs aumenta superfície de regressão; separar hardening adicional.
- Owners bypassam RLS; testes devem executar como `authenticated`/`anon`, não como `postgres`.

## 16. Itens deferred

Os itens DEFERRED estão listados na seção 14. Nenhum representa bloqueio para a correção REQUIRED. O grant PUBLIC e os search paths legados são findings reais de hardening/least privilege, mas não produziram bypass demonstrável no estado atual.

## 17. Decisão

`DISCOVERY_COMPLETE`.

Respostas objetivas:

1. O 42725 vem de dois overloads que aceitam os mesmos seis tipos por defaults no moderno.
2. Menor risco: passar explicitamente os oito argumentos no wrapper, preservando overloads.
3. Existem 62 `auth_rls_initplan` atuais no advisor local.
4. As 62 policies estão individualizadas na seção 8.
5. Nenhuma é policy criada/diretamente usada como fronteira principal da Student V2; policies V2 já estão otimizadas.
6. A transformação segura é somente `auth.uid()` constante → `(select auth.uid())`, preservando correlação/helpers.
7. SECURITY DEFINER: nenhum CRITICAL/HIGH/MEDIUM confirmado; dois grupos LOW (grant PUBLIC único e 34 search paths legados).
8. A migration será nova, transacional, forward-only, com 2 `CREATE OR REPLACE` e 62 `ALTER POLICY`.
9. A matriz da seção 13 prova que autorização não mudou.
10. A 12.13.2 pode começar com segurança: **READY**.
