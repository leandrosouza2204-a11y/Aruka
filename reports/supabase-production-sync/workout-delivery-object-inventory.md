# Workout Delivery Object Inventory

Migration: `supabase/migrations/20260728030000_workout_delivery_integration_v1.sql`

Objects inventoried: `53`

| Type | Object | Source |
| --- | --- | --- |
| table | `public.treino_eventos` | created by workout delivery migration |
| column | `public.treinos.lifecycle_status text default 'draft' not null` | altered by workout delivery migration |
| column | `public.treinos.template_origin_id text` | altered by workout delivery migration |
| column | `public.treinos.template_origin_type text` | altered by workout delivery migration |
| column | `public.treinos.template_origin_name text` | altered by workout delivery migration |
| column | `public.treinos.template_origin_snapshot jsonb` | altered by workout delivery migration |
| column | `public.treinos.applied_by uuid` | altered by workout delivery migration |
| column | `public.treinos.applied_at timestamptz` | altered by workout delivery migration |
| column | `public.treinos.delivered_by uuid` | altered by workout delivery migration |
| column | `public.treinos.delivered_at timestamptz` | altered by workout delivery migration |
| column | `public.treinos.completed_at timestamptz` | altered by workout delivery migration |
| column | `public.treinos.archived_at timestamptz` | altered by workout delivery migration |
| column | `public.treinos.data_fim date` | altered by workout delivery migration |
| column | `public.treinos.data_revisao date` | altered by workout delivery migration |
| column | `public.treinos.application_idempotency_key text` | altered by workout delivery migration |
| column | `public.treino_eventos.id uuid default gen_random_uuid() not null` | created by workout delivery migration |
| column | `public.treino_eventos.treino_id uuid not null` | created by workout delivery migration |
| column | `public.treino_eventos.user_id uuid not null` | created by workout delivery migration |
| column | `public.treino_eventos.aluno_id uuid not null` | created by workout delivery migration |
| column | `public.treino_eventos.event_type text not null` | created by workout delivery migration |
| column | `public.treino_eventos.from_status text` | created by workout delivery migration |
| column | `public.treino_eventos.to_status text` | created by workout delivery migration |
| column | `public.treino_eventos.actor_id uuid` | created by workout delivery migration |
| column | `public.treino_eventos.metadata jsonb default '{}'::jsonb not null` | created by workout delivery migration |
| column | `public.treino_eventos.occurred_at timestamptz default now() not null` | created by workout delivery migration |
| column | `public.treino_eventos.created_at timestamptz default now() not null` | created by workout delivery migration |
| constraint | `public.treinos.treinos_lifecycle_status_check` | created or replaced by workout delivery migration |
| constraint | `public.treinos.treinos_template_origin_type_check` | created or replaced by workout delivery migration |
| constraint | `public.treinos.treinos_template_origin_snapshot_object_check` | created or replaced by workout delivery migration |
| constraint | `public.treinos.treinos_lifecycle_dates_check` | created or replaced by workout delivery migration |
| constraint | `public.treino_eventos.treino_eventos_pkey` | created or replaced by workout delivery migration |
| constraint | `public.treino_eventos.treino_eventos_treino_id_fkey` | created or replaced by workout delivery migration |
| constraint | `public.treino_eventos.treino_eventos_aluno_id_fkey` | created or replaced by workout delivery migration |
| constraint | `public.treino_eventos.treino_eventos_event_type_check` | created or replaced by workout delivery migration |
| constraint | `public.treino_eventos.treino_eventos_metadata_object_check` | created or replaced by workout delivery migration |
| index | `public.treinos.treinos_user_aluno_lifecycle_idx` | created by workout delivery migration |
| index | `public.treinos.treinos_user_delivered_at_idx` | created by workout delivery migration |
| index | `public.treinos.treinos_user_template_origin_idx` | created by workout delivery migration |
| index | `public.treinos.treinos_user_application_idempotency_uidx` | created by workout delivery migration |
| index | `public.treino_eventos.treino_eventos_user_treino_occurred_idx` | created by workout delivery migration |
| index | `public.treino_eventos.treino_eventos_user_aluno_occurred_idx` | created by workout delivery migration |
| index | `public.treino_eventos.treino_eventos_treino_event_type_idx` | created by workout delivery migration |
| rls | `public.treino_eventos.row_level_security` | enabled by workout delivery migration |
| policy | `public.treino_eventos.Usuarios podem listar eventos dos seus treinos` | created by workout delivery migration |
| grant | `public.treino_eventos anon all revoked` | defined by workout delivery migration and hardened by Phase 1 where applicable |
| grant | `public.treino_eventos authenticated select` | defined by workout delivery migration and hardened by Phase 1 where applicable |
| grant | `public.salvar_treino_composto(jsonb) authenticated execute` | defined by workout delivery migration and hardened by Phase 1 where applicable |
| grant | `public.entregar_treino(uuid) authenticated execute` | defined by workout delivery migration and hardened by Phase 1 where applicable |
| grant | `public.alterar_estado_treino(uuid,text) authenticated execute` | defined by workout delivery migration and hardened by Phase 1 where applicable |
| function | `public.salvar_treino_composto(jsonb)` | security definer with search_path=public in workout delivery migration |
| function | `public.entregar_treino(uuid)` | security definer with search_path=public in workout delivery migration |
| function | `public.alterar_estado_treino(uuid,text)` | security definer with search_path=public in workout delivery migration |
| trigger | `none` | workout delivery migration does not create triggers |
