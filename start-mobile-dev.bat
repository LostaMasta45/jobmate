@echo off
echo ========================================
echo   VIP Career - Mobile Development Mode
echo ========================================
echo.

REM Get IP Address
echo [1/3] Mencari IP Address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    set IP=%%a
)
set IP=%IP:~1%
echo     IP Address: %IP%
echo.

REM Check if port 3000 is available
echo [2/3] Checking port availability...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo     Port 3000 sedang digunakan, Next.js akan cari port lain
) else (
    echo     Port 3000 tersedia
)
echo.

REM Start development server
echo [3/3] Starting development server...
echo.
echo ========================================
echo   AKSES DARI HP:
echo   http://%IP%:3000
echo ========================================
echo.
echo Tekan Ctrl+C untuk stop server
echo.

npm run dev

pause
