@echo off
REM Test Create Invoice API with Email Notification
echo ========================================
echo Testing Create Invoice API
echo ========================================
echo.

curl -X POST http://localhost:3000/api/payment/create-invoice ^
  -H "Content-Type: application/json" ^
  -d "{\"plan\":\"basic\",\"email\":\"reza.nur.h45@gmail.com\",\"fullName\":\"Test User\",\"whatsapp\":\"08123456789\"}"

echo.
echo ========================================
echo Test completed! Check:
echo 1. Terminal logs for email sending status
echo 2. Your inbox for invoice email
echo ========================================
pause
