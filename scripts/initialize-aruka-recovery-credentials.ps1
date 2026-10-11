param(
  [Parameter(Mandatory = $true)]
  [string]$RecoveryRoot,
  [Parameter(Mandatory = $true)]
  [string]$DatabaseHost,
  [int]$DatabasePort = 5432,
  [string]$DatabaseName = "postgres",
  [string]$DatabaseUser = "postgres.vrizeuhuhvtvbrmtvdik",
  [string]$ExpectedProjectRef = "vrizeuhuhvtvbrmtvdik",
  [ValidateSet("RLS_SESSION_TOKEN", "FULL_S3_ACCESS_KEY_BYPASSES_RLS")]
  [string]$StorageMode = "RLS_SESSION_TOKEN",
  [string]$StorageApprovalFile,
  [string]$CoverageReportFile,
  [switch]$Create
)

$ErrorActionPreference = "Stop"
$credentialPolicyModule = Join-Path $PSScriptRoot 'lib\aruka-recovery-credential-policy.psm1'
if (-not (Test-Path -LiteralPath $credentialPolicyModule -PathType Leaf)) { throw "CREDENTIAL_POLICY_MODULE_MISSING" }
Import-Module -Name $credentialPolicyModule -Force
$root = [IO.Path]::GetFullPath($RecoveryRoot).TrimEnd('\')
if ($ExpectedProjectRef -ne 'vrizeuhuhvtvbrmtvdik') { throw "PROJECT_REF_MISMATCH" }
if (-not $root.StartsWith('B:\Aruka\Recovery\', [StringComparison]::OrdinalIgnoreCase)) { throw "RECOVERY_ROOT_MUST_BE_ON_APPROVED_B_VOLUME" }
if (-not (Test-Path -LiteralPath $root -PathType Container)) { throw "RECOVERY_ROOT_MISSING" }
$bitlocker = Get-BitLockerVolume -MountPoint 'B:'
if ($bitlocker.VolumeStatus -ne 'FullyEncrypted' -or $bitlocker.ProtectionStatus -ne 'On' -or $bitlocker.EncryptionMethod -ne 'XtsAes256') { throw "ENCRYPTED_DESTINATION_NOT_READY" }

$credentialDirectory = Join-Path $root 'credentials'
$pgpassPath = Join-Path $credentialDirectory 'pgpass.conf'
$awsPath = Join-Path $credentialDirectory 'aws-credentials'
if (-not $Create) {
  [pscustomobject]@{
    Status = "PLAN_ONLY"
    PromptsExecuted = $false
    FilesCreated = $false
    DatabaseCredentialPath = $pgpassPath
    StorageCredentialPath = $awsPath
    RequestedStorageMode = $StorageMode
    RlsSessionAccessKeyIdSource = if ($StorageMode -eq "RLS_SESSION_TOKEN") { "PROJECT_REF_PARAMETER_NOT_PROMPTED" } else { $null }
    RlsSessionSecretAccessKeyRequirement = if ($StorageMode -eq "RLS_SESSION_TOKEN") { "LEGACY_ANON_KEY_PUBLISHABLE_KEY_NOT_SUPPORTED" } else { $null }
    RlsSessionTokenRequirement = if ($StorageMode -eq "RLS_SESSION_TOKEN") { "CURRENT_AUTHENTICATED_USER_ACCESS_TOKEN_JWT_NOT_REFRESH_TOKEN" } else { $null }
    PrivilegedModeRequiresInsufficientCoverageEvidence = $true
  } | ConvertTo-Json
  exit 0
}
if (Test-Path -LiteralPath $credentialDirectory) { throw "CREDENTIAL_DIRECTORY_ALREADY_EXISTS" }
if ($StorageMode -eq "FULL_S3_ACCESS_KEY_BYPASSES_RLS") {
  if (-not $StorageApprovalFile -or -not $CoverageReportFile) { throw "PRIVILEGED_STORAGE_MODE_REQUIRES_APPROVAL_AND_COVERAGE_REPORT" }
  $storageApproval = Get-Content -Raw -LiteralPath $StorageApprovalFile | ConvertFrom-Json
  $coverageReport = Get-Content -Raw -LiteralPath $CoverageReportFile | ConvertFrom-Json
  if ($storageApproval.decision -ne "APPROVED" -or $storageApproval.allow_full_s3_access_key -ne $true -or $storageApproval.coverage_report_path -ne [IO.Path]::GetFullPath($CoverageReportFile)) { throw "PRIVILEGED_STORAGE_APPROVAL_INVALID" }
  if ($coverageReport.status -ne "INSUFFICIENT" -or $coverageReport.expected_objects -ne 8 -or $coverageReport.accessible_objects -ge 8) { throw "RLS_INSUFFICIENCY_NOT_PROVEN" }
}

function ConvertFrom-Secure([Security.SecureString]$Value) {
  $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Value)
  try { return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer) }
  finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
}

function Set-RestrictedAcl([string]$Path) {
  $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $systemSid = [Security.Principal.SecurityIdentifier]::new('S-1-5-18')
  $acl = [Security.AccessControl.DirectorySecurity]::new()
  $acl.SetAccessRuleProtection($true, $false)
  $acl.SetOwner($identity.User)
  $inherit = [Security.AccessControl.InheritanceFlags]'ContainerInherit,ObjectInherit'
  $rights = [Security.AccessControl.FileSystemRights]::FullControl
  $allow = [Security.AccessControl.AccessControlType]::Allow
  $acl.AddAccessRule([Security.AccessControl.FileSystemAccessRule]::new($identity.User, $rights, $inherit, [Security.AccessControl.PropagationFlags]::None, $allow))
  $acl.AddAccessRule([Security.AccessControl.FileSystemAccessRule]::new($systemSid, $rights, $inherit, [Security.AccessControl.PropagationFlags]::None, $allow))
  Set-Acl -LiteralPath $Path -AclObject $acl
}

$databasePassword = Read-Host 'Temporary PostgreSQL password for the approved backup identity' -AsSecureString
if ($StorageMode -eq "RLS_SESSION_TOKEN") {
  $awsAccessKey = $null
  $awsSecretKey = Read-Host 'Supabase legacy anon key for S3 session authentication (publishable key is not supported)' -AsSecureString
  $awsSessionToken = Read-Host 'Current authenticated user access token JWT (not the refresh token)' -AsSecureString
} else {
  $awsAccessKey = Read-Host 'Generated privileged S3 Access Key ID (bypasses RLS)' -AsSecureString
  $awsSecretKey = Read-Host 'Generated privileged S3 Secret Access Key (bypasses RLS)' -AsSecureString
  $awsSessionToken = $null
}

New-Item -ItemType Directory -Path $credentialDirectory | Out-Null
Set-RestrictedAcl $credentialDirectory
try {
  $databasePasswordText = ConvertFrom-Secure $databasePassword
  $accessKeyText = if ($StorageMode -eq "RLS_SESSION_TOKEN") { $ExpectedProjectRef } else { ConvertFrom-Secure $awsAccessKey }
  $secretKeyText = ConvertFrom-Secure $awsSecretKey
  $sessionTokenText = if ($null -ne $awsSessionToken) { ConvertFrom-Secure $awsSessionToken } else { $null }
  if ([string]::IsNullOrWhiteSpace($databasePasswordText) -or [string]::IsNullOrWhiteSpace($accessKeyText) -or [string]::IsNullOrWhiteSpace($secretKeyText)) { throw "TEMPORARY_CREDENTIAL_VALUE_MISSING" }
  if ($StorageMode -eq "RLS_SESSION_TOKEN" -and [string]::IsNullOrWhiteSpace($sessionTokenText)) { throw "STORAGE_SESSION_TOKEN_MISSING" }
  if ($StorageMode -eq "RLS_SESSION_TOKEN") {
    Assert-ArukaRlsSessionCredentials -ProjectRef $ExpectedProjectRef -LegacyAnonKey $secretKeyText -UserAccessToken $sessionTokenText | Out-Null
  }
  $escapedPassword = $databasePasswordText.Replace('\', '\\').Replace(':', '\:')
  [IO.File]::WriteAllText($pgpassPath, "$DatabaseHost`:$DatabasePort`:$DatabaseName`:$DatabaseUser`:$escapedPassword`n", [Text.UTF8Encoding]::new($false))
  $awsContent = "[default]`naws_access_key_id = $accessKeyText`naws_secret_access_key = $secretKeyText`n"
  if ($StorageMode -eq "RLS_SESSION_TOKEN") { $awsContent += "aws_session_token = $sessionTokenText`n" }
  [IO.File]::WriteAllText($awsPath, $awsContent, [Text.UTF8Encoding]::new($false))
} finally {
  $databasePasswordText = $null
  $accessKeyText = $null
  $secretKeyText = $null
  $sessionTokenText = $null
  $databasePassword = $null
  $awsAccessKey = $null
  $awsSecretKey = $null
  $awsSessionToken = $null
}

[pscustomobject]@{
  Status = "CREATED"
  ValuesPrinted = $false
  DatabaseCredentialPath = $pgpassPath
  StorageCredentialPath = $awsPath
  StorageMode = $StorageMode
  StorageAccessKeyIdSource = if ($StorageMode -eq "RLS_SESSION_TOKEN") { "PROJECT_REF" } else { "GENERATED_PRIVILEGED_S3_KEY" }
  RevocationStillRequired = $true
} | ConvertTo-Json
