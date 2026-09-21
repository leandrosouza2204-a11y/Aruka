# Cycle 12.11 — Integrated Student Experience V2 Audit Report

## Executive result

- Audit decision: **AUDIT_COMPLETE**
- Release recommendation: **NO-GO pending QA evidence stabilization and human acceptance**
- Branch/HEAD: `main` / `d3caa30293bbff51d72d0e80b513d2c0ff3f2c8a`
- Initial worktree: clean and aligned with `origin/main`
- Functional changes made: none
- Production access/mutation: none
- Publishing operations: none

The integrated runtime contracts passed with local synthetic identities. No confirmed Student Experience V2 authorization or tenant-isolation defect was found. The current release evidence is not yet reliable enough for rollout because Home visual QA is not self-contained and Training Library visual QA asserts an obsolete post-start route while retaining a stale PASS report.

## Audit boundary and method

The audit reconstructed Cycles 12.1–12.10 from repository history, roadmap documents, application routes, services, domain normalization, migrations and QA harnesses. It then executed static/unit tests, local PostgreSQL authorization/runtime matrices, browser/CDP visual tests, PWA checks, lint, build, schema lint and advisors.

The Supabase changelog was checked before database inspection. Relevant current context includes Postgres 17 for self-hosted defaults and the transition to explicit Data API grants for new tables. The repository already configures Postgres 17 and leaves `auto_expose_new_tables` unset, matching the safer default. This audit did not change configuration.

## Route and contract inventory

| Route | Boundary | Reads | Mutations/navigation |
| --- | --- | --- | --- |
| `/minha-area` | authenticated legacy | legacy daily payload | legacy execution flow |
| `/minha-area/inicio` | authenticated + V2 flag + active student | `get_my_student_home_v2` | starts/resumes canonical session |
| `/minha-area/treinos` | same | library summary | selects/starts/resumes |
| `/minha-area/treinos/:workoutId` | same | lazy workout detail | returns with focus; starts/resumes |
| `/minha-area/treino/:sessionId` | same, focused layout | bounded Player payload; previous performance lazy | complete set, skip, cancel, complete workout |
| `/minha-area/evolucao` | same | frequency, valid history, assessments | read-only |
| `/minha-area/perfil` | same | profile RPC + current Auth user | logout |
| `/workout/:sessionId` | legacy compatibility | none | replace to `/minha-area` |
| `/contato-alunos` | active professional | own settings | save own published channels |

## Integrated data invariants

- Identity is always derived from the authenticated user in server contracts.
- Student access requires a unique `alunos.student_user_id` link and active access status.
- A session is started with a canonical idempotency key and only one active session is exposed.
- Prescription and tracking data are snapshotted for execution and remain immutable.
- Set persistence is keyed by execution exercise and set number; equal concurrent retries produced zero duplicates.
- Timer reconstruction uses server time plus persisted set completion and prescribed rest; visual ticks produce zero writes.
- Only completed sessions enter valid history, Home metrics and Evolution.
- Workout completion is explicit, zero-set guarded and short-duration confirmed at `<=300s` using server duration.
- Disabled contact channels and inactive-professional information are removed server-side.
- Profile requests verify the authenticated identity before and after the RPC to reject late cross-session responses.

## Authorization evidence

All Cycle 12.2–12.10 local runtime matrices passed after the non-destructive local stack start. Covered actors/states were own student, cross-student, unrelated professional, cross-professional, anonymous, unlinked, suspended, revoked and terminal session. Direct writes to command-owned execution/feedback tables were denied where expected. V2 definer functions inspected use an empty search path and least-privilege execute grants.

No service-role key was found in frontend consumers. Runtime validators reported `production_accessed=false` and `production_mutated=false`.

## Commands and outcomes

| Command/group | Outcome |
| --- | --- |
| Git pre-flight | PASS; expected branch and SHA; clean start |
| `npm.cmd run supabase:preflight` | PASS |
| `npx ... supabase start` | PASS; existing stack, no reset |
| `npm.cmd run supabase:validate` | PASS |
| Cycle 12.2 runtime + canonical security | PASS |
| Cycle 12.3–12.10 static/unit | PASS |
| Cycle 12.3–12.10 runtime | PASS |
| `supabase:seed:local` + fixture validation | PASS; reserved synthetic fixture namespace only |
| Visual 12.3 | BLOCKED before browser by missing fixture identity |
| Visual 12.4 | PARTIAL PASS, then FAIL on obsolete route assertion |
| Visual 12.5 | PASS, 10 screenshots |
| Visual 12.6 | PASS, 11 screenshots |
| Visual 12.7 | PASS, 18 screenshots |
| Visual 12.9 | PASS, 5 screenshots |
| Visual 12.10 | PASS, 9 screenshots |
| PWA six-gate group | PASS |
| Route fallback / continuity | PASS |
| Authenticated runtime unit tests | PASS, 18/18 |
| `npm.cmd run lint` | PASS |
| `npm.cmd run build` | PASS; service worker/precache generated |
| `supabase db lint --local --schema public` | completed with 1 error + 2 warnings |
| `supabase db advisors --local --type all` | 62 WARN, all `auth_rls_initplan` |
| Migration list | V2 migrations aligned; baseline represented as history-only entry |
| `git diff --check` | PASS; somente avisos de normalização LF/CRLF |

Ao final, a working tree contém exclusivamente os dois novos entregáveis e relatórios/evidências locais regenerados pelos validadores (runtime, visual, pre-flight e seed). Nenhum arquivo funcional, migration ou configuração de produto foi modificado.

