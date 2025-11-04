# 📧 Email Setup Guide for AI DocuSphere Backend

## Problem: SMTP Connection Timeout on Render/Production

### ✅ What Was Fixed

1. **Changed SMTP port from 587 to 465** - More reliable on production hosting platforms
2. **Added connection pooling** - Reuses connections for better performance
3. **Extended timeout values** - Prevents premature connection timeouts
4. **Added retry logic** - Automatically retries failed emails up to 3 times with exponential backoff
5. **Improved error handling** - Better error messages for debugging
6. **Environment validation** - Checks if credentials are set before attempting connection

---

## 🔧 Required Gmail Setup

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (required for App Passwords)

### Step 2: Generate Gmail App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and your device
3. Click **Generate**
4. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
5. Remove spaces when adding to `.env`: `xxxxXxxxXxxxXxxx`

### Step 3: Update Environment Variables

**Local `.env`:**
```env
MAIL_USER=your-email@gmail.com
MAIL_PASS=your16charapppassword
```

**Render Environment Variables:**
1. Go to your Render dashboard
2. Select your backend service
3. Navigate to **Environment** tab
4. Add/Update:
   - `MAIL_USER` = `your-email@gmail.com`
   - `MAIL_PASS` = `your16charapppassword` (no spaces!)
5. Click **Save Changes** (this will redeploy)

---

## 🚀 Deployment Checklist

### For Render.com:

- [ ] Gmail 2FA is enabled
- [ ] App Password is generated (16 characters, no spaces)
- [ ] `MAIL_USER` is set in Render environment variables
- [ ] `MAIL_PASS` is set in Render environment variables (App Password)
- [ ] `FRONTEND_URL` is set to `https://docu-sphere-ai.vercel.app`
- [ ] Service has been redeployed after env var changes

### Testing:
```bash
# Check logs after deployment
# You should see:
✅ SMTP server is ready to send emails

# If you see error:
❌ SMTP connection error: ...
# Then your credentials are incorrect or 2FA/App Password is not set up
```

---

## 🐛 Troubleshooting

### Error: "Connection timeout" (ETIMEDOUT)
**Solution:**
- Verify you're using **port 465** (not 587)
- Check that `MAIL_PASS` is the **App Password**, not your Gmail password
- Ensure no spaces in the App Password

### Error: "Authentication failed" (EAUTH)
**Solution:**
- Enable 2-Step Verification on your Google account
- Generate a new App Password
- Update `MAIL_PASS` with the new App Password
- Make sure `MAIL_USER` matches the email that generated the App Password

### Error: "SMTP connection error" on startup
**Solution:**
- This is logged but won't crash the server
- The transporter will retry when emails are sent
- Verify credentials and redeploy

### Emails not being received
**Checklist:**
- Check spam/junk folder
- Verify recipient email is correct
- Check Render logs for email send confirmation
- Try sending to a different email provider (Gmail, Outlook, etc.)

---

## 📝 Code Changes Summary

### `util/mailsender.js`
- Changed to port **465** with `secure: true`
- Added **connection pooling** (max 5 connections)
- Increased **timeouts** (60s connection, 60s socket)
- Added **retry logic** with exponential backoff (3 attempts)
- Better **error messages** with specific codes
- **Environment validation** on startup

### `index.js`
- Updated CORS to use `FRONTEND_URL` env var
- Default: `https://docu-sphere-ai.vercel.app`

### `controller/reset_password.js`
- Fixed token generation order
- Updated reset URL to use `FRONTEND_URL` env var
- Default: `https://docu-sphere-ai.vercel.app`

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use App Passwords only** - Never use your main Gmail password
3. **Rotate passwords regularly** - Generate new App Passwords every 3-6 months
4. **Limit App Password scope** - Only grant "Mail" access
5. **Monitor email logs** - Watch for suspicious activity

---

## 📊 Testing Email Functionality

### Test OTP Email:
```bash
curl -X POST https://your-backend.onrender.com/api/v1/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Test Password Reset:
```bash
curl -X POST https://your-backend.onrender.com/api/v1/reset-password-token \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Expected Logs:
```
✅ SMTP server is ready to send emails
📧 Sending email to: test@example.com
   Subject: Verify Your Email - AI DocuSphere
   Content type: HTML template
✅ Email sent successfully (attempt 1/3): { messageId: '...', ... }
```

---

## 🆘 Still Having Issues?

1. **Check Render logs** - Look for specific error codes
2. **Test locally first** - Verify emails work on localhost
3. **Try alternative SMTP** - Consider SendGrid, Mailgun, or AWS SES for production
4. **Contact support** - Render support can help with network issues

---

## 🔄 Alternative: Using SendGrid (Recommended for Production)

If Gmail continues to have issues, consider SendGrid:

```javascript
// Install: npm install @sendgrid/mail
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

**Benefits:**
- More reliable on hosting platforms
- Higher sending limits
- Better deliverability
- Free tier: 100 emails/day

---

**Last Updated:** November 5, 2025  
**Backend:** DocuSphere-AI  
**Frontend:** https://docu-sphere-ai.vercel.app
