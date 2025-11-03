// Docusphere-Ai/backend/routes/user.js
const express = require('express');
const router = express.Router();
const {login, logout, signUp }= require('../controller/auth')
const {sendOTP} = require("../controller/send-verification")
const { resetPassword, resetPasswordToken } = require('../controller/reset_password');

// Example route;
router.post('/login', login);
router.post("/logout", logout);
router.post("/signup", signUp);
router.post('/send-otp', sendOTP);

router.post('/reset-password', resetPassword);
router.post('/reset-password-token', resetPasswordToken);



module.exports = router;