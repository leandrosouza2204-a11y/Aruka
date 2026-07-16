# Arquitetura Definitiva Alvo

## Estrutura Desejada

```text
supabase/
  config.toml
  README.md
  seed.sql
  functions/
    aoe/
      index.ts
      generated/
        apl-catalog.generated.ts
    processar-encerramentos-automaticos/
      index.ts
    transfer-user-access/
      index.ts
  migrations/
    README.md
    YYYYMMDDHHMMSS_baseline_aruka_v1.sql
    YYYYMMDDHHMMSS_incremental_feature.sql
  tests/
    rls/
    rpc/
    storage/
    edge-functions/
  fixtures/
    seed-dev.sql
    seed-hml.sql
```

## Papeis dos Diretorios

- `migrations/`: unica fonte de verdade para DDL, RLS, policies, functions SQL, triggers e Storage SQL.
- `functions/`: codigo das Edge Functions, sem secrets hardcoded.
- `tests/`: testes de infraestrutura executaveis localmente e em CI.
- `fixtures/`: dados auxiliares para ambientes nao-produtivos.
- `seed.sql`: seed minimo oficial para desenvolvimento local.
- `README.md`: guia operacional de Supabase no projeto.

## Separacao de Responsabilidades

- Schema e seguranca ficam em migrations.
- Dados ficticios ficam em seeds.
- Codigo runtime fica em `functions/` e `src/`.
- Evidencias e relatorios ficam em `reports/`, nao em `supabase/`.
- Documentacao arquitetural fica em `docs/supabase-infrastructure-refactor/`.

## Objetivo de Reprodutibilidade

Um desenvolvedor deve conseguir recriar o ambiente local com:

1. Supabase CLI.
2. Migrations oficiais.
3. `seed.sql`.
4. Variaveis de ambiente locais documentadas.
5. Edge Functions servidas localmente quando necessario.

## Artefatos que Nao Devem Ser Versionados

- `supabase/.temp/*`.
- Dumps contendo dados reais.
- Secrets, tokens e service role keys.
- Arquivos gerados transitorios, exceto gerados deliberadamente como contrato versionado, caso do catalogo AOE.

## Testes Alvo

- RLS por papel: anon, authenticated comum, admin e service role.
- RPC admin: acesso negado para usuario comum e permitido para admin.
- Storage: path correto e incorreto para `avaliacoes-fotos`.
- Edge Functions: headers obrigatorios, flags, CORS e persistencia esperada.
- Idempotencia AOE e encerramentos automaticos.
