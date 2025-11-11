@echo off
echo ================================
echo  CLEAN START - Kill All Nodes
echo ================================
echo.

echo Step 1: Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul

timeout /t 3 /nobreak >nul

echo.
echo Step 2: Verifying ports are free...
netstat -ano | findstr ":3000 :3001 :3002"

if errorlevel 1 (
    echo [SUCCESS] All ports are FREE!
) else (
    echo [WARNING] Some ports still in use, waiting...
    timeout /t 3 /nobreak >nul
)

echo.
echo ================================
echo Ready to start fresh!
echo ================================
echo.
echo Now you can run:
echo   - VSCode 1: npm run dev:3000
echo   - VSCode 2: npm run dev:mobile (port 3002)
echo.
pause
