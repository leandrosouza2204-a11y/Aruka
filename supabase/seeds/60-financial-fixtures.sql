insert into public.assinaturas (
  id, user_id, plano, status, data_inicio, data_vencimento, pagamento_id, created_at
) values (
  '00000000-0000-4000-8000-000000000812',
  '00000000-0000-4000-8000-000000000802',
  'Cycle8 Mensal Local',
  'ativo',
  '2026-01-10',
  '2026-02-10',
  'cycle8-pagamento-local-001',
  '2026-01-10T11:00:00Z'
) on conflict (id) do update set
  plano = excluded.plano,
  status = excluded.status,
  data_inicio = excluded.data_inicio,
  data_vencimento = excluded.data_vencimento,
  pagamento_id = excluded.pagamento_id;

insert into public.pagamentos (
  id, user_id, aluno_id, plano, valor, data_pagamento, forma_pagamento, parcela,
  total_parcelas, tipo_movimento, vencimento_parcela, vencimento_anterior,
  vencimento_novo, observacao, observacoes, created_at
) values
  ('00000000-0000-4000-8000-000000000881', '00000000-0000-4000-8000-000000000802', '00000000-0000-4000-8000-000000000821', 'Cycle8 Mensal Local', 199.90, '2026-01-10', 'pix-ficticio', '1', 1, 'mensalidade', '2026-01-10', null, '2026-02-10', 'fixture:cycle8 pagamento ativo', 'fixture:cycle8 financeiro local', '2026-01-10T11:05:00Z'),
  ('00000000-0000-4000-8000-000000000882', '00000000-0000-4000-8000-000000000802', '00000000-0000-4000-8000-000000000822', 'Cycle8 Trimestral Local', 180.00, '2026-01-05', 'cartao-ficticio', '1', 3, 'mensalidade', '2026-01-05', null, '2026-02-05', 'fixture:cycle8 pagamento parcelado', 'fixture:cycle8 financeiro local', '2026-01-05T11:05:00Z')
on conflict (id) do update set
  plano = excluded.plano,
  valor = excluded.valor,
  data_pagamento = excluded.data_pagamento,
  forma_pagamento = excluded.forma_pagamento,
  parcela = excluded.parcela,
  total_parcelas = excluded.total_parcelas,
  tipo_movimento = excluded.tipo_movimento,
  vencimento_parcela = excluded.vencimento_parcela,
  vencimento_anterior = excluded.vencimento_anterior,
  vencimento_novo = excluded.vencimento_novo,
  observacao = excluded.observacao,
  observacoes = excluded.observacoes;
