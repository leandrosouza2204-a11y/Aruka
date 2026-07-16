# Convencoes

## Timestamps

- Toda tabela de negocio deve ter `created_at timestamptz not null default now()`.
- Tabelas mutaveis devem ter `updated_at timestamptz not null default now()`.
- Atualizacao automatica de `updated_at` deve usar trigger padronizada.
- Datas de evento devem usar nomes semanticos: `occurred_at`, `aceito_em`, `completed_at`, `vencimento`.

## Migrations

- Nome: `YYYYMMDDHHMMSS_descricao_curta.sql`.
- Uma responsabilidade por arquivo.
- Ordem interna: extensions, tabelas, constraints, indices, funcoes, triggers, RLS, policies, grants, storage.
- Evitar misturar DDL com backfill pesado.
- Toda migration deve ter comentario de intencao quando tocar RLS, grants, service role ou dados.

## Nomenclatura

- Tabelas em snake_case e plural quando representarem colecoes.
- PK: `id`.
- FK: `<entidade>_id`.
- Indices: `<tabela>_<colunas>_idx`.
- Constraints: `<tabela>_<regra>_check`, `<tabela>_<colunas>_key` ou nome semantico claro.
- Policies em portugues podem permanecer, mas novas policies devem seguir padrao de verbo + dominio + escopo.

## Edge Functions

- Nome em kebab-case.
- Sem secrets hardcoded.
- Validar metodo, headers e payload antes de criar cliente service role.
- Respostas devem ser estaveis e sem vazar detalhes internos.
- CORS deve ser explicito por ambiente.

## RLS e Policies

- RLS habilitado em toda tabela publica de dados da aplicacao.
- Preferir `to authenticated` explicitamente em novas policies.
- Separar policies por comando quando isso melhorar auditoria.
- Policies com joins devem ter indices compatíveis nas colunas usadas.
- Toda funcao usada por policy deve ter grants e `search_path` revisados.

## Storage

- Buckets privados por padrao.
- Path deve iniciar com `auth.uid()` quando a policy depender de pasta do usuario.
- Definir limite de tamanho e MIME types.
- Signed URLs devem ter expiracao adequada ao fluxo.

## Documentacao

- Toda mudanca estrutural deve atualizar `supabase/migrations/README.md`.
- Decisoes arquiteturais devem ir para `docs/supabase-infrastructure-refactor/` ou ADR equivalente.
- Relatorios runtime devem ir para `reports/`.

## Grants e Funcoes

- Funcoes `SECURITY DEFINER` devem usar `set search_path`.
- Revogar `public` antes de conceder roles especificas.
- Grants devem ser declarados na mesma migration da funcao ou em migration imediatamente relacionada.
