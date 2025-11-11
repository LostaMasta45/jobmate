@echo off
REM ==============================================================================
REM DOCKER DEVELOPMENT MODE - VIEW LOGS
REM ==============================================================================

echo.
echo ========================================
echo   JOBMATE - Development Logs
echo ========================================
echo.
echo Press Ctrl+C to stop watching logs
echo.
echo.

docker-compose -f docker-compose.dev.yml logs -f --tail=100
