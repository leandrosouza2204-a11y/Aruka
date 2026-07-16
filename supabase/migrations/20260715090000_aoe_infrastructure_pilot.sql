create extension if not exists "pgcrypto";

create table if not exists public.aoe_decisions (
  id text primary key,
  request_id text not null,
  actor_id uuid not null references auth.users(id) on delete restrict,
  student_id uuid not null references public.alunos(id) on delete restrict,
  organization_id uuid,
  status text not null,
  selected_model_code text,
  selected_model_version text,
  selected_apl_release text,
  alternatives jsonb not null default '[]'::jsonb,
  compatibility_score numeric,
  raw_score numeric,
  confidence_score numeric,
  confidence_level text,
  risk_score numeric,
  risk_level text,
  ambiguity_level text,
  warnings jsonb not null default '[]'::jsonb,
  reason_codes jsonb not null default '[]'::jsonb,
  human_review_required boolean not null default false,
  human_review_id text,
  versions jsonb not null default '{}'::jsonb,
  public_response jsonb not null,
  trace_reference jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.aoe_decision_traces (
  id text primary key,
  decision_id text not null references public.aoe_decisions(id) on delete cascade,
  organization_id uuid,
  trace_version text not null,
  trace_payload jsonb not null,
  redaction_version text not null default '1.0.0',
  created_at timestamptz not null default now()
);

create table if not exists public.aoe_human_reviews (
  id text primary key,
  decision_id text not null references public.aoe_decisions(id) on delete cascade,
  organization_id uuid,
  status text not null,
  required boolean not null default true,
  blocking boolean not null default false,
  reason_codes jsonb not null default '[]'::jsonb,
  checklist jsonb not null default '[]'::jsonb,
  reviewer_id uuid references auth.users(id) on delete restrict,
  reviewer_role text,
  adjustments jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint aoe_human_reviews_notes_length check (char_length(notes) <= 500)
);

create table if not exists public.aoe_idempotency_keys (
  id text primary key,
  actor_id uuid not null references auth.users(id) on delete restrict,
  organization_id uuid,
  operation text not null,
  idempotency_key text not null,
  request_fingerprint text not null,
  status text not null,
  decision_id text references public.aoe_decisions(id) on delete set null,
  response_payload jsonb,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.aoe_audit_events (
  id text primary key,
  event_type text not null,
  actor_id uuid,
  actor_role text,
  organization_id uuid,
  resource_type text,
  resource_id text,
  request_id text,
  correlation_id text,
  outcome text not null,
  metadata jsonb not null default '{}'::jsonb,
  versions jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create unique index if not exists aoe_idempotency_unique_key
on public.aoe_idempotency_keys(coalesce(organization_id, '00000000-0000-0000-0000-000000000000'::uuid), actor_id, operation, idempotency_key);
create unique index if not exists aoe_human_reviews_one_active_per_decision on public.aoe_human_reviews(decision_id);
create index if not exists aoe_decisions_request_idx on public.aoe_decisions(request_id);
create index if not exists aoe_decisions_student_idx on public.aoe_decisions(student_id);
create index if not exists aoe_decisions_actor_idx on public.aoe_decisions(actor_id);
create index if not exists aoe_decisions_org_idx on public.aoe_decisions(organization_id);
create index if not exists aoe_decisions_model_idx on public.aoe_decisions(selected_model_code);
create index if not exists aoe_traces_decision_idx on public.aoe_decision_traces(decision_id);
create index if not exists aoe_reviews_decision_idx on public.aoe_human_reviews(decision_id);
create index if not exists aoe_idempotency_expires_idx on public.aoe_idempotency_keys(expires_at);
create index if not exists aoe_audit_org_event_date_idx on public.aoe_audit_events(organization_id, event_type, occurred_at desc);

alter table public.aoe_decisions enable row level security;
alter table public.aoe_decision_traces enable row level security;
alter table public.aoe_human_reviews enable row level security;
alter table public.aoe_idempotency_keys enable row level security;
alter table public.aoe_audit_events enable row level security;

create or replace function public.aoe_user_owns_student(p_student_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.alunos
    where alunos.id = p_student_id
      and alunos.user_id = auth.uid()
  );
$$;

create or replace function public.aoe_idempotency_get_or_create(
  p_id text,
  p_actor_id uuid,
  p_organization_id uuid,
  p_operation text,
  p_idempotency_key text,
  p_request_fingerprint text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.aoe_idempotency_keys%rowtype;
  v_inserted integer := 0;
begin
  insert into public.aoe_idempotency_keys (
    id, actor_id, organization_id, operation, idempotency_key, request_fingerprint, status
  )
  values (
    p_id, p_actor_id, p_organization_id, p_operation, p_idempotency_key, p_request_fingerprint, 'PROCESSING'
  )
  on conflict on constraint aoe_idempotency_keys_pkey do nothing;

  get diagnostics v_inserted = row_count;

  select * into v_row
  from public.aoe_idempotency_keys
  where id = p_id
  for update;

  return jsonb_build_object('created', v_inserted > 0, 'record', to_jsonb(v_row));
end;
$$;

drop policy if exists "Usuarios podem listar decisoes AOE dos seus alunos" on public.aoe_decisions;
create policy "Usuarios podem listar decisoes AOE dos seus alunos"
on public.aoe_decisions for select
using (actor_id = auth.uid() or public.admin_eh_admin() or public.aoe_user_owns_student(student_id));

drop policy if exists "Usuarios podem criar decisoes AOE dos seus alunos" on public.aoe_decisions;
create policy "Usuarios podem criar decisoes AOE dos seus alunos"
on public.aoe_decisions for insert
with check (actor_id = auth.uid() and public.aoe_user_owns_student(student_id));

drop policy if exists "Usuarios podem consultar reviews AOE autorizadas" on public.aoe_human_reviews;
create policy "Usuarios podem consultar reviews AOE autorizadas"
on public.aoe_human_reviews for select
using (exists (select 1 from public.aoe_decisions d where d.id = decision_id and (d.actor_id = auth.uid() or public.admin_eh_admin())));

drop policy if exists "Usuarios podem criar reviews AOE autorizadas" on public.aoe_human_reviews;
create policy "Usuarios podem criar reviews AOE autorizadas"
on public.aoe_human_reviews for insert
with check (exists (select 1 from public.aoe_decisions d where d.id = decision_id and d.actor_id = auth.uid()));

drop policy if exists "Usuarios podem atualizar reviews AOE autorizadas" on public.aoe_human_reviews;
create policy "Usuarios podem atualizar reviews AOE autorizadas"
on public.aoe_human_reviews for update
using (exists (select 1 from public.aoe_decisions d where d.id = decision_id and d.actor_id = auth.uid()))
with check (exists (select 1 from public.aoe_decisions d where d.id = decision_id and d.actor_id = auth.uid()));

drop policy if exists "Traces AOE restritos ao profissional autorizado" on public.aoe_decision_traces;
create policy "Traces AOE restritos ao profissional autorizado"
on public.aoe_decision_traces for select
using (exists (select 1 from public.aoe_decisions d where d.id = decision_id and (d.actor_id = auth.uid() or public.admin_eh_admin())));

drop policy if exists "Idempotencia AOE restrita ao ator" on public.aoe_idempotency_keys;
create policy "Idempotencia AOE restrita ao ator"
on public.aoe_idempotency_keys for all
using (actor_id = auth.uid() or public.admin_eh_admin())
with check (actor_id = auth.uid() or public.admin_eh_admin());

drop policy if exists "Auditoria AOE somente admin leitura" on public.aoe_audit_events;
create policy "Auditoria AOE somente admin leitura"
on public.aoe_audit_events for select
using (public.admin_eh_admin());

revoke all on function public.aoe_user_owns_student(uuid) from public;
revoke all on function public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text) from public;
grant execute on function public.aoe_user_owns_student(uuid) to authenticated;
grant execute on function public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text) to authenticated;
