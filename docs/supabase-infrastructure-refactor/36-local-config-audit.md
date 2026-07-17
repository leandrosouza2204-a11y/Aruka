# Local Config Audit

## Resumo

`supabase/config.toml` foi revisado para bootstrap local reproduzivel. A mudanca funcional do Ciclo 7 foi restringir servicos instaveis no Windows que nao sao necessarios para validar a baseline SQL.

| Configuracao | Valor | Classificacao | Risco | Decisao |
| --- | --- | --- | --- | --- |
| `project_id` | `ConsultoriaFitness` | LOCAL | Baixo | Mantido para stack local Aruka |
| `[api]` | enabled, port `54321` | LOCAL | Baixo | Mantido |
| `[db]` | port `54322`, shadow `54320`, PG 17 | LOCAL | Baixo | Mantido |
| `[db.migrations]` | enabled | LOCAL | Baixo | Mantido |
| `[db.seed]` | enabled, `seed.sql` | LOCAL | Medio | Seeds reais ficam fora deste ciclo |
| `[realtime]` | disabled | LOCAL | Baixo | Desativado para bootstrap deterministico |
| `[studio]` | disabled | LOCAL | Baixo | Desativado para evitar health-check instavel |
| `[local_smtp]` | enabled, port `54324` | LOCAL | Baixo | Mantido |
| `[storage]` | enabled | LOCAL | Baixo | Necessario para bucket/policies |
| `[auth]` | enabled | LOCAL | Baixo | Necessario para auth schema/roles |
| `[edge_runtime]` | disabled | Dependente de ambiente | Medio | Edge Functions nao sao validadas neste ciclo |
| `[analytics]` | disabled | LOCAL | Baixo | Desativado por instabilidade local Windows |
| `[experimental]` | env placeholders | Dependente de ambiente | Medio | Sem secrets reais |

## Matriz Ciclo 7.1

| Servico | Estado local | Necessario no bootstrap | Necessario nos seeds | Necessario no QA | Decisao |
| --- | --- | --- | --- | --- | --- |
| Database | Ativo | Sim | Sim | Sim | Manter |
| API/PostgREST | Ativo | Sim | Sim | Sim | Manter |
| Auth | Ativo | Sim | Sim | Sim | Manter |
| Storage | Ativo | Sim | Sim | Sim | Manter |
| Mailpit/local SMTP | Ativo | Nao bloqueante | Possivel | Baixo | Manter por compatibilidade Auth |
| Realtime | Desativado | Nao | Nao | Nao neste ciclo | Manter desativado localmente |
| Studio | Desativado | Nao | Nao | Nao | Manter desativado localmente |
| Edge Runtime | Desativado | Nao | Nao | Nao neste ciclo | Reativar apenas em ciclo de Edge Functions |
| Analytics | Desativado | Nao | Nao | Nao | Manter desativado localmente |

## LOCAL x HML x Producao

- LOCAL usa Docker e portas locais.
- HML/producao devem ser configurados no painel/CLI autorizado, em ciclo proprio.
- Nenhum secret real foi inserido.
- Nenhum valor remoto foi alterado.
