# Gate 7 Clean Worktree HML Contract

- Decision: READY_FOR_CI_GATE7_HML_FIX_COMMIT
- HML meaning: protected Aruka_HML Supabase project ref guardrail.
- Producer: `scripts/test-supabase-clean-worktree.ps1`
- Consumers: `scripts/test-supabase-clean-worktree-wrapper.mjs`, `scripts/validate-supabase-local-reproducibility.mjs`
- Root cause: empty `supabase/.temp/project-ref` was counted as HML preservation. In isolated CI, empty ref must count as `false`.
- Expected preservation: LOCAL=`true`, ISOLATED_CI=`false`
- Actual preservation before: `true`
- Actual preservation after: LOCAL=`true`, ISOLATED_CI=`false`
- Isolated CI setup: HML assertion passed under simulated isolated CI; local Docker context guardrail remained fail-closed.
- Gate 7: PASS
- Gate 8: PASS
- Gate 9: PASS
- Cycle 9.1: PASS_STATIC_NEGATIVE_PREPARE
- Production accessed: NO
- DB push needed: NO
