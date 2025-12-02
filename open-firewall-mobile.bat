@echo off
echo ============================================
echo Opening Firewall for Mobile Access (Port 3005)
echo ============================================
echo.

:: Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Please run as Administrator!
    echo Right-click this file and select "Run as administrator"
    pause
    exit /b 1
)

:: Add firewall rule
netsh advfirewall firewall add rule name="Docker Dev Port 3005" dir=in action=allow protocol=tcp localport=3005

echo.
echo ============================================
echo SUCCESS! Firewall opened for port 3005
echo.
echo Access from your phone:
echo   http://192.168.1.12:3005
echo.
echo Make sure Docker is running:
echo   docker-compose -f docker-compose.dev.yml up -d
echo ============================================
pause
