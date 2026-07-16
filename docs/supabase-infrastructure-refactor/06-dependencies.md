# Mapa de Dependencias

Formato: Tabela -> Trigger -> Function -> Policy.

| Objeto | Trigger | Funcoes dependentes | Policies dependentes |
| --- | --- | --- | --- |
| `auth.users` | N/A | funcoes admin, AOE ownership, varias FKs | policies baseadas em `auth.uid()` indiretamente |
| `public.alunos` | N/A | `processar_encerramento_automatico_aluno`, `aoe_user_owns_student` | policies de `pagamentos`, `avaliacoes`, `anamneses`, `treinos`, `treino_dias`, `treino_exercicios`, `aoe_decisions` dependem de propriedade direta/indireta |
| `public.planos` | N/A | Edge `processar-encerramentos-automaticos` consulta planos | policies proprias por `user_id`; FK em `acompanhamento_eventos` |
| `public.pagamentos` | N/A | servicos financeiros da aplicacao | policies proprias validam `aluno_id` em `alunos` |
| `public.perfis` | N/A | `admin_eh_admin`, `admin_listar_*`, RPCs admin, Edge `aoe`, Edge `transfer-user-access` | policies de `admin_logs`, `aoe_*` usam admin via funcao |
| `public.assinaturas` | N/A | `admin_listar_usuarios`, `admin_upsert_assinatura`, `admin_liberar_assinante` | policies proprias por `user_id` |
| `public.admin_logs` | N/A | `admin_registrar_log`, `admin_listar_logs`, Edge `transfer-user-access` | admin select; insert comum negado |
| `public.aceites_legais` | N/A | `legalService` | policies proprias por `user_id` |
| `public.avaliacoes` | N/A | `avaliacoesService`, fotos armazenam URLs | policies proprias por `user_id`; Storage complementa fotos |
| `public.anamneses` | N/A | `anamnesesService` | policies proprias por `user_id` |
| `public.treinos` | N/A | `treinosService`, scripts QA | policies proprias; policies de dias/exercicios fazem join |
| `public.treino_dias` | N/A | `treinosService` | policies dependem de `treinos.user_id` |
| `public.treino_exercicios` | N/A | `treinosService` | policies dependem de `treino_dias -> treinos.user_id` |
| `public.acompanhamento_eventos` | N/A | `processar_encerramento_automatico_aluno`, Edge de encerramentos, indicadores | policies proprias por `user_id` |
| `public.workout_templates` | `set_workout_templates_updated_at` | `set_workout_templates_updated_at`, `workoutTemplatesService`, scripts QA | policies por `owner_id`, `is_system=false`, `is_active=true` |
| `public.aoe_decisions` | N/A | Edge `aoe`, repositorios `src/aoe/infrastructure/persistence`, `aoe_user_owns_student` indiretamente | policies de decisions; policies de traces/reviews fazem lookup em decisions |
| `public.aoe_decision_traces` | N/A | Edge/infra AOE | policy consulta `aoe_decisions` |
| `public.aoe_human_reviews` | N/A | Edge/infra AOE | policies consultam `aoe_decisions` |
| `public.aoe_idempotency_keys` | N/A | `aoe_idempotency_get_or_create`, infra AOE | policy por `actor_id` ou admin |
| `public.aoe_audit_events` | N/A | Edge `aoe`, infra audit recorder | policy somente admin |
| `storage.objects` / `avaliacoes-fotos` | N/A | `avaliacoesFotosService` | policies por bucket e pasta `auth.uid()` |

## Dependencias Cruzadas Criticas

- `public.perfis` e a raiz das autorizacoes admin (`admin_eh_admin`) e tambem das Edge Functions administrativas.
- `public.alunos` e a raiz de isolamento de dados para pagamentos, avaliacoes, anamneses, treinos e AOE.
- `public.aoe_decisions` e a raiz de autorizacao para traces e reviews AOE.
- `storage.objects` depende de convencao de path; se o upload nao usar `user_id` como primeira pasta, a policy bloqueia acesso.
