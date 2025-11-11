@echo off
echo.
echo ========================================
echo   MOBILE ACCESS URL
echo ========================================
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address" ^| findstr "192.168"') do (
    set IP=%%a
    goto :found
)

:found
for /f "tokens=* delims= " %%a in ("%IP%") do set IP=%%a

echo [MOBILE ACCESS] Buka di HP Anda:
echo.
echo     http://%IP%:3000
echo.
echo ========================================
echo.
echo Pastikan HP dan laptop di WiFi yang sama!
echo.
