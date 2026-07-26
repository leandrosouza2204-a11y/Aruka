# Aruka Supabase

## Estrutura

- `migrations/`: cadeia ativa. A primeira migration e `20260716090000_baseline_aruka_v1.sql`.
- `migrations-archive/`: historico pre-baseline, preservado e fora da Supabase CLI.
- `operations/`: SQL operacional por ambiente, fora da cadeia automatica.
- `baseline-src/`: fonte documental modular da baseline.
- `baseline-candidate/`: candidate validada que originou a baseline oficial.
- `functions/`: Edge Functions, implantadas em ciclo proprio.

## Bootstrap local

```bash
npm.cmd run supabase:preflight
npm.cmd run supabase:bootstrap
npm.cmd run supabase:validate
```

Para parar:

```bash
npm.cmd run supabase:stop
```

Para limpeza local controlada:

```bash
npm.cmd run supabase:clean
```

## QA

```bash
npm.cmd run qa:supabase-migration-cutover
npm.cmd run qa:supabase-local-reproducibility
npm.cmd run qa:supabase-local-negative
npm.cmd run qa:supabase-clean-worktree
npm.cmd run qa:supabase-clean-worktree-wrapper
npm.cmd run qa:supabase-cycle-8
npm.cmd run qa:supabase-cycle-9
npm.cmd run qa:supabase-cycle-9-1:prepare
```

Nenhum comando local deve usar `--linked`, `--project-ref`, `--db-url` remoto, `db push` ou `migration repair`.

Relatorios principais:

- `reports/supabase-local-bootstrap/clean-worktree-result.json`
- `reports/supabase-local-bootstrap/clean-worktree-wrapper-result.json`
- `reports/supabase-local-bootstrap/clean-worktree-summary.md`
- `reports/supabase-local-bootstrap/clean-worktree-wrapper-summary.md`

## Seeds locais

```bash
npm.cmd run supabase:seed:local
npm.cmd run supabase:fixtures:validate
npm.cmd run supabase:reset:safe
```

As seeds do Ciclo 8 ficam em `supabase/seeds/`. O arquivo `supabase/seed.sql` permanece como entrypoint seguro da CLI; a orquestracao real dos arquivos divididos e feita por `npm.cmd run supabase:seed:local`. Elas usam apenas dados ficticios, UUIDs reservados e dominio `example.invalid`.

## CI local

```bash
npm.cmd run qa:supabase-ci-static
npm.cmd run qa:supabase-ci-negative
npm.cmd run qa:supabase-ci-evidence
npm.cmd run qa:supabase-cycle-9
```

O workflow GitHub Actions `Supabase Local Quality Gates` usa Node 22, Supabase CLI 2.109.1, permissao `contents: read` e ambiente Supabase local efemero sem secrets remotos. No CI ele roda em modo `isolated_ci` com `SUPABASE_CI_LOCAL_ONLY=true`, required check `validation` e cleanup obrigatorio.

A baseline ativa `migrations/20260716090000_baseline_aruka_v1.sql` e validada por SHA-256 textual canonico com LF: `67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B`. O PR #1 falhou inicialmente no check `validation` porque o hash antigo foi calculado sobre uma representacao Windows com finais mistos; nao houve alteracao semantica da SQL.

O ruleset `Protect main` foi reportado como ativo para `main`, com pull request obrigatorio, required status check `validation`, force push bloqueado e exclusao bloqueada. O workflow e os validadores registram `remote_access_performed=false` e `edge_functions_deployed=false`.

## Evidencia real do GitHub Actions

```bash
npm.cmd run supabase:ci:collect-runtime -- --run-id=<RUN_ID>
npm.cmd run supabase:ci:download-artifacts -- --run-id=<RUN_ID>
npm.cmd run qa:supabase-ci-runtime-artifacts
npm.cmd run qa:supabase-ci-runtime-cleanup
npm.cmd run supabase:ci:collect-branch-protection
npm.cmd run qa:supabase-branch-protection
```

Enquanto os JSONs verificaveis de runtime/branch protection/merge-block nao estiverem completos no repositorio, `qa:supabase-cycle-9-1:prepare` e o validador final permanecem em `CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED`.
