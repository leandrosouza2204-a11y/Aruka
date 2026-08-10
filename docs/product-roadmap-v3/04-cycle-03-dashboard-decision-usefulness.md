# Roadmap v3 Cycle 03 - Dashboard Decision Usefulness

Decision: `READY_FOR_ROADMAP_V3_CYCLE_04`

Scope: authenticated local Dashboard at `/dashboard`, using existing data only. No production access, no database change, no CI change and no new analytics source.

## Data Sources

| Block | Component | Source | Hook/service | Metric | Refresh | Loading | Error | CTA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Onboarding | `DashboardOnboardingChecklist` | planos, alunos, pagamentos | `useDashboardPage` | setup completion | page load | inherited page state | inherited page state | planos, alunos, financeiro |
| Alerts | `DashboardAlertas` | alunos, pagamentos, planos | `montarAlertasConsultoria` | vencidos, vencendo, receita pendente | page load | inline loading | contextual page error | alunos, financeiro |
| Metric cards | `DashboardCards` | alunos, pagamentos, planos | `useDashboardPage` | totals and finance values | page load | placeholder value | contextual page error | alunos, financeiro |
| Check-in | `DashboardCheckin` | alunos and computed status | `useDashboardPage` | eligible students | page load | disabled action | contextual page error | WhatsApp modal |
| Training/evaluation signals | `DashboardSinaisFitness` | treinos, avaliacoes, alunos | `montarSinaisFitness` | missing active workout, due review, missing evaluation | page load | inline loading | contextual warning | treinos, avaliacoes |
| Revenue history | `DashboardAtalhos` | pagamentos | `gerarReceitaMensal` | confirmed monthly revenue | page load | inline loading | contextual page error | none |

## Metric Inventory

| Metric | Origin | Update | Action | Interpretation risk |
| --- | --- | --- | --- | --- |
| Total de Alunos | `alunos.length` | page load | Ver alunos | Low |
| Receita Prevista | sum of current student values | page load | none | Medium, expected value is not cash received |
| Receita Recebida | sum of registered payments | page load | none | Low |
| Receita Pendente | current contract value minus current contract payments | page load | Revisar financeiro | Medium, depends on contract/payment linkage |
| Alunos Vencendo | computed student status | page load | Ver vencimentos | Low |
| Alunos Vencidos | computed student status | page load | Ver vencidos | Low |
| Check-in semanal | non-expired students | page load | Enviar check-ins | Low |
| Sem treino ativo | non-expired students without active workout | page load | Abrir Treinos | Low |
| Treinos a revisar | workouts with review date due today or earlier | page load | Abrir Treinos | Low |
| Sem avaliacao | non-expired students without evaluation | page load | Abrir Avaliacoes | Low |
| Receita mensal | payments grouped by month | page load | none | Low |

## Findings

`DASH-R01` P1 `WEAK_HIERARCHY`: actionable alerts were rendered after broad summary cards, reducing first-fold decision usefulness on mobile and desktop.

Fix: moved `DashboardAlertas` before the metric card grid.

`DASH-R02` P2 `NO_CTA`: critical metric cards communicated state but did not provide a direct next action.

Fix: added CTAs for total students, pending finance, expiring students and expired students. The routes already exist.

`DASH-R03` P2 `ERROR`: primary Dashboard load failure could expose raw service error text.

Fix: replaced raw service message composition with contextual copy.

## Classification

Actionable blocks before: 4.

Actionable blocks after: 5.

The Dashboard remains a daily decision surface, not a BI surface. No retention, churn, engagement or risk score was introduced.

## Validation

Baseline QAs were executed before changes. Existing Dashboard runtime QA confirmed no overflow failures and showed the first fold prioritization gap. New QA `qa:dashboard-decision-usefulness` validates objective structure, CTAs and unsupported metric guard.

Regression suite after changes is recorded in the Cycle 03 result report.

Next action: `START_STUDENT_EXPERIENCE_CONTINUITY`.
