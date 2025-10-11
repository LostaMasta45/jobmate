@echo off
echo ========================================
echo Update MCP Native Messaging Manifest
echo ========================================
echo.

set /p EXT_ID="Paste Extension ID Anda (dari chrome://extensions/): "

if "%EXT_ID%"=="" (
    echo Error: Extension ID tidak boleh kosong!
    pause
    exit /b 1
)

echo.
echo Extension ID: %EXT_ID%
echo.
echo Membuat backup manifest...

set MANIFEST_PATH=%APPDATA%\Google\Chrome\NativeMessagingHosts\com.chromemcp.nativehost.json
set BACKUP_PATH=%APPDATA%\Google\Chrome\NativeMessagingHosts\com.chromemcp.nativehost.json.backup

copy "%MANIFEST_PATH%" "%BACKUP_PATH%" >nul 2>&1

echo Menulis manifest baru...

(
echo {
echo   "name": "com.chromemcp.nativehost",
echo   "description": "Node.js Host for Browser Bridge Extension",
echo   "path": "%APPDATA%\\npm\\node_modules\\mcp-chrome-bridge\\dist\\run_host.bat",
echo   "type": "stdio",
echo   "allowed_origins": [
echo     "chrome-extension://hbdgbgagpkpjffpklnamcljpakneikee/",
echo     "chrome-extension://%EXT_ID%/"
echo   ]
echo }
) > "%MANIFEST_PATH%"

echo.
echo ========================================
echo Berhasil! Manifest telah diupdate.
echo ========================================
echo.
echo Backup disimpan di:
echo %BACKUP_PATH%
echo.
echo PENTING: 
echo 1. Restart Chrome sekarang
echo 2. Buka extension lagi
echo 3. Coba "Connect to Native Host"
echo.
pause
