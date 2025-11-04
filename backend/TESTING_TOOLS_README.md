# 🧪 Email Testing Tools

This folder contains several tools to help you test and troubleshoot email functionality.

---

## 📋 Available Tools

### 1. **test-smtp.js** - SMTP Connection Diagnostic
Tests SMTP connection with multiple configurations to find which one works.

**Usage:**
```bash
node test-smtp.js
```

**What it does:**
- ✅ Tests Port 465 (SSL)
- ✅ Tests Port 587 (STARTTLS)
- ✅ Tests Port 25 (Fallback)
- ✅ Sends a test email to your own inbox
- ✅ Provides configuration recommendations

**Expected Output:**
```
🔍 Testing Gmail SMTP Connection...
✅ SUCCESS! This configuration works!
✅ Test email sent successfully!
```

---

### 2. **test-otp.ps1** - OTP API Test (PowerShell)
Tests the `/api/v1/send-otp` endpoint.

**Usage:**
```powershell
# Right-click → Run with PowerShell
# OR
PowerShell -ExecutionPolicy Bypass -File test-otp.ps1
```

**What it does:**
- 📧 Prompts for email address
- 📤 Sends POST request to `/api/v1/send-otp`
- ✅ Shows success/error response
- 💡 Provides troubleshooting tips

---

### 3. **test-otp.bat** - OTP API Test (CMD)
Same as test-otp.ps1 but for Windows Command Prompt.

**Usage:**
```cmd
# Double-click the file
# OR
test-otp.bat
```

**Requirements:**
- curl must be installed (available in Windows 10+)

---

### 4. **mailsender-enhanced.js** - Enhanced Email Sender
Alternative email sender with fallback configurations.

**Usage:**
```javascript
// Replace in your controllers:
const sendEmail = require('../util/mailsender-enhanced');
```

**Features:**
- 🔄 Tries multiple SMTP configurations automatically
- ⚡ Automatically retries on failure
- 📊 Detailed logging for debugging

**When to use:**
- Production environments with strict firewalls
- When you need maximum reliability
- When standard mailsender.js fails

---

## 🚀 Quick Testing Workflow

### Step 1: Test SMTP Connection
```bash
node test-smtp.js
```
**Expected:** ✅ Port 465 (SSL) should work

---

### Step 2: Start Backend Server
```bash
npm run dev
```
**Expected:** 
```
✅ SMTP server is ready to send emails
Server is running on port 5001
```

---

### Step 3: Test OTP Endpoint

**Option A: PowerShell**
```powershell
.\test-otp.ps1
```

**Option B: CMD**
```cmd
test-otp.bat
```

**Option C: Curl (Git Bash/WSL)**
```bash
curl -X POST http://localhost:5001/api/v1/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Option D: Postman/Insomnia**
```
POST http://localhost:5001/api/v1/send-otp
Content-Type: application/json

{
  "email": "test@example.com"
}
```

---

### Step 4: Check Email
- 📬 Check your inbox
- 📁 Check spam/junk folder
- ⏱️ Email should arrive within 5-10 seconds

---

## 🔍 Troubleshooting

### Issue: test-smtp.js fails
**Solution:**
1. Check `.env` file has correct `MAIL_USER` and `MAIL_PASS`
2. Verify Gmail App Password is correct
3. Check Windows Firewall settings
4. Temporarily disable antivirus
5. See `SMTP_TIMEOUT_FIX.md` for detailed steps

---

### Issue: OTP test fails with 400 error
**Error:** "User already exists"

**Solution:**
- Use a different email address
- Or delete the user from database first:
```javascript
// In MongoDB
db.users.deleteOne({ email: "test@example.com" })
```

---

### Issue: OTP test fails with 500 error
**Error:** "Failed to send email"

**Solution:**
1. Check backend logs for detailed error
2. Run `node test-smtp.js` to verify SMTP connection
3. Restart backend server: `npm run dev`
4. Check if MongoDB is connected

---

### Issue: Email not received
**Checklist:**
- ✅ Backend logs show "✅ Email sent successfully"
- ✅ Check spam/junk folder
- ✅ Verify email address is correct
- ✅ Try sending to different email provider (Gmail, Outlook, etc.)
- ✅ Check Gmail's "Sent" folder to confirm it was sent

---

## 📊 Expected Successful Flow

### Backend Logs:
```
OTP instance created: {
  email: 'test@example.com',
  otp: '123456',
  ...
}
📧 Sending email to: test@example.com
   Subject: Verify Your Email - AI DocuSpehere
✅ Email sent successfully (attempt 1/3): {
  messageId: '<...@gmail.com>',
  to: 'test@example.com'
}
```

### API Response:
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### Email Received:
- ✅ Subject: "Verify Your Email - AI DocuSpehere"
- ✅ Contains 6-digit OTP code
- ✅ HTML formatted email

---

## 🆘 Still Having Issues?

### 1. Run Full Diagnostic
```bash
node test-smtp.js
```

### 2. Check Configuration Files
```bash
# View current SMTP config
type util\mailsender.js

# View environment variables
type .env
```

### 3. Test Network Connection
```cmd
# Test DNS
nslookup smtp.gmail.com

# Test connection
telnet smtp.gmail.com 465

# Check firewall
netsh advfirewall show allprofiles state
```

### 4. Read Documentation
- `SMTP_FIXED_SUMMARY.md` - Problem and solution summary
- `SMTP_TIMEOUT_FIX.md` - Comprehensive troubleshooting guide
- `EMAIL_SETUP_GUIDE.md` - Gmail setup instructions

---

## 📞 Getting Help

If you're still stuck after trying all the above:

1. **Gather information:**
   - Run `node test-smtp.js` and save output
   - Copy backend server logs
   - Note any error messages

2. **Check documentation:**
   - Read `SMTP_TIMEOUT_FIX.md`
   - Review Gmail App Password setup

3. **Common Solutions:**
   - Regenerate Gmail App Password
   - Check Windows Firewall settings
   - Try using mobile hotspot (to test if ISP blocks SMTP)
   - Consider alternative email service (SendGrid, Mailgun)

---

## 🔒 Security Notes

- ⚠️ Never commit `.env` file to Git
- ⚠️ Never share your Gmail App Password
- ⚠️ Rotate App Passwords every 3-6 months
- ⚠️ Use environment variables for production

---

**Last Updated:** November 5, 2025  
**Project:** DocuSphere-AI Backend  
**Status:** ✅ All tools working
