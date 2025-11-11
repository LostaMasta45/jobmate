@echo off
REM ==============================================================================
REM DOCKER LOGS SCRIPT - Lihat logs real-time
REM ==============================================================================

echo.
echo ========================================
echo   JOBMATE DOCKER LOGS
echo ========================================
echo.
echo Press Ctrl+C to stop watching logs
echo.
echo.

docker-compose logs -f --tail=100
