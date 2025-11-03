const user = require("../models/user");
const mailSender = require('../util/mailsender');
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// Reset password when user has forgotten it (requires OTP verification first)

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmNewPassword } = req.body;
        
        if (!token || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        
        // Check if passwords match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords don't match"
            });
        }
        
        // Hash the token to compare with the hashed one in database
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        
        // Find user with this token and valid expiry
        const userInstance = await user.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpiry: { $gt: Date.now() } // Check if token hasn't expired
        });
        
        // Check if token is valid and not expired
        if (!userInstance) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }
        
        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user's password AND clear reset token fields
        const updatedUser = await user.findOneAndUpdate(
            { resetPasswordToken: hashedToken },
            { 
                password: hashedNewPassword,
                resetPasswordToken: null,
                resetPasswordExpiry: null
            },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(500).json({
                success: false,
                message: "Error updating password"
            });
        }
        
        // Send confirmation email
        await mailSender(
            userInstance.email,
            "Password Changed Successfully",
            "Your password has been changed successfully. If you didn't perform this action, please contact our support team immediately."
        );
        
        return res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reset password",
            error: error.message
        });
    }
};

// resetPasswordtoken 

exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;

        // Validate input
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Find user by email
        const userInstance = await user.findOne({ email: email });
        
        // For security reasons, don't reveal if an email exists or not
        if (!userInstance) {
            return res.status(200).json({
                success: true, // Set to true for security (so frontend behavior is consistent)
                message: "If your email exists in our system, you will receive reset instructions"
            });
        }
 // IMPORTANT: Hash the token before storing it
        // This matches the hash verification in resetPassword function
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Generate token using crypto
        // const token = crypto.randomBytes(20).toString("hex");

        // Update user document with token and expiration
        const updatedDetails = await user.findOneAndUpdate(
            { email: email },
            {
                resetPasswordToken:hashedToken,
                resetPasswordExpiry: Date.now() + 3600000, // 1 hour
            },
            { new: true }
        );
        console.log("DETAILS", updatedDetails);

        // Create reset URL - use environment variable for frontend URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/update-password/${token}`;
 console.log("RESET URL", resetUrl);
 console.log("EMAIL check ", email);
        // Send email with reset link
        await mailSender(
            email,
            "Password Reset - SkillHouse",
            `Your Link for password reset is ${resetUrl}. Please click this link to reset your password. This link is valid for 1 hour.`
        );

        // Return success response
        return res.status(200).json({
            success: true,
            message: "If your email exists in our system, you will receive reset instructions"
        });
    } catch (error) {
        console.error("Error sending reset password token:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send reset password token",
            error: error.message
        });
    }
};
