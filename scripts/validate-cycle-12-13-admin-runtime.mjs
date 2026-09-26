import assert from "node:assert/strict";
import { runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
assert.equal(validateLocalGuard(root).ok, true, "local-only guard must pass");

const ids = {
  admin: "00000000-0000-4000-8000-000000131301",
  target: "00000000-0000-4000-8000-000000131302",
  nonAdmin: "00000000-0000-4000-8000-000000131303",
};

const result = runPsql(root, `
begin;

insert into auth.users(
  id, instance_id, aud, role, email, confirmation_token, recovery_token,
  email_change_token_new, email_change_token_current, email_change,
  phone_change, phone_change_token, reauthentication_token,
  email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin
)
select id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', email,
       '', '', '', '', '', '', '', '', now(), now(), now(), '{}', '{}', false
from (values
  ('${ids.admin}'::uuid, 'cycle-12-13-admin@example.invalid'),
  ('${ids.target}'::uuid, 'cycle-12-13-target@example.invalid'),
  ('${ids.nonAdmin}'::uuid, 'cycle-12-13-user@example.invalid')
) fixture(id, email)
on conflict (id) do nothing;

insert into public.perfis(user_id, nome, email, role, tipo_acesso, status)
values
  ('${ids.admin}', 'Cycle 12.13 Admin', 'cycle-12-13-admin@example.invalid', 'admin', 'admin', 'ativo'),
  ('${ids.target}', 'Cycle 12.13 Target', 'cycle-12-13-target@example.invalid', 'user', 'pendente', 'ativo'),
  ('${ids.nonAdmin}', 'Cycle 12.13 User', 'cycle-12-13-user@example.invalid', 'user', 'assinante', 'ativo')
on conflict (user_id) do update set
  nome = excluded.nome, email = excluded.email, role = excluded.role,
  tipo_acesso = excluded.tipo_acesso, status = excluded.status;

delete from public.assinaturas where user_id = '${ids.target}';
delete from public.admin_logs where target_user_id = '${ids.target}';

set local role authenticated;
select set_config('request.jwt.claim.sub', '${ids.admin}', true);

select public.admin_liberar_assinante(
  '${ids.target}', 'Mensal', current_date, current_date + 30, 'cycle-12-13-wrapper'
);

reset role;
do $$
declare
  v_row public.assinaturas%rowtype;
  v_log_count integer;
begin
  select * into strict v_row from public.assinaturas where user_id = '${ids.target}' order by created_at desc limit 1;
  if v_row.status <> 'ativo' or v_row.grace_until is not null or v_row.cancel_at_period_end then
    raise exception 'WRAPPER_STATE_REGRESSION';
  end if;
  select count(*) into v_log_count from public.admin_logs where target_user_id = '${ids.target}';
  if v_log_count < 3 then raise exception 'WRAPPER_LOG_REGRESSION'; end if;
end;
$$;

set local role authenticated;
select set_config('request.jwt.claim.sub', '${ids.admin}', true);
select public.admin_subscription_lifecycle_action('${ids.target}', 'enter_grace', p_grace_until => current_date + 37, p_user_agent => 'cycle-12-13');
select public.admin_subscription_lifecycle_action('${ids.target}', 'extend_grace', p_grace_until => current_date + 44, p_user_agent => 'cycle-12-13');
select public.admin_subscription_lifecycle_action('${ids.target}', 'suspend_subscription', p_user_agent => 'cycle-12-13');
select public.admin_subscription_lifecycle_action('${ids.target}', 'reactivate_subscription', p_plano => 'Mensal', p_data_inicio => current_date, p_data_vencimento => current_date + 30, p_user_agent => 'cycle-12-13');
select public.admin_subscription_lifecycle_action('${ids.target}', 'schedule_cancellation', p_user_agent => 'cycle-12-13');
select public.admin_subscription_lifecycle_action('${ids.target}', 'cancel_now', p_user_agent => 'cycle-12-13');
select public.admin_subscription_lifecycle_action('${ids.target}', 'mark_paid', p_plano => 'Mensal', p_data_inicio => current_date, p_data_vencimento => current_date + 30, p_user_agent => 'cycle-12-13');

-- Explicit modern overload remains callable and unambiguous.
select public.admin_upsert_assinatura(
  '${ids.target}', 'Mensal', 'ativo', current_date, current_date + 30,
  'cycle-12-13-modern', null::date, false
);

do $$
declare
  v_invalid_denied boolean := false;
  v_non_admin_denied boolean := false;
begin
  begin
    perform public.admin_subscription_lifecycle_action('${ids.target}', 'invalid_action', p_user_agent => 'cycle-12-13');
  exception when others then
    if sqlerrm like 'Acao de lifecycle invalida:%' then v_invalid_denied := true; else raise; end if;
  end;
  if not v_invalid_denied then raise exception 'INVALID_ACTION_WAS_ALLOWED'; end if;

  perform set_config('request.jwt.claim.sub', '${ids.nonAdmin}', true);
  begin
    perform public.admin_liberar_assinante('${ids.target}', 'Mensal', current_date, current_date + 30, 'cycle-12-13-non-admin');
  exception when others then
    if sqlerrm like 'Acesso negado:%' then v_non_admin_denied := true; else raise; end if;
  end;
  if not v_non_admin_denied then raise exception 'NON_ADMIN_WAS_ALLOWED'; end if;
end;
$$;

reset role;
set local role anon;
do $$
declare
  v_anon_denied boolean := false;
begin
  begin
    perform public.admin_liberar_assinante('${ids.target}', 'Mensal', current_date, current_date + 30, 'cycle-12-13-anon');
  exception when insufficient_privilege then
    v_anon_denied := true;
  end;
  if not v_anon_denied then raise exception 'ANON_WAS_ALLOWED'; end if;
end;
$$;

reset role;
rollback;

select 'CYCLE_12_13_ADMIN_RUNTIME=PASS';
select 'CYCLE_12_13_WRAPPER_REGRESSION=PASS';
select 'CYCLE_12_13_SEVEN_ACTION_REGRESSION=PASS';
select 'CYCLE_12_13_NON_ADMIN_DENIED=YES';
select 'CYCLE_12_13_ANON_DENIED=YES';
`, { timeoutMs: 120000 });

assert.match(result.stdout, /CYCLE_12_13_ADMIN_RUNTIME=PASS/);
assert.match(result.stdout, /CYCLE_12_13_WRAPPER_REGRESSION=PASS/);
assert.match(result.stdout, /CYCLE_12_13_SEVEN_ACTION_REGRESSION=PASS/);
assert.match(result.stdout, /CYCLE_12_13_NON_ADMIN_DENIED=YES/);
assert.match(result.stdout, /CYCLE_12_13_ANON_DENIED=YES/);
console.log(result.stdout.trim());
