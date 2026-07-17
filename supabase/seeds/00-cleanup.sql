-- Cycle 8 local-only cleanup.
-- Removes only deterministic fixtures in the reserved 00000000-0000-4000-8000-0000000008xx range.

delete from public.aoe_idempotency_keys where id like 'cycle8-%';
delete from public.aoe_human_reviews where id like 'cycle8-%';
delete from public.aoe_decision_traces where id like 'cycle8-%';
delete from public.aoe_audit_events where id like 'cycle8-%';
delete from public.aoe_decisions where id like 'cycle8-%';
delete from public.treino_exercicios where id in (
  '00000000-0000-4000-8000-000000000841',
  '00000000-0000-4000-8000-000000000842'
);
delete from public.treino_dias where id = '00000000-0000-4000-8000-000000000831';
delete from public.treinos where id = '00000000-0000-4000-8000-000000000821';
delete from public.workout_templates where id = '00000000-0000-4000-8000-000000000851';
delete from public.avaliacoes where id = '00000000-0000-4000-8000-000000000861';
delete from public.anamneses where id = '00000000-0000-4000-8000-000000000871';
delete from public.pagamentos where id in (
  '00000000-0000-4000-8000-000000000881',
  '00000000-0000-4000-8000-000000000882'
);
delete from public.acompanhamento_eventos where id in (
  '00000000-0000-4000-8000-000000000891',
  '00000000-0000-4000-8000-000000000892'
);
delete from public.assinaturas where id = '00000000-0000-4000-8000-000000000812';
delete from public.aceites_legais where id in (
  '00000000-0000-4000-8000-000000000813',
  '00000000-0000-4000-8000-000000000814'
);
delete from public.admin_logs where id = '00000000-0000-4000-8000-000000000815';
delete from public.alunos where id in (
  '00000000-0000-4000-8000-000000000821',
  '00000000-0000-4000-8000-000000000822',
  '00000000-0000-4000-8000-000000000823'
);
delete from public.planos where id in (
  '00000000-0000-4000-8000-000000000811',
  '00000000-0000-4000-8000-000000000812',
  '00000000-0000-4000-8000-000000000813'
);
delete from public.perfis where id in (
  '00000000-0000-4000-8000-000000000801',
  '00000000-0000-4000-8000-000000000802'
);
delete from auth.users where id in (
  '00000000-0000-4000-8000-000000000801',
  '00000000-0000-4000-8000-000000000802'
);
