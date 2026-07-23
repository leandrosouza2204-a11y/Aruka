# Validation Results

## Passed

- `node --check scripts/validate-treinos-functional-audit-cdp.mjs`
- `git diff --check`
- `npm.cmd run qa:dashboard-environment-check`
- `npm.cmd run qa:local:environment-check` with sandbox escalation
- `npm.cmd run qa:local:data` with sandbox escalation
- `npm.cmd run qa:treinos-functional-audit`
- `npm.cmd run lint`
- `npm.cmd run build` with sandbox escalation after ACL block
- `npm.cmd run qa:workout-templates-data`
- `npm.cmd run qa:workout-template-sanitization`
- `npm.cmd run qa:treinos-mobile`
- `npm.cmd run qa:treino-editor-mobile`
- `npm.cmd run qa:treino-templates-mobile`
- `npm.cmd run qa:alunos-query-context`

## Limited Or Failed

- `npm.cmd run qa:treino-exercises-mobile`: process stayed open without output after parallel CDP execution and was stopped manually. Treat as inconclusive.
- `npm.cmd run qa:alunos-authenticated`: printed authentication success, then failed waiting for `[data-testid="aluno-form-modal"]`. Treat as failed regression, unrelated to code changes in this audit.

## Fixture Status

Final restore:

- alunos: 14
- planos: 2
- pagamentos: 14
- treinos: 1
- avaliacoes: 1

## Notes

- Existing Supabase local checks require escalation in this environment because `npx supabase status` touches npm cache/network outside the sandbox.
- Build initially hit a sandbox ACL process error and passed after approved escalation.
