# 🚨 SMTP Connection Timeout - Complete Fix Guide

## Current Issue: Connection timeout to smtp.gmail.com:587

### Quick Diagnosis Checklist

Run these checks **in order**:

## ✅ Step 1: Verify Gmail App Password

Your current credentials:
- Email: `sufyaanahmadx9x@gmail.com`
- Password: `zimtxsvxcnurfggp` (App Password format looks correct)

**Test if App Password is valid:**

1. Go to https://myaccount.google.com/apppasswords
2. Check if the App Password `zimtxsvxcnurfggp` exists
3. If not, generate a NEW App Password:
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password (remove spaces)
   - Update `.env` with: `MAIL_PASS=xxxxxxxxxXxxxxxx`

---

## ✅ Step 2: Check Windows Firewall

Windows may be blocking SMTP ports. **Run as Administrator**:

```cmd
REM Check if port 465 is accessible
netstat -an | findstr "465"

REM Check if port 587 is accessible  
netstat -an | findstr "587"

REM Test connection to Gmail SMTP (should return "Connected")
telnet smtp.gmail.com 465
REM Press Ctrl+] then type "quit" and press Enter to exit

REM If telnet is not installed, enable it:
dism /online /Enable-Feature /FeatureName:TelnetClient
```

**If connection fails:**

1. Open **Windows Defender Firewall** > **Advanced Settings**
2. Click **Outbound Rules** > **New Rule**
3. Select **Port** > **TCP** > **465, 587, 25**
4. Select **Allow the connection**
5. Name it "Gmail SMTP Ports" and save

---

## ✅ Step 3: Check Antivirus/Security Software

Many antivirus programs block SMTP ports:

- **Avast/AVG**: Disable "Mail Shield" or add exception
- **Norton**: Disable "Email Protection" or add exception
- **McAfee**: Disable "Email Protection" or add exception
- **Kaspersky**: Disable "Mail Anti-Virus" or add exception

**Temporarily disable** your antivirus and test again.

---

## ✅ Step 4: Check Network/ISP Restrictions

Some ISPs block SMTP ports to prevent spam:

**Test from command line:**
```cmd
REM Install telnet if not available
dism /online /Enable-Feature /FeatureName:TelnetClient

REM Test Gmail SMTP connection
telnet smtp.gmail.com 465

REM If connection refused, your ISP may be blocking it
```

**Solutions if ISP blocks:**
- Use a VPN (temporarily)
- Use mobile hotspot to test
- Switch to port 25 (less likely to be blocked)
- Use alternative email service (SendGrid, Mailgun)

---

## ✅ Step 5: Apply Code Fixes

I've updated your code with multiple fixes. Choose one:

### **Option A: Use Updated mailsender.js (Recommended)**

The main `mailsender.js` has been updated with:
- Port 465 (more reliable)
- Disabled connection pooling
- Increased timeouts (120 seconds)
- Relaxed TLS settings for Windows

**Restart your server:**
```cmd
cd e:\PROJECT\KIT\backend.ai\backend
npm run dev
```

### **Option B: Use Enhanced Fallback Version**

For maximum reliability, use `mailsender-enhanced.js` which tries multiple configurations:

1. Update imports in your controllers:

```javascript
// Change from:
const sendEmail = require('../util/mailsender');

// To:
const sendEmail = require('../util/mailsender-enhanced');
```

2. Restart your server

---

## ✅ Step 6: Test Locally with Simple Script

Create `test-email.js` in backend folder:

```javascript
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
    debug: true,
    logger: true
});

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Connection failed:', error);
    } else {
        console.log('✅ Server is ready to send emails');
        
        // Try sending a test email
        transporter.sendMail({
            from: process.env.MAIL_USER,
            to: process.env.MAIL_USER, // Send to yourself
            subject: 'Test Email',
            text: 'If you receive this, SMTP is working!'
        }, (err, info) => {
            if (err) {
                console.error('❌ Send failed:', err);
            } else {
                console.log('✅ Email sent:', info.messageId);
            }
        });
    }
});
```

