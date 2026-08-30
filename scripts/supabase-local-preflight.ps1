param()

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path ".").Path
$ReportDir = Join-Path $Root "reports/supabase-local-bootstrap"
$LogPath = Join-Path $ReportDir "preflight-summary.json"
$ConfigText = Get-Content -Raw "supabase/config.toml"
$ProjectId = ([regex]::Match($ConfigText, '(?m)^project_id\s*=\s*"([^"]+)"')).Groups[1].Value
if ([string]::IsNullOrWhiteSpace($ProjectId)) { $ProjectId = "ConsultoriaFitness" }
$ExpectedRef = ("xrmqdkpx" + "nfvusmenadnf")
$ExpectedSha = "67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B"
$ReferenceBaselinePath = "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql"
$ExecutableBaselinePath = "supabase/migrations/20260716090000_baseline_aruka_v1.sql"
$ExpectedActiveMigrations = @(
  "20260728030000_workout_delivery_integration_v1.sql",
  "20260730090000_student_identity_contract.sql",
  "20260731190000_reconcile_security_policies_and_grants.sql",
  "20260801143335_reconcile_alunos_required_fields.sql",
  "20260801173000_revoke_aoe_idempotency_anon_execute.sql",
  "20260801180000_harden_workout_templates_updated_at.sql",
  "20260811090000_student_tenure_contract_model.sql",
  "20260815120000_allow_zero_value_contract_renewal.sql",
  "20260816120000_preserve_acompanhamento_motivo_on_renewal.sql",
  "20260819090000_student_access_lifecycle.sql",
  "20260821120000_subscription_lifecycle_policy.sql",
  "20260822120000_workout_execution_history_foundation.sql",
  "20260824120000_workout_execution_session_local_date.sql",
  "20260829120000_student_pending_invite_claim.sql",
  "20260829173000_student_pending_invite_claim_permissions.sql"
)
$IsCi = $env:CI -eq "true"
$IsCiLocalOnly = $env:SUPABASE_CI_LOCAL_ONLY -eq "true"
$IsIsolatedCi = $IsCi -and $IsCiLocalOnly
$Mode = if ($IsIsolatedCi) { "isolated_ci" } else { "local" }
$ExpectedCiProjectId = if ($null -eq $env:SUPABASE_PROJECT_ID) { "" } else { $env:SUPABASE_PROJECT_ID.Trim() }
$AllowedDockerContexts = if ($IsIsolatedCi) { @("default") } else { @("desktop-linux") }

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

function Fail($Message) {
  $script:Errors += $Message
}

function Run($Exe, [string[]]$CommandArgs) {
  $previous = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  $output = & $Exe @CommandArgs 2>&1
  $ErrorActionPreference = $previous
  return @{ code = $LASTEXITCODE; output = (($output | ForEach-Object { [string]$_ }) -join "`n") }
}

New-Item -ItemType Directory -Force $ReportDir | Out-Null
$script:Errors = @()

if (-not (Test-Path (Join-Path $Root "package.json"))) { Fail "Run from repository root." }
if (-not (Test-Path "supabase/config.toml")) { Fail "Missing supabase/config.toml." }
if (Test-Path $ExecutableBaselinePath) { Fail "Reference-only baseline must not be present in executable migrations." }
if (-not (Test-Path $ReferenceBaselinePath)) { Fail "Missing official reference baseline." }
if (-not (Test-Path "supabase/migrations/cutover-manifest.json")) { Fail "Missing cutover manifest." }
if ($IsCi -and -not $IsCiLocalOnly) { Fail "CI preflight requires SUPABASE_CI_LOCAL_ONLY=true." }

$refPath = "supabase/.temp/project-ref"
$tempProjectRefPresent = Test-Path $refPath
$ref = if ($tempProjectRefPresent) { (Get-Content -Raw $refPath).Trim() } else { "" }
$protectedProjectRefDetected = $false
foreach ($value in @($ExpectedCiProjectId, $ProjectId, $ref)) {
  if (-not [string]::IsNullOrWhiteSpace($value) -and $value -match [regex]::Escape($ExpectedRef)) {
    $protectedProjectRefDetected = $true
  }
}

if ($IsIsolatedCi) {
  if ([string]::IsNullOrWhiteSpace($ExpectedCiProjectId)) { Fail "CI SUPABASE_PROJECT_ID is missing." }
  if (-not [string]::IsNullOrWhiteSpace($ExpectedCiProjectId) -and $ExpectedCiProjectId -notmatch '^aruka_ci_[A-Za-z0-9_-]+$') {
    Fail "CI SUPABASE_PROJECT_ID must match ^aruka_ci_[A-Za-z0-9_-]+$."
  }
  if ($ExpectedCiProjectId -eq $ExpectedRef) { Fail "Protected HML project ref is forbidden in isolated CI." }
  if ($ProjectId -ne $ExpectedCiProjectId) { Fail "Config project_id does not match SUPABASE_PROJECT_ID." }
  if ($protectedProjectRefDetected) { Fail "Protected HML project ref is forbidden in isolated CI." }
  if ($tempProjectRefPresent -and -not [string]::IsNullOrWhiteSpace($ref) -and $ref -ne $ExpectedCiProjectId -and $ref -notmatch '^aruka_ci_[A-Za-z0-9_-]+$') {
    Fail "CI temp project-ref is not compatible with the ephemeral project ID."
  }
} else {
  if ($tempProjectRefPresent -and $ref -ne $ExpectedRef) { Fail "Linked project-ref is not the expected HML ref." }
}

