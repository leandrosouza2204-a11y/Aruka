# Ciclo 1.7 - Validacao do contrato de identidade do aluno

## Resultado

Decisao: `READY_WITH_LOCAL_STORAGE_BOOTSTRAP_LIMITATION`.

O contrato backend de identidade do aluno foi implementado e validado por QAs estaticas, baseline, preflight local, lint e build. A execucao de `supabase db reset` chegou ao bootstrap do banco, mas falhou por container local de Storage `unhealthy`, nao por erro SQL reportado da migration.

## Validacoes aprovadas

- `npm.cmd run supabase:preflight`
- `npm.cmd run qa:student-identity-contract`
- `npm.cmd run qa:student-workout-rls`
- `npm.cmd run qa:student-workout-data-minimization`
- `npm.cmd run qa:student-account-linking`
- `npm.cmd run qa:supabase-baseline-src`
- `npm.cmd run qa:workout-delivery-contract`
- `npm.cmd run qa:workout-delivery-data`
- `npm.cmd run qa:workout-delivery-authorization`
- `npm.cmd run qa:workout-delivery-service-integration`
- `npm.cmd run qa:workout-delivery-idempotency`
- `npm.cmd run qa:workout-delivery-lifecycle`
- `npm.cmd run qa:workout-delivery-professional-ui`
- `npm.cmd run qa:workout-delivery-responsive-ui`
- `npm.cmd run qa:workout-delivery-accessibility`
- `npm.cmd run qa:workout-template-sanitization`
- `npm.cmd run qa:workout-templates-data`
- `npm.cmd run qa:workout-template-discovery`
- `npm.cmd run qa:workout-template-guided-application`
- `npm.cmd run qa:personal-workout-template-management`
- `npm.cmd run qa:workout-library-mobile-flow`
- `node --test src/features/treinos/utils/*.test.js`

## Reset local

`npx.cmd supabase db reset` foi executado com Docker restaurado. O processo avancou por recriacao do banco e inicializacao do schema, mas terminou com:

`supabase_storage_ConsultoriaFitness container is not ready: unhealthy`

Classificacao: bloqueio de infraestrutura local de Storage no bootstrap, com preflight previamente aprovado.

## Garantias verificadas

- `auth.uid()` nao e inferido por frontend, URL, nome, email ou localStorage.
- `alunos.user_id` continua sendo o dono profissional.
- `alunos.student_user_id` e unico e opcional.
- A conta vinculada precisa ser `role = 'student'` e `status = 'ativo'`.
- A leitura do aluno nao recebe `aluno_id`, `treino_id` ou `user_id` arbitrario.
- Treinos retornados ao aluno se limitam a `active` e `completed`.
- O payload de aluno nao expoe `template_origin_snapshot`, `application_idempotency_key` ou eventos administrativos.
- Nenhuma rota, tela ou componente de aluno foi criado nesta etapa.

## Risco residual

Ainda falta validar em runtime multiusuario apos estabilizar o container local de Storage ou executar em ambiente local limpo. A proxima etapa de UI do aluno deve consumir apenas `get_my_student_workouts()` ou um service equivalente, sem consultar diretamente as tabelas base.
