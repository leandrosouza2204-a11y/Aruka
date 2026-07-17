# Local Development Bootstrap

## Requisitos

- Windows PowerShell 5.1 ou PowerShell.
- Node.js e npm.
- Docker Desktop com contexto `desktop-linux`.
- Supabase CLI via `npx.cmd`.

## Comandos oficiais

```bash
npm.cmd run supabase:preflight
npm.cmd run supabase:bootstrap
npm.cmd run supabase:validate
npm.cmd run supabase:stop
npm.cmd run supabase:clean
```

## Primeiro bootstrap

`supabase:bootstrap` executa preflight, inicia o Supabase local, aplica somente `supabase/migrations/`, valida inventario e grava relatorios em `reports/supabase-local-bootstrap/`.

## Reinicializacao

Use `supabase:stop` para parar e `supabase:bootstrap` para subir novamente. A limpeza destrutiva local exige `supabase:clean`, que filtra apenas o project_id local.

## Seguranca

Os scripts rejeitam argumentos remotos e nao usam `db push`, `migration repair`, `--linked`, `--project-ref` ou `--db-url`.

## Worktree limpo

O Ciclo 7.1 executou `npm ci`, preflight, bootstrap, validate e stop em ambiente temporario com `project_id` isolado `aruka_clean_worktree_validation` e portas alternativas. A evidencia runtime passou; o wrapper de QA ainda precisa estabilizar a finalizacao PowerShell antes de virar gate obrigatorio.

## Troubleshooting

- Docker inacessivel: rode `supabase:preflight`.
- Porta ocupada: pare o processo local ou o stack antigo.
- Inventario divergente: rode `supabase:validate` e revise `schema-inventory.json`.
