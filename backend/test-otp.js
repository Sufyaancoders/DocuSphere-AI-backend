#!/usr/bin/env node

/**
 * Backend Send-OTP Test Script
 * Tests the complete flow: Email → OTP Generation → OTP Verification
 */

const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

async function testBackend() {
  console.log('\n🔧 DocuSphere Backend Test Script\n');
  
  // Get backend URL
  const backendUrl = await question('Enter your backend URL (e.g., https://docusphere-backend.onrender.com): ');
  const testEmail = await question('Enter test email: ');
  
  if (!backendUrl.includes('http')) {
    console.log('❌ Invalid URL format\n');
    rl.close();
    return;
  }

  const apiUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
  
  try {
    // Test 1: Health Check
    console.log('\n📡 Test 1: Health Check...');
    const healthResponse = await axios.get(`${apiUrl}/health`, { timeout: 5000 });
    console.log(`✅ Backend is running: ${healthResponse.status}`);
    
    // Test 2: Send OTP
    console.log('\n📧 Test 2: Sending OTP...');
    const otpResponse = await axios.post(
      `${apiUrl}/api/v1/send-otp`,
      { email: testEmail },
      { timeout: 10000 }
    );
    
    if (otpResponse.data.success) {
      console.log(`✅ OTP sent successfully`);
      if (otpResponse.data.otp) {
        console.log(`📝 OTP (dev mode): ${otpResponse.data.otp}`);
      } else {
        console.log(`📝 OTP sent to ${testEmail} - check email`);
      }
    } else {
      console.log(`❌ Failed to send OTP: ${otpResponse.data.message}`);
    }
    
    // Test 3: Check email
    if (otpResponse.data.otp) {
      console.log('\n✅ Backend is working correctly!');
      console.log('\nNext steps:');
      console.log('1. Frontend should call the same endpoint');
      console.log('2. User receives OTP in email');
      console.log('3. User enters OTP on verification page');
      console.log('4. Account is created');
    }
    
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      console.log('\n❌ Network Error: Backend is not reachable');
      console.log('   Check if:');
      console.log('   - Backend URL is correct');
      console.log('   - Backend is deployed and running');
      console.log('   - No CORS issues');
    } else if (error.response) {
      console.log(`\n⚠️  Backend Error: ${error.response.status}`);
      console.log(`   Message: ${error.response.data?.message || 'Unknown error'}`);
    } else {
      console.log(`\n❌ Error: ${error.message}`);
    }
  }
  
  rl.close();
}

testBackend();
