$ProgressPreference = 'SilentlyContinue'
$base = "C:\Users\adham\.gemini\antigravity\scratch\panggil-app"
$standalone = Join-Path $base ".next\standalone"
$deployDir = Join-Path $base "deploy_package"

Write-Host "Cleaning previous deployment package..."
if (Test-Path $deployDir) { 
    Remove-Item -Recurse -Force $deployDir 
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

Write-Host "Copying standalone build..."
Copy-Item -Recurse -Force (Join-Path $standalone "*") $deployDir

Write-Host "Copying public folder..."
Copy-Item -Recurse -Force (Join-Path $base "public") (Join-Path $deployDir "public")

Write-Host "Copying .next/static folder..."
$staticTarget = Join-Path $deployDir ".next\static"
if (-not (Test-Path $staticTarget)) { 
    New-Item -ItemType Directory -Path $staticTarget -Force | Out-Null 
}
Copy-Item -Recurse -Force (Join-Path $base ".next\static\*") $staticTarget

Write-Host "Creating zip package..."
$zipPath = Join-Path $base "panggil-cpanel-ready.zip"
if (Test-Path $zipPath) { 
    Remove-Item -Force $zipPath 
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($deployDir, $zipPath)

Write-Host "SUCCESS! Deployment package ready:"
Get-Item $zipPath | Select-Object Name, Length
