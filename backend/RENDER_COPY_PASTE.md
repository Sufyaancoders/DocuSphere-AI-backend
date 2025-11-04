# 🔧 Copy-Paste Ready: Render Environment Variables

## ⚡ Quick Fix - Copy These EXACT Values to Render

### Go to: https://dashboard.render.com → Your Service → Environment

---

## 📋 Environment Variables (Copy-Paste Ready)

### 1️⃣ NODE_ENV
```
production
```

### 2️⃣ PORT
```
5001
```

### 3️⃣ MONGODB_URI
```
mongodb+srv://sufyaan:em8cFfVJ2YYnqlMx@cluster-skillhouse.qu69pbc.mongodb.net/AIDocusphere?retryWrites=true&w=majority
```

### 4️⃣ JWT_SECRET
```
AIcode123456
```

### 5️⃣ MAIL_USER
```
sufyaanahmadx9x@gmail.com
```

### 6️⃣ MAIL_PASS ⚠️ NEW PASSWORD!
```
zimtxsvxcnurfggp
```

### 7️⃣ FRONTEND_URL
```
https://docu-sphere-ai.vercel.app
```

### 8️⃣ GEMINI_API_URL
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

### 9️⃣ GEMINI_API_KEY
```
AIzaSyCTDFTpGJqrwfzRypsCL1uAW7dvedKL2zk
```

---

## ✅ Steps to Apply

1. **Open Render Dashboard** → https://dashboard.render.com
2. **Select Service** → docusphere-ai (or your service name)
3. **Click "Environment"** in left sidebar
4. **Update MAIL_PASS:**
   - Find `MAIL_PASS` variable
   - Click Edit icon
   - Delete old value
   - Paste: `zimtxsvxcnurfggp`
   - Save

5. **Check NODE_ENV:**
   - If doesn't exist, click "Add Environment Variable"
   - Key: `NODE_ENV`
   - Value: `production`
   - Save

6. **Click "Save Changes"** at bottom of page

7. **Wait for Redeploy** (2-3 minutes)
   - Watch "Events" tab
   - Wait until status shows "Live"

8. **Check Logs:**
   - Click "Logs" tab
   - Look for:
     ```
     📧 Initializing SMTP with config: {
       environment: 'PRODUCTION',
       port: 465
     }
     ✅ SMTP server is ready to send emails
     ```

---

## 🎯 What Changed?

| Variable | Old Value | New Value |
|----------|-----------|-----------|
| MAIL_PASS | `fsjlkcmvwmcowrhj` | `zimtxsvxcnurfggp` |
| NODE_ENV | (not set) | `production` |

---

## ⚠️ Common Mistakes to Avoid

❌ **WRONG:** `MAIL_PASS = zimtxsvxcnurfggp` (has spaces)  
✅ **RIGHT:** `MAIL_PASS=zimtxsvxcnurfggp` (no spaces)

❌ **WRONG:** `zimt xsvx cnur fggp` (has spaces)  
✅ **RIGHT:** `zimtxsvxcnurfggp` (remove ALL spaces)

❌ **WRONG:** `NODE_ENV=development`  
✅ **RIGHT:** `NODE_ENV=production`

---

## 🧪 Test Command (After Deploy)

```bash
curl -X POST https://docusphere-ai.onrender.com/api/v1/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

## 📊 Timeline

- ⏱️ Update env vars: **30 seconds**
- ⏱️ Redeploy: **2-3 minutes**
- ⏱️ Test: **30 seconds**
- **Total: ~3-4 minutes**

---

**Status After Fix:**
```
✅ Port 465 (SSL) - Working on Render
✅ New Gmail App Password
✅ NODE_ENV=production set
✅ Emails sending successfully
```

**Go update Render NOW!** 🚀
