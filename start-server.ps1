$env:PORT = "3014"
Set-Location "C:\Users\adham\.gemini\antigravity\scratch\panggil-app"

# Ensure standalone has .next/static and public assets for proper styling
$staticTarget = ".next\standalone\.next\static"
$publicTarget = ".next\standalone\public"

if (Test-Path ".next\static") {
    if (-not (Test-Path $staticTarget)) { New-Item -ItemType Directory -Path $staticTarget -Force | Out-Null }
    Copy-Item -Recurse -Force ".next\static\*" $staticTarget
}
if (Test-Path "public") {
    if (-not (Test-Path $publicTarget)) { New-Item -ItemType Directory -Path $publicTarget -Force | Out-Null }
    Copy-Item -Recurse -Force "public\*" $publicTarget
}

node .next\standalone\server.js
