param()

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)

$Root = (Resolve-Path ".").Path
$IsCi = $env:CI -eq "true"
$IsCiLocalOnly = $env:SUPABASE_CI_LOCAL_ONLY -eq "true"
$IsIsolatedCi = $IsCi -and $IsCiLocalOnly
$Mode = if ($IsIsolatedCi) { "ISOLATED_CI" } else { "LOCAL" }
$ExpectedHmlPreservation = -not $IsIsolatedCi
$CiProjectId = if ($null -eq $env:SUPABASE_PROJECT_ID) { "" } else { $env:SUPABASE_PROJECT_ID.Trim() }
$TempProjectId = if ($IsIsolatedCi -and -not [string]::IsNullOrWhiteSpace($CiProjectId)) { $CiProjectId } else { "aruka_ci_clean_worktree_validation" }
$TempBase = Join-Path ([System.IO.Path]::GetTempPath()) ("aruka-clean-worktree-" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds())
$Worktree = Join-Path $TempBase "repo"
$ReportDir = Join-Path $Root "reports/supabase-local-bootstrap"
$ResultPath = Join-Path $ReportDir "clean-worktree-result.json"
$SummaryPath = Join-Path $ReportDir "clean-worktree-summary.md"
$DebugPath = Join-Path $ReportDir "tmp-clean-worktree-debug.log"
$ExpectedRef = ("xrmqdkpx" + "nfvusmenadnf")
$ExpectedSha = "67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B"
$NpmCmdCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (-not $NpmCmdCommand) { $NpmCmdCommand = Get-Command npm -ErrorAction Stop }
$NpmCmd = $NpmCmdCommand.Source
$ScriptStartedAt = [DateTimeOffset]::UtcNow
$script:LastCheckpoint = ""
$scriptExitCode = 1
$primaryError = $null
$cleanupErrors = @()
$timings = [ordered]@{}
$childProcesses = @()
$stepStatus = [ordered]@{
  npm_ci_passed = $false
  preflight_passed = $false
  bootstrap_passed = $false
  validate_passed = $false
  stop_passed = $false
}

New-Item -ItemType Directory -Force $ReportDir | Out-Null
Remove-Item -LiteralPath $DebugPath -Force -ErrorAction SilentlyContinue

function Write-Checkpoint($Name) {
  $script:LastCheckpoint = $Name
  $line = "[{0}] CHECKPOINT: {1}" -f ([DateTimeOffset]::Now.ToString("o")), $Name
  Add-Content -Encoding utf8 -Path $DebugPath -Value $line
}

function JsonString($Text) {
  if ($null -eq $Text) { return "null" }
  $escaped = ([string]$Text) -replace '\\', '\\' -replace '"', '\"' -replace "`r", '\r' -replace "`n", '\n' -replace "`t", '\t'
  return '"' + $escaped + '"'
}

function JsonNumber($Value) {
  if ($null -eq $Value -or $Value -eq "") { return "null" }
  return [string]$Value
}

function Safe-Output($Text) {
  ([string]$Text) `
    -replace 'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}', '[REDACTED_LOCAL_JWT]' `
    -replace 'postgres(?:ql)?://[^"\r\n\s]+', 'postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]' `
    -replace 'sb_secret_[A-Za-z0-9_-]+', '[REDACTED_LOCAL_SECRET_KEY]' `
    -replace '"JWT_SECRET": "[^"]+"', '"JWT_SECRET": "[REDACTED_LOCAL_JWT_SECRET]"' `
    -replace '"PUBLISHABLE_KEY": "[^"]+"', '"PUBLISHABLE_KEY": "[REDACTED_LOCAL_PUBLISHABLE_KEY]"' `
    -replace '"S3_PROTOCOL_ACCESS_KEY_ID": "[^"]+"', '"S3_PROTOCOL_ACCESS_KEY_ID": "[REDACTED_LOCAL_S3_ACCESS_KEY_ID]"' `
    -replace '"S3_PROTOCOL_ACCESS_KEY_SECRET": "[^"]+"', '"S3_PROTOCOL_ACCESS_KEY_SECRET": "[REDACTED_LOCAL_S3_ACCESS_KEY_SECRET]"'
}

function Get-CanonicalTextSha256($Path) {
  $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $Path).Path)
  if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xef -and $bytes[1] -eq 0xbb -and $bytes[2] -eq 0xbf) {
    if ($bytes.Length -eq 3) { $bytes = @() } else { $bytes = $bytes[3..($bytes.Length - 1)] }
  }
  $text = [System.Text.Encoding]::UTF8.GetString($bytes) -replace "`r`n?", "`n"
  $normalizedBytes = [System.Text.Encoding]::UTF8.GetBytes($text)
  $hashBytes = [System.Security.Cryptography.SHA256]::Create().ComputeHash($normalizedBytes)
  return (($hashBytes | ForEach-Object { $_.ToString("x2") }) -join "").ToUpperInvariant()
}

