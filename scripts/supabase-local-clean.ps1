param([switch]$Force, [switch]$CI)

$ErrorActionPreference = "Stop"
$ConfigText = Get-Content -Raw "supabase/config.toml"
$ProjectId = ([regex]::Match($ConfigText, '(?m)^project_id\s*=\s*"([^"]+)"')).Groups[1].Value
if ([string]::IsNullOrWhiteSpace($ProjectId)) { $ProjectId = "ConsultoriaFitness" }
if (-not $Force -and -not $CI) {
  $answer = Read-Host "Remove only local Supabase containers/volumes for $ProjectId? Type CLEAN"
  if ($answer -ne "CLEAN") { throw "Clean cancelled." }
}

$containers = @(docker ps -a --filter "name=supabase_.*_$ProjectId" --format "{{.Names}}")
foreach ($container in $containers) {
  if ($container -match "^supabase_[a-z0-9_]+_$ProjectId$") {
    docker rm -f $container | Out-Null
  } else {
    throw "Refusing to remove unexpected container: $container"
  }
}

$volumes = @(docker volume ls --format "{{.Name}}" | Where-Object { $_ -match "supabase.*$ProjectId|${ProjectId}.*supabase" })
foreach ($volume in $volumes) {
  if ($volume -match "^[A-Za-z0-9_.-]+$") {
    docker volume rm $volume | Out-Null
  }
}

Get-ChildItem reports/supabase-local-bootstrap -Directory -Filter "tmp*" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force
Write-Output "LOCAL_SUPABASE_CLEANED"
