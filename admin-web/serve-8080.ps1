Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dist = Join-Path $root 'dist'

if (-not (Test-Path $dist)) {
  throw "找不到构建目录：$dist"
}

Set-Location $root
& 'C:\C\python313\python.exe' -m http.server 8080 --bind 127.0.0.1 --directory $dist
