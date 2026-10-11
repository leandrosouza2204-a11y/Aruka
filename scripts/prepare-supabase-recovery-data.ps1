param(
  [Parameter(Mandatory = $true)]
  [string]$InputPath,

  [Parameter(Mandatory = $true)]
  [string]$OutputPath
)

$ErrorActionPreference = "Stop"

$inputFull = [IO.Path]::GetFullPath($InputPath)
$outputFull = [IO.Path]::GetFullPath($OutputPath)
if ($inputFull -eq $outputFull) {
  throw "InputPath and OutputPath must be different."
}
if (-not (Test-Path -LiteralPath $inputFull -PathType Leaf)) {
  throw "Input dump not found."
}
if (Test-Path -LiteralPath $outputFull) {
  throw "Output already exists; refusing to overwrite it."
}

$dropColumns = @("lifecycle_configuration", "lifecycle_configuration_generation")
$utf8NoBom = [Text.UTF8Encoding]::new($false)
$reader = [IO.StreamReader]::new($inputFull, $utf8NoBom, $true)
$writer = [IO.StreamWriter]::new($outputFull, $false, $utf8NoBom)
$writer.NewLine = "`n"

$insideBuckets = $false
$transformedHeader = $false
$bucketRows = 0

try {
  while (($line = $reader.ReadLine()) -ne $null) {
    if (-not $insideBuckets -and $line -match '^COPY "storage"\."buckets" \((.+)\) FROM stdin;$') {
      $columnTokens = @($Matches[1].Split(",") | ForEach-Object { $_.Trim() })
      $columnNames = @($columnTokens | ForEach-Object { $_.Trim('"') })
      $dropIndexes = @($dropColumns | ForEach-Object {
        $index = [Array]::IndexOf($columnNames, $_)
        if ($index -lt 0) { throw "Expected nullable compatibility column is missing: $_" }
        $index
      })
      $keptTokens = for ($i = 0; $i -lt $columnTokens.Count; $i++) {
        if ($dropIndexes -notcontains $i) { $columnTokens[$i] }
      }
      $writer.WriteLine(('COPY "storage"."buckets" ({0}) FROM stdin;' -f ($keptTokens -join ", ")))
      $insideBuckets = $true
      $transformedHeader = $true
      continue
    }

    if ($insideBuckets) {
      if ($line -eq "\.") {
        $writer.WriteLine($line)
        $insideBuckets = $false
        continue
      }

      $values = @($line.Split("`t"))
      if ($values.Count -ne $columnTokens.Count) {
        throw "Unexpected storage.buckets COPY field count."
      }
      foreach ($index in $dropIndexes) {
        if ($values[$index] -ne "\N") {
          throw "Refusing lossy transform: $($columnNames[$index]) contains a non-null value."
        }
      }
      $keptValues = for ($i = 0; $i -lt $values.Count; $i++) {
        if ($dropIndexes -notcontains $i) { $values[$i] }
      }
      $writer.WriteLine(($keptValues -join "`t"))
      $bucketRows++
      continue
    }

    $writer.WriteLine($line)
  }
} catch {
  $writer.Dispose()
  $reader.Dispose()
  if (Test-Path -LiteralPath $outputFull) {
    Remove-Item -LiteralPath $outputFull -Force
  }
  throw
} finally {
  $writer.Dispose()
  $reader.Dispose()
}

if (-not $transformedHeader) {
  if (Test-Path -LiteralPath $outputFull) {
    Remove-Item -LiteralPath $outputFull -Force
  }
  throw "storage.buckets COPY block was not found."
}

$inputHash = (Get-FileHash -LiteralPath $inputFull -Algorithm SHA256).Hash.ToLowerInvariant()
$outputHash = (Get-FileHash -LiteralPath $outputFull -Algorithm SHA256).Hash.ToLowerInvariant()

[pscustomobject]@{
  Status = "PASS"
  Transformation = "DROP_NULL_ONLY_UNSUPPORTED_STORAGE_BUCKET_LIFECYCLE_COLUMNS"
  BucketRowsValidated = $bucketRows
  DroppedColumns = $dropColumns
  InputSha256 = $inputHash
  OutputSha256 = $outputHash
  OutputPath = $outputFull
} | ConvertTo-Json -Depth 3
