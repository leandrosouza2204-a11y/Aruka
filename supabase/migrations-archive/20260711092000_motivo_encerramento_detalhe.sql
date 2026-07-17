-- Campo opcional para detalhar motivo de encerramento sem misturar texto livre
-- com o codigo estruturado salvo em acompanhamento_motivo.
alter table public.alunos
  add column if not exists acompanhamento_motivo_detalhe text not null default '';
