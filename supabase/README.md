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

O workflow GitHub Actions usa Node 22, Supabase CLI 2.109.1, permissao `contents: read` e ambiente Supabase local efemero sem secrets remotos.
