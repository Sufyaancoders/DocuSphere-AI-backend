const nodemailer = require('nodemailer');
require('dotenv').config();

// Validate required environment variables
if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error('❌ ERROR: MAIL_USER and MAIL_PASS must be set in environment variables');
}

/**
 * Creates multiple transporter configurations to try in order
 * This provides fallback options if one configuration fails
 */
function getTransporterConfigs() {
    const baseAuth = {
        user: process.env.MAIL_USER?.trim(),
        pass: process.env.MAIL_PASS?.trim(),
    };

    return [
        {
            name: 'Gmail Port 465 (SSL)',
            config: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: baseAuth,
                pool: false,
                connectionTimeout: 90000,
                greetingTimeout: 60000,
                socketTimeout: 90000,
                tls: {
                    rejectUnauthorized: false,
                    minVersion: 'TLSv1.2'
                },
                logger: true,
                debug: true,
            }
        },
        {
            name: 'Gmail Port 587 (STARTTLS)',
            config: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: baseAuth,
                pool: false,
                connectionTimeout: 90000,
                greetingTimeout: 60000,
                socketTimeout: 90000,
                requireTLS: true,
                tls: {
                    rejectUnauthorized: false,
                    minVersion: 'TLSv1.2',
                    ciphers: 'SSLv3'
                },
                logger: true,
                debug: true,
            }
        },
        {
            name: 'Gmail Port 25 (Fallback)',
            config: {
                host: 'smtp.gmail.com',
                port: 25,
                secure: false,
                auth: baseAuth,
                pool: false,
                connectionTimeout: 60000,
                socketTimeout: 60000,
                tls: {
                    rejectUnauthorized: false
                },
                logger: true,
                debug: false,
            }
        }
    ];
}

/**
 * Try to send email with multiple transporter configurations
 */
const sendEmail = async (email, subject, html, retries = 2) => {
    try {
        // Validate inputs
        if (!email || !subject || !html) {
            throw new Error('Email, subject, and html content are required');
        }

        console.log(`📧 Attempting to send email to: ${email}`);
        console.log(`   Subject: ${subject}`);

        const mailOptions = {
            from: `AI DocuSphere <${process.env.MAIL_USER}>`,
            to: email,
            subject: subject,
            html: html,
        };

        const transporterConfigs = getTransporterConfigs();
        let lastError;

        // Try each transporter configuration
        for (const { name, config } of transporterConfigs) {
            console.log(`\n🔄 Trying configuration: ${name}`);
            
            const transporter = nodemailer.createTransport(config);

            // Try sending with this configuration
            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    console.log(`   Attempt ${attempt}/${retries}...`);
                    
                    const info = await transporter.sendMail(mailOptions);
                    
                    console.log(`✅ Email sent successfully using ${name}:`, {
                        messageId: info.messageId,
                        to: email,
                        response: info.response
                    });
                    
                    return info;
                } catch (err) {
                    lastError = err;
                    console.error(`❌ Attempt ${attempt}/${retries} failed with ${name}:`, err.message);
                    
                    if (attempt < retries) {
                        const waitTime = 2000 * attempt;
                        console.log(`   Waiting ${waitTime}ms before retry...`);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                    }
                }
            }
        }

        // All configurations and retries failed
        throw new Error(`Failed to send email after trying all configurations. Last error: ${lastError.message}`);
        
    } catch (error) {
        console.error('❌ Failed to send email:', {
            error: error.message,
            code: error.code,
            to: email,
            subject: subject
        });
        
        // Provide helpful error messages
        if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET' || error.message.includes('timeout')) {
            throw new Error(`Email service connection timeout. Please check:\n1. Your internet connection\n2. Firewall/Antivirus settings (allow port 465, 587)\n3. Try disabling VPN if active\n4. Verify Gmail App Password is correct`);
        } else if (error.code === 'EAUTH') {
            throw new Error(`Email authentication failed. Please:\n1. Enable 2-Step Verification on Gmail\n2. Generate a new App Password\n3. Update MAIL_PASS with the new 16-character App Password`);
        } else {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
};

module.exports = sendEmail;
