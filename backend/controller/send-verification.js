const OTP = require('../models/otp');
const User= require("../models/user")
const sendEmail = require('../util/mailsender');
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
        // Send OTP to user's email
        const mailResponse = await sendEmail(
            email,
            "Verify Your Email - AI DocuSpehere",
            otpVerificationEmail(otpGenerated , "user" ) // Add "User" as placeholder name
        );
        console.log("Mail response:", mailResponse);
        // console.log("OTP sent:", otpGenerated);
        
        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            // Don't send the actual OTP in response for security
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
