$ErrorActionPreference = "Stop"

# Build
Write-Host "Building AutoLUT..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }

# Copy to GitHub Pages repo
$target = "C:\Users\GVal9\GVal98.github.io\autoLUT"
Write-Host "Deploying to $target..." -ForegroundColor Cyan

if (Test-Path $target) { Remove-Item "$target\*" -Recurse -Force }
else { New-Item -ItemType Directory -Path $target | Out-Null }

Copy-Item -Path "dist\*" -Destination $target -Recurse -Force

# Commit and push
Push-Location "C:\Users\GVal9\GVal98.github.io"
git add -A
git commit -m "update AutoLUT"
git push
Pop-Location

Write-Host "Deployed successfully!" -ForegroundColor Green
