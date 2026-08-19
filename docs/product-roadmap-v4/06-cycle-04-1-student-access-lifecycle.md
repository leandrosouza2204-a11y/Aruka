# Cycle 04.1 - Student Access Lifecycle

## Decision

Student access is a separate authorization contract from professional subscription, billing status, consultation lifecycle, and admin role.

The MVP supports:

- NOT_INVITED
- INVITED
- ACTIVE
- SUSPENDED
- REVOKED

## Current Model

Before this cycle, student identity used `public.alunos.student_user_id` and `get_my_student_workouts()`. A linked student could read `/minha-area`, but there was no explicit access lifecycle. Professional subscription was handled through `perfis`, `assinaturas`, and `SubscriptionRoute`.

## New Model

`public.alunos` now stores student access state:

- `student_access_status`
- `student_access_email`
- `student_access_invited_at`
- `student_access_activated_at`
- `student_access_suspended_at`
- `student_access_revoked_at`
- `student_access_reason`

Professional mutations use `manage_student_access(...)`, which derives the professional from `auth.uid()` and only updates that professional's own students.

Student reads use `get_my_student_workouts()`, which derives the student from `auth.uid()` and only returns protected workout data when `student_access_status = 'active'`.

## Product Semantics

`NOT_INVITED` means the student is registered but access was not prepared.

`INVITED` means access was prepared for an e-mail, but final activation is not complete.

`ACTIVE` means the student may use `/minha-area`.

`SUSPENDED` is a temporary reversible block.

`REVOKED` blocks access while preserving identity and history.

## UI

The professional sees an "Acesso ao Aruka" block in student details, with status, e-mail, and allowed actions.

The student sees a friendly blocked state in `/minha-area` for suspended or revoked access. The student is never sent to professional subscription pending.

## Out Of Scope

The MVP does not auto-suspend by overdue payment, auto-reactivate after payment, or implement grace period automation.

Real e-mail invite delivery remains a future integration. The current implementation stores and validates the access e-mail and keeps password handling out of the professional UI.
