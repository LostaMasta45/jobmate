@echo off
echo ==========================================
echo Starting Chrome with Remote Debugging
echo ==========================================
echo.
echo Chrome akan terbuka dengan debugging port 9222
echo Instance ini terpisah dari Chrome biasa Anda
echo.

REM Buat folder temp jika belum ada
if not exist "C:\temp" mkdir "C:\temp"

REM Start Chrome dengan debugging
start chrome --remote-debugging-port=9222 --user-data-dir="C:\temp\chrome-debug-profile"

echo.
echo Chrome debugging instance sudah berjalan!
echo Sekarang Anda bisa test MCP Chrome DevTools
echo.
pause
