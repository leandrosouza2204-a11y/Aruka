\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned

select json_build_object(
  'id', id,
  'bucket_id', bucket_id,
  'name', name,
  'owner_id', owner_id,
  'created_at', created_at,
  'updated_at', updated_at,
  'last_accessed_at', last_accessed_at,
  'metadata', metadata
)::text
from storage.objects
where coalesce(is_delete_marker, false) = false
order by bucket_id, name;