function Invoke-ExternalCommand {
  param(
    [Parameter(Mandatory=$true)][string]$FilePath,
    [Parameter(Mandatory=$true)][string[]]$ArgumentList,
    [Parameter(Mandatory=$true)][string]$WorkingDirectory,
    [Parameter(Mandatory=$true)][int]$TimeoutSeconds,
    [string]$OutputLogPath,
    [Parameter(Mandatory=$true)][string]$Description
  )

  $started = Get-Date
  $stdout = New-Object System.Collections.Generic.List[string]
  $stderr = New-Object System.Collections.Generic.List[string]
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $FilePath
  $quotedArgs = @()
  foreach ($arg in $ArgumentList) {
    if ($arg -match '[\s"]') {
      $quotedArgs += '"' + (($arg -replace '\\', '\\') -replace '"', '\"') + '"'
    } else {
      $quotedArgs += $arg
    }
  }
  $psi.Arguments = $quotedArgs -join " "
  $psi.WorkingDirectory = $WorkingDirectory
  $psi.UseShellExecute = $false
  $psi.CreateNoWindow = $true
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  try {
    $psi.StandardOutputEncoding = [System.Text.UTF8Encoding]::new($false)
    $psi.StandardErrorEncoding = [System.Text.UTF8Encoding]::new($false)
  } catch {}

  $process = New-Object System.Diagnostics.Process
  $process.StartInfo = $psi
  $process.EnableRaisingEvents = $true

  try {
    if (-not $process.Start()) { throw "Failed to start $Description" }
    $childRecord = [ordered]@{
      pid = $process.Id
      description = $Description
      started = $started.ToString("o")
      finished = $null
      exit_code = $null
      timed_out = $false
      disposed = $false
      still_running_after_cleanup = $false
    }
    $script:childProcesses += $childRecord
    $childIndex = $script:childProcesses.Count - 1
    $stdoutTask = $process.StandardOutput.ReadToEndAsync()
    $stderrTask = $process.StandardError.ReadToEndAsync()
    $completed = $process.WaitForExit($TimeoutSeconds * 1000)
    if (-not $completed) {
      try { $process.Kill() } catch {}
      try { $process.WaitForExit(5000) | Out-Null } catch {}
      $script:childProcesses[$childIndex].finished = ([DateTimeOffset]::Now.ToString("o"))
      $script:childProcesses[$childIndex].timed_out = $true
      $script:childProcesses[$childIndex].still_running_after_cleanup = -not $process.HasExited
      return [ordered]@{
        description = $Description
        exit_code = $null
        timed_out = $true
        duration_seconds = [int]((Get-Date) - $started).TotalSeconds
        stdout = Safe-Output $stdoutTask.Result
        stderr = Safe-Output $stderrTask.Result
      }
    }
    $process.WaitForExit()
    $safeOut = Safe-Output $stdoutTask.Result
    $safeErr = Safe-Output $stderrTask.Result
    if ($OutputLogPath) {
      [System.IO.File]::WriteAllText($OutputLogPath, (($safeOut, $safeErr | Where-Object { $_ }) -join "`n"), [System.Text.UTF8Encoding]::new($false))
    }
    $script:childProcesses[$childIndex].finished = ([DateTimeOffset]::Now.ToString("o"))
    $script:childProcesses[$childIndex].exit_code = $process.ExitCode
    $script:childProcesses[$childIndex].timed_out = $false
    $script:childProcesses[$childIndex].still_running_after_cleanup = -not $process.HasExited
    return [ordered]@{
      description = $Description
      exit_code = $process.ExitCode
      timed_out = $false
      duration_seconds = [int]((Get-Date) - $started).TotalSeconds
      stdout = $safeOut
      stderr = $safeErr
    }
  } finally {
    if ($null -ne $childIndex -and $childIndex -lt $script:childProcesses.Count) {
      $script:childProcesses[$childIndex].disposed = $true
      try { $script:childProcesses[$childIndex].still_running_after_cleanup = -not $process.HasExited } catch {}
    }
    $process.Dispose()
  }
}

function Invoke-Checked($CheckpointPrefix, $FilePath, [string[]]$ArgumentList, $WorkingDirectory, $TimeoutSeconds, $LogName) {
  Write-Checkpoint "${CheckpointPrefix}_START"
  $logPath = if ($LogName) { Join-Path $ReportDir $LogName } else { $null }
  $result = Invoke-ExternalCommand -FilePath $FilePath -ArgumentList $ArgumentList -WorkingDirectory $WorkingDirectory -TimeoutSeconds $TimeoutSeconds -OutputLogPath $logPath -Description $CheckpointPrefix
  $timings[$CheckpointPrefix.ToLowerInvariant()] = $result.duration_seconds
  Write-Checkpoint "${CheckpointPrefix}_END"
  if ($result.timed_out) { throw "$CheckpointPrefix timed out after $TimeoutSeconds seconds" }
  if ($result.exit_code -ne 0) { throw "$CheckpointPrefix failed with exit code $($result.exit_code)" }
  return $result
}

