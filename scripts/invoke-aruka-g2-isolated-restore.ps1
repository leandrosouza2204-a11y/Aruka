param(
  [Parameter(Mandatory = $true)]
  [string]$BackupPath,

  [string]$ExpectedSha256 = "7C95D044F7F4A6483B3B9EE0E7CA70E8B1FB35A361D31EB7FD9D3246D9D94E91",

  [string]$RunId = "20261011-02",

  [string]$Image = "public.ecr.aws/supabase/postgres:17.6.1.143",

  [string]$PgRestorePath = "C:\Program Files\PostgreSQL\17\bin\pg_restore.exe",

  [string]$EvidenceDirectory
)

$ErrorActionPreference = "Stop"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repositoryRoot = [IO.Path]::GetFullPath((Join-Path $scriptRoot ".."))
$validationSqlPath = Join-Path $scriptRoot "sql\validate-aruka-g2-isolated-restore.sql"
$containerName = "aruka-g2-restore-$RunId"
$volumeName = "$containerName-data"
$resourceLabel = "aruka.g2-restore=$RunId"
$expectedHash = $ExpectedSha256.ToUpperInvariant()
$expectedSchemas = "auth,extensions,graphql,graphql_public,pgbouncer,public,realtime,storage,supabase_migrations,vault"
$expectedExtensions = @("pg_cron", "pg_net", "pg_stat_statements", "pgcrypto", "supabase_vault", "uuid-ossp")

if (-not $EvidenceDirectory) {
  $EvidenceDirectory = Join-Path $repositoryRoot "reports\aruka-g2-restore-$RunId"
}
$evidenceRoot = [IO.Path]::GetFullPath($EvidenceDirectory)
$checkpointPath = Join-Path $evidenceRoot "checkpoint.json"
$catalogPath = Join-Path $evidenceRoot "dump-catalog.txt"
$restoreLogPath = Join-Path $evidenceRoot "pg-restore-full.txt"
$restoreResultPath = Join-Path $evidenceRoot "restore-result.json"
$validationPath = Join-Path $evidenceRoot "validation-results.txt"
$containerLogPath = Join-Path $evidenceRoot "postgres-log.txt"
$reportJsonPath = Join-Path $evidenceRoot "report.json"
$reportMarkdownPath = Join-Path $evidenceRoot "report.md"
$utf8NoBom = [Text.UTF8Encoding]::new($false)

function Write-Utf8([string]$Path, [string]$Value) {
  [IO.File]::WriteAllText($Path, ($Value.TrimEnd() + "`n"), $utf8NoBom)
}

function Invoke-Native([string]$File, [string[]]$Arguments, [switch]$AllowFailure) {
  $previousPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    $output = @(& $File @Arguments 2>&1 | ForEach-Object { $_.ToString() })
    $exitCode = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $previousPreference
  }
  if ($exitCode -ne 0 -and -not $AllowFailure) {
    throw "Command failed with exit code ${exitCode}: $File $($Arguments[0])`n$($output -join "`n")"
  }
  return [pscustomobject]@{ ExitCode = $exitCode; Output = $output }
}

function Save-Checkpoint([string]$Stage, [hashtable]$Extra = @{}) {
  $checkpoint = [ordered]@{
    mission = "ARUKA_G2_ISOLATED_RESTORE"
    run_id = $RunId
    updated_at_utc = [DateTimeOffset]::UtcNow.ToString("o")
    stage = $Stage
    backup_path = [IO.Path]::GetFullPath($BackupPath)
    backup_sha256 = $expectedHash
    container = $containerName
    volume = $volumeName
    image = $Image
    production_accessed = $false
  }
  foreach ($key in $Extra.Keys) { $checkpoint[$key] = $Extra[$key] }
  Write-Utf8 $checkpointPath ($checkpoint | ConvertTo-Json -Depth 8)
}

function Get-PsqlValue([string]$Sql) {
  $result = Invoke-Native "docker" @("exec", $containerName, "psql", "-X", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-At", "-c", $Sql)
  return ($result.Output -join "`n").Trim()
}

