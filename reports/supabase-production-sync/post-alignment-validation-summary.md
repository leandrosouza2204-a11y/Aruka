# Post-Alignment Validation Summary

Decision: `READY_FOR_POST_ALIGNMENT_AND_DRY_RUN_COMMIT`

- Local migrations: `7`.
- Executable migrations: `6`.
- Reference-only baselines: `1`.
- Total database change artifacts reviewed: `7`.
- Local migration hashes preserved: `YES`.
- Canonical registry present: `YES`.
- Remote history count: `6`.
- Authorized present count: `6`.
- Baseline history present: `NO`.
- Unexpected history count: `0`.
- CLI migration list: `PASS`.
- CLI migration list exit code: `0`.
- CLI remote history count: `6`.
- PSQL remote history count: `6`.
- CLI/PSQL history match: `YES`.
- CLI baseline visible: `YES`.
- Remote baseline history present: `NO`.
- Baseline classification: `LOCAL_MIGRATION_VISIBLE_NOT_REMOTE_HISTORY`.
- Remote read-only validation: `COMPLETE`.
- Rollback confirmed: `YES`.
- Pending executable migrations: `0`.
- DB push dry-run supported: `YES`.
- Remote validation: `PASS`.
- Initial DB push dry-run decision: `BLOCKED_DB_PUSH_BASELINE_WOULD_BE_APPLIED`.
- Initial DB push dry-run exit code: `1`.
- Initial DB push dry-run pending versions: `20260716090000`.
- Initial DB push dry-run baseline pending: `YES`.
- Final DB push dry-run: `PASS`.
- Final DB push dry-run exit code: `0`.
- Final pending executable migrations: `0`.
- Final baseline pending: `NO`.
- DB push needed: `NO`.
- DB push allowed: `NO`.
- CI/CD classification: `CI_CD_READY_FOR_REVIEW`.
- Production mutation executed: `NO`.

Next action: `COMMIT_POST_ALIGNMENT_AND_DRY_RUN_THEN_REVIEW_CI_CD`.