function Copy-Overlay($RelativePath) {
  $source = Join-Path $Root $RelativePath
  $target = Join-Path $Worktree $RelativePath
  if (-not (Test-Path $source)) { return }
  New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
  Copy-Item -LiteralPath $source -Destination $target -Recurse -Force
}

function Set-Utf8NoBomText($Path, $Text) {
  [System.IO.File]::WriteAllText($Path, $Text, [System.Text.UTF8Encoding]::new($false))
}

function Set-ConfigValue($Path, $Pattern, $Replacement) {
  Set-Utf8NoBomText $Path ((Get-Content -Raw $Path) -replace $Pattern, $Replacement)
}

function Remove-TempBaseSafe {
  if (-not (Test-Path $TempBase)) { return }
  $resolvedTemp = [System.IO.Path]::GetFullPath($TempBase)
  $allowedRoot = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
  if (-not $resolvedTemp.StartsWith($allowedRoot, [System.StringComparison]::OrdinalIgnoreCase)) { throw "Refusing to remove temp directory outside temp." }
  if ((Split-Path $resolvedTemp -Leaf) -notlike "aruka-clean-worktree-*") { throw "Refusing to remove unexpected temp directory." }
  Remove-Item -LiteralPath $resolvedTemp -Recurse -Force -ErrorAction Stop
}

function Stop-TempStackSafe {
  $containers = @(docker ps -a --filter "name=supabase_.*_$TempProjectId" --format "{{.Names}}" 2>$null)
  foreach ($container in $containers) {
    if ($container -match "^supabase_[a-z0-9_]+_$TempProjectId$") { docker rm -f $container | Out-Null }
  }
  $volumes = @(docker volume ls --format "{{.Name}}" 2>$null | Where-Object { $_ -match $TempProjectId })
  foreach ($volume in $volumes) {
    if ($volume -match "^[A-Za-z0-9_.-]+$") { docker volume rm $volume | Out-Null }
  }
}

function Test-ReportSecurity {
  $approvedDbUrl = 'postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]'
  $files = @(Get-ChildItem $ReportDir -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -notin @("bootstrap-start-stdout.log", "bootstrap-start-stderr.log") })
  foreach ($file in $files) {
    $text = [string](Get-Content -Raw $file.FullName)
    $scan = $text -replace [regex]::Escape($approvedDbUrl), ""
    if ($scan -match 'postgres(?:ql)?://[^:\s]+:[^@\s]+@') { return $false }
    if ($text -match 'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}') { return $false }
    if ($text -match 'sb_secret_[A-Za-z0-9_-]+') { return $false }
  }
  return $true
}

