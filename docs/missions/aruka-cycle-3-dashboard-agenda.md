# Missão Aruka — Ciclo 3/3: integração da Agenda ao Dashboard

## Estado recuperado

- Base: `main`/`origin/main` em `4fd244d`, incluindo o PR #160 (Agenda) e o PR #161 (handoff do Ciclo 2).
- Branch: `feat/cycle-3-dashboard-agenda-integration`.
- Worktree isolada: `.aruka-cycle3`.
- Alterações preexistentes da worktree principal e `.aruka-g42k-rc` preservadas.
- Custo recorrente adicional: R$ 0,00.

## Decisões de arquitetura

- Nenhuma alteração de schema: tabelas, RLS, ownership de alunos, funções `security invoker` e grants explícitos do Ciclo 2 permanecem como fonte de verdade.
- O Dashboard usa um hook próprio e uma leitura diária única, reaproveitada pelos contratos de compromissos do dia, próximos atendimentos e resumo.
- Falhas da Agenda são isoladas dos demais dados do Dashboard.
- Atualização em montagem, retorno de foco, visibilidade e evento de mutação; sem polling.
- O painel mostra no máximo três compromissos futuros ou em andamento. Encerrados permanecem na Agenda completa.
- Deep links abrem detalhes ou o formulário da Agenda; participantes levam à ficha contextual do aluno.

## Contratos e componentes

- Serviço: `buscarPainelAgendaHoje(dateKey, startIso, limit)` em `agendaService.js`.
- Hook: `useDashboardAgenda`.
- Componente: `DashboardTodayAgenda`.
- Domínio: `selecionarAgendaDeHoje` e `statusAgendaNoMomento`.
- Rotas: `/agenda`, `/agenda?compromisso=<id>`, `/agenda?novo=<AAAA-MM-DD>` e `/alunos?alunoId=<id>&origem=agenda`.

## Gates

- [x] Recuperação e isolamento do estado.
- [x] Compatibilidade da arquitetura e do Supabase.
- [x] Implementação funcional e estados de UI.
- [x] Testes estáticos, unitários, lint, build e regressões.
- [x] QA autenticado responsivo e funcional.
- [ ] PR, CI, merge, CI pós-merge e cleanup.

## Evidências locais

- `qa:cycle-3-dashboard-agenda`: PASS.
- `qa:cycle-3-dashboard-agenda:responsive`: PASS em 320, 360, 375, 390, 412, 430, 1024, 1366 e 1440 px; erro isolado e deep link de criação validados.
- `qa:agenda`, `qa:agenda:runtime` (24 cenários) e `qa:agenda:responsive`: PASS.
- `qa:cycle-1-dashboard-responsive`, auditoria autenticada completa do Dashboard e modal de pagamento do Ciclo 1: PASS.
- `qa:finance-mutation-confirmations` e `qa:finance-workflow-reliability`: PASS.
- `lint`, `build` e `git diff --check`: PASS.
- Aviso preexistente: o provisionador auxiliar de dados conclui alunos/planos/pagamentos antes de receber `permission denied for function is_valid_workout_tracking_config` na etapa de treino; não afeta Dashboard, Agenda nem a regressão financeira executada.
