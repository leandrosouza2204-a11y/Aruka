# Clean Worktree Reproducibility

- Result: CLEAN_WORKTREE_WITH_REMEDIATION
- Project ID: aruka_clean_worktree_validation
- Remote access: none
- npm ci: passed
- preflight: passed
- bootstrap: passed
- validate: passed
- stop: passed
- Migration history: 20260716090000
- Inventory: 19 public tables, 14 public functions, 1 trigger, 56 explicit indexes, 54 public policies, 4 storage policies, 19 RLS-enabled public tables, private bucket `avaliacoes-fotos`
- Cleanup observed: no registered temporary worktree, no temp directory, no temporary containers, no temporary volumes
- Remediation: the PowerShell wrapper still hangs during post-processing/finalization after successful runtime evidence; stabilize before promoting this QA as mandatory CI gate.
