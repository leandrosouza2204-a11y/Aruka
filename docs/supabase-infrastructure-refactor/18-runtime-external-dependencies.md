# Runtime External Dependencies

## Objetivo

Identificar dependencias externas e recursos gerenciados visiveis no dump, no repositorio e nas Edge Functions, sem registrar secrets ou valores sensiveis.

| Dependencia | Origem | Consumidor | Ambiente necessario | Risco de reproducao | Configuracao manual | Secret | LOCAL | HML | PRODUCAO |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `auth.users` | FKs e funcoes SQL | perfis, alunos, admin RPCs, AOE | Todos | Alto se auth nao existir/seed nao criar usuarios | Supabase Auth | Nao no SQL | Criar usuarios seed | Validar usuarios HML | Dados reais |
| `auth.uid()` | RLS e funcoes | Quase todas as policies | Todos | Alto para RLS | Auth JWT | Nao | Testar anon/authenticated | Testar roles | Monitorar regressao |
| `storage.buckets` | migration Storage | bucket `avaliacoes-fotos` | Todos com fotos | Medio, ausente no dump public | Criar por migration/catalogo | Nao | Criar bucket local | Confirmar bucket | Confirmar bucket |
| `storage.objects` | migration Storage | fotos de avaliacoes | Todos com fotos | Medio, policies nao visiveis no dump | Policies Storage | Nao | Testar path user_id | Testar signed URLs | Monitorar acesso |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions | `aoe`, encerramentos, transfer access | Edge runtime | Alto | Secret por ambiente | Sim | Usar secret local | Definir HML | Definir producao |
| `SUPABASE_URL` | Edge Functions/app | todos clientes Supabase | Todos | Alto se aponta ambiente errado | Env var | Nao sensivel isoladamente | Local URL | HML URL | Prod URL |
| `SUPABASE_ANON_KEY` | App/Edge Functions | cliente anon e auth | Todos | Medio | Env var | Chave publica, ainda controlada | Local | HML | Producao |
| `ENCERRAMENTOS_AUTOMATICOS_SECRET` | Edge Function | job encerramentos | HML/producao | Alto se ausente/vazado | Secret manual | Sim | Opcional/teste | Obrigatorio | Obrigatorio |
| `AOE_CORS_ORIGIN` | Edge Function AOE | CORS | HML/producao | Medio | Env var | Nao | localhost | dominio HML | dominio prod |
| `AOE_ENABLED` | Edge Function AOE | feature flag | Todos | Medio | Env var | Nao | conforme teste | controlado | controlado |
| `AOE_PILOT_ENABLED` | Edge Function AOE | feature flag | HML/producao | Medio | Env var | Nao | conforme teste | controlado | controlado |
| allowlists AOE CSV | Edge Function AOE | acesso piloto | HML/producao | Medio | Env var | Pode conter IDs | Ficticio | IDs HML | IDs reais controlados |
| Edge Function `aoe` | `supabase/functions/aoe` | AOE runtime | HML/producao | Alto se nao deployada | Deploy Supabase | Usa secrets | Serve local | Deploy HML | Deploy prod |
| Edge Function `processar-encerramentos-automaticos` | functions | encerramentos | HML/producao | Alto | Deploy + agendamento externo | Usa secret | Teste manual | Job HML | Job prod |
| Edge Function `transfer-user-access` | functions | admin/acesso | HML/producao | Medio | Deploy Supabase | Usa service role | Teste local | Deploy HML | Deploy prod |
| `pgcrypto`/`gen_random_uuid()` | SQL repo | IDs UUID | Todos | Medio se extension ausente | Extension | Nao | Habilitar local | Confirmar | Confirmar |
| `cron`/`pg_cron` | pedido de auditoria | nao visivel no dump | Desconhecido | UNKNOWN | Catalog query | Nao | N/A | Verificar | Verificar |
| `vault` | pedido de auditoria | nao visivel no dump | Desconhecido | UNKNOWN | Catalog query | Possivel | N/A | Verificar | Verificar |
| `pg_net`/`net.http` | pedido de auditoria | nao visivel no dump | Desconhecido | UNKNOWN | Catalog query | Possivel | N/A | Verificar | Verificar |
| URLs externas | dump/functions | nenhuma URL externa completa no dump; Supabase env no codigo | Edge/app | Medio | Env vars | Possivel | Redigir | Redigir | Redigir |
| Project Ref | `supabase/.temp/project-ref` e validacao | CLI local | Local/HML | Alto se vinculo errado | Supabase CLI link | Nao secret, mas sensivel operacional | Deve ser HML nesta auditoria | `xrmq...adnf` | Nunca operar prod por engano |

## Possiveis Secrets ou Dados Sensíveis

O dump nao contem `COPY` nem `INSERT` com dados reais. Foram encontrados nomes de colunas como `email`, `whatsapp`, `token/key` em contexto estrutural, mas nao valores. O project-ref HML foi confirmado; nao ha token completo ou chave JWT aparente no dump.

## Recomendacoes

- Executar catalog query read-only para Storage, cron, vault e pg_net antes da baseline.
- Manter matriz de secrets por ambiente sem registrar valores.
- Criar teste que falhe se CLI estiver vinculada ao project-ref errado antes de comandos perigosos.
