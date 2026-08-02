# Production Package Migration Inventory

Migration count: `7`

| Migration | Domain | Classification | Strategy | Risk |
| --- | --- | --- | --- | --- |
| `20260716090000_baseline_aruka_v1.sql` | BASELINE | `BASELINE_REFERENCE_ONLY` | `SKIP_REFERENCE_ONLY` | HIGH |
| `20260728030000_workout_delivery_integration_v1.sql` | WORKOUT_DELIVERY | `REQUIRES_OBJECT_LEVEL_RECONCILIATION` | `OBJECT_LEVEL_RECONCILIATION` | MEDIUM |
| `20260730090000_student_identity_contract.sql` | STUDENT_IDENTITY | `REMOTE_ABSENT_SAFE_CANDIDATE` | `CONTROLLED_SQL_FILE` | HIGH |
| `20260731190000_reconcile_security_policies_and_grants.sql` | SECURITY | `REMOTE_PENDING_RECONCILIATION` | `CONTROLLED_SQL_FILE` | HIGH |
| `20260801143335_reconcile_alunos_required_fields.sql` | NULLABILITY | `REMOTE_PENDING_RECONCILIATION` | `CONTROLLED_SQL_FILE` | MEDIUM |
| `20260801173000_revoke_aoe_idempotency_anon_execute.sql` | AOE_SECURITY | `REMOTE_PENDING_RECONCILIATION` | `CONTROLLED_SQL_FILE` | LOW |
| `20260801180000_harden_workout_templates_updated_at.sql` | GROUP_A_SECURITY | `REMOTE_PENDING_RECONCILIATION` | `CONTROLLED_SQL_FILE` | LOW |
