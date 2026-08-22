# Product Roadmap v4 - Cycle 05.1

## Subscription lifecycle policy

Cycle 05.1 formalizes the owner subscription lifecycle without changing student access, checkout, billing gateway flows, webhook handling, or automatic charges.

## Policy

- `ativo`: owner access is available while `data_vencimento` is today or in the future.
- `vencido` with `grace_until`: owner access remains available until the grace date. The default operational grace period is 7 days.
- `vencido` with `suspended_at`: owner access is suspended even when the professional profile remains present.
- `ativo` with `cancel_at_period_end`: owner access remains available until the current period ends.
- `cancelado`: owner access is blocked immediately.
- `bloqueado` / inactive professional profile: administrative block stays independent from subscription reactivation.

## Database scope

Migration `20260821120000_subscription_lifecycle_policy.sql` adds lifecycle fields to `public.assinaturas`:

- `grace_until`
- `cancel_at_period_end`
- `cancelled_at`
- `suspended_at`
- `reactivated_at`

It also refreshes admin listing/upsert contracts and adds `admin_subscription_lifecycle_action` for semantic lifecycle operations and audit logs.

## Admin operations

Admins can register externally confirmed payment, extend grace, suspend the professional access, schedule cancellation at period end, cancel immediately, and reactivate a subscription. Payment reactivation does not clear profile-level administrative blocks.

## Student impact

Student lifecycle and finance visibility are unchanged. The owner subscription policy does not mutate student access fields, does not expose owner billing state to students, and does not introduce N+1 queries in student access checks.

## Out of scope

- Payment gateway integration
- Webhooks
- Checkout UI
- Automatic collection or auto-charge
- Production migration execution
- Student billing surface
