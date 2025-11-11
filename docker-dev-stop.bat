@echo off
REM ==============================================================================
REM DOCKER DEVELOPMENT MODE - STOP SCRIPT
REM ==============================================================================

echo.
echo ========================================
echo   Stopping Development Server...
echo ========================================
echo.

docker-compose -f docker-compose.dev.yml down

if errorlevel 1 (
    echo [ERROR] Stop failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Development server stopped
echo ========================================
echo.
pause
