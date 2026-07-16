# Estrategia das Migrations

## Principio

A arquitetura definitiva deve separar baseline de evolucao. A baseline representa o estado inicial consolidado; migrations incrementais representam mudancas apos essa baseline.

Nenhum arquivo atual deve ser movido, renomeado ou alterado neste ciclo.

## Classificacao dos Arquivos Atuais

### SQL solto que deve virar baseline

Estes arquivos contem estrutura base e devem ser absorvidos pela futura migration inicial:

- `supabase/alunos.sql`
- `supabase/planos.sql`
- `supabase/pagamentos.sql`
- `supabase/perfis.sql`
- `supabase/assinaturas.sql`
- `supabase/admin_logs.sql`
- `supabase/admin_rpc.sql`
- `supabase/aceites_legais.sql`
- `supabase/avaliacoes_anamneses.sql`
- `supabase/treinos.sql`

### SQL solto candidato a legado/documentacao

- `supabase/auditoria_dados_recomendacoes.sql`

Motivo: contem indices e policies que tambem aparecem em migrations, alem de comentarios de recomendacao futura. Deve ser classificado antes de qualquer consolidacao.

### Migrations que devem ser absorvidas pela baseline

Devem ser incorporadas porque representam estado atual essencial de um ambiente novo:

- `20260705090000_hardening_admin_functions.sql`
- `20260705091000_rls_indices_multitenant.sql`
- `20260710090000_integridade_avaliacoes.sql`
- `20260710091000_storage_avaliacoes_fotos.sql`
- `20260711090000_acompanhamento_alunos.sql`
- `20260711091000_historico_acompanhamento_alunos.sql`
- `20260711092000_motivo_encerramento_detalhe.sql`
- `20260711093000_planos_nome_unico.sql`
- `20260711094000_rpc_processar_encerramento_automatico.sql`
- `20260714090000_workout_templates.sql`
- `20260715090000_aoe_infrastructure_pilot.sql`

### Migration que deve permanecer incremental

- `20260712090000_agendar_encerramentos_automaticos_dry_run.sql`

Motivo: pelo nome e proposito aparente, parece operacional/agendamento/dry-run. Deve permanecer fora da baseline ate confirmacao do conteudo e da necessidade por ambiente.

## Estrategia de Corte

1. Criar baseline nova somente em ciclo futuro.
2. Validar runtime de HML/producao contra o inventario.
3. Gerar um arquivo baseline com timestamp posterior e nome explicito, por exemplo `YYYYMMDDHHMMSS_baseline_aruka_v1.sql`.
4. Marcar migrations antigas como historicas no README, sem apagar historico.
5. Em ambientes novos, aplicar baseline e depois apenas migrations posteriores ao corte.
6. Em ambientes existentes, nao reaplicar baseline; registrar status via `supabase_migrations.schema_migrations` somente com processo aprovado.

## Ordem Recomendada Dentro da Baseline

1. Extensions.
2. Funcoes helper sem dependencia de tabelas, quando possivel.
3. Tabelas raiz: `perfis`, `alunos`, `planos`, `assinaturas`.
4. Tabelas dependentes: pagamentos, avaliacoes, anamneses, treinos e acompanhamento.
5. Tabelas admin e AOE.
6. Constraints adicionais e indices.
7. Funcoes dependentes.
8. Triggers.
9. RLS enable.
10. Policies.
11. Grants/revokes.
12. Storage bucket e storage policies.

## Regras para Migrations Futuras

- Uma migration deve ter uma responsabilidade unica.
- Alteracoes de schema, RLS, funcoes e storage devem ser revisaveis isoladamente.
- Migrations devem ser idempotentes apenas quando isso for intencional e documentado.
- Backfills e operacoes demoradas devem ficar separados de DDL.
- Toda migration deve ter criterio de rollback operacional documentado, mesmo quando rollback SQL automatico nao existir.
