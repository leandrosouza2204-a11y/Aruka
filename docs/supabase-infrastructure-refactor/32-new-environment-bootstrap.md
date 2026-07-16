# New Environment Bootstrap

## Objetivo

Ambientes novos devem iniciar pela cadeia ativa de migrations:

1. `20260716090000_baseline_aruka_v1.sql`
2. migrations posteriores ao cutover
3. configuracoes manuais por ambiente
4. seeds apenas em ambientes nao produtivos
5. deploy de Edge Functions em ciclo proprio
6. validacoes operacionais

## LOCAL e projetos temporarios

- Usar `npx supabase start` em projeto local.
- A pasta `supabase/migrations/` deve conter a baseline oficial como primeira migration.
- `supabase/migrations-archive/` nao e processada pela CLI.
- `supabase/operations/` nao e processada automaticamente.

## DEV

- Criar projeto limpo.
- Aplicar migrations ativas.
- Configurar secrets e Edge Functions depois da base SQL.
- Rodar seeds ficticios apenas quando aprovado.

## HML novo

- Provisionar projeto novo.
- Aplicar baseline e migrations posteriores.
- Configurar Storage, Auth e secrets por checklist.
- Executar smoke tests antes de expor ao QA.

## CI

- Validar `qa:supabase-migration-cutover`.
- Validar evidencias sanitizadas.
- Inicializar Supabase local descartavel quando Docker estiver disponivel.

