param(
  [Parameter(Mandatory = $true)]
  [string]$RecoveryRoot,
  [switch]$WriteCheckpoint
)

$ErrorActionPreference = "Stop"
$root = [IO.Path]::GetFullPath($RecoveryRoot).TrimEnd('\')
$repoRoot = [IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot)).TrimEnd('\')
if (-not $root.StartsWith('B:\Aruka\Recovery\', [StringComparison]::OrdinalIgnoreCase)) { throw "RECOVERY_ROOT_MUST_BE_ON_APPROVED_B_VOLUME" }
if (-not (Test-Path -LiteralPath $root -PathType Container)) { throw "RECOVERY_ROOT_MISSING" }

$volume = Get-Volume -DriveLetter B
$bitlocker = Get-BitLockerVolume -MountPoint 'B:'
if ($volume.FileSystemLabel -ne 'ARUKA_BACKUP' -or $volume.FileSystem -ne 'NTFS' -or $volume.SizeRemaining -lt 5GB) { throw "BACKUP_VOLUME_REQUIREMENTS_NOT_MET" }
if ($bitlocker.VolumeStatus -ne 'FullyEncrypted' -or $bitlocker.ProtectionStatus -ne 'On' -or $bitlocker.EncryptionMethod -ne 'XtsAes256' -or $bitlocker.EncryptionPercentage -ne 100) { throw "BITLOCKER_REQUIREMENTS_NOT_MET" }

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$allowedSids = @($identity.User.Value, 'S-1-5-18')
$acl = Get-Acl -LiteralPath $root
if (-not $acl.AreAccessRulesProtected) { throw "RECOVERY_ROOT_ACL_INHERITANCE_NOT_DISABLED" }
foreach ($rule in $acl.Access) {
  $sid = $rule.IdentityReference.Translate([Security.Principal.SecurityIdentifier]).Value
  if ($sid -notin $allowedSids -or $rule.AccessControlType -ne 'Allow') { throw "RECOVERY_ROOT_ACL_NOT_RESTRICTED" }
}

$toolchainPath = Join-Path $repoRoot 'scripts\config\aruka-recovery-toolchain.json'
$toolchain = Get-Content -Raw -LiteralPath $toolchainPath | ConvertFrom-Json
if ($toolchain.project_ref -ne 'vrizeuhuhvtvbrmtvdik' -or $toolchain.region -ne 'us-east-2') { throw "TOOLCHAIN_IDENTITY_MISMATCH" }
$supabaseExe = Join-Path $root "tools\supabase-$($toolchain.supabase_cli.version)\supabase.exe"
$supabaseArchive = Join-Path $root "tools\supabase-$($toolchain.supabase_cli.version)\supabase_$($toolchain.supabase_cli.version)_windows_amd64.zip"
if (-not (Test-Path -LiteralPath $supabaseExe) -or -not (Test-Path -LiteralPath $supabaseArchive)) { throw "PINNED_SUPABASE_CLI_MISSING" }
if ((Get-FileHash -LiteralPath $supabaseArchive -Algorithm SHA256).Hash.ToLowerInvariant() -ne $toolchain.supabase_cli.archive_sha256) { throw "PINNED_SUPABASE_CLI_HASH_MISMATCH" }
$supabaseVersion = (& $supabaseExe --version).Trim()
if ($supabaseVersion -ne $toolchain.supabase_cli.version) { throw "SUPABASE_CLI_VERSION_MISMATCH" }

$docker = Get-Command docker -ErrorAction Stop
foreach ($image in @($toolchain.postgres.image, $toolchain.aws_cli.image)) {
  & $docker.Source image inspect $image --format '{{.Id}}' 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "PINNED_DOCKER_IMAGE_MISSING" }
}
$postgresVersions = & $docker.Source run --rm --network none --entrypoint sh $toolchain.postgres.image -c 'psql --version; pg_dump --version; pg_dumpall --version'
if ($LASTEXITCODE -ne 0 -or (@($postgresVersions | Where-Object { $_ -match '17\.6' }).Count -ne 3)) { throw "POSTGRES_CLIENT_VERSION_MISMATCH" }
$awsVersion = (& $docker.Source run --rm --network none $toolchain.aws_cli.image --version | Out-String).Trim()
if ($LASTEXITCODE -ne 0 -or $awsVersion -notmatch "^aws-cli/$([regex]::Escape($toolchain.aws_cli.version))\b") { throw "AWS_CLI_VERSION_MISMATCH" }

$requiredFiles = @(
  'scripts\export-supabase-storage-backup.ps1',
  'scripts\build-storage-recovery-manifest.mjs',
  'scripts\verify-consistent-recovery-point.mjs',
  'scripts\prepare-next-recovery-drill.mjs',
  'scripts\normalize-supabase-snapshot-dump.mjs',
  'scripts\sql\recovery-snapshot-keeper.sql',
  'scripts\sql\storage-recovery-inventory-at-snapshot.sql',
  'scripts\initialize-aruka-recovery-credentials.ps1',
  'scripts\lib\aruka-recovery-credential-policy.psm1',
  'scripts\remove-aruka-recovery-credentials.ps1'
)
foreach ($relative in $requiredFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $repoRoot $relative) -PathType Leaf)) { throw "REQUIRED_RECOVERY_FILE_MISSING" }
}

$result = [ordered]@{
  status = "PASS"
  technical_local_readiness = "READY"
  collection_authorized = $false
  backup_started = $false
  production_changed = $false
  recovery_root = $root
  encrypted_destination = "PASS"
  free_bytes = [long]$volume.SizeRemaining
  acl_restricted = $true
  supabase_cli_version = $supabaseVersion
  postgres_client_version = $toolchain.postgres.version
  aws_cli_version = $toolchain.aws_cli.version
  node_version = (& node --version).Trim()
  credentials_present = (Test-Path -LiteralPath (Join-Path $root 'credentials') -PathType Container)
  write_freeze_active = $false
  restore_drill = "PARTIAL"
  production_readiness = "NO_GO"
  human_actions_required = @("COMPLETE_NOMINAL_AUTHORIZATION_FIELDS", "PROVISION_TEMPORARY_CREDENTIALS", "CONFIRM_CONTROLLED_MAINTENANCE_WINDOW")
}
if ($WriteCheckpoint) {
  $checkpoint = Join-Path $root 'final-backup-preparation-checkpoint.json'
  if (Test-Path -LiteralPath $checkpoint) { throw "CHECKPOINT_ALREADY_EXISTS" }
  [IO.File]::WriteAllText($checkpoint, (($result | ConvertTo-Json -Depth 5) + "`n"), [Text.UTF8Encoding]::new($false))
}
$result | ConvertTo-Json -Depth 5
