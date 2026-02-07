#!/usr/bin/env node

/**
 * Quick checker for backend deployment issues
 * Run this to diagnose your backend setup
 */

const axios = require('axios');

const backendURL = process.env.BACKEND_URL || 'https://redeploy-backend-ai.onrender.com';

async function checkBackend() {
  console.log('🔍 Checking Backend Deployment...\n');
  
  const endpoints = [
    { url: `${backendURL}/`, name: 'Root endpoint' },
    { url: `${backendURL}/health`, name: 'Health check' },
    { url: `${backendURL}/api/v1/login`, name: 'API endpoint' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint.url, { timeout: 5000 });
      console.log(`✅ ${endpoint.name}: ${response.status}`);
      console.log(`   URL: ${endpoint.url}\n`);
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        console.log(`❌ ${endpoint.name}: NETWORK ERROR`);
        console.log(`   The backend is not reachable at: ${endpoint.url}`);
        console.log(`   This means the service is NOT deployed or is DOWN\n`);
      } else if (error.response) {
        console.log(`⚠️  ${endpoint.name}: ${error.response.status}`);
        console.log(`   URL is reachable but returned error\n`);
      } else {
        console.log(`❌ ${endpoint.name}: ${error.message}\n`);
      }
    }
  }

  console.log('\n📋 Next Steps:');
  console.log('1. Deploy backend to Render using the BACKEND_RENDER_DEPLOYMENT.md guide');
  console.log('2. Get your Render URL');
  console.log('3. Update frontend/src/services/apis.js with the new URL');
  console.log('4. Redeploy frontend to Vercel');
}

checkBackend();
