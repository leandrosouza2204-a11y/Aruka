# Cycle 12.13.2 — Schema/RLS Hardening Implementation

## 1. Objetivo

Implementar somente o escopo REQUIRED da Cycle 12.13.1: remover a ambiguidade SQLSTATE 42725 do wrapper administrativo, remover duas variáveis mortas do lifecycle e otimizar exatamente as 62 policies públicas inventariadas sem alterar suas fronteiras de autorização. O rollout da Student Experience V2 permaneceu OFF.

## 2. Estado inicial

- Branch: `main`.
- HEAD e `origin/main`: `f83d61b77e6ed1e70ea8a56fa5fc3ba59ebcaca0`.
- Delta inicial: somente os dois documentos não rastreados da discovery 12.13.1.
- Supabase local/Docker disponíveis; PostgreSQL local 17.6.
- Supabase CLI observado no pre-flight: 2.109.1. A execução final via `npx.cmd` resolveu temporariamente 2.118.0, sem alterar dependências do projeto.
- Última migration antes desta implementação: `20260921010053`.

## 3. Migration criada

`supabase/migrations/20260926174027_cycle12_schema_rls_hardening.sql`, criada pelo mecanismo oficial `supabase migration new`. Ela é forward-only, explicitamente transacional e não modifica migrations históricas.

No banco local já existente, a CLI recusou `migration up`/`db push --local --include-all --dry-run` porque a baseline de referência `20260716090000` existe no histórico local e fica fora da pasta ativa de migrations. Nenhum SQL foi executado pelas tentativas recusadas. A migration foi então aplicada localmente em uma transação por `psql` e sua versão foi registrada uma única vez com `migration repair --local --status applied 20260926174027`. A validação definitiva ocorreu também por dois bootstraps canônicos limpos, sem esse desvio.

## 4. Correção 42725

`admin_liberar_assinante(uuid,text,date,date,text)` foi recriada preservando assinatura, retorno, validações, logging, owner, `SECURITY DEFINER`, `search_path` e ACL. A única mudança funcional no corpo foi desambiguar `admin_upsert_assinatura` com os oito argumentos explícitos, incluindo `null::date` e `false`.

O overload legado e o moderno continuam presentes. A regressão confirmou liberação por admin, persistência de estado/log, defaults `grace_until = NULL` e `cancel_at_period_end = FALSE`, chamada moderna de oito argumentos, e negação para non-admin e anon.

## 5. Correção lifecycle

`admin_subscription_lifecycle_action` foi recriada removendo somente `v_status`, `v_plan` e suas posições correspondentes de `SELECT/INTO`. Assinatura, branches, datas, updates, logs e metadados permaneceram iguais.

A regressão transacional passou para `mark_paid`, `enter_grace`, `extend_grace`, `suspend_subscription`, `reactivate_subscription`, `schedule_cancellation`, `cancel_now`, ação inválida, non-admin e anon.

## 6. Implementação das 62 policies

A migration contém exatamente 62 comandos `ALTER POLICY`, usando o inventário individual da discovery. Somente chamadas constantes `auth.uid()` foram convertidas em `(select auth.uid())`. Não há `DROP POLICY`, `CREATE POLICY` nem alteração em `storage.objects`.

Comandos, roles, permissividade, `USING`, `WITH CHECK`, joins e ownership foram preservados. Os helpers dependentes da linha `aoe_user_owns_student(student_id)` e `exercise_is_prescribed_to_current_student(id)` não foram encapsulados. Policies Student V2 que já estavam otimizadas não foram alteradas.

## 7. Assertions

As precondições validam identidade e metadados, não apenas contagens: dois overloads do upsert, assinaturas das duas funções, allowlist exata de policies, command, roles, permissividade, RLS habilitado e presença do padrão direto esperado.

As pós-condições validam exatamente 62 policies modificadas, zero policy inesperada, equivalência estrutural após normalização exclusiva do scalar subquery, zero chamada Auth direta em policy pública e ausência de drift de owner, `SECURITY DEFINER`, `search_path` e ACL das funções.

## 8. Equivalência RLS

`validate-cycle-12-13-schema-rls-hardening.mjs` confirmou allowlist, 62 alterações, nenhuma 63ª policy, metadados, helpers por linha, ausência de alterações V2 e equivalência NULL sob anon.

