# Supabase Baseline Source

Fonte intermediaria para a baseline oficial do Aruka.

Este diretorio:

- nao e aplicado automaticamente pela Supabase CLI;
- ainda nao e a baseline oficial;
- nao deve ser executado manualmente em ambientes remotos;
- consolida decisoes do Ciclo 4 para uso no Ciclo 5;
- deriva do dump runtime em `reports/hml-baseline/production-public-schema.sql` e dos artefatos versionados;
- deve ser validado localmente antes de virar uma migration unica.

Ordem planejada:

1. `01-extensions.sql`
2. `02-tables.sql`
3. `03-constraints.sql`
4. `04-indexes.sql`
5. `05-functions.sql`
6. `06-triggers.sql`
7. `07-rls.sql`
8. `08-policies.sql`
9. `09-grants.sql`
10. `10-storage.sql`

Validacao local:

```bash
npm run qa:supabase-baseline-src
```

Para validacao com banco local descartavel no Ciclo 5, aplicar os fragmentos na ordem acima em um Supabase local, nunca em HML ou producao.
