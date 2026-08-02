# Production Cutover Sequence

## 00 reference only; never replay baseline directly

- Source: `20260716090000_baseline_aruka_v1.sql`
- Apply method: `SKIP_REFERENCE_ONLY`
- Precheck: baseline object inventory and migration history inspected
- Postcheck: no baseline SQL applied
- Rollback: restore from backup if any accidental baseline replay occurs
- Stop: any plan proposes full baseline replay
- Risk: `HIGH`

## 01 object-level Workout Delivery convergence

- Source: `20260728030000_workout_delivery_integration_v1.sql`
- Apply method: `OBJECT_LEVEL_RECONCILIATION`
- Precheck: columns/constraints/indexes/RPCs/grants compared object by object
- Postcheck: Workout Delivery contract and smoke tests pass
- Rollback: rollback changed RPCs/grants/constraints from captured definitions
- Stop: remote object exists with incompatible definition
- Risk: `MEDIUM`

## 02 controlled Student Identity contract apply

- Source: `20260730090000_student_identity_contract.sql`
- Apply method: `CONTROLLED_SQL_FILE`
- Precheck: alunos/perfis/auth.users present; Student Identity objects absent or compatible
- Postcheck: student identity link/unlink/reader smoke tests pass
- Rollback: drop newly added student identity objects only if no production link data was created
- Stop: identity model conflict or incompatible existing student_user_id
- Risk: `MEDIUM`

## 03 security policy/grant reconciliation

- Source: `20260731190000_reconcile_security_policies_and_grants.sql`
- Apply method: `CONTROLLED_SQL_FILE`
- Precheck: referenced tables/functions exist
- Postcheck: professional isolation and anon denial pass
- Rollback: restore captured policies/grants
- Stop: unexpected permissive policy or missing function
- Risk: `HIGH`

## 04 set required aluno fields not null

- Source: `20260801143335_reconcile_alunos_required_fields.sql`
- Apply method: `CONTROLLED_SQL_FILE`
- Precheck: created_at/user_id/whatsapp null counts are zero
- Postcheck: NOT NULL confirmed and aluno create/update smoke passes
- Rollback: drop NOT NULL only if rollback approved
- Stop: any null count greater than zero
- Risk: `MEDIUM`

## 05 revoke anon execute from AOE idempotency RPC

- Source: `20260801173000_revoke_aoe_idempotency_anon_execute.sql`
- Apply method: `CONTROLLED_SQL_FILE`
- Precheck: function signature exists
- Postcheck: anon denied; authenticated/service_role expected grants remain
- Rollback: restore anon grant only if emergency compatibility rollback approved
- Stop: function signature missing
- Risk: `LOW`
## 06 set search_path and revoke direct public/anon/authenticated execute

- Source: `20260801180000_harden_workout_templates_updated_at.sql`
- Apply method: `CONTROLLED_SQL_FILE`
- Precheck: function, trigger and body hash still match evidence
- Postcheck: trigger works; direct grants revoked
- Rollback: restore function metadata/grants from captured definitions
- Stop: body hash changed since evidence
- Risk: `LOW`
