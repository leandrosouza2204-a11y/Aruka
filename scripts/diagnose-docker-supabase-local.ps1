param()

$ErrorActionPreference = "Continue"

$root = (Resolve-Path ".").Path
$reportDir = Join-Path $root "reports/supabase-baseline-validation"
$logPath = Join-Path $reportDir "docker-diagnostics.log"
New-Item -ItemType Directory -Force $reportDir | Out-Null
"Docker/Supabase local diagnostics - $(Get-Date -Format o)" | Set-Content -Encoding utf8 $logPath

function Write-Report($Message) {
  Write-Output $Message
  Add-Content -Encoding utf8 -Path $logPath -Value $Message
}

function Redact($Text) {
  if ($null -eq $Text) { return "" }
  $value = [string]$Text
  $value = $value -replace '(postgres(?:ql)?://[^:]+:)[^@]+@', '$1***@'
  $value = $value -replace '(password=)[^;\s]+', '$1***'
  $value = $value -replace 'sb_secret_[A-Za-z0-9_-]+', '[REDACTED_LOCAL_SECRET_KEY]'
  $value = $value -replace '(eyJ[A-Za-z0-9_-]{12,})[A-Za-z0-9._-]+', '$1***'
  $value = $value -replace '\bbearer\s+[A-Za-z0-9._~+/=-]+', 'Bearer [REDACTED_LOCAL_TOKEN]'
  $value = $value -replace 'xrmqdkpxnfvusmenadnf', '[REDACTED_HML_PROJECT_REF]'
  $value = $value -replace 'https?://[A-Za-z0-9.-]+\.supabase\.co(?::\d+)?[^\s"'')>]*', '[REDACTED_SUPABASE_HOST]'
  return $value
}

function Invoke-Diagnostic($Label, [string[]]$Command) {
  Write-Report ""
  Write-Report "## $Label"
  $output = & $Command[0] @($Command[1..($Command.Length - 1)]) 2>&1
  $code = $LASTEXITCODE
  foreach ($line in $output) {
    Write-Report (Redact $line)
  }
  Write-Report "exit_code=$code"
  return @{ label = $Label; code = $code; output = ($output -join "`n") }
}

function Classify-DockerFailure($Results, $DockerConfigReadable) {
  $failed = @($Results | Where-Object { $_.code -ne 0 })
  if ($failed.Count -eq 0 -and $DockerConfigReadable) {
    return "OK"
  }
  $combined = (($Results | ForEach-Object { $_.output }) -join "`n")
  if ($combined -match "config\.json.*Acesso negado|config\.json.*Access is denied|permission denied.*config\.json") {
    return "DOCKER_CONFIG_PERMISSION_DENIED"
  }
  if ($combined -match "npipe:////./pipe/docker_engine|pipe/dockerDesktopLinuxEngine|access is denied|permission denied") {
    return "DOCKER_PIPE_ACCESS_DENIED"
  }
  if ($combined -match "daemon is not running|Cannot connect to the Docker daemon") {
    return "DOCKER_DAEMON_NOT_RUNNING"
  }
  if ($combined -match "context.*not found|invalid context") {
    return "DOCKER_CONTEXT_INVALID"
  }
  if ($combined -match "Docker Desktop|desktop-linux") {
    return "DOCKER_DESKTOP_NOT_READY"
  }
  if (-not $DockerConfigReadable) {
    return "DOCKER_CONFIG_PERMISSION_DENIED"
  }
  return "UNKNOWN"
}

$failures = 0
if (-not (Test-Path (Join-Path $root "package.json"))) {
  Write-Report "ERROR: run from project root."
  exit 1
}

Write-Report "Project root: $root"

$dockerConfig = $env:DOCKER_CONFIG
if ([string]::IsNullOrWhiteSpace($dockerConfig)) {
  $dockerConfig = Join-Path $HOME ".docker"
}
Write-Report "DOCKER_HOST set: $(-not [string]::IsNullOrWhiteSpace($env:DOCKER_HOST))"
Write-Report "DOCKER_CONFIG path: $dockerConfig"

$dockerConfigReadable = $true
try {
  if (Test-Path $dockerConfig) {
    Get-ChildItem -LiteralPath $dockerConfig -Force | Select-Object -First 5 | ForEach-Object {
      Write-Report "Docker config entry: $($_.Name)"
    }
    $configJson = Join-Path $dockerConfig "config.json"
    if (Test-Path $configJson) {
      $stream = [System.IO.File]::Open($configJson, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
      $stream.Close()
      Write-Report "Docker config.json readable: true"
    }
  } else {
    Write-Report "Docker config directory exists: false"
  }
} catch {
  $dockerConfigReadable = $false
  Write-Report "Docker config readable: false"
  Write-Report "Docker config error: $($_.Exception.Message)"
}

$results = New-Object System.Collections.ArrayList
[void]$results.Add((Invoke-Diagnostic "docker --version" @("docker", "--version")))
[void]$results.Add((Invoke-Diagnostic "docker version" @("docker", "version")))
[void]$results.Add((Invoke-Diagnostic "docker info" @("docker", "info")))
[void]$results.Add((Invoke-Diagnostic "docker context show" @("docker", "context", "show")))
[void]$results.Add((Invoke-Diagnostic "docker context ls" @("docker", "context", "ls")))
[void]$results.Add((Invoke-Diagnostic "docker ps names/status only" @("docker", "ps", "--format", "{{.Names}} {{.Status}}")))
[void]$results.Add((Invoke-Diagnostic "docker hello-world local image only" @("docker", "run", "--rm", "--pull=never", "hello-world")))
[void]$results.Add((Invoke-Diagnostic "npx supabase --version" @("npx.cmd", "supabase", "--version")))

$projectRefPath = Join-Path $root "supabase/.temp/project-ref"
if (Test-Path $projectRefPath) {
  $projectRef = (Get-Content -Raw $projectRefPath).Trim()
  Write-Report ""
  Write-Report "Supabase linked project-ref: $projectRef"
  if ($projectRef -ne "xrmqdkpxnfvusmenadnf") {
    Write-Report "ERROR: unexpected project-ref."
    $failures++
  }
} else {
  Write-Report "ERROR: missing supabase/.temp/project-ref"
  $failures++
}

foreach ($result in $results) {
  if ($result.code -ne 0) {
    $failures++
  }
}

$classification = Classify-DockerFailure $results $dockerConfigReadable
Write-Report ""
Write-Report "classification=$classification"
Write-Report "failures=$failures"

if ($failures -gt 0) {
  exit 1
}

exit 0
