param(
  [Parameter(Mandatory = $true)]
  [string]$MetadataJsonl,

  [Parameter(Mandatory = $true)]
  [string]$DestinationRoot,

  [string]$Endpoint,
  [string]$Region,
  [string]$ExpectedProjectRef,
  [string]$HumanApprovalFile,
  [string]$FreezeEvidenceFile,
  [string]$ControlEvidenceFile,
  [ValidateSet("Host", "Docker")]
  [string]$AwsCliMode = "Host",
  [string]$AwsCliImage = "public.ecr.aws/aws-cli/aws-cli@sha256:3dacc5db57c923c4223e949795f538ecf1f2212b2b7d5a028b47b97f91564c0d",
  [string]$AwsCredentialsFile,
  [ValidateSet("RLS_SESSION_TOKEN", "FULL_S3_ACCESS_KEY_BYPASSES_RLS")]
  [string]$CredentialMode,
  [switch]$ExecuteRemote
)

$ErrorActionPreference = "Stop"
$metadataPath = [IO.Path]::GetFullPath($MetadataJsonl)
$destination = [IO.Path]::GetFullPath($DestinationRoot)
if (-not (Test-Path -LiteralPath $metadataPath -PathType Leaf)) { throw "METADATA_JSONL_MISSING" }

$repoRoot = [IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot)).TrimEnd('\', '/')
$repoPrefix = $repoRoot + [IO.Path]::DirectorySeparatorChar
if ($destination.Equals($repoRoot, [StringComparison]::OrdinalIgnoreCase) -or $destination.StartsWith($repoPrefix, [StringComparison]::OrdinalIgnoreCase)) {
  throw "OUTPUT_MUST_BE_OUTSIDE_GIT"
}

$rows = [Collections.Generic.List[object]]::new()
$seen = [Collections.Generic.HashSet[string]]::new()
$lineNumber = 0
foreach ($line in [IO.File]::ReadLines($metadataPath)) {
  $lineNumber++
  if ([string]::IsNullOrWhiteSpace($line)) { continue }
  try { $row = $line | ConvertFrom-Json } catch { throw "INVALID_JSONL_AT_LINE_$lineNumber" }
  if ([string]::IsNullOrWhiteSpace($row.bucket_id) -or [string]::IsNullOrWhiteSpace($row.name)) { throw "INVALID_STORAGE_METADATA_ROW" }
  $identity = "$($row.bucket_id)`0$($row.name)"
  if (-not $seen.Add($identity)) { throw "DUPLICATE_STORAGE_METADATA_OBJECT" }
  $rows.Add($row)
}

if (-not $ExecuteRemote) {
  [pscustomobject]@{
    Status = "PLAN_ONLY"
    NetworkAccess = "NO"
    ProductionAccess = "NO"
    ObjectsPlanned = $rows.Count
    DestinationOutsideGit = $true
    AwsCliMode = $AwsCliMode
    RequiredExecutable = if ($AwsCliMode -eq "Docker") { "docker" } else { "aws" }
    AwsCliImage = if ($AwsCliMode -eq "Docker") { $AwsCliImage } else { $null }
    RequiredAuthorizationFiles = 2
  } | ConvertTo-Json
  exit 0
}

if (-not $Endpoint -or -not $Region -or -not $ExpectedProjectRef) { throw "REMOTE_TARGET_PARAMETERS_REQUIRED" }
$endpointUri = [Uri]$Endpoint
if ($endpointUri.Scheme -ne "https" -or $endpointUri.Host -ne "$ExpectedProjectRef.storage.supabase.co" -or $endpointUri.AbsolutePath.TrimEnd('/') -ne "/storage/v1/s3") {
  throw "REMOTE_ENDPOINT_IDENTITY_MISMATCH"
}
if (-not $HumanApprovalFile -or (-not $FreezeEvidenceFile -and -not $ControlEvidenceFile)) { throw "AUTHORIZATION_AND_CONTROL_EVIDENCE_REQUIRED" }
$approval = Get-Content -Raw -LiteralPath $HumanApprovalFile | ConvertFrom-Json
if ($approval.decision -ne "APPROVED" -or $approval.scope -ne "STORAGE_EXPORT" -or $approval.project_ref -ne $ExpectedProjectRef -or [datetimeoffset]::Parse($approval.expires_at_utc) -le [datetimeoffset]::UtcNow) {
  throw "HUMAN_AUTHORIZATION_INVALID"
}
$consistencyMode = "FULL_WRITE_FREEZE"
if ($ControlEvidenceFile) {
  $control = Get-Content -Raw -LiteralPath $ControlEvidenceFile | ConvertFrom-Json
  if ($control.status -ne "ACTIVE" -or $control.mode -ne "CONTROLLED_NO_FULL_WRITE_FREEZE" -or $control.project_ref -ne $ExpectedProjectRef -or
      -not $control.maintenance_window_confirmed -or -not $control.no_active_users_confirmed -or -not $control.integrations_assessed -or
      -not $control.edge_functions_state_recorded -or -not $control.cron_paused -or -not $control.storage_inventory_before_captured -or
      $control.full_write_freeze_proven -ne $false -or [datetimeoffset]::Parse($control.valid_until_utc) -le [datetimeoffset]::UtcNow) {
    throw "CONTROLLED_COLLECTION_EVIDENCE_INVALID"
  }
  $consistencyMode = "CONTROLLED_NO_FULL_WRITE_FREEZE"
} else {
  $freeze = Get-Content -Raw -LiteralPath $FreezeEvidenceFile | ConvertFrom-Json
  if ($freeze.status -ne "ACTIVE" -or $freeze.project_ref -ne $ExpectedProjectRef -or -not $freeze.application_writes_frozen -or -not $freeze.storage_writes_frozen -or -not $freeze.background_jobs_paused -or [datetimeoffset]::Parse($freeze.valid_until_utc) -le [datetimeoffset]::UtcNow) {
    throw "WRITE_FREEZE_EVIDENCE_INVALID"
  }
}
if ($AwsCliMode -eq "Host") {
  if ([string]::IsNullOrWhiteSpace($env:AWS_ACCESS_KEY_ID) -or [string]::IsNullOrWhiteSpace($env:AWS_SECRET_ACCESS_KEY)) { throw "S3_CREDENTIAL_ENVIRONMENT_MISSING" }
  $authMode = if ([string]::IsNullOrWhiteSpace($env:AWS_SESSION_TOKEN)) { "FULL_S3_ACCESS_KEY_BYPASSES_RLS" } else { "RLS_SESSION_TOKEN" }
  $aws = Get-Command aws.exe -ErrorAction SilentlyContinue
  if (-not $aws) { $aws = Get-Command aws -ErrorAction SilentlyContinue }
  if (-not $aws) { throw "AWS_CLI_NOT_INSTALLED" }
} else {
  if ($AwsCliImage -notmatch '@sha256:[a-f0-9]{64}$') { throw "AWS_CLI_DOCKER_IMAGE_MUST_BE_PINNED_BY_DIGEST" }
  if ([string]::IsNullOrWhiteSpace($AwsCredentialsFile) -or -not (Test-Path -LiteralPath $AwsCredentialsFile -PathType Leaf)) { throw "AWS_CREDENTIALS_FILE_MISSING" }
  $credentialsPath = [IO.Path]::GetFullPath($AwsCredentialsFile)
  if ($credentialsPath.Equals($repoRoot, [StringComparison]::OrdinalIgnoreCase) -or $credentialsPath.StartsWith($repoPrefix, [StringComparison]::OrdinalIgnoreCase)) { throw "AWS_CREDENTIALS_FILE_MUST_BE_OUTSIDE_GIT" }
  if ([string]::IsNullOrWhiteSpace($CredentialMode)) { throw "CREDENTIAL_MODE_REQUIRED" }
  $authMode = $CredentialMode
  $docker = Get-Command docker.exe -ErrorAction SilentlyContinue
  if (-not $docker) { $docker = Get-Command docker -ErrorAction SilentlyContinue }
  if (-not $docker) { throw "DOCKER_NOT_INSTALLED" }
  & $docker.Source image inspect $AwsCliImage --format '{{.Id}}' 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "PINNED_AWS_CLI_IMAGE_NOT_AVAILABLE" }
}
if ($authMode -eq "FULL_S3_ACCESS_KEY_BYPASSES_RLS") {
  if ($approval.allow_full_s3_access_key -ne $true) { throw "FULL_S3_ACCESS_KEY_NOT_EXPLICITLY_APPROVED" }
  if ([string]::IsNullOrWhiteSpace($approval.coverage_report_path) -or -not (Test-Path -LiteralPath $approval.coverage_report_path -PathType Leaf)) { throw "RLS_COVERAGE_REPORT_REQUIRED" }
  $coverage = Get-Content -Raw -LiteralPath $approval.coverage_report_path | ConvertFrom-Json
  if ($coverage.status -ne "INSUFFICIENT" -or $coverage.expected_objects -ne 8 -or $coverage.accessible_objects -ge 8) { throw "RLS_INSUFFICIENCY_NOT_PROVEN" }
}
if (Test-Path -LiteralPath $destination) {
  if ((Get-ChildItem -LiteralPath $destination -Force | Measure-Object).Count -ne 0) { throw "DESTINATION_MUST_BE_EMPTY" }
} else {
  New-Item -ItemType Directory -Path $destination | Out-Null
}

