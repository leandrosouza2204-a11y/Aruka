# Canonical Definition: Smart Management Profitability

## Decision

`PROFITABILITY_SCOPE_DEFINED`

This is a documentation-only definition. No component, route, calculation, database
object, API, migration, or production behavior changed.

## Product Boundary

The Profitability tab answers: "What is the estimated per-session financial result of
my registered service and location under an explicitly selected student count?"

It helps a professional inspect the registered commercial configuration without
creating or saving alternatives. It is not profit accounting: the engine calculates
gross session revenue minus transfer only. It does not model taxes, rent, travel,
administrative time, discounts, defaults, received payments, or real occupancy.

The analysis unit is therefore `Service + Location + studentCount`. A service can be
used at multiple locations, and transfer depends on the location. Student count is
not persisted as current occupancy; the product stores capacity only. Any future
Profitability result must be labelled estimated/projected, never actual, received,
profit, or margin.

## Functional Separation

| Dimension | Profitability | Simulator | Comparator |
| --- | --- | --- | --- |
| Question | What does this registered operating combination estimate? | What changes under temporary alternatives? | How do equivalent locations differ? |
| Source | Active persisted service and location | Active persisted inputs plus temporary scenario choices | One persisted service, count, and selected active locations |
| Hypothetical input | Required student-count assumption | Service, location, and count can vary by scenario | Selected locations vary; service/count remain invariant |
| Persistence | None | None | None |
| Main focus | Inspect one registered combination | Explore up to four scenarios | Isolate transfer impact by location |
| Comparison | No ranking or automatic comparison | Scenario metrics and ties | Normalized location comparison |
| Recommendations/ranking | No | Existing metric highlight only | Existing comparable winners only |

## Existing Engine Contract

Input: `service`, `location`, `studentCount`.

Service inputs: pricing model (`PER_SESSION`, `PER_STUDENT_SESSION`,
`MONTHLY_PACKAGE`, `FIXED_PACKAGE`), price in BRL, optional weekly/monthly/package
session counts, optional duration in minutes, and minimum/maximum capacity.

Location inputs: active status and one transfer rule: `none`, `fixed`,
`per_student`, `percentage`, or `tiered`. Tiered rules use minimum/maximum student
ranges and a BRL amount. Active professional ownership is enforced by the data source.

Outputs are integer BRL cents: `grossRevenue`, `transferAmount`,
`netAfterTransfer`, `grossHourlyRate`, `netHourlyRate`, `grossPerStudent`, and
`netPerStudent`, plus pricing/transfer metadata and a calculation breakdown. Ratios
round to the nearest cent. Negative net and hourly values remain visible. Hourly
metrics are `null` when duration is absent.

Revenue formula: per-session price; per-student price times count; fixed package
price divided by package sessions; or monthly price divided by explicit monthly
sessions, otherwise by `weekly frequency * 52 / 12`.

Transfer formula: zero for `none`; fixed amount for `fixed`; amount times count for
`per_student`; gross times whole percentage for `percentage`; and exactly one matching
tier amount for `tiered`. Result is `grossRevenue - transferAmount`.

## Future Profitability MVP

The future screen must start from active persisted services and locations, not from an
"Add scenario" action. It may present a selected service, selected location, and an
explicit student-count assumption within service capacity, then the existing engine
result and breakdown. It must not alter either record.

Recommended visible metrics: Receita da sessao, Repasse, Receita apos repasse, and
Valor por hora when duration exists. Gross/net per student are optional supporting
metrics. Do not expose a metric as lucro, margem, result received, ranking, or an
automatic recommendation.

Default filters: active services and active locations, scoped to the authenticated
professional. Archived records remain outside the default view and are not deleted.
Finance integration and new dashboard metrics are out of scope.

## Screen States

| State | Condition | Behavior |
| --- | --- | --- |
| Loading | source query pending | Accessible loading status; no metrics |
| Empty | no active service or location | Explain missing registration and link to the relevant existing tab |
| Partial | one source exists but no calculable pair | Show available source and explain the missing configuration |
| Ready | active service, active location, valid rule, count within capacity, valid pricing data | Show estimated result and existing breakdown |
| Invalid | configured input fails engine validation | Show the engine error; never coerce to zero |
| Error | query/system failure | Accessible error and retry, separate from invalid configuration |

Conceptual readiness: `profitabilityReady(service, location, studentCount)` requires
an active service with supported pricing and valid price/frequency/package fields, an
active location with a supported complete rule, and an integer count within capacity.

## Information Hierarchy and Wireframe

Level 1: title, explicit `estimativa por atendimento` qualifier, and source status.
Level 2: selected persisted service and location plus the explicit student-count
assumption. Level 3: gross, transfer, result after transfer, conditional hourly value,
and the existing formula breakdown.

```
[Rentabilidade]
[Estimativa por atendimento com base nos cadastros ativos]
[Servico] [Local] [Quantidade de alunos assumida]
[Receita da sessao] [Repasse] [Receita apos repasse] [Valor por hora]
[Como o resultado foi calculado]
```

Mobile must use stacked cards rather than a table-only layout. Headings, form labels,
keyboard navigation, accessible loading/error status, and text labels for negative
values are mandatory; color cannot be the only negative-result signal.

## Canonical Terminology

| Term | Allowed meaning | Avoid |
| --- | --- | --- |
| Receita da sessao | Gross calculated session revenue | Receita recebida |
| Repasse | Calculated amount owed to location | Custo total |
| Receita apos repasse | Gross minus transfer | Lucro, lucro liquido, margem |
| Valor por hora | Calculated net-after-transfer per hour | Salario por hora |
| Rentabilidade | Estimated operational view under this limited model | Accounting profitability |
| Cenario | Ephemeral simulator input set | Persisted offer |
| Comparacao | Normalized alternatives evaluation | Automatic recommendation |

`NAME_REVIEW_RECOMMENDED`: the tab name is acceptable only when the subtitle and
result copy preserve the estimated, post-transfer limitation above.

## Acceptance Criteria for a Future Implementation

1. Uses only active, authenticated-professional services, locations, and rules.
2. Requires and visibly labels an explicit student-count assumption.
3. Uses `calculateProfitability` unchanged and preserves invalid/negative outcomes.
4. Does not create, persist, rank, recommend, or modify scenarios or registrations.
5. Differentiates empty, partial, invalid, and system-error states.
6. Does not use profit/margin language or Finance data.
7. Preserves the Simulator as temporary what-if analysis and Comparator as normalized
   location comparison.
8. Includes responsive and accessibility validation for mobile, tablet, and desktop.

## Technical Notes

The current `ProfitabilityPanel` is shared by the Rentabilidade and Simulador tabs;
that is the overlap this definition resolves for a future implementation. No change is
authorized by this document alone. Client-side calculation is currently appropriate
for the small active source sets; a future implementation must avoid N+1 queries if
the source model grows.

Supabase change: `NO`. Migration: `NONE`. DB push: `NO`. Production action: `NO`.
