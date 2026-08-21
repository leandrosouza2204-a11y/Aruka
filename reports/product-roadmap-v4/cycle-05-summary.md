# Product Roadmap v4 Cycle 05 Summary

Decision: READY_FOR_PRODUCT_ROADMAP_V4_CYCLE_05_COMMIT

Cycle 05 implemented Admin Commercial Operations Foundation without checkout, provider integration, database migration, RPC changes, production access or DB push.

## Implemented Scope

- Commercial account state helper and tests.
- Admin operational counters for awaiting release, active, beta/test, near renewal, expired, cancelled and blocked accounts.
- Commercial filters derived from existing `perfis` and `assinaturas` fields.
- Admin table and mobile cards focused on commercial state, subscription, renewal and attention.
- Subscription edit validation for existing fields only.
- Manual payment copy: Aruka records administrative release after external confirmation.
- Pending WhatsApp flow copy clarified.
- Commercial plan source centralized without moving it to the database.
- Cycle 05 static validator and commercial runtime validator.

## Contracts Reused

- `admin_listar_usuarios`
- `admin_liberar_beta`
- `admin_liberar_assinante`
- `admin_upsert_assinatura`
- `admin_atualizar_perfil`
- `admin_bloquear_usuario`
- `admin_listar_logs`

## Database Decision

DATABASE_CHANGE_REQUIRED=NO

Existing `assinaturas` is sufficient for the MVP. No parallel SaaS subscription table was created.

## Domain Separation

SaaS subscription remains in `assinaturas`.

Student finance remains in `planos` and `pagamentos`.

Student access lifecycle remains independent. Cycle 05 does not automatically suspend, revoke or reactivate students based on owner subscription state.

## Known Limitations

- No real payment evidence is stored.
- No checkout, webhook, invoice or provider integration exists.
- No automated delinquency or grace period model exists.
- No MRR, ARR, churn or conversion BI is derived.
- WhatsApp recipient remains unconfigured.
