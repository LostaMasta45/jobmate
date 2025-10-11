@echo off
echo ===============================================
echo Testing Chrome DevTools MCP with Verbose Logs
echo ===============================================
echo.
echo Starting MCP server with debug logs...
echo This will show detailed information about what's happening
echo.

set DEBUG=*
npx chrome-devtools-mcp@latest "Open https://google.com and take a screenshot"

pause
