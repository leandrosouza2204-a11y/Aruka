-- Completa o contrato do formulario. Aditiva, idempotente e sem apagar dados.
alter table public.avaliacoes
  add column if not exists dobra_peitoral numeric(6, 2),
  add column if not exists dobra_abdominal numeric(6, 2),
  add column if not exists dobra_coxa numeric(6, 2),
  add column if not exists dobra_triceps numeric(6, 2),
  add column if not exists dobra_subescapular numeric(6, 2),
  add column if not exists dobra_supra_iliaca numeric(6, 2),
  add column if not exists dobra_axilar_media numeric(6, 2),
  add column if not exists percentual_gordura numeric(6, 2),
  add column if not exists percentual_massa_magra numeric(6, 2),
  add column if not exists massa_gorda numeric(6, 2),
  add column if not exists massa_magra numeric(6, 2),
  add column if not exists imc numeric(6, 2),
  add column if not exists status text not null default 'inicial',
  add column if not exists objetivo_atual text not null default '',
  add column if not exists aderencia_treino text not null default '',
  add column if not exists aderencia_dieta text not null default '',
  add column if not exists foto_frente_url text,
  add column if not exists foto_lateral_url text,
  add column if not exists foto_costas_url text;

notify pgrst, 'reload schema';
