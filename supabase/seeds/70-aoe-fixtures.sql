insert into public.aoe_decisions (
  id, request_id, actor_id, student_id, organization_id, status, selected_model_code,
  selected_model_version, selected_apl_release, alternatives, compatibility_score,
  raw_score, confidence_score, confidence_level, risk_score, risk_level, ambiguity_level,
  warnings, reason_codes, human_review_required, human_review_id, versions,
  public_response, trace_reference, created_at, updated_at
) values
  ('cycle8-decision-completed', 'cycle8-request-001', '00000000-0000-4000-8000-000000000802', '00000000-0000-4000-8000-000000000821', '00000000-0000-4000-8000-000000000802', 'completed', 'APL-M-HIP-I-ABC-BASE-01', '1.0.0', 'cycle8-local', '[]'::jsonb, 0.92, 0.88, 0.91, 'high', 0.12, 'low', 'low', '[]'::jsonb, '["cycle8_fixture"]'::jsonb, false, null, '{"fixture":"cycle8"}'::jsonb, '{"summary":"Resposta publica ficticia do Ciclo 8"}'::jsonb, '{"trace_id":"cycle8-trace-completed"}'::jsonb, '2026-01-16T09:00:00Z', '2026-01-16T09:00:00Z'),
  ('cycle8-decision-review', 'cycle8-request-002', '00000000-0000-4000-8000-000000000802', '00000000-0000-4000-8000-000000000823', '00000000-0000-4000-8000-000000000802', 'requires_review', 'APL-M-HIP-I-ABCD-BASE-01', '1.0.0', 'cycle8-local', '[]'::jsonb, 0.75, 0.70, 0.68, 'medium', 0.41, 'medium', 'medium', '["human_review_required"]'::jsonb, '["cycle8_review"]'::jsonb, true, 'cycle8-review-pending', '{"fixture":"cycle8"}'::jsonb, '{"summary":"Resposta publica ficticia aguardando revisao"}'::jsonb, '{"trace_id":"cycle8-trace-review"}'::jsonb, '2026-01-16T10:00:00Z', '2026-01-16T10:00:00Z')
on conflict (id) do update set
  status = excluded.status,
  selected_model_code = excluded.selected_model_code,
  selected_model_version = excluded.selected_model_version,
  selected_apl_release = excluded.selected_apl_release,
  alternatives = excluded.alternatives,
  compatibility_score = excluded.compatibility_score,
  raw_score = excluded.raw_score,
  confidence_score = excluded.confidence_score,
  confidence_level = excluded.confidence_level,
  risk_score = excluded.risk_score,
  risk_level = excluded.risk_level,
  ambiguity_level = excluded.ambiguity_level,
  warnings = excluded.warnings,
  reason_codes = excluded.reason_codes,
  human_review_required = excluded.human_review_required,
  human_review_id = excluded.human_review_id,
  versions = excluded.versions,
  public_response = excluded.public_response,
  trace_reference = excluded.trace_reference,
  updated_at = excluded.updated_at;

insert into public.aoe_decision_traces (
  id, decision_id, organization_id, trace_version, trace_payload, redaction_version, created_at
) values
  ('cycle8-trace-completed', 'cycle8-decision-completed', '00000000-0000-4000-8000-000000000802', '1.0.0', '{"fixture":"cycle8","redacted":true}'::jsonb, '1.0.0', '2026-01-16T09:05:00Z'),
  ('cycle8-trace-review', 'cycle8-decision-review', '00000000-0000-4000-8000-000000000802', '1.0.0', '{"fixture":"cycle8","redacted":true}'::jsonb, '1.0.0', '2026-01-16T10:05:00Z')
on conflict (id) do update set
  trace_payload = excluded.trace_payload,
  redaction_version = excluded.redaction_version;

insert into public.aoe_human_reviews (
  id, decision_id, organization_id, status, required, blocking, reason_codes, checklist,
  reviewer_id, reviewer_role, adjustments, notes, created_at, updated_at, completed_at
) values
  ('cycle8-review-pending', 'cycle8-decision-review', '00000000-0000-4000-8000-000000000802', 'pending', true, true, '["cycle8_review"]'::jsonb, '[{"item":"fixture_check","ok":false}]'::jsonb, null, null, '[]'::jsonb, 'fixture:cycle8 review pendente', '2026-01-16T10:10:00Z', '2026-01-16T10:10:00Z', null),
  ('cycle8-review-completed', 'cycle8-decision-completed', '00000000-0000-4000-8000-000000000802', 'completed', true, false, '["cycle8_fixture"]'::jsonb, '[{"item":"fixture_check","ok":true}]'::jsonb, '00000000-0000-4000-8000-000000000801', 'admin', '[{"field":"volume","value":"mantido"}]'::jsonb, 'fixture:cycle8 review concluida', '2026-01-16T09:10:00Z', '2026-01-16T09:20:00Z', '2026-01-16T09:20:00Z')
on conflict (id) do update set
  status = excluded.status,
  required = excluded.required,
  blocking = excluded.blocking,
  reason_codes = excluded.reason_codes,
  checklist = excluded.checklist,
  reviewer_id = excluded.reviewer_id,
  reviewer_role = excluded.reviewer_role,
  adjustments = excluded.adjustments,
  notes = excluded.notes,
  updated_at = excluded.updated_at,
  completed_at = excluded.completed_at;

insert into public.aoe_idempotency_keys (
  id, actor_id, organization_id, operation, idempotency_key, request_fingerprint,
  status, decision_id, response_payload, error_code, created_at, updated_at, expires_at
) values (
  'cycle8-idempotency-001',
  '00000000-0000-4000-8000-000000000802',
  '00000000-0000-4000-8000-000000000802',
  'aoe_decision',
  'cycle8-idempotency-key-001',
  'cycle8-fingerprint-001',
  'completed',
  'cycle8-decision-completed',
  '{"fixture":"cycle8"}'::jsonb,
  null,
  '2026-01-16T09:00:00Z',
  '2026-01-16T09:00:00Z',
  '2026-02-16T09:00:00Z'
) on conflict (id) do update set
  status = excluded.status,
  decision_id = excluded.decision_id,
  response_payload = excluded.response_payload,
  error_code = excluded.error_code,
  updated_at = excluded.updated_at,
  expires_at = excluded.expires_at;

insert into public.aoe_audit_events (
  id, event_type, actor_id, actor_role, organization_id, resource_type, resource_id,
  request_id, correlation_id, outcome, metadata, versions, occurred_at
) values (
  'cycle8-audit-001',
  'cycle8_fixture_created',
  '00000000-0000-4000-8000-000000000802',
  'personal',
  '00000000-0000-4000-8000-000000000802',
  'aoe_decision',
  'cycle8-decision-completed',
  'cycle8-request-001',
  'cycle8-correlation-001',
  'success',
  '{"fixture":"cycle8"}'::jsonb,
  '{"cycle":"8"}'::jsonb,
  '2026-01-16T09:30:00Z'
) on conflict (id) do update set
  outcome = excluded.outcome,
  metadata = excluded.metadata,
  versions = excluded.versions,
  occurred_at = excluded.occurred_at;
