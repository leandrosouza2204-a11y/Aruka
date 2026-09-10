# Product Roadmap v4 - Cycle 11 Smart Management

Cycle: 11 - Gestao Inteligente

Status: IN_PROGRESS

## Objective

Create an independent module that supports commercial and operational decisions for the professional. The module will allow the professional to register service locations, transfer rules, services and prices, then calculate profitability and compare work scenarios in later stages.

## Conceptual Boundary

FINANCEIRO is the operational financial ledger and tracking surface: payments, receivables, subscriptions, overdue amounts and cash-flow style follow-up.

GESTAO INTELIGENTE is the decision-support surface: pricing, transfer rules, profitability, scenarios and comparison between service locations.

Gestao Inteligente must not be implemented inside `src/features/financeiro/**`. It can consume financial data read-only in a future stage, but Stage 11.1 has `FINANCE_INTEGRATION=NO`.

## Roadmap

- 11.1 Foundation & Data Model: COMPLETE.
- 11.2 Locais & Repasses: COMPLETE.
- 11.3 Serviços & Precificação: COMPLETE.
- 11.4 Motor de Rentabilidade: COMPLETE.
- 11.5 Simulador Inteligente: COMPLETE.
- 11.6 Comparador de Locais: COMPLETE.
- 11.7 Apresentação Comercial: COMPLETE.
- 11.8 Dashboard Integration: COMPLETE.
- 11.9 Mobile/PWA & Stabilization: PLANNED.

## Route And Navigation

The professional route is `/gestao-inteligente`. It is authenticated and goes through the existing professional app route wrappers: `ProtectedRoute`, `SubscriptionRoute`, `LegalRoute` and the professional PWA manager.

Desktop navigation exposes the module in the professional sidebar as `Gestao Inteligente`. Mobile navigation keeps the bottom bar unchanged and exposes the module inside the `Mais` panel, following the Cycle 09 exercise-library pattern.

Dashboard integration is reserved for Stage 11.8. Stage 11.1 does not create fake metrics, recommendations or insight cards.

## Stage Guardrails

Stage 11.1 does not implement the profitability engine, simulator, location ranking, automatic recommendations, commercial presentation, real finance integration, imports, agenda, historical reports, AI, automations, notifications, cron or Edge Functions.

No production seed data is created for example gyms or studios.
