# Migration Cutover Inventory

## Decisao

A baseline oficial `20260716090000_baseline_aruka_v1.sql` passa a ser a primeira migration ativa. Migrations anteriores foram classificadas antes de qualquer movimentacao.

## Baseline oficial

- Arquivo: `supabase/migrations/20260716090000_baseline_aruka_v1.sql`
- SHA256: `745601B2963721AA060063F1DB250CBF11091EB2C5B74E799A675CCC73CB8DCE`
- Origem: `supabase/baseline-candidate/20260716090000_baseline_aruka_v1.sql`
- Resultado: byte a byte equivalente a candidate validada.

## Inventario

| Migration | Classificacao | Objetos/Finalidade | Dependencias | Incorporada | Destino | Justificativa |
| --- | --- | --- | --- | --- | --- | --- |
| `20260705090000_hardening_admin_functions.sql` | ABSORBED_BY_BASELINE | Grants/revokes de RPC admin | Funcoes admin public | Sim | `supabase/migrations-archive/` | Grants canonicos estao na baseline |
| `20260705091000_rls_indices_multitenant.sql` | ABSORBED_BY_BASELINE | Indices e RLS multitenant | Tabelas public | Sim | `supabase/migrations-archive/` | RLS/indices consolidados |
| `20260710090000_integridade_avaliacoes.sql` | ABSORBED_BY_BASELINE | Constraints/integridade de avaliacoes | `avaliacoes` | Sim | `supabase/migrations-archive/` | Constraints consolidadas |
| `20260710091000_storage_avaliacoes_fotos.sql` | ABSORBED_BY_BASELINE | Bucket e policies Storage | `storage.buckets`, `storage.objects` | Sim | `supabase/migrations-archive/` | Storage canonico na baseline |
| `20260711090000_acompanhamento_alunos.sql` | ABSORBED_BY_BASELINE | Tabela acompanhamento | `alunos`, `planos` | Sim | `supabase/migrations-archive/` | Estrutura consolidada |
| `20260711091000_historico_acompanhamento_alunos.sql` | ABSORBED_BY_BASELINE | Historico/eventos acompanhamento | `acompanhamento_eventos` | Sim | `supabase/migrations-archive/` | Estrutura consolidada |
| `20260711092000_motivo_encerramento_detalhe.sql` | ABSORBED_BY_BASELINE | Campo/constraint de motivo | Assinaturas/acompanhamento | Sim | `supabase/migrations-archive/` | Incorporado ao schema final |
| `20260711093000_planos_nome_unico.sql` | ABSORBED_BY_BASELINE | Unicidade de planos | `planos` | Sim | `supabase/migrations-archive/` | Constraint consolidada |
| `20260711094000_rpc_processar_encerramento_automatico.sql` | ABSORBED_BY_BASELINE | RPC de encerramento | Assinaturas/acompanhamento | Sim | `supabase/migrations-archive/` | Funcao consolidada |
| `20260712090000_agendar_encerramentos_automaticos_dry_run.sql` | OPERATIONAL_ONLY | `pg_cron`, `pg_net`, Vault secret e Edge Function URL | Secret por ambiente, Edge Function, extensoes gerenciadas | Nao | `supabase/operations/` | Nao deve rodar automaticamente em ambientes novos |
| `20260714090000_workout_templates.sql` | ABSORBED_BY_BASELINE | Templates de treino e trigger | `workout_templates` | Sim | `supabase/migrations-archive/` | Estrutura consolidada |
| `20260715090000_aoe_infrastructure_pilot.sql` | ABSORBED_BY_BASELINE | Tabelas/funcoes/policies AOE | Auth, alunos, RPCs | Sim | `supabase/migrations-archive/` | Infra AOE consolidada |

## Migration de agendamento

`20260712090000_agendar_encerramentos_automaticos_dry_run.sql` cria `pg_cron`, `pg_net`, `supabase_vault`, consulta `vault.decrypted_secrets`, agenda `cron.schedule` e chama uma Edge Function por URL Supabase. Ela depende de secret por ambiente e nao deve fazer parte da cadeia automatica de bootstrap.

