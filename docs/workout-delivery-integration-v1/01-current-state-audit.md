# Ciclo 1.7 - Auditoria do estado atual

## Objetivo

Auditar o fluxo atual de criacao, aplicacao de modelos, associacao com aluno, entrega implicita, visualizacao e acompanhamento de treinos para definir o contrato do Ciclo 1.7 sem alterar codigo funcional.

## Estado inicial

- Branch inicial: `chore/workout-library-mobile-flow-v1-closeout`.
- Working tree inicial: limpo por `git status --short`.
- Ultimo commit inicial: `0e37bfd docs: encerra ciclo 1.6 da biblioteca de treinos`.
- Remote: `origin https://github.com/leandrosouza2204-a11y/Aruka.git`.
- `main` sincronizada por fast-forward de `dead2f6` para `4b63542`.
- Closeout do Ciclo 1.6 confirmado pela PR #30, branch `chore/workout-library-mobile-flow-v1-closeout`, merge em `2026-07-28T01:52:59Z`, merge commit `4b63542cb9a1161ded03b635158b7c6de9700b81`.
- Branch do Ciclo 1.7 criada: `feat/workout-delivery-integration-v1`.

## Documentos auditados

- `docs/roadmap-v2/13-epic-progress-dashboard.md`: Epic 1 em 6/8, 75%, Ciclo 1.7 como proximo.
- `docs/workout-library-mobile-flow-v1-closeout/01-closeout.md`: define o objetivo preliminar do Ciclo 1.7 como integracao com entrega e acompanhamento do aluno.
- `reports/workout-library-mobile-flow-v1-closeout/result.json`: registra Ciclo 1.6 como `COMPLETE_WITH_LIMITATIONS` e Supabase inalterado.
- `reports/workout-library-mobile-flow-v1-closeout/summary.md`: reforca limitacoes de runtime autenticado e proximo ciclo.
- Auditorias anteriores relevantes: `docs/workout-library-audit-v1/01-functional-map.md`, `docs/workout-library-audit-v1/02-technical-map.md`, `docs/workout-library-audit-v1/03-data-contracts.md`, `docs/workout-library-audit-v1/04-security-review.md`, `reports/workout-template-guided-application-v1/result.json`.

## Rotas e paginas

| Rota | Pagina | Perfil autorizado | Finalidade | Dependencias | Relacao com 1.7 | Observacoes |
| --- | --- | --- | --- | --- | --- | --- |
| `/login` | `src/auth/Login.jsx` | Publica | Autenticacao | Supabase Auth | Entrada indireta | Sem experiencia de aluno separada. |
| `/dashboard` | `src/pages/Dashboard.jsx` | Autenticado, assinatura e aceite | Painel geral | `ProtectedRoute`, `SubscriptionRoute`, `LegalRoute` em `src/App.jsx:82` | Pode apontar indicadores futuros | Nao e fluxo de entrega. |
| `/alunos` | `src/pages/Alunos.jsx` | Autenticado, assinatura e aceite | Lista e detalhes de alunos | `AlunosList` em `src/features/alunos/components/AlunosList.jsx` | Origem contextual para treinos | Detalhes tem CTA `Ver treinos` para `/treinos?alunoId=...` em `AlunosList.jsx:455`. |
| `/treinos` | `src/pages/Treinos.jsx` | Autenticado, assinatura e aceite | CRUD, biblioteca e aplicacao de modelos | `TreinosList`, `useTreinosPage`, `TreinoModal`, `TreinoTemplatesModal` | Rota central do Ciclo 1.7 | Definida em `src/App.jsx:152`; protegida por `ProtectedRoute`, `SubscriptionRoute`, `LegalRoute`. |
| `/avaliacoes` | `src/pages/Avaliacoes.jsx` | Autenticado, assinatura e aceite | Avaliacoes fisicas | `avaliacoesService` | Apenas acompanhamento corporal | Nao registra execucao de treino. |
| `/financeiro` | `src/pages/Financeiro.jsx` | Autenticado, assinatura e aceite | Pagamentos e acompanhamento financeiro | `pagamentosService`, `useFinanceiroPage` | Impacto deve ser evitado | Usa `alunos.acompanhamento_status`; nao e status de treino. |
| `/admin/usuarios` | `src/pages/AdminUsuarios.jsx` | Admin | Gestao de usuarios | `AdminRoute` em `src/auth/AdminRoute.jsx` | Perfil admin | Nao ha admin operando entrega de treino. |
| `/admin/logs` | `src/pages/AdminLogs.jsx` | Admin | Logs administrativos | `adminLogsService` | Auditoria administrativa | Nao registra entrega de treino hoje. |

