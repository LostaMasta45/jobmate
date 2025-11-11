@echo off
REM ==============================================================================
REM DOCKER STOP SCRIPT - Mudahkan Stop Docker Container
REM ==============================================================================

echo.
echo ========================================
echo   JOBMATE DOCKER STOPPER
echo ========================================
echo.

docker-compose down

if errorlevel 1 (
    echo.
    echo [ERROR] Gagal stop container!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Container stopped successfully
echo ========================================
echo.
pause
