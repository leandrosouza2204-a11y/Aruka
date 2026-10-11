param(
  [Parameter(Mandatory = $true)][string]$MetadataJsonl,
  [Parameter(Mandatory = $true)][string]$OutputPath,
  [string]$Endpoint,
  [string]$Region,
  [string]$ExpectedProjectRef,
  [string]$ApprovalFile,
  [string]$AwsCredentialsFile,
  [string]$AwsCliImage = "public.ecr.aws/aws-cli/aws-cli@sha256:3dacc5db57c923c4223e949795f538ecf1f2212b2b7d5a028b47b97f91564c0d",
  [switch]$ExecuteRemote
)

$ErrorActionPreference = "Stop"
$metadataPath = [IO.Path]::GetFullPath($MetadataJsonl)
$reportPath = [IO.Path]::GetFullPath($OutputPath)
if (-not (Test-Path -LiteralPath $metadataPath -PathType Leaf)) { throw "METADATA_JSONL_MISSING" }
if (Test-Path -LiteralPath $reportPath) { throw "OUTPUT_ALREADY_EXISTS" }

$rows = [Collections.Generic.List[object]]::new()
$seen = [Collections.Generic.HashSet[string]]::new()
foreach ($line in [IO.File]::ReadLines($metadataPath)) {
  if ([string]::IsNullOrWhiteSpace($line)) { continue }
  $row = $line | ConvertFrom-Json
  if ([string]::IsNullOrWhiteSpace($row.bucket_id) -or [string]::IsNullOrWhiteSpace($row.name)) { throw "INVALID_STORAGE_METADATA_ROW" }
  $identity = "$($row.bucket_id)`0$($row.name)"
  if (-not $seen.Add($identity)) { throw "DUPLICATE_STORAGE_METADATA_OBJECT" }
  $rows.Add($row)
}
if ($rows.Count -ne 8) { throw "EXPECTED_EXACTLY_8_STORAGE_OBJECTS" }

if (-not $ExecuteRemote) {
  [pscustomobject]@{ Status="PLAN_ONLY"; ProductionAccess="NO"; ExpectedObjects=8; NamesPrinted=$false; BodyReads=0 } | ConvertTo-Json
  exit 0
}
if (-not $Endpoint -or -not $Region -or -not $ExpectedProjectRef -or -not $ApprovalFile -or -not $AwsCredentialsFile) { throw "REMOTE_PARAMETERS_REQUIRED" }
$endpointUri = [Uri]$Endpoint
if ($endpointUri.Scheme -ne "https" -or $endpointUri.Host -ne "$ExpectedProjectRef.storage.supabase.co" -or $endpointUri.AbsolutePath.TrimEnd('/') -ne "/storage/v1/s3") { throw "REMOTE_ENDPOINT_IDENTITY_MISMATCH" }
$approval = Get-Content -Raw -LiteralPath $ApprovalFile | ConvertFrom-Json
if ($approval.decision -ne "APPROVED" -or $approval.project_ref -ne $ExpectedProjectRef -or $approval.credential_mode -ne "RLS_SESSION_TOKEN" -or [datetimeoffset]::Parse($approval.expires_at_utc) -le [datetimeoffset]::UtcNow) { throw "RLS_PREFLIGHT_AUTHORIZATION_INVALID" }
if (-not (Test-Path -LiteralPath $AwsCredentialsFile -PathType Leaf)) { throw "AWS_CREDENTIALS_FILE_MISSING" }
if ($AwsCliImage -notmatch '@sha256:[a-f0-9]{64}$') { throw "AWS_CLI_DOCKER_IMAGE_MUST_BE_PINNED_BY_DIGEST" }
$docker = Get-Command docker -ErrorAction Stop

$results = [Collections.Generic.List[object]]::new()
foreach ($row in $rows) {
  $identityBytes = [Text.Encoding]::UTF8.GetBytes("$($row.bucket_id)`0$($row.name)")
  $digest = ([Security.Cryptography.SHA256]::Create().ComputeHash($identityBytes) | ForEach-Object { $_.ToString('x2') }) -join ''
  $credentialsMount = "type=bind,source=$([IO.Path]::GetFullPath($AwsCredentialsFile)),target=/run/secrets/aws-credentials,readonly"
  $contentLength = & $docker.Source run --rm --network bridge --env AWS_SHARED_CREDENTIALS_FILE=/run/secrets/aws-credentials --env AWS_PROFILE=default --mount $credentialsMount $AwsCliImage s3api head-object --bucket $row.bucket_id --key $row.name --endpoint-url $Endpoint --region $Region --no-cli-pager --query ContentLength --output text 2>$null
  $accessible = $LASTEXITCODE -eq 0
  $reportedSize = if ($accessible -and "$contentLength" -match '^\d+$') { [long]$contentLength } else { $null }
  $expectedSize = if ($null -ne $row.metadata.size) { [long]$row.metadata.size } elseif ($null -ne $row.size) { [long]$row.size } else { $null }
  $results.Add([ordered]@{ identity_sha256=$digest; accessible=$accessible; size_match=($accessible -and $null -ne $expectedSize -and $reportedSize -eq $expectedSize) })
}
$accessibleCount = @($results | Where-Object accessible).Count
$sizeMismatchCount = @($results | Where-Object { $_.accessible -and -not $_.size_match }).Count
$status = if ($accessibleCount -eq 8 -and $sizeMismatchCount -eq 0) { "PASS" } else { "INSUFFICIENT" }
$report = [ordered]@{
  status = $status
  credential_mode = "RLS_SESSION_TOKEN"
  expected_objects = 8
  accessible_objects = $accessibleCount
  missing_objects = 8 - $accessibleCount
  size_mismatches = $sizeMismatchCount
  body_reads = 0
  object_names_in_report = $false
  checked_at_utc = [datetimeoffset]::UtcNow.ToString('o')
  identities = $results
}
[IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($reportPath)) | Out-Null
[IO.File]::WriteAllText($reportPath, (($report | ConvertTo-Json -Depth 5) + "`n"), [Text.UTF8Encoding]::new($false))
$report | ConvertTo-Json -Depth 5
