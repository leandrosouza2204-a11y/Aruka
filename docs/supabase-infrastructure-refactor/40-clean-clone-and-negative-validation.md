# Clean Clone and Negative Validation

## Decisao

`LOCAL_REPRODUCIBILITY_WITH_REMEDIATIONS`

## Worktree limpo

O teste criou worktree descartavel baseado em `HEAD`, aplicou overlay controlado dos arquivos nao commitados do Ciclo 7/7.1, usou `project_id` temporario `aruka_clean_worktree_validation` e portas alternativas `55420` a `55429`.

Resultados observados:

- `npm ci`: aprovado, sem `node_modules` pre-existente.
- `supabase:preflight`: aprovado no ambiente temporario.
- `supabase:bootstrap`: aprovado.
- `supabase:validate`: aprovado.
- `supabase:stop`: aprovado.
- Migration history: `20260716090000`.
- Inventario: 19 tabelas public, 14 funcoes public, 1 trigger, 56 indices explicitos, 54 policies public, 4 policies Storage, 19 tabelas public com RLS e bucket privado `avaliacoes-fotos`.

## Limitacao

O executor `qa:supabase-clean-worktree` ainda trava no pos-processamento/finalizacao PowerShell depois de produzir evidencias internas validas. O cleanup foi confirmado por comandos externos: sem worktree temporario registrado, sem diretorio temporario, sem containers e sem volumes do `project_id` temporario.

## Mutacoes negativas

Resultado: `20/20 MUTATIONS_REJECTED`.

As mutacoes cobriram baseline ausente, SHA alterado, migrations historicas/operacionais ativas, config ausente, `project_id` vazio, argumentos remotos, comandos remotos, URL remota, project ref remoto, secret aparente, porta invalida, inventario divergente, clean amplo, duplicacao estrutural e timestamp invalido.

## Seguranca

Nenhum comando remoto foi executado. Nao houve `db push`, `db pull`, `migration repair` remoto, `--linked`, `--project-ref`, `--db-url` remoto, deploy de Edge Functions, alteracao de Auth remoto, Storage remoto ou secrets.

## Proxima remediacao

Estabilizar o encerramento do wrapper `scripts/test-supabase-clean-worktree.ps1` para que `npm.cmd run qa:supabase-clean-worktree` retorne sucesso automaticamente sem depender de consolidacao manual de evidencias.
