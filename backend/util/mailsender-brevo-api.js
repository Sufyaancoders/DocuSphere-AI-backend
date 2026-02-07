// Brevo API-based email sender (more reliable than SMTP on cloud platforms)
const axios = require('axios');
require('dotenv').config();

const recentEmails = new Map();

const sendEmail = async (email, subject, html) => {
    try {
        const contentHash = require('crypto')
            .createHash('md5')
            .update(html.substring(0, 100))
            .digest('hex');
            
        const emailKey = `${email}:${subject}:${contentHash}`;
        
        console.log("📧 Sending email via Brevo API to:", email);
        console.log("Subject:", subject);

        // Brevo API endpoint
        const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
        
        // Prepare the request payload
        const payload = {
            sender: {
                name: "DocuSphere AI",
                email: process.env.SENDER_EMAIL || process.env.MAIL_USER
            },
            to: [
                {
                    email: email,
                    name: email.split('@')[0]
                }
            ],
            subject: subject,
            htmlContent: html
        };

        // Make the API request
        const response = await axios.post(BREVO_API_URL, payload, {
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
        });

        console.log('✅ Email sent successfully via Brevo API:', {
            messageId: response.data.messageId,
            to: email,
            subject: subject
        });
        
        // Add this email to our recent emails map
        recentEmails.set(emailKey, Date.now());
        
        // Clean up old entries to prevent memory leaks
        setTimeout(() => {
            recentEmails.delete(emailKey);
        }, 60000);

        return {
            messageId: response.data.messageId,
            response: 'Email sent via Brevo API'
        };
        
    } catch (error) {
        console.error('❌ Error sending email via Brevo API:', error.response?.data || error.message);
        throw new Error(`Failed to send email: ${error.response?.data?.message || error.message}`);
    }
}

module.exports = sendEmail;
