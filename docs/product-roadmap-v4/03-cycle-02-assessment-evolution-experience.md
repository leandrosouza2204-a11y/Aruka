# Product Roadmap v4 Cycle 02 - Assessment Evolution Experience

## Goal

Improve comparison across physical evaluations and make progress easier to explain from the existing Avaliacoes workflow.

## Implemented Scope

Assessment Evolution Experience adds a user-facing evolution panel to the student assessment profile. The panel appears inside `AvaliacaoDetalhesModal`, next to the existing evaluation history, charts and report actions.

The cycle reuses the already loaded `historicoAluno` from `useAvaliacoesPage`. It does not fetch Supabase directly, does not add a service, does not add an RPC, and does not add a database migration.

## Product Value

The professional can now see:

- current weight, waist, estimated body fat and lean mass;
- delta from the previous assessment;
- delta from the first assessment in the student's visible history;
- a short summary of how many indicators are comparable;
- report-ready language that can be used to explain progress.

The generated assessment report also includes the same evolution summary and narrative so the comparison becomes part of the communication flow, not only a dashboard detail.

## Technical Strategy

The domain logic lives in `assessmentEvolutionExperience.js`. It is pure and testable, with defensive parsing for empty, numeric, comma-decimal and legacy values.

The implementation reuses:

- `calcularComposicaoCorporal`;
- the existing assessment history already loaded by `useAvaliacoesPage`;
- the existing details/report surface;
- the existing responsive card/grid styles from Avaliacoes.

## UX

The new panel avoids technical metadata. It does not expose UUIDs, table names, RPC names, internal statuses or debug messages.

Empty and partial data states use plain product language such as baseline creation and insufficient comparable indicators.

## Limitations

The experience compares recorded physical assessments. It does not infer causality, adherence, prescription quality or medical conclusions.

Body composition remains an estimate based on the current calculation helper and available assessment fields.

## QA

- `node --test src/features/avaliacoes/utils/*.test.js`
- `qa:product-roadmap-v4-cycle-02`
- `qa:avaliacoes-functional-audit`
- `qa:student-progression-snapshot`
- `qa:student-progression-runtime`
- `node --test src/features/treinos/utils/*.test.js`
- `qa:authenticated-runtime`
- `qa:student-experience-continuity`
- `qa:core-mobile-layout`
- `qa:visible-ui-copy`
- `lint`
- `build`

## Future Opportunities

- richer visual comparison after the assessment model is stabilized;
- copy/export actions for the evolution narrative;
- student-facing explanation once the student daily experience cycle defines the destination surface.
