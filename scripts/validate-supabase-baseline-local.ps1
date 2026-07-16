param(
  [switch]$KeepTemp,
  [switch]$UseActiveMigrations,
  [switch]$IncludePostCutoverTest
)

$ErrorActionPreference = "Stop"

function Write-Log($Message) {
  $safeMessage = Sanitize-Log $Message
  Write-Output $safeMessage
  Add-Content -Encoding utf8 -Path $script:ExecutionLog -Value $safeMessage
}

function Sanitize-Log($Message) {
  $value = [string]$Message
  $value = $value -replace '("ANON_KEY"\s*:\s*")[^"]+(")', '$1[REDACTED_LOCAL_ANON_KEY]$2'
  $value = $value -replace '("SERVICE_ROLE_KEY"\s*:\s*")[^"]+(")', '$1[REDACTED_LOCAL_SERVICE_ROLE_KEY]$2'
  $value = $value -replace '("SECRET_KEY"\s*:\s*")[^"]+(")', '$1[REDACTED_LOCAL_SECRET_KEY]$2'
  $value = $value -replace '("DB_URL"\s*:\s*")[^"]+(")', '$1postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]$2'
  $value = $value -replace 'postgres(?:ql)?://[^:\s/"]+:[^@\s/"]+@(?:localhost|127\.0\.0\.1|host\.docker\.internal|[A-Za-z0-9_.-]+):\d+/[A-Za-z0-9_.-]+', 'postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]'
  $value = $value -replace 'sb_secret_[A-Za-z0-9_-]+', '[REDACTED_LOCAL_SECRET_KEY]'
  $value = $value -replace 'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}', '[REDACTED_LOCAL_JWT]'
  $value = $value -replace '\b(password|passwd|pwd)=([^;\s]+)', '$1=[REDACTED_LOCAL_PASSWORD]'
  $value = $value -replace '\b(access_token|refresh_token)\b\s*[:=]\s*["'']?[^"'',\s]+["'']?', '$1=[REDACTED_LOCAL_TOKEN]'
  $value = $value -replace '\bbearer\s+[A-Za-z0-9._~+/=-]+', 'Bearer [REDACTED_LOCAL_TOKEN]'
  $value = $value -replace 'xrmqdkpxnfvusmenadnf', '[REDACTED_HML_PROJECT_REF]'
  $value = $value -replace 'https?://[A-Za-z0-9.-]+\.supabase\.co(?::\d+)?[^\s"'')>]*', '[REDACTED_SUPABASE_HOST]'
  return $value
}

function Invoke-Checked($Description, [string[]]$Command, $WorkingDirectory) {
  Write-Log "Running: $Description"
  Push-Location $WorkingDirectory
  $previousErrorActionPreference = $ErrorActionPreference
  try {
    $ErrorActionPreference = "Continue"
    $output = & $Command[0] @($Command[1..($Command.Length - 1)]) 2>&1
    foreach ($line in $output) {
      Add-Content -Encoding utf8 -Path $script:ExecutionLog -Value (Sanitize-Log $line)
    }
    if ($LASTEXITCODE -ne 0) {
      throw "$Description failed with exit code $LASTEXITCODE"
    }
    return $output
  } finally {
    $ErrorActionPreference = $previousErrorActionPreference
    Pop-Location
  }
}

function Assert-NoRemoteArgs([string[]]$Args) {
  $joined = ($Args -join " ")
  $blocked = @("--linked", "--project-ref", "db push", "db pull", "migration repair", "functions deploy", "supabase.co", "postgresql://", "postgres://")
  foreach ($item in $blocked) {
    if ($joined -match [regex]::Escape($item)) {
      throw "Blocked remote or unsafe Supabase argument detected: $item"
    }
  }
}

function Invoke-LocalPsql($Sql) {
  $args = @("exec", "supabase_db_aruka_baseline_validation", "psql", "-U", "postgres", "-d", "postgres", "-Atc", $Sql)
  $output = & docker @args 2>&1
  foreach ($line in $output) {
    Add-Content -Encoding utf8 -Path $script:ExecutionLog -Value (Sanitize-Log $line)
  }
  if ($LASTEXITCODE -ne 0) {
    throw "Local psql query failed: $Sql"
  }
  return (($output | Where-Object { $_ -ne $null }) -join "`n").Trim()
}

function Assert-Count($Label, $Expected, $Sql) {
  $actual = Invoke-LocalPsql $Sql
  Write-Log "$Label=$actual expected=$Expected"
  if ([int]$actual -ne [int]$Expected) {
    throw "$Label expected $Expected but got $actual"
  }
}

