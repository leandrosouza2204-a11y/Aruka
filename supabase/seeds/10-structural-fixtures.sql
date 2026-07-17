-- Local auth fixtures. These users are fictitious, local-only, and have no password or tokens.

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
) values
(
  '00000000-0000-4000-8000-000000000801',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin.cycle8@example.invalid',
  null,
  '2026-01-01T00:00:00Z',
  '2026-01-01T00:00:00Z',
  '2026-01-01T00:00:00Z',
  '{"provider":"email","providers":["email"],"fixture":"cycle8"}'::jsonb,
  '{"name":"Admin Cycle Eight","fixture":"cycle8"}'::jsonb,
  false
),
(
  '00000000-0000-4000-8000-000000000802',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'personal.cycle8@example.invalid',
  null,
  '2026-01-01T00:00:00Z',
  '2026-01-01T00:00:00Z',
  '2026-01-01T00:00:00Z',
  '{"provider":"email","providers":["email"],"fixture":"cycle8"}'::jsonb,
  '{"name":"Personal Cycle Eight","fixture":"cycle8"}'::jsonb,
  false
)
on conflict (id) do update set
  email = excluded.email,
  updated_at = excluded.updated_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data;

insert into public.perfis (id, user_id, nome, email, role, tipo_acesso, status, created_at)
values
  ('00000000-0000-4000-8000-000000000801', '00000000-0000-4000-8000-000000000801', 'Admin Cycle Eight', 'admin.cycle8@example.invalid', 'admin', 'admin', 'ativo', '2026-01-01T00:00:00Z'),
  ('00000000-0000-4000-8000-000000000802', '00000000-0000-4000-8000-000000000802', 'Personal Cycle Eight', 'personal.cycle8@example.invalid', 'user', 'assinante', 'ativo', '2026-01-01T00:00:00Z')
on conflict (id) do update set
  nome = excluded.nome,
  email = excluded.email,
  role = excluded.role,
  tipo_acesso = excluded.tipo_acesso,
  status = excluded.status;