Nao existe rota comprovada de portal do aluno, detalhe publico de treino por aluno, historico de execucao ou acompanhamento de sessao.

## Componentes

| Componente | Responsabilidade | Props/estado | Hooks/servicos | Entidades | Mobile | Risco/Reuso |
| --- | --- | --- | --- | --- | --- | --- |
| `src/features/treinos/components/TreinosList.jsx` | Orquestra pagina, filtros, contexto, cards, detalhes e modais | Recebe estado de `useTreinosPage`; controla abertura de detalhes | `useTreinosPage` | treinos, alunos, modelos pessoais | Cards mobile e contexto responsivo documentados em classes/test ids | Reutilizavel como casca; concentra muitos fluxos. |
| `src/components/TreinoModal.jsx` | Editor de treino, dias e exercicios | `alunos`, `treino`, `onSave`, `onSaveTemplate`; estado local normalizado | `validateTreinoEditorState`, `TreinoSalvarModeloModal`, toast | treino, dias, exercicios, aluno | Modal com scroll e ajustes do Ciclo 1.6 | Bom para revisao antes da entrega, mas hoje salvar equivale a persistir. |
| `src/features/treinos/components/TreinoTemplatesModal.jsx` | Wizard de modelos oficiais/pessoais | `alunos`, `alunoContextual`, `modelosPessoais`, callbacks de apply/generate/manage | `buildWorkoutTemplateApplicationPreview`, `submitWorkoutTemplateApplicationOnce` | modelo, aluno, treino gerado | CSS especifico em `src/index.css:191` e media queries em `src/index.css:792` | Ja seleciona aluno e aplica modelo; falta entrega explicita. |
| `src/features/treinos/components/TreinoSalvarModeloModal.jsx` | Criar/editar/duplicar modelo pessoal | `treino`, `modelo`, `modo`, `onSubmit` | personal template utils | `workout_templates` | Modal ajustado pelo Ciclo 1.6 | Reutilizavel para preservar independencia de modelos. |
| `src/features/treinos/components/TreinosCards.jsx` | Lista/cards de treinos com status e acoes | `treinos`, callbacks visualizar/editar/duplicar/excluir | `classeStatusTreino` | treinos | Usa `data-testid="treino-mobile-card"` | Pode listar entregues/ativos, mas status atual e limitado. |
| `src/features/treinos/components/TreinoDetalhesModal.jsx` | Visualizacao de treino selecionado | `treino`, `onEnviarWhatsApp`, `onFechar` | `formatarData`, status helper | treino, dias, exercicios | Detalhes responsivos | E visualizacao do profissional, nao do aluno. |
| `src/features/alunos/components/AlunosList.jsx` | Cadastro, lista e detalhes do aluno | Estado de `useAlunosPage` | `buscarTreinosPorAlunoSupabase`, resumo operacional | aluno, treino, avaliacao, financeiro | Cards mobile e detalhes responsivos | Bom ponto de entrada por aluno; nao entrega treino. |
| `src/components/MobileBottomNavigation.jsx` e `src/components/Sidebar.jsx` | Navegacao principal | perfil admin para menus admin | `buscarPerfilUsuario` | perfil | Mobile bottom nav | Nao tem item de portal do aluno. |

## Hooks, servicos e utilities