$root = (Resolve-Path ".").Path
$reportDir = Join-Path $root "reports/supabase-baseline-validation"
$cutoverReportDir = Join-Path $root "reports/supabase-migration-cutover-validation"
$runId = Get-Date -Format "yyyyMMddHHmmss"
$tmpProject = Join-Path $reportDir "tmp-local-project-$runId"
$tmpSupabase = Join-Path $tmpProject "supabase"
$tmpMigrations = Join-Path $tmpSupabase "migrations"
$tmpDockerConfig = Join-Path $reportDir "tmp-docker-config"
$candidateDir = Join-Path $root "supabase/baseline-candidate"
$manifestPath = Join-Path $candidateDir "manifest.json"

New-Item -ItemType Directory -Force $reportDir | Out-Null
New-Item -ItemType Directory -Force $cutoverReportDir | Out-Null
$script:ExecutionLog = Join-Path $reportDir "execution.log"
"Supabase isolated baseline local validation - $(Get-Date -Format o)" | Set-Content -Encoding utf8 $script:ExecutionLog

if (-not (Test-Path (Join-Path $root "package.json"))) {
  throw "Run this script from the project root."
}

$projectRefPath = Join-Path $root "supabase/.temp/project-ref"
if (-not (Test-Path $projectRefPath)) {
  throw "Missing supabase/.temp/project-ref."
}

$projectRef = (Get-Content -Raw $projectRefPath).Trim()
if ($projectRef -ne "xrmqdkpxnfvusmenadnf") {
  throw "Unexpected Supabase project-ref: $projectRef"
}
Write-Log "Confirmed linked project-ref is HML: $projectRef"

if (-not (Test-Path $manifestPath)) {
  throw "Missing baseline candidate manifest: $manifestPath"
}

$manifest = Get-Content -Raw $manifestPath | ConvertFrom-Json
$sourceMigrationsDir = if ($UseActiveMigrations) { Join-Path $root "supabase/migrations" } else { $candidateDir }
$candidateSql = Join-Path $sourceMigrationsDir $manifest.main_file
if (-not (Test-Path $candidateSql)) {
  throw "Missing baseline SQL: $candidateSql"
}

$resolvedTmp = [System.IO.Path]::GetFullPath($tmpProject)
$resolvedRoot = [System.IO.Path]::GetFullPath($root)
if ($resolvedTmp -eq $resolvedRoot -or -not $resolvedTmp.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Temporary project path is not safely isolated under the repository reports directory."
}
Write-Log "Temporary isolated project: $resolvedTmp"

if (Test-Path $tmpProject) {
  Remove-Item -LiteralPath $tmpProject -Recurse -Force
}
if (Test-Path $tmpDockerConfig) {
  Remove-Item -LiteralPath $tmpDockerConfig -Recurse -Force
}

New-Item -ItemType Directory -Force $tmpMigrations | Out-Null
New-Item -ItemType Directory -Force $tmpDockerConfig | Out-Null
Copy-Item -LiteralPath (Join-Path $root "supabase/config.toml") -Destination (Join-Path $tmpSupabase "config.toml")
Copy-Item -LiteralPath $candidateSql -Destination (Join-Path $tmpMigrations $manifest.main_file)
if ($IncludePostCutoverTest) {
  $smokeSql = @"
create schema if not exists cutover_validation;
create table if not exists cutover_validation.post_cutover_smoke (
  id integer primary key,
  created_at timestamptz not null default now()
);
"@
  $utf8NoBomSmoke = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText((Join-Path $tmpMigrations "20260717000000_cutover_smoke_test.sql"), $smokeSql, $utf8NoBomSmoke)
}

$copiedMigrations = @(Get-ChildItem -LiteralPath $tmpMigrations -Filter "*.sql")
$expectedMigrationCount = if ($IncludePostCutoverTest) { 2 } else { 1 }
if ($copiedMigrations.Count -ne $expectedMigrationCount) {
  throw "Temporary migrations directory must contain exactly $expectedMigrationCount SQL file(s)."
}
if (-not ($copiedMigrations.Name -contains $manifest.main_file)) {
  throw "Temporary migration is not the baseline candidate."
}

