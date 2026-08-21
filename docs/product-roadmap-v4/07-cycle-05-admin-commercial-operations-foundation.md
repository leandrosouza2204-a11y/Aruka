# Product Roadmap v4 Cycle 05 - Admin Commercial Operations Foundation

## Goal

Transform the existing manual commercial operation into a clearer admin workflow for beta users and early paying customers.

This cycle does not implement checkout, payment provider integration, Pix, webhooks, invoice automation, MRR, ARR, churn BI, delinquency automation, or automatic owner-to-student access suspension.

## Previous State

The product already had the core contracts:

- `public.perfis` for role, profile access and active/inactive profile status.
- `public.assinaturas` for SaaS subscription status, plan, start date and renewal date.
- `public.aceites_legais` for legal acceptance.
- admin RPCs for listing users, updating profiles, updating subscriptions, releasing beta access, releasing subscriber access, blocking users and listing logs.
- `/assinatura-pendente` for pending professionals.
- `/admin/usuarios` and `/admin/logs` for admin operation.

The weak point was product clarity: the admin page exposed profile fields directly and did not present a commercial operating model with attention states, operational counters and explicit manual-payment language.

## Architecture

Cycle 05 reuses the existing admin RPCs and service layer. No new database schema, migration or RPC was added.

Primary implementation:

- `src/features/adminCommercial/utils/commercialAccountState.js`
- `src/pages/AdminUsuarios.jsx`
- `src/components/AdminUsuarioModal.jsx`
- `src/pages/EscolherPlano.jsx`
- `src/data/commercialPlans.js`

The admin page still performs one list operation through `admin_listar_usuarios`. Commercial states, counters and filters are derived client-side from that payload. No N+1 fetch was introduced.

## State Model

The domain helper keeps these concepts separate:

- role
- profile access
- subscription status
- student access status

It derives:

- commercial label
- access label
- subscription label
- attention state
- available actions
- filter keys

Supported commercial states are derived only from existing contracts:

- awaiting release
- active subscriber
- beta/test
- near renewal
- expired
- cancelled
- blocked
- review needed

## Operations

The admin view supports the existing operations:

- release beta through `admin_liberar_beta`
- release subscriber through `admin_liberar_assinante`
- edit subscription through `admin_upsert_assinatura`
- update profile through `admin_atualizar_perfil`
- block profile through `admin_bloquear_usuario`
- cancel subscription by setting `assinaturas.status = cancelado` through `admin_upsert_assinatura`
- reactivate profile through `admin_atualizar_perfil`

Cancellation preserves the professional account and all student, workout, assessment and history data. It does not revoke student access.

## Domain Separation

SaaS subscription source:

- `assinaturas`

Student finance sources:

- `planos`
- `pagamentos`

Cycle 05 does not change the student finance schema or semantics.

Student access lifecycle remains separate from owner subscription status. Owner expired, cancelled or blocked states do not automatically mutate `student_access_status`.

## Pending Flow

`/assinatura-pendente` still uses WhatsApp because no payment provider exists in this cycle. The plan source is centralized in `src/data/commercialPlans.js`, but remains hardcoded by design.

There is no configured WhatsApp recipient. The current `wa.me` flow keeps the existing no-recipient behavior and does not invent a phone number.

## QA

Added:

- `qa:product-roadmap-v4-cycle-05`
- `qa:commercial-operations-runtime`
- domain tests for `commercialAccountState`

Required regressions:

- Cycle 01 progression snapshot
- Cycle 02 assessment evolution
- Cycle 03 workout feedback
- Cycle 04 student daily experience
- Cycle 04.1 student access lifecycle
- authenticated runtime
- student finance/billing regression
- visible UI copy
- lint
- build

## Risks

- Payment evidence remains external to Aruka.
- There is no automatic renewal or delinquency model.
- Trial is represented only by existing `teste` status, without trial automation.
- Reactivation remains an admin operation using existing profile/subscription contracts.
- Admin fixture availability may limit local runtime validation.

## Out Of Scope

- Stripe
- Mercado Pago
- Asaas
- checkout
- Pix API
- webhook
- invoice automation
- MRR/ARR/churn BI
- automated delinquency
- automatic owner-to-student suspension
- price changes
- trial automation
- AI
- legal advice
- bulk student revocation
