@echo off
REM Test OTP Email Sending - Windows CMD Version
REM Run this to test if OTP emails are working

echo.
echo ============================================
echo   OTP Email Test Script
echo ============================================
echo.

REM Check if curl is available
where curl >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] curl is not installed or not in PATH
    echo.
    echo Please install curl or use test-otp.ps1 in PowerShell
    pause
    exit /b 1
)

set /p EMAIL="Enter email address (or press Enter for default): "
if "%EMAIL%"=="" set EMAIL=sufyaanahmadx9x@gmail.com

echo.
echo [INFO] Sending OTP to: %EMAIL%
echo [INFO] Please wait...
echo.

REM Send POST request using curl
curl -X POST http://localhost:5001/api/v1/send-otp ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"%EMAIL%\"}" ^
  -w "\n\nHTTP Status Code: %%{http_code}\n" ^
  -s -S

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo   SUCCESS! Check your email inbox
    echo ============================================
    echo.
    echo Check: %EMAIL%
    echo Also check spam/junk folder
) else (
    echo.
    echo ============================================
    echo   FAILED! Check backend server logs
    echo ============================================
    echo.
    echo Troubleshooting:
    echo 1. Make sure backend server is running: npm run dev
    echo 2. Check terminal for error messages
    echo 3. Run: node test-smtp.js
)

echo.
pause
