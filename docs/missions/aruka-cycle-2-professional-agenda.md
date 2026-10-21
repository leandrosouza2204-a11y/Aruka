# Missão Aruka — Ciclo 2/3: Agenda Profissional

## Estado retomável

- Branch integrada: `feat/cycle-2-professional-agenda`
- Base: `a030ee1` (PR #159, Ciclo 1/3)
- PR: #160
- Commit da funcionalidade: `050d276`
- Merge commit: `af06171`
- CI pós-merge: `39549096286` — sucesso em todos os Gates 1–9
- Custo recorrente adicional: R$ 0,00
- Produção e Supabase Cloud: não acessados nem modificados
- G1 — Diagnóstico e arquitetura: concluído
- G2 — Modelo de dados e migrations: concluído
- G3 — Regras de negócio e persistência: concluído
- G4 — Interface desktop: concluído
- G5 — Interface mobile: concluído
- G6 — Testes e QA: concluído
- G7 — PR, CI e merge: concluído
- G8 — Pós-merge, cleanup e handoff: concluído

## Arquitetura

A Agenda é um módulo administrativo independente, protegido pelas mesmas rotas de autenticação, assinatura, aceite legal e perfil profissional do restante do Aruka. A implementação não adiciona dependências nem serviços externos.

As recorrências usam ocorrências materializadas. Cada série é limitada a 366 ocorrências e a um horizonte de 730 dias, o que mantém consultas por intervalo simples e previsíveis. Alterações e cancelamentos individuais geram exceções persistidas; alterações futuras da série preservam ocorrências já excepcionadas.

As mutações são RPCs transacionais `SECURITY INVOKER`. Conflitos são protegidos no PostgreSQL por uma exclusion constraint de intervalo, além da validação amigável nas funções. O `client_request_id` fornece idempotência contra duplicações acidentais.

## Modelo de dados

Migration: `supabase/migrations/20261021001403_professional_agenda.sql`

- `agenda_series`: definição e limites da recorrência.
- `agenda_compromissos`: ocorrências materializadas, horários, tipo e status.
- `agenda_participantes`: relação N:N entre compromissos e alunos.
- `agenda_excecoes`: alterações e cancelamentos individuais da série.

Todas as tabelas têm RLS habilitada, políticas por profissional, grants explícitos para a Data API e índices de consulta por intervalo. Um trigger impede vincular aluno de outro profissional e outro mantém a consistência entre série e ocorrência.

## Contratos para o Ciclo 3

O serviço `src/services/agendaService.js` expõe, sem acoplar o dashboard à tela de Agenda:

- `buscarCompromissosDoDia(data)`
- `buscarProximosAtendimentos(limite)`
- `buscarResumoAgenda(data)`

Esses contratos retornam ocorrências já materializadas e participantes em lote, evitando N+1. O card definitivo da Agenda no dashboard não foi implementado neste ciclo.

### Handoff de integração

- Rota administrativa: `/agenda`, protegida por autenticação, assinatura, aceite legal e perfil profissional.
- Navegação: item direto na sidebar desktop e item Agenda dentro de Mais no mobile.
- Componentes reutilizáveis: `AgendaCalendar`, `AgendaEventCard`, `AgendaDetailsModal` e os utilitários de data/fuso em `agendaDate.js`.
- Agenda de hoje: `buscarCompromissosDoDia(dateKey)` recebe a data local `YYYY-MM-DD` e devolve as ocorrências do profissional com participantes já agregados.
- Próximos atendimentos: `buscarProximosAtendimentos(startIso, limit)` aceita um instante ISO e limite explícito.
- Resumo: `buscarResumoAgenda(dateKey)` fornece total, atendimentos e pendências do dia sem acoplar o dashboard ao componente de tela.

## Pendências técnicas reais

- O card definitivo da Agenda no dashboard pertence ao Ciclo 3 e permanece intencionalmente fora deste escopo.
- Agendamento pelo aluno, notificações, cobrança por sessão e integrações externas continuam fora do produto entregue.
- O workflow registrou apenas avisos de manutenção futura do runner do GitHub Actions (`actions/*@v4` migrando de Node 20 e `ubuntu-latest` migrando para Ubuntu 26); não houve falha funcional ou de segurança.

## Validações executadas

- `npm run qa:agenda`: PASS — validação estática, domínio de datas/fuso e rota protegida.
- `npm run qa:agenda:runtime`: PASS — 24 testes pgTAP de CRUD, idempotência, conflito, recorrência, exceções, participantes, status, RLS e isolamento.
- `npm run qa:agenda:responsive`: PASS — 320, 360, 375, 390, 412, 430, 1280 e 1440 px; Dia no mobile, Semana no desktop, menu Mais, modal, teclado virtual e zero overflow horizontal.
- `npm run supabase:bootstrap`: PASS — 42 migrations executáveis e bootstrap efêmero reproduzível.
- `npm run supabase:validate`: PASS — runtime local validado.
- `npx supabase db lint --local --schema public --level warning --fail-on error`: PASS; permaneceu somente um aviso preexistente em `admin_list_student_experience_events`.
- `npm run lint`: PASS.
- `npm run build`: PASS.
- `node scripts/validate-ci-repository-safety.mjs`: PASS.
- `git diff --check`: PASS.

O setup visual local confirmou o usuário sintético e o acesso autenticado. A etapa auxiliar preexistente `setup-local-qa-data` continuou registrando `permission denied for function is_valid_workout_tracking_config`; isso não afeta a Agenda, cujos testes transacionais e QA autenticado foram concluídos.

## QA visual

Durante a inspeção das capturas foram corrigidos dois problemas antes do gate final:

- modal mobile maior que o viewport por conflito entre `100dvh` e o padding global do overlay;
- conteúdo desktop sob a sidebar fixa, cortando a primeira coluna semanal.

O auditor reproduzível está em `scripts/validate-cycle-2-agenda-responsive.mjs`. As capturas ficam em `tmp-responsive-screenshots/cycle-2-agenda/`, diretório ignorado pelo Git.
