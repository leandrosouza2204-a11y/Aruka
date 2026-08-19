# Product Roadmap v4 Cycle 04 - Student Daily Experience

## Goal

Create a continuous student-facing daily experience around the active workout, recent workout sheet history, conservative prescription progress and next action.

## Scope

Cycle 04 adds `/minha-area`, a protected student-facing route. It uses the existing Student Identity contract and the existing `get_my_student_workouts` RPC, so the frontend never receives or sends an arbitrary `aluno_id` to load another student's data.

## Architecture

- Route: `/minha-area`.
- Service: `buscarMinhaExperienciaDiariaAluno`.
- Domain helper: `buildStudentDailyExperience`.
- Presentation: `MinhaArea`.

The helper is pure and does not fetch data. The service performs one student-scoped read through the authenticated session.

## Data Semantics

Prescription data is available: prescribed exercises, prescribed sets, prescribed repetitions, prescribed load, workout dates, lifecycle and workout sheet history.

Execution data is not available in this cycle: performed sessions, performed sets, performed reps, performed load, RIR, RPE, session completion and real adherence.

The UI therefore uses language such as "ficha", "prescrição", "disponível para consulta" and "comparação entre fichas". It does not claim that the student performed a workout or improved performance.

## UX

The first screen answers "what do I have now?" with a compact active workout card, review context and a primary "Ver treino atual" action. The action opens the prescribed workout sheet for consultation only.

The page also shows:

- conservative next-action cue;
- prescription progression summary from Cycle 01;
- recent workout sheet history;
- assessment placeholder state while the student-facing assessment payload is not available.

## Mobile

The layout is mobile-first, avoids wide tables and uses responsive grids with touch-friendly actions for 360, 390 and 430px widths.

## QA

- `node --test src/features/studentDailyExperience/utils/*.test.js`
- `qa:product-roadmap-v4-cycle-04`
- `qa:student-daily-experience-runtime`
- Cycle 01, 02 and 03 regression suites
- authenticated runtime
- core mobile
- visible copy
- lint
- build

## Limitations

The experience does not include assessment evolution yet because the existing student-scoped RPC only exposes active and completed workouts. Adding assessment data should be reviewed as a separate contract change or a safe extension to the existing reader.

## Out Of Scope

- execution tracking;
- performed sets, reps, load, RIR or RPE;
- workout timers;
- adherence claims;
- automatic recommendations;
- AI summaries;
- gamification;
- scores;
- complex BI.

## Future Phase B

`WORKOUT_EXECUTION_HISTORY_CAPTURE` remains the future foundation required before Aruka can present real adherence or execution-based progression.
