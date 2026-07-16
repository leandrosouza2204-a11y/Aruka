# Inventario de Storage

Fonte: `supabase/migrations/20260710_storage_avaliacoes_fotos.sql` e `src/services/avaliacoesFotosService.js`.

## Buckets

| Bucket | Publico | Limite | MIME types | Uso observado |
| --- | --- | --- | --- | --- |
| `avaliacoes-fotos` | `false` | `8388608` bytes | `image/jpeg`, `image/png`, `image/webp` | Upload, remocao e signed URLs de fotos de avaliacoes fisicas |

## Policies em `storage.objects`

| Policy | Comando | Role | Regra |
| --- | --- | --- | --- |
| `avaliacoes_fotos_select_own_folder` | `select` | `authenticated` | `bucket_id = 'avaliacoes-fotos'` e primeira pasta do path igual a `auth.uid()` |
| `avaliacoes_fotos_insert_own_folder` | `insert` | `authenticated` | Mesma restricao por bucket e pasta do usuario |
| `avaliacoes_fotos_update_own_folder` | `update` | `authenticated` | Mesma restricao em `using` e `with check` |
| `avaliacoes_fotos_delete_own_folder` | `delete` | `authenticated` | Mesma restricao por bucket e pasta do usuario |

## Uso no Codigo

- `src/services/avaliacoesFotosService.js` usa `supabase.storage.from("avaliacoes-fotos")`.
- Padrao inferido: arquivos devem ficar sob pasta `user_id/...` para satisfazer RLS de Storage.

## Lacunas

- Este ciclo nao consulta o painel/runtime Supabase. Nao foi possivel confirmar se existem buckets adicionais criados manualmente.
- Nao ha configuracao ativa de buckets em `supabase/config.toml`; o bucket versionado esta em migration.
