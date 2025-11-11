@echo off
echo ============================================
echo   NGROK SETUP FOR DOCKER - PORT 3005
echo ============================================
echo.

REM Check if ngrok exists
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] ngrok not found!
    echo.
    echo Please download ngrok:
    echo 1. Visit: https://ngrok.com/download
    echo 2. Download Windows (64-bit)
    echo 3. Extract to C:\ngrok\ngrok.exe
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo [1/3] Configuring ngrok auth token...
ngrok config add-authtoken 35957gQwXEP2kQ5JF7oJkck9g1v_5smGm46UxdDMfNho4cJ7x
if %errorlevel% neq 0 (
    echo [ERROR] Failed to set auth token!
    pause
    exit /b 1
)
echo [OK] Auth token configured!
echo.

echo [2/3] Checking Docker container...
docker ps --filter "name=jobmate-dev" | findstr "jobmate-dev" >nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker container not running!
    echo Please start Docker first: docker-compose -f docker-compose.dev.yml up
    pause
    exit /b 1
)
echo [OK] Docker container running!
echo.

echo [3/3] Starting ngrok tunnel for PORT 3005...
echo.
echo ============================================
echo   NGROK TUNNEL ACTIVE - DOCKER INSTANCE
echo ============================================
echo   Local:  http://localhost:3005
echo   Docker: jobmate-dev container
echo   Port:   3005
echo.
echo   Your public URL will appear below:
echo ============================================
echo.
echo Press Ctrl+C to stop ngrok tunnel
echo.

REM Start ngrok with label to differentiate from other instances
ngrok http 3005 --log=stdout --region=us --host-header=localhost:3005

pause
