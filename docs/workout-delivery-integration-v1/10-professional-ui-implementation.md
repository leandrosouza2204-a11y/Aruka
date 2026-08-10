# Ciclo 1.7 - Etapa 3 - Interface profissional

## Entrada

- Branch: `feat/workout-delivery-integration-v1`.
- Etapa 1 aprovada com `READY_FOR_SERVICE_INTEGRATION`.
- Etapa 2 commitada em `bcb7757 feat: integra aplicação e entrega de treinos`.
- Decisão herdada: `READY_WITH_UI_RUNTIME_LIMITATION`.
- Limitação herdada: `UI_RUNTIME_AUTHENTICATED_PENDING`.

Os documentos solicitados `08-service-integration-implementation.md` e `09-service-integration-validation.md` não existem no repositório. A fonte equivalente encontrada e lida foi `docs/workout-delivery-integration-v1/08-service-integration.md` e os relatórios `service-integration.md` / `service-integration-result.json`.

## Interface implementada

- `WorkoutLifecycleBadge` apresenta `draft`, `active`, `completed` e `archived` com texto em português, contraste e fallback.
- `workoutLifecyclePresentation.js` centraliza labels, descrições, ações permitidas, data relevante, origem e mapeamento de erro.
- `WorkoutLifecycleActions` renderiza somente ações válidas por estado.
- `WorkoutLifecycleConfirmationModal` confirma entrega, conclusão e arquivamento, mantendo erro/loading dentro do modal.
- `WorkoutOriginLabel` apresenta `Modelo oficial`, `Modelo pessoal` ou `Criação manual`.
- `TreinosCards` usa badge canonico, data relevante e acao principal contextual.
- `TreinoDetalhesModal` exibe estado, origem e datas de aplicação, entrega, conclusão e arquivamento.
- `TreinosFilters` migrou o filtro visual para lifecycle: Todos, Em revisão, Ativos, Concluídos, Arquivados.

## Exclusão legada

A ação visível de exclusão física foi removida dos cards do novo ciclo. O fluxo profissional passa a oferecer arquivamento para `draft`, `active` e `completed`. A função legada permanece no hook por compatibilidade, sem ser usada como arquivamento silencioso.

## Fora de escopo preservado

Sem portal/login do aluno, execução, diário, RPE/RIR, feedback, notificações, WhatsApp automático, progressão, gráficos, financeiro ou Supabase.
