-- Student tenure legacy reconciliation audit.
-- Read-only only: execute in a supervised production session with SELECT permissions.
-- Do not add PII fields to this query.

with students as (
  select
    a.id as student_id,
    a.inicio as current_contract_start,
    a.vencimento as current_contract_end,
    a.created_at::date as student_created_at,
    a.acompanhamento_status,
    a.plano as current_plan
  from public.alunos a
),
payment_timeline as (
  select
    p.aluno_id as student_id,
    min(p.data_pagamento) as first_payment_date,
    min(p.vencimento_parcela) as first_installment_due_date,
    min(p.data_pagamento) filter (where p.tipo_movimento = 'renovacao_plano') as first_renewal_payment_date,
    count(*) filter (where p.tipo_movimento = 'renovacao_plano') as renewal_payment_count,
    min(p.vencimento_anterior) as earliest_vencimento_anterior,
    min(p.vencimento_novo) as earliest_vencimento_novo,
    count(*) as payment_count,
    count(*) filter (where p.vencimento_anterior is not null or p.vencimento_novo is not null) as contract_movement_payment_count,
    string_agg(distinct coalesce(p.tipo_movimento, 'sem_tipo'), '|' order by coalesce(p.tipo_movimento, 'sem_tipo')) as payment_movement_types
  from public.pagamentos p
  group by p.aluno_id
),
event_timeline as (
  select
    e.aluno_id as student_id,
    min(e.ocorrido_em::date) as first_accompaniment_event_date,
    min(e.ocorrido_em::date) filter (where e.tipo = 'acompanhamento_iniciado') as first_acompanhamento_iniciado_date,
    min(e.ocorrido_em::date) filter (where e.tipo = 'plano_renovado') as first_renewal_event_date,
    count(*) filter (where e.tipo = 'plano_renovado') as renewal_event_count,
    min(e.vencimento_anterior) filter (where e.tipo = 'plano_renovado') as first_event_vencimento_anterior,
    min(e.vencimento_novo) filter (where e.tipo = 'plano_renovado') as first_event_vencimento_novo,
    string_agg(distinct coalesce(e.tipo, 'sem_tipo'), '|' order by coalesce(e.tipo, 'sem_tipo')) as event_types,
    string_agg(distinct coalesce(e.plano_nome, ''), '|' order by coalesce(e.plano_nome, '')) filter (where e.tipo = 'plano_renovado') as renewal_plan_names,
    string_agg(distinct coalesce(e.metadata::text, '{}'), ' || ' order by coalesce(e.metadata::text, '{}')) filter (where e.tipo = 'plano_renovado') as renewal_metadata
  from public.acompanhamento_eventos e
  group by e.aluno_id
),
timeline as (
  select
    s.student_id,
    s.current_contract_start,
    s.current_contract_end,
    s.student_created_at,
    pt.first_payment_date,
    pt.first_installment_due_date,
    et.first_accompaniment_event_date,
    et.first_acompanhamento_iniciado_date as first_start_event,
    et.first_renewal_event_date,
    coalesce(et.renewal_event_count, 0) as renewal_events,
    pt.first_renewal_payment_date,
    coalesce(pt.renewal_payment_count, 0) as renewal_payment_count,
    least(pt.earliest_vencimento_anterior, et.first_event_vencimento_anterior) as earliest_vencimento_anterior,
    least(pt.earliest_vencimento_novo, et.first_event_vencimento_novo) as earliest_vencimento_novo,
    case
      when least(pt.earliest_vencimento_anterior, et.first_event_vencimento_anterior) is not null
        then null::date
      else null::date
    end as possible_pre_renewal_period_start,
    least(pt.earliest_vencimento_anterior, et.first_event_vencimento_anterior) as possible_pre_renewal_period_end,
    case when pt.first_payment_date is not null and s.current_contract_start is not null and pt.first_payment_date < s.current_contract_start then true else false end as pre_current_financial_evidence,
    case when pt.first_installment_due_date is not null and s.current_contract_start is not null and pt.first_installment_due_date < s.current_contract_start then true else false end as pre_current_installment_evidence,
    case
      when s.student_created_at is not null and s.current_contract_start is not null and s.student_created_at < s.current_contract_start then 'BEFORE_CURRENT_CONTRACT_START'
      when s.student_created_at is not null and s.current_contract_start is not null and s.student_created_at = s.current_contract_start then 'SAME_AS_CURRENT_CONTRACT_START'
      when s.student_created_at is not null and s.current_contract_start is not null and s.student_created_at > s.current_contract_start then 'AFTER_CURRENT_CONTRACT_START'
      else 'INSUFFICIENT_DATA'
    end as record_creation_relation,
    coalesce(pt.payment_count, 0) as payment_count,
    coalesce(pt.contract_movement_payment_count, 0) as contract_movement_payment_count,
    pt.payment_movement_types,
    et.event_types,
    et.renewal_plan_names,
    et.renewal_metadata
  from students s
  left join payment_timeline pt on pt.student_id = s.student_id
  left join event_timeline et on et.student_id = s.student_id
),
classified as (
  select
    t.*,
    case
      when t.first_start_event is not null then t.first_start_event
      when t.pre_current_financial_evidence or t.pre_current_installment_evidence then null::date
      when t.current_contract_start is not null and t.current_contract_start <= current_date then t.current_contract_start
      else null::date
    end as candidate_start,
    case
      when t.first_start_event is not null then 'EXACT'
      when t.pre_current_financial_evidence or t.pre_current_installment_evidence then 'LOW_CONFIDENCE'
      when t.current_contract_start is not null and t.current_contract_start <= current_date then 'LOW_CONFIDENCE'
      else 'UNKNOWN'
    end as classification,
    concat_ws(
      '; ',
      case when t.first_start_event is not null then 'explicit acompanhamento_iniciado event' end,
      case when t.renewal_events > 0 then 'renewal events present; current inicio may be renewal date' end,
      case when t.pre_current_financial_evidence then 'payment before current contract start' end,
      case when t.pre_current_installment_evidence then 'installment due date before current contract start' end,
      case when t.record_creation_relation <> 'INSUFFICIENT_DATA' then 'student created_at relation: ' || t.record_creation_relation end,
      case when t.contract_movement_payment_count > 0 then 'payments contain vencimento movement evidence' end
    ) as evidence_summary,
    concat_ws(
      '; ',
      case when t.current_contract_end is not null and t.current_contract_start is not null and t.current_contract_end < t.current_contract_start then 'current contract end before start' end,
      case when t.renewal_events > 0 and t.first_start_event is null then 'renewed student without explicit consultancy start' end,
      case when t.pre_current_financial_evidence and t.first_start_event is null then 'financial evidence predates current contract but exact start unknown' end
    ) as conflicts,
    case
      when t.first_start_event is not null then false
      else true
    end as manual_review_required
  from timeline t
)
select
  'summary' as section,
  count(*)::text as total,
  count(*) filter (where classification = 'EXACT')::text as exact,
  count(*) filter (where classification = 'HIGH_CONFIDENCE')::text as high_confidence,
  count(*) filter (where classification = 'LOW_CONFIDENCE')::text as low_confidence,
  count(*) filter (where classification = 'UNKNOWN')::text as unknown,
  count(*) filter (where renewal_events > 0)::text as renewed_total,
  count(*) filter (where renewal_events > 0 and classification = 'EXACT')::text as renewed_exact,
  count(*) filter (where renewal_events > 0 and classification = 'HIGH_CONFIDENCE')::text as renewed_high_confidence,
  count(*) filter (where renewal_events > 0 and classification = 'LOW_CONFIDENCE')::text as renewed_low_confidence,
  count(*) filter (where renewal_events > 0 and classification = 'UNKNOWN')::text as renewed_unknown