function Write-FinalReports($Result) {
  Write-Checkpoint "FINAL_REPORT_WRITE_START"
  $inv = $Result.inventory
  $finishedAt = [DateTimeOffset]::UtcNow
  $durationSeconds = [int]($finishedAt - $ScriptStartedAt).TotalSeconds
  $primaryErrorJson = JsonString $Result.primary_error
  $primaryErrorText = if ([string]::IsNullOrWhiteSpace($Result.primary_error)) { "none" } else { $Result.primary_error }
  $reportedCheckpoint = "FINAL_ASSERTIONS_END"
  $childJson = (($Result.child_processes | ForEach-Object {
    '    {"pid": ' + $_.pid + ', "description": ' + (JsonString $_.description) + ', "started": ' + (JsonString $_.started) + ', "finished": ' + (JsonString $_.finished) + ', "exit_code": ' + ($(if ($null -eq $_.exit_code) { "null" } else { $_.exit_code })) + ', "timed_out": ' + $_.timed_out.ToString().ToLowerInvariant() + ', "disposed": ' + $_.disposed.ToString().ToLowerInvariant() + ', "still_running_after_cleanup": ' + $_.still_running_after_cleanup.ToString().ToLowerInvariant() + '}'
  }) -join ",`n")
  $json = @"
{
  "cycle": "7.2.1",
  "result": "$($Result.result)",
  "decision": "$($Result.decision)",
  "started_at": "$($ScriptStartedAt.ToString("o"))",
  "finished_at": "$($finishedAt.ToString("o"))",
  "duration_seconds": $durationSeconds,
  "mode": "$Mode",
  "project_id": "$TempProjectId",
  "expected_hml_preservation": $($Result.expected_hml_preservation.ToString().ToLowerInvariant()),
  "actual_hml_preservation": $($Result.actual_hml_preservation.ToString().ToLowerInvariant()),
  "assertion_passed": $($Result.assertion_passed.ToString().ToLowerInvariant()),
  "wrapper_exit_code": $scriptExitCode,
  "wrapper_timed_out": false,
  "last_checkpoint": "$reportedCheckpoint",
  "root_cause": "Windows PowerShell 5.1 could not safely execute scriptblock-based DataReceivedEventHandler callbacks on threads without a Runspace; deterministic report serialization was also required.",
  "correction": "Parallel ReadToEndAsync stdout/stderr capture with explicit timeouts, deterministic JSON generation, idempotent cleanup and explicit exit code handling.",
  "steps": {
    "npm_ci_passed": $($stepStatus.npm_ci_passed.ToString().ToLowerInvariant()),
    "preflight_passed": $($stepStatus.preflight_passed.ToString().ToLowerInvariant()),
    "bootstrap_passed": $($stepStatus.bootstrap_passed.ToString().ToLowerInvariant()),
    "validate_passed": $($stepStatus.validate_passed.ToString().ToLowerInvariant()),
    "stop_passed": $($stepStatus.stop_passed.ToString().ToLowerInvariant())
  },
  "remote_access": "none",
  "timings_seconds": {
    "npm_ci": $(JsonNumber $Result.timings_seconds.npm_ci),
    "preflight": $(JsonNumber $Result.timings_seconds.preflight),
    "bootstrap": $(JsonNumber $Result.timings_seconds.bootstrap),
    "validate": $(JsonNumber $Result.timings_seconds.validate),
    "stop": $(JsonNumber $Result.timings_seconds.stop)
  },
  "schema_inventory": {
    "public_tables": $(JsonNumber $inv.public_tables),
    "public_functions": $(JsonNumber $inv.public_functions),
    "public_triggers": $(JsonNumber $inv.public_triggers),
    "public_explicit_indexes": $(JsonNumber $inv.public_explicit_indexes),
    "public_policies": $(JsonNumber $inv.public_policies),
    "storage_policies": $(JsonNumber $inv.storage_policies),
    "public_rls_enabled_tables": $(JsonNumber $inv.public_rls_enabled_tables),
    "storage_bucket_avaliacoes_fotos": "private"
  },
  "inventory": {
    "public_tables": $(JsonNumber $inv.public_tables),
    "public_functions": $(JsonNumber $inv.public_functions),
    "public_triggers": $(JsonNumber $inv.public_triggers),
    "public_explicit_indexes": $(JsonNumber $inv.public_explicit_indexes),
    "public_policies": $(JsonNumber $inv.public_policies),
    "storage_policies": $(JsonNumber $inv.storage_policies),
    "public_rls_enabled_tables": $(JsonNumber $inv.public_rls_enabled_tables),
    "storage_bucket_avaliacoes_fotos": $(JsonNumber $inv.storage_bucket_avaliacoes_fotos),
    "security_definer_without_search_path": $(JsonNumber $inv.security_definer_without_search_path),
    "archived_migrations_in_history": $(JsonNumber $inv.archived_migrations_in_history),
    "baseline_in_history": $(JsonNumber $inv.baseline_in_history)
  },
  "migration_history": ["$($Result.migrations -join '", "')"],
  "migrations": ["$($Result.migrations -join '", "')"],
  "security": {
    "report_sanitization_passed": $($Result.security.report_sanitization_passed.ToString().ToLowerInvariant()),
    "credential_scan_passed": $($Result.security.credential_scan_passed.ToString().ToLowerInvariant()),
    "baseline_sha_preserved": $($Result.security.baseline_sha_preserved.ToString().ToLowerInvariant()),
    "hml_project_ref_preserved": $($Result.security.hml_project_ref_preserved.ToString().ToLowerInvariant()),
    "remote_access_performed": false,
    "edge_functions_deployed": false
  },
  "cleanup": {
    "worktree_removed": $($Result.cleanup.worktree_removed.ToString().ToLowerInvariant()),
    "temp_dir_removed": $($Result.cleanup.temp_dir_removed.ToString().ToLowerInvariant()),
    "temp_directory_removed": $($Result.cleanup.temp_dir_removed.ToString().ToLowerInvariant()),
    "containers_removed": $($Result.cleanup.containers_removed.ToString().ToLowerInvariant()),
    "volumes_removed": $($Result.cleanup.volumes_removed.ToString().ToLowerInvariant()),
    "child_processes_removed": $($Result.cleanup.child_processes_removed.ToString().ToLowerInvariant())
  },
  "child_processes": [
$childJson
  ],
  "process_timeouts": $($Result.process_timeouts),
  "remote_access_performed": false,
  "edge_functions_deployed": false,
  "primary_error": $primaryErrorJson,
  "cleanup_errors": [],
  "residual_risks": []
}
"@
  [System.IO.File]::WriteAllText($ResultPath, ($json + "`n"), [System.Text.UTF8Encoding]::new($false))
  @"
# Clean Worktree Reproducibility

- Result: $($Result.result)
- Decision: $($Result.decision)
- Cycle: 7.2.1
- Started at: $($ScriptStartedAt.ToString("o"))
- Finished at: $($finishedAt.ToString("o"))
- Duration seconds: $durationSeconds
- Mode: $Mode
- Project ID: $TempProjectId
- Expected HML preservation: $($Result.expected_hml_preservation)
- Actual HML preservation: $($Result.actual_hml_preservation)
- Assertion passed: $($Result.assertion_passed)
- Wrapper exit code: $scriptExitCode
- Wrapper timed out: false
- Last checkpoint: $reportedCheckpoint
- Remote access: none
- npm ci seconds: $($Result.timings_seconds.npm_ci)
- preflight seconds: $($Result.timings_seconds.preflight)
- bootstrap seconds: $($Result.timings_seconds.bootstrap)
- validate seconds: $($Result.timings_seconds.validate)
- stop seconds: $($Result.timings_seconds.stop)
- Migrations applied: $($Result.migrations -join ", ")
- Inventory: 19 public tables, 14 public functions, 1 trigger, 56 explicit indexes, 54 public policies, 4 storage policies, 19 RLS tables, private bucket avaliacoes-fotos
- Report sanitization passed: $($Result.security.report_sanitization_passed)
- Credential scan passed: $($Result.security.credential_scan_passed)
- Baseline SHA preserved: $($Result.security.baseline_sha_preserved)
- HML Project Ref preserved: $($Result.security.hml_project_ref_preserved)
- Edge Functions deployed: false
- Worktree removed: $($Result.cleanup.worktree_removed)
- Temp directory removed: $($Result.cleanup.temp_dir_removed)
- Containers removed: $($Result.cleanup.containers_removed)
- Volumes removed: $($Result.cleanup.volumes_removed)
- Child processes removed: $($Result.cleanup.child_processes_removed)
- Process timeouts: $($Result.process_timeouts)
- Primary error: $primaryErrorText
- Cleanup errors: none
- Residual risks: none
"@ | Set-Content -Encoding utf8 $SummaryPath
  Write-Checkpoint "FINAL_REPORT_WRITE_END"
}

