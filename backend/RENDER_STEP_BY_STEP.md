# 🚨 STEP-BY-STEP: Update Render Environment Variables

## Current Status
- ✅ Local `.env` has correct password: `zimtxsvxcnurfggp`
- ❌ Render still has OLD password causing timeout
- ❌ Render may not have `NODE_ENV=production` set

---

## 🎯 Follow These Steps EXACTLY

### Step 1: Open Render Dashboard
1. Go to: **https://dashboard.render.com**
2. Log in to your account
3. You should see your service: **docusphere-ai**

### Step 2: Open Environment Settings
1. Click on your **docusphere-ai** service
2. Look at the **left sidebar**
3. Click **"Environment"** (should be near the top)

### Step 3: Find and Update MAIL_PASS
1. Scroll down to find `MAIL_PASS`
2. You'll see current value (the old password)
3. Click the **pencil/edit icon** next to it
4. **Delete** the old value
5. **Copy and paste** this NEW password:
   ```
   zimtxsvxcnurfggp
   ```
6. Make sure there are NO SPACES before or after
7. Click **Save** or press Enter

### Step 4: Check/Add NODE_ENV
1. Scroll through your environment variables
2. Look for `NODE_ENV`

**If NODE_ENV exists:**
- Click edit icon
- Change value to: `production`
- Save

**If NODE_ENV doesn't exist:**
- Click **"Add Environment Variable"** button
- Key: `NODE_ENV`
- Value: `production`
- Click **Save**

### Step 5: Save All Changes
1. Scroll to the **bottom** of the page
2. Click the **"Save Changes"** button
3. A popup will say "This will redeploy your service"
4. Click **"Save Changes"** to confirm

### Step 6: Wait for Redeploy
1. Look at the top of the page - you'll see a notification
2. Or click **"Events"** tab to watch progress
3. Wait 2-3 minutes for deploy to complete
4. Status will change to **"Live"** when done

### Step 7: Check Logs
1. Click **"Logs"** tab (left sidebar)
2. Scroll to the latest logs (bottom)
3. Look for these lines:

**✅ SUCCESS - You should see:**
```
📧 Initializing SMTP with config: {
  environment: 'PRODUCTION',
  host: 'smtp.gmail.com',
  port: 465,                    ← MUST BE 465!
  secure: true,
  user: 'sufyaanahmadx9x@gmail.com',
  passLength: 16
}

Server is running on port 5001
MongoDB connected successfully
✅ SMTP server is ready to send emails
```

**❌ FAILURE - If you see:**
```
❌ SMTP connection error: Connection timeout
```
Then either:
- Password still wrong (typo?)
- `NODE_ENV` not set to `production`
- Need to wait longer for deploy

---

## 🧪 Test After Deploy

### Option 1: From Frontend
1. Go to: https://docu-sphere-ai.vercel.app
2. Try to register/sign up
3. Enter your email
4. Wait for OTP email

### Option 2: Using Terminal
```bash
curl -X POST https://docusphere-ai.onrender.com/api/v1/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

## ❓ Troubleshooting

### Still Getting Timeout After Update?

**Check 1: Verify Password in Render**
- Go back to Environment tab
- Click edit on `MAIL_PASS`
- Count the characters - should be exactly 16
- Should be: `zimtxsvxcnurfggp`
- No spaces, no quotes

**Check 2: Verify NODE_ENV**
- Should be: `production` (lowercase)
- Not: `Production` or `PRODUCTION`

**Check 3: Check Logs for Port Number**
- If logs show `port: 587` → NODE_ENV not set correctly
- Should show `port: 465` in production

**Check 4: Clear Render Cache (if needed)**
- Settings → Advanced → Clear build cache
- Redeploy

---

## 📋 Quick Reference: Required Variables

Copy this list to verify all are set:

```
✓ NODE_ENV=production
✓ PORT=5001
✓ MONGODB_URI=mongodb+srv://...
✓ JWT_SECRET=AIcode123456
✓ MAIL_USER=sufyaanahmadx9x@gmail.com
✓ MAIL_PASS=zimtxsvxcnurfggp
✓ FRONTEND_URL=https://docu-sphere-ai.vercel.app
✓ GEMINI_API_URL=https://...
✓ GEMINI_API_KEY=AIza...
```

---

## 🎯 What Should Happen

| Step | Action | Time |
|------|--------|------|
| 1-4 | Update env vars | 1 min |
| 5 | Save changes | 10 sec |
| 6 | Redeploy | 2-3 min |
| 7 | Check logs | 30 sec |
| 8 | Test email | 1 min |
| **Total** | | **~5 min** |

---

## 🆘 Still Not Working?

If after following ALL steps above, emails still fail:

### Last Resort Options:

**Option A: Regenerate Gmail App Password**
1. Go to: https://myaccount.google.com/apppasswords
2. Delete old "AI DocuSphere" password
3. Generate NEW password
4. Copy it (remove spaces)
5. Update in Render
6. Redeploy

**Option B: Switch to SendGrid**
- More reliable for production
- Free tier: 100 emails/day
- No port restrictions
- Contact me if you want to switch

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Render logs show: `port: 465`
2. ✅ Render logs show: `SMTP server is ready to send emails`
3. ✅ Test curl returns: `"success": true`
4. ✅ Email arrives in inbox within 1 minute
5. ✅ No timeout errors in logs

---

**Current Time:** You're looking at this guide  
**Estimated Fix Time:** 5 minutes from now  
**Priority:** 🔥 CRITICAL - Do this NOW

**GO UPDATE RENDER!** → https://dashboard.render.com
