# Estrategia de Ambientes

## Ambientes Oficiais

### LOCAL

- Usado para desenvolvimento individual com Supabase CLI.
- Deve aplicar baseline, migrations incrementais e seed local.
- Pode usar Edge Functions servidas localmente.
- Dados sempre descartaveis.

### DEV

- Ambiente compartilhado de desenvolvimento.
- Recebe migrations apos validacao local.
- Pode conter dados ficticios persistentes.
- Serve para integracao entre frontend, Supabase e Edge Functions.

### HML

- Ambiente de homologacao.
- Deve espelhar producao em configuracao, RLS, Edge Functions e Storage.
- Recebe apenas migrations aprovadas.
- Seeds devem ser controlados e nao conter dados reais.

### PRODUCAO

- Ambiente real.
- Recebe somente migrations aprovadas, testadas em LOCAL, DEV e HML.
- Sem seeds ficticios.
- Deploy com janela, checklist e plano de rollback operacional.

## Fluxo Git

1. Branch de trabalho.
2. Documentacao/migration/testes no mesmo PR quando houver mudanca estrutural.
3. Review obrigatorio para migrations e Edge Functions.
4. Merge apos CI e validacao de HML.
5. Tag/release para cortes de producao.

## Fluxo Supabase

1. Aplicar localmente.
2. Validar com testes de RLS/RPC/Storage.
3. Aplicar em DEV.
4. Aplicar em HML.
5. Comparar estado esperado versus runtime.
6. Promover para producao.

## Fluxo Vercel

- Preview por branch para frontend.
- Variaveis por ambiente alinhadas com Supabase correspondente.
- HML deve apontar para Supabase HML.
- Producao deve apontar somente para Supabase producao.

## Fluxo Edge Functions

- Codigo versionado em `supabase/functions`.
- Secrets definidos por ambiente, nunca no repo.
- Deploy primeiro em LOCAL/DEV, depois HML, depois producao.
- Validar headers, CORS, feature flags e uso de service role antes da promocao.

## Matriz de Secrets

Documentar nomes, nao valores:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ENCERRAMENTOS_AUTOMATICOS_SECRET`
- `AOE_CORS_ORIGIN`
- `AOE_ENABLED`
- `AOE_PILOT_ENABLED`
- allowlists AOE lidas por variaveis CSV

## Criterios de Promocao

- Migrations aplicadas sem erro em HML.
- Testes de RLS, RPC e Storage aprovados.
- Edge Functions respondem com secrets/flags corretos.
- Checklist de dados sensiveis aprovado.
