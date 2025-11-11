@echo off
title NGROK - JobMate Only (Port 3005)
color 0A

echo.
echo ========================================================
echo    NGROK TUNNEL - JobMate ONLY
echo ========================================================
echo.
echo   Project:   JobMate
echo   Port:      3005 (Docker)
echo   Region:    Asia Pacific (ap)
echo.
echo   Note: This will NOT affect Absensi tunnel
echo         (if it's running on different port)
echo.
echo ========================================================
echo.

REM Check if Docker is running
docker ps --filter "name=jobmate-dev" | findstr "jobmate-dev" >nul
if %errorlevel% neq 0 (
    echo [WARNING] Docker container not detected!
    echo.
    echo Make sure JobMate Docker is running:
    echo   docker-compose -f docker-compose.dev.yml up -d
    echo.
    echo Continue anyway? (Y/N)
    choice /c YN /n
    if errorlevel 2 exit /b 1
    echo.
)

echo [OK] Starting ngrok tunnel...
echo.
echo ========================================================
echo   COPY THE HTTPS URL BELOW
echo ========================================================
echo.
echo   Example: https://xxxx-xxxx-xxxx.ngrok-free.dev
echo.
echo   Then open on mobile:
echo   https://YOUR-URL.ngrok-free.dev/dashboard
echo.
echo   Press Ctrl+C to stop
echo.
echo ========================================================
echo.

REM Start ngrok with proper headers for Docker
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005
