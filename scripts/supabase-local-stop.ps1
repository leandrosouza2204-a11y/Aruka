param([switch]$NoBackup)

$ErrorActionPreference = "Stop"
$args = @("supabase", "stop")
if ($NoBackup) { $args += "--no-backup" }
& npx.cmd @args
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Output "LOCAL_SUPABASE_STOPPED"
