# AOE v1.7.2 Limitations

Status: NOT_READY.

## Limitacoes Confirmadas

- Ambiente remoto linkado nao classificado como staging/desenvolvimento.
- `AOE_INFRA_TEST_ENV` ausente.
- `supabase/config.toml` ausente.
- Docker local indisponivel para operacoes do Supabase CLI.
- Sem credencial Postgres segura no processo para inventario direto do schema.
- Migration aplicada manualmente nao confirmada por consulta ao banco.
- Edge Function nao executada em local/staging.

## Nao Executado

- Escritas remotas.
- Deploy de Edge Function.
- Criacao de usuarios ficticios.
- Testes de carga.
- Cleanup remoto.

## Decisao

AOE v1.7.2 permanece NOT_READY para AOE v1.8.
