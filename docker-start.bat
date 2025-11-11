@echo off
REM ==============================================================================
REM DOCKER START SCRIPT - Mudahkan Start Docker Container
REM ==============================================================================

echo.
echo ========================================
echo   JOBMATE DOCKER STARTER
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
if exist .env (
    echo [OK] File .env ditemukan
) else if exist .env.local (
    echo [OK] File .env.local ditemukan
) else (
    echo [WARNING] File .env tidak ditemukan!
    echo.
    echo Solusi:
    echo 1. Copy .env.local atau .env.docker.example
    echo 2. Rename jadi .env
    echo 3. Isi semua API keys
    echo.
    choice /C YN /M "Lanjut tanpa .env (mungkin error)"
    if errorlevel 2 exit /b 1
)

echo.
echo ========================================
echo   Starting Docker Container...
echo ========================================
echo.

docker-compose up -d

if errorlevel 1 (
    echo.
    echo [ERROR] Gagal start container!
    echo.
    echo Troubleshooting:
    echo 1. Cek logs: docker-compose logs
    echo 2. Rebuild: docker-compose build --no-cache
    echo 3. Baca DOCKER_SETUP_GUIDE.md
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Container is running
echo ========================================
echo.
echo Aplikasi bisa diakses di:
echo   http://localhost:3000
echo.
echo Command berguna:
echo   Lihat logs:    docker-compose logs -f
echo   Stop:          docker-compose down
echo   Restart:       docker-compose restart
echo   Status:        docker-compose ps
echo.

REM Tunggu sebentar dan cek health
timeout /t 5 /nobreak >nul

docker-compose ps

echo.
echo Tunggu 10-20 detik untuk aplikasi fully start
echo Lalu buka: http://localhost:3000
echo.
pause
