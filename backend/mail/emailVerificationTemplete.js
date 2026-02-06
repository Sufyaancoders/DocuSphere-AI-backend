const fs = require('fs');
const path = require('path');

// Improved template with additional professional elements
exports.otpVerificationEmail = (otp, name ) => {
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI DocuSphere OTP Verification</title>
</head>
<body style="margin:0; padding:0; font-family:'Segoe UI',Arial,Helvetica,sans-serif; background: #181A20;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; max-width:600px; margin:0 auto; box-shadow:0 4px 24px rgba(0,0,0,0.5); border-radius:16px; overflow:hidden; background:#23263a;">
    <!-- HEADER WITH AI ROBOT LOGO -->
    <tr>
      <td style="padding:32px 0 16px 0; text-align:center; background:linear-gradient(135deg,#23263a 0%,#0ff1ce 100%);">
        <img src="https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/robot.svg" alt="AI Robot" style="height:60px; margin-bottom:12px; filter:drop-shadow(0 0 8px #0ff1ce);">
        <h1 style="color:#0ff1ce; margin:0; font-size:28px; font-weight:800; letter-spacing:2px; text-shadow:0 0 8px #0ff1ce;">AI DocuSphere</h1>
        <p style="color:#b3b8d4; margin:8px 0 0 0; font-size:16px; letter-spacing:1px;">AI-Powered Document Intelligence</p>
      </td>
    </tr>
    <!-- MAIN CONTENT -->
    <tr>
      <td style="padding:40px 30px 30px 30px; background:#23263a;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <!-- TITLE -->
          <tr>
            <td style="text-align:center; padding-bottom:24px;">
              <h2 style="margin:0; color:#0ff1ce; font-weight:700; font-size:22px; letter-spacing:1px;">Verify Your Email</h2>
              <p style="margin:12px 0 0 0; color:#b3b8d4; font-size:15px;">Welcome to the future of document automation.</p>
            </td>
          </tr>
          <!-- GREETING -->
          <tr>
            <td style="padding-bottom:20px;">
              <p style="margin:0; color:#fff; font-size:17px;">Hello <strong style="color:#0ff1ce;">${name}</strong>,</p>
              <p style="margin:16px 0 0 0; color:#b3b8d4; line-height:1.6;">Your AI-powered journey begins here. Use the OTP below to verify your email and unlock advanced document intelligence features.</p>
            </td>
          </tr>
          <!-- OTP CODE -->
          <tr>
            <td style="padding:24px 0; text-align:center;">
              <div style="display:inline-block; background:#181A20; border-radius:12px; border:2px solid #0ff1ce; padding:24px 40px; box-shadow:0 0 16px #0ff1ce44;">
                <p style="margin:0 0 10px 0; color:#0ff1ce; font-size:14px; text-transform:uppercase; letter-spacing:2px;">Your OTP Code</p>
                <div style="font-family:'Courier New',monospace; font-size:36px; font-weight:bold; color:#fff; letter-spacing:8px; padding:12px 0; text-shadow:0 0 12px #0ff1ce;">${otp}</div>
                <p style="margin:14px 0 0 0; color:#ff4b82; font-size:13px; font-weight:600;">Expires in 10 minutes</p>
              </div>
            </td>
          </tr>
          <!-- SECURITY NOTE -->
          <tr>
            <td style="padding:28px 0 10px 0; text-align:center; border-top:1px solid #2d3148;">
              <p style="margin:0; color:#b3b8d4; font-size:15px;">If you did not request this code, please ignore this email or contact our support team.</p>
              <a href="mailto:support@docusphere.ai" style="color:#0ff1ce; text-decoration:none; font-weight:600; margin-top:10px; display:inline-block;">Contact Support</a>
            </td>
          </tr>
          <!-- AI BENEFITS -->
          <tr>
            <td style="padding:32px 0 0 0;">
              <h3 style="color:#0ff1ce; margin:0 0 18px 0; font-weight:700; text-align:center; font-size:18px; letter-spacing:1px;">Why AI DocuSphere?</h3>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="width:33%; padding:12px; text-align:center; vertical-align:top;">
                    <div style="font-size:28px; margin-bottom:10px; color:#0ff1ce;">🤖</div>
                    <p style="font-weight:700; margin:0 0 5px 0; color:#fff;">AI Automation</p>
                    <p style="margin:0; color:#b3b8d4; font-size:13px;">Automate document workflows</p>
                  </td>
                  <td style="width:33%; padding:12px; text-align:center; vertical-align:top;">
                    <div style="font-size:28px; margin-bottom:10px; color:#0ff1ce;">🔒</div>
                    <p style="font-weight:700; margin:0 0 5px 0; color:#fff;">Secure & Private</p>
                    <p style="margin:0; color:#b3b8d4; font-size:13px;">Your data stays protected</p>
                  </td>
                  <td style="width:33%; padding:12px; text-align:center; vertical-align:top;">
                    <div style="font-size:28px; margin-bottom:10px; color:#0ff1ce;">⚡</div>
                    <p style="font-weight:700; margin:0 0 5px 0; color:#fff;">Lightning Fast</p>
                    <p style="margin:0; color:#b3b8d4; font-size:13px;">Instant document processing</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- FOOTER -->
    <tr>
      <td style="padding:24px; text-align:center; background:#181A20; border-top:1px solid #2d3148;">
        <p style="margin:0; color:#b3b8d4; font-size:13px;">&copy; ${currentYear} AI DocuSphere. All rights reserved.</p>
        <p style="margin:8px 0 0 0; color:#2de3c4; font-size:13px;">Made by AI, for humans.</p>
        <p style="margin:18px 0 0 0; color:#44495e; font-size:12px;">
          This email was sent to you because you registered for AI DocuSphere.<br>
          If you prefer not to receive these emails, you can <a href="#" style="color:#0ff1ce; text-decoration:underline;">unsubscribe</a>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};