# Environment Dependency Matrix

| Dependencia | LOCAL | DEV | HML | PRODUCAO | Configuracao automatica | Configuracao manual | Secret necessario | Validacao | Responsavel | Risco |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Supabase Auth (`auth.users`, `auth.uid()`) | Supabase local + seeds | Projeto DEV | Projeto HML | Projeto prod | Parcial via Supabase | Usuarios/seeds por ambiente | Nao | RLS/RPC tests | Engenharia/DevOps | Alto |
| Schema `public` | baseline-src consolidado no Ciclo 5 | migrations | migrations | migrations aprovadas | Sim | Cutover em existentes | Nao | Drift check | Engenharia | Alto |
| `pgcrypto` | baseline | baseline | baseline | baseline | Sim | Nao | Nao | SQL/static | Engenharia | Medio |
| Edge Function `aoe` | serve local | deploy DEV | deploy HML | deploy prod | Parcial | Deploy por ambiente | Sim, service role | smoke test | DevOps | Alto |
| Edge Function `processar-encerramentos-automaticos` | opcional local | deploy DEV | deploy HML | deploy prod | Parcial | Job/secret | Sim | header/job smoke | DevOps | Alto |
| Edge Function `transfer-user-access` | opcional local | deploy DEV | deploy HML | deploy prod | Parcial | Deploy/secret | Sim | admin smoke | DevOps | Medio |
| `SUPABASE_URL` | local URL | DEV URL | HML URL | prod URL | Nao | Env var | Nao | env check | DevOps | Alto |
| `SUPABASE_ANON_KEY` | local anon | DEV anon | HML anon | prod anon | Nao | Env var | Sim, chave publica controlada | env check | DevOps | Medio |
| `SUPABASE_SERVICE_ROLE_KEY` | local service | DEV secret | HML secret | prod secret | Nao | Secret manager | Sim | nunca logar valor | DevOps | Alto |
| `ENCERRAMENTOS_AUTOMATICOS_SECRET` | fixture local | DEV secret | HML secret | prod secret | Nao | Secret manager | Sim | chamada sem/com segredo | DevOps | Alto |
| Flags AOE | defaults locais | DEV env | HML env | prod env | Nao | Env vars | Nao | smoke AOE | Produto/DevOps | Medio |
| Storage bucket `avaliacoes-fotos` | baseline Storage | migration/baseline | migration/baseline | migration aprovada | Sim no SQL | Confirmar runtime | Nao | catalog query + upload teste | Engenharia | Medio |
| Storage policies | baseline Storage | migration/baseline | migration/baseline | migration aprovada | Sim no SQL | Confirmar runtime | Nao | RLS storage test | Engenharia | Medio |
| `cron`/`pg_cron` | fora da baseline | verificar | verificar | verificar | Nao | Se adotado | Possivel | catalog query | DevOps | Desconhecido |
| `vault` | fora da baseline | verificar | verificar | verificar | Nao | Se adotado | Sim | catalog query | DevOps | Desconhecido |
| `pg_net`/`net.http` | fora da baseline | verificar | verificar | verificar | Nao | Se adotado | Possivel | catalog query | DevOps | Desconhecido |
| Project-ref CLI | local/HML guardrail | DEV guardrail | HML `xrmq...adnf` | nunca operar sem confirmacao | Nao | `supabase link` controlado | Nao | leitura `.temp/project-ref` | DevOps | Alto |
| Seeds/fixtures | completos ficticios | ficticios | controlados | proibidos salvo aprovacao | Parcial | Review | Nao | scan dados reais | QA | Medio |

Nenhum valor de secret deve ser registrado no repositorio.
