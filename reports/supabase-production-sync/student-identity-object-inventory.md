# Student Identity Object Inventory

Migration: `supabase/migrations/20260730090000_student_identity_contract.sql`

Objects inventoried: `13`

| Type | Object | Signature | Purpose |
| --- | --- | --- | --- |
| column | `public.alunos.student_user_id` | `-` | Authenticated student identity link; nullable uuid. |
| comment | `public.alunos.user_id` | `-` | Documents user_id as professional owner. |
| comment | `public.alunos.student_user_id` | `-` | Documents student_user_id as authenticated student identity. |
| foreign_key | `public.alunos.alunos_student_user_id_fkey` | `-` | References auth.users(id) ON DELETE SET NULL. |
| unique_index | `public.alunos.alunos_student_user_id_uidx` | `-` | 1:1 non-null student account uniqueness. |
| index | `public.alunos.alunos_student_user_id_idx` | `-` | Lookup index for auth.uid() resolution. |
| check | `public.perfis.perfis_role_check` | `-` | Preserves admin/user and adds student role. |
| function | `public.vincular_aluno_usuario` | `uuid, uuid` | Professional links a student account to owned aluno. |
| function | `public.desvincular_aluno_usuario` | `uuid` | Professional clears student account link for owned aluno. |
| function | `public.get_my_student_workouts` | `-` | Student reads minimized active/completed workouts derived from auth.uid(). |
| grant | `public.vincular_aluno_usuario EXECUTE` | `uuid, uuid` | EXECUTE to authenticated; public revoked. |
| grant | `public.desvincular_aluno_usuario EXECUTE` | `uuid` | EXECUTE to authenticated; public revoked. |
| grant | `public.get_my_student_workouts EXECUTE` | `-` | EXECUTE to authenticated; public revoked. |