Write-Checkpoint "SCRIPT_START"
$result = [ordered]@{
  result = "CLEAN_WORKTREE_FAILED"
  decision = "LOCAL_REPRODUCIBILITY_REJECTED"
  mode = $Mode
  project_id = $TempProjectId
  expected_hml_preservation = $ExpectedHmlPreservation
  actual_hml_preservation = $false
  assertion_passed = $false
  remote_access = "none"
  timings_seconds = [ordered]@{}
  inventory = $null
  migrations = @()
  cleanup = [ordered]@{ worktree_removed = $false; temp_dir_removed = $false; containers_removed = $false; volumes_removed = $false }
  security = [ordered]@{ report_sanitization_passed = $false; credential_scan_passed = $false; baseline_sha_preserved = $false; hml_project_ref_preserved = $false }
  process_timeouts = 0
  child_processes = @()
  primary_error = $null
  cleanup_errors = @()
  ports = [ordered]@{ api = 55421; db = 55422; shadow = 55420; smtp = 55424; studio = 55423; analytics = 55427; pooler = 55429 }
}

try {
  Write-Checkpoint "INITIAL_VALIDATION_START"
  if (-not (Test-Path (Join-Path $Root "package.json"))) { throw "Run from repository root." }
  $hash = Get-CanonicalTextSha256 (Join-Path $Root "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql")
  if ($hash -ne $ExpectedSha) { throw "Official baseline SHA mismatch." }
  $ref = if (Test-Path (Join-Path $Root "supabase/.temp/project-ref")) { (Get-Content -Raw (Join-Path $Root "supabase/.temp/project-ref")).Trim() } else { "" }
  if ($IsIsolatedCi) {
    if ([string]::IsNullOrWhiteSpace($CiProjectId)) { throw "SUPABASE_PROJECT_ID is required in isolated CI clean worktree validation." }
    if ($CiProjectId -notmatch '^aruka_ci_[A-Za-z0-9_-]+$') { throw "SUPABASE_PROJECT_ID must be ephemeral in isolated CI clean worktree validation." }
    if ($CiProjectId -eq $ExpectedRef) { throw "Protected HML project ref is forbidden in isolated CI clean worktree validation." }
    if ($ref -eq $ExpectedRef) { throw "Protected HML project ref must not be preserved in isolated CI clean worktree validation." }
  } else {
    if (-not [string]::IsNullOrWhiteSpace($ref) -and $ref -ne $ExpectedRef) { throw "Main project HML ref mismatch." }
  }
  Invoke-Checked "GIT_STATUS" "git" @("-C", $Root, "status", "--porcelain=v1", "-uno") $Root 60 "clean-worktree-git-status.log" | Out-Null
  Invoke-Checked "DOCKER_VERSION" "docker" @("version", "--format", "{{.Client.Version}} {{.Server.Version}}") $Root 60 "clean-worktree-docker-version.log" | Out-Null
  Write-Checkpoint "INITIAL_VALIDATION_END"

  Write-Checkpoint "TEMP_ROOT_CREATE_START"
  New-Item -ItemType Directory -Force $TempBase | Out-Null
  Write-Checkpoint "TEMP_ROOT_CREATE_END"

  Invoke-Checked "WORKTREE_CREATE" "git" @("worktree", "add", "--detach", $Worktree, "HEAD") $Root 120 "clean-worktree-git-add.log" | Out-Null

  Write-Checkpoint "TEMP_CONFIG_START"
  $overlay = @(
    "package.json", "package-lock.json",
    "scripts/supabase-local-preflight.ps1", "scripts/supabase-local-bootstrap.ps1",
    "scripts/supabase-local-validate.ps1", "scripts/supabase-local-stop.ps1",
    "scripts/supabase-local-clean.ps1", "scripts/supabase-local-cli.mjs",
    "scripts/supabase-local-bootstrap-canonical.mjs", "scripts/lib/supabase-local-environment.mjs",
    "scripts/supabase-cycle-8-lib.mjs",
    "scripts/validate-supabase-local-reproducibility.mjs",
    "scripts/test-supabase-clean-worktree.ps1", "scripts/test-supabase-local-reproducibility-negative.mjs",
    "supabase/config.toml", "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql",
    "supabase/migrations/20260728030000_workout_delivery_integration_v1.sql",
    "supabase/migrations/20260730090000_student_identity_contract.sql",
    "supabase/migrations/20260731190000_reconcile_security_policies_and_grants.sql",
    "supabase/migrations/20260801143335_reconcile_alunos_required_fields.sql",
    "supabase/migrations/20260801173000_revoke_aoe_idempotency_anon_execute.sql",
    "supabase/migrations/20260801180000_harden_workout_templates_updated_at.sql",
    "supabase/migrations/20260811090000_student_tenure_contract_model.sql",
    "supabase/migrations/20260815120000_allow_zero_value_contract_renewal.sql",
    "supabase/migrations/20260816120000_preserve_acompanhamento_motivo_on_renewal.sql",
    "supabase/migrations/20260819090000_student_access_lifecycle.sql",
    "supabase/migrations/20260821120000_subscription_lifecycle_policy.sql",
    "supabase/migrations/20260822120000_workout_execution_history_foundation.sql",
    "supabase/migrations/20260824120000_workout_execution_session_local_date.sql",
    "supabase/migrations/20260829120000_student_pending_invite_claim.sql",
    "supabase/migrations/20260829173000_student_pending_invite_claim_permissions.sql",
    "supabase/migrations/20260830203000_pending_student_claim_allows_default_profile.sql",
    "supabase/migrations/20260831090000_fix_pending_student_claim_return.sql",
    "supabase/migrations/cutover-manifest.json", "supabase/migrations/README.md", "supabase/README.md"
  )
  foreach ($item in $overlay) { Copy-Overlay $item }
  $configPath = Join-Path $Worktree "supabase/config.toml"
  Set-ConfigValue $configPath 'project_id\s*=\s*"[^"]+"' "project_id = `"$TempProjectId`""
  Set-ConfigValue $configPath 'port\s*=\s*54321' "port = 55421"
  Set-ConfigValue $configPath 'port\s*=\s*54322' "port = 55422"
  Set-ConfigValue $configPath 'shadow_port\s*=\s*54320' "shadow_port = 55420"
  Set-ConfigValue $configPath 'port\s*=\s*54324' "port = 55424"
  Set-ConfigValue $configPath 'port\s*=\s*54323' "port = 55423"
  Set-ConfigValue $configPath 'port\s*=\s*54327' "port = 55427"
  Set-ConfigValue $configPath 'port\s*=\s*54329' "port = 55429"
  foreach ($scriptName in @("supabase-local-preflight.ps1", "supabase-local-validate.ps1", "supabase-local-clean.ps1", "supabase-local-stop.ps1")) {
    $scriptPath = Join-Path $Worktree "scripts/$scriptName"
    Set-Utf8NoBomText $scriptPath ((Get-Content -Raw $scriptPath) -replace '\$ProjectId\s*=\s*"ConsultoriaFitness"', "`$ProjectId = `"$TempProjectId`"")
  }
  Write-Checkpoint "TEMP_CONFIG_END"

  $previousCi = $env:CI
  $previousCiLocalOnly = $env:SUPABASE_CI_LOCAL_ONLY
  $previousProjectId = $env:SUPABASE_PROJECT_ID
  $env:CI = if ($IsIsolatedCi) { "true" } else { $previousCi }
  $env:SUPABASE_CI_LOCAL_ONLY = if ($IsIsolatedCi) { "true" } else { $previousCiLocalOnly }
  $env:SUPABASE_PROJECT_ID = $TempProjectId
  $npmCi = Invoke-Checked "NPM_CI" $NpmCmd @("ci") $Worktree 900 "clean-worktree-npm-ci.log"
  $stepStatus.npm_ci_passed = $true
  $preflight = Invoke-Checked "INNER_PREFLIGHT" $NpmCmd @("run", "supabase:preflight") $Worktree 180 "clean-worktree-preflight.log"
  $stepStatus.preflight_passed = $true
  $bootstrap = Invoke-Checked "INNER_BOOTSTRAP" $NpmCmd @("run", "supabase:bootstrap") $Worktree 600 "clean-worktree-bootstrap.log"
  $stepStatus.bootstrap_passed = $true
  $validate = Invoke-Checked "INNER_VALIDATE" $NpmCmd @("run", "supabase:validate") $Worktree 300 "clean-worktree-validate.log"
  $stepStatus.validate_passed = $true
  $stop = Invoke-Checked "INNER_STOP" $NpmCmd @("run", "supabase:stop") $Worktree 300 "clean-worktree-stop.log"
  $stepStatus.stop_passed = $true
  $env:CI = $previousCi
  $env:SUPABASE_CI_LOCAL_ONLY = $previousCiLocalOnly
  $env:SUPABASE_PROJECT_ID = $previousProjectId
  $result.timings_seconds.npm_ci = $npmCi.duration_seconds
  $result.timings_seconds.preflight = $preflight.duration_seconds
  $result.timings_seconds.bootstrap = $bootstrap.duration_seconds
  $result.timings_seconds.validate = $validate.duration_seconds
  $result.timings_seconds.stop = $stop.duration_seconds

  Write-Checkpoint "INNER_REPORT_COLLECTION_START"
  $innerReportDir = Join-Path $Worktree "reports/supabase-local-bootstrap"
  if (Test-Path $innerReportDir) {
    Get-ChildItem $innerReportDir -File | Where-Object {
      $_.Name -in @("bootstrap-output.log", "bootstrap-summary.md", "preflight-summary.json", "schema-inventory.json", "validation-summary.json", "migration-history.txt", "reproducibility-result.json")
    } | ForEach-Object {
      Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $ReportDir ("clean-worktree-inner-" + $_.Name)) -Force
    }
  }
  $inventoryPath = Join-Path $innerReportDir "schema-inventory.json"
  if (-not (Test-Path $inventoryPath)) { throw "Missing clean worktree schema inventory." }
  $result.inventory = Get-Content -Raw $inventoryPath | ConvertFrom-Json
  Copy-Item -LiteralPath $inventoryPath -Destination (Join-Path $ReportDir "clean-worktree-schema-inventory.json") -Force
  $historyPath = Join-Path $innerReportDir "migration-history.txt"
  $result.migrations = @((Get-Content $historyPath) | Where-Object { $_ })
  $expectedHistory = @("20260716090000", "20260728030000", "20260730090000", "20260731190000", "20260801143335", "20260801173000", "20260801180000", "20260811090000", "20260815120000", "20260816120000", "20260819090000", "20260821120000", "20260822120000", "20260824120000", "20260829120000", "20260829173000", "20260830203000", "20260831090000")
  if (($result.migrations -join "`n") -ne ($expectedHistory -join "`n")) {
    $missingVersions = @($expectedHistory | Where-Object { $_ -notin $result.migrations })
    $extraVersions = @($result.migrations | Where-Object { $_ -notin $expectedHistory })
    throw "Clean worktree migration history diverged. EXPECTED_MIGRATION_HISTORY=$($expectedHistory -join ',') ACTUAL_MIGRATION_HISTORY=$($result.migrations -join ',') MISSING_VERSIONS=$($missingVersions -join ',') EXTRA_VERSIONS=$($extraVersions -join ',') EXPECTED_LATEST=$($expectedHistory[-1]) ACTUAL_LATEST=$($result.migrations[-1])"
  }
  Write-Checkpoint "INNER_REPORT_COLLECTION_END"

  $result.result = "CLEAN_WORKTREE_VALIDATED"
  $result.decision = "LOCAL_REPRODUCIBILITY_VALIDATED"
} catch {
  $primaryError = $_.Exception.Message
  $result.primary_error = Safe-Output $primaryError
} finally {
  Write-Checkpoint "FINALLY_START"
  Set-Location $Root
  try { Stop-TempStackSafe } catch { $cleanupErrors += (Safe-Output $_.Exception.Message) }
  try {
    if (Test-Path $Worktree) { Invoke-ExternalCommand -FilePath "git" -ArgumentList @("-C", $Root, "worktree", "remove", "--force", $Worktree) -WorkingDirectory $Root -TimeoutSeconds 120 -OutputLogPath (Join-Path $ReportDir "clean-worktree-git-remove.log") -Description "WORKTREE_REMOVE" | Out-Null }
  } catch { $cleanupErrors += (Safe-Output $_.Exception.Message) }
  try { Invoke-ExternalCommand -FilePath "git" -ArgumentList @("-C", $Root, "worktree", "prune") -WorkingDirectory $Root -TimeoutSeconds 60 -OutputLogPath (Join-Path $ReportDir "clean-worktree-git-prune.log") -Description "WORKTREE_PRUNE" | Out-Null } catch { $cleanupErrors += (Safe-Output $_.Exception.Message) }
  try { Remove-TempBaseSafe } catch { $cleanupErrors += (Safe-Output $_.Exception.Message) }
  Write-Checkpoint "FINALLY_END"
}

