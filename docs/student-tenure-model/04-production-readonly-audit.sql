-- Student tenure production readiness audit.
-- Read-only only: execute in a supervised production session with SELECT permissions.

with students as (
  select
    a.id as student_id,
    a.user_id,
    a.inicio as current_contract_start,
    a.vencimento as current_contract_end,
    a.acompanhamento_status,
    a.created_at
  from public.alunos a
),
event_evidence as (
  select
    e.aluno_id as student_id,
    min(e.ocorrido_em::date) filter (where e.tipo = 'acompanhamento_iniciado' and e.ocorrido_em::date <= current_date) as explicit_start_date,
    count(*) filter (where e.tipo = 'acompanhamento_iniciado') as start_events,
    count(*) filter (where e.tipo = 'plano_renovado') as renewal_events,
    count(*) filter (where e.tipo in ('acompanhamento_encerrado', 'aluno_encerrado')) as closure_events,
    count(*) as total_events
  from public.acompanhamento_eventos e
  group by e.aluno_id
),
payment_evidence as (
  select
    p.aluno_id as student_id,
    count(*) as payments_count,
    min(p.data_pagamento) as first_payment_date,
    min(p.vencimento_parcela) as first_installment_due_date,
    count(*) filter (where p.tipo_movimento = 'renovacao_plano') as renewal_payments,
    count(*) filter (where p.vencimento_anterior is not null or p.vencimento_novo is not null) as contract_movement_payments
  from public.pagamentos p
  group by p.aluno_id
),
classification as (
  select
    s.student_id,
    s.current_contract_start,
    s.current_contract_end,
    ee.explicit_start_date,
    ee.start_events,
    ee.renewal_events,
    ee.closure_events,
    pe.payments_count,
    pe.renewal_payments,
    pe.contract_movement_payments,
    case
      when ee.explicit_start_date is not null then ee.explicit_start_date
      when s.current_contract_start is not null and s.current_contract_start <= current_date then s.current_contract_start
      else null
    end as candidate_consultancy_start,
    case
      when ee.explicit_start_date is not null then 'EXACT'
      when s.current_contract_start is not null and s.current_contract_start <= current_date then 'DERIVED_LOW_CONFIDENCE'
      else 'UNKNOWN'
    end as classification,
    case
      when ee.explicit_start_date is not null then 'acompanhamento_iniciado'
      when s.current_contract_start is not null and s.current_contract_start <= current_date then 'current_contract_start_legacy_fallback'
      else 'no_safe_evidence'
    end as evidence_source,
    case
      when ee.explicit_start_date is not null then 'explicit start event exists'
      when s.current_contract_start is not null and s.current_contract_start <= current_date then 'current contract start is plausible but may be renewal date'
      else 'no non-future start evidence'
    end as reason
  from students s
  left join event_evidence ee on ee.student_id = s.student_id
  left join payment_evidence pe on pe.student_id = s.student_id
)
select
  'inventory' as section,
  count(*)::text as total_students,
  count(*) filter (where current_contract_start is not null)::text as students_with_current_inicio,
  count(*) filter (where coalesce(payments_count, 0) > 0)::text as students_with_payments,
  count(*) filter (where coalesce(start_events, 0) + coalesce(renewal_events, 0) + coalesce(closure_events, 0) > 0)::text as students_with_acompanhamento_history,
  count(*) filter (where coalesce(renewal_events, 0) > 0)::text as students_with_renewal_events,
  count(*) filter (where coalesce(renewal_events, 0) > 0 or coalesce(contract_movement_payments, 0) > 0)::text as students_with_possible_previous_contract,
  count(*) filter (where current_contract_start > current_date)::text as students_with_future_inicio,
  count(*) filter (where current_contract_end is not null and current_contract_start is not null and current_contract_end < current_contract_start)::text as students_with_inconsistent_dates
from classification
union all
select
  'classification_counts',
  count(*) filter (where classification = 'EXACT')::text,
  count(*) filter (where classification = 'DERIVED_HIGH_CONFIDENCE')::text,
  count(*) filter (where classification = 'DERIVED_LOW_CONFIDENCE')::text,
  count(*) filter (where classification = 'UNKNOWN')::text,
  null,
  null,
  null,
  null
from classification;

with students as (
  select id as student_id, inicio as current_contract_start, vencimento as current_contract_end
  from public.alunos
),
event_evidence as (
  select
    aluno_id as student_id,
    min(ocorrido_em::date) filter (where tipo = 'acompanhamento_iniciado' and ocorrido_em::date <= current_date) as explicit_start_date,
    count(*) filter (where tipo = 'plano_renovado') as renewal_events
  from public.acompanhamento_eventos
  group by aluno_id
)
select
  s.student_id,
  s.current_contract_start,
  s.current_contract_end,
  case
    when e.explicit_start_date is not null then e.explicit_start_date
    when s.current_contract_start is not null and s.current_contract_start <= current_date then s.current_contract_start
    else null
  end as candidate_consultancy_start,
  case
    when e.explicit_start_date is not null then 'acompanhamento_iniciado'
    when s.current_contract_start is not null and s.current_contract_start <= current_date then 'current_contract_start_legacy_fallback'
    else 'no_safe_evidence'
  end as evidence_source,
  case
    when e.explicit_start_date is not null then 'EXACT'
    when s.current_contract_start is not null and s.current_contract_start <= current_date then 'DERIVED_LOW_CONFIDENCE'
    else 'UNKNOWN'
  end as classification,
  case
    when e.explicit_start_date is not null then 'safe automatic candidate'
    when s.current_contract_start is not null and s.current_contract_start <= current_date then 'manual review required before treating as historical start'
    else 'external evidence required'
  end as reason,
  coalesce(e.renewal_events, 0) as renewal_events
from students s
left join event_evidence e on e.student_id = s.student_id
order by classification, s.student_id;
