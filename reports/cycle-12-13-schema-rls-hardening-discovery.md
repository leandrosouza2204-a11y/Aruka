# Cycle 12.13.1 — Executive Discovery Report

## Decision

**DISCOVERY_COMPLETE** — implementação 12.13.2 **READY**, limitada ao plano REQUIRED.

## Estado e escopo

- `main`, HEAD/origin `f83d61b77e6ed1e70ea8a56fa5fc3ba59ebcaca0`, working tree inicial limpa.
- PostgreSQL local 17.6; Supabase CLI 2.109.1; última migration local `20260921010053`.
- Auditoria read-only; produção/remoto não acessados; nenhum deploy, migration, commit, push, PR ou merge.
- Rollout Student Experience V2: OFF.

## Findings reproduzidos

- Schema lint: SQLSTATE 42725 em `admin_liberar_assinante` e dois warnings de variável não lida em `admin_subscription_lifecycle_action`.
- Advisors: exatamente **62 WARN `auth_rls_initplan`**, correspondendo a **62 policies públicas**.
- RLS: 32 tabelas públicas, todas com RLS; 73 policies; feedback de sessão sem policy por design RPC-only/deny-by-default.

## Causa confirmada do 42725

Coexistem overloads de `admin_upsert_assinatura` com 6 e 8 parâmetros. O moderno defaulta os argumentos 6–8, então a chamada posicional de seis argumentos do wrapper casa com ambos. Cast apenas de `'ativo'` não resolve porque os seis tipos iniciais são idênticos.

Remediação REQUIRED: manter ambos os overloads e alterar apenas o wrapper para chamar o moderno com oito argumentos explícitos (`p_user_agent`, `null::date`, `false`). Remoção do legado fica DEFERRED até comprovar ausência de consumidores externos.

## Lifecycle

`v_status` e `v_plan` são realmente mortas (classe A). Remover declarações e posições correspondentes nos dois `SELECT ... INTO`, sem alterar lógica ou assinatura.

## RLS/advisors

- 51 findings P2 em caminhos ativos core/treino/biblioteca profissional.
- 11 findings P3 em AOE/smart management.
- 0 findings P1 diretamente nas policies/RPCs da Student Experience V2.
- Transformação: somente `auth.uid()` constante para `(select auth.uid())`; preservar roles, comandos, `USING`, `WITH CHECK`, joins e helpers dependentes da linha.
- `EXPLAIN` confirmou criação de InitPlan; benefício real de latência não foi medido.

## SECURITY DEFINER

52 funções revisadas.

- CRITICAL/HIGH/MEDIUM confirmados: 0.
- LOW: `renovar_aluno_contrato` tem `PUBLIC EXECUTE`, embora negue anon por `AUTH_REQUIRED` e valide ownership.
- LOW: 34 funções legadas usam search path não vazio; roles API não têm CREATE nesses schemas, então não há exploit atual demonstrado.
- V2: funções usam `search_path=''`, relações qualificadas, Auth derivada no servidor, vínculo/acesso ativo e grants mínimos; sem bypass confirmado.

## Mudanças 12.13.2

### REQUIRED

1. Nova migration forward-only gerada pela CLI.
2. `CREATE OR REPLACE admin_liberar_assinante` com chamada inequívoca de 8 argumentos.
3. `CREATE OR REPLACE admin_subscription_lifecycle_action` sem as duas variáveis mortas.
4. `ALTER POLICY` nas 62 policies; nenhum DROP/CREATE necessário.
5. Assertions pré/pós e regressão completa.

### RECOMMENDED

- Teste CI contra defaults sobrepostos e snapshot de policies/advisors.
- Revogar PUBLIC da renovação em migration/teste separados.
- Harden gradual de search_path por domínio.

### DEFERRED

- Remover overload legado sem inventário externo.
- Oito policies de storage fora do inventário public/advisor atual.
- Helpers não sinalizados e benchmark volumétrico.

## Testes necessários

Bootstrap/migrations, inventário de schema, lint/advisors, runtime RLS, isolamento aluno/aluno e aluno/profissional, profissional válido, suspenso/revogado, SECURITY DEFINER, assinatura/admin, regressões Student V2 12.2–12.10, build, ESLint e `git diff --check`. Novos testes devem cobrir individualmente as 62 policies, NULL behavior e o wrapper admin sem 42725.

## Próximo passo

Iniciar a Cycle 12.13.2 criando uma migration nova com `supabase migration new cycle12_schema_rls_hardening`, implementar primeiro os dois `CREATE OR REPLACE`, depois os 62 `ALTER POLICY` dentro da mesma estratégia transacional e executar a matriz completa antes de qualquer operação remota.
