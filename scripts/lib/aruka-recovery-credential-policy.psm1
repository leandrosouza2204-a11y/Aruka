Set-StrictMode -Version Latest

function ConvertFrom-Base64UrlJson {
  param([Parameter(Mandatory = $true)][string]$Value)

  $normalized = $Value.Replace('-', '+').Replace('_', '/')
  switch ($normalized.Length % 4) {
    0 { }
    2 { $normalized += '==' }
    3 { $normalized += '=' }
    default { throw 'JWT_BASE64URL_INVALID' }
  }
  try {
    $json = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($normalized))
    return $json | ConvertFrom-Json
  } catch {
    throw 'JWT_PAYLOAD_INVALID'
  }
}

function Get-JwtPayload {
  param([Parameter(Mandatory = $true)][string]$Token)

  $parts = $Token.Split('.')
  if ($parts.Count -ne 3) { throw 'JWT_FORMAT_INVALID' }
  foreach ($part in $parts) {
    if ([string]::IsNullOrWhiteSpace($part)) { throw 'JWT_FORMAT_INVALID' }
  }
  ConvertFrom-Base64UrlJson -Value $parts[1]
}

function Assert-ArukaRlsSessionCredentials {
  param(
    [Parameter(Mandatory = $true)][string]$ProjectRef,
    [Parameter(Mandatory = $true)][string]$LegacyAnonKey,
    [Parameter(Mandatory = $true)][string]$UserAccessToken
  )

  if ($ProjectRef -notmatch '^[a-z0-9]{20}$') { throw 'PROJECT_REF_INVALID' }
  if ($LegacyAnonKey -match '^sb_publishable_') { throw 'PUBLISHABLE_KEY_NOT_SUPPORTED_FOR_S3_SESSION_AUTH' }
  if ($LegacyAnonKey -match '^sb_secret_') { throw 'SECRET_KEY_NOT_ALLOWED_FOR_RLS_SESSION_AUTH' }
  if ($LegacyAnonKey -eq $UserAccessToken) { throw 'ANON_KEY_AND_USER_ACCESS_TOKEN_MUST_DIFFER' }

  $anonPayload = Get-JwtPayload -Token $LegacyAnonKey
  if ($anonPayload.role -ne 'anon') { throw 'LEGACY_ANON_KEY_ROLE_INVALID' }
  if ($null -ne $anonPayload.PSObject.Properties['ref'] -and $anonPayload.ref -ne $ProjectRef) { throw 'LEGACY_ANON_KEY_PROJECT_MISMATCH' }

  $userPayload = Get-JwtPayload -Token $UserAccessToken
  if ($userPayload.role -ne 'authenticated') { throw 'USER_ACCESS_TOKEN_ROLE_INVALID' }
  if ([string]::IsNullOrWhiteSpace([string]$userPayload.sub)) { throw 'USER_ACCESS_TOKEN_SUBJECT_MISSING' }
  if ($null -eq $userPayload.PSObject.Properties['exp'] -or [long]$userPayload.exp -le [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()) { throw 'USER_ACCESS_TOKEN_EXPIRED' }
  if ($null -ne $userPayload.PSObject.Properties['iss']) {
    try { $issuer = [Uri][string]$userPayload.iss } catch { throw 'USER_ACCESS_TOKEN_ISSUER_INVALID' }
    if ($issuer.Host -ne "$ProjectRef.supabase.co" -or $issuer.AbsolutePath.TrimEnd('/') -ne '/auth/v1') { throw 'USER_ACCESS_TOKEN_PROJECT_MISMATCH' }
  }

  [pscustomobject]@{
    Status = 'PASS'
    AccessKeyIdSource = 'PROJECT_REF'
    LegacyAnonRole = 'anon'
    UserRole = 'authenticated'
    SecretValuesPrinted = $false
  }
}

Export-ModuleMember -Function Assert-ArukaRlsSessionCredentials
