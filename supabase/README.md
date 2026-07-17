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
```

Nenhum comando local deve usar `--linked`, `--project-ref`, `--db-url` remoto, `db push` ou `migration repair`.
