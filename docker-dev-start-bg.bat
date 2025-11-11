@echo off
REM ==============================================================================
REM DOCKER DEVELOPMENT MODE - START IN BACKGROUND
REM ==============================================================================

echo.
echo ========================================
echo   JOBMATE - DEVELOPMENT MODE
echo   (Background Mode)
echo ========================================
echo.

REM Cek Docker Desktop running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Desktop tidak running!
    echo.
    pause
    exit /b 1
)

echo [OK] Docker Desktop running
echo.

REM Build jika perlu
echo Building image...
docker-compose -f docker-compose.dev.yml build

if errorlevel 1 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo Starting container in background...
docker-compose -f docker-compose.dev.yml up -d

if errorlevel 1 (
    echo [ERROR] Start failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Development Server Running!
echo ========================================
echo.
echo Access aplikasi:
echo   http://localhost:3005
echo.
echo Tips:
echo   - Edit code di VSCode
echo   - Save file (Ctrl+S)
echo   - Browser auto refresh (2-3 detik)
echo.
echo Lihat logs:
echo   docker-compose -f docker-compose.dev.yml logs -f
echo.
echo Stop server:
echo   docker-compose -f docker-compose.dev.yml down
echo   atau run: docker-dev-stop.bat
echo.

timeout /t 5 /nobreak >nul
docker-compose -f docker-compose.dev.yml ps

echo.
pause
