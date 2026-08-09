# Roadmap v3 Cycle 04 - Student Experience Continuity

Decision: `READY_FOR_ROADMAP_V3_CYCLE_05`

Scope: authenticated local student journey through `Alunos` and `Treinos`, preserving Student Identity and Workout Delivery contracts. No production access, no database change and no CI change.

## Journey

`ENTRY -> IDENTIFICATION -> CONTEXT -> CURRENT WORKOUT -> ACTION -> FEEDBACK -> HISTORY/NEXT STEP`

| Step | Route/component | Behavior |
| --- | --- | --- |
| Entry | `/alunos`, `AlunosList` | Student row exposes contextual CTAs, including `Ver treinos`. |
| Identification | `alunosContextNavigation` | URL carries `alunoId` and safe `returnTo`. |
| Context | `/treinos?alunoId=...`, `TreinosContextoAluno` | Banner names the selected student and offers return/clear/create actions. |
| Current workout | `TreinosCards`, `TreinoDetalhesModal` | Cards and detail show student, routine, lifecycle badge, relevant dates and origin. |
| Action | `WorkoutLifecycleActions`, `WorkoutLifecycleConfirmationModal` | Deliver, complete and archive remain lifecycle-derived and confirmed. |
| Feedback | `useTreinosPage`, `Toast`, `treinosErrorState` | Success and contextual error feedback are preserved. |
| History/next step | lifecycle filters and detail panel | Completed and archived workouts are accessible without becoming the default active list. |

## Inventory

| Route | Student context | Workout context | Lifecycle | Primary action | Empty/loading/error | Back/navigation |
| --- | --- | --- | --- | --- | --- | --- |
| `/alunos` | selected row | operational summary | indirect | contextual links | existing aluno states | current filters preserved |
| `/treinos?alunoId` | URL + banner | filtered list | badge and filters | create or lifecycle action | contextual empty/loading/error | `returnTo` link |
| `/treinos` detail | selected workout id | detail card | state, description and dates | deliver/complete/view | no detail selected state | close detail |
| `/treinos?status=completed` | optional | completed list | completed | view/archive | empty handled by cards | filters in URL |
| `/treinos?status=archived` | optional | archived list | archived | view | empty handled by cards | filters in URL |

## Finding

`STU-R01` P1 `STALE_STATE`: when the contextual `alunoId` changed, the previously selected workout and open workout modals could remain visible until the next data load completed.

Fix: `useTreinosPage` now clears the selected workout, edit/base workout and workout modals whenever `alunoIdParametro` changes.

## Notes

No new student profile model was introduced. No lifecycle names were invented. No schema, RPC, RLS, Workout Delivery or Student Identity contract was changed.

Runtime and regression validation are recorded in `reports/product-roadmap-v3/cycle-04-student-experience-result.json`.

Next action: `START_OPERATIONAL_OBSERVABILITY_AND_ADMIN_TOOLING`.
