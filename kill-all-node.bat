@echo off
echo ================================
echo  KILL ALL NODE PROCESSES
echo ================================
echo.

echo Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul

timeout /t 2 /nobreak >nul

echo.
echo Checking if any Node processes still running...
tasklist | findstr /I "node.exe"

if errorlevel 1 (
    echo.
    echo [SUCCESS] All Node.js processes stopped!
) else (
    echo.
    echo [WARNING] Some Node processes still running. Try again.
)

echo.
echo ================================
echo Checking ports 3000, 3001, 3002...
echo ================================
netstat -ano | findstr ":3000 :3001 :3002"

if errorlevel 1 (
    echo.
    echo [SUCCESS] All ports are FREE!
) else (
    echo.
    echo [INFO] Ports still in use (may take a moment to release)
)

echo.
pause
