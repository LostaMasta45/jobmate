@echo off
echo ========================================
echo   JOBMATE - MOBILE ACCESS DEV SERVER
echo ========================================
echo.
echo Starting Next.js dev server with network access...
echo Server akan bisa diakses dari HP/tablet di jaringan yang sama
echo.

REM Get IP Address
echo Checking your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found
)

:found
REM Trim spaces
for /f "tokens=* delims= " %%a in ("%IP%") do set IP=%%a

echo.
echo ========================================
echo   SERVER INFO
echo ========================================
echo.
echo [*] Server starting at: http://0.0.0.0:3002
echo [*] Local access: http://localhost:3002
echo.
echo [MOBILE ACCESS] Buka di HP Anda:
echo.
echo     http://%IP%:3002
echo.
echo ========================================
echo.
echo Pastikan HP dan laptop di WiFi yang sama!
echo.
echo Tekan Ctrl+C untuk stop server
echo.
echo ========================================
echo.

npm run dev:mobile
