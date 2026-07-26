param()

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path ".").Path
$ReportDir = Join-Path $Root "reports/supabase-local-bootstrap"
$ConfigText = Get-Content -Raw "supabase/config.toml"
$ManifestPath = Join-Path $Root "supabase/baseline-candidate/manifest.json"
$Manifest = Get-Content -Raw $ManifestPath | ConvertFrom-Json
$ExpectedTables = [int]$Manifest.expected_tables
$ExpectedFunctions = [int]$Manifest.expected_functions
$ExpectedTriggers = [int]$Manifest.expected_triggers
$ExpectedIndexes = [int]$Manifest.expected_indexes
$ExpectedPolicies = [int]$Manifest.expected_policies
$ProjectId = ([regex]::Match($ConfigText, '(?m)^project_id\s*=\s*"([^"]+)"')).Groups[1].Value
if ([string]::IsNullOrWhiteSpace($ProjectId)) { $ProjectId = "ConsultoriaFitness" }
$DbContainer = "supabase_db_$ProjectId"
New-Item -ItemType Directory -Force $ReportDir | Out-Null

function Query($Sql) {
  $out = docker exec $DbContainer psql -U postgres -d postgres -Atc $Sql 2>&1
  if ($LASTEXITCODE -ne 0) { throw "Local query failed: $Sql`n$out" }
  return (($out | ForEach-Object { [string]$_ }) -join "`n").Trim()
}

function AssertCount($Name, $Expected, $Sql) {
  $actual = [int](Query $Sql)
  if ($actual -ne $Expected) { throw "$Name expected $Expected got $actual" }
  return $actual
}

$inventory = [ordered]@{
  public_tables = AssertCount "public_tables" $ExpectedTables "select count(*) from information_schema.tables where table_schema='public' and table_type='BASE TABLE';"
  public_functions = AssertCount "public_functions" $ExpectedFunctions "select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public';"
  public_triggers = AssertCount "public_triggers" $ExpectedTriggers "select count(*) from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and not t.tgisinternal;"
  public_explicit_indexes = AssertCount "public_explicit_indexes" $ExpectedIndexes "select count(*) from pg_index i join pg_class idx on idx.oid=i.indexrelid join pg_class tbl on tbl.oid=i.indrelid join pg_namespace n on n.oid=tbl.relnamespace left join pg_constraint c on c.conindid=i.indexrelid where n.nspname='public' and c.oid is null;"
  public_policies = AssertCount "public_policies" $ExpectedPolicies "select count(*) from pg_policies where schemaname='public';"
  storage_policies = AssertCount "storage_policies" 4 "select count(*) from pg_policies where schemaname='storage' and tablename='objects';"
  public_rls_enabled_tables = AssertCount "public_rls_enabled_tables" 19 "select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and c.relrowsecurity;"
  storage_bucket_avaliacoes_fotos = AssertCount "storage_bucket_avaliacoes_fotos" 1 "select count(*) from storage.buckets where id='avaliacoes-fotos' and public=false;"
  security_definer_without_search_path = AssertCount "security_definer_without_search_path" 0 "select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prosecdef and not exists (select 1 from unnest(coalesce(p.proconfig,array[]::text[])) cfg where cfg like 'search_path=%');"
  archived_migrations_in_history = AssertCount "archived_migrations_in_history" 0 "select count(*) from supabase_migrations.schema_migrations where version < '20260716090000';"
  baseline_in_history = AssertCount "baseline_in_history" 1 "select count(*) from supabase_migrations.schema_migrations where version='20260716090000';"
}

$inventory | ConvertTo-Json | Set-Content -Encoding utf8 (Join-Path $ReportDir "schema-inventory.json")
Query "select version from supabase_migrations.schema_migrations order by version;" | Set-Content -Encoding utf8 (Join-Path $ReportDir "migration-history.txt")
@{ result = "LOCAL_RUNTIME_VALIDATED"; inventory = $inventory } | ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 (Join-Path $ReportDir "validation-summary.json")
Write-Output "LOCAL_RUNTIME_VALIDATED"
