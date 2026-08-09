param()

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path ".").Path
$ReportDir = Join-Path $Root "reports/supabase-local-bootstrap"
New-Item -ItemType Directory -Force $ReportDir | Out-Null

$PowerShellCmd = (Get-Command powershell.exe -ErrorAction SilentlyContinue)
if (-not $PowerShellCmd) { $PowerShellCmd = Get-Command pwsh -ErrorAction Stop }
$NpxCmd = (Get-Command npx.cmd -ErrorAction SilentlyContinue)
if (-not $NpxCmd) { $NpxCmd = Get-Command npx -ErrorAction Stop }
& $PowerShellCmd.Source -NoProfile -ExecutionPolicy Bypass -File (Join-Path $Root "scripts/supabase-local-preflight.ps1")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$ExpectedSha = "67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B"
$ReferenceBaselinePath = Join-Path $Root "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql"
$EphemeralBaselinePath = Join-Path $Root "supabase/migrations/20260716090000_baseline_aruka_v1.sql"
$ExpectedIncrementalMigrations = @(
  "20260728030000_workout_delivery_integration_v1.sql",
  "20260730090000_student_identity_contract.sql",
  "20260731190000_reconcile_security_policies_and_grants.sql",
  "20260801143335_reconcile_alunos_required_fields.sql",
  "20260801173000_revoke_aoe_idempotency_anon_execute.sql",
  "20260801180000_harden_workout_templates_updated_at.sql"
)

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

function Assert-EphemeralBootstrapInputs {
  if (-not (Test-Path $ReferenceBaselinePath)) { throw "BLOCKED_REFERENCE_BASELINE_INTEGRITY: missing reference baseline" }
  if (Test-Path $EphemeralBaselinePath) { throw "BLOCKED_REFERENCE_BASELINE_INTEGRITY: executable baseline already present" }
  $hash = Get-CanonicalTextSha256 $ReferenceBaselinePath
  if ($hash -ne $ExpectedSha) { throw "BLOCKED_REFERENCE_BASELINE_INTEGRITY: reference baseline SHA mismatch" }
  $activeSql = @(Get-ChildItem (Join-Path $Root "supabase/migrations") -Filter "*.sql" | Select-Object -ExpandProperty Name | Sort-Object)
  $missing = @($ExpectedIncrementalMigrations | Where-Object { $activeSql -notcontains $_ })
  $unexpected = @($activeSql | Where-Object { $ExpectedIncrementalMigrations -notcontains $_ })
  if ($missing.Count -gt 0) { throw "BLOCKED_EPHEMERAL_BOOTSTRAP_ORDER: missing incremental migration $($missing -join ', ')" }
  if ($unexpected.Count -gt 0) { throw "BLOCKED_EPHEMERAL_BOOTSTRAP_ORDER: unexpected executable migration $($unexpected -join ', ')" }
  if (($activeSql -join "`n") -ne ($ExpectedIncrementalMigrations -join "`n")) { throw "BLOCKED_EPHEMERAL_BOOTSTRAP_ORDER: incremental migration order mismatch" }
  return $hash
}