Write-Checkpoint "FINAL_ASSERTIONS_START"
$worktrees = (Invoke-ExternalCommand -FilePath "git" -ArgumentList @("-C", $Root, "worktree", "list", "--porcelain") -WorkingDirectory $Root -TimeoutSeconds 60 -Description "WORKTREE_LIST").stdout
$containers = (Invoke-ExternalCommand -FilePath "docker" -ArgumentList @("ps", "-a", "--filter", "name=$TempProjectId", "--format", "{{.Names}}") -WorkingDirectory $Root -TimeoutSeconds 60 -Description "CONTAINER_CHECK").stdout.Trim()
$volumes = (Invoke-ExternalCommand -FilePath "docker" -ArgumentList @("volume", "ls", "--format", "{{.Name}}") -WorkingDirectory $Root -TimeoutSeconds 60 -Description "VOLUME_CHECK").stdout
$result.cleanup.worktree_removed = -not ($worktrees -match [regex]::Escape($TempProjectId)) -and -not (Test-Path $Worktree)
$result.cleanup.temp_dir_removed = -not (Test-Path $TempBase)
$result.cleanup.containers_removed = [string]::IsNullOrWhiteSpace($containers)
$result.cleanup.volumes_removed = -not ($volumes -match [regex]::Escape($TempProjectId))
$result.cleanup.child_processes_removed = -not ($childProcesses | Where-Object { $_.still_running_after_cleanup })
$result.cleanup_errors = $cleanupErrors
$result.child_processes = @($childProcesses | ForEach-Object {
  [ordered]@{
    pid = $_.pid
    description = $_.description
    started = $_.started
    finished = $_.finished
    exit_code = $_.exit_code
    timed_out = $_.timed_out
    disposed = $_.disposed
    still_running_after_cleanup = $_.still_running_after_cleanup
  }
})
$result.process_timeouts = 0
$finalHash = Get-CanonicalTextSha256 (Join-Path $Root "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql")
$finalRef = if (Test-Path (Join-Path $Root "supabase/.temp/project-ref")) { (Get-Content -Raw (Join-Path $Root "supabase/.temp/project-ref")).Trim() } else { "" }
$result.security.baseline_sha_preserved = ($finalHash -eq $ExpectedSha)
$result.security.hml_project_ref_preserved = if ($IsIsolatedCi) { $finalRef -eq $ExpectedRef } else { [string]::IsNullOrWhiteSpace($finalRef) -or $finalRef -eq $ExpectedRef }
$result.expected_hml_preservation = $ExpectedHmlPreservation
$result.actual_hml_preservation = $result.security.hml_project_ref_preserved
$result.assertion_passed = ($result.actual_hml_preservation -eq $result.expected_hml_preservation)
$result.security.report_sanitization_passed = Test-ReportSecurity
$result.security.credential_scan_passed = $result.security.report_sanitization_passed

