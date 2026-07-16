# Local Services and Ports

| Servico | Porta | Origem | Necessidade | Conflito comum |
| --- | ---: | --- | --- | --- |
| API | 54321 | `[api].port` | REST local | Porta ocupada por stack antigo |
| Database | 54322 | `[db].port` | Validacao SQL | PostgreSQL local |
| Shadow DB | 54320 | `[db].shadow_port` | Diff local | Supabase antigo |
| Studio | 54323 | `[studio].port` | Opcional | Desativado no Ciclo 7 |
| Mailpit | 54324 | `[local_smtp].port` | Emails locais | Servidor SMTP local |
| Pooler | 54329 | `[db.pooler].port` | Opcional | Desativado |
| Analytics | 54327 | `[analytics].port` | Opcional | Desativado no Ciclo 7 |
| Edge inspector | 8083 | `[edge_runtime].inspector_port` | Edge local | Desativado no Ciclo 7 |

Use `npm.cmd run supabase:preflight` para diagnosticar Docker, CLI e portas principais.