`validate-cycle-12-13-authorization-runtime.mjs` executou como `authenticated` e `anon`, em transação com rollback, cobrindo leitura/escrita própria, leitura/escrita cross-user negada, `USING`, `WITH CHECK`, AOE por ator, ownership de aluno, ator diferente, admin previsto, traces, reviews e idempotency keys. Biblioteca/favoritos e Smart Management foram cobertos pelas matrizes runtime vigentes.

## 9. Regressão SECURITY DEFINER

Snapshot e pós-condições confirmaram ausência de drift de owner, `prosecdef`, `proconfig`/`search_path` e ACL nas duas funções recriadas. Overloads e grants permanecem existentes. Os 34 `search_path` legados e o `PUBLIC EXECUTE` de `renovar_aluno_contrato` permaneceram fora do escopo.

## 10. Regressão Student Experience V2

Passaram as validações estáticas/unitárias e runtime das Cycles 12.3–12.10, além das matrizes runtime/security da 12.2. Foram cobertos Home, Biblioteca, detalhe, Player, tracking, timer, conclusão, feedback, Evolução, Perfil, contato profissional, aluno ativo, suspenso, profissional, cross-student e anon. O rollout continuou OFF.

## 11. Bootstrap e migrations

- Banco local existente: migration aplicada uma vez e registrada uma vez no histórico local.
- Bootstrap canônico limpo: PASS em duas execuções consecutivas.
- 38 migrations executáveis; 39 entradas no bootstrap efêmero incluindo a baseline de referência.
- Ordem: PASS.
- Baseline temporária removida após cada execução: YES.
- Reprodutibilidade local: PASS.
- Migrations históricas modificadas: NO.

## 12. Lint e advisors

- `supabase db lint --local --schema public --level warning`: `No schema errors found`.
- SQLSTATE 42725: 1 antes, 0 depois.
- `v_status`: 1 antes, 0 depois.
- `v_plan`: 1 antes, 0 depois.
- `supabase db advisors --local --type all`: `No issues found`.
- `auth_rls_initplan` público: 62 antes, 0 depois.

## 13. Performance

`EXPLAIN` read-only confirmou `InitPlan` para a identidade Auth constante. Resultado: YES. Benchmark volumétrico: NOT_MEASURED; nenhum percentual de ganho é declarado.

## 14. Testes executados

- Novos: schema/allowlist/equivalência, runtime admin/lifecycle e runtime ownership/AOE.
- Supabase: preflight/validate, CI static, reprodutibilidade, dois bootstraps limpos, lint e advisors.
- RLS: Cycle 12.2, biblioteca de exercícios, Smart Management, serviços/preços, identidade do aluno, workout ownership e reconciliação de segurança.
- Subscription lifecycle: route matrix, student impact, suíte administrativa legada e nova suíte de sete ações.
- Student V2: estático/unitário e runtime 12.3–12.10.
- Aplicação: ESLint PASS; Vite build/PWA PASS (`generateSW`, 144 itens de precache).
- `git diff --check`: executado após a documentação, resultado registrado no relatório final.

## 15. Arquivos alterados intencionalmente

- A nova migration 12.13.2.
- Três novos validadores 12.13.2.
- Listas de migration esperada nos harnesses locais/CI.
- Dois ajustes de fixtures históricos necessários: lifecycle com `grace_until` posterior ao vencimento e identidade com transição explícita `invite → activate`.
- Este documento e o relatório de implementação.
- Os dois documentos discovery 12.13.1 foram preservados.

## 16. Artefatos regenerados

As regressões regeneraram relatórios de runtime das Cycles 12.4, 12.5, 12.6 e 12.9, além dos cinco artefatos rastreados de `reports/supabase-local-bootstrap/`. Eles foram preservados para revisão humana, conforme solicitado, e não representam mudança de produto.

## 17. Limitações

O teste histórico `aoe:test:rls` não executa porque referencia `supabase/migrations/20260715_aoe_infrastructure_pilot.sql`, arquivo antigo inexistente na cadeia ativa. A falha também ocorre fora da migration 12.13.2. A cobertura requerida foi realizada pela nova matriz transacional AOE e pelas suítes vigentes de reconciliação/Phase 32/Group A. Não houve benchmark volumétrico.

## 18. Findings fora do escopo

Permanecem intocados: hardening dos 34 `search_path` legados, revogação PUBLIC/anon de `renovar_aluno_contrato`, remoção do overload legado, oito policies de `storage.objects`, otimização de helpers não sinalizados e benchmark volumétrico.

## 19. Decisão

`IMPLEMENTATION_COMPLETE`.

Todos os critérios REQUIRED passaram localmente. Produção, migration remota, deploy, commit, push, PR e merge não foram executados.
