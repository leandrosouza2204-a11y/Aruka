# Product Roadmap v4

## Current state

Aruka exits Roadmap v3 with Product Audit v2 closed, authenticated runtime validated, Supabase production front closed, canonical local CI harness available, and no pending db push. The product now has stable operational modules for alunos, treinos, avaliacoes, financeiro, dashboard, planos and admin.

## Product maturity

The platform is no longer primarily an infrastructure stabilization effort. Roadmap v4 should prioritize product value: helping the professional prescribe better, helping the student understand progress, and making recurring use more valuable.

## Main opportunities

1. Student progression and workout intelligence: current workout flows support lifecycle, templates and delivery, but do not yet turn execution history, load, repetitions and volume into a clear progression surface.
2. Assessment evolution: avaliacoes already keep history and comparative signals, creating a strong base for clearer visual comparison and shared progress narratives.
3. Student experience continuity: the student can access workouts, but the next valuable step is making progress, next actions and continuity easier to understand.
4. Exercise library and media: strengthen the core workout-building flow with a structured exercise library, professional custom exercises, favorites and student-visible demonstrations.
5. Coach workflow automation: reduce repeated manual decisions around follow-up, stalled students, pending actions and renewal/commercial moments.
6. Commercial readiness: onboarding, beta/trial operation, support readiness and release discipline should become productized rather than ad hoc.

## Prioritization criteria

Priority favors improvements that reduce manual work, increase perceived acompanhamento, improve prescription quality, support retention and remain testable in controlled cycles. Infrastructure-only work is not a primary v4 axis unless it directly unlocks product value.

## Cycles

### Cycle 01 - Student Progression Snapshot

Objective: give the professional and student a clear summary of workout progression using existing treino/exercicio fields where possible.

Expected outcome: visible progression indicators for recent training history, focused on load/reps/volume presence, cycle continuity and next review cues.

DATABASE_CHANGE_REQUIRED=POSSIBLE

### Cycle 02 - Assessment Evolution Experience

Objective: improve comparison across physical evaluations and make progress easier to explain.

Expected outcome: clearer historical comparison, deltas, trend summaries and report-ready progress language.

DATABASE_CHANGE_REQUIRED=NO

### Cycle 03 - Workout Intelligence Feedback Loop

Objective: create a controlled feedback loop around adherence, completion and adjustment needs, without automatic AI decisions.

Expected outcome: coach-facing signals for workouts needing review and student-facing prompts that improve continuity.

DATABASE_CHANGE_REQUIRED=POSSIBLE

### Cycle 04 - Student Daily Experience

Objective: make the student area feel continuous after delivery: current workout, history, progress, and next action.

Expected outcome: student can understand what is active, what changed, what was completed and why to continue.

DATABASE_CHANGE_REQUIRED=POSSIBLE

### Cycle 05 - Commercial Readiness

Objective: prepare operation for beta/trial/commercial usage with onboarding, support and admin clarity.

Expected outcome: clearer account states, support observability, beta/trial policy documentation and release checklist.

DATABASE_CHANGE_REQUIRED=NO

### Cycle 09 - Exercise Library and Media

Objective: evolve workout assembly with a structured exercise library, system exercises, professional custom exercises, favorites, YouTube media, uploaded professional videos and student-visible demonstrations.

Expected outcome: professionals can search/filter exercises by muscle group, category, source and favorites, add exercises to workouts without duplicating library records unnecessarily, and students can view authorized exercise media inside delivered workouts.

DATABASE_CHANGE_REQUIRED=YES

### Future cycle - Coach Workflow Automation

Objective: operational automation for follow-up, stalled students, pending actions and repeated coach decisions.

Expected outcome: preserved as backlog/future cycle because the current product priority is strengthening workout creation and delivery.

COACH_AUTOMATION_POSTPONED=YES

## Dependencies

- Stable authenticated runtime for product QA.
- Existing workout lifecycle and student identity contract.
- Existing assessment history and finance/admin surfaces.
- Canonical local CI harness for any database-impacting cycle.

## Database-change policy

If a cycle requires database change, use the supervised flow: local migration, local full CI, dry-run, review, authorization, and production db push. No v4 cycle may bypass the reference-baseline and canonical harness contract.

## Runtime QA strategy

Each cycle must include focused static checks plus authenticated runtime checks when the feature is user-facing. Full Supabase local CI is required before any database-impacting push.

## Definition of done

- User-facing value demonstrated in existing workflows.
- No reopened Product Audit v2 findings.
- Lint and build pass.
- Focused QA for the changed module passes.
- If database changes exist, `qa:supabase-ci-full-local` passes and `DB_PUSH_NEEDED` is explicitly reviewed.
