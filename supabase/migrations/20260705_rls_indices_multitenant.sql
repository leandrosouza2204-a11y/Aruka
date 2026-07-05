------------------------------------------------------------------
-- CoachFlow Database Migration
--
-- Migration:
-- 20260705_rls_indices_multitenant
--
-- Objetivo:
-- Reforcar desempenho e seguranca da camada multi-tenant.
--
-- Aplicacao:
-- Executada manualmente no Supabase SQL Editor.
--
-- Compatibilidade:
-- Idempotente (CREATE INDEX IF NOT EXISTS)
------------------------------------------------------------------

create index if not exists alunos_user_vencimento_idx
on public.alunos(user_id, vencimento);

create index if not exists planos_user_ativo_idx
on public.planos(user_id, ativo);

create index if not exists assinaturas_user_created_at_idx
on public.assinaturas(user_id, created_at desc);

create index if not exists assinaturas_user_status_vencimento_idx
on public.assinaturas(user_id, status, data_vencimento);

create index if not exists treinos_user_created_at_idx
on public.treinos(user_id, created_at desc);

create index if not exists avaliacoes_user_data_idx
on public.avaliacoes(user_id, data_avaliacao desc);

create index if not exists anamneses_user_created_at_idx
on public.anamneses(user_id, created_at desc);
