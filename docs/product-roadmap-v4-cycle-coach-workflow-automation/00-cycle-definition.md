# Product Roadmap v4 - Coach Workflow Automation

## Canonical Source

- Roadmap overview: `docs/product-roadmap-v4/01-roadmap-overview.md`.
- Roadmap report: `reports/product-roadmap-v4/roadmap.json`.
- Cycle 09 closeout: `docs/product-roadmap-v4-cycle-09-closeout/01-closeout.md`.
- Previous signal foundation: `docs/product-roadmap-v4/11-cycle-07-coach-workflow-signals.md`.

## State

IN_PROGRESS

Cycle 09 - Exercise Library and Media is complete. Coach Workflow Automation is ready to start.

## Objective

Operational automation for follow-up, stalled students, pending actions and repeated coach decisions after the exercise library and media foundation.

In product terms, the cycle should help the professional answer: which students need attention, why, and what is the next safe action?

## Problem

Aruka already has students, workouts, workout lifecycle, student access, execution history, assessments, billing attention and dashboard indicators. These signals exist in separate surfaces, so the professional still repeats manual checks to decide who needs attention today.

## In Scope

- Canonical signal inventory and data contract.
- Derived coach workflow status for professional-owned students.
- Attention queue or compact operational surface for the coach.
- Navigation actions that support decisions without automatic mutation.
- Optional persisted dismiss/resolve state only after the calculated signal contract is stable.
- Mobile/PWA and accessibility validation for any new coach workflow UI.

## Out Of Scope

- Generative AI.
- WhatsApp, SMS, email or push automation.
- Cron jobs.
- Edge Functions.
- Queues.
- Automatic workout edits, student archive, payment mutation or follow-up sending.
- Incidental financial workflow changes.

## Dependencies

- Cycle 09 Exercise Library and Media: COMPLETE.
- Existing protected professional routes and ownership-filtered services.
- Existing workout lifecycle and delivery contracts.
- Existing student access lifecycle.
- Existing workout execution history.
- Existing billing attention helper, used as an input signal only.

## Security Model

Signals are professional-only. They must use already authorized professional data or backend contracts that enforce `auth.uid()` and ownership. A professional must never receive signals for another professional's student. Student and anonymous UI must not expose coach workflow signals.

## Data Decision

Default decision: CALCULATED.

Persist only when a stage needs dismiss/resolve history, manual priority, or audit trail. Do not create a workflow table before the calculated signal contract and UI placement prove useful.

## Automation Model

Initial automation means:

DETECT -> PRIORITIZE -> SURFACE -> SUPPORT DECISION.

It does not mean auto-action.

## Stalled Student Capability

PARTIAL.

The product can derive factual execution inactivity from loaded execution history, such as no completed session in the recent window. It does not yet have a broad reliable `last_activity_at` signal across login, viewing, workout start, payment or assessment activity.

NO_RELIABLE_STALLED_SIGNAL_YET for broad student activity.

## Pending Action Capability

PARTIAL.

Supported pending actions include active student without active workout, student access not active, recent abandoned execution session, execution inactivity and billing attention already derived by the financeiro helper. Workout review dates exist on workouts/dashboard, but need a canonical per-student workflow contract before becoming an action queue item.

## Proposed Stages

### 10.1 - Discovery and Signal Contract

Define canonical sources, reliable signals, rejected signals, security boundaries, calculated-vs-persisted decision and the first-stage QA guard.

### 10.2 - Coach Attention Queue

Create a compact professional queue from calculated signals, likely starting on dashboard or `/alunos` depending on the lowest-friction UX surface.

### 10.3 - Student-Level Workflow Actions

Improve per-student action support with explicit navigation, dismissible read-state if justified, and no automatic mutations.

### 10.4 - Prioritization and Resolution

Add deterministic priority/resolution semantics only for signals proven useful in 10.2 and 10.3.

### 10.5 - Mobile/PWA Stabilization

Validate mobile, PWA, accessibility, loading, empty, error and retry behavior for the coach workflow surfaces.

## First Stage

FIRST_STAGE: 10.1

FIRST_STAGE_TITLE: Discovery and Signal Contract

FIRST_STAGE_STATUS: READY_FOR_IMPLEMENTATION

FIRST_STAGE_BRANCH: `feat/product-roadmap-v4-coach-workflow-automation`

## Success Criteria

- Canonical scope is documented.
- Existing product signals are mapped to source, semantics, owner, security boundary, reliability and actionability.
- Stalled-student and pending-action capabilities are explicitly classified.
- Cron, Edge Function and external notification are ruled out for the first stage.
- Supabase impact is explicitly reported.
- Focused QA validates the discovery contract.

## Known Risks

- Treating finance workflow as part of coach automation without a product decision.
- Turning absence of data into overconfident recommendations.
- Creating persisted workflow state before calculated signals prove useful.
- Exposing professional-only signals to student or anonymous surfaces.
- Adding cron/Edge/notification infrastructure prematurely.

## Next Cycle

To be defined after Coach Workflow Automation progresses.
