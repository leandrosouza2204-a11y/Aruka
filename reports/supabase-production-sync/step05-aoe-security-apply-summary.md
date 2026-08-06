# Step05 AOE Security Production Apply

Decision: `STEP05_AOE_SECURITY_APPLIED_AND_VALIDATED`

- Authorization: explicit Step05 production apply authorization received for the confirmed maintenance window.
- Fresh precheck: `PASS`.
- Target function: `public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text)`.
- Target role: `anon`.
- Anon execute before apply: `YES`.
- Apply: `PASS`, exit code `0`.
- Postcheck: `PASS`, exit code `0`.
- Anon execute final: `NO`.
- Apply hash: `CEE9E1BFDE421B2C85480C1EB2C0DAFA4FDA994F94832DA777B85508657B8CF4`.
- Recovery executed: `NO`.
- Step06 authorized: `NO`.
- Step06 executed: `NO`.
- Next action: `STEP06_GROUP_A_SECURITY_PRECHECK_PREPARATION`.
