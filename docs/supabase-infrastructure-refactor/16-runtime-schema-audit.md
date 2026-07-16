# Runtime Schema Audit

## Objetivo

Comparar o dump runtime `reports/hml-baseline/production-public-schema.sql` com os artefatos versionados do Aruka e identificar schema drift conhecido, sem executar SQL e sem modificar banco, migrations, Edge Functions ou codigo da aplicacao.

## Fontes Analisadas

- Dump runtime: `reports/hml-baseline/production-public-schema.sql`.
- Inventarios dos Ciclos 1 e 2 em `docs/supabase-infrastructure-refactor/01-*.md` a `15-*.md`.
- SQL do repositorio: `supabase/*.sql` e `supabase/migrations/*.sql`.
- Edge Functions: `supabase/functions/**`.
- Servicos e scripts que usam Supabase: `src/services/**` e scripts de validacao relacionados.

## Data da Evidencia

- Dump: 16/07/2026 08:09:57, 85.187 bytes.
- Project-ref vinculado no momento da auditoria: `xrmqdkpxnfvusmenadnf` (HML).
- Branch utilizada: `main`, porque o repositorio ja continha mudancas pre-existentes.

## Limitacoes

- O dump analisado e focado no schema `public`; objetos de `storage`, `auth`, `cron`, `vault` e `pg_net` aparecem apenas por referencias, nao como catalogo completo.
- Nao foram executadas catalog queries remotas.
- Nao foram reproduzidos valores potencialmente sensiveis.
- Diferencas de formatacao/quoting do `pg_dump` foram ignoradas quando a semantica parece equivalente.

## Resumo Quantitativo

| Item | Quantidade |
| --- | ---: |
| Schemas explicitamente criados | 1 |
| Schemas referenciados | 3 (`public`, `auth`, `storage`) |
| Extensions no dump | 0 explicitas |
| Tabelas publicas comparadas | 19 |
| Funcoes/assinaturas comparadas | 19 runtime, 14 esperadas no Ciclo 1 |
| Policies comparadas | 45 |
| Indices comparados | 49 |
| Triggers comparados | 1 |
| Sequences | 0 |
| Views | 0 |
| Tipos customizados | 0 |
| Grants/revokes revisados | 90+ linhas de privilegios |

## Matriz de Objetos

