// Test iLovePDF API connection
// Run: node scripts/test-ilovepdf.js

const axios = require('axios');

const PUBLIC_KEY = 'project_public_203a476595552effba308de8a1db2efc_mIZfAa73d45681bf631339a8c6eff5d249d8e';

async function testILovePDF() {
  console.log('🔍 Testing iLovePDF API...\n');
  
  try {
    // Step 1: Authenticate
    console.log('1️⃣ Testing authentication...');
    const authResponse = await axios.post('https://api.ilovepdf.com/v1/auth', {
      public_key: PUBLIC_KEY
    });
    
    console.log('✅ Authentication successful!');
    console.log('   Token:', authResponse.data.token.substring(0, 30) + '...');
    
    const token = authResponse.data.token;
    
    // Step 2: Start compress task
    console.log('\n2️⃣ Testing start compress task...');
    const startResponse = await axios.get('https://api.ilovepdf.com/v1/start/compress', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Task started successfully!');
    console.log('   Server:', startResponse.data.server);
    console.log('   Task ID:', startResponse.data.task);
    
    console.log('\n✅ iLovePDF API is working correctly!');
    console.log('\n📊 API Status:');
    console.log('   - Authentication: OK');
    console.log('   - Task creation: OK');
    console.log('   - Server assigned: OK');
    
  } catch (error) {
    console.error('\n❌ Error testing iLovePDF API:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data);
    } else {
      console.error('   ', error.message);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if PUBLIC_KEY is correct');
    console.log('   2. Check if API quota (250/month) not exceeded');
    console.log('   3. Visit: https://developer.ilovepdf.com/');
  }
}

testILovePDF();
