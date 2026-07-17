create schema if not exists extensions;
create schema if not exists vault;

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;
create extension if not exists supabase_vault with schema vault;

do $$
declare
  v_secret_exists boolean;
  v_job_id bigint;
begin
  select exists (
    select 1
    from vault.decrypted_secrets
    where name = 'encerramentos_automaticos_job_secret'
      and nullif(decrypted_secret, '') is not null
  )
  into v_secret_exists;

  if not v_secret_exists then
    raise exception 'Crie o secret encerramentos_automaticos_job_secret no Supabase Vault antes de agendar o processamento.';
  end if;

  for v_job_id in
    select jobid
    from cron.job
    where jobname = 'processar-encerramentos-automaticos-dry-run-diario'
  loop
    perform cron.unschedule(v_job_id);
  end loop;

  perform cron.schedule(
    'processar-encerramentos-automaticos-dry-run-diario',
    '0 6 * * *',
    $cron$
      select net.http_post(
        url := 'https://vrizeuhuhvtvbrmtvdik.supabase.co/functions/v1/processar-encerramentos-automaticos',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-job-secret', (
            select decrypted_secret
            from vault.decrypted_secrets
            where name = 'encerramentos_automaticos_job_secret'
            limit 1
          )
        ),
        body := jsonb_build_object(
          'dryRun', true
        ),
        timeout_milliseconds := 30000
      );
    $cron$
  );
end $$;