$historicalSourceDir = if ($UseActiveMigrations) { Join-Path $root "supabase/migrations-archive" } else { Join-Path $root "supabase/migrations" }
$historicalNames = @(Get-ChildItem -LiteralPath $historicalSourceDir -Filter "*.sql" | Select-Object -ExpandProperty Name)
foreach ($name in $historicalNames) {
  if (Test-Path (Join-Path $tmpMigrations $name)) {
    throw "Historical migration was copied into isolated project: $name"
  }
}
Write-Log "Isolation confirmed: temporary migrations contain $expectedMigrationCount approved SQL file(s)."
if ($IncludePostCutoverTest) {
  Write-Log "Post-cutover smoke migration added only inside temporary project."
}
if ($UseActiveMigrations) {
  Write-Log "Validation source: active migrations folder."
} else {
  Write-Log "Validation source: baseline candidate."
}

$configText = Get-Content -Raw (Join-Path $tmpSupabase "config.toml")
$configText = $configText -replace 'project_id = ".*"', 'project_id = "aruka_baseline_validation"'
$configText = $configText -replace 'port = 54321', 'port = 55431'
$configText = $configText -replace 'port = 54322', 'port = 55432'
$configText = $configText -replace 'shadow_port = 54320', 'shadow_port = 55430'
$configText = $configText -replace 'port = 54329', 'port = 55439'
$configText = $configText -replace 'port = 54323', 'port = 55433'
$configText = $configText -replace 'port = 54324', 'port = 55434'
$configText = $configText -replace 'port = 54327', 'port = 55437'
$configText = $configText -replace 'port = 54328', 'port = 55438'
$configText = $configText -replace 'enabled = true(\r?\n# Specifies an ordered list of seed files to load during db reset.)', 'enabled = false$1'
$configText = $configText -replace '(\[realtime\]\s*\r?\n)enabled = true', '$1enabled = false'
$configText = $configText -replace '(\[studio\]\s*\r?\n)enabled = true', '$1enabled = false'
$configText = $configText -replace '(\[edge_runtime\]\s*\r?\n)enabled = true', '$1enabled = false'
$configText = $configText -replace '(\[analytics\]\s*\r?\n)enabled = true', '$1enabled = false'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $tmpSupabase "config.toml"), $configText, $utf8NoBom)
Write-Log "Temporary project_id: aruka_baseline_validation"
Write-Log "Temporary Docker config path prepared without copying user config."

$env:DOCKER_CONFIG = $tmpDockerConfig

$supabaseNpx = @("npx.cmd", "--yes", "supabase@2.109.1")
$startArgs = $supabaseNpx + @("start")
Assert-NoRemoteArgs $startArgs

