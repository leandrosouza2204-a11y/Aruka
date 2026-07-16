# Schema Drift Decisions

## Decisoes por Drift Bloqueador

| ID | Tipo | Schema | Nome | Origem do drift | Definicao em producao | Definicao no repositorio | Decisao | Justificativa | Risco | Impacto de compatibilidade | Destino na baseline | Evidencia | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D-001 | function | public | `admin_atualizar_perfil(uuid,text,text,text,text)` | RUNTIME_ONLY | Overload antigo `SECURITY DEFINER`, grant `service_role` | Ausente como definicao canonica | Excluir da baseline | Nenhum consumidor versionado localizado; assinatura sem `user_agent` e sem log completo | Consumidor externo antigo quebraria se dependesse dele | Nao entra na baseline; tratar como legado runtime | dump linhas 26-83 | EXCLUDE_FROM_BASELINE |
| D-002 | function | public | `admin_bloquear_usuario(uuid)` | RUNTIME_ONLY | Overload antigo `SECURITY DEFINER`, grant `service_role` | Ausente como definicao canonica | Excluir da baseline | Substituido por assinatura com `user_agent` e log | Consumidor externo antigo quebraria | Nao entra na baseline | dump linhas 177-222 | EXCLUDE_FROM_BASELINE |
| D-003 | function | public | `admin_liberar_assinante(uuid,text,date,date)` | RUNTIME_ONLY | Overload antigo `SECURITY DEFINER`, grant `service_role` | Ausente como definicao canonica | Excluir da baseline | Substituido por assinatura com `user_agent` e auditoria | Consumidor externo antigo quebraria | Nao entra na baseline | dump linhas 312-338 | EXCLUDE_FROM_BASELINE |
| D-004 | function | public | `admin_liberar_beta(uuid)` | RUNTIME_ONLY | Overload antigo `SECURITY DEFINER`, grant `service_role` | Ausente como definicao canonica | Excluir da baseline | Substituido por assinatura com `user_agent` e auditoria | Consumidor externo antigo quebraria | Nao entra na baseline | dump linhas 417-459 | EXCLUDE_FROM_BASELINE |
| D-005 | function | public | `admin_upsert_assinatura(uuid,text,text,date,date)` | RUNTIME_ONLY | Overload antigo `SECURITY DEFINER`, grant `service_role` | Ausente como definicao canonica | Excluir da baseline | Substituido por assinatura com `user_agent` e auditoria | Consumidor externo antigo quebraria | Nao entra na baseline | dump linhas 681-733 | EXCLUDE_FROM_BASELINE |
| D-006 | function/grant | public | `admin_eh_admin()` | DIFFERENT_DEFINITION | Grant apenas `service_role` no dump | Git concedia `authenticated` | HARDEN_DEFINITION | Funcao e usada por RLS e RPCs; baseline precisa permitir chamadas autenticadas sem grant anon/public | Baixo se grants forem testados | Mantem comportamento com admins autenticados | `09-grants.sql` concede `authenticated, service_role` | HARDEN_DEFINITION |
| D-007 | function/grant | public | `admin_validar_acesso()` | DIFFERENT_DEFINITION | Grant apenas `service_role` no dump | Git concedia `authenticated` | HARDEN_DEFINITION | RPCs admin chamam a funcao; grant autenticado e coerente com validacao interna | Baixo | Mantem fluxo admin | `09-grants.sql` | HARDEN_DEFINITION |
| D-008 | function/grant | public | `admin_registrar_log(...)` | DIFFERENT_DEFINITION | Grant apenas `service_role` no dump | Git concedia `authenticated` | HARDEN_DEFINITION | Funcao valida admin internamente; Edge/servico podem precisar registrar log com usuario admin | Medio | Preserva chamada admin autenticada | `09-grants.sql` | HARDEN_DEFINITION |
| D-009 | function/grant | public | `aoe_idempotency_get_or_create(...)` | DIFFERENT_DEFINITION | Grant `anon`, `authenticated`, `service_role` | Git concedia `authenticated` | HARDEN_DEFINITION | Remover `anon`; adicionar validacao de `p_actor_id = auth.uid()` ou admin | Medio | Cliente anon nao deve chamar funcao privilegiada | `05-functions.sql`, `09-grants.sql` | HARDEN_DEFINITION |
| D-010 | function/grant | public | `aoe_user_owns_student(uuid)` | DIFFERENT_DEFINITION | Grant `anon`, `authenticated`, `service_role` | Git concedia `authenticated` | HARDEN_DEFINITION | Funcao auxiliar de RLS nao precisa de grant anon | Baixo | Authenticated e policies continuam funcionais | `09-grants.sql` | HARDEN_DEFINITION |
| D-011 | function/grant | public | `set_workout_templates_updated_at()` | DIFFERENT_DEFINITION | Grants para anon/auth/service; sem `search_path` | Trigger function sem `search_path` no Git | HARDEN_DEFINITION | Adicionar `set search_path = public`; grant direto apenas service_role | Baixo | Trigger continua funcionando como owner | `05-functions.sql`, `09-grants.sql` | HARDEN_DEFINITION |
| D-012 | policy | public | `treinos` insert/update | DIFFERENT_DEFINITION | Runtime valida `alunos.user_id = auth.uid()` | SQL solto validava apenas `user_id` | ACCEPT_RUNTIME | Runtime e mais restritivo e evita aluno cross-tenant | Baixo | Pode bloquear payload inconsistente, que ja nao deveria existir | `08-policies.sql` | ACCEPT_RUNTIME |
| D-013 | policy | public | `avaliacoes` insert/update | DIFFERENT_DEFINITION | Runtime valida aluno do usuario | SQL solto validava apenas `user_id` | ACCEPT_RUNTIME | Evita avaliacao cross-tenant | Baixo | Preserva seguranca runtime | `08-policies.sql` | ACCEPT_RUNTIME |
| D-014 | policy | public | `anamneses` insert/update | DIFFERENT_DEFINITION | Runtime valida aluno do usuario | SQL solto validava apenas `user_id` | ACCEPT_RUNTIME | Evita anamnese cross-tenant | Baixo | Preserva seguranca runtime | `08-policies.sql` | ACCEPT_RUNTIME |
| D-015 | policy | public | `acompanhamento_eventos` | SAFE_WITH_REVIEW | Runtime usa `TO authenticated` | Git inicial inventariado como implicito | HARDEN_DEFINITION | Manter role explicita e validar aluno/plano do usuario em insert | Baixo | Mais restritivo que Git | `08-policies.sql` | HARDEN_DEFINITION |
| D-016 | storage | storage | `avaliacoes-fotos` | UNKNOWN_REQUIRES_CATALOG_QUERY | Nao visivel no dump public | Migration versionada existe | BLOCKED_REQUIRES_QUERY | Baseline-src preserva definicao desejada, mas runtime precisa catalog query | Medio | Sem impacto ate aplicar baseline | `10-storage.sql` | BLOCKED_REQUIRES_QUERY |
| D-017 | artifact | repo | `auditoria_dados_recomendacoes.sql` | LEGACY_CANDIDATE | N/A | SQL/recomendacao duplica objetos | LEGACY_ARCHIVE | Nao deve ser fonte canonica da baseline | Baixo | Arquivo permanece como evidencia historica | Documentado para Ciclo 6 | LEGACY_ARCHIVE |

