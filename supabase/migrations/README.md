# Aruka Active Database Migrations

Esta pasta contem somente a cadeia ativa de migrations apos o cutover da baseline.

Este diretorio contem apenas migrations executaveis pelo Supabase CLI.

A baseline `20260716090000_baseline_aruka_v1.sql` foi movida para `supabase/reference-baselines/` como `NON_EXECUTABLE_DATABASE_REFERENCE`.

## Regras

- A baseline reference-only deve permanecer byte a byte equivalente a `supabase/baseline-candidate/20260716090000_baseline_aruka_v1.sql`.
- Migrations anteriores ao timestamp da baseline ficam em `supabase/migrations-archive/`.
- SQL operacional por ambiente fica em `supabase/operations/`.
- Nunca apagar migrations.
- Toda alteracao executada no Supabase deve existir aqui.
- Toda migration deve ser commitada junto com a alteracao correspondente.
- O SQL deve ser idempotente sempre que possivel.
- Antes de executar em HML/producao, validar em ambiente local e seguir o runbook de cutover.

## Observacoes

- Ambientes existentes nao devem reaplicar a baseline.
- O registro remoto da baseline em HML/producao exige ciclo posterior, janela aprovada e checklist.
- `supabase db push`, `migration repair` ou comandos remotos nao foram executados neste cutover de repositorio.
