insert into public.treinos (
  id, user_id, aluno_id, nome_rotina, objetivo, nivel, dias_semana, observacoes, status, data_inicio, data_revisao, created_at
) values (
  '00000000-0000-4000-8000-000000000821',
  '00000000-0000-4000-8000-000000000802',
  '00000000-0000-4000-8000-000000000821',
  'Cycle8 Rotina A',
  'Hipertrofia ficticia',
  'Intermediario',
  3,
  'fixture:cycle8 treino local',
  'Ativo',
  '2026-01-12',
  '2026-02-12',
  '2026-01-12T09:00:00Z'
) on conflict (id) do update set
  nome_rotina = excluded.nome_rotina,
  objetivo = excluded.objetivo,
  nivel = excluded.nivel,
  dias_semana = excluded.dias_semana,
  observacoes = excluded.observacoes,
  status = excluded.status,
  data_inicio = excluded.data_inicio,
  data_revisao = excluded.data_revisao;

insert into public.treino_dias (id, treino_id, nome, grupo_muscular, ordem, created_at)
values (
  '00000000-0000-4000-8000-000000000831',
  '00000000-0000-4000-8000-000000000821',
  'Cycle8 Dia A',
  'Superiores',
  1,
  '2026-01-12T09:05:00Z'
) on conflict (id) do update set
  nome = excluded.nome,
  grupo_muscular = excluded.grupo_muscular,
  ordem = excluded.ordem;

insert into public.treino_exercicios (
  id, treino_dia_id, nome, series, repeticoes, carga, descanso, observacoes, video_url, ordem, created_at
) values
  ('00000000-0000-4000-8000-000000000841', '00000000-0000-4000-8000-000000000831', 'Cycle8 Supino Ficticio', '3', '10', 'moderada', '60s', 'fixture:cycle8 exercicio 1', '', 1, '2026-01-12T09:10:00Z'),
  ('00000000-0000-4000-8000-000000000842', '00000000-0000-4000-8000-000000000831', 'Cycle8 Remada Ficticia', '3', '12', 'leve', '60s', 'fixture:cycle8 exercicio 2', '', 2, '2026-01-12T09:15:00Z')
on conflict (id) do update set
  nome = excluded.nome,
  series = excluded.series,
  repeticoes = excluded.repeticoes,
  carga = excluded.carga,
  descanso = excluded.descanso,
  observacoes = excluded.observacoes,
  video_url = excluded.video_url,
  ordem = excluded.ordem;

insert into public.workout_templates (
  id, owner_id, name, reference_gender, split_type, objective, level, description,
  template_data, is_system, is_active, created_at, updated_at
) values (
  '00000000-0000-4000-8000-000000000851',
  '00000000-0000-4000-8000-000000000802',
  'Cycle8 Template Local',
  'Unissex',
  'ABC',
  'Hipertrofia ficticia',
  'Intermediario',
  'Template local deterministico do Ciclo 8',
  '{"fixture":"cycle8","days":[{"name":"A","exercises":["Cycle8 Supino Ficticio","Cycle8 Remada Ficticia"]}]}'::jsonb,
  false,
  true,
  '2026-01-12T10:00:00Z',
  '2026-01-12T10:00:00Z'
) on conflict (id) do update set
  name = excluded.name,
  reference_gender = excluded.reference_gender,
  split_type = excluded.split_type,
  objective = excluded.objective,
  level = excluded.level,
  description = excluded.description,
  template_data = excluded.template_data,
  is_system = excluded.is_system,
  is_active = excluded.is_active,
  updated_at = excluded.updated_at;
