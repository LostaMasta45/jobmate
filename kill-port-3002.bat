@echo off
echo Killing all processes on port 3002...

:: Method 1: Using PowerShell
powershell -Command "Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host 'Killing process:' $_.OwningProcess; Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Method 2: Fallback using netstat and taskkill
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    echo Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Port 3002 is now free!
echo.
pause
