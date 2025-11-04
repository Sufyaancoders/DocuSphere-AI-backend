# Test OTP Email Sending
# Run this script to test if OTP emails are working

Write-Host "🧪 Testing OTP Email Sending..." -ForegroundColor Cyan
Write-Host ""

# Get email from user
$email = Read-Host "Enter email address to test (or press Enter for default: sufyaanahmadx9x@gmail.com)"
if ([string]::IsNullOrWhiteSpace($email)) {
    $email = "sufyaanahmadx9x@gmail.com"
}

Write-Host ""
Write-Host "📧 Sending OTP to: $email" -ForegroundColor Yellow
Write-Host "🔄 Please wait..." -ForegroundColor Gray
Write-Host ""

# Create JSON body
$body = @{
    email = $email
} | ConvertTo-Json

# Send POST request
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/v1/send-otp" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host "  Success: $($response.success)" -ForegroundColor White
    Write-Host "  Message: $($response.message)" -ForegroundColor White
    Write-Host ""
    Write-Host "📬 Check your email inbox: $email" -ForegroundColor Yellow
    Write-Host "   (Also check spam/junk folder)" -ForegroundColor Gray
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorMessage = $_.Exception.Message
    
    Write-Host "❌ FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error Details:" -ForegroundColor Red
    Write-Host "  Status Code: $statusCode" -ForegroundColor White
    Write-Host "  Message: $errorMessage" -ForegroundColor White
    
    if ($statusCode -eq 400) {
        Write-Host ""
        Write-Host "⚠️  Possible Causes:" -ForegroundColor Yellow
        Write-Host "   - User already exists with this email" -ForegroundColor Gray
        Write-Host "   - Invalid email format" -ForegroundColor Gray
    } elseif ($statusCode -eq 500) {
        Write-Host ""
        Write-Host "⚠️  Possible Causes:" -ForegroundColor Yellow
        Write-Host "   - SMTP connection issue" -ForegroundColor Gray
        Write-Host "   - Database connection issue" -ForegroundColor Gray
        Write-Host "   - Server error - check backend logs" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Cyan
    Write-Host "   1. Make sure backend server is running (npm run dev)" -ForegroundColor Gray
    Write-Host "   2. Check backend terminal for detailed error logs" -ForegroundColor Gray
    Write-Host "   3. Run: node test-smtp.js to test SMTP connection" -ForegroundColor Gray
    Write-Host "   4. Check SMTP_FIXED_SUMMARY.md for more info" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