| Tipo | Schema | Nome | Assinatura | Classificacao | Origem no repositorio | Producao | Severidade | Impacto | Recomendacao | Evidencia | Catalog query adicional |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| schema | public | public | N/A | MANAGED_BY_SUPABASE | N/A | Sim | INFORMATIONAL | Schema padrao gerenciado | Nao reproduzir owner/comentarios sem criterio | dump linhas 16-22 | Nao |
| table | public | aceites_legais | N/A | MATCHED | `supabase/aceites_legais.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 998-1012 | Nao |
| table | public | acompanhamento_eventos | N/A | MATCHED | `20260711091000_historico_acompanhamento_alunos.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1015-1034 | Nao |
| table | public | admin_logs | N/A | MATCHED | `supabase/admin_logs.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1037-1052 | Nao |
| table | public | alunos | N/A | MATCHED | `supabase/alunos.sql` + migrations acompanhamento | Sim | INFORMATIONAL | Estrutura esperada | Incluir estado consolidado na baseline | dump linhas 1055-1080 | Nao |
| table | public | anamneses | N/A | MATCHED | `supabase/avaliacoes_anamneses.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1083-1130 | Nao |
| table | public | aoe_audit_events | N/A | MATCHED | `20260715090000_aoe_infrastructure_pilot.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1133-1150 | Nao |
| table | public | aoe_decision_traces | N/A | MATCHED | `20260715090000_aoe_infrastructure_pilot.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1153-1164 | Nao |
| table | public | aoe_decisions | N/A | MATCHED | `20260715090000_aoe_infrastructure_pilot.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1167-1197 | Nao |
| table | public | aoe_human_reviews | N/A | MATCHED | `20260715090000_aoe_infrastructure_pilot.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1200-1220 | Nao |
| table | public | aoe_idempotency_keys | N/A | MATCHED | `20260715090000_aoe_infrastructure_pilot.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1223-1240 | Nao |
| table | public | assinaturas | N/A | MATCHED | `supabase/assinaturas.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1243-1256 | Nao |
| table | public | avaliacoes | N/A | MATCHED | `supabase/avaliacoes_anamneses.sql` + integridade | Sim | INFORMATIONAL | Estrutura esperada | Incluir estado consolidado na baseline | dump linhas 1259-1306 | Nao |
| table | public | pagamentos | N/A | MATCHED | `supabase/pagamentos.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1309-1329 | Nao |
| table | public | perfis | N/A | MATCHED | `supabase/perfis.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1332-1347 | Nao |
| table | public | planos | N/A | MATCHED | `supabase/planos.sql` + unique migration | Sim | INFORMATIONAL | Estrutura esperada | Incluir estado consolidado na baseline | dump linhas 1350-1366 | Nao |
| table | public | treino_dias | N/A | MATCHED | `supabase/treinos.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1369-1379 | Nao |
| table | public | treino_exercicios | N/A | MATCHED | `supabase/treinos.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1382-1397 | Nao |
| table | public | treinos | N/A | MATCHED | `supabase/treinos.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1400-1416 | Nao |
| table | public | workout_templates | N/A | MATCHED | `20260714090000_workout_templates.sql` | Sim | INFORMATIONAL | Estrutura esperada | Incluir na baseline | dump linhas 1419-1441 | Nao |
| function | public | admin_atualizar_perfil | `(uuid,text,text,text,text)` | RUNTIME_ONLY | versao antiga nao localizada como definicao final | Sim | HIGH | Overload administrativo antigo permanece executavel por `service_role` | Decidir remocao ou incorporacao controlada no Ciclo 4 | dump linhas 26-83, grants 2256-2257 | Sim |
| function | public | admin_atualizar_perfil | `(uuid,text,text,text,text,text)` | MATCHED | `supabase/admin_rpc.sql` | Sim | MEDIUM | Funcao privilegiada esperada | Revisar grants e testes admin | dump linhas 86-174 | Nao |
| function | public | admin_bloquear_usuario | `(uuid)` | RUNTIME_ONLY | versao antiga nao localizada como definicao final | Sim | HIGH | Overload administrativo antigo permanece executavel por `service_role` | Decidir remocao ou incorporacao controlada no Ciclo 4 | dump linhas 177-222 | Sim |
| function | public | admin_bloquear_usuario | `(uuid,text)` | MATCHED | `supabase/admin_rpc.sql` | Sim | MEDIUM | Funcao privilegiada esperada | Revisar grants e testes admin | dump linhas 225-292 | Nao |
| function | public | admin_eh_admin | `()` | DIFFERENT_DEFINITION | `supabase/admin_rpc.sql` | Sim | HIGH | Runtime concede apenas `service_role`; Git esperava `authenticated`; usada por RLS | Validar grant correto para policies/RPCs antes da baseline | dump linhas 295-309, grants 2278-2279 | Sim |
| function | public | admin_liberar_assinante | `(uuid,text,date,date)` | RUNTIME_ONLY | versao antiga nao localizada como definicao final | Sim | HIGH | Overload administrativo antigo permanece executavel por `service_role` | Decidir remocao ou incorporacao controlada no Ciclo 4 | dump linhas 312-338 | Sim |
| function | public | admin_liberar_assinante | `(uuid,text,date,date,text)` | MATCHED | `supabase/admin_rpc.sql` | Sim | MEDIUM | Funcao privilegiada esperada | Revisar grants e testes admin | dump linhas 341-414 | Nao |
| function | public | admin_liberar_beta | `(uuid)` | RUNTIME_ONLY | versao antiga nao localizada como definicao final | Sim | HIGH | Overload administrativo antigo permanece executavel por `service_role` | Decidir remocao ou incorporacao controlada no Ciclo 4 | dump linhas 417-459 | Sim |
| function | public | admin_liberar_beta | `(uuid,text)` | MATCHED | `supabase/admin_rpc.sql` | Sim | MEDIUM | Funcao privilegiada esperada | Revisar grants e testes admin | dump linhas 462-526 | Nao |
| function | public | admin_listar_logs | `(text,uuid,date,date,text)` | MATCHED | `supabase/admin_logs.sql` | Sim | MEDIUM | Funcao privilegiada esperada | Revisar acesso admin | dump linhas 529-590 | Nao |
| function | public | admin_listar_usuarios | `()` | MATCHED | `supabase/admin_rpc.sql` | Sim | MEDIUM | Acessa `auth.users` | Revisar grants e testes admin | dump linhas 593-631 | Nao |
| function | public | admin_registrar_log | `(uuid,text,text,uuid,jsonb,jsonb,text)` | DIFFERENT_DEFINITION | `supabase/admin_logs.sql` | Sim | HIGH | Git concede `authenticated`; runtime concede `service_role`; altera modelo de chamada | Decidir grant alvo e alinhar baseline | dump linhas 634-678, grants 2317-2318 | Sim |
| function | public | admin_upsert_assinatura | `(uuid,text,text,date,date)` | RUNTIME_ONLY | versao antiga nao localizada como definicao final | Sim | HIGH | Overload administrativo antigo permanece executavel por `service_role` | Decidir remocao ou incorporacao controlada no Ciclo 4 | dump linhas 681-733 | Sim |
| function | public | admin_upsert_assinatura | `(uuid,text,text,date,date,text)` | MATCHED | `supabase/admin_rpc.sql` | Sim | MEDIUM | Funcao privilegiada esperada | Revisar grants e testes admin | dump linhas 736-811 | Nao |
| function | public | admin_validar_acesso | `()` | DIFFERENT_DEFINITION | `supabase/admin_rpc.sql` | Sim | HIGH | Runtime concede apenas `service_role`; Git esperava `authenticated`; funcao e base de RPCs admin | Validar grant correto e fluxo de chamada | dump linhas 814-826, grants 2333-2334 | Sim |
| function | public | aoe_idempotency_get_or_create | `(text,uuid,uuid,text,text,text)` | DIFFERENT_DEFINITION | `20260715090000_aoe_infrastructure_pilot.sql` | Sim | HIGH | Runtime concede `anon`; Git esperava `authenticated`; funcao insere idempotencia | Remover/justificar `anon` antes da baseline | dump linhas 829-857, grants 2338-2341 | Sim |
| function | public | aoe_user_owns_student | `(uuid)` | DIFFERENT_DEFINITION | `20260715090000_aoe_infrastructure_pilot.sql` | Sim | MEDIUM | Runtime concede `anon`; usada em RLS | Confirmar se grant anon e necessario | dump linhas 860-872, grants 2345-2348 | Sim |
| function | public | processar_encerramento_automatico_aluno | `(uuid,uuid,date,date,text,uuid,text,integer,text)` | MATCHED | `20260711094000_rpc_processar_encerramento_automatico.sql` | Sim | MEDIUM | Esperada para Edge Function, grant service role | Manter e testar idempotencia | dump linhas 875-978 | Nao |
| function | public | set_workout_templates_updated_at | `()` | DIFFERENT_DEFINITION | `20260714090000_workout_templates.sql` | Sim | LOW | Runtime concede `anon/authenticated/service_role`; trigger function sem search_path | Reduzir grants no ciclo de hardening se aplicavel | dump linhas 981-991, grants 2357-2359 | Sim |
| index | public | todos os 49 indices dump | N/A | MATCHED | SQL solto + migrations | Sim | INFORMATIONAL | Indices esperados, incluindo unique de eventos | Incluir na baseline consolidada | dump linhas 1549-1769 | Nao |
| trigger | public | set_workout_templates_updated_at | `before update on workout_templates` | MATCHED | `20260714090000_workout_templates.sql` | Sim | INFORMATIONAL | Atualiza `updated_at` | Incluir na baseline | dump linha 1773 | Nao |
| storage | storage | avaliacoes-fotos bucket/policies | N/A | UNKNOWN_REQUIRES_CATALOG_QUERY | `20260710091000_storage_avaliacoes_fotos.sql` | Nao visivel no dump public | MEDIUM | Baseline precisa confirmar Storage runtime | Executar catalog query read-only em ciclo aprovado | docs Ciclo 1 + dump sem storage DDL | Sim |
| artifact | repo | supabase/auditoria_dados_recomendacoes.sql | N/A | LEGACY_CANDIDATE | `supabase/auditoria_dados_recomendacoes.sql` | N/A | LOW | SQL estrutural/recomendacao duplicada | Classificar formalmente antes da baseline | Ciclo 1 findings | Nao |

## Divergencias Principais

- Overloads antigos de funcoes administrativas existem no runtime, mas nao compoem a definicao final inventariada no Git.
- Grants runtime divergem dos arquivos versionados em funcoes admin e AOE.
- Runtime possui `GRANT ALL` em tabelas para `anon`, `authenticated` e `service_role`; RLS mitiga acesso direto, mas a baseline deve decidir se reproduz grants default do Supabase ou grants minimos.
- Policies runtime de `alunos` usam nomes com caracteres corrompidos pelo dump/encoding, enquanto o Git usa nomes ASCII/sem acento. A logica parece equivalente.
- Policies runtime de `treinos`, `avaliacoes` e `anamneses` incluem validacao de ownership por `alunos` em inserts; o Git solto e mais simples. Isso e drift funcional relevante e mais restritivo no runtime.
- Storage nao aparece como DDL no dump public; exige catalog query adicional.

## Auditoria de Funcoes Privilegiadas

| Funcao | Assinatura | Privilegio | search_path | EXECUTE/ALL roles no dump | Dependencias | Risco | Recomendacao |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `admin_atualizar_perfil` | `(uuid,text,text,text,text)` | SECURITY DEFINER | `public, auth` | `service_role` | `auth.users`, `perfis` | HIGH, overload antigo | Decidir remocao ou documentar compatibilidade |
| `admin_atualizar_perfil` | `(uuid,text,text,text,text,text)` | SECURITY DEFINER | `public, auth` | `authenticated`, `service_role` | `auth.users`, `perfis`, `admin_registrar_log` | MEDIUM | Manter com testes admin |
| `admin_bloquear_usuario` | `(uuid)` | SECURITY DEFINER | `public, auth` | `service_role` | `auth.users`, `perfis` | HIGH, overload antigo | Decidir remocao ou documentar compatibilidade |
| `admin_bloquear_usuario` | `(uuid,text)` | SECURITY DEFINER | `public, auth` | `authenticated`, `service_role` | `auth.users`, `perfis`, `admin_registrar_log` | MEDIUM | Manter com testes admin |
| `admin_eh_admin` | `()` | SECURITY DEFINER | `public` | `service_role` | `perfis`, `auth.uid()` | HIGH por divergencia de grant e uso em RLS | Validar se policies funcionam com grant runtime |
| `admin_liberar_assinante` | `(uuid,text,date,date)` | SECURITY DEFINER | `public, auth` | `service_role` | RPCs admin | HIGH, overload antigo | Decidir remocao ou compatibilidade |
| `admin_liberar_assinante` | `(uuid,text,date,date,text)` | SECURITY DEFINER | `public, auth` | `authenticated`, `service_role` | `auth.users`, `perfis`, `assinaturas`, logs | MEDIUM | Manter com testes |
| `admin_liberar_beta` | `(uuid)` | SECURITY DEFINER | `public, auth` | `service_role` | `auth.users`, `perfis` | HIGH, overload antigo | Decidir remocao |
| `admin_liberar_beta` | `(uuid,text)` | SECURITY DEFINER | `public, auth` | `authenticated`, `service_role` | `auth.users`, `perfis`, logs | MEDIUM | Manter com testes |
| `admin_listar_logs` | `(text,uuid,date,date,text)` | SECURITY DEFINER | `public, auth` | `authenticated`, `service_role` | `admin_logs`, `auth.users`, `perfis` | MEDIUM | Manter com testes admin |
| `admin_listar_usuarios` | `()` | SECURITY DEFINER | `public, auth` | `authenticated`, `service_role` | `auth.users`, `perfis`, `assinaturas` | MEDIUM | Manter com testes admin |
| `admin_registrar_log` | `(uuid,text,text,uuid,jsonb,jsonb,text)` | SECURITY DEFINER | `public, auth` | `service_role` | `perfis`, `admin_logs` | HIGH por divergencia de grant | Alinhar grant ao modelo de chamada |
| `admin_upsert_assinatura` | `(uuid,text,text,date,date)` | SECURITY DEFINER | `public, auth` | `service_role` | `auth.users`, `assinaturas` | HIGH, overload antigo | Decidir remocao |
| `admin_upsert_assinatura` | `(uuid,text,text,date,date,text)` | SECURITY DEFINER | `public, auth` | `authenticated`, `service_role` | `auth.users`, `assinaturas`, logs | MEDIUM | Manter com testes |
| `admin_validar_acesso` | `()` | SECURITY DEFINER | `public` | `service_role` | `admin_eh_admin` | HIGH por divergencia de grant | Validar chamadas internas e grant esperado |
| `aoe_idempotency_get_or_create` | `(text,uuid,uuid,text,text,text)` | SECURITY DEFINER | `public` | `anon`, `authenticated`, `service_role` | `aoe_idempotency_keys` | HIGH por grant anon | Remover/justificar anon |
| `aoe_user_owns_student` | `(uuid)` | SECURITY DEFINER | `public` | `anon`, `authenticated`, `service_role` | `alunos` | MEDIUM por grant anon | Confirmar necessidade |
| `processar_encerramento_automatico_aluno` | completa | SECURITY DEFINER | `public` | `service_role` | `alunos`, `acompanhamento_eventos` | MEDIUM | Manter service role e testar segredo Edge |
| `set_workout_templates_updated_at` | `()` | invoker | nao explicito | `anon`, `authenticated`, `service_role` | `workout_templates` | LOW | Considerar revokes, embora uso seja trigger |

Nenhuma funcao privilegiada sem `search_path` explicito foi localizada entre funcoes `SECURITY DEFINER`. A trigger function nao e `SECURITY DEFINER`, mas nao declara `search_path`.

## Auditoria de Grants e Revokes

- `USAGE ON SCHEMA public` para `postgres`, `anon`, `authenticated`, `service_role` aparece no dump e e comum em ambientes Supabase.
- Tabelas publicas possuem `GRANT ALL` para `anon`, `authenticated` e `service_role`. Com RLS habilitado, isso nao equivale automaticamente a exposicao total, mas deve ser revisado para baseline minima.
- Funcoes sensiveis revogam `PUBLIC` antes dos grants na maioria dos casos.
- `set_workout_templates_updated_at()` nao possui `REVOKE ALL FROM PUBLIC` visivel antes dos grants.
- `aoe_idempotency_get_or_create` e `aoe_user_owns_student` possuem grants para `anon`.
- Default privileges concedem `ALL` em sequences, functions e tables para `anon`, `authenticated` e `service_role`.

## Riscos

- Baseline reproduzir grants runtime amplos sem revisao.
- Baseline ignorar overloads runtime e quebrar consumidores antigos, ou reproduzi-los sem necessidade.
- Policies de Git mais fracas que runtime se tornarem baseline por engano.
- Storage ficar incompleto por dump public nao conter objetos `storage`.

## Recomendacoes

1. Antes da baseline, executar catalog queries read-only para `pg_proc`, `pg_policy`, `information_schema.role_table_grants`, `storage.buckets` e `storage.objects` policies.
2. Decidir destino dos overloads administrativos antigos.
3. Alinhar grants de funcoes AOE e admin entre Git e runtime.
4. Usar as policies runtime mais restritivas como referencia quando forem intencionais.
5. Nao reproduzir default privileges amplos sem decisao explicita.

## Conclusao

O runtime corresponde ao repositorio nas tabelas, indices, constraints principais, RLS habilitado e trigger. Ainda assim, ha drift alto em funcoes privilegiadas, grants e algumas policies. A baseline nao deve comecar antes de um ciclo de resolucao orientado por catalog queries adicionais e decisoes explicitas.
