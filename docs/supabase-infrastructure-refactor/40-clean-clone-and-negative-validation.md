# Clean Clone and Negative Validation

## Decisao

`LOCAL_REPRODUCIBILITY_VALIDATED`

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

## Finalizacao do wrapper

O Ciclo 7.2 corrigiu o encerramento do wrapper. `qa:supabase-clean-worktree` retorna ao prompt sem intervencao manual, imprime `CLEAN_WORKTREE_VALIDATED` e retorna exit code 0.

A causa raiz confirmada foi incompatibilidade do Windows PowerShell 5.1 com handlers assincronos baseados em scriptblock em threads sem Runspace. A captura foi substituida por `ReadToEndAsync()` em stdout/stderr iniciados em paralelo, com `WaitForExit(timeout)`. A escrita final do JSON tambem foi tornada deterministica para evitar serializacao reflexiva de objetos aninhados.

## Mutacoes negativas

Resultado: `20/20 MUTATIONS_REJECTED`.

As mutacoes cobriram baseline ausente, SHA alterado, migrations historicas/operacionais ativas, config ausente, `project_id` vazio, argumentos remotos, comandos remotos, URL remota, project ref remoto, secret aparente, porta invalida, inventario divergente, clean amplo, duplicacao estrutural e timestamp invalido.

## Seguranca

Nenhum comando remoto foi executado. Nao houve `db push`, `db pull`, `migration repair` remoto, `--linked`, `--project-ref`, `--db-url` remoto, deploy de Edge Functions, alteracao de Auth remoto, Storage remoto ou secrets.

## Resultado final

`qa:supabase-clean-worktree-wrapper` e `qa:supabase-local-reproducibility` passaram apos regeneracao real dos logs.
