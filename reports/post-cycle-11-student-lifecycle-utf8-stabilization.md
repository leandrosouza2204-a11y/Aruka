# Post-Cycle 11 Student Lifecycle and UTF-8 Stabilization

Baseline: `d99630a51ff4a493b8163d86646bfa0ff51ecade`

## Lifecycle Diagnosis

The canonical lifecycle source already exists in `public.alunos`:
`acompanhamento_status`, `acompanhamento_encerrado_em`, and
`acompanhamento_motivo`. The valid closed states are `encerrado`,
`nao_renovado`, and `cancelado`; lifecycle events preserve closure,
reactivation, and renewal history.

Financeiro already used this source through `calcularSituacaoAcompanhamento`.
Student Management and the Dashboard independently derived operational state
from contract due dates and billing attention. That let an explicitly closed
student be rendered as overdue and counted as a renewal action.

The correction reuses the existing lifecycle source:

- `ativo` remains operational.
- An overdue contract with active lifecycle remains a renewal candidate.
- Explicitly closed or not-renewed students leave the default operational
  list, remain available through the `Encerrado` filter, and do not feed
  renewal alerts or operational fitness signals.
- Financial installments and pending payment calculations remain independent
  from lifecycle closure.
- Existing Financeiro reactivation and renewal paths restore
  `acompanhamento_status` to `ativo` while preserving event history.

No schema change, migration, database push, or production data action is
required.

## UTF-8 Diagnosis

`.editorconfig` already requires `charset = utf-8`, and repository writing
scripts use explicit Node `utf8` read/write encoding. The apparent widespread
corruption observed in PowerShell was primarily console decoding, not invalid
UTF-8 bytes in application files.

The repository-wide scan found one real corrupted historical report string and
two validation regexes that accepted corrupted text. They were normalized.
Five deliberate malformed-string fixtures remain allowlisted by exact path in
`scripts/validate-visible-ui-copy.mjs`; the AOE import parser remains outside
this validator because it intentionally accepts legacy external document
headers.

The existing visible-copy validator now scans all tracked textual source,
configuration, documentation, report, and SQL files for mojibake. Editorial
copy checks remain limited to UI surfaces, avoiding false failures in historic
documentation and QA scripts.

## Validation

- Lifecycle unit tests and full `test:alunos`: PASS.
- Dashboard decision-usefulness and focused Cycle 11 checks: PASS.
- UTF-8/mojibake validator: PASS.
- Supabase preflight and validation: PASS.
- Lint and production build: PASS.

Authenticated browser/CDP checks for dashboard and Alunos were not executed:
the local CDP endpoint at `127.0.0.1:9222` was unavailable. Manual QA remains
required for the live browser views and physical device breakpoints.

## Residual Risk

Persisted production text was not inspected or modified. No evidence of
corrupted persisted data was available from the repository-only audit;
`DATA_REMEDIATION_REQUIRED=NO` for this change set.