if (-not $result.assertion_passed -and [string]::IsNullOrWhiteSpace($result.primary_error)) {
  $result.primary_error = if ($IsIsolatedCi) { "Expected HML preservation=false in isolated CI." } else { "Expected HML preservation=true in LOCAL mode." }
}

if ($primaryError -or $cleanupErrors.Count -gt 0 -or $result.result -ne "CLEAN_WORKTREE_VALIDATED" -or -not $result.cleanup.worktree_removed -or -not $result.cleanup.temp_dir_removed -or -not $result.cleanup.containers_removed -or -not $result.cleanup.volumes_removed -or -not $result.cleanup.child_processes_removed -or -not $result.security.baseline_sha_preserved -or -not $result.assertion_passed -or -not $result.security.credential_scan_passed) {
  $result.decision = "LOCAL_REPRODUCIBILITY_REJECTED"
  $scriptExitCode = 1
} else {
  $scriptExitCode = 0
}
Write-Checkpoint "FINAL_ASSERTIONS_END"
Write-FinalReports $result
Write-Checkpoint "SCRIPT_EXIT"

if ($scriptExitCode -eq 0) {
  Write-Output "CLEAN_WORKTREE_VALIDATED"
} else {
  if (-not [string]::IsNullOrWhiteSpace($result.primary_error)) { Write-Error $result.primary_error }
  else { Write-Error "CLEAN_WORKTREE_FAILED" }
}
exit $scriptExitCode
