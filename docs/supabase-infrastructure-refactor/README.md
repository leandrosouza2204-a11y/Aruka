# Supabase Infrastructure Refactor v1.0

## Ciclo 1 - Auditoria e Inventario

Este pacote documenta a infraestrutura Supabase do Aruka a partir dos artefatos versionados no repositorio em 16/07/2026.

Escopo executado:

- Inventario estatico de schema, funcoes SQL, Storage, RLS e Edge Functions.
- Mapa de dependencias entre tabelas, triggers, funcoes e policies.
- Diagnostico executivo de riscos, prioridades, complexidade e recomendacoes.

Fora de escopo neste ciclo:

- Alterar tabelas, migrations, Edge Functions, RLS ou codigo da aplicacao.
- Executar SQL contra HML/producao.
- Corrigir divergencias automaticamente.

Arquivos:

- [01-schema-inventory.md](01-schema-inventory.md)
- [02-functions-inventory.md](02-functions-inventory.md)
- [03-storage-inventory.md](03-storage-inventory.md)
- [04-rls-inventory.md](04-rls-inventory.md)
- [05-edge-functions.md](05-edge-functions.md)
- [06-dependencies.md](06-dependencies.md)
- [07-findings.md](07-findings.md)

Fonte principal: `supabase/*.sql`, `supabase/migrations/*.sql`, `supabase/functions/**`, `src/services/**` e scripts de validacao que usam Supabase.

Observacao: este inventario e estatico. A confirmacao definitiva de objetos existentes em HML/producao requer dump/catalog query do banco ativo.
