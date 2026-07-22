# Validation Results

## Commands

- `npm.cmd run lint`: PASS.
- `npm.cmd run build`: PASS.
- `npm.cmd run qa:dashboard-environment-check`: PASS, 12 tests.
- `npm.cmd run qa:local:environment-check`: PASS after escalated rerun; first sandboxed run failed with `EACCES` on `npx supabase status`.
- `npm.cmd run qa:local:data`: PASS after escalated rerun and fixture adjustment; created 14 students.
- `npm.cmd run qa:alunos-functional-audit`: PASS.
- `npm.cmd run qa:alunos-authenticated`: PASS.
- `git diff --check`: PASS, only CRLF normalization warnings.
- `git check-ignore .env .env.local .env.qa.local .env.production`: PASS.
- Port check after QA: `5173 no listener`, `9222 no listener`.

## Findings by severity

- P0: none.
- P1: ALU-P1-001, missing integrated student actions to Treinos/Avaliacoes/Financeiro.
- P2: ALU-P2-001, partial URL/context preservation.
- P2: ALU-P2-002, no explicit duplicate prevention.
- P2: ALU-P2-003, empty/error states need dedicated fixture.
- P3: ALU-P3-001, filters/search are client-side.

## Decision

READY_WITH_LIMITATIONS.