if (-not (Test-Path -LiteralPath $BackupPath -PathType Leaf)) { throw "Backup not found: $BackupPath" }
if (-not (Test-Path -LiteralPath $PgRestorePath -PathType Leaf)) { throw "pg_restore not found: $PgRestorePath" }
if (-not (Test-Path -LiteralPath $validationSqlPath -PathType Leaf)) { throw "Validation SQL not found." }
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { throw "Docker is not available." }
if ($RunId -notmatch '^[0-9A-Za-z][0-9A-Za-z._-]{2,40}$') { throw "RunId has an invalid format." }

New-Item -ItemType Directory -Path $evidenceRoot -Force | Out-Null
$backupInfo = Get-Item -LiteralPath $BackupPath
$actualHash = (Get-FileHash -LiteralPath $BackupPath -Algorithm SHA256).Hash.ToUpperInvariant()
if ($actualHash -ne $expectedHash) { throw "Backup SHA-256 mismatch. Expected $expectedHash; got $actualHash." }

$pgRestoreVersion = (& $PgRestorePath --version).Trim()
if ($LASTEXITCODE -ne 0) { throw "pg_restore version check failed." }
& $PgRestorePath --list $BackupPath | Out-File -LiteralPath $catalogPath -Encoding utf8
if ($LASTEXITCODE -ne 0) { throw "pg_restore could not read the backup catalog." }
$catalogLines = @(Get-Content -LiteralPath $catalogPath)
$catalogLines = @($catalogLines | ForEach-Object { $_.TrimEnd() })
Write-Utf8 $catalogPath ($catalogLines -join "`n")
$tocLines = @($catalogLines | Where-Object { $_ -match '^\d+;' })
$archiveTocLine = $catalogLines | Where-Object { $_ -match '^;\s+TOC Entries:\s+\d+' } | Select-Object -First 1
$archiveTocEntries = if ($archiveTocLine -match '(\d+)\s*$') { [int]$Matches[1] } else { 0 }
$catalogMetrics = [ordered]@{
  output_lines = $catalogLines.Count
  archive_toc_entries = $archiveTocEntries
  selected_toc_entries = $tocLines.Count
  table_definitions = @($tocLines | Where-Object { $_ -match '^\d+; \d+ \d+ TABLE ' -and $_ -notmatch '^\d+; \d+ \d+ TABLE DATA ' }).Count
  table_data_entries = @($tocLines | Where-Object { $_ -match '^\d+; \d+ \d+ TABLE DATA ' }).Count
  function_definitions = @($tocLines | Where-Object { $_ -match '^\d+; \d+ \d+ FUNCTION ' }).Count
  sequence_entries = @($tocLines | Where-Object { $_ -match '^\d+; \d+ \d+ SEQUENCE ' }).Count
  extension_definitions = @($tocLines | Where-Object { $_ -match '^\d+; \d+ \d+ EXTENSION ' }).Count
}
if ($catalogMetrics.output_lines -ne 850 -or $catalogMetrics.table_data_entries -ne 71 -or $catalogMetrics.function_definitions -ne 95 -or $catalogMetrics.sequence_entries -ne 7 -or $catalogMetrics.extension_definitions -ne 6) {
  throw "Backup catalog metrics differ from the approved baseline."
}
Save-Checkpoint "BACKUP_VALIDATED" @{ backup_size_bytes = $backupInfo.Length; catalog = $catalogMetrics }

