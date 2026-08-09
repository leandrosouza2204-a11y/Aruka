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
$stdoutPath = Join-Path $ReportDir "bootstrap-start-stdout.log"
$stderrPath = Join-Path $ReportDir "bootstrap-start-stderr.log"
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
@(
  "SUPABASE_START_COMMAND=npx -y supabase@2.109.1 start",
  "SUPABASE_START_EXIT_CODE=$code",
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
- Active migrations source: supabase/migrations
- Archived migrations applied: no
- Operations applied automatically: no
- Duration seconds: $elapsed
"@ | Set-Content -Encoding utf8 (Join-Path $ReportDir "bootstrap-summary.md")
Write-Output "LOCAL_BOOTSTRAP_OK"
