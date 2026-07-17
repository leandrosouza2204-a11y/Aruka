# Supabase Operations

Este diretorio contem SQL operacional dependente de ambiente. Arquivos aqui nao fazem parte da cadeia automatica de migrations e nao devem ser aplicados por `supabase db push`.

## Arquivos

- `20260712090000_agendar_encerramentos_automaticos_dry_run.sql`: agenda job com `pg_cron`, `pg_net`, Vault secret e chamada de Edge Function. Deve ser executado somente por runbook aprovado no ambiente correto.

## Regras

- Confirmar ambiente antes de qualquer execucao.
- Nunca executar automaticamente em ambiente novo.
- Nunca versionar secrets.
- Validar URL, secret Vault e janela operacional antes de aplicar.

