# Workout Delivery Cutover Object Review

Remote pending objects reviewed: `50`

| # | Type | Object | Action | Dependency | Risk |
| --- | --- | --- | --- | --- | --- |
| 01 | TABLE | `public.treino_eventos` | `ADD_NEW_OBJECT` | `01-workout-delivery` | LOW |
| 02 | COLUMN | `public.treinos.lifecycle_status text default 'draft' not null` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 03 | COLUMN | `public.treinos.template_origin_id text` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 04 | COLUMN | `public.treinos.template_origin_type text` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 05 | COLUMN | `public.treinos.template_origin_name text` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 06 | COLUMN | `public.treinos.template_origin_snapshot jsonb` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 07 | COLUMN | `public.treinos.applied_by uuid` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 08 | COLUMN | `public.treinos.applied_at timestamptz` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 09 | COLUMN | `public.treinos.delivered_by uuid` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 10 | COLUMN | `public.treinos.delivered_at timestamptz` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 11 | COLUMN | `public.treinos.completed_at timestamptz` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 12 | COLUMN | `public.treinos.archived_at timestamptz` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 13 | COLUMN | `public.treinos.data_fim date` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 14 | COLUMN | `public.treinos.data_revisao date` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 15 | COLUMN | `public.treinos.application_idempotency_key text` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 16 | COLUMN | `public.treino_eventos.id uuid default gen_random_uuid() not null` | `ADD_NEW_OBJECT` | `01-workout-delivery` | LOW |
| 17 | COLUMN | `public.treino_eventos.treino_id uuid not null` | `ADD_NEW_OBJECT` | `01-workout-delivery` | LOW |
| 18 | COLUMN | `public.treino_eventos.user_id uuid not null` | `ADD_NEW_OBJECT` | `01-workout-delivery` | LOW |
| 19 | COLUMN | `public.treino_eventos.aluno_id uuid not null` | `ADD_NEW_OBJECT` | `01-workout-delivery` | LOW |
| 20 | COLUMN | `public.treino_eventos.event_type text not null` | `ADD_NEW_OBJECT` | `01-workout-delivery` | LOW |
| 21 | COLUMN | `public.treino_eventos.from_status text` | `ADD_NEW_OBJECT` | `01-workout-delivery` | LOW |
| 22 | COLUMN | `public.treino_eventos.to_status text` | `ADD_NEW_OBJECT` | `01-workout-delivery` | LOW |
| 23 | COLUMN | `public.treino_eventos.actor_id uuid` | `ADD_NEW_OBJECT` | `01-workout-delivery` | LOW |
| 24 | COLUMN | `public.treino_eventos.metadata jsonb default '{}'::jsonb not null` | `ADD_NEW_OBJECT` | `01-workout-delivery` | LOW |
| 25 | COLUMN | `public.treino_eventos.occurred_at timestamptz default now() not null` | `ADD_NEW_OBJECT` | `01-workout-delivery` | LOW |
| 26 | COLUMN | `public.treino_eventos.created_at timestamptz default now() not null` | `ADD_NEW_OBJECT` | `01-workout-delivery` | LOW |
| 27 | CONSTRAINT | `public.treinos.treinos_lifecycle_status_check` | `REPLACE_CONSTRAINT` | `01-workout-delivery` | MEDIUM |
| 28 | CONSTRAINT | `public.treinos.treinos_lifecycle_dates_check` | `REPLACE_CONSTRAINT` | `01-workout-delivery` | MEDIUM |
| 29 | CONSTRAINT | `public.treino_eventos.treino_eventos_pkey` | `REPLACE_CONSTRAINT` | `01-workout-delivery` | MEDIUM |
| 30 | CONSTRAINT | `public.treino_eventos.treino_eventos_treino_id_fkey` | `REPLACE_CONSTRAINT` | `01-workout-delivery` | MEDIUM |
| 31 | CONSTRAINT | `public.treino_eventos.treino_eventos_aluno_id_fkey` | `REPLACE_CONSTRAINT` | `01-workout-delivery` | MEDIUM |
| 32 | CONSTRAINT | `public.treino_eventos.treino_eventos_event_type_check` | `REPLACE_CONSTRAINT` | `01-workout-delivery` | MEDIUM |
| 33 | INDEX | `public.treinos.treinos_user_aluno_lifecycle_idx` | `CREATE_INDEX_IF_ABSENT` | `01-workout-delivery` | LOW |
| 34 | INDEX | `public.treinos.treinos_user_delivered_at_idx` | `CREATE_INDEX_IF_ABSENT` | `01-workout-delivery` | LOW |
| 35 | INDEX | `public.treinos.treinos_user_template_origin_idx` | `CREATE_INDEX_IF_ABSENT` | `01-workout-delivery` | LOW |
| 36 | INDEX | `public.treinos.treinos_user_application_idempotency_uidx` | `CREATE_INDEX_IF_ABSENT` | `01-workout-delivery` | LOW |
| 37 | INDEX | `public.treino_eventos.treino_eventos_user_treino_occurred_idx` | `CREATE_INDEX_IF_ABSENT` | `01-workout-delivery` | LOW |
| 38 | INDEX | `public.treino_eventos.treino_eventos_user_aluno_occurred_idx` | `CREATE_INDEX_IF_ABSENT` | `01-workout-delivery` | LOW |
| 39 | INDEX | `public.treino_eventos.treino_eventos_treino_event_type_idx` | `CREATE_INDEX_IF_ABSENT` | `01-workout-delivery` | LOW |
| 40 | RLS | `public.treino_eventos.row_level_security` | `ALTER_EXISTING_OBJECT` | `01-workout-delivery` | LOW |
| 41 | POLICY | `public.treino_eventos.Usuarios podem listar eventos dos seus treinos` | `CREATE_POLICY_IF_ABSENT` | `01-workout-delivery` | LOW |
| 42 | GRANT | `public.treino_eventos anon all revoked` | `DEFER_TO_PHASE1_SECURITY` | `03-security-reconciliation` | LOW |
| 43 | GRANT | `public.treino_eventos authenticated select` | `DEFER_TO_PHASE1_SECURITY` | `03-security-reconciliation` | LOW |
| 44 | GRANT | `public.salvar_treino_composto(jsonb) authenticated execute` | `DEFER_TO_PHASE1_SECURITY` | `03-security-reconciliation` | LOW |
| 45 | GRANT | `public.entregar_treino(uuid) authenticated execute` | `DEFER_TO_PHASE1_SECURITY` | `03-security-reconciliation` | LOW |
| 46 | GRANT | `public.alterar_estado_treino(uuid,text) authenticated execute` | `DEFER_TO_PHASE1_SECURITY` | `03-security-reconciliation` | LOW |
| 47 | FUNCTION | `public.salvar_treino_composto(jsonb)` | `REPLACE_FUNCTION_DEFINITION` | `01-workout-delivery` | MEDIUM |
| 48 | FUNCTION | `public.entregar_treino(uuid)` | `REPLACE_FUNCTION_DEFINITION` | `01-workout-delivery` | MEDIUM |
| 49 | FUNCTION | `public.alterar_estado_treino(uuid,text)` | `REPLACE_FUNCTION_DEFINITION` | `01-workout-delivery` | MEDIUM |
| 50 | TRIGGER | `none` | `NO_ACTION_REMOTE_ALREADY_COMPATIBLE` | `01-workout-delivery` | LOW |
