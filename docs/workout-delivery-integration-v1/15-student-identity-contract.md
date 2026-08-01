# Ciclo 1.7 - Contrato de identidade e autorizacao do aluno

## Decisao de entrada

- Branch: `feat/workout-delivery-integration-v1`.
- Auditoria bloqueada registrada no commit `71297a3 docs: registra bloqueio de identidade do aluno`.
- Escopo permitido: banco, RLS/RPC, services auxiliares de contrato, QAs e documentacao.
- Escopo proibido nesta etapa: rotas, telas, componentes ou experiencia visual do aluno.

Entrada tecnica registrada: `READY_FOR_STUDENT_IDENTITY_CONTRACT`.

## Modelo adotado

O contrato minimo usa `public.alunos.student_user_id uuid` como vinculo explicito entre uma conta autenticada Supabase e um registro de aluno.

O campo existente `public.alunos.user_id` permanece como dono profissional e limite de tenant para operacoes do personal. Ele nao passa a representar o aluno.

`student_user_id` e nulo por padrao, unico quando preenchido e referencia `auth.users(id)` com `on delete set null`.

## Perfil do aluno

`public.perfis.role` passa a aceitar `student`, alem de `admin` e `user`.

O vinculo so aceita uma conta cujo perfil exista, esteja com `role = 'student'` e `status = 'ativo'`.

## Operacoes

Foram definidos tres RPCs com `security definer` e `set search_path = public`:

- `public.vincular_aluno_usuario(p_aluno_id uuid, p_student_user_id uuid)`
- `public.desvincular_aluno_usuario(p_aluno_id uuid)`
- `public.get_my_student_workouts()`

As operacoes de vinculo exigem que `auth.uid()` seja o profissional dono do aluno. A leitura do aluno nao recebe IDs arbitrarios: a identidade e sempre derivada de `auth.uid()` via `alunos.student_user_id`.

## Leitura minimizada

`get_my_student_workouts()` retorna somente treinos `active` e `completed` do aluno vinculado.

O payload exposto ao aluno contem dados de prescricao: aluno, treinos ativos, treinos concluidos, dias e exercicios. Campos operacionais internos nao entram no contrato, incluindo `template_origin_snapshot`, `application_idempotency_key`, eventos administrativos e campos de autoria profissional.

## RLS e superficie de dados

Nao foi criada policy direta de `SELECT` para aluno nas tabelas base de treinos. Como essas tabelas possuem grants para `authenticated`, uma policy direta permitiria leitura de linhas inteiras pelo cliente e quebraria a minimizacao.

A leitura do aluno fica encapsulada na RPC minimizada. Essa e a fronteira segura ate a futura interface do aluno consumir um service dedicado.

## Limitacao assumida

Esta etapa nao cria fluxo de convite, cadastro ou provisionamento de conta do aluno. A criacao/alteracao do perfil `student` permanece fora do fluxo visual e devera ser tratada em etapa posterior.
