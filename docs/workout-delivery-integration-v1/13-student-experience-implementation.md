# Ciclo 1.7 - Etapa 4 - Implementacao da experiencia do aluno

## Resultado

Implementacao funcional bloqueada por `BLOCKED_STUDENT_IDENTITY_CONTRACT`.

## Motivo

A aplicacao ainda nao possui um contrato seguro que relacione `auth.uid()` de um usuario aluno a um registro em `public.alunos`. O campo `alunos.user_id` pertence ao profissional dono do cadastro. As policies de treino tambem autorizam leitura por `treinos.user_id = auth.uid()`, isto e, pelo profissional.

## O que nao foi implementado

- Rota `/aluno/treinos`.
- Rota `/aluno/treinos/:treinoId`.
- `useStudentWorkouts`.
- Service de leitura do aluno.
- Componentes `StudentWorkout*`.
- QAs da Etapa 4.
- Alteracoes em `package.json`.

Esses itens dependem do contrato de identidade e RLS do aluno para nao criar autorizacao improvisada no frontend.

## Requisitos para desbloqueio

Para uma proxima rodada, implementar primeiro uma alteracao de backend revisada:

- vinculo explicito entre usuario autenticado e aluno;
- policy ou RPC de leitura somente para treinos `active` e `completed` do aluno;
- exclusao de `draft` e `archived` da visao padrao;
- payload minimizado sem snapshot tecnico ou chave de idempotencia;
- validacao multiusuario local.

## Impacto

- Supabase: sem diff nesta rodada.
- Financeiro: sem diff.
- Package lock: sem diff.
- UI profissional: sem alteracao.
