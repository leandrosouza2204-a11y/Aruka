# Migration Rename Map

Renomeio local para prefixos unicos `YYYYMMDDHHMMSS_descricao.sql`. Nenhuma migration foi registrada como aplicada remotamente e nenhum `migration repair` foi executado.

| Nome anterior | Nome novo | Ordem | Dependencias | Motivo |
| --- | --- | ---: | --- | --- |
| `20260705_hardening_admin_functions.sql` | `20260705090000_hardening_admin_functions.sql` | 1 | Funcoes admin existentes | Remover prefixo de apenas data e preservar primeira ordem de 20260705 |
| `20260705_rls_indices_multitenant.sql` | `20260705091000_rls_indices_multitenant.sql` | 2 | Tabelas base | Tornar timestamp unico apos hardening |
| `20260710_integridade_avaliacoes.sql` | `20260710090000_integridade_avaliacoes.sql` | 3 | `avaliacoes` | Preservar ordem anterior ao Storage |
| `20260710_storage_avaliacoes_fotos.sql` | `20260710091000_storage_avaliacoes_fotos.sql` | 4 | Storage Supabase | Tornar timestamp unico apos integridade |
| `20260711_acompanhamento_alunos.sql` | `20260711090000_acompanhamento_alunos.sql` | 5 | `alunos` | Primeiro bloco de acompanhamento |
| `20260711_historico_acompanhamento_alunos.sql` | `20260711091000_historico_acompanhamento_alunos.sql` | 6 | `alunos`, `planos` | Cria historico apos colunas de acompanhamento |
| `20260711_motivo_encerramento_detalhe.sql` | `20260711092000_motivo_encerramento_detalhe.sql` | 7 | `alunos` | Complemento de motivo apos status |
| `20260711_planos_nome_unico.sql` | `20260711093000_planos_nome_unico.sql` | 8 | `planos` | Unique de planos apos estrutura base |
| `20260711_rpc_processar_encerramento_automatico.sql` | `20260711094000_rpc_processar_encerramento_automatico.sql` | 9 | `alunos`, `acompanhamento_eventos` | RPC apos tabelas de acompanhamento |
| `20260712_agendar_encerramentos_automaticos_dry_run.sql` | `20260712090000_agendar_encerramentos_automaticos_dry_run.sql` | 10 | RPC de encerramento | Dry-run/agendamento apos RPC |
| `20260714_workout_templates.sql` | `20260714090000_workout_templates.sql` | 11 | Auth/users | Templates apos blocos de aluno/treino |
| `20260715_aoe_infrastructure_pilot.sql` | `20260715090000_aoe_infrastructure_pilot.sql` | 12 | `alunos`, admin helpers | AOE por ultimo por depender de aluno/admin |

Referencias documentais aos nomes antigos foram atualizadas para os nomes novos quando localizadas por busca textual.
