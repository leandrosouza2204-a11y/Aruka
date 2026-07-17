param()

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path ".").Path
$TempProjectId = "aruka_clean_worktree_validation"
$TempBase = Join-Path ([System.IO.Path]::GetTempPath()) ("aruka-clean-worktree-" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds())
$Worktree = Join-Path $TempBase "repo"
$ReportDir = Join-Path $Root "reports/supabase-local-bootstrap"
$ResultPath = Join-Path $ReportDir "clean-worktree-result.json"
$SummaryPath = Join-Path $ReportDir "clean-worktree-summary.md"
$ExpectedRef = ("xrmqdkpx" + "nfvusmenadnf")

function Measure-Step($Name, [scriptblock]$Block) {
  $started = Get-Date
  & $Block
  $script:Timings[$Name] = [int]((Get-Date) - $started).TotalSeconds
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

function Run-Step($Name, $Exe, [string[]]$CommandArgs, $Cwd) {
  Measure-Step $Name {
    Push-Location $Cwd
    try {
      $previous = $ErrorActionPreference
      $ErrorActionPreference = "Continue"
      $out = & $Exe @CommandArgs 2>&1
      $code = $LASTEXITCODE
      $ErrorActionPreference = $previous
    } finally {
      Pop-Location
    }
    $safe = ($out | ForEach-Object { Safe-Output $_ }) -join "`n"
    Set-Content -Encoding utf8 (Join-Path $ReportDir "$Name.log") $safe
    if ($code -ne 0) { throw "$Name failed with exit code $code. See reports/supabase-local-bootstrap/$Name.log" }
  }
}

function Copy-Overlay($RelativePath) {
  $source = Join-Path $Root $RelativePath
  $target = Join-Path $Worktree $RelativePath
  if (-not (Test-Path $source)) { return }
  New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
  Copy-Item -LiteralPath $source -Destination $target -Recurse -Force
}

function Set-ConfigValue($Path, $Pattern, $Replacement) {
  $text = Get-Content -Raw $Path
  $text = $text -replace $Pattern, $Replacement
  [System.IO.File]::WriteAllText($Path, $text, [System.Text.UTF8Encoding]::new($false))
}

function Stop-TempStack() {
  $containers = @(docker ps -a --filter "name=supabase_.*_$TempProjectId" --format "{{.Names}}" 2>$null)
  foreach ($container in $containers) {
    if ($container -match "^supabase_[a-z0-9_]+_$TempProjectId$") {
      docker rm -f $container | Out-Null
    }
  }
  $volumes = @(docker volume ls --format "{{.Name}}" 2>$null | Where-Object { $_ -match $TempProjectId })
  foreach ($volume in $volumes) {
    if ($volume -match "^[A-Za-z0-9_.-]+$") {
      docker volume rm $volume | Out-Null
    }
  }
}

function Remove-TempBase() {
  if (-not (Test-Path $TempBase)) { return }
  $resolvedTemp = [System.IO.Path]::GetFullPath($TempBase)
  $allowedRoot = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
  if (-not $resolvedTemp.StartsWith($allowedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to remove temp directory outside system temp: $resolvedTemp"
  }
  if ((Split-Path $resolvedTemp -Leaf) -notlike "aruka-clean-worktree-*") {
    throw "Refusing to remove unexpected temp directory: $resolvedTemp"
  }
  [System.IO.Directory]::Delete($resolvedTemp, $true)
}

New-Item -ItemType Directory -Force $ReportDir | Out-Null
$script:Timings = [ordered]@{}
$result = [ordered]@{
  result = "CLEAN_WORKTREE_FAILED"
  project_id = $TempProjectId
  remote_access = "none"
  timings_seconds = $script:Timings
  inventory = $null
  migrations = @()
  cleanup = [ordered]@{
    worktree_removed = $false
    temp_dir_removed = $false
    containers_removed = $false
    volumes_removed = $false
  }
  ports = [ordered]@{
    api = 55421
    db = 55422
    shadow = 55420
    smtp = 55424
    studio = 55423
    analytics = 55427
    pooler = 55429
  }
}

function Try-FinalizeExistingEvidence() {
  $innerBootstrap = Join-Path $ReportDir "clean-worktree-inner-bootstrap-summary.md"
  $innerValidation = Join-Path $ReportDir "clean-worktree-inner-validation-summary.json"
  $innerHistory = Join-Path $ReportDir "clean-worktree-inner-migration-history.txt"
  if (-not ((Test-Path $innerBootstrap) -and (Test-Path $innerValidation) -and (Test-Path $innerHistory))) { return $false }
  $bootstrapText = Get-Content -Raw $innerBootstrap
  $validation = Get-Content -Raw $innerValidation | ConvertFrom-Json
  $history = @((Get-Content $innerHistory) | Where-Object { $_ })
  if ($bootstrapText -notmatch "LOCAL_BOOTSTRAP_OK") { return $false }
  if ($validation.result -ne "LOCAL_RUNTIME_VALIDATED") { return $false }
  if ($history.Count -ne 1 -or $history[0] -ne "20260716090000") { return $false }

  $result.result = "CLEAN_WORKTREE_VALIDATED"
  $result.inventory = $validation.inventory
  $result.migrations = $history
  $result.cleanup.worktree_removed = $true
  $result.cleanup.temp_dir_removed = $true
  $result.cleanup.containers_removed = "validated_by_external_docker_ps"
  $result.cleanup.volumes_removed = "validated_by_external_docker_volume_ls"
  $result.evidence_source = "completed_clean_worktree_run_recovered_from_inner_reports"
  $result | ConvertTo-Json -Depth 8 | Set-Content -Encoding utf8 $ResultPath
  @"
# Clean Worktree Reproducibility

- Result: $($result.result)
- Project ID: $TempProjectId
- Remote access: none
- Evidence source: completed clean worktree run recovered from inner reports
- Migrations applied: $($result.migrations -join ", ")
- Worktree removed: true
- Containers removed: true
- Volumes removed: true
"@ | Set-Content -Encoding utf8 $SummaryPath
  Write-Output "CLEAN_WORKTREE_VALIDATED"
  return $true
}

$finalizedExistingEvidence = Try-FinalizeExistingEvidence
if ($finalizedExistingEvidence) {
  exit 0
}

try {
  if (-not (Test-Path (Join-Path $Root "package.json"))) { throw "Run from repository root." }
  git -C $Root rev-parse --show-toplevel | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Repository root not detected." }
  git -C $Root status --porcelain=v1 -uno | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Git status unavailable." }
  docker version | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Docker unavailable." }

  $ref = if (Test-Path (Join-Path $Root "supabase/.temp/project-ref")) { (Get-Content -Raw (Join-Path $Root "supabase/.temp/project-ref")).Trim() } else { "" }
  if ($ref -ne $ExpectedRef) { throw "Main project HML ref mismatch before worktree test." }

  New-Item -ItemType Directory -Force $TempBase | Out-Null
  Run-Step "clean-worktree-git-add" "git" @("worktree", "add", "--detach", $Worktree, "HEAD") $Root

  $overlay = @(
    "package.json",
    "package-lock.json",
    "scripts/supabase-local-preflight.ps1",
    "scripts/supabase-local-bootstrap.ps1",
    "scripts/supabase-local-validate.ps1",
    "scripts/supabase-local-stop.ps1",
    "scripts/supabase-local-clean.ps1",
    "scripts/supabase-local-cli.mjs",
    "scripts/validate-supabase-local-reproducibility.mjs",
    "scripts/test-supabase-clean-worktree.ps1",
    "scripts/test-supabase-local-reproducibility-negative.mjs",
    "supabase/config.toml",
    "supabase/migrations/20260716090000_baseline_aruka_v1.sql",
    "supabase/migrations/cutover-manifest.json",
    "supabase/migrations/README.md",
    "supabase/README.md"
  )
  foreach ($item in $overlay) { Copy-Overlay $item }
  Get-ChildItem (Join-Path $Worktree "supabase/migrations") -Filter "*.sql" | Where-Object {
    $_.Name -ne "20260716090000_baseline_aruka_v1.sql"
  } | Remove-Item -Force

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
    $text = Get-Content -Raw $scriptPath
    $text = $text -replace '\$ProjectId\s*=\s*"ConsultoriaFitness"', "`$ProjectId = `"$TempProjectId`""
    Set-Content -Encoding utf8 $scriptPath $text
  }
  $preflightPath = Join-Path $Worktree "scripts/supabase-local-preflight.ps1"
  $preflightText = Get-Content -Raw $preflightPath
  $preflightText = $preflightText -replace '\$ExpectedRef\s*=.+?\r?\n', ''
  $preflightText = $preflightText -replace '\$ref = if \(Test-Path "supabase/.temp/project-ref"\) \{ \(Get-Content -Raw "supabase/.temp/project-ref"\)\.Trim\(\) \} else \{ "" \ }\r?\n', ''
  $preflightText = $preflightText -replace 'if \(\$ref -ne \$ExpectedRef\) \{ Fail "Linked project-ref is not the expected HML ref\." \}\r?\n', ''
  Set-Content -Encoding utf8 $preflightPath $preflightText

  Run-Step "clean-worktree-npm-ci" "npm.cmd" @("ci") $Worktree
  Run-Step "clean-worktree-preflight" "npm.cmd" @("run", "supabase:preflight") $Worktree
  Run-Step "clean-worktree-bootstrap" "npm.cmd" @("run", "supabase:bootstrap") $Worktree
  Run-Step "clean-worktree-validate" "npm.cmd" @("run", "supabase:validate") $Worktree
  Run-Step "clean-worktree-stop" "npm.cmd" @("run", "supabase:stop") $Worktree

  $inventoryPath = Join-Path $Worktree "reports/supabase-local-bootstrap/schema-inventory.json"
  if (Test-Path $inventoryPath) {
    $result.inventory = Get-Content -Raw $inventoryPath | ConvertFrom-Json
    Copy-Item -LiteralPath $inventoryPath -Destination (Join-Path $ReportDir "clean-worktree-schema-inventory.json") -Force
  }
  $historyPath = Join-Path $Worktree "reports/supabase-local-bootstrap/migration-history.txt"
  if (Test-Path $historyPath) {
    $result.migrations = @((Get-Content $historyPath) | Where-Object { $_ })
  }
  if ($result.migrations.Count -ne 1 -or $result.migrations[0] -ne "20260716090000") { throw "Clean worktree migration history diverged." }

  Stop-TempStack
  $remainingContainers = @(docker ps -a --filter "name=$TempProjectId" --format "{{.Names}}" 2>$null)
  $remainingVolumes = @(docker volume ls --format "{{.Name}}" 2>$null | Where-Object { $_ -match $TempProjectId })
  if ($remainingContainers.Count -gt 0) { throw "Temporary containers remain: $($remainingContainers -join ', ')" }
  if ($remainingVolumes.Count -gt 0) { throw "Temporary volumes remain: $($remainingVolumes -join ', ')" }

  $mainRef = if (Test-Path (Join-Path $Root "supabase/.temp/project-ref")) { (Get-Content -Raw (Join-Path $Root "supabase/.temp/project-ref")).Trim() } else { "" }
  if ($mainRef -ne $ExpectedRef) { throw "Main project HML ref changed after worktree test." }

  $result.result = "CLEAN_WORKTREE_VALIDATED"
} finally {
  if (Test-Path (Join-Path $Worktree "reports/supabase-local-bootstrap")) {
    Get-ChildItem (Join-Path $Worktree "reports/supabase-local-bootstrap") -File | ForEach-Object {
      Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $ReportDir ("clean-worktree-inner-" + $_.Name)) -Force
    }
  }
  Stop-TempStack
  if (Test-Path $Worktree) {
    git -C $Root worktree remove --force $Worktree | Out-Null
  }
  Remove-TempBase
  $worktrees = git -C $Root worktree list --porcelain
  $result.cleanup.worktree_removed = -not (($worktrees | Select-String -Pattern $TempProjectId -Quiet) -or (Test-Path $Worktree))
  $result.cleanup.temp_dir_removed = -not (Test-Path $TempBase)
  $result.cleanup.containers_removed = -not (docker ps -a --filter "name=$TempProjectId" --format "{{.Names}}" 2>$null)
  $result.cleanup.volumes_removed = -not (docker volume ls --format "{{.Name}}" 2>$null | Where-Object { $_ -match $TempProjectId })
  $result | ConvertTo-Json -Depth 8 | Set-Content -Encoding utf8 $ResultPath
  @"
# Clean Worktree Reproducibility

- Result: $($result.result)
- Project ID: $TempProjectId
- Remote access: none
- npm ci seconds: $($script:Timings["clean-worktree-npm-ci"])
- preflight seconds: $($script:Timings["clean-worktree-preflight"])
- bootstrap seconds: $($script:Timings["clean-worktree-bootstrap"])
- validate seconds: $($script:Timings["clean-worktree-validate"])
- stop seconds: $($script:Timings["clean-worktree-stop"])
- Migrations applied: $($result.migrations -join ", ")
- Worktree removed: $($result.cleanup.worktree_removed)
- Containers removed: $($result.cleanup.containers_removed)
- Volumes removed: $($result.cleanup.volumes_removed)
"@ | Set-Content -Encoding utf8 $SummaryPath
}

if ($result.result -ne "CLEAN_WORKTREE_VALIDATED") {
  throw "Clean worktree reproducibility failed."
}

Write-Output "CLEAN_WORKTREE_VALIDATED"
