insert into public.aceites_legais (
  id, user_id, politica_versao, termos_versao, politica_aceita, termos_aceitos, aceito_em, ip, user_agent, created_at
) values
  ('00000000-0000-4000-8000-000000000813', '00000000-0000-4000-8000-000000000801', 'cycle8-privacy-v1', 'cycle8-terms-v1', true, true, '2026-01-02T09:00:00Z', '127.0.0.1', 'cycle8-local-fixture', '2026-01-02T09:00:00Z'),
  ('00000000-0000-4000-8000-000000000814', '00000000-0000-4000-8000-000000000802', 'cycle8-privacy-v1', 'cycle8-terms-v1', true, true, '2026-01-02T09:05:00Z', '127.0.0.1', 'cycle8-local-fixture', '2026-01-02T09:05:00Z')
on conflict (id) do update set
  politica_versao = excluded.politica_versao,
  termos_versao = excluded.termos_versao,
  politica_aceita = excluded.politica_aceita,
  termos_aceitos = excluded.termos_aceitos,
  aceito_em = excluded.aceito_em,
  ip = excluded.ip,
  user_agent = excluded.user_agent;

insert into public.admin_logs (
  id, admin_user_id, target_user_id, acao, entidade, entidade_id, dados_anteriores, dados_novos, ip, user_agent, created_at
) values (
  '00000000-0000-4000-8000-000000000815',
  '00000000-0000-4000-8000-000000000801',
  '00000000-0000-4000-8000-000000000802',
  'cycle8_fixture_review',
  'perfis',
  '00000000-0000-4000-8000-000000000802',
  '{"status":"pendente"}'::jsonb,
  '{"status":"ativo","fixture":"cycle8"}'::jsonb,
  '127.0.0.1',
  'cycle8-local-fixture',
  '2026-01-02T10:00:00Z'
) on conflict (id) do update set
  acao = excluded.acao,
  dados_anteriores = excluded.dados_anteriores,
  dados_novos = excluded.dados_novos,
  ip = excluded.ip,
  user_agent = excluded.user_agent;
