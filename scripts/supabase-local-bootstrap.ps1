param()

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path ".").Path
$ReportDir = Join-Path $Root "reports/supabase-local-bootstrap"
New-Item -ItemType Directory -Force $ReportDir | Out-Null

& powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $Root "scripts/supabase-local-preflight.ps1")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$startedAt = Get-Date
$previous = $ErrorActionPreference
$ErrorActionPreference = "Continue"
$out = & npx.cmd supabase start 2>&1
$code = $LASTEXITCODE
$ErrorActionPreference = $previous
$safe = $out | ForEach-Object {
  ([string]$_) -replace 'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}', '[REDACTED_LOCAL_JWT]' -replace 'postgres(?:ql)?://[^"\r\n\s]+', 'postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]' -replace 'sb_secret_[A-Za-z0-9_-]+', '[REDACTED_LOCAL_SECRET_KEY]' -replace '"JWT_SECRET": "[^"]+"', '"JWT_SECRET": "[REDACTED_LOCAL_JWT_SECRET]"' -replace '"PUBLISHABLE_KEY": "[^"]+"', '"PUBLISHABLE_KEY": "[REDACTED_LOCAL_PUBLISHABLE_KEY]"' -replace '"S3_PROTOCOL_ACCESS_KEY_ID": "[^"]+"', '"S3_PROTOCOL_ACCESS_KEY_ID": "[REDACTED_LOCAL_S3_ACCESS_KEY_ID]"' -replace '"S3_PROTOCOL_ACCESS_KEY_SECRET": "[^"]+"', '"S3_PROTOCOL_ACCESS_KEY_SECRET": "[REDACTED_LOCAL_S3_ACCESS_KEY_SECRET]"'
}
$safe | Set-Content -Encoding utf8 (Join-Path $ReportDir "bootstrap-output.log")
if ($code -ne 0) { throw "supabase start failed with exit code $code" }

& powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $Root "scripts/supabase-local-validate.ps1")
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