$objectsRoot = Join-Path $destination "objects"
New-Item -ItemType Directory -Path $objectsRoot | Out-Null
$journalPath = Join-Path $destination "storage-download-journal.jsonl"
$journalWriter = [IO.StreamWriter]::new($journalPath, $false, [Text.UTF8Encoding]::new($false))
$failures = 0
try {
  foreach ($row in $rows) {
    $identityBytes = [Text.Encoding]::UTF8.GetBytes("$($row.bucket_id)`0$($row.name)")
    $digestBytes = [Security.Cryptography.SHA256]::Create().ComputeHash($identityBytes)
    $digest = ($digestBytes | ForEach-Object { $_.ToString("x2") }) -join ""
    $relativePath = "objects/$($digest.Substring(0,2))/$digest.blob"
    $filePath = Join-Path $destination ($relativePath -replace '/', [IO.Path]::DirectorySeparatorChar)
    New-Item -ItemType Directory -Path ([IO.Path]::GetDirectoryName($filePath)) -Force | Out-Null
    if ($AwsCliMode -eq "Host") {
      $raw = & $aws.Source s3api get-object --bucket $row.bucket_id --key $row.name --endpoint-url $Endpoint --region $Region --no-cli-pager $filePath 2>&1 | Out-String
    } else {
      $backupMount = "type=bind,source=$destination,target=/backup"
      $credentialsMount = "type=bind,source=$credentialsPath,target=/run/secrets/aws-credentials,readonly"
      $containerPath = "/backup/$relativePath"
      $raw = & $docker.Source run --rm --network bridge --env AWS_SHARED_CREDENTIALS_FILE=/run/secrets/aws-credentials --env AWS_PROFILE=default --mount $credentialsMount --mount $backupMount $AwsCliImage s3api get-object --bucket $row.bucket_id --key $row.name --endpoint-url $Endpoint --region $Region --no-cli-pager $containerPath 2>&1 | Out-String
    }
    if ($LASTEXITCODE -ne 0) {
      $failures++
      $journalWriter.WriteLine(([ordered]@{ bucket_id=$row.bucket_id; name=$row.name; relative_path=$relativePath; status="FAIL"; error="REMOTE_GET_OBJECT_FAILED" } | ConvertTo-Json -Compress))
      continue
    }
    try { $response = $raw | ConvertFrom-Json } catch { $response = [pscustomobject]@{} }
    $journalWriter.WriteLine(([ordered]@{ bucket_id=$row.bucket_id; name=$row.name; relative_path=$relativePath; remote_content_length=$response.ContentLength; local_size_bytes=(Get-Item -LiteralPath $filePath).Length; etag=$response.ETag; status="PASS" } | ConvertTo-Json -Compress))
  }
} finally {
  $journalWriter.Dispose()
}
if ($failures -ne 0) { throw "STORAGE_DOWNLOAD_FAILURES=$failures" }
[pscustomobject]@{ Status="PASS"; AuthMode=$authMode; ConsistencyMode=$consistencyMode; ObjectsDownloaded=$rows.Count; Journal=$journalPath; CredentialsLogged=$false; RemoteWrites=0; CrossServicePointInTimeConsistency="NOT_PROVEN" } | ConvertTo-Json
