# Product Roadmap v4 Cycle 03 - Workout Intelligence Feedback Loop

## Goal

Create a controlled feedback loop around workout prescription history without automatic AI decisions.

## Scope

Cycle 03 adds a coach-facing `Feedback do treino` panel to the workout detail view. The panel summarizes signals derived from the current workout and the previous comparable workout for the same student.

The cycle reuses the Student Progression Snapshot engine from Cycle 01 for workout ordering, exercise matching, load parsing, repetition parsing, progression signals and history quality. It does not create a second comparison engine.

## Domain Model

The domain helper is `workoutIntelligenceFeedback.js`.

It returns:

- `summaryStatus`;
- `continuity`;
- ordered feedback `items`;
- `confidence`;
- structured internal `evidence`.

Feedback types are intentionally conservative:

- `PROGRESSION_SIGNAL`;
- `STABLE_PATTERN`;
- `PARTIAL_HISTORY`;
- `NEW_EXERCISE`;
- `REVIEW_CONTEXT`;
- `CONTINUITY_BREAK`;
- `NO_DATA`.

The helper does not create scores, rankings, regression labels, deload recommendations or automatic prescription changes.

## UX

Primary location: workout detail.

Secondary location: student detail keeps using Student Progression Snapshot from Cycle 01.

The panel shows at most five feedback items and uses product language for the professional. It does not expose UUIDs, RPC names, table names, enum names or raw evidence payloads.

## Limitations

Workout Intelligence in this cycle uses prescriptions and workout history. It does not use performed sessions, performed reps, performed load, RIR, session duration or real adherence.

This means the product can say there are signs of prescribed progression, but must not say the student executed or physiologically progressed.

## QA

- `node --test src/features/treinos/utils/*.test.js`
- `qa:product-roadmap-v4-cycle-03`
- `qa:workout-intelligence-runtime`
- `qa:student-progression-snapshot`
- `qa:student-progression-runtime`
- `qa:product-roadmap-v4-cycle-02`
- `qa:avaliacoes-functional-audit`
- `qa:workout-template-guided-application`
- `qa:workout-template-sanitization`
- `qa:workout-template-discovery`
- `qa:authenticated-runtime`
- `qa:student-experience-continuity`
- `qa:core-mobile-layout`
- `qa:visible-ui-copy`
- `lint`
- `build`

## Future Phase B

`WORKOUT_EXECUTION_HISTORY_CAPTURE` remains required before Aruka can reason about real adherence, performed sets, performed reps, performed load, RIR or session-level completion quality.