| Item | Funcoes | Entrada/saida | Tabelas | Autorizacao implicita | Uso no 1.7 |
| --- | --- | --- | --- | --- | --- |
| `src/features/treinos/hooks/useTreinosPage.js` | `carregarDados`, `salvarTreino`, `aplicarModeloTreino`, `duplicarTreino`, filtros | UI -> services -> estado | `treinos`, `workout_templates`, `alunos` | Busca usuario no service; filtros por `user_id` | Principal orquestrador do fluxo. |
| `src/services/treinosService.js` | `buscarTreinosSupabase`, `buscarTreinosPorAlunoSupabase`, `adicionarTreinoSupabase`, `atualizarTreinoSupabase`, `excluirTreinoSupabase` | Payload normalizado -> RPC/queries -> treino | `treinos`, `treino_dias`, `treino_exercicios`, `alunos` | `.eq("user_id", user.id)` e RPC com `auth.uid()` | Precisa evoluir para origem, entrega e status. |
| `src/features/treinos/utils/workoutTemplateApplication.js` | preview, validacao, payload, idempotencia em memoria | modelo + aluno -> treino | Indireto | Valida aluno presente; banco valida ownership | Base para aplicar modelo. |
| `src/features/treinos/utils/workoutDataContract.js` | status, normalizacao, canonical template, payload | treino/modelo -> formatos canonicos | Indireto | Sem RLS; contrato local | Deve receber estados propostos se aprovado. |
| `src/services/workoutTemplatesService.js` | CRUD modelos pessoais | draft -> `workout_templates` | `workout_templates` | owner via `auth.uid()` | Isola modelos pessoais. |
| `src/features/alunos/hooks/useAlunosPage.js` | contexto e resumo operacional | aluno -> links e resumos | `alunos`, `treinos`, `avaliacoes`, `pagamentos` | services por usuario | Ponto de navegacao contextual. |
| `src/services/authSessionService.js` | `buscarUsuarioLogado` | Supabase user | Auth | exige usuario autenticado | Base para autoria. |

## Fluxo atual de criacao de treino

1. Usuario entra em `/treinos`, protegido por `src/App.jsx:152`.
2. `TreinosList` chama `useTreinosPage` (`src/features/treinos/components/TreinosList.jsx:15`).
3. `useTreinosPage.carregarDados` busca alunos, treinos e modelos pessoais em paralelo (`useTreinosPage.js:142`).
4. `abrirNovoTreino` cria base contextual com aluno se houver `alunoId` na URL (`useTreinosPage.js:180`).
5. `TreinoModal` valida aluno, rotina, dias e exercicios antes de chamar `onSave` (`src/components/TreinoModal.jsx:293`).
6. `salvarTreino` exige aluno cadastrado na lista local (`useTreinosPage.js:301`).
7. `adicionarTreinoSupabase` chama RPC `salvar_treino_composto` (`src/services/treinosService.js:79`).
8. A RPC valida `auth.uid()`, aluno, status, dias e exercicios, grava treino, apaga/recria dias em update e insere exercicios (`supabase/baseline-src/05-functions.sql:559`).
9. A UI recarrega dados, seleciona treino e mostra toast de sucesso (`useTreinosPage.js:326`).

Diagrama textual:

`/treinos` -> `TreinosList` -> `useTreinosPage.salvarTreino` -> `treinosService.adicionarTreinoSupabase/atualizarTreinoSupabase` -> `rpc salvar_treino_composto` -> `treinos/treino_dias/treino_exercicios` -> recarrega lista -> seleciona treino.

## Fluxo atual de aplicacao de modelo

1. Usuario abre biblioteca por `TreinosHeader`/`TreinosList`.
2. `TreinoTemplatesModal` lista oficiais de `src/data/treinosModelos.js` e pessoais de `workout_templates`.
3. Wizard seleciona genero, divisao, origem, modelo, aluno e preview.
4. `buildWorkoutTemplateApplicationPreview` normaliza e valida modelo/aluno (`workoutTemplateApplication.js:22`).
5. `submitWorkoutTemplateApplicationOnce` evita submissao simultanea no modal (`workoutTemplateApplication.js:127`).
6. `useTreinosPage.aplicarModeloTreino` chama `prepareWorkoutTemplateApplicationPayload` e persiste via `adicionarTreinoSupabase` (`useTreinosPage.js:220`).
7. O treino criado e independente em registros relacionais novos, porque a RPC gera novos UUIDs de treino/dia/exercicio; o modelo original nao e alterado.

