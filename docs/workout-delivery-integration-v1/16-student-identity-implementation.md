# Ciclo 1.7 - Implementacao do contrato de identidade do aluno

## Banco

Migration criada: `supabase/migrations/20260730090000_student_identity_contract.sql`.

Alteracoes principais:

- `public.alunos.student_user_id uuid`
- comentario explicito em `alunos.user_id` como dono profissional
- FK `alunos_student_user_id_fkey` para `auth.users(id) on delete set null`
- indice unico parcial `alunos_student_user_id_uidx`
- indice de busca `alunos_student_user_id_idx`
- check de `public.perfis.role` expandido para `admin`, `user` e `student`

## RPCs

`vincular_aluno_usuario`:

- exige sessao autenticada
- trava o aluno por `id` e `user_id = auth.uid()`
- valida perfil `student` ativo
- bloqueia uso da conta do proprio profissional como aluno
- bloqueia troca silenciosa de conta ja vinculada
- bloqueia reaproveitamento da mesma conta em outro aluno

`desvincular_aluno_usuario`:

- exige sessao autenticada
- autoriza somente o profissional dono
- limpa `student_user_id`

`get_my_student_workouts`:

- exige sessao autenticada
- resolve o aluno por `student_user_id = auth.uid()`
- retorna vazio quando nao ha vinculo
- retorna somente `active` e `completed`
- projeta explicitamente campos permitidos

## Baseline

O baseline fonte foi sincronizado em:

- `supabase/baseline-src/02-tables.sql`
- `supabase/baseline-src/03-constraints.sql`
- `supabase/baseline-src/04-indexes.sql`
- `supabase/baseline-src/05-functions.sql`
- `supabase/baseline-src/09-grants.sql`

`08-policies.sql` nao foi alterado porque a leitura do aluno e feita por RPC minimizada, nao por policy direta nas tabelas base.

## Quality gates

Scripts adicionados:

- `scripts/validate-student-identity-contract.mjs`
- `scripts/validate-student-workout-rls.mjs`
- `scripts/validate-student-workout-data-minimization.mjs`
- `scripts/validate-student-account-linking.mjs`

Scripts NPM adicionados:

- `qa:student-identity-contract`
- `qa:student-workout-rls`
- `qa:student-workout-data-minimization`
- `qa:student-account-linking`

QAs legadas foram ajustadas apenas para aceitar a nova migration autorizada e os arquivos `baseline-src` correspondentes.