$dumpPath = Join-Path $reportDir "isolated-public-schema.sql"
$started = $false
try {
  $orphanArgs = @("docker", "ps", "-a", "--filter", "name=aruka_baseline_validation", "--format", "{{.Names}}")
  Assert-NoRemoteArgs $orphanArgs
  $orphans = & docker @($orphanArgs[1..($orphanArgs.Length - 1)]) 2>&1
  if ($LASTEXITCODE -eq 0 -and $orphans) {
    foreach ($orphan in $orphans) {
      if ($orphan -match '^supabase_[a-z0-9_]+_aruka_baseline_validation$') {
        Write-Log "Removing orphan local container for temporary project_id: $orphan"
        $rmOutput = docker rm -f $orphan 2>&1
        foreach ($line in $rmOutput) {
          Add-Content -Encoding utf8 -Path $script:ExecutionLog -Value (Sanitize-Log $line)
        }
        if ($LASTEXITCODE -ne 0) {
          throw "Failed to remove orphan temporary container: $orphan"
        }
      } else {
        throw "Refusing to remove container that does not exactly match temporary project_id pattern: $orphan"
      }
    }
  }

  try {
    $dockerOutput = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
      throw ($dockerOutput -join "`n")
    }
    Write-Log "Docker daemon is reachable."
  } catch {
    Write-Log "BLOCKED: Docker daemon is not reachable. $($_.Exception.Message)"
    throw
  }

  Invoke-Checked "Supabase isolated start" $startArgs $tmpProject | Out-Null
  $started = $true

  Assert-Count "public_tables" 19 "select count(*) from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE';"
  Assert-Count "public_functions" 14 "select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public';"
  Assert-Count "public_triggers" 1 "select count(*) from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and not t.tgisinternal;"
  Assert-Count "public_explicit_indexes" 56 "select count(*) from pg_index i join pg_class idx on idx.oid = i.indexrelid join pg_class tbl on tbl.oid = i.indrelid join pg_namespace n on n.oid = tbl.relnamespace left join pg_constraint c on c.conindid = i.indexrelid where n.nspname = 'public' and c.oid is null;"
  Assert-Count "public_policies" 54 "select count(*) from pg_policies where schemaname = 'public';"
  Assert-Count "storage_policies" 4 "select count(*) from pg_policies where schemaname = 'storage' and tablename = 'objects';"
  Assert-Count "public_rls_enabled_tables" 19 "select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity;"
  Assert-Count "storage_bucket_avaliacoes_fotos" 1 "select count(*) from storage.buckets where id = 'avaliacoes-fotos' and name = 'avaliacoes-fotos' and public = false;"
  Assert-Count "security_definer_without_search_path" 0 "select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.prosecdef and not exists (select 1 from unnest(coalesce(p.proconfig, array[]::text[])) cfg where cfg like 'search_path=%');"
  if ($IncludePostCutoverTest) {
    Assert-Count "post_cutover_smoke_table" 1 "select count(*) from information_schema.tables where table_schema = 'cutover_validation' and table_name = 'post_cutover_smoke';"
  }

  Invoke-LocalPsql "select tablename from pg_tables where schemaname = 'public' order by tablename;" | Set-Content -Encoding utf8 (Join-Path $reportDir "tables.txt")
  Invoke-LocalPsql "select p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' order by 1;" | Set-Content -Encoding utf8 (Join-Path $reportDir "functions.txt")
  Invoke-LocalPsql "select c.relname || '.' || t.tgname from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and not t.tgisinternal order by 1;" | Set-Content -Encoding utf8 (Join-Path $reportDir "triggers.txt")
  Invoke-LocalPsql "select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity order by c.relname;" | Set-Content -Encoding utf8 (Join-Path $reportDir "rls.txt")
  Invoke-LocalPsql "select schemaname || '.' || tablename || '.' || policyname from pg_policies where schemaname in ('public','storage') order by 1;" | Set-Content -Encoding utf8 (Join-Path $reportDir "policies.txt")
  Invoke-LocalPsql "select n.nspname || '.' || idx.relname || case when c.oid is null then ' explicit' else ' constraint_backing' end from pg_index i join pg_class idx on idx.oid = i.indexrelid join pg_class tbl on tbl.oid = i.indrelid join pg_namespace n on n.oid = tbl.relnamespace left join pg_constraint c on c.conindid = i.indexrelid where n.nspname = 'public' order by 1;" | Set-Content -Encoding utf8 (Join-Path $reportDir "indexes.txt")
  Invoke-LocalPsql "select table_schema || '.' || table_name || '.' || privilege_type || '.' || grantee from information_schema.table_privileges where table_schema in ('public','storage') order by 1;" | Set-Content -Encoding utf8 (Join-Path $reportDir "grants.txt")
  Invoke-LocalPsql "select id || ' public=' || public::text || ' limit=' || coalesce(file_size_limit::text, '') || ' mimes=' || coalesce(array_to_string(allowed_mime_types, ','), '') from storage.buckets order by id;" | Set-Content -Encoding utf8 (Join-Path $reportDir "storage.txt")
  Invoke-LocalPsql "select version from supabase_migrations.schema_migrations order by version;" | Set-Content -Encoding utf8 (Join-Path $cutoverReportDir "migration-history.txt")
  Get-ChildItem -LiteralPath $tmpMigrations -Filter "*.sql" | Sort-Object Name | Select-Object -ExpandProperty Name | Set-Content -Encoding utf8 (Join-Path $cutoverReportDir "active-migrations.txt")

  $dumpArgs = $supabaseNpx + @("db", "dump", "--local", "--schema", "public", "--file", $dumpPath)
  Assert-NoRemoteArgs $dumpArgs
  Invoke-Checked "Supabase isolated public schema dump" $dumpArgs $tmpProject | Out-Null

  Write-Log "Isolated baseline candidate applied successfully."
} finally {
  if ($started) {
    $stopArgs = $supabaseNpx + @("stop", "--no-backup")
    Assert-NoRemoteArgs $stopArgs
    try {
      Invoke-Checked "Supabase isolated stop" $stopArgs $tmpProject | Out-Null
    } catch {
      Write-Log "WARN: Supabase isolated stop failed: $($_.Exception.Message)"
    }
  }

  if (-not $KeepTemp -and (Test-Path $tmpProject)) {
    Remove-Item -LiteralPath $tmpProject -Recurse -Force
    Write-Log "Temporary isolated project removed."
  } elseif ($KeepTemp) {
    Write-Log "Temporary isolated project preserved by -KeepTemp."
  }
  if (-not $KeepTemp -and (Test-Path $tmpDockerConfig)) {
    Remove-Item -LiteralPath $tmpDockerConfig -Recurse -Force
    Write-Log "Temporary Docker config removed."
  }
}
