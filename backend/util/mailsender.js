// const { text } = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Validate required environment variables
if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error('❌ ERROR: MAIL_USER and MAIL_PASS must be set in environment variables');
    console.error('   Current MAIL_USER:', process.env.MAIL_USER ? 'SET' : 'NOT SET');
    console.error('   Current MAIL_PASS:', process.env.MAIL_PASS ? `SET (${process.env.MAIL_PASS.length} chars)` : 'NOT SET');
}

// Detect environment: Render blocks port 587, so use 465 for production
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
const smtpPort = isProduction ? 465 : 587;
const isSecure = isProduction ? true : false;

const transporterConfig = {
    host: 'smtp.gmail.com',
    port: smtpPort,
    secure: isSecure, // true for 465 (SSL), false for 587 (STARTTLS)
    auth: {
        user: process.env.MAIL_USER?.trim(), // Trim any whitespace
        pass: process.env.MAIL_PASS?.trim(), // Trim any whitespace
    },
    // Connection pool for production
    pool: isProduction,
    maxConnections: isProduction ? 5 : 1,
    // Timeout settings
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,   // 30 seconds
    socketTimeout: 60000,     // 60 seconds
    // TLS configuration
    tls: {
        rejectUnauthorized: !isProduction, // Less strict in production for Render compatibility
        minVersion: 'TLSv1.2',
        ciphers: 'HIGH:MEDIUM:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK'
    },
    logger: true, // Keep enabled for debugging
    debug: false,  // Disable verbose logs in production
};

console.log('📧 Initializing SMTP with config:', {
    environment: isProduction ? 'PRODUCTION' : 'DEVELOPMENT',
    host: transporterConfig.host,
    port: transporterConfig.port,
    secure: transporterConfig.secure,
    user: transporterConfig.auth.user,
    passLength: transporterConfig.auth.pass?.length
});

const transporter = nodemailer.createTransport(transporterConfig);

// Verify SMTP connection on startup (non-blocking)
transporter.verify(function(error, success) {
    if (error) {
        console.error('❌ SMTP connection error:', error.message);
        console.error('   Make sure MAIL_USER and MAIL_PASS are correct Gmail App Password credentials');
    } else {
        console.log('✅ SMTP server is ready to send emails');
    }
});
// Track recent emails using a more specific key to prevent template confusion
const recentEmails = new Map();

const sendEmail = async (email, subject, html, retries = 3) => {
    try {
        // Validate inputs
        if (!email || !subject || !html) {
            throw new Error('Email, subject, and html content are required');
        }

        // Create a unique key using a hash of the email content
        const contentHash = require('crypto')
            .createHash('md5')
            .update(html.substring(0, 100))
            .digest('hex');
            
        const emailKey = `${email}:${subject}:${contentHash}`;
        
        console.log(`📧 Sending email to: ${email}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Content type: ${html.includes("<!DOCTYPE html>") ? "HTML template" : "Simple text"}`);

        const mailOptions = {
            from: `AI DocuSphere <${process.env.MAIL_USER}>`, // Updated sender name
            to: email,
            subject: subject,
            html: html,
        };

        // Send the email with retry logic
        let lastError;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const info = await transporter.sendMail(mailOptions);
                
                // Log success
                console.log(`✅ Email sent successfully (attempt ${attempt}/${retries}):`, { 
                    messageId: info.messageId,
                    to: email,
                    subject: subject
                });
                
                // Add to recent emails map
                recentEmails.set(emailKey, Date.now());
                
                // Clean up old entries to prevent memory leaks
                setTimeout(() => {
                    recentEmails.delete(emailKey);
                }, 60000);

                return info;
            } catch (err) {
                lastError = err;
                console.error(`❌ Email send attempt ${attempt}/${retries} failed:`, err.message);
                
                // Wait before retry (exponential backoff)
                if (attempt < retries) {
                    const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                    console.log(`   Retrying in ${waitTime}ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        }
        
        // All retries failed
        throw lastError;
        
    } catch (error) {
        console.error('❌ Failed to send email after all retries:', {
            error: error.message,
            code: error.code,
            to: email,
            subject: subject
        });
        
        // Provide helpful error messages
        if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
            throw new Error(`Email service connection timeout. Please check your network and SMTP settings.`);
        } else if (error.code === 'EAUTH') {
            throw new Error(`Email authentication failed. Please verify MAIL_USER and MAIL_PASS are correct Gmail App Password credentials.`);
        } else {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}

module.exports = sendEmail;