Run it:
```cmd
node test-email.js
```

---

## ✅ Step 7: Alternative Solutions

If Gmail continues to fail, consider these alternatives:

### **Option 1: Use Ethereal Email (Testing Only)**

```javascript
// Auto-generates a test account
const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: testAccount.user,
        pass: testAccount.pass
    }
});

// After sending, get preview URL
console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
```

### **Option 2: Use SendGrid (Production)**

1. Sign up at https://sendgrid.com (Free: 100 emails/day)
2. Get API key
3. Update `.env`:
```env
SENDGRID_API_KEY=your_api_key_here
```

4. Install: `npm install @sendgrid/mail`

5. Update `mailsender.js`:
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, subject, html) => {
    const msg = {
        to: email,
        from: process.env.MAIL_USER,
        subject: subject,
        html: html,
    };
    return await sgMail.send(msg);
};
```

### **Option 3: Use Outlook/Hotmail SMTP**

```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: 'your-email@outlook.com',
        pass: 'your-password'
    },
    tls: {
        ciphers: 'SSLv3'
    }
});
```

---

## 🔧 Quick Command Reference

```cmd
REM 1. Test DNS resolution
nslookup smtp.gmail.com

REM 2. Test connection to Gmail SMTP
telnet smtp.gmail.com 465
telnet smtp.gmail.com 587

REM 3. Check if port is in use locally
netstat -ano | findstr "465"
netstat -ano | findstr "587"

REM 4. Flush DNS cache
ipconfig /flushdns

REM 5. Check route to Gmail
tracert smtp.gmail.com

REM 6. Test with curl (if installed)
curl -v telnet://smtp.gmail.com:465
```

---

## 📊 Expected Successful Output

When working correctly, you should see:

```
📧 Initializing SMTP with config: {
  environment: 'DEVELOPMENT',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  user: 'sufyaanahmadx9x@gmail.com',
  passLength: 16,
  poolEnabled: false
}
✅ SMTP server is ready to send emails

OTP instance created: { ... }
📧 Attempting to send email to: test@example.com
   Subject: Verify Your Email - AI DocuSpehere

🔄 Trying configuration: Gmail Port 465 (SSL)
   Attempt 1/2...
✅ Email sent successfully using Gmail Port 465 (SSL): {
  messageId: '<...@gmail.com>',
  to: 'test@example.com',
  response: '250 2.0.0 OK ...'
}
```

---

## 🆘 Still Not Working?

### Last Resort Checklist:

1. ☑️ Gmail 2-Step Verification is **enabled**
2. ☑️ App Password is **freshly generated** (not reused)
3. ☑️ No spaces in App Password in `.env`
4. ☑️ Windows Firewall allows ports **465, 587, 25**
5. ☑️ Antivirus is **disabled** or has exceptions
6. ☑️ Not behind corporate firewall/proxy
7. ☑️ `telnet smtp.gmail.com 465` **connects successfully**
8. ☑️ Tried on **mobile hotspot** (to rule out ISP blocking)

### Get More Help:

1. **Share your logs**: Run with `DEBUG=nodemailer* node index.js`
2. **Check Gmail settings**: https://mail.google.com/mail/u/0/#settings/fwdandpop
   - Ensure IMAP/POP is enabled
3. **Try different email**: Test with a fresh Gmail account
4. **Contact ISP**: Ask if they block SMTP ports

---

## 📝 Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `ETIMEDOUT` | Connection timeout | Check firewall, antivirus, ISP blocking |
| `ECONNREFUSED` | Connection refused | Port blocked or wrong port |
| `EAUTH` | Authentication failed | Wrong credentials, enable 2FA, new App Password |
| `ESOCKET` | Socket error | Network issue, try different port |
| `ENOTFOUND` | DNS resolution failed | Check DNS settings, flush DNS |

---

**Last Updated:** November 5, 2025  
**Your Setup:** Windows + Node.js + Gmail SMTP  
**Current Issue:** Connection timeout on port 587
