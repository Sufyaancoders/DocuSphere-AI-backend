// Alternative email sender using SendGrid (recommended for Render)
// Install: npm install @sendgrid/mail
// This is more reliable on Render than SMTP

const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Validate required environment variables
if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ ERROR: SENDGRID_API_KEY must be set in environment variables');
    console.error('   Get your API key from: https://app.sendgrid.com/settings/api_keys');
}

if (!process.env.SENDGRID_FROM_EMAIL) {
    console.error('❌ ERROR: SENDGRID_FROM_EMAIL must be set in environment variables');
    console.error('   Verify your sender email at: https://app.sendgrid.com/settings/sender_auth');
}

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log('📧 Initializing SendGrid email service:', {
    fromEmail: process.env.SENDGRID_FROM_EMAIL,
    apiKeySet: !!process.env.SENDGRID_API_KEY,
    environment: process.env.NODE_ENV || 'development'
});

/**
 * Send email using SendGrid
 * @param {string} email - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {number} retries - Number of retry attempts (default: 2)
 * @returns {Promise<object>} SendGrid response
 */
const sendEmail = async (email, subject, html, retries = 2) => {
    try {
        // Validate inputs
        if (!email || !subject || !html) {
            throw new Error('Email, subject, and html content are required');
        }

        console.log(`📧 Sending email to: ${email}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Service: SendGrid`);

        const msg = {
            to: email,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: 'AI DocuSphere'
            },
            subject: subject,
            html: html,
        };

        // Send with retry logic
        let lastError;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await sgMail.send(msg);
                
                console.log(`✅ Email sent successfully via SendGrid (attempt ${attempt}/${retries}):`, {
                    to: email,
                    subject: subject,
                    statusCode: response[0]?.statusCode,
                    messageId: response[0]?.headers['x-message-id']
                });

                return response;
            } catch (err) {
                lastError = err;
                console.error(`❌ SendGrid attempt ${attempt}/${retries} failed:`, {
                    error: err.message,
                    code: err.code,
                    statusCode: err.response?.statusCode
                });

                if (attempt < retries) {
                    const waitTime = 2000 * attempt;
                    console.log(`   Retrying in ${waitTime}ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        }

        // All retries failed
        throw lastError;

    } catch (error) {
        console.error('❌ Failed to send email via SendGrid:', {
            error: error.message,
            code: error.code,
            statusCode: error.response?.statusCode,
            to: email,
            subject: subject
        });

        // Provide helpful error messages
        if (error.code === 401 || error.response?.statusCode === 401) {
            throw new Error('SendGrid API key is invalid. Please check your SENDGRID_API_KEY environment variable.');
        } else if (error.code === 403 || error.response?.statusCode === 403) {
            throw new Error('SendGrid sender email not verified. Please verify your sender at: https://app.sendgrid.com/settings/sender_auth');
        } else if (error.response?.statusCode === 429) {
            throw new Error('SendGrid rate limit exceeded. You may have hit your daily limit.');
        } else {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
};

module.exports = sendEmail;
