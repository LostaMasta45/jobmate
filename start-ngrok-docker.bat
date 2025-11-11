@echo off
title NGROK TUNNEL - DOCKER INSTANCE (Port 3005)
color 0A

echo.
echo ========================================================
echo    NGROK TUNNEL FOR DOCKER - JOBMATE
echo ========================================================
echo.
echo   Instance:  Docker Dev Server
echo   Port:      3005
echo   Container: jobmate-dev
echo   Auth:      Configured
echo.
echo ========================================================
echo.

REM Check if Docker is running
docker ps --filter "name=jobmate-dev" | findstr "jobmate-dev" >nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker container not running!
    echo.
    echo Please start Docker first:
    echo   docker-compose -f docker-compose.dev.yml up -d
    echo.
    pause
    exit /b 1
)

echo [OK] Docker container is running!
echo.
echo Starting ngrok tunnel...
echo.
echo ========================================================
echo   YOUR PUBLIC URL WILL APPEAR BELOW
echo ========================================================
echo.
echo   Copy the HTTPS URL and open on your mobile device
echo   Example: https://xxxx-xx-xx-xx.ngrok-free.app
echo.
echo   Then navigate to: /dashboard
echo.
echo   Press Ctrl+C to stop the tunnel
echo.
echo ========================================================
echo.

REM Start ngrok with proper headers for Docker
C:\ngrok\ngrok.exe http 3005 --region=us --host-header=localhost:3005 --log=stdout