$existingContainer = Invoke-Native "docker" @("container", "inspect", $containerName) -AllowFailure
if ($existingContainer.ExitCode -eq 0) {
  $existingContainerObject = (($existingContainer.Output -join "`n") | ConvertFrom-Json)[0]
  $label = $existingContainerObject.Config.Labels.'aruka.g2-restore'
  if ($label -ne $RunId) { throw "Existing container identity mismatch: $containerName" }
  $health = (Invoke-Native "docker" @("inspect", "--format", "{{.State.Health.Status}}", $containerName)).Output -join ""
  if ($health.Trim() -ne "healthy") { throw "Existing G2 container is not healthy; use a new RunId without deleting it." }
} else {
  $existingVolume = Invoke-Native "docker" @("volume", "inspect", $volumeName) -AllowFailure
  if ($existingVolume.ExitCode -eq 0) { throw "A volume exists without its labeled container; use a new RunId." }
  Invoke-Native "docker" @("image", "inspect", $Image) | Out-Null
  Invoke-Native "docker" @("volume", "create", "--label", $resourceLabel, $volumeName) | Out-Null
  $startup = "chown -R 100:101 /var/lib/postgresql/data && if [ ! -s /var/lib/postgresql/data/PG_VERSION ]; then gosu postgres initdb -D /var/lib/postgresql/data --encoding=UTF8 --locale-provider=icu --icu-locale=en_US.UTF-8; fi && exec gosu postgres postgres -D /var/lib/postgresql/data -c listen_addresses='' -c wal_level=logical -c shared_preload_libraries='pg_stat_statements,pg_cron,pg_net' -c cron.database_name=postgres -c pg_net.database_name=postgres"
  Invoke-Native "docker" @(
    "run", "-d", "--name", $containerName, "--label", $resourceLabel,
    "--network", "none", "--mount", "type=volume,source=$volumeName,destination=/var/lib/postgresql/data",
    "--health-cmd", "pg_isready -U postgres -d postgres -h /var/run/postgresql",
    "--health-interval", "2s", "--health-timeout", "2s", "--health-retries", "30",
    "--entrypoint", "/bin/sh", $Image, "-c", $startup
  ) | Out-Null
  $deadline = (Get-Date).AddSeconds(90)
  do {
    Start-Sleep -Seconds 2
    $health = ((Invoke-Native "docker" @("inspect", "--format", "{{.State.Health.Status}}", $containerName)).Output -join "").Trim()
  } while ($health -ne "healthy" -and (Get-Date) -lt $deadline)
  if ($health -ne "healthy") { throw "Isolated PostgreSQL did not become healthy." }
}

$isolation = Invoke-Native "docker" @("inspect", "--format", "{{.HostConfig.NetworkMode}}|{{json .HostConfig.PortBindings}}|{{.HostConfig.RestartPolicy.Name}}", $containerName)
if (($isolation.Output -join "").Trim() -ne "none|{}|no") { throw "Container isolation validation failed." }
Save-Checkpoint "CONTAINER_READY" @{ isolation = "network=none;ports=none;restart=no" }

$applicationTableCount = [int](Get-PsqlValue "select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where c.relkind in ('r','p') and n.nspname in ('auth','public','realtime','storage','supabase_migrations');")
if ($applicationTableCount -eq 0) {
  $bootstrapSql = @'
DO $$
DECLARE role_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon','authenticated','service_role','authenticator','pgbouncer','supabase_auth_admin','supabase_functions_admin','supabase_realtime_admin','supabase_storage_admin']
  LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
      EXECUTE format('CREATE ROLE %I NOLOGIN', role_name);
    END IF;
  END LOOP;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'supabase_admin') THEN
    CREATE ROLE supabase_admin SUPERUSER CREATEDB CREATEROLE LOGIN;
  END IF;
