const User = require('../models/user');
const OTP = require('../models/otp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
exports.login = async (req, res) => {
    try {
        // Extract credentials
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password"
            });
        }
        
        // Find user by email
        const user = await User.findOne( {email})
    
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist, please sign up first"
            });
        }
        
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        
        // Generate JWT token
        const payload = {
            email: user.email,
            userId: user._id,
        };
        
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });
        
        // Add token to user object for response
        user.token = token;
        // Don't send password in response
        user.password = undefined;
        
        // Set cookie for token
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            httpOnly: true
        };
        
        // Send response with cookie
        return res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "Logged in successfully"
        });
        
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};

// singup 


exports.signUp = async (req, res) => {

     
    try {
        const { name, email, password, confirmPassword, otp } = req.body;
       
        // Validate required fields
        if (!name || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }
        
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        
        // Check password matching
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }
        
        // Find the most recent OTP for this email
        const otpRecord = await OTP.findOne({ 
            email, 
            otp 
        }).sort({ createdAt: -1 }).limit(1);
        
        console.log("OTP record found:", otpRecord);
        
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        
        // Check OTP expiration (10 minutes)
        const now = new Date();
        const otpCreatedAt = new Date(otpRecord.createdAt);
        const tenMinutesInMs = 10 * 60 * 1000;
        
        if (now - otpCreatedAt > tenMinutesInMs) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // // Set approval status based on account type
      
        
        // Create user with correct Image field (capital I)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            Image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}` // Capital I to match schema
        });

        // Delete the used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        // Return success response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.Image
            }
        });
        
    } catch (error) {
        console.error('Error signing up:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to sign up',
            error: error.message
        });
    }
};
 exports.logout = (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie("token");
        
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Error logging out",
            error: error.message
        });
    }
};