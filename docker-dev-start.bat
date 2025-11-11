@echo off
REM ==============================================================================
REM DOCKER DEVELOPMENT MODE - START SCRIPT
REM ==============================================================================

echo.
echo ========================================
echo   JOBMATE - DEVELOPMENT MODE
echo   (with Hot Reload)
echo ========================================
echo.

REM Cek Docker Desktop running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Desktop tidak running!
    echo.
    echo Solusi:
    echo 1. Buka Docker Desktop dari Start Menu
    echo 2. Tunggu sampai icon Docker warna hijau
    echo 3. Jalankan script ini lagi
    echo.
    pause
    exit /b 1
)

echo [OK] Docker Desktop running
echo.

REM Cek file .env atau .env.local
if exist .env.local (
    echo [OK] File .env.local ditemukan
) else if exist .env (
    echo [OK] File .env ditemukan
) else (
    echo [WARNING] File .env tidak ditemukan!
    echo.
    echo Development mode tetap bisa jalan,
    echo tapi koneksi ke Supabase/API mungkin error
    echo.
)

echo.
echo ========================================
echo   Building Development Image...
echo ========================================
echo.
echo (First time: 2-3 menit)
echo (Next time: Instant jika no changes)
echo.

docker-compose -f docker-compose.dev.yml build

if errorlevel 1 (
    echo.
    echo [ERROR] Build failed!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Starting Development Server...
echo ========================================
echo.

docker-compose -f docker-compose.dev.yml up

REM Note: Script akan stay di sini sampai Ctrl+C
REM Logs akan stream real-time

echo.
echo Container stopped.
echo.
pause
