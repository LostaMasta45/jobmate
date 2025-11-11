@echo off
REM ==============================================================================
REM DOCKER REBUILD SCRIPT - Rebuild setelah code changes
REM ==============================================================================

echo.
echo ========================================
echo   JOBMATE DOCKER REBUILDER
echo ========================================
echo.

echo Step 1: Stopping container...
docker-compose down

echo.
echo Step 2: Rebuilding image...
echo (Ini bisa займать 3-5 menit)
echo.

docker-compose build --no-cache

if errorlevel 1 (
    echo.
    echo [ERROR] Build failed!
    echo Cek error message di atas
    echo.
    pause
    exit /b 1
)

echo.
echo Step 3: Starting container...
docker-compose up -d

if errorlevel 1 (
    echo.
    echo [ERROR] Gagal start container!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Rebuild SUCCESS!
echo ========================================
echo.
echo Aplikasi bisa diakses di:
echo   http://localhost:3000
echo.
echo Tunggu 10-20 detik untuk aplikasi fully start
echo.
pause