$hash = if (Test-Path $ReferenceBaselinePath) { Get-CanonicalTextSha256 $ReferenceBaselinePath } else { "" }
if ($hash -ne $ExpectedSha) { Fail "Official reference baseline SHA mismatch." }

$dockerVersion = Run "docker" @("--version")
if ($dockerVersion.code -ne 0) { Fail "Docker CLI unavailable." }
$dockerServer = Run "docker" @("version", "--format", "{{.Client.Version}} {{.Server.Version}}")
if ($dockerServer.code -ne 0) { Fail "Docker Server unavailable." }
$dockerContext = Run "docker" @("context", "show")
$dockerContextValue = $dockerContext.output.Trim()
$dockerContextValid = $dockerContext.code -eq 0 -and ($AllowedDockerContexts -contains $dockerContextValue)
if (-not $dockerContextValid) {
  if ($IsIsolatedCi) { Fail "Docker context is not allowed for isolated CI." }
  else { Fail "Docker context must be desktop-linux." }
}
$NpxCmd = (Get-Command npx.cmd -ErrorAction SilentlyContinue)
if (-not $NpxCmd) { $NpxCmd = Get-Command npx -ErrorAction Stop }
$supabaseVersion = Run $NpxCmd.Source @("-y", "supabase@2.109.1", "--version")
if ($supabaseVersion.code -ne 0) { Fail "Supabase CLI unavailable through npx." }

$activeSql = @(Get-ChildItem "supabase/migrations" -Filter "*.sql" | Select-Object -ExpandProperty Name | Sort-Object)
$activeMigrationUnexpected = @($activeSql | Where-Object { $ExpectedActiveMigrations -notcontains $_ })
$activeMigrationMissing = @($ExpectedActiveMigrations | Where-Object { $activeSql -notcontains $_ })
$activeMigrationInvalidTimestamp = @($activeSql | Where-Object { $_ -notmatch '^\d{14}_[a-z0-9_]+\.sql$' })
$expectedActiveMigrationOrder = $ExpectedActiveMigrations -join "`n"
$actualActiveMigrationOrder = $activeSql -join "`n"
if ($activeMigrationInvalidTimestamp.Count -gt 0) { Fail "Active migration timestamp or name is invalid." }
if ($activeMigrationMissing.Count -gt 0) { Fail "Expected active migration missing." }
if ($activeMigrationUnexpected.Count -gt 0) { Fail "Unexpected active migration found." }
if ($activeSql.Count -ne $ExpectedActiveMigrations.Count -or $actualActiveMigrationOrder -ne $expectedActiveMigrationOrder) {
  Fail "Active migrations folder does not match the expected ordered migration chain."
}

$summary = [ordered]@{
  result = if ($script:Errors.Count -eq 0) { "PREFLIGHT_OK" } else { "PREFLIGHT_FAILED" }
  mode = $Mode
  ci = $IsCi
  ci_local_only = $IsCiLocalOnly
  project_id = $ProjectId
  expected_ci_project_id = if ($IsIsolatedCi) { $ExpectedCiProjectId } else { $null }
  project_id_matches_environment = if ($IsIsolatedCi) { $ProjectId -eq $ExpectedCiProjectId } else { $null }
  protected_project_ref_detected = $protectedProjectRefDetected
  temp_project_ref_present = $tempProjectRefPresent
  temp_project_ref_sanitized = if ([string]::IsNullOrWhiteSpace($ref)) { "" } elseif ($ref -eq $ExpectedRef) { "[PROTECTED_HML_PROJECT_REF]" } else { $ref }
  docker = $dockerVersion.output.Trim()
  docker_server = $dockerServer.output.Trim()
  docker_context = $dockerContextValue
  allowed_docker_contexts = @($AllowedDockerContexts)
  docker_context_valid = $dockerContextValid
  supabase_cli = $supabaseVersion.output.Trim()
  baseline_sha256 = $hash
  expected_baseline_sha256 = $ExpectedSha
  baseline_sha_preserved = $hash -eq $ExpectedSha
  reference_baseline = $ReferenceBaselinePath
  executable_baseline_present = Test-Path $ExecutableBaselinePath
  active_migrations = $activeSql
  expected_active_migrations = $ExpectedActiveMigrations
  executable_migration_count = $activeSql.Count
  reference_only_baseline_count = if (Test-Path $ReferenceBaselinePath) { 1 } else { 0 }
  total_database_change_artifact_count = $activeSql.Count + $(if (Test-Path $ReferenceBaselinePath) { 1 } else { 0 })
  active_migrations_unexpected = $activeMigrationUnexpected
  active_migrations_missing = $activeMigrationMissing
  active_migrations_invalid_timestamp = $activeMigrationInvalidTimestamp
  remote_access_performed = $false
  edge_functions_deployed = $false
  errors = $script:Errors
  primary_error = if ($script:Errors.Count -gt 0) { $script:Errors[0] } else { $null }
}
$summary | ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 $LogPath

if ($script:Errors.Count -gt 0) {
  foreach ($message in $script:Errors) {
    Write-Host "::error::$message"
  }
  Write-Host "PREFLIGHT_FAILED"
  exit 1
}

Write-Output "PREFLIGHT_OK"
exit 0
