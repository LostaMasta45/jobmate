@echo off
title NGROK - Run Both Absensi & JobMate
color 0B

echo.
echo ========================================================
echo    NGROK MULTIPLE TUNNELS - Absensi + JobMate
echo ========================================================
echo.
echo   This will start 2 separate tunnels:
echo.
echo   1. Absensi:  Port 3001
echo   2. JobMate:  Port 3005 (Docker)
echo.
echo ========================================================
echo.

REM Check ngrok installation
if not exist "C:\ngrok\ngrok.exe" (
    echo [ERROR] ngrok not found at C:\ngrok\ngrok.exe
    echo.
    echo Please install ngrok first:
    echo   setup-ngrok-docker.bat
    echo.
    pause
    exit /b 1
)

echo [INFO] Starting tunnels in separate windows...
echo.

REM Start Absensi tunnel in new window
echo [1/2] Starting Absensi tunnel (port 3001)...
start "ngrok - Absensi (3001)" /min C:\ngrok\ngrok.exe http 3001 --region=ap

timeout /t 2 >nul

REM Start JobMate tunnel in new window
echo [2/2] Starting JobMate tunnel (port 3005)...
start "ngrok - JobMate (3005)" C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005

echo.
echo ========================================================
echo   SUCCESS! Both tunnels starting...
echo ========================================================
echo.
echo   Check the tunnel windows for URLs:
echo.
echo   Window 1: Absensi tunnel
echo   Window 2: JobMate tunnel (THIS ONE!)
echo.
echo   ngrok Web UI: http://localhost:4040
echo.
echo   To stop: Close each tunnel window (Ctrl+C)
echo.
echo ========================================================
echo.
echo Press any key to open ngrok web interface...
pause >nul

start http://localhost:4040
