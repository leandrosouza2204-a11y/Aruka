# Current Workflow Audit

Stage: 10.1 - Discovery and Signal Contract

Status: COMPLETE

## Current Product Mapping

- Dashboard already shows operational indicators from alunos, treinos, avaliacoes and financeiro.
- `/alunos` already shows compact list signals and a per-student "Atenção e acompanhamento" section.
- Student detail already loads workout summary, execution history, student access state and financial summary.
- Student area does not expose coach workflow signals.
- Existing signals are derived in pure frontend utilities and are not persisted.

## Signal Inventory

| Signal | Source | Table/RPC/Service | Current Semantics | Owner | Security Boundary | Reliability | Actionability | Needs Schema Change | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `NO_ACTIVE_WORKOUT` | treinos | `buscarTreinosSupabase`, `treinos.lifecycle_status/status` | Active student has no active workout in loaded summary. | Professional | Existing workout ownership service/RLS. | High when treinos load succeeds. | High: open treinos. | No | Already implemented in Cycle 07 signal utility. |
| `STUDENT_ACCESS_ATTENTION` | alunos | `alunos.student_access_status`, student access services | Student access is not active, invited, suspended or revoked. | Professional | Existing `/alunos` protected route and student access RPCs. | High. | Medium/high: manage access. | No | Student UI must not see professional signal. |
| `RECENT_ABANDONED_SESSION` | execucoes | workout execution history service/RPC | A recent session is marked abandoned. | Professional | Existing execution history authorization. | Medium/high when history loads. | Medium: inspect history/student. | No | Does not imply adherence percentage. |
| `EXECUTION_INACTIVITY` | execucoes | workout execution history service/RPC | No completed execution in the recent loaded window. | Professional | Existing execution history authorization. | Medium, depends on loaded history window. | Medium: review context. | No | This is the only current stalled-student proxy. |
| `RECENT_EXECUTION_ACTIVITY` | execucoes | workout execution history service/RPC | Completed sessions exist recently. | Professional | Existing execution history authorization. | High when history loads. | Info: review progress. | No | Informational, not a pending action. |
| `FINANCE_ATTENTION` | financeiro | `montarAtencaoCobranca`, pagamentos/plano/aluno inputs | Billing helper indicates overdue, due soon or inconsistent recurring state. | Professional | Existing finance/alunos protected services. | High for billing context, but cross-domain. | High: open financeiro. | No | Use as input only; no finance mutation in this cycle start. |
| `WORKOUT_REVIEW_DUE` | dashboard/treinos | `treinos.data_revisao` | Dashboard counts workouts with review date due today or earlier. | Professional | Existing workout ownership service/RLS. | Medium/high. | Medium: review workout. | No | Not yet canonicalized per-student in coach workflow utility. |
| `NO_ASSESSMENT` | dashboard/avaliacoes | `buscarAvaliacoesSupabase` | Dashboard counts eligible students without assessment. | Professional | Existing assessment ownership service/RLS. | Medium. | Low/medium. | No | Assessment periodicity is not reliable enough for stale/due signal. |

## Rejected Signals

- Adherence percentage: rejected because no schedule/completion denominator exists.
- Broad stalled student by last activity: rejected for now because there is no reliable cross-product `last_activity_at`.
- Assessment overdue/stale: rejected because no canonical required cadence exists.
- Automatic follow-up send: out of scope because no external notification channel is approved.
- Automatic workout mutation/archive/payment action: out of scope because the cycle starts with decision support, not auto-action.

## UX Surfaces

- Primary existing surface: `/alunos`, because it already has list and detail signals.
- Candidate next surface: dashboard, if 10.2 needs a coach attention queue.
- Student detail remains useful for context and action navigation.
- No new full page is justified in 10.1.

## Data Gaps

- No reliable all-product `last_activity_at`.
- No persisted dismiss/resolve/read state for workflow signals.
- No canonical per-student action queue table.
- No schedule/adherence denominator.
- No assessment cadence contract.

## Security

Use existing professional-owned services and RLS. Keep the signal domain pure and avoid direct Supabase access in frontend utility code. Student and anonymous surfaces remain unchanged.

## Calculated vs Persisted

10.1 decision: CALCULATED_ONLY.

Persisted state may be introduced later only for dismiss/resolve history or manual priority, with a dedicated RLS model.

## Infrastructure Decisions

- Cron required: NO.
- Edge Function required: NO.
- External notification required: NO.
- Supabase impact: NO for 10.1.

## First Stage Decision

FIRST_STAGE_READY_FOR_IMPLEMENTATION.

The first stage is discovery and signal contract, implemented as canonical documentation, report artifacts and static QA guardrails.
