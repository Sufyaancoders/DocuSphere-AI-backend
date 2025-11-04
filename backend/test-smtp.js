require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Testing Gmail SMTP Connection...\n');

// Display current config
console.log('📧 Current Configuration:');
console.log('   MAIL_USER:', process.env.MAIL_USER || '❌ NOT SET');
console.log('   MAIL_PASS:', process.env.MAIL_PASS ? `✅ SET (${process.env.MAIL_PASS.length} chars)` : '❌ NOT SET');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('\n');

// Test configurations in order of preference
const testConfigs = [
    {
        name: 'Port 465 (SSL) - Recommended',
        config: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 30000,
            debug: true,
            logger: false
        }
    },
    {
        name: 'Port 587 (STARTTLS)',
        config: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            requireTLS: true,
            tls: {
                rejectUnauthorized: false,
                ciphers: 'SSLv3'
            },
            connectionTimeout: 30000,
            debug: true,
            logger: false
        }
    },
    {
        name: 'Port 25 (Fallback)',
        config: {
            host: 'smtp.gmail.com',
            port: 25,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 20000,
            debug: true,
            logger: false
        }
    }
];

async function testConnection(name, config) {
    return new Promise((resolve) => {
        console.log(`🔄 Testing: ${name}`);
        console.log(`   Host: ${config.host}:${config.port}`);
        console.log(`   Secure: ${config.secure}`);
        
        const transporter = nodemailer.createTransport(config);
        
        const timeout = setTimeout(() => {
            console.log(`   ❌ Connection timeout (30s)\n`);
            resolve(false);
        }, 30000);
        
        transporter.verify((error, success) => {
            clearTimeout(timeout);
            
            if (error) {
                console.log(`   ❌ Failed: ${error.message}`);
                console.log(`   Error code: ${error.code || 'N/A'}\n`);
                resolve(false);
            } else {
                console.log(`   ✅ SUCCESS! This configuration works!`);
                console.log(`   ✅ Server is ready to send emails\n`);
                resolve(true);
            }
        });
    });
}

async function runTests() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('Starting SMTP connection tests...');
    console.log('This may take up to 2 minutes\n');
    
    for (const {name, config} of testConfigs) {
        const success = await testConnection(name, config);
        
        if (success) {
            console.log('🎉 RECOMMENDATION: Use this configuration in your mailsender.js\n');
            console.log('Add this to your mailsender.js:');
            console.log('```javascript');
            console.log(`const transporter = nodemailer.createTransport({`);
            console.log(`    host: '${config.host}',`);
            console.log(`    port: ${config.port},`);
            console.log(`    secure: ${config.secure},`);
            console.log(`    auth: {`);
            console.log(`        user: process.env.MAIL_USER,`);
            console.log(`        pass: process.env.MAIL_PASS,`);
            console.log(`    },`);
            if (config.requireTLS) {
                console.log(`    requireTLS: true,`);
            }
            console.log(`    tls: {`);
            console.log(`        rejectUnauthorized: false`);
            console.log(`    }`);
            console.log(`});`);
            console.log('```\n');
            
            // Try to send a test email
            console.log('📧 Now attempting to send a test email...');
            const transporter = nodemailer.createTransport(config);
            
            try {
                const info = await transporter.sendMail({
                    from: `Test <${process.env.MAIL_USER}>`,
                    to: process.env.MAIL_USER, // Send to yourself
                    subject: '✅ SMTP Test Successful - ' + new Date().toLocaleString(),
                    html: `
                        <h2>🎉 Congratulations!</h2>
                        <p>Your SMTP configuration is working correctly.</p>
                        <p><strong>Configuration used:</strong> ${name}</p>
                        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                        <hr>
                        <p><small>This is an automated test email from your DocuSphere-AI backend.</small></p>
                    `
                });
                
                console.log('✅ Test email sent successfully!');
                console.log('   Message ID:', info.messageId);
                console.log('   Check your inbox:', process.env.MAIL_USER);
                console.log('\n🎊 SMTP is fully configured and working!\n');
            } catch (error) {
                console.log('⚠️  Connection works but sending failed:', error.message);
                console.log('   This usually means authentication issue (wrong App Password)\n');
            }
            
            return;
        }
    }
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('❌ ALL CONFIGURATIONS FAILED');
    console.log('\n🔍 Troubleshooting Steps:\n');
    console.log('1. Check Windows Firewall:');
    console.log('   - Open Windows Defender Firewall > Advanced Settings');
    console.log('   - Add Outbound Rule for ports 465, 587, 25\n');
    console.log('2. Temporarily disable antivirus software\n');
    console.log('3. Test connection manually:');
    console.log('   - Run: telnet smtp.gmail.com 465');
    console.log('   - Run: nslookup smtp.gmail.com\n');
    console.log('4. Verify Gmail App Password:');
    console.log('   - Go to: https://myaccount.google.com/apppasswords');
    console.log('   - Generate a NEW App Password');
    console.log('   - Update .env with: MAIL_PASS=your16charpassword\n');
    console.log('5. Try using mobile hotspot (to test if ISP blocks SMTP)\n');
    console.log('6. Check detailed guide: SMTP_TIMEOUT_FIX.md\n');
    console.log('═══════════════════════════════════════════════════════\n');
}

// Run the tests
runTests().catch(error => {
    console.error('❌ Test script error:', error);
    process.exit(1);
});
