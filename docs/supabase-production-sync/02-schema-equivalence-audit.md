# Supabase Schema Equivalence Audit

Auditor decision: `AUDITOR_FALSE_POSITIVES_CORRECTED`.

Schema decision: `BLOCKED_REMOTE_SCHEMA_DRIFT`.

Production action required: `RECONCILIATION_REQUIRED`.

## Evidence

- Remote CSV files: 9
- Linked state: UNLINKED_FOR_SAFETY
- Evidence errors: none
- Function grant evidence: PARTIALLY_VERIFIED because remote CSV lacks function arguments/specific_name

## Summary

- Tables: total 20, equivalent 20, local-only 0, remote-only 0, different 0, partial 0
- Columns: total 326, equivalent 255, local-only 1, remote-only 0, different 70, partial 0
- Constraints: total 71, equivalent 65, local-only 1, remote-only 0, different 5, partial 0
- Indexes: total 87, equivalent 85, local-only 2, remote-only 0, different 0, partial 0
- RLS: total 20, equivalent 20, local-only 0, remote-only 0, different 0, partial 0
- Policies: total 59, equivalent 3, local-only 4, remote-only 4, different 48, partial 0
- Functions: total 25, equivalent 11, local-only 3, remote-only 5, different 6, partial 0
- Table grants: total 547, equivalent 333, local-only 0, remote-only 214, different 0, partial 0
- Function grants: total 63, equivalent 0, local-only 9, remote-only 11, different 0, partial 43

## Auditor Normalization Impact

- Critical: before 480, after 356, delta -124
- Defaults different: before 169, after 0, delta -169
- Constraints different: before 70, after 5, delta -65
- Policies different: before 51, after 48, delta -3
- Functions different: before 17, after 6, delta -11
- Local-only: before 20, after 20, delta 0
- Remote-only: before 100, after 234, delta 134
- Equivalent: before 737, after 792, delta 55

## Migration Coverage

- Baseline: divergent
- Workout delivery: divergent
- Student identity: absent

## Repair Assessment

- REPAIR_NOT_SAFE

## Critical Differences

