const OTP = require('../models/otp');
const User= require("../models/user")
// Use SMTP mailer directly (Brevo)
const sendEmail = require('../util/mailsender');
console.log("Using SMTP for emails (Brevo)");
const { otpVerificationEmail } = require('../mail/emailVerificationTemplete');
const otpGenerator = require('otp-generator');
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user already exists
        //the curly braces define a query object with field-value pairs
        const checkUserEmail = await User.findOne({ email });
        if (checkUserEmail) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        
        // Generate a unique OTP
        let otpGenerated;
        let otpExists = true;
        
        // Keep generating until we find a unique OTP
        while (otpExists) {
            otpGenerated = otpGenerator.generate(6, { 
                upperCaseAlphabets: false, 
                lowerCaseAlphabets: false,
                specialChars: false,
                digits: true
            });

            
            // Check if this OTP already exists in the database
            const existingOtp = await OTP.findOne({ otp: otpGenerated });
            
            if (!existingOtp) {
                // If no duplicate found, we can use this OTP
                otpExists = false;
            }
        }
        
        // Save the new OTP to the database
        const otpBody = {
            email,
            otp: otpGenerated,
            createdAt: new Date()
        };
        
        const otpInstance = await OTP.create(otpBody);
        console.log("OTP instance created:", otpInstance);
        
        // Try to send email but don't let it block the response
        let emailSent = false;
        try {
            const mailResponse = await sendEmail(
                email,
                "Verify Your Email - AI DocuSphere",
                otpVerificationEmail(otpGenerated, "user")
            );
            console.log("✅ Mail sent successfully:", mailResponse);
            emailSent = true;
        } catch (emailError) {
            console.error("❌ Email failed to send, but continuing:", emailError.message);
            // Email failed but we'll still return success so user can verify with OTP from logs/DB
        }
        
        return res.status(200).json({
            success: true,
            message: emailSent ? 'OTP sent successfully' : 'OTP created - check console for code',
            // FOR DEVELOPMENT ONLY - Remove in production
            ...(process.env.NODE_ENV === 'development' && { otp: otpGenerated })
        });
        
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
            error: error.message
        });
    }
};