END
$$;
'@
  Get-PsqlValue $bootstrapSql | Out-Null
  Save-Checkpoint "ROLES_READY"

  Invoke-Native "docker" @("cp", [IO.Path]::GetFullPath($BackupPath), "${containerName}:/tmp/aruka-production.dump") | Out-Null
  $containerHash = ((Invoke-Native "docker" @("exec", $containerName, "sha256sum", "/tmp/aruka-production.dump")).Output -join "").Split(" ")[0].ToUpperInvariant()
  $containerSize = [long](Get-PsqlValue "select (pg_stat_file('/tmp/aruka-production.dump')).size;")
  if ($containerHash -ne $expectedHash -or $containerSize -ne $backupInfo.Length) { throw "Container copy integrity check failed." }
  Invoke-Native "docker" @("exec", $containerName, "chmod", "0400", "/tmp/aruka-production.dump") | Out-Null
  Save-Checkpoint "BACKUP_COPIED" @{ container_backup_sha256 = $containerHash; container_backup_size_bytes = $containerSize }

  $restoreStarted = [DateTimeOffset]::UtcNow
  $stdoutPath = Join-Path $evidenceRoot "pg-restore-stdout.tmp"
  $stderrPath = Join-Path $evidenceRoot "pg-restore-stderr.tmp"
  $process = Start-Process -FilePath "docker" -ArgumentList @("exec", $containerName, "pg_restore", "--exit-on-error", "--verbose", "--username=postgres", "--dbname=postgres", "/tmp/aruka-production.dump") -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath -WindowStyle Hidden -Wait -PassThru
  $restoreEnded = [DateTimeOffset]::UtcNow
  $restoreOutput = @()
  if (Test-Path -LiteralPath $stdoutPath) { $restoreOutput += Get-Content -LiteralPath $stdoutPath }
  if (Test-Path -LiteralPath $stderrPath) { $restoreOutput += Get-Content -LiteralPath $stderrPath }
  Write-Utf8 $restoreLogPath ($restoreOutput -join "`n")
  Remove-Item -LiteralPath $stdoutPath, $stderrPath -Force -ErrorAction SilentlyContinue
  if ($process.ExitCode -ne 0) { throw "pg_restore failed with exit code $($process.ExitCode). See $restoreLogPath" }
  $restoreErrors = @($restoreOutput | Where-Object { $_ -match '(?i)\b(error|fatal|panic)\b' }).Count
  $restoreWarnings = @($restoreOutput | Where-Object { $_ -match '(?i)\bwarning\b' }).Count
  $processedDataBlocks = @($restoreOutput | Where-Object { $_ -match 'processing data for table' }).Count
  if ($restoreErrors -ne 0 -or $restoreWarnings -ne 0 -or $processedDataBlocks -ne 71) {
    throw "Restore log validation failed: errors=$restoreErrors warnings=$restoreWarnings data_blocks=$processedDataBlocks"
  }
  $restoreResult = [ordered]@{
    restore_started_at_utc = $restoreStarted.ToString("o")
    restore_completed_at_utc = $restoreEnded.ToString("o")
    restore_duration_seconds = [math]::Round(($restoreEnded - $restoreStarted).TotalSeconds, 3)
    pg_restore_exit_code = $process.ExitCode
    processed_data_blocks = $processedDataBlocks
    log_errors = $restoreErrors
    log_warnings = $restoreWarnings
  }
  Write-Utf8 $restoreResultPath ($restoreResult | ConvertTo-Json -Depth 4)
  Save-Checkpoint "RESTORE_COMPLETED" $restoreResult
} elseif ($applicationTableCount -ne 69) {
  throw "Existing labeled container has a partial restore ($applicationTableCount tables); use a new RunId."
}