Initial 12.2 runtime attempts failed only because the database container was not started. They passed after the validated non-destructive start and are not product failures. Visual 12.9 initially failed because its professional Cycle 8 fixture was absent; it passed after the documented deterministic local seed and fixture validation.

## Findings register

| ID | Category | Module | Severity | Release block | Summary |
| --- | --- | --- | --- | --- | --- |
| C12.11-G01 | G validation limitation | Library → Player QA | high | yes | visual gate expects `/minha-area`, while product contract navigates to `/minha-area/treino/:sessionId`; stale PASS JSON survives abort |
| C12.11-G02 | G validation limitation | Home QA | high | yes | visual gate depends on an external local user/link/program and fails with `invalid_credentials` on a valid clean fixture state |
| C12.11-G03 | G validation limitation | integrated visual/a11y | medium | yes for final acceptance | incomplete 390 coverage, no dedicated 12.8 browser gate, no physical/PWA-installed/screen-reader/landscape validation |
| C12.11-A01 | A functional defect | legacy admin schema | medium | no for Student V2 | ambiguous overloaded `admin_upsert_assinatura` call; two unused PL/pgSQL variables |
| C12.11-E01 | E performance risk | legacy RLS | medium | no, pending measurement | 62 `auth_rls_initplan` warnings across existing policies |
| C12.11-F01 | F not implemented | product backlog | informational | no | chat, notifications, self-edit, evolution graphs and advanced feedback/analytics intentionally deferred |

### Reproduction: C12.11-G01

1. Start validated local Supabase without reset.
2. Run `npm.cmd run qa:cycle-12-4-training-library-visual`.
3. The gate creates local synthetic users/data and passes normal responsive, detail, long text, loading and error checks.
4. It double-clicks the first workout start button.
5. Product code calls `navigate(buildStudentWorkoutPlayerRoute(session.id))`.
6. The gate waits for `location.pathname === '/minha-area'` and times out at line 145.
7. The existing `reports/cycle-12-4-training-library-visual.json` remains `decision: PASS`, demonstrating non-atomic/stale evidence.

Expected correction: assert the canonical Player URL and always write a fresh FAIL/PARTIAL report before cleanup when execution aborts.

### Reproduction: C12.11-G02

1. Use a validated local stack without the manually provisioned `student.qa.local@aruka.test` account.
2. Run `npm.cmd run qa:cycle-12-3-student-home-visual`.
3. The script invokes `signInWithPassword` before creating any fixture.
4. Auth returns `invalid_credentials`; no browser assertions execute.

Expected correction: allocate unique local identities and all dependent rows inside the gate, verify loopback target, and remove them in `finally`.

### Evidence: C12.11-A01

`supabase db lint --local --schema public` returned SQLSTATE `42725`: the six-argument call from `admin_liberar_assinante` cannot select a unique `admin_upsert_assinatura` overload. It also reported unread `v_status` and `v_plan` variables in `admin_subscription_lifecycle_action`. These findings predate Cycle 12.11 and were not modified.

### Evidence: C12.11-E01

Local advisors returned 62 WARN findings of one type: `auth_rls_initplan`. The warning means `auth.*`/`current_setting()` expressions can be reevaluated per row. Cycle 12 V2 bounded RPC query-plan checks passed, so this is a repository-scale optimization risk rather than a measured V2 regression.

## Performance and resilience

Validated locally:

- Home: one bounded RPC.
- Library: one summary request plus one lazy detail; 1,639 B and 1,091 B representative payloads.
- Player: one initial request; 2,212 B representative payload.
- Tracking: one write per confirmed completion, one previous-performance request per exercise, 1,500 B Player payload.
- Evolution: three parallel, independent and bounded reads; history 20 by default and clamped to 50.
- Retry/idempotency, concurrent equal writes, divergent conflict, refresh/resume, terminal immutability and partial-section errors passed.

Not measured: production latency, Core Web Vitals, CPU/memory on low-end devices, real packet loss, long-duration backgrounding or production cardinality. No production extrapolation is made.

## Accessibility and visual limitations

Headless checks provide evidence for DOM semantics, programmatic names, focus, target size, responsive overflow and reduced-motion CSS. They do not substitute for VoiceOver/TalkBack/NVDA, native app handoff, virtual keyboard behavior or physical-device safe areas. Completion feedback currently has static accessibility assertions but no dedicated browser state matrix.

## Release pending items

Blocking before human acceptance/rollout:

1. Fix and rerun C12.11-G01 with fresh fail-closed evidence.
2. Make and rerun C12.11-G02 with self-contained fixtures.
3. Add 390 px and completion-feedback coverage across the integrated matrix.
4. Complete physical-device/PWA-installed/a11y/native-link checks.
5. Run the full integrated suite in an approved staging environment with rollout OFF, then controlled ON, using synthetic accounts.

Non-blocking but required for repository hardening:

1. Resolve the ambiguous admin overload and PL/pgSQL warnings.
2. Triage and benchmark the 62 RLS advisor warnings.
3. Record a formal risk decision for deferred product capabilities.

## Proposed future cycles

- 12.12: deterministic integrated QA harness and evidence integrity.
- 12.13: schema lint and RLS performance hardening.
- 12.14: real-device, installed-PWA, accessibility and adverse-network validation.
- 12.15: staging acceptance, rollback rehearsal and controlled rollout decision.

## Acceptance exit criteria

The next audit may return GO only when every required gate produces current evidence from the same SHA, all integrated transitions succeed, the actor matrix remains isolated, schema lint has no error, visual coverage includes all required widths/states, physical assistive/device checks pass, and a human explicitly approves rollout. Until then, the V2 remains OFF by default.