from classified;

with students as (
  select
    a.id as student_id,
    a.inicio as current_contract_start,
    a.vencimento as current_contract_end,
    a.created_at::date as student_created_at,
    a.acompanhamento_status,
    a.plano as current_plan
  from public.alunos a
),
payment_timeline as (
  select
    p.aluno_id as student_id,
    min(p.data_pagamento) as first_payment_date,
    min(p.vencimento_parcela) as first_installment_due_date,
    min(p.data_pagamento) filter (where p.tipo_movimento = 'renovacao_plano') as first_renewal_payment_date,
    count(*) filter (where p.tipo_movimento = 'renovacao_plano') as renewal_payment_count,
    min(p.vencimento_anterior) as earliest_vencimento_anterior,
    min(p.vencimento_novo) as earliest_vencimento_novo,
    count(*) as payment_count,
    count(*) filter (where p.vencimento_anterior is not null or p.vencimento_novo is not null) as contract_movement_payment_count,
    string_agg(distinct coalesce(p.tipo_movimento, 'sem_tipo'), '|' order by coalesce(p.tipo_movimento, 'sem_tipo')) as payment_movement_types
  from public.pagamentos p
  group by p.aluno_id
),
event_timeline as (
  select
    e.aluno_id as student_id,
    min(e.ocorrido_em::date) as first_accompaniment_event_date,
    min(e.ocorrido_em::date) filter (where e.tipo = 'acompanhamento_iniciado') as first_acompanhamento_iniciado_date,
    min(e.ocorrido_em::date) filter (where e.tipo = 'plano_renovado') as first_renewal_event_date,
    count(*) filter (where e.tipo = 'plano_renovado') as renewal_event_count,
    min(e.vencimento_anterior) filter (where e.tipo = 'plano_renovado') as first_event_vencimento_anterior,
    min(e.vencimento_novo) filter (where e.tipo = 'plano_renovado') as first_event_vencimento_novo,
    string_agg(distinct coalesce(e.tipo, 'sem_tipo'), '|' order by coalesce(e.tipo, 'sem_tipo')) as event_types,
    string_agg(distinct coalesce(e.plano_nome, ''), '|' order by coalesce(e.plano_nome, '')) filter (where e.tipo = 'plano_renovado') as renewal_plan_names,
    string_agg(distinct coalesce(e.metadata::text, '{}'), ' || ' order by coalesce(e.metadata::text, '{}')) filter (where e.tipo = 'plano_renovado') as renewal_metadata
  from public.acompanhamento_eventos e
  group by e.aluno_id
),
timeline as (
  select
    s.student_id,
    s.current_contract_start,
    s.current_contract_end,
    s.student_created_at,
    pt.first_payment_date,
    pt.first_installment_due_date,
    et.first_accompaniment_event_date,
    et.first_acompanhamento_iniciado_date as first_start_event,
    et.first_renewal_event_date,
    coalesce(et.renewal_event_count, 0) as renewal_events,
    pt.first_renewal_payment_date,
    coalesce(pt.renewal_payment_count, 0) as renewal_payment_count,
    least(pt.earliest_vencimento_anterior, et.first_event_vencimento_anterior) as earliest_vencimento_anterior,
    least(pt.earliest_vencimento_novo, et.first_event_vencimento_novo) as earliest_vencimento_novo,
    null::date as possible_pre_renewal_period_start,
    least(pt.earliest_vencimento_anterior, et.first_event_vencimento_anterior) as possible_pre_renewal_period_end,
    case when pt.first_payment_date is not null and s.current_contract_start is not null and pt.first_payment_date < s.current_contract_start then true else false end as pre_current_financial_evidence,
    case when pt.first_installment_due_date is not null and s.current_contract_start is not null and pt.first_installment_due_date < s.current_contract_start then true else false end as pre_current_installment_evidence,
    case
      when s.student_created_at is not null and s.current_contract_start is not null and s.student_created_at < s.current_contract_start then 'BEFORE_CURRENT_CONTRACT_START'
      when s.student_created_at is not null and s.current_contract_start is not null and s.student_created_at = s.current_contract_start then 'SAME_AS_CURRENT_CONTRACT_START'
      when s.student_created_at is not null and s.current_contract_start is not null and s.student_created_at > s.current_contract_start then 'AFTER_CURRENT_CONTRACT_START'
      else 'INSUFFICIENT_DATA'
    end as record_creation_relation,
    coalesce(pt.payment_count, 0) as payment_count,
    coalesce(pt.contract_movement_payment_count, 0) as contract_movement_payment_count,
    pt.payment_movement_types,
    et.event_types,
    et.renewal_plan_names,
    et.renewal_metadata
  from students s
  left join payment_timeline pt on pt.student_id = s.student_id
  left join event_timeline et on et.student_id = s.student_id
),
classified as (
  select
    t.*,
    case
      when t.first_start_event is not null then t.first_start_event
      when t.pre_current_financial_evidence or t.pre_current_installment_evidence then null::date
      when t.current_contract_start is not null and t.current_contract_start <= current_date then t.current_contract_start
      else null::date
    end as candidate_start,
    case
      when t.first_start_event is not null then 'EXACT'
      when t.pre_current_financial_evidence or t.pre_current_installment_evidence then 'LOW_CONFIDENCE'
      when t.current_contract_start is not null and t.current_contract_start <= current_date then 'LOW_CONFIDENCE'
      else 'UNKNOWN'
    end as classification,
    concat_ws(
      '; ',
      case when t.first_start_event is not null then 'explicit acompanhamento_iniciado event' end,
      case when t.renewal_events > 0 then 'renewal events present; current inicio may be renewal date' end,
      case when t.pre_current_financial_evidence then 'payment before current contract start' end,
      case when t.pre_current_installment_evidence then 'installment due date before current contract start' end,
      case when t.record_creation_relation <> 'INSUFFICIENT_DATA' then 'student created_at relation: ' || t.record_creation_relation end,
      case when t.contract_movement_payment_count > 0 then 'payments contain vencimento movement evidence' end
    ) as evidence_summary,
    concat_ws(
      '; ',
      case when t.current_contract_end is not null and t.current_contract_start is not null and t.current_contract_end < t.current_contract_start then 'current contract end before start' end,
      case when t.renewal_events > 0 and t.first_start_event is null then 'renewed student without explicit consultancy start' end,
      case when t.pre_current_financial_evidence and t.first_start_event is null then 'financial evidence predates current contract but exact start unknown' end
    ) as conflicts,
    case
      when t.first_start_event is not null then false
      else true
    end as manual_review_required
  from timeline t
)
select
  student_id,
  current_contract_start,
  current_contract_end,
  student_created_at,
  first_payment_date,
  first_installment_due_date,
  first_accompaniment_event_date,
  first_start_event,
  first_renewal_event_date,
  renewal_events,
  first_renewal_payment_date,
  renewal_payment_count,
  earliest_vencimento_anterior,
  earliest_vencimento_novo,
  possible_pre_renewal_period_start,
  possible_pre_renewal_period_end,
  pre_current_financial_evidence,
  pre_current_installment_evidence,
  candidate_start,
  classification,
  evidence_summary,
  conflicts,
  manual_review_required,
  payment_movement_types,
  event_types,
  renewal_plan_names,
  renewal_metadata
from classified
order by renewal_events desc, classification, student_id;
