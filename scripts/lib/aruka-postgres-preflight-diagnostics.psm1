Set-StrictMode -Version Latest

function Test-ArukaPostgresSnapshotId {
  param([Parameter(Mandatory = $true)][string]$Value)
  return $Value -match '^[0-9A-Fa-f]+-[0-9A-Fa-f]+-[0-9]+$'
}

function Get-ArukaPostgresFailureCategory {
  param(
    [Parameter(Mandatory = $true)][ValidateSet('CONNECT', 'SNAPSHOT_EXPORT', 'SNAPSHOT_IMPORT', 'KEEPER')][string]$Phase,
    [Parameter(Mandatory = $true)][int]$ExitCode,
    [string]$StandardError = '',
    [bool]$KeeperRunning = $false
  )

  $text = [string]$StandardError
  if ($text -match 'could not translate host name|Name or service not known|nodename nor servname') { return 'DNS_FAILURE' }
  if ($text -match 'Connection refused|actively refused') { return 'TCP_CONNECTION_REFUSED' }
  if ($text -match 'timeout expired|timed out|connection timeout') { return 'TCP_TIMEOUT' }
  if ($text -match 'no route to host|network is unreachable') { return 'TCP_ROUTE_UNAVAILABLE' }
  if ($text -match 'password authentication failed|SQLSTATE\s*28P01') { return 'AUTHENTICATION_FAILED' }
  if ($text -match 'no password supplied') { return 'PASSWORD_NOT_SUPPLIED' }
  if ($text -match 'role .+ does not exist') { return 'DATABASE_USER_INVALID' }
  if ($text -match 'database .+ does not exist') { return 'DATABASE_NAME_INVALID' }
  if ($text -match 'Tenant or user not found|invalid tenant|invalid user') { return 'POOLER_IDENTITY_INVALID' }
  if ($text -match 'Max client connections reached|remaining connection slots|too many clients') { return 'POOLER_CAPACITY_EXCEEDED' }
  if ($text -match 'SSL is required|no pg_hba\.conf entry.+SSL off') { return 'SSL_REQUIRED' }
  if ($text -match '\bSSL\b|TLS|certificate verify failed|server does not support SSL') { return 'TLS_NEGOTIATION_FAILED' }
  if ($text -match 'server closed the connection unexpectedly|unexpected EOF') { return 'CONNECTION_CLOSED_PREMATURELY' }
  if ($text -match '\bFATAL\b') { return 'SERVER_REJECTED_CONNECTION' }
  if ($Phase -eq 'SNAPSHOT_EXPORT') { return 'SNAPSHOT_EXPORT_FAILED' }
  if ($Phase -eq 'SNAPSHOT_IMPORT') { return 'SNAPSHOT_IMPORT_FAILED' }
  if ($Phase -eq 'KEEPER' -and -not $KeeperRunning) { return 'KEEPER_EXITED_PREMATURELY' }
  if ($ExitCode -eq 124) { return 'PROCESS_TIMEOUT' }
  return 'UNCLASSIFIED_PROCESS_FAILURE'
}

Export-ModuleMember -Function Test-ArukaPostgresSnapshotId, Get-ArukaPostgresFailureCategory