- column alunos.acompanhamento_motivo: NULLABILITY_DIFFERENT (data_type: local_raw=text remote_raw=text local_norm=text remote_norm=text local_hash=7c9e690a remote_hash=7c9e690a; udt_name: local_raw=text remote_raw=text local_norm=text remote_norm=text local_hash=7c9e690a remote_hash=7c9e690a; is_nullable: local_raw=YES remote_raw=NO local_norm=YES remote_norm=NO local_hash=b8836b6 remote_hash=5974a2; column_default: local_raw=<null> remote_raw=''::text local_norm=null remote_norm='' local_hash=7c9b6140 remote_hash=596f73; ordinal_position: local_raw=19 remote_raw=19 local_norm=19 remote_norm=19 local_hash=5970cf remote_hash=5970cf)
- column alunos.created_at: NULLABILITY_DIFFERENT (data_type: local_raw=timestamp with time zone remote_raw=timestamp with time zone local_norm=timestamptz remote_norm=timestamptz local_hash=7acf37c7 remote_hash=7acf37c7; udt_name: local_raw=timestamptz remote_raw=timestamptz local_norm=timestamptz remote_norm=timestamptz local_hash=7acf37c7 remote_hash=7acf37c7; is_nullable: local_raw=NO remote_raw=YES local_norm=NO remote_norm=YES local_hash=5974a2 remote_hash=b8836b6; column_default: local_raw=now() remote_raw=now() local_norm=now() remote_norm=now() local_hash=1004652a remote_hash=1004652a; ordinal_position: local_raw=16 remote_raw=16 local_norm=16 remote_norm=16 local_hash=5970cc remote_hash=5970cc)
- column alunos.inicio: NULLABILITY_DIFFERENT (data_type: local_raw=date remote_raw=date local_norm=date remote_norm=date local_hash=7c959163 remote_hash=7c959163; udt_name: local_raw=date remote_raw=date local_norm=date remote_norm=date local_hash=7c959163 remote_hash=7c959163; is_nullable: local_raw=NO remote_raw=YES local_norm=NO remote_norm=YES local_hash=5974a2 remote_hash=b8836b6; column_default: local_raw=<null> remote_raw=null local_norm=null remote_norm=null local_hash=7c9b6140 remote_hash=7c9b6140; ordinal_position: local_raw=6 remote_raw=6 local_norm=6 remote_norm=6 local_hash=2b5db remote_hash=2b5db)
- column alunos.observacoes: NULLABILITY_DIFFERENT (data_type: local_raw=text remote_raw=text local_norm=text remote_norm=text local_hash=7c9e690a remote_hash=7c9e690a; udt_name: local_raw=text remote_raw=text local_norm=text remote_norm=text local_hash=7c9e690a remote_hash=7c9e690a; is_nullable: local_raw=NO remote_raw=YES local_norm=NO remote_norm=YES local_hash=5974a2 remote_hash=b8836b6; column_default: local_raw=''::text remote_raw=null local_norm='' remote_norm=null local_hash=596f73 remote_hash=7c9b6140; ordinal_position: local_raw=15 remote_raw=15 local_norm=15 remote_norm=15 local_hash=5970cb remote_hash=5970cb)
- column alunos.pagamento_recebido: NULLABILITY_DIFFERENT (data_type: local_raw=boolean remote_raw=boolean local_norm=bool remote_norm=bool local_hash=7c94b391 remote_hash=7c94b391; udt_name: local_raw=bool remote_raw=bool local_norm=bool remote_norm=bool local_hash=7c94b391 remote_hash=7c94b391; is_nullable: local_raw=NO remote_raw=YES local_norm=NO remote_norm=YES local_hash=5974a2 remote_hash=b8836b6; column_default: local_raw=false remote_raw=false local_norm=false remote_norm=false local_hash=f6bcef0 remote_hash=f6bcef0; ordinal_position: local_raw=13 remote_raw=13 local_norm=13 remote_norm=13 local_hash=5970c9 remote_hash=5970c9)
- column alunos.plano: NULLABILITY_DIFFERENT (data_type: local_raw=text remote_raw=text local_norm=text remote_norm=text local_hash=7c9e690a remote_hash=7c9e690a; udt_name: local_raw=text remote_raw=text local_norm=text remote_norm=text local_hash=7c9e690a remote_hash=7c9e690a; is_nullable: local_raw=NO remote_raw=YES local_norm=NO remote_norm=YES local_hash=5974a2 remote_hash=b8836b6; column_default: local_raw=<null> remote_raw=null local_norm=null remote_norm=null local_hash=7c9b6140 remote_hash=7c9b6140; ordinal_position: local_raw=10 remote_raw=10 local_norm=10 remote_norm=10 local_hash=5970c6 remote_hash=5970c6)
- column alunos.status: NULLABILITY_DIFFERENT (data_type: local_raw=text remote_raw=text local_norm=text remote_norm=text local_hash=7c9e690a remote_hash=7c9e690a; udt_name: local_raw=text remote_raw=text local_norm=text remote_norm=text local_hash=7c9e690a remote_hash=7c9e690a; is_nullable: local_raw=NO remote_raw=YES local_norm=NO remote_norm=YES local_hash=5974a2 remote_hash=b8836b6; column_default: local_raw='Ativo'::text remote_raw='Ativo'::text local_norm='ativo' remote_norm='ativo' local_hash=a891f676 remote_hash=a891f676; ordinal_position: local_raw=12 remote_raw=12 local_norm=12 remote_norm=12 local_hash=5970c8 remote_hash=5970c8)
- column alunos.student_user_id: LOCAL_ONLY (20260730090000_student_identity_contract.sql)
- column alunos.user_id: NULLABILITY_DIFFERENT (data_type: local_raw=uuid remote_raw=uuid local_norm=uuid remote_norm=uuid local_hash=7c9f377c remote_hash=7c9f377c; udt_name: local_raw=uuid remote_raw=uuid local_norm=uuid remote_norm=uuid local_hash=7c9f377c remote_hash=7c9f377c; is_nullable: local_raw=NO remote_raw=YES local_norm=NO remote_norm=YES local_hash=5974a2 remote_hash=b8836b6; column_default: local_raw=<null> remote_raw=null local_norm=null remote_norm=null local_hash=7c9b6140 remote_hash=7c9b6140; ordinal_position: local_raw=2 remote_raw=2 local_norm=2 remote_norm=2 local_hash=2b5d7 remote_hash=2b5d7)
- column alunos.valor: NULLABILITY_DIFFERENT (data_type: local_raw=numeric remote_raw=numeric local_norm=numeric remote_norm=numeric local_hash=301f0df8 remote_hash=301f0df8; udt_name: local_raw=numeric remote_raw=numeric local_norm=numeric remote_norm=numeric local_hash=301f0df8 remote_hash=301f0df8; is_nullable: local_raw=NO remote_raw=YES local_norm=NO remote_norm=YES local_hash=5974a2 remote_hash=b8836b6; column_default: local_raw=0 remote_raw=null local_norm=0 remote_norm=null local_hash=2b5d5 remote_hash=7c9b6140; ordinal_position: local_raw=11 remote_raw=11 local_norm=11 remote_norm=11 local_hash=5970c7 remote_hash=5970c7)
- column alunos.whatsapp: NULLABILITY_DIFFERENT (data_type: local_raw=text remote_raw=text local_norm=text remote_norm=text local_hash=7c9e690a remote_hash=7c9e690a; udt_name: local_raw=text remote_raw=text local_norm=text remote_norm=text local_hash=7c9e690a remote_hash=7c9e690a; is_nullable: local_raw=NO remote_raw=YES local_norm=NO remote_norm=YES local_hash=5974a2 remote_hash=b8836b6; column_default: local_raw=<null> remote_raw=null local_norm=null remote_norm=null local_hash=7c9b6140 remote_hash=7c9b6140; ordinal_position: local_raw=4 remote_raw=4 local_norm=4 remote_norm=4 local_hash=2b5d9 remote_hash=2b5d9)
- constraint alunos.alunos_student_user_id_fkey: LOCAL_ONLY (20260730090000_student_identity_contract.sql)
- constraint perfis.perfis_role_check: MATERIAL_DIFFERENCE (constraint_type: local_raw=c remote_raw=c local_norm=CHECK remote_norm=CHECK local_hash=ce413a3 remote_hash=ce413a3; definition: local_raw=CHECK ((role = ANY (ARRAY['admin'::text, 'user'::text, 'student'::text]))) remote_raw=CHECK (role = ANY (ARRAY['admin'::text, 'user'::text])) local_norm=check(role = any (array['admin', 'student', 'user'])) remote_norm=check(role = any (array['admin', 'user'])) local_hash=9bb295c4 remote_hash=1e5d0703)
- constraint treino_eventos.treino_eventos_metadata_object_check: MATERIAL_DIFFERENCE (constraint_type: local_raw=c remote_raw=c local_norm=CHECK remote_norm=CHECK local_hash=ce413a3 remote_hash=ce413a3; definition: local_raw=CHECK (((metadata IS NULL) OR (jsonb_typeof(metadata) = 'object'::text))) remote_raw=CHECK (metadata IS NULL OR jsonb_typeof(metadata) = 'object'::text) local_norm=check((metadata is null) or (jsonb_typeof(metadata) = 'object')) remote_norm=check(metadata is null or jsonb_typeof(metadata) = 'object') local_hash=58e03bf5 remote_hash=3f3519b3)
- constraint treinos.treinos_lifecycle_dates_check: MATERIAL_DIFFERENCE (constraint_type: local_raw=c remote_raw=c local_norm=CHECK remote_norm=CHECK local_hash=ce413a3 remote_hash=ce413a3; definition: local_raw=[len 228 hash e2ce4c0d] remote_raw=[len 214 hash b7bd6916] local_norm=[len 207 hash d24d5831] remote_norm=[len 195 hash e94a5a8b] local_hash=d24d5831 remote_hash=e94a5a8b)
- constraint treinos.treinos_template_origin_snapshot_object_check: MATERIAL_DIFFERENCE (constraint_type: local_raw=c remote_raw=c local_norm=CHECK remote_norm=CHECK local_hash=ce413a3 remote_hash=ce413a3; definition: local_raw=CHECK (((template_origin_snapshot IS NULL) OR (jsonb_typeof(template_origin_snapshot) = 'object'::text))) remote_raw=CHECK (template_origin_snapshot IS NULL OR jsonb_typeof(template_origin_snapshot) = 'object'::text) local_norm=check((template_origin_snapshot is null) or (jsonb_typeof(template_origin_snapshot) = 'object')) remote_norm=check(template_origin_snapshot is null or jsonb_typeof(template_origin_snapshot) = 'object') local_hash=14b1ccf7 remote_hash=27839835)
- constraint treinos.treinos_template_origin_type_check: MATERIAL_DIFFERENCE (constraint_type: local_raw=c remote_raw=c local_norm=CHECK remote_norm=CHECK local_hash=ce413a3 remote_hash=ce413a3; definition: local_raw=CHECK (((template_origin_type IS NULL) OR (template_origin_type = ANY (ARRAY['official'::text, 'personal'::text])))) remote_raw=CHECK (template_origin_type IS NULL OR (template_origin_type = ANY (ARRAY['official'::text, 'personal'::text]))) local_norm=check((template_origin_type is null) or (template_origin_type = any (array['official', 'personal']))) remote_norm=check(template_origin_type is null or (template_origin_type = any (array['official', 'personal']))) local_hash=de5ddaac remote_hash=aac7151b)
- function_grant admin_eh_admin.authenticated.execute: LOCAL_ONLY (20260716090000_baseline_aruka_v1.sql)
- function_grant admin_registrar_log.authenticated.execute: LOCAL_ONLY (20260716090000_baseline_aruka_v1.sql)
- function_grant admin_validar_acesso.authenticated.execute: LOCAL_ONLY (20260716090000_baseline_aruka_v1.sql)
- function_grant alterar_estado_treino.anon.execute: REMOTE_ONLY (20260728030000_workout_delivery_integration_v1.sql)
- function_grant aoe_idempotency_get_or_create.anon.execute: REMOTE_ONLY (20260716090000_baseline_aruka_v1.sql)
- function_grant aoe_user_owns_student.anon.execute: REMOTE_ONLY (20260716090000_baseline_aruka_v1.sql)
- function_grant desvincular_aluno_usuario.authenticated.execute: LOCAL_ONLY (20260730090000_student_identity_contract.sql)
- function_grant desvincular_aluno_usuario.postgres.execute: LOCAL_ONLY (20260730090000_student_identity_contract.sql)
- function_grant entregar_treino.anon.execute: REMOTE_ONLY (20260728030000_workout_delivery_integration_v1.sql)
- function_grant get_my_student_workouts.authenticated.execute: LOCAL_ONLY (20260730090000_student_identity_contract.sql)
- function_grant get_my_student_workouts.postgres.execute: LOCAL_ONLY (20260730090000_student_identity_contract.sql)
- function_grant salvar_treino_composto.anon.execute: REMOTE_ONLY (20260728030000_workout_delivery_integration_v1.sql)
- function_grant set_workout_templates_updated_at.anon.execute: REMOTE_ONLY (20260716090000_baseline_aruka_v1.sql)
- function_grant set_workout_templates_updated_at.public.execute: REMOTE_ONLY (20260716090000_baseline_aruka_v1.sql)
- function_grant vincular_aluno_usuario.authenticated.execute: LOCAL_ONLY (20260730090000_student_identity_contract.sql)
- function_grant vincular_aluno_usuario.postgres.execute: LOCAL_ONLY (20260730090000_student_identity_contract.sql)
- function admin_atualizar_perfil.p_user_id uuid, p_nome text, p_role text, p_tipo_acesso text, p_status text: REMOTE_OVERLOAD_ONLY (20260716090000_baseline_aruka_v1.sql)
- function admin_bloquear_usuario.p_user_id uuid: REMOTE_OVERLOAD_ONLY (20260716090000_baseline_aruka_v1.sql)
- function admin_liberar_assinante.p_user_id uuid, p_plano text, p_data_inicio date, p_data_vencimento date: REMOTE_OVERLOAD_ONLY (20260716090000_baseline_aruka_v1.sql)
- function admin_liberar_beta.p_user_id uuid: REMOTE_OVERLOAD_ONLY (20260716090000_baseline_aruka_v1.sql)
- function admin_listar_logs.p_acao text, p_target_user_id uuid, p_data_inicio date, p_data_fim date, p_busca text: BODY_DIFFERENT (return_type: local_raw=[len 277 hash 33ef26b] remote_raw=[len 277 hash 33ef26b] local_norm=[len 277 hash 8ee55b0b] remote_norm=[len 277 hash 8ee55b0b] local_hash=8ee55b0b remote_hash=8ee55b0b; security_definer: local_raw=true remote_raw=true local_norm=true remote_norm=true local_hash=7c9e9fe5 remote_hash=7c9e9fe5; volatility: local_raw=VOLATILE remote_raw=v local_norm=VOLATILE remote_norm=VOLATILE local_hash=51192625 remote_hash=51192625; definition: local_raw=[len 2217 hash 47c274e1] remote_raw=[len 2597 hash b99c082e] local_norm=[len 1924 hash 3ec521db] remote_norm=[len 2197 hash 9275210f] local_hash=3ec521db remote_hash=9275210f)
- function admin_listar_usuarios: BODY_DIFFERENT (return_type: local_raw=[len 208 hash 80b7f47b] remote_raw=[len 208 hash 80b7f47b] local_norm=[len 208 hash 201d791b] remote_norm=[len 208 hash 201d791b] local_hash=201d791b remote_hash=201d791b; security_definer: local_raw=true remote_raw=true local_norm=true remote_norm=true local_hash=7c9e9fe5 remote_hash=7c9e9fe5; volatility: local_raw=VOLATILE remote_raw=v local_norm=VOLATILE remote_norm=VOLATILE local_hash=51192625 remote_hash=51192625; definition: local_raw=[len 1267 hash bd75ea6d] remote_raw=[len 1393 hash 56b4a32d] local_norm=[len 1069 hash bf16df8] remote_norm=[len 1163 hash eafadef8] local_hash=bf16df8 remote_hash=eafadef8)
- function admin_registrar_log.p_target_user_id uuid, p_acao text, p_entidade text, p_entidade_id uuid, p_dados_anteriores jsonb, p_dados_novos jsonb, p_user_agent text: BODY_DIFFERENT (return_type: local_raw=uuid remote_raw=uuid local_norm=uuid remote_norm=uuid local_hash=7c9f377c remote_hash=7c9f377c; security_definer: local_raw=true remote_raw=true local_norm=true remote_norm=true local_hash=7c9e9fe5 remote_hash=7c9e9fe5; volatility: local_raw=VOLATILE remote_raw=v local_norm=VOLATILE remote_norm=VOLATILE local_hash=51192625 remote_hash=51192625; definition: local_raw=[len 894 hash 53a972a5] remote_raw=[len 1179 hash ac3b769d] local_norm=[len 698 hash 87baeeed] remote_norm=[len 911 hash 35b86b07] local_hash=87baeeed remote_hash=35b86b07)
- function admin_upsert_assinatura.p_user_id uuid, p_plano text, p_status text, p_data_inicio date, p_data_vencimento date: REMOTE_OVERLOAD_ONLY (20260716090000_baseline_aruka_v1.sql)
- function admin_upsert_assinatura.p_user_id uuid, p_plano text, p_status text, p_data_inicio date, p_data_vencimento date, p_user_agent text: BODY_DIFFERENT (return_type: local_raw=void remote_raw=void local_norm=void remote_norm=void local_hash=7c9faa57 remote_hash=7c9faa57; security_definer: local_raw=true remote_raw=true local_norm=true remote_norm=true local_hash=7c9e9fe5 remote_hash=7c9e9fe5; volatility: local_raw=VOLATILE remote_raw=v local_norm=VOLATILE remote_norm=VOLATILE local_hash=51192625 remote_hash=51192625; definition: local_raw=[len 1831 hash de03914e] remote_raw=[len 2023 hash c9c60e05] local_norm=[len 1609 hash ef3f521a] remote_norm=[len 1621 hash 601807d6] local_hash=ef3f521a remote_hash=601807d6)
- function aoe_idempotency_get_or_create.p_id text, p_actor_id uuid, p_organization_id uuid, p_operation text, p_idempotency_key text, p_request_fingerprint text: BODY_DIFFERENT (return_type: local_raw=jsonb remote_raw=jsonb local_norm=jsonb remote_norm=jsonb local_hash=fbe1be1 remote_hash=fbe1be1; security_definer: local_raw=true remote_raw=true local_norm=true remote_norm=true local_hash=7c9e9fe5 remote_hash=7c9e9fe5; volatility: local_raw=VOLATILE remote_raw=v local_norm=VOLATILE remote_norm=VOLATILE local_hash=51192625 remote_hash=51192625; definition: local_raw=[len 1087 hash 28872e48] remote_raw=[len 950 hash 2f57b34e] local_norm=[len 961 hash d608c583] remote_norm=[len 802 hash 3c58f6f8] local_hash=d608c583 remote_hash=3c58f6f8)
- function desvincular_aluno_usuario.p_aluno_id uuid: LOCAL_OVERLOAD_ONLY (20260730090000_student_identity_contract.sql)
- function get_my_student_workouts: LOCAL_OVERLOAD_ONLY (20260730090000_student_identity_contract.sql)
- function set_workout_templates_updated_at: BODY_DIFFERENT (return_type: local_raw=trigger remote_raw=trigger local_norm=trigger remote_norm=trigger local_hash=f6b58819 remote_hash=f6b58819; security_definer: local_raw=false remote_raw=false local_norm=false remote_norm=false local_hash=f6bcef0 remote_hash=f6bcef0; volatility: local_raw=VOLATILE remote_raw=v local_norm=VOLATILE remote_norm=VOLATILE local_hash=51192625 remote_hash=51192625; definition: local_raw=[len 209 hash 3079dcd4] remote_raw=[len 185 hash 6fa132d] local_norm=function set_workout_templates_updated_at() returns trigger  set search_path to 'public' as $ begin new.updated_at = now(); return new; end; $ remote_norm=function set_workout_templates_updated_at() returns trigger  as $ begin new.updated_at = now(); return new; end; $ local_hash=22ec5017 remote_hash=b0e0fcd9)
- function vincular_aluno_usuario.p_aluno_id uuid, p_student_user_id uuid: LOCAL_OVERLOAD_ONLY (20260730090000_student_identity_contract.sql)
- index alunos.alunos_student_user_id_idx: LOCAL_ONLY (20260730090000_student_identity_contract.sql)
- index alunos.alunos_student_user_id_uidx: LOCAL_ONLY (20260730090000_student_identity_contract.sql)
- policy aceites_legais.Usuarios podem listar seus aceites legais: REMOTE_MORE_PERMISSIVE (permissive: local_raw=PERMISSIVE remote_raw=PERMISSIVE local_norm=permissive remote_norm=permissive local_hash=e892274c remote_hash=e892274c; roles: local_raw={authenticated} remote_raw={public} local_norm=authenticated remote_norm=public local_hash=486e9848 remote_hash=159d94a4; cmd: local_raw=SELECT remote_raw=SELECT local_norm=select remote_norm=select local_hash=1b80e3c5 remote_hash=1b80e3c5; qual: local_raw=(auth.uid() = user_id) remote_raw=(auth.uid() = user_id) local_norm=auth.uid() = user_id remote_norm=auth.uid() = user_id local_hash=8dc18120 remote_hash=8dc18120; with_check: local_raw=<null> remote_raw=null local_norm=null remote_norm=null local_hash=7c9b6140 remote_hash=7c9b6140)
- ... 306 additional critical differences in JSON/matrix.

## Next Steps

- Review material differences object by object.
- Do not execute db push or migration repair until schema equivalence is proven.
- Collect signature-aware function grant evidence before final grant equivalence.

## Reconciliation Evidence Review

- Decision: `READY_FOR_RECONCILIATION_DESIGN`.
- Function grants are now compared by signature.
- Reconciliation inspection CSV is `RECONCILIATION_INSPECTION_PARTIAL`.
