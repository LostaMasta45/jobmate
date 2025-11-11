@echo off
echo ========================================
echo   SETUP WINDOWS FIREWALL - JOBMATE
echo ========================================
echo.
echo This will add firewall rules to allow:
echo   - Port 3000 (npm dev)
echo   - Port 3002 (alternative)
echo   - Port 3005 (Docker)
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] This script must be run as Administrator!
    echo.
    echo Right-click this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo [*] Adding firewall rules for ports 3000, 3002, and 3005...
echo.

netsh advfirewall firewall add rule name="JobMate Dev Server Port 3000" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="JobMate Dev Server Port 3002" dir=in action=allow protocol=TCP localport=3002
netsh advfirewall firewall add rule name="JobMate Docker Port 3005" dir=in action=allow protocol=TCP localport=3005

if %errorLevel% equ 0 (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo Firewall rules added successfully!
    echo Ports 3000, 3002, and 3005 are now accessible from network.
    echo.
    echo Your local IP: 192.168.1.4
    echo.
    echo Access from mobile (same WiFi):
    echo   npm dev:    http://192.168.1.4:3000
    echo   alternative: http://192.168.1.4:3002
    echo   Docker:     http://192.168.1.4:3005
    echo.
    echo Next step: Open URL on mobile browser!
    echo.
) else (
    echo.
    echo [ERROR] Failed to add firewall rule!
    echo.
)

pause