## Objetos Duplicados

| Objeto | Origens | Definicao canonica | Decisao |
| --- | --- | --- | --- |
| Indices multi-tenant | `auditoria_dados_recomendacoes.sql`, migration RLS indices, dump | Runtime/baseline-src `04-indexes.sql` | `auditoria_dados_recomendacoes.sql` vira legado |
| Policies de treinos | `supabase/treinos.sql`, `auditoria_dados_recomendacoes.sql`, dump | Runtime endurecido em `08-policies.sql` | aceitar runtime |
| Policies de avaliacoes/anamneses | `supabase/avaliacoes_anamneses.sql`, `auditoria_dados_recomendacoes.sql`, dump | Runtime endurecido em `08-policies.sql` | aceitar runtime |
| Funcoes admin antigas e novas | dump com overloads, `admin_rpc.sql` com assinaturas novas | Somente assinaturas com `p_user_agent` | excluir overloads antigos da baseline |

## Decisao de Fonte de Verdade

- Tabelas, constraints e indices: runtime consolidado, normalizado em `baseline-src`.
- Funcoes admin: repositorio mais recente, endurecido com grants claros.
- Funcoes AOE: repositorio mais recente, endurecido removendo `anon`.
- RLS/policies divergentes: runtime mais restritivo.
- Storage: definicao versionada existente, pendente de catalog query runtime.
- SQL legado: mantido como evidencia, fora da fonte canonica.
