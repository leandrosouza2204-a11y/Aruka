# G4.1 risk matrix

| ID | Risk | Likelihood | Impact | Current recovery | Required treatment | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Production drift after audit or backup | Possible | Critical | Abort before write; restore for post-write uncertainty | Repeat history/catalog/hash checks and take fresh snapshot in the window | Blocker until preflight |
| R2 | Storage object bytes absent from database backup | Confirmed | High for full DR | Metadata only | Formal `DATABASE_ONLY` acceptance or separately approved encrypted byte backup | Human decision |
| R3 | 17 anonymous `SECURITY DEFINER` executions in current production | Confirmed | Critical | Forward-only remediation or restore | Apply all 16 steps; require advisor/catalog count 0 after step 16 | Blocker if nonzero post-chain |
| R4 | Leaked-password protection disabled | Confirmed | High | Platform configuration | Security owner accepts temporarily or schedules separately authorized enablement | Human decision |
| R5 | Operational order differs from timestamp order | Confirmed | Critical | Staged atomic execution; restore for uncertainty | Use only the 16-step approved order; never plain `db push` | Blocker on order mismatch |
| R6 | Partial/uncertain migration commit | Possible | Critical | Fresh snapshot and isolated restore procedure | Stop, preserve maintenance, determine history/schema atomically; no repair without DBA proof | Blocker |
| R7 | Rollout accidentally enabled or target seeded | Low with controls | Critical | Master OFF/emergency block and application fallback | Validate OFF/false/zero after rollout migration and after deploy | Blocker |
| R8 | Published bundle calls missing V2 RPCs before schema | Mitigated | High | V1 fallback | Current bundle capability false; do not deploy capability true before database validation | Accepted while controls hold |
| R9 | Vercel private env/logs unavailable to auditor | Confirmed | High | Operator inspection | Authorized operator opens settings/logs and records names/status before first write | Blocker until preflight |
| R10 | Edge Functions use `verify_jwt=false` | Confirmed pre-existing | High | In-function authorization and rollback | Preserve functions, review boundary; do not redeploy in G4.2 | Human security decision |
| R11 | Auth 4xx events during observation | Observed, low volume | Moderate | Inspect aggregate/log context without user data | Establish baseline; stop on sustained rate or user-flow regression | Monitor |
| R12 | Frontend/PWA rollback incompatibility | Possible | High | Previous Vercel deployment; forward-compatible schema | Retain prior deployment and V1 contracts; never drop new schema in UI rollback | Accepted with mitigation |
