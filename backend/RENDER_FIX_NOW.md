# 🚨 URGENT: Fix Render Email Configuration

## Current Issue
Your Render deployment is showing:
```
❌ SMTP connection error: Connection timeout
```

This means **Render is NOT using the updated configuration**.

---

## ✅ IMMEDIATE FIX - Update Render Environment Variables

### Step 1: Go to Render Dashboard
1. Visit: https://dashboard.render.com
2. Select your backend service: **docusphere-ai**
3. Click on **Environment** tab (left sidebar)

### Step 2: Update These Variables

**CRITICAL - Update or Add These:**

```env
NODE_ENV=production
MAIL_USER=sufyaanahmadx9x@gmail.com
MAIL_PASS=zimtxsvxcnurfggp
```

**⚠️ IMPORTANT:**
- **Remove ALL spaces** from `MAIL_PASS` (copy exactly: `zimtxsvxcnurfggp`)
- Make sure `NODE_ENV=production` is set (this triggers port 465)
- No spaces around the `=` sign

### Step 3: Full Environment Variables List for Render

Copy these EXACTLY as shown (update any that are different):

```
NODE_ENV=production
PORT=5001

MONGODB_URI=mongodb+srv://sufyaan:em8cFfVJ2YYnqlMx@cluster-skillhouse.qu69pbc.mongodb.net/AIDocusphere?retryWrites=true&w=majority

JWT_SECRET=AIcode123456

MAIL_USER=sufyaanahmadx9x@gmail.com
MAIL_PASS=zimtxsvxcnurfggp

FRONTEND_URL=https://docu-sphere-ai.vercel.app

GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
GEMINI_API_KEY=AIzaSyCTDFTpGJqrwfzRypsCL1uAW7dvedKL2zk
```

### Step 4: Save and Redeploy
1. Click **Save Changes** button at the bottom
2. Render will automatically redeploy (takes 2-3 minutes)
3. Wait for deployment to complete

---

## 🔍 Verify After Deployment

### Check Render Logs:

**You should see this on startup:**
```
📧 Initializing SMTP with config: {
  environment: 'PRODUCTION',
  host: 'smtp.gmail.com',
  port: 465,                    ← Must be 465, NOT 587!
  secure: true,
  user: 'sufyaanahmadx9x@gmail.com',
  passLength: 16                 ← Should be 16 characters
}

✅ SMTP server is ready to send emails
```

**❌ If you still see port 587:**
- `NODE_ENV=production` is NOT set correctly
- Clear browser cache and check Render env vars again

**❌ If you see "Authentication failed":**
- `MAIL_PASS` has spaces or is incorrect
- Copy password exactly: `zimtxsvxcnurfggp`

---

## 🧪 Test Email After Deploy

### Option 1: From Your Frontend
Go to: https://docu-sphere-ai.vercel.app
- Try to sign up with a new email
- Check if OTP email is received

### Option 2: Using Curl
```bash
curl -X POST https://docusphere-ai.onrender.com/api/v1/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@gmail.com"}'
```

### Expected Response:
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

## 🐛 Troubleshooting

### Still Getting Connection Timeout?

**1. Double-check Gmail App Password:**
- Password format: `xxxx xxxx xxxx xxxx` (4 groups of 4)
- Remove ALL spaces when entering in Render
- Should be exactly 16 characters: `zimtxsvxcnurfggp`

**2. Verify Password is Correct:**
Test locally first:
```bash
# In backend directory
npm start
```

Try sending OTP from your frontend locally. If it works locally but not on Render, the issue is Render's environment variables.

**3. Regenerate Gmail App Password:**
If still failing:
- Go to: https://myaccount.google.com/apppasswords
- Delete the old "AI DocuSphere" app password
- Generate a NEW one
- Copy it (remove spaces)
- Update in Render immediately

**4. Check Render Logs for Specific Errors:**
```bash
# In Render dashboard, check logs for:
[ERROR] Connection timeout     ← Network/port issue
[ERROR] Authentication failed  ← Wrong password
[ERROR] EAUTH                  ← Gmail security issue
```

---

## 📋 Quick Checklist

Before testing, verify:

- [ ] Render Dashboard → Environment tab is open
- [ ] `NODE_ENV=production` is set
- [ ] `MAIL_PASS=zimtxsvxcnurfggp` (no spaces, 16 chars)
- [ ] `MAIL_USER=sufyaanahmadx9x@gmail.com`
- [ ] Clicked "Save Changes" button
- [ ] Waited for redeploy to complete (check "Events" tab)
- [ ] Checked logs show port 465 (not 587)
- [ ] Gmail 2FA is enabled
- [ ] App Password is valid and active

---

## 🆘 Last Resort: Alternative Solutions

### Option A: Use SendGrid Instead
If Gmail continues to fail on Render:

1. Sign up: https://sendgrid.com (100 emails/day free)
2. Get API Key
3. Add to Render: `SENDGRID_API_KEY=your_key`
4. Update code to use SendGrid (see main email guide)

### Option B: Use Different Gmail Account
Sometimes the issue is account-specific:
1. Create a new Gmail account
2. Enable 2FA
3. Generate App Password
4. Update Render env vars with new credentials

---

## 🎯 Expected Timeline

- Update env vars in Render: **1 minute**
- Redeploy: **2-3 minutes**
- Test email: **1 minute**
- **Total: ~5 minutes** to fix

---

**Current Status:** ❌ Email not working on Render  
**Root Cause:** Old password OR port 587 still being used  
**Fix:** Update Render environment variables with new password and ensure NODE_ENV=production  
**Priority:** 🔥 CRITICAL - blocks user registration

---

## 📸 Visual Guide

1. **Render Dashboard:**
   ```
   Dashboard → Your Service → Environment (sidebar)
   ```

2. **Add/Edit Variable:**
   ```
   Key: MAIL_PASS
   Value: zimtxsvxcnurfggp
   [Save Changes]
   ```

3. **Check Deployment:**
   ```
   Events tab → Latest deploy should show "Live"
   ```

4. **View Logs:**
   ```
   Logs tab → Look for "SMTP server is ready"
   ```

---

**Next Step:** Update Render environment variables NOW and wait for redeploy.
