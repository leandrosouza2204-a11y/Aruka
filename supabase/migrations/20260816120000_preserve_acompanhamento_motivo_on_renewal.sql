do $$
declare
  v_sql text;
begin
  select pg_get_functiondef(p.oid) into v_sql
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'renovar_aluno_contrato'
    and pg_get_function_identity_arguments(p.oid) = 'p_aluno_id uuid, p_novo_plano_id uuid, p_novo_inicio date, p_novo_vencimento date, p_novo_valor numeric, p_registrar_pagamento boolean, p_forma_pagamento text, p_observacao text, p_event_key text';

  if v_sql is null then
    raise exception 'RENOVAR_ALUNO_CONTRATO_NOT_FOUND';
  end if;

  if position('acompanhamento_motivo = null' in v_sql) = 0 then
    raise exception 'RENOVAR_ALUNO_CONTRATO_NULL_ASSIGNMENT_NOT_FOUND';
  end if;

  execute replace(
    v_sql,
    'acompanhamento_motivo = null',
    'acompanhamento_motivo = coalesce(v_aluno.acompanhamento_motivo, '''')'
  );
end;
$$;

grant execute on function public.renovar_aluno_contrato(uuid, uuid, date, date, numeric, boolean, text, text, text) to authenticated, service_role;