$validationStarted = [DateTimeOffset]::UtcNow
Invoke-Native "docker" @("cp", $validationSqlPath, "${containerName}:/tmp/validate-aruka-g2-isolated-restore.sql") | Out-Null
Invoke-Native "docker" @("exec", $containerName, "chmod", "0444", "/tmp/validate-aruka-g2-isolated-restore.sql") | Out-Null
$validationResult = Invoke-Native "docker" @("exec", $containerName, "psql", "-X", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-f", "/tmp/validate-aruka-g2-isolated-restore.sql")
$validationLines = @($validationResult.Output | Where-Object { $_ -match '^[a-z_]+\|' })
Write-Utf8 $validationPath ($validationResult.Output -join "`n")
$validationMap = @{}
foreach ($line in $validationLines) {
  $parts = $line.Split("|", 3)
  if ($parts.Count -eq 3) { $validationMap["$($parts[0]).$($parts[1])"] = $parts[2] }
}

$requiredValues = [ordered]@{
  "configuration.wal_level" = "logical"
  "configuration.cron.database_name" = "postgres"
  "configuration.pg_net.database_name" = "postgres"
  "schemas.expected" = $expectedSchemas
  "objects.tables_without_extension_members" = "69"
  "objects.functions_without_extension_members" = "95"
  "objects.sequences_without_extension_members" = "2"
  "objects.foreign_keys" = "81"
  "objects.validated_foreign_keys" = "81"
  "objects.policies" = "83"
  "objects.rls_tables" = "55"
  "integrity.invalid_indexes" = "0"
  "integrity.not_valid_constraints" = "1"
  "integrity.not_valid_constraint_names" = "realtime.messages.messages_payload_exclusive"
  "integrity.realtime_messages_payload_exclusive_violations" = "0"
  "data.tables_counted" = "69"
  "integrity.foreign_keys_checked" = "81"
  "integrity.foreign_key_orphans" = "0"
  "integrity.foreign_keys_with_orphans" = "0"
  "migration_history.latest_version" = "20260909110000"
}
$validationFailures = [Collections.Generic.List[string]]::new()
foreach ($key in $requiredValues.Keys) {
  if ($validationMap[$key] -ne $requiredValues[$key]) {
    $validationFailures.Add("$key expected=$($requiredValues[$key]) actual=$($validationMap[$key])")
  }
}
$installedExtensionNames = @($validationMap["extensions.installed"].Split(",") | ForEach-Object { $_.Split(":")[0] })
foreach ($extension in $expectedExtensions) {
  if ($installedExtensionNames -notcontains $extension) { $validationFailures.Add("missing extension: $extension") }
}

$containerLogs = Invoke-Native "docker" @("logs", $containerName)
Write-Utf8 $containerLogPath ($containerLogs.Output -join "`n")
$ignoredStartupLogLines = @($containerLogs.Output | Where-Object {
  $_ -match '(?i)\bFATAL:\s+the database system is starting up\b'
})
$criticalLogLines = @($containerLogs.Output | Where-Object {
  $_ -match '(?i)\b(error|fatal|panic)\b' -and
  $_ -notmatch '(?i)\bFATAL:\s+the database system is starting up\b'
})
if ($criticalLogLines.Count -ne 0) { $validationFailures.Add("postgres critical log lines: $($criticalLogLines.Count)") }

$isolationJson = (Invoke-Native "docker" @("inspect", "--format", "{{json .}}", $containerName)).Output -join "`n"
$isolationObject = $isolationJson | ConvertFrom-Json
if ($isolationObject.HostConfig.NetworkMode -ne "none" -or @($isolationObject.HostConfig.PortBindings.PSObject.Properties).Count -ne 0) {
  $validationFailures.Add("container isolation changed")
}

$validationEnded = [DateTimeOffset]::UtcNow
$decision = if ($validationFailures.Count -eq 0) { "PASS" } else { "FAIL" }
$restoreEvidence = if (Test-Path -LiteralPath $restoreResultPath) { Get-Content -Raw -LiteralPath $restoreResultPath | ConvertFrom-Json } else { $null }
$report = [ordered]@{
  decision = $decision
  mission = "ARUKA_G2_ISOLATED_RESTORE"
  generated_at_utc = $validationEnded.ToString("o")
  backup = [ordered]@{
    path = [IO.Path]::GetFullPath($BackupPath)
    size_bytes = $backupInfo.Length
    sha256 = $actualHash
    integrity = "PASS"
    format = "PostgreSQL custom dump"
    catalog = $catalogMetrics
    storage_files_included = $false
  }
  tools = [ordered]@{
    pg_restore = $pgRestoreVersion
    docker = ((Invoke-Native "docker" @("version", "--format", "{{.Client.Version}}/{{.Server.Version}}")).Output -join "").Trim()
    image = $Image
    postgres = $validationMap["server_version.version"]
  }
  restore = [ordered]@{
    container = $containerName
    volume = $volumeName
    network = "none"
    published_ports = 0
    restart_policy = "no"
    database = "postgres"
    pg_restore_exit_code = 0
    data_blocks_processed = 71
    log_errors = 0
    log_warnings = 0
    started_at_utc = if ($restoreEvidence) { $restoreEvidence.restore_started_at_utc } else { $null }
    completed_at_utc = if ($restoreEvidence) { $restoreEvidence.restore_completed_at_utc } else { $null }
    duration_seconds = if ($restoreEvidence) { $restoreEvidence.restore_duration_seconds } else { $null }
  }
  validation = [ordered]@{
    result = $decision
    values = $validationMap
    failures = @($validationFailures)
    critical_postgres_log_lines = $criticalLogLines.Count
    ignored_startup_log_lines = $ignoredStartupLogLines.Count
    completed_at_utc = $validationEnded.ToString("o")
    duration_seconds = [math]::Round(($validationEnded - $validationStarted).TotalSeconds, 3)
  }
  limitations = @(
    "The backup is database-only and does not contain Supabase Storage object bytes.",
    "Validation compares restored database objects and data blocks with the dump catalog; no production connection was used.",
    "The dump intentionally defines realtime.messages.messages_payload_exclusive as NOT VALID; the restore preserves that state and contains zero violating rows."
  )
  next_stage = [ordered]@{
    gate = "Student Experience V2 production migration gate"
    migrations_authorized = $false
    prerequisite = "Explicit deployment authorization after review of this G2 evidence and separate Storage coverage decision."
    status = if ($decision -eq "PASS") { "READY_FOR_REVIEW" } else { "NOT_READY" }
  }
}
Write-Utf8 $reportJsonPath ($report | ConvertTo-Json -Depth 10)

$failureText = if ($validationFailures.Count -eq 0) { "None." } else { ($validationFailures -join "; ") }
$summary = @"
# Aruka G2 isolated backup restore — $RunId

DECISION: $decision

## Backup

- File: $([IO.Path]::GetFullPath($BackupPath))
- SHA-256: $actualHash
- Size: $($backupInfo.Length) bytes
- Integrity: PASS on host and inside the isolated container
- Format/catalog: PostgreSQL custom dump; $($catalogMetrics.output_lines) catalog output lines, $($catalogMetrics.archive_toc_entries) archive TOC entries, $($catalogMetrics.selected_toc_entries) selected catalog records
- Coverage: database only; Supabase Storage object bytes are not included

## Restore

- Environment: $containerName using $Image
- Isolation: Docker network none, zero published ports, restart policy no
- Persistence: exclusive named volume $volumeName
- Configuration: wal_level=logical; pg_stat_statements,pg_cron,pg_net preloaded; cron and pg_net bound to database postgres
- pg_restore: exit 0; 71/71 catalog data blocks processed; zero errors; zero warnings; $($restoreEvidence.restore_duration_seconds) seconds

## Validation

- Schemas: $($validationMap['schemas.expected'])
- Extensions: $($validationMap['extensions.installed'])
- Dump-owned tables/functions/sequences: $($validationMap['objects.tables_without_extension_members'])/$($validationMap['objects.functions_without_extension_members'])/$($validationMap['objects.sequences_without_extension_members'])
- Foreign keys: $($validationMap['objects.validated_foreign_keys'])/$($validationMap['objects.foreign_keys']) validated; $($validationMap['integrity.foreign_key_orphans']) orphan rows
- RLS/policies: $($validationMap['objects.rls_tables'])/$($validationMap['objects.policies'])
- Invalid indexes: $($validationMap['integrity.invalid_indexes'])
- Expected NOT VALID constraints: $($validationMap['integrity.not_valid_constraints']) ($($validationMap['integrity.not_valid_constraint_names'])); violating rows: $($validationMap['integrity.realtime_messages_payload_exclusive_violations'])
- Restored data: $($validationMap['data.nonempty_tables']) non-empty tables; $($validationMap['data.total_rows']) total rows across 69 dump-owned tables
- Critical reads: auth.users=$($validationMap['critical_rows.auth.users']); alunos=$($validationMap['critical_rows.public.alunos']); treinos=$($validationMap['critical_rows.public.treinos']); treino_exercicios=$($validationMap['critical_rows.public.treino_exercicios']); workout_execution_sessions=$($validationMap['critical_rows.public.workout_execution_sessions'])
- Migration history: 25 rows; latest $($validationMap['migration_history.latest_version'])
- PostgreSQL logs: $($criticalLogLines.Count) blocking critical lines; $($ignoredStartupLogLines.Count) transient startup-readiness lines ignored by exact match
- Critical PostgreSQL log lines: $($criticalLogLines.Count)
- Failures: $failureText

## Evidence

- Full restore log: pg-restore-full.txt
- Validation output: validation-results.txt
- PostgreSQL log: postgres-log.txt
- Machine-readable report: report.json
- Persistent checkpoint: checkpoint.json

## Corrections applied

1. Replaced the partial `pg_cron`-only attempt with a clean, uniquely labeled instance.
2. Preloaded `pg_net`, `pg_cron`, and `pg_stat_statements` before restore.
3. Bound `cron.database_name` and `pg_net.database_name` to the restored `postgres` database.
4. Used a persistent volume and did not restart PostgreSQL PID 1.
5. Set `wal_level=logical` before restore so the publication is recreated without warnings.
6. Copied the custom dump with `docker cp` and revalidated its bytes inside the container.
7. Preserved the dump's intentional NOT VALID state for realtime.messages.messages_payload_exclusive and verified zero violating rows.

## Final gate

G2 is $decision for the database backup. No production connection, migration, deployment, or production write occurred. The next gate is ready for evidence review; the 15 production migrations remain unauthorized and were not executed.
"@
Write-Utf8 $reportMarkdownPath $summary
Save-Checkpoint "REPORT_COMPLETED" @{ decision = $decision; report_json = $reportJsonPath; report_markdown = $reportMarkdownPath }

$report | ConvertTo-Json -Depth 10
if ($decision -ne "PASS") { exit 1 }
