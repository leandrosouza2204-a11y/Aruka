insert into public.planos (
  id, user_id, nome, descricao, duracao_meses, valor, permite_parcelamento,
  quantidade_parcelas, valor_parcela, intervalo_parcelas_meses, ativo, created_at
) values
  ('00000000-0000-4000-8000-000000000811', '00000000-0000-4000-8000-000000000802', 'Cycle8 Mensal Local', 'Fixture local deterministica mensal', 1, 199.90, false, 1, 199.90, 1, true, '2026-01-03T09:00:00Z'),
  ('00000000-0000-4000-8000-000000000812', '00000000-0000-4000-8000-000000000802', 'Cycle8 Trimestral Local', 'Fixture local deterministica parcelada', 3, 540.00, true, 3, 180.00, 1, true, '2026-01-03T09:10:00Z'),
  ('00000000-0000-4000-8000-000000000813', '00000000-0000-4000-8000-000000000802', 'Cycle8 Arquivado Local', 'Fixture local inativa', 1, 150.00, false, 1, 150.00, 1, false, '2026-01-03T09:20:00Z')
on conflict (id) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  duracao_meses = excluded.duracao_meses,
  valor = excluded.valor,
  permite_parcelamento = excluded.permite_parcelamento,
  quantidade_parcelas = excluded.quantidade_parcelas,
  valor_parcela = excluded.valor_parcela,
  intervalo_parcelas_meses = excluded.intervalo_parcelas_meses,
  ativo = excluded.ativo;

insert into public.alunos (
  id, user_id, nome, whatsapp, nascimento, inicio, vencimento, aviso7, aviso1,
  plano, valor, status, pagamento_recebido, data_pagamento, observacoes,
  created_at, acompanhamento_status, acompanhamento_encerrado_em, acompanhamento_motivo,
  acompanhamento_motivo_detalhe
) values
  ('00000000-0000-4000-8000-000000000821', '00000000-0000-4000-8000-000000000802', 'Aluno Ficticio Ativo Cycle8', '+5500000000000', '1990-01-10', '2026-01-10', '2026-02-10', '2026-02-03', '2026-02-09', 'Cycle8 Mensal Local', 199.90, 'Ativo', true, '2026-01-10', 'fixture:cycle8 aluno ativo', '2026-01-10T08:00:00Z', 'ativo', null, null, ''),
  ('00000000-0000-4000-8000-000000000822', '00000000-0000-4000-8000-000000000802', 'Aluno Ficticio Encerrado Cycle8', '+5500000000001', '1988-02-20', '2026-01-05', '2026-01-20', '2026-01-13', '2026-01-19', 'Cycle8 Trimestral Local', 540.00, 'Inativo', true, '2026-01-05', 'fixture:cycle8 aluno encerrado', '2026-01-05T08:00:00Z', 'encerrado', '2026-01-20', 'fixture_cycle8_encerramento', 'Encerramento ficticio deterministico'),
  ('00000000-0000-4000-8000-000000000823', '00000000-0000-4000-8000-000000000802', 'Aluno Ficticio Pendente Cycle8', '+5500000000002', '1995-03-15', '2026-03-01', '2026-04-01', '2026-03-25', '2026-03-31', 'Cycle8 Mensal Local', 199.90, 'Ativo', false, null, 'fixture:cycle8 aluno pendente', '2026-03-01T08:00:00Z', 'ativo', null, null, '')
on conflict (id) do update set
  nome = excluded.nome,
  whatsapp = excluded.whatsapp,
  nascimento = excluded.nascimento,
  inicio = excluded.inicio,
  vencimento = excluded.vencimento,
  aviso7 = excluded.aviso7,
  aviso1 = excluded.aviso1,
  plano = excluded.plano,
  valor = excluded.valor,
  status = excluded.status,
  pagamento_recebido = excluded.pagamento_recebido,
  data_pagamento = excluded.data_pagamento,
  observacoes = excluded.observacoes,
  acompanhamento_status = excluded.acompanhamento_status,
  acompanhamento_encerrado_em = excluded.acompanhamento_encerrado_em,
  acompanhamento_motivo = excluded.acompanhamento_motivo,
  acompanhamento_motivo_detalhe = excluded.acompanhamento_motivo_detalhe;

insert into public.acompanhamento_eventos (
  id, user_id, aluno_id, tipo, ocorrido_em, motivo, motivo_detalhe, plano_id,
  plano_nome, vencimento_anterior, vencimento_novo, metadata, event_key, created_at
) values
  ('00000000-0000-4000-8000-000000000891', '00000000-0000-4000-8000-000000000802', '00000000-0000-4000-8000-000000000821', 'acompanhamento_iniciado', '2026-01-10T08:30:00Z', null, null, '00000000-0000-4000-8000-000000000811', 'Cycle8 Mensal Local', null, '2026-02-10', '{"fixture":"cycle8"}'::jsonb, 'cycle8-aluno-ativo-inicio', '2026-01-10T08:30:00Z'),
  ('00000000-0000-4000-8000-000000000892', '00000000-0000-4000-8000-000000000802', '00000000-0000-4000-8000-000000000822', 'acompanhamento_encerrado', '2026-01-20T08:30:00Z', 'fixture_cycle8_encerramento', 'Encerramento ficticio deterministico', '00000000-0000-4000-8000-000000000812', 'Cycle8 Trimestral Local', '2026-01-20', null, '{"fixture":"cycle8"}'::jsonb, 'cycle8-aluno-encerrado', '2026-01-20T08:30:00Z')
on conflict (id) do update set
  tipo = excluded.tipo,
  ocorrido_em = excluded.ocorrido_em,
  motivo = excluded.motivo,
  motivo_detalhe = excluded.motivo_detalhe,
  plano_id = excluded.plano_id,
  plano_nome = excluded.plano_nome,
  metadata = excluded.metadata,
  event_key = excluded.event_key;
