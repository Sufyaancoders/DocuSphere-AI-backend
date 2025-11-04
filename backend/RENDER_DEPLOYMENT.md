# 🚀 Render Deployment Guide for AI DocuSphere Backend

## ⚠️ Important: Email Configuration for Render

**Render's infrastructure blocks port 587 for SMTP connections.** This causes connection timeouts when trying to send emails. The backend is now configured to automatically detect the environment and use the correct port.

---

## 📋 Required Render Environment Variables

Go to your Render dashboard → Your service → **Environment** tab and add these:

### Required Variables:
```env
NODE_ENV=production
PORT=5001

# MongoDB
MONGODB_URI=mongodb+srv://sufyaan:em8cFfVJ2YYnqlMx@cluster-skillhouse.qu69pbc.mongodb.net/AIDocusphere?retryWrites=true&w=majority

# JWT
JWT_SECRET=AIcode123456

# Email (Gmail App Password - NO SPACES!)
MAIL_USER=sufyaanahmadx9x@gmail.com
MAIL_PASS=fsjlkcmvwmcowrhj

# Frontend URL
FRONTEND_URL=https://docu-sphere-ai.vercel.app

# Gemini AI
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
GEMINI_API_KEY=AIzaSyCTDFTpGJqrwfzRypsCL1uAW7dvedKL2zk

# Nebius (if used)
NEBIUS_API_KEY=your_nebius_key_here
```

### ⚠️ Critical Notes:

1. **NO SPACES around equals signs** in Render environment variables
2. **NODE_ENV=production** is required (triggers port 465 for SMTP)
3. **MAIL_PASS** must be Gmail App Password (16 characters, no spaces)
4. After adding/changing variables, click **Save Changes** (auto-redeploys)

---

## 🔧 How Email Config Works

The `mailsender.js` now automatically detects the environment:

### Local Development (Port 587 with STARTTLS):
```javascript
NODE_ENV=development (or not set)
→ Uses port 587 with STARTTLS
→ Works on local networks
```

### Production on Render (Port 465 with SSL):
```javascript
NODE_ENV=production or RENDER=true
→ Uses port 465 with SSL/TLS
→ Bypasses Render's port 587 block
```

---

## ✅ Expected Logs on Render

After deployment, check Render logs. You should see:

```
📧 Initializing SMTP with config: {
  environment: 'PRODUCTION',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  user: 'sufyaanahmadx9x@gmail.com',
  passLength: 16
}
Server is running on port 5001
MongoDB connected successfully
✅ SMTP server is ready to send emails
```

### ❌ If you see errors:

**Error: "Connection timeout" on port 465**
- Check Gmail App Password is correct
- Verify 2FA is enabled on Google Account
- Regenerate App Password if needed

**Error: "Authentication failed"**
- App Password might be expired
- Make sure `MAIL_USER` matches the Gmail account that generated the password
- No spaces in `MAIL_PASS`

---

## 🧪 Testing Email on Production

After deployment, test with your frontend or curl:

```bash
curl -X POST https://your-app.onrender.com/api/v1/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Check Render logs for:
```
📧 Sending email to: test@example.com
   Subject: Verify Your Email - AI DocuSphere
   Content type: HTML template
✅ Email sent successfully (attempt 1/3): { messageId: '...' }
```

---

## 🔒 Gmail App Password Setup (Reminder)

If emails still fail, regenerate your App Password:

1. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Enable 2FA

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - App name: "AI DocuSphere Render"
   - Click **Generate**
   - Copy the 16-character password (remove spaces!)

3. **Update Render:**
   - Go to Environment tab
   - Update `MAIL_PASS` with new password
   - Save (triggers redeploy)

---

## 🐛 Troubleshooting Checklist

### Email Not Sending:
- [ ] `NODE_ENV=production` is set in Render
- [ ] `MAIL_USER` and `MAIL_PASS` are correct
- [ ] Gmail 2FA is enabled
- [ ] App Password is valid (16 chars, no spaces)
- [ ] Check Render logs for specific error codes
- [ ] Verify port 465 in logs (not 587)

### Server Not Starting:
- [ ] All required env vars are set
- [ ] MongoDB URI is correct
- [ ] Port binding detected by Render
- [ ] No syntax errors in code

### CORS Issues:
- [ ] `FRONTEND_URL` is set correctly
- [ ] Frontend URL matches in `index.js` CORS config
- [ ] No trailing slashes in URL

---

## 📊 Performance Optimization

Once emails are working, you can optimize by:

1. **Disable Debug Logs** (already done in production):
   - `debug: false` when `NODE_ENV=production`

2. **Connection Pooling** (already enabled):
   - Reuses SMTP connections
   - Max 5 concurrent emails

3. **Monitor Email Logs:**
   - Track success/failure rates
   - Watch for rate limits from Gmail

---

## 🆘 Alternative: SendGrid (If Gmail Still Fails)

If Gmail continues to have issues on Render, consider SendGrid:

### Why SendGrid for Production?
- ✅ No port restrictions
- ✅ Higher sending limits (100/day free tier)
- ✅ Better deliverability
- ✅ Dedicated IP option
- ✅ Email analytics

### Quick Setup:
1. Sign up: https://sendgrid.com
2. Get API Key
3. Add to Render: `SENDGRID_API_KEY=your_key`
4. Update `mailsender.js`:

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

---

## 📝 Deployment Checklist

Before going live:

- [ ] All environment variables set in Render
- [ ] `NODE_ENV=production`
- [ ] Gmail App Password tested and working
- [ ] MongoDB connection verified
- [ ] Frontend CORS working
- [ ] Test OTP email flow
- [ ] Test password reset flow
- [ ] Check Render logs for errors
- [ ] Monitor first few email sends

---

## 🎯 Quick Deploy Commands

After code changes:

```bash
# Commit and push to trigger redeploy
git add .
git commit -m "Fix email configuration for Render"
git push origin main
```

Render auto-deploys from main branch.

---

**Last Updated:** November 5, 2025  
**Issue:** Render blocks port 587  
**Solution:** Use port 465 with SSL in production  
**Status:** ✅ Fixed with environment detection
