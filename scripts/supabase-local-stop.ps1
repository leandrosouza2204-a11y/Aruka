param([switch]$NoBackup)

$ErrorActionPreference = "Stop"
$NpxCmd = (Get-Command npx.cmd -ErrorAction SilentlyContinue)
if (-not $NpxCmd) { $NpxCmd = Get-Command npx -ErrorAction Stop }
$args = @("-y", "supabase@2.109.1", "stop")
if ($NoBackup) { $args += "--no-backup" }
& $NpxCmd.Source @args
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Output "LOCAL_SUPABASE_STOPPED"
