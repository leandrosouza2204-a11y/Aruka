# Schema Drift Resolution Summary

## Objetivo

Reduzir os bloqueios de schema drift que impediam a baseline oficial, sem aplicar alteracoes em HML/producao e sem implantar Edge Functions.

## Arquivos Analisados

- `docs/supabase-infrastructure-refactor/16-runtime-schema-audit.md`
- `docs/supabase-infrastructure-refactor/17-runtime-rls-audit.md`
- `docs/supabase-infrastructure-refactor/18-runtime-external-dependencies.md`
- `docs/supabase-infrastructure-refactor/19-risk-register.md`
- `docs/supabase-infrastructure-refactor/20-schema-drift-resolution-plan.md`
- `docs/supabase-infrastructure-refactor/21-runtime-audit-summary.md`
- `reports/hml-baseline/production-public-schema.sql`
- `supabase/migrations/*.sql`
- `supabase/*.sql`

## Drifts Tratados

- Overloads administrativos runtime-only foram decididos como excluidos da futura baseline.
- Grants divergentes foram normalizados em `supabase/baseline-src/09-grants.sql`.
- Policies mais restritivas do runtime foram adotadas para `treinos`, `avaliacoes` e `anamneses`.
- `acompanhamento_eventos` foi endurecido com role explicita e validacao de aluno/plano.
- Storage foi consolidado como definicao desejada, ainda pendente de catalog query runtime.
- `auditoria_dados_recomendacoes.sql` foi classificado como legado documental, nao fonte canonica.

## Decisoes Tomadas

As decisoes completas estao em `22-schema-drift-decisions.md`.

Resumo:

- Fonte de verdade para tabelas/indices/constraints: runtime consolidado.
- Fonte de verdade para funcoes admin: assinaturas novas do repositorio, com grants endurecidos.
- Fonte de verdade para AOE: repositorio, removendo `anon` de funcoes privilegiadas.
- Fonte de verdade para RLS divergente: runtime mais restritivo.
- Fonte de verdade para Storage: migration versionada, com validacao runtime pendente.

## Objetos Runtime-Only Incorporados

Nenhum overload runtime-only antigo foi incorporado. Todos foram excluidos da futura baseline por serem assinaturas administrativas legadas substituidas por versoes com `p_user_agent`.

## Definicoes Divergentes Resolvidas

- `admin_eh_admin()` e `admin_validar_acesso()`: grants futuros para `authenticated` e `service_role`.
- `admin_registrar_log(...)`: grant futuro para `authenticated` e `service_role`, preservando validacao admin interna.
- `aoe_idempotency_get_or_create(...)`: removido grant `anon`; adicionada validacao de ator autenticado/admin.
- `aoe_user_owns_student(uuid)`: removido grant `anon`.
- `set_workout_templates_updated_at()`: `search_path` explicito e grant direto minimo.
- Policies de `treinos`, `avaliacoes`, `anamneses`: adotado check por relacionamento com `alunos`.

## Duplicidades Resolvidas

- SQL solto e migrations continuam preservados, mas `baseline-src` passa a ser a fonte intermediaria canonica.
- `auditoria_dados_recomendacoes.sql` nao deve alimentar a baseline.
- Overloads antigos nao entram na baseline.

## Migrations Renomeadas

12 migrations foram renomeadas para timestamp unico `YYYYMMDDHHMMSS`. O mapa completo esta em `23-migration-rename-map.md`.

## Funcoes Hardened

11 funcoes canonicas foram preparadas em `05-functions.sql`, todas as `SECURITY DEFINER` com `search_path` explicito. O hardening principal remove `anon` de funcoes AOE privilegiadas e exclui overloads antigos da baseline.

## RLS Normalizado

19 tabelas publicas possuem RLS declarado em `07-rls.sql`. Policies canonicas estao em `08-policies.sql`.

## Grants Normalizados

Grants futuros estao em `09-grants.sql`:

- sem `GRANT EXECUTE TO public`;
- sem grants diretos de tabela para `anon`;
- grants de app para `authenticated`;
- `service_role` preservado para operacao administrativa e Edge Functions.

## Dependencias Externas Classificadas

`24-environment-dependency-matrix.md` classifica Auth, Storage, Edge Functions, secrets, flags AOE, project-ref e recursos ainda desconhecidos (`cron`, `vault`, `pg_net`).

## Storage Consolidado

`10-storage.sql` define:

- bucket privado `avaliacoes-fotos`;
- limite de 8 MB;
- MIME types JPEG, PNG e WebP;
- policies por primeira pasta igual a `auth.uid()`;
- operacoes select, insert, update e delete.

## Validacoes Executadas

- Validacao estatica do script `scripts/validate-supabase-baseline-src.mjs`.
- Validacao de timestamps unicos em migrations pelo script.
- Busca estatica por tokens, project-ref e URLs Supabase no baseline-src pelo script.
- Confirmacao manual planejada para SHA do dump e project-ref na validacao final.

Validacao com Supabase local/Docker nao foi executada neste ciclo. Ela fica para o Ciclo 5 porque `baseline-src` ainda e fonte intermediaria e nao migration oficial consolidada.

## Riscos Resolvidos

- `R-003` foi marcado como `RESOLVED` apos renomeio das migrations.

## Riscos Residuais

- Storage runtime ainda exige catalog query.
- Baseline precisa validacao SQL local no Ciclo 5.
- Testes RLS/RPC/Storage seguem necessarios antes de HML/producao.
- Cutover de ambientes existentes ainda precisa runbook.

## Bloqueios

- `R-012` permanece `BLOCKED` para confirmacao runtime de Storage, pois o dump public nao contem catalogo `storage`.

## Impacto Esperado

O repositorio passa a ter uma fonte intermediaria unica para a baseline, com drift alto documentado e decisoes explicitas. Nenhum ambiente remoto foi alterado.

## Recomendacao para o Ciclo 5

Consolidar `supabase/baseline-src/*.sql` em uma migration baseline oficial, executar validacao em Supabase local descartavel, gerar evidencias e preparar o plano de cutover.

## Decisao Final

READY_WITH_REMEDIATIONS
