# Aruka Database Migrations

Todas as alteracoes estruturais do banco devem ser registradas nesta pasta.

Cada arquivo representa uma alteracao aplicada ao banco.

## Formato

```text
YYYYMMDD_descricao.sql
```

Exemplo:

```text
20260705091000_rls_indices_multitenant.sql
```

## Regras

- Nunca editar migrations antigas.
- Nunca apagar migrations.
- Toda alteracao executada no Supabase deve existir aqui.
- Toda migration deve ser commitada junto com a alteracao correspondente.
- O SQL deve ser idempotente sempre que possivel.
- Antes de executar em producao, validar em ambiente de testes.

## Observacoes

- Migrations nesta pasta documentam o historico do banco do Aruka.
- Scripts auxiliares ou de auditoria podem existir fora desta pasta, mas nao substituem uma migration versionada quando uma alteracao for aplicada ao banco.
- Mudancas em RLS, indices, funcoes, triggers, tabelas ou constraints devem ser registradas aqui antes de serem consideradas parte oficial do projeto.
