# Runtime Audit Summary

## Respostas Objetivas

| Pergunta | Resposta |
| --- | --- |
| O runtime de producao corresponde ao repositorio? | Parcialmente. Tabelas, indices, trigger e RLS habilitado convergem, mas ha drift em funcoes privilegiadas, grants e algumas policies. |
| Quantos objetos foram comparados? | 114 objetos/entradas principais: 19 tabelas, 19 assinaturas de funcao, 45 policies, 49 indices, 1 trigger e 1 schema. |
| Quais objetos existem somente em producao? | Overloads antigos: `admin_atualizar_perfil(uuid,text,text,text,text)`, `admin_bloquear_usuario(uuid)`, `admin_liberar_assinante(uuid,text,date,date)`, `admin_liberar_beta(uuid)`, `admin_upsert_assinatura(uuid,text,text,date,date)`. |
| Quais objetos existem somente no Git? | Storage bucket/policies aparecem no Git, mas nao no dump public; classificacao correta e `UNKNOWN_REQUIRES_CATALOG_QUERY`. Policies Git mais simples de insert para treinos/avaliacoes/anamneses nao correspondem ao runtime endurecido. |
| Quais objetos possuem definicao divergente? | Grants de `admin_eh_admin`, `admin_validar_acesso`, `admin_registrar_log`, `aoe_idempotency_get_or_create`, `aoe_user_owns_student`, `set_workout_templates_updated_at`; policies de `treinos`, `avaliacoes`, `anamneses`, `alunos` por nome e `acompanhamento_eventos` por role explicita. |
| Ha definicoes duplicadas? | Sim. Ha definicoes concorrentes no repositorio entre SQL solto, migrations e `auditoria_dados_recomendacoes.sql`; no runtime ha overloads antigos e novos de funcoes admin. |
| Existem divergencias criticas? | Nenhuma CRITICAL confirmada somente pelo dump. |
| Existem riscos altos? | Sim, principalmente grants divergentes, overloads privilegiados runtime-only, grants anon em funcoes AOE e risco de baseline enfraquecer RLS. |
| Ha funcao privilegiada insegura? | Ha funcoes privilegiadas que exigem revisao. A principal preocupacao e `aoe_idempotency_get_or_create` com grant para `anon` e overloads admin antigos com `SECURITY DEFINER`. |
| Ha RLS ausente ou divergente? | RLS ausente nao foi encontrado. RLS divergente foi encontrado em policies de insert e nomes/roles de algumas policies. |
| Ha grants excessivos? | Sim. O dump mostra `GRANT ALL` em tabelas para `anon`, `authenticated` e `service_role`, alem de default privileges amplos. RLS mitiga, mas a baseline nao deve reproduzir sem decisao. |
| Ha dependencias externas nao controladas? | Sim. Storage, Edge Functions, secrets, feature flags AOE e possiveis recursos cron/vault/pg_net exigem catalogo por ambiente. |
| Houve identificacao de possivel dado sensivel? | O dump nao possui `COPY` nem `INSERT` com dados reais; contem nomes de colunas sensiveis e referencias tecnicas. Nao foi encontrado token/chave completo. |
| O dump pode permanecer versionado? | Com base nesta auditoria, sim como evidencia estrutural, desde que revisado antes de commit e mantido fora de migrations/seeds/fixtures. |
| E seguro comecar a baseline? | Nao. E necessario resolver ou aceitar drifts HIGH antes. |
| Qual e o proximo ciclo recomendado? | Ciclo 4 - Schema Drift Resolution. |

## Contagens Finais

| Metrica | Quantidade |
| --- | ---: |
| Tabelas comparadas | 19 |
| Funcoes/assinaturas comparadas | 19 |
| Policies comparadas | 45 |
| Indices comparados | 49 |
| Triggers comparados | 1 |

## Drifts por Classificacao

| Classificacao | Quantidade |
| --- | ---: |
| MATCHED | 80 |
| RUNTIME_ONLY | 5 |
| REPOSITORY_ONLY | 0 confirmado |
| DIFFERENT_DEFINITION | 10 |
| DUPLICATED_DEFINITION | 2 |
| UNKNOWN_REQUIRES_CATALOG_QUERY | 1 |
| MANAGED_BY_SUPABASE | 1 |
| LEGACY_CANDIDATE | 1 |

## Riscos por Severidade

| Severidade | Quantidade |
| --- | ---: |
| CRITICAL | 0 |
| HIGH | 11 |
| MEDIUM | 8 |
| LOW | 2 |
| INFORMATIONAL | 1 |

## Decisao Final

NOT_READY_FOR_BASELINE

## Justificativa

A baseline ainda pode reproduzir um estado incorreto se ignorar overloads runtime-only, grants divergentes, policies runtime mais restritivas e Storage nao confirmado por catalogo. O proximo passo deve ser resolver drift de schema, grants e RLS antes de implementar qualquer baseline.
