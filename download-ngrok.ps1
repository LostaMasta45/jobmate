# Download and Install ngrok for Docker
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   DOWNLOADING NGROK FOR DOCKER" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Create ngrok directory
$ngrokDir = "C:\ngrok"
if (!(Test-Path $ngrokDir)) {
    Write-Host "[1/5] Creating ngrok directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $ngrokDir -Force | Out-Null
    Write-Host "[OK] Directory created: $ngrokDir" -ForegroundColor Green
} else {
    Write-Host "[1/5] ngrok directory exists: $ngrokDir" -ForegroundColor Green
}
Write-Host ""

# Download ngrok
$ngrokUrl = "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip"
$zipPath = "$ngrokDir\ngrok.zip"
$ngrokExe = "$ngrokDir\ngrok.exe"

if (Test-Path $ngrokExe) {
    Write-Host "[2/5] ngrok.exe already exists!" -ForegroundColor Green
    Write-Host "      Path: $ngrokExe" -ForegroundColor Gray
} else {
    Write-Host "[2/5] Downloading ngrok..." -ForegroundColor Yellow
    Write-Host "      URL: $ngrokUrl" -ForegroundColor Gray
    try {
        Invoke-WebRequest -Uri $ngrokUrl -OutFile $zipPath -UseBasicParsing
        Write-Host "[OK] Downloaded successfully!" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Failed to download ngrok!" -ForegroundColor Red
        Write-Host "Please download manually from: https://ngrok.com/download" -ForegroundColor Yellow
        pause
        exit 1
    }
}
Write-Host ""

# Extract ngrok
if (!(Test-Path $ngrokExe) -and (Test-Path $zipPath)) {
    Write-Host "[3/5] Extracting ngrok..." -ForegroundColor Yellow
    try {
        Expand-Archive -Path $zipPath -DestinationPath $ngrokDir -Force
        Remove-Item $zipPath -Force
        Write-Host "[OK] Extracted successfully!" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Failed to extract ngrok!" -ForegroundColor Red
        pause
        exit 1
    }
} else {
    Write-Host "[3/5] ngrok.exe ready!" -ForegroundColor Green
}
Write-Host ""

# Add to PATH
Write-Host "[4/5] Adding to PATH..." -ForegroundColor Yellow
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$ngrokDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$ngrokDir", "User")
    $env:Path += ";$ngrokDir"
    Write-Host "[OK] Added to PATH!" -ForegroundColor Green
    Write-Host "      Please close and reopen terminal for changes to take effect" -ForegroundColor Yellow
} else {
    Write-Host "[OK] Already in PATH!" -ForegroundColor Green
}
Write-Host ""

# Configure auth token
Write-Host "[5/5] Configuring auth token..." -ForegroundColor Yellow
try {
    & "$ngrokExe" config add-authtoken 35957gQwXEP2kQ5JF7oJkck9g1v_5smGm46UxdDMfNho4cJ7x 2>&1 | Out-Null
    Write-Host "[OK] Auth token configured!" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] Run manually: ngrok config add-authtoken <token>" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   INSTALLATION COMPLETE!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "ngrok Location:" -ForegroundColor Yellow
Write-Host "  $ngrokExe" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Close this terminal" -ForegroundColor White
Write-Host "  2. Open NEW terminal" -ForegroundColor White
Write-Host "  3. Run: .\setup-ngrok-docker.bat" -ForegroundColor White
Write-Host ""
Write-Host "Or run directly:" -ForegroundColor Yellow
Write-Host "  ngrok http 3005 --region=us --host-header=localhost:3005" -ForegroundColor White
Write-Host ""
Write-Host "Test installation:" -ForegroundColor Yellow
Write-Host "  ngrok version" -ForegroundColor White
Write-Host ""
pause
