// const { text } = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a single reusable transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, 
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// Track recent emails using a more specific key to prevent template confusion
const recentEmails = new Map();

const sendEmail = async (email, subject, html) => {
    try {
        // Create a unique key using a hash of the email content
        // This way, different templates sent to the same email won't be considered duplicates
        const contentHash = require('crypto')
            .createHash('md5')
            .update(html.substring(0, 100)) // Hash the first 100 chars for speed
            .digest('hex');
            
        const emailKey = `${email}:${subject}:${contentHash}`;
        
        // Check if we've just sent this same email with same content
        // if (recentEmails.has(emailKey)) {
        //     const lastSent = recentEmails.get(emailKey);
        //     const timeSinceLastEmail = Date.now() - lastSent;
            
        //     // Only prevent exact duplicates (same content) within 3 seconds
        //     if (timeSinceLastEmail < 3000) {
        //         console.log(`Preventing duplicate email to ${email} - last sent ${timeSinceLastEmail}ms ago`);
        //         return { 
        //             messageId: 'DUPLICATE_PREVENTED',
        //             response: 'Duplicate email prevented'
        //         };
        //     }
        // }
        
        console.log("Sending email to:", email);
        console.log("Subject:", subject);
        console.log("Content type:", html.includes("<!DOCTYPE html>") ? "HTML template" : "Simple text");

        const mailOptions = {
            from: `SkillHouse <${process.env.MAIL_USER}>`,
            to: email,
            subject: subject,
            html: html,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        
        // Log success
        console.log('Email sent successfully:', { 
            messageId: info.messageId,
            to: email,
            subject: subject
        });
        
        // Add this email to our recent emails map
        recentEmails.set(emailKey, Date.now());
        
        // Clean up old entries to prevent memory leaks
        setTimeout(() => {
            recentEmails.delete(emailKey);
        }, 60000);

        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}

module.exports = sendEmail;
