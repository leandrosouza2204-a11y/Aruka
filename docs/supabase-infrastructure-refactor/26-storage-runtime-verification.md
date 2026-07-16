# Storage Runtime Verification

## Escopo

Este documento registra a verificacao de Storage planejada para a baseline candidate do Ciclo 5. Nenhuma query remota foi executada neste ciclo.

## Estado da baseline candidate

- Bucket esperado: `avaliacoes-fotos`.
- Policies esperadas em `storage.objects`: 4 statements.
- Fonte consolidada: `supabase/baseline-candidate/20260716090000_baseline_aruka_v1.sql`.
- Representacao SQL: `insert into storage.buckets` idempotente e policies canonicas para objetos do bucket.

## Verificacao realizada

| Item | Resultado | Evidencia |
| --- | --- | --- |
| Bucket presente na candidate | OK | `reports/supabase-baseline-validation/storage.txt` |
| Bucket criado localmente como privado | OK | `reports/supabase-baseline-validation/storage.txt` |
| Policies Storage presentes na candidate | OK | `supabase/baseline-candidate/20260716090000_baseline_aruka_v1.sql` |
| Policies Storage validadas localmente | OK | `reports/supabase-baseline-validation/policies.txt` |
| Dados reais no Storage | Nao aplicavel | Ciclo 5 nao acessa objetos nem executa SQL remoto |
| Catalog query runtime | Pendente | Bloqueada por regra do ciclo: somente local/read-only sem SQL remoto |

## Query read-only recomendada para ciclo futuro

Executar apenas em janela autorizada e ambiente explicitamente confirmado antes de qualquer ativacao HML/producao:

```sql
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
order by id;

select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
order by policyname;
```

## Risco residual

O dump estrutural usado como referencia cobre o schema `public`, mas nao prova o estado runtime remoto de `storage.buckets` e das policies gerenciadas em `storage.objects`. A definicao local foi validada no Ciclo 5.2; a equivalencia com HML/producao ainda depende de verificacao read-only antes de qualquer cutover.
