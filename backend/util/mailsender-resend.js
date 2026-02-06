const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, subject, html) => {
    try {
        console.log("📧 Sending email via Resend to:", email);
        console.log("   Subject:", subject);

        const data = await resend.emails.send({
            from: 'DocuSphere AI <onboarding@resend.dev>', // Use resend's test domain
            to: [email],
            subject: subject,
            html: html,
        });

        console.log('✅ Email sent successfully via Resend:', data.id);
        return data;
    } catch (error) {
        console.error('❌ Resend error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}

module.exports = sendEmail;
