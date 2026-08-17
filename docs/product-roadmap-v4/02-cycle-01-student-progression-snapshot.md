# Product Roadmap v4 Cycle 01 - Student Progression Snapshot

## Implemented Scope

Student Progression Snapshot adds a conservative progression readout to the student detail view. The primary location is `AlunoDetalhesResponsivo`, near the existing operational summary.

The snapshot reuses already loaded student workout data from `buscarTreinosPorAlunoSupabase(alunoId)` through `resumoOperacional.treinos`. It does not fetch Supabase directly, does not add an RPC, and does not add a database migration.

## Domain Rules

The helper compares the current relevant workout with the previous relevant workout for the same student. It prefers active/delivered workout lifecycle state and then deterministic workout dates (`dataInicio`, delivery/completion dates, `createdAt`) instead of relying on incidental array order.

Exercise identity is conservative:

- normalized exercise name is required;
- matching group/day strengthens confidence;
- position only supports a name match;
- position alone is never treated as identity.

Load and repetition parsing is intentionally narrow. Numeric load supports values such as `20`, `20 kg`, `20,5 kg` and `20.5`. Text like `moderada`, `leve`, `peso corporal` and `barra + 10` remains partial data.

## Known Limitations

The snapshot compares workout prescriptions between fichas. It does not represent real student execution.

It does not calculate real adherence, session completion, PR, physiological evolution, regression or real volume. Volume is intentionally not a headline because current fields are free text and can mislead across machines, bodyweight exercises, unilateral work and special techniques.

## Phase B Opportunity

Future opportunity: `WORKOUT_EXECUTION_HISTORY_CAPTURE`.

That future foundation should persist session, performed sets, performed reps, performed load, RIR and timestamp before the product claims execution-based progression.

## Validation

- `qa:student-progression-snapshot`
- `qa:student-progression-runtime`
- `test:alunos`

No production access, database push or migration is part of this cycle.
