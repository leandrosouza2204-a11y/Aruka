param(
  [Parameter(Mandatory = $true)]
  [string]$RecoveryRoot,
  [switch]$ExecuteAfterRevocation
)

$ErrorActionPreference = "Stop"
$root = [IO.Path]::GetFullPath($RecoveryRoot).TrimEnd('\')
if (-not $root.StartsWith('B:\Aruka\Recovery\', [StringComparison]::OrdinalIgnoreCase)) { throw "RECOVERY_ROOT_MUST_BE_ON_APPROVED_B_VOLUME" }
$credentialDirectory = Join-Path $root 'credentials'
$targets = @((Join-Path $credentialDirectory 'pgpass.conf'), (Join-Path $credentialDirectory 'aws-credentials'))
if (-not $ExecuteAfterRevocation) {
  [pscustomobject]@{ Status="PLAN_ONLY"; CredentialsMustBeRevokedFirst=$true; TargetCount=$targets.Count } | ConvertTo-Json
  exit 0
}
foreach ($target in $targets) {
  if (Test-Path -LiteralPath $target -PathType Leaf) { Remove-Item -LiteralPath $target -Force }
}
if ((Test-Path -LiteralPath $credentialDirectory -PathType Container) -and (Get-ChildItem -LiteralPath $credentialDirectory -Force | Measure-Object).Count -eq 0) {
  Remove-Item -LiteralPath $credentialDirectory
}
[pscustomobject]@{ Status="REMOVED_AFTER_REVOKATION"; SecretValuesPrinted=$false } | ConvertTo-Json