Classificacao: copia independente para estrutura persistida, mas rastreabilidade persistida e parcial/inexistente. `src/data/treinosModelos.js:247` coloca `templateId` no objeto em memoria; `workoutToPersistencePayload` nao persiste esse campo no schema atual, e `public.treinos` nao possui coluna de origem em `supabase/baseline-src/02-tables.sql:199`.

## Fluxo atual de atribuicao e entrega

- A associacao ao aluno acontece antes de salvar/aplicar por `alunoId` (`TreinoModal` e `TreinoTemplatesModal`).
- A RPC bloqueia treino sem aluno (`WORKOUT_STUDENT_REQUIRED`) em `supabase/baseline-src/05-functions.sql:582`.
- Nao existe etapa posterior de atribuicao comprovada.
- Nao existe acao explicita de entregar/publicar.
- Salvar/aplicar disponibiliza o registro como treino persistido imediatamente, com status default `Ativo` ou `Em revisao`.
- Nao ha notificacao, data de entrega, responsavel pela entrega, prevencao de duplicidade ou limite de treinos ativos comprovados.

## Experiencia atual do aluno

Nao ha experiencia de aluno implementada como portal separado. As rotas autenticadas sao da operacao do profissional/admin (`src/App.jsx:80-197`), e `AdminRoute` so separa administradores (`src/auth/AdminRoute.jsx:5`). O aluno existe como entidade `public.alunos`, nao como usuario autenticado proprio. A visualizacao atual de treino e do profissional em `TreinoDetalhesModal`, com opcao de copiar para WhatsApp (`useTreinosPage.js:440`).

## Acompanhamento e historico

- Existe acompanhamento financeiro/operacional do aluno em `alunos.acompanhamento_status` e `acompanhamento_eventos` (`supabase/baseline-src/02-tables.sql:29` e `237`).
- `AlunosList` mostra resumo operacional com indicador de treino (`src/features/alunos/components/AlunosList.jsx:439`).
- Nao existem tabelas de sessao executada, exercicio concluido, carga realizada, RPE, RIR, feedback do aluno ou historico de alteracao de treino.
- `treino_exercicios` guarda prescricoes de `carga`, `series`, `repeticoes`, `descanso`, `observacoes` e `video_url` (`supabase/baseline-src/02-tables.sql:223`), mas nao execucao.

## Mobile

O Ciclo 1.6 validou e ajustou fluxo mobile da biblioteca com limitacoes de runtime. Evidencias: `docs/workout-library-mobile-flow-v1-closeout/01-closeout.md` e CSS de modais/modelos em `src/index.css:191`, com media queries em `src/index.css:792`. O novo fluxo 1.7 deve revalidar 320 px porque entrega, estados e portal do aluno ainda nao existem.

## Lacunas principais

- Sem entrega explicita/publicacao.
- Sem `draft/completed/archived`; estados atuais sao `Ativo`, `Em revisao`, `Finalizado`.
- Sem `delivered_at`, `delivered_by` ou datas de vigencia completas.
- Sem origem persistida do modelo aplicado.
- Sem portal/rota de aluno.
- Sem acompanhamento de execucao.
- Sem idempotencia persistida para aplicacao de modelo.
- Sem prevencao de multiplos treinos ativos conflitantes.

## Conclusao

O sistema possui base suficiente para iniciar o Ciclo 1.7: selecao de aluno, aplicacao guiada de modelo, copia independente por RPC atomica, CRUD de treinos e isolamento por usuario. A implementacao deve comecar por contrato de dados e autorizacao, pois entrega, rastreabilidade persistida, status semantico e experiencia do aluno ainda nao existem.
