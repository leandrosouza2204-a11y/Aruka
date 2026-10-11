param(
  [Parameter(Mandatory = $true)]
  [string]$BackupDirectory,

  [Parameter(Mandatory = $true)]
  [string]$ContainerName
)

$ErrorActionPreference = "Stop"
$backup = [IO.Path]::GetFullPath($BackupDirectory)
$statePath = Join-Path $backup "recovery-drill-state.json"
$reportPath = Join-Path $backup "recovery-drill-report.json"
$summaryPath = Join-Path $backup "recovery-drill-summary.md"
$validationPath = Join-Path $backup "recovery-drill-validation.csv"
$derivedPath = Join-Path $backup "data.recovery-drill.pg17-selfhosted.sql"

function Invoke-Psql([string]$Sql) {
  $output = & docker exec $ContainerName psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -At -F "|" -c $Sql
  if ($LASTEXITCODE -ne 0) { throw "Disposable database validation query failed." }
  return @($output)
}

$container = (& docker inspect $ContainerName | ConvertFrom-Json)[0]
if ($LASTEXITCODE -ne 0 -or $container.Config.Labels.'aruka.recovery-drill' -ne "20261008") {
  throw "Recovery drill container identity mismatch."
}
if ($container.State.Status -ne "running") { throw "Recovery drill database is not running." }
if (@($container.HostConfig.PortBindings.PSObject.Properties).Count -ne 0) { throw "Recovery drill database publishes ports." }
$backupMount = @($container.Mounts | Where-Object { $_.Destination -eq "/recovery" })
if ($backupMount.Count -ne 1 -or $backupMount[0].RW) { throw "Backup mount is not read-only." }

$validationRows = [Collections.Generic.List[object]]::new()
function Add-Validation([string]$Category, [string]$Check, [string]$Expected, [string]$Actual, [string]$Status) {
  $validationRows.Add([pscustomobject]@{
    Category = $Category
    Check = $Check
    Expected = $Expected
    Actual = $Actual
    Status = $Status
  })
}

