# Product Roadmap v4 - Cycle 11.6 Location Comparator Report

Stage: `11.6 - Comparador de Locais`

Decision: `CALCULATED_ONLY`

Supabase change: `NO`

Finance integration: `NO`

## Reference Scenario

Service: `Personal em Dupla`

Pricing: `R$ 70 por aluno/sessão`

Student count: `2`

Duration: `60 minutos`

## Expected A/B/C Results

| Local | Rule | Gross | Transfer | Net after transfer | Hourly |
| --- | --- | ---: | ---: | ---: | ---: |
| Academia A | Tiered: 2 alunos = R$ 100 | R$ 140 | R$ 100 | R$ 40 | R$ 40/h |
| Academia B | Fixed: R$ 75 | R$ 140 | R$ 75 | R$ 65 | R$ 65/h |
| Academia C | None | R$ 140 | R$ 0 | R$ 140 | R$ 140/h |

Gross invariant: `PASS`

Same service invariant: `PASS`

Same student count invariant: `PASS`

Same duration invariant: `PASS`

## QA Commands

- `npm.cmd run qa:smart-management-location-comparator`
- `npm.cmd run qa:smart-management-location-comparator-calculations`
- `npm.cmd run qa:smart-management-location-comparator-responsive`
- `npm.cmd run qa:smart-management-location-comparator-accessibility`
- `npm.cmd run qa:smart-management-profitability-engine`
- `npm.cmd run qa:smart-management-smart-simulator`
- `npm.cmd run lint`
- `npm.cmd run build`
- `git diff --check`
