param()

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path ".").Path
$ReportDir = Join-Path $Root "reports/supabase-local-bootstrap"
$LogPath = Join-Path $ReportDir "preflight-summary.json"
$ProjectId = "ConsultoriaFitness"
$ExpectedRef = ("xrmqdkpx" + "nfvusmenadnf")
$ExpectedSha = "745601B2963721AA060063F1DB250CBF11091EB2C5B74E799A675CCC73CB8DCE"

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
if (-not (Test-Path "supabase/migrations/20260716090000_baseline_aruka_v1.sql")) { Fail "Missing official baseline migration." }
if (-not (Test-Path "supabase/migrations/cutover-manifest.json")) { Fail "Missing cutover manifest." }

$ref = if (Test-Path "supabase/.temp/project-ref") { (Get-Content -Raw "supabase/.temp/project-ref").Trim() } else { "" }
if ($ref -ne $ExpectedRef) { Fail "Linked project-ref is not the expected HML ref." }

$hash = if (Test-Path "supabase/migrations/20260716090000_baseline_aruka_v1.sql") { (Get-FileHash "supabase/migrations/20260716090000_baseline_aruka_v1.sql" -Algorithm SHA256).Hash } else { "" }
if ($hash -ne $ExpectedSha) { Fail "Official baseline SHA mismatch." }

$dockerVersion = Run "docker" @("--version")
if ($dockerVersion.code -ne 0) { Fail "Docker CLI unavailable." }
$dockerServer = Run "docker" @("version", "--format", "{{.Client.Version}} {{.Server.Version}}")
if ($dockerServer.code -ne 0) { Fail "Docker Server unavailable." }
$dockerContext = Run "docker" @("context", "show")
if ($dockerContext.code -ne 0 -or $dockerContext.output.Trim() -ne "desktop-linux") { Fail "Docker context must be desktop-linux." }
$supabaseVersion = Run "npx.cmd" @("supabase", "--version")
if ($supabaseVersion.code -ne 0) { Fail "Supabase CLI unavailable through npx.cmd." }

$activeSql = @(Get-ChildItem "supabase/migrations" -Filter "*.sql" | Select-Object -ExpandProperty Name)
if ($activeSql.Count -ne 1 -or $activeSql[0] -ne "20260716090000_baseline_aruka_v1.sql") { Fail "Active migrations folder must contain only the official baseline SQL." }

$summary = [ordered]@{
  result = if ($script:Errors.Count -eq 0) { "PREFLIGHT_OK" } else { "PREFLIGHT_FAILED" }
  project_id = $ProjectId
  docker = $dockerVersion.output.Trim()
  docker_server = $dockerServer.output.Trim()
  docker_context = $dockerContext.output.Trim()
  supabase_cli = $supabaseVersion.output.Trim()
  baseline_sha256 = $hash
  active_migrations = $activeSql
  errors = $script:Errors
}
$summary | ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 $LogPath

if ($script:Errors.Count -gt 0) {
  Write-Error "PREFLIGHT_FAILED"
  exit 1
}

Write-Output "PREFLIGHT_OK"
exit 0