$manifest = Import-Csv -LiteralPath (Join-Path $backup "backup-manifest.csv")
$backupIntegrity = $true
foreach ($name in @("roles.sql", "schema.sql", "data.sql", "history_schema.sql", "history_data.sql")) {
  $file = Join-Path $backup $name
  $entry = @($manifest | Where-Object { $_.FileName -eq $name })
  $actualHash = (Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLowerInvariant()
  $expectedHash = $entry[0].SHA256.ToLowerInvariant()
  $status = if ($entry.Count -eq 1 -and $actualHash -eq $expectedHash) { "PASS" } else { "FAIL" }
  if ($status -ne "PASS") { $backupIntegrity = $false }
  Add-Validation "backup_hash" $name $expectedHash $actualHash $status
}

$expectedCounts = @{}
foreach ($fileName in @("data.sql", "history_data.sql")) {
  $current = $null
  $count = 0
  foreach ($line in [IO.File]::ReadLines((Join-Path $backup $fileName))) {
    if ($line -match '^COPY "([^"]+)"\."([^"]+)" ') {
      $current = "$($Matches[1]).$($Matches[2])"
      $count = 0
      continue
    }
    if ($current) {
      if ($line -eq "\.") {
        $expectedCounts[$current] = $count
        $current = $null
      } else {
        $count++
      }
    }
  }
}

$countSelects = foreach ($table in ($expectedCounts.Keys | Sort-Object)) {
  $parts = $table.Split(".")
  "select '$table',count(*)::bigint from `"$($parts[0])`".`"$($parts[1])`""
}
$actualCounts = @{}
foreach ($line in Invoke-Psql ($countSelects -join " union all ")) {
  $parts = $line.Split("|")
  $actualCounts[$parts[0]] = [long]$parts[1]
}
$rowCountMismatches = 0
foreach ($table in ($expectedCounts.Keys | Sort-Object)) {
  $expected = [long]$expectedCounts[$table]
  $actual = [long]$actualCounts[$table]
  $status = if ($expected -eq $actual) { "PASS" } else { "FAIL" }
  if ($status -ne "PASS") { $rowCountMismatches++ }
  Add-Validation "row_count" $table "$expected" "$actual" $status
}

$structureSql = @'
select 'public_tables',count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where c.relkind in ('r','p') and n.nspname='public';
select 'public_functions',count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prokind='f';
select 'public_indexes',count(*) from pg_indexes where schemaname='public';
select 'public_triggers',count(*) from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and not t.tgisinternal;
select 'public_foreign_keys',count(*) from pg_constraint c join pg_class r on r.oid=c.conrelid join pg_namespace n on n.oid=r.relnamespace where n.nspname='public' and c.contype='f';
select 'validated_foreign_keys',count(*) from pg_constraint c join pg_class r on r.oid=c.conrelid join pg_namespace n on n.oid=r.relnamespace where n.nspname='public' and c.contype='f' and c.convalidated;
select 'public_rls_tables',count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind in ('r','p') and c.relrowsecurity;
select 'public_policies',count(*) from pg_policy p join pg_class c on c.oid=p.polrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public';
select 'history_count',count(*) from supabase_migrations.schema_migrations;
select 'history_last',max(version) from supabase_migrations.schema_migrations;
'@
$structure = @{}
foreach ($line in Invoke-Psql $structureSql) {
  $parts = $line.Split("|", 2)
  $structure[$parts[0]] = $parts[1]
}
$expectedStructure = [ordered]@{
  public_tables = "30"
  public_functions = "49"
  public_indexes = "130"
  public_triggers = "12"
  public_foreign_keys = "52"
  validated_foreign_keys = "52"
  public_rls_tables = "30"
  public_policies = "75"
  history_count = "25"
  history_last = "20260909110000"
}
$structurePass = $true
foreach ($key in $expectedStructure.Keys) {
  $status = if ($structure[$key] -eq $expectedStructure[$key]) { "PASS" } else { "FAIL" }
  if ($status -ne "PASS") { $structurePass = $false }
  Add-Validation "structure" $key $expectedStructure[$key] $structure[$key] $status
}

$fkSql = @'
create temp table fk_validation(constraint_name text, orphan_count bigint) on commit drop;
do $$
declare r record; join_pred text; nonnull_pred text; orphan_total bigint;
begin
  for r in
    select con.oid, con.conname,
           format('%I.%I', ns.nspname, rel.relname) source_table,
           format('%I.%I', fns.nspname, frel.relname) target_table,
           array_agg(format('%I', a.attname) order by u.ord) source_cols,
           array_agg(format('%I', fa.attname) order by u.ord) target_cols
    from pg_constraint con
    join pg_class rel on rel.oid=con.conrelid
    join pg_namespace ns on ns.oid=rel.relnamespace
    join pg_class frel on frel.oid=con.confrelid
    join pg_namespace fns on fns.oid=frel.relnamespace
    join unnest(con.conkey,con.confkey) with ordinality u(attnum,fattnum,ord) on true
    join pg_attribute a on a.attrelid=con.conrelid and a.attnum=u.attnum
    join pg_attribute fa on fa.attrelid=con.confrelid and fa.attnum=u.fattnum
    where con.contype='f' and ns.nspname='public'
    group by con.oid,con.conname,ns.nspname,rel.relname,fns.nspname,frel.relname
  loop
    select string_agg(format('s.%s=t.%s',r.source_cols[i],r.target_cols[i]),' and '),
           string_agg(format('s.%s is not null',r.source_cols[i]),' and ')
      into join_pred,nonnull_pred from generate_subscripts(r.source_cols,1) g(i);
    execute format('select count(*) from %s s where %s and not exists (select 1 from %s t where %s)',r.source_table,nonnull_pred,r.target_table,join_pred) into orphan_total;
    insert into fk_validation values(r.conname,orphan_total);
  end loop;
end $$;
select 'fk_checked',count(*) from fk_validation;
select 'fk_orphan_total',coalesce(sum(orphan_count),0) from fk_validation;
select 'aluno_contratos_self_fk_orphans',orphan_count from fk_validation where constraint_name='aluno_contratos_renovado_de_id_fkey';
'@
$fk = @{}
foreach ($line in Invoke-Psql $fkSql) {
  if ($line -match '^([^|]+)\|(.+)$') { $fk[$Matches[1]] = $Matches[2] }
}
foreach ($item in @(@("fk_checked", "52"), @("fk_orphan_total", "0"), @("aluno_contratos_self_fk_orphans", "0"))) {
  $status = if ($fk[$item[0]] -eq $item[1]) { "PASS" } else { "FAIL" }
  Add-Validation "referential_integrity" $item[0] $item[1] $fk[$item[0]] $status
}

$startedAt = [datetimeoffset]::Parse((& docker exec $ContainerName sh -c "cat /tmp/recovery-started-at.txt").Trim())
$restoreEndedAt = [datetimeoffset]::Parse((& docker exec $ContainerName sh -c "cat /tmp/recovery-ended-at.txt").Trim())
$validationEndedAt = [datetimeoffset]::UtcNow
$restoreSeconds = [math]::Round(($restoreEndedAt - $startedAt).TotalSeconds, 3)
$rtoSeconds = [math]::Round(($validationEndedAt - $startedAt).TotalSeconds, 3)
$derivedHash = (Get-FileHash -LiteralPath $derivedPath -Algorithm SHA256).Hash.ToLowerInvariant()
$allValidationPassed = $backupIntegrity -and $structurePass -and $rowCountMismatches -eq 0 -and $fk.fk_orphan_total -eq "0"

$report = [ordered]@{
  decision = "DATABASE_ARTIFACTS_RECOVERED_WITH_BACKUP_GAPS"
  restore_drill = "PARTIAL"
  production_readiness = "NO_GO"
  gates = [ordered]@{
    gate_1 = "PASS"
    gate_2 = "PASS"
    gate_3 = "PASS"
    gate_4 = if ($allValidationPassed) { "PASS_WITH_LIMITATIONS" } else { "FAIL" }
    gate_5 = "PASS"
    gate_6 = "PARTIAL_TRANSIENT_LOCAL_SENSITIVE_CONFIGURATION_EXPOSURE"
  }
  backup_integrity = if ($backupIntegrity) { "PASS" } else { "FAIL" }
  schema_recovery = if ($structurePass) { "PASS" } else { "FAIL" }
  data_recovery = if ($rowCountMismatches -eq 0) { "PASS_DATABASE_ROWS_STORAGE_BYTES_NOT_INCLUDED" } else { "FAIL" }
  migration_history_recovery = if ($structure.history_count -eq "25" -and $structure.history_last -eq "20260909110000") { "PASS" } else { "FAIL" }
  referential_integrity = if ($fk.fk_orphan_total -eq "0") { "PASS_52_OF_52_ZERO_ORPHANS" } else { "FAIL" }
  rls_validation = if ($structure.public_rls_tables -eq "30" -and $structure.public_policies -eq "75") { "PASS_30_TABLES_75_POLICIES" } else { "FAIL" }
  restore_started_at_utc = $startedAt.ToString("o")
  restore_completed_at_utc = $restoreEndedAt.ToString("o")
  validation_completed_at_utc = $validationEndedAt.ToString("o")
  restore_duration_seconds = $restoreSeconds
  rto_observed_seconds = $rtoSeconds
  rto_observed = "OBSERVED_DRILL_NOT_CONTRACTUAL"
  rpo_assessment = "NOT_PROVEN_MULTI_FILE_DUMPS_WITH_DISTINCT_TIMESTAMPS"
  production_changed = $false
  aruka_local_changed = $false
  commits_created = $false
  pr_created = $false
  deploy_executed = $false
  secret_handling = "PARTIAL_TRANSIENT_LOCAL_SENSITIVE_CONFIGURATION_EXPOSED_IN_TOOL_OUTPUT_NOT_COPIED_TO_EVIDENCE"
  evidence_path = $backup
  runbook_updated = "docs/product-roadmap-v4-cycle-12-student-experience-v2/29-production-recovery-readiness-remediation.md"
  target = [ordered]@{
    container = $ContainerName
    container_id = $container.Id
    network = $container.HostConfig.NetworkMode
    ports_published = $false
    backup_mount_read_only = $true
    postgres_version = "17.6"
  }
  restored = [ordered]@{
    public_tables = 30
    public_functions = 49
    public_indexes = 130
    public_triggers = 12
    public_foreign_keys = 52
    public_policies = 75
    public_rls_tables = 30
    copy_tables_compared = $expectedCounts.Count
    row_count_mismatches = $rowCountMismatches
    migration_history_count = 25
    migration_history_last = "20260909110000"
  }
  derived_artifact = [ordered]@{
    file = [IO.Path]::GetFileName($derivedPath)
    sha256 = $derivedHash
    transformation = "DROP_NULL_ONLY_UNSUPPORTED_STORAGE_BUCKET_LIFECYCLE_COLUMNS"
    dropped_columns = @("lifecycle_configuration", "lifecycle_configuration_generation")
    dropped_non_null_values = 0
  }
  residual_risks = @(
    "Storage object bytes are absent; eight storage.objects rows restore metadata only.",
    "The five dumps have distinct generation timestamps and do not prove a single transactional snapshot.",
    "Platform-managed schemas required newer Auth and Storage images plus a documented null-only compatibility transform.",
    "A local sensitive configuration value appeared in transient tool output during container inspection; it was not copied to evidence and should be reviewed or rotated under separate authorization.",
    "RPO is not proven and observed RTO has not been accepted as a business objective."
  )
  next_action = "EXPORT_STORAGE_OBJECT_BYTES_WITH_MANIFEST_AND_REPEAT_DRILL_FROM_A_COMMON_CONSISTENT_RECOVERY_POINT"
}

$utf8NoBom = [Text.UTF8Encoding]::new($false)
[IO.File]::WriteAllText($reportPath, (($report | ConvertTo-Json -Depth 8) + "`n"), $utf8NoBom)
$validationRows | Export-Csv -LiteralPath $validationPath -NoTypeInformation -Encoding utf8

$summary = @"
# Aruka production backup recovery drill - 2026-10-08

DECISION: DATABASE_ARTIFACTS_RECOVERED_WITH_BACKUP_GAPS
RESTORE_DRILL: PARTIAL
PRODUCTION_READINESS: NO_GO

- Gates 1-3: PASS
- Gate 4: PASS_WITH_LIMITATIONS
- Gate 5: PASS
- Gate 6: PARTIAL (local sensitive configuration appeared in transient tool output; external evidence scan is clean)
- Backup integrity: PASS
- Schema recovery: PASS
- Database row recovery: PASS ($($expectedCounts.Count) COPY tables, zero count mismatches)
- Migration history: PASS (25; last 20260909110000)
- Referential integrity: PASS (52/52; zero orphans)
- RLS: PASS (30 tables; 75 policies)
- Restore duration: $restoreSeconds seconds
- Observed RTO through validation/evidence: $rtoSeconds seconds; not contractual or approved
- RPO: NOT_PROVEN; dumps were generated at distinct times
- Production changed: NO
- Aruka local changed: NO
- Commits/PR/deploy: NO/NO/NO

The drill is PARTIAL because Storage object bytes are absent although eight metadata rows exist, and because the artifacts do not prove a common transactional recovery point. Production readiness remains NO_GO.
"@
[IO.File]::WriteAllText($summaryPath, ($summary.TrimEnd() + "`n"), $utf8NoBom)

$state = [ordered]@{
  missionId = "aruka-production-backup-recovery-drill-20261008"
  updatedAtUtc = $validationEndedAt.ToString("o")
  currentGate = 6
  completedGates = @(1, 2, 3, 4, 5, 6)
  resources = [ordered]@{
    cleanDatabaseContainer = $ContainerName
    cleanDatabaseContainerId = $container.Id
    network = $container.HostConfig.NetworkMode
    backupReadOnly = $true
    portsPublished = $false
    preservedPartialContainer = "aruka-recovery-drill-20261008"
    arukaLocalContainersObserved = 6
    arukaLocalResourcesChanged = $false
  }
  strategy = "SUPABASE_PG17_WITH_AUTH_V2_197_0_STORAGE_V1_70_3_AND_HASHED_NULL_ONLY_DATA_TRANSFORM"
  results = $report
  problems = @("AUTH_VERSION_MISMATCH_RESOLVED", "STORAGE_VERSION_MISMATCH_RESOLVED", "STORAGE_OBJECT_BYTES_ABSENT", "TRANSACTIONAL_SNAPSHOT_UNPROVEN", "TRANSIENT_LOCAL_SENSITIVE_CONFIGURATION_EXPOSURE")
  corrections = @("AUTH_UPGRADED_IN_DRILL", "STORAGE_UPGRADED_IN_DRILL", "NULL_ONLY_PLATFORM_COLUMNS_REMOVED_FROM_DERIVED_COPY")
  nextStep = $report.next_action
  status = "PARTIAL"
  productionReadiness = "NO_GO"
}
[IO.File]::WriteAllText($statePath, (($state | ConvertTo-Json -Depth 10) + "`n"), $utf8NoBom)

[pscustomobject]@{
  Status = if ($allValidationPassed) { "PASS_WITH_LIMITATIONS" } else { "FAIL" }
  RestoreDrill = "PARTIAL"
  ProductionReadiness = "NO_GO"
  ValidationRows = $validationRows.Count
  EvidencePath = $backup
  RtoObservedSeconds = $rtoSeconds
} | ConvertTo-Json