function Sanitize-SupabaseOutput([string]$Text) {
  return $Text `
    -replace 'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}', '[REDACTED_LOCAL_JWT]' `
    -replace 'postgres(?:ql)?://[^"\r\n\s]+', 'postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]' `
    -replace 'sb_secret_[A-Za-z0-9_-]+', '[REDACTED_LOCAL_SECRET_KEY]' `
    -replace '(?i)(password\s*[:=]\s*)[^\s,;"]+', '$1[REDACTED_PASSWORD]' `
    -replace '(?i)(token\s*[:=]\s*)[^\s,;"]+', '$1[REDACTED_TOKEN]' `
    -replace '"JWT_SECRET": "[^"]+"', '"JWT_SECRET": "[REDACTED_LOCAL_JWT_SECRET]"' `
    -replace '"ANON_KEY": "[^"]+"', '"ANON_KEY": "[REDACTED_LOCAL_ANON_KEY]"' `
    -replace '"SERVICE_ROLE_KEY": "[^"]+"', '"SERVICE_ROLE_KEY": "[REDACTED_LOCAL_SERVICE_ROLE_KEY]"' `
    -replace '"PUBLISHABLE_KEY": "[^"]+"', '"PUBLISHABLE_KEY": "[REDACTED_LOCAL_PUBLISHABLE_KEY]"' `
    -replace '"S3_PROTOCOL_ACCESS_KEY_ID": "[^"]+"', '"S3_PROTOCOL_ACCESS_KEY_ID": "[REDACTED_LOCAL_S3_ACCESS_KEY_ID]"' `
    -replace '"S3_PROTOCOL_ACCESS_KEY_SECRET": "[^"]+"', '"S3_PROTOCOL_ACCESS_KEY_SECRET": "[REDACTED_LOCAL_S3_ACCESS_KEY_SECRET]"'
}

function Write-StartDiagnostic([int]$Code, [string]$Stdout, [string]$Stderr) {
  Write-Host "SUPABASE_START_COMMAND=npx -y supabase@2.109.1 start"
  Write-Host "SUPABASE_START_EXIT_CODE=$Code"
  Write-Host "SUPABASE_START_STDOUT_BEGIN"
  if (-not [string]::IsNullOrWhiteSpace($Stdout)) { Write-Host $Stdout }
  Write-Host "SUPABASE_START_STDOUT_END"
  Write-Host "SUPABASE_START_STDERR_BEGIN"
  if (-not [string]::IsNullOrWhiteSpace($Stderr)) { Write-Host $Stderr }
  Write-Host "SUPABASE_START_STDERR_END"
}

$startedAt = Get-Date
$baselineHash = Assert-EphemeralBootstrapInputs
$stdoutPath = Join-Path $ReportDir "bootstrap-start-stdout.log"
$stderrPath = Join-Path $ReportDir "bootstrap-start-stderr.log"
Copy-Item -LiteralPath $ReferenceBaselinePath -Destination $EphemeralBaselinePath
$ephemeralBaselineCreated = $true
try {
  Write-Host "EPHEMERAL_BOOTSTRAP_MIGRATION_COUNT=7"
  Write-Host "EPHEMERAL_BOOTSTRAP_FIRST_VERSION=20260716090000"
  Write-Host "EPHEMERAL_BOOTSTRAP_INCREMENTAL_COUNT=6"
  Write-Host "EPHEMERAL_BOOTSTRAP_ORDER=PASS"
  Write-Host "REFERENCE_BASELINE_HASH_PRESERVED=YES"

  $previous = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  & $NpxCmd.Source -y supabase@2.109.1 start 1> $stdoutPath 2> $stderrPath
  $code = $LASTEXITCODE
  $ErrorActionPreference = $previous
  $stdoutText = ""
  $stderrText = ""
  if (Test-Path $stdoutPath) { $stdoutText = Get-Content -Raw $stdoutPath }
  if (Test-Path $stderrPath) { $stderrText = Get-Content -Raw $stderrPath }
  $safeStdout = Sanitize-SupabaseOutput $stdoutText
  $safeStderr = Sanitize-SupabaseOutput $stderrText
  $safeStdout | Set-Content -Encoding utf8 $stdoutPath
  $safeStderr | Set-Content -Encoding utf8 $stderrPath
  @(
    "SUPABASE_START_COMMAND=npx -y supabase@2.109.1 start",
    "SUPABASE_START_EXIT_CODE=$code",
    "EPHEMERAL_BOOTSTRAP_MIGRATION_COUNT=7",
    "EPHEMERAL_BOOTSTRAP_FIRST_VERSION=20260716090000",
    "EPHEMERAL_BOOTSTRAP_INCREMENTAL_COUNT=6",
    "EPHEMERAL_BOOTSTRAP_ORDER=PASS",
    "REFERENCE_BASELINE_SHA256=$baselineHash",
    "SUPABASE_START_STDOUT_BEGIN",
    $safeStdout,
    "SUPABASE_START_STDOUT_END",
    "SUPABASE_START_STDERR_BEGIN",
    $safeStderr,
    "SUPABASE_START_STDERR_END"
  ) | Set-Content -Encoding utf8 (Join-Path $ReportDir "bootstrap-output.log")
  if ($code -ne 0) {
    Write-StartDiagnostic $code $safeStdout $safeStderr
    throw "SUPABASE_START_FAILED"
  }

  & $PowerShellCmd.Source -NoProfile -ExecutionPolicy Bypass -File (Join-Path $Root "scripts/supabase-local-validate.ps1")
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  $elapsed = [int]((Get-Date) - $startedAt).TotalSeconds
@"
# Supabase Local Bootstrap

- Result: LOCAL_BOOTSTRAP_OK
- Active migrations source: supabase/migrations with temporary reference baseline
- Ephemeral bootstrap migration count: 7
- Ephemeral bootstrap first version: 20260716090000
- Ephemeral bootstrap incremental count: 6
- Archived migrations applied: no
- Operations applied automatically: no
- Duration seconds: $elapsed
"@ | Set-Content -Encoding utf8 (Join-Path $ReportDir "bootstrap-summary.md")
  Write-Output "LOCAL_BOOTSTRAP_OK"
} finally {
  if ($ephemeralBaselineCreated -and (Test-Path $EphemeralBaselinePath)) {
    Remove-Item -LiteralPath $EphemeralBaselinePath -Force
  }
  $tempBaselinePresentAfterRun = if (Test-Path $EphemeralBaselinePath) { "YES" } else { "NO" }
  Write-Host "BOOTSTRAP_TEMP_BASELINE_PRESENT_AFTER_RUN=$tempBaselinePresentAfterRun"
}
