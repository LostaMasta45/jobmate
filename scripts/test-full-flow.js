// Test full PDF compress flow with iLovePDF
// Run: node scripts/test-full-flow.js

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PUBLIC_KEY = 'project_public_203a476595552effba308de8a1db2efc_mIZfAa73d45681bf631339a8c6eff5d249d8e';

async function testFullFlow() {
  console.log('🧪 Testing Full PDF Compress Flow...\n');
  
  try {
    // Step 1: Create a simple test PDF (just text)
    console.log('1️⃣ Creating test PDF...');
    const testPdfBuffer = Buffer.from(
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000115 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n211\n%%EOF',
      'binary'
    );
    console.log('✅ Test PDF created, size:', testPdfBuffer.length, 'bytes');
    
    // Step 2: Authenticate
    console.log('\n2️⃣ Authenticating...');
    const authResponse = await axios.post('https://api.ilovepdf.com/v1/auth', {
      public_key: PUBLIC_KEY
    });
    const token = authResponse.data.token;
    console.log('✅ Authentication successful');
    
    // Step 3: Start compress task
    console.log('\n3️⃣ Starting compress task...');
    const startResponse = await axios.get('https://api.ilovepdf.com/v1/start/compress', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { server, task } = startResponse.data;
    console.log('✅ Task started');
    console.log('   Server:', server);
    console.log('   Task ID:', task);
    
    // Step 4: Upload file
    console.log('\n4️⃣ Uploading PDF file...');
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('task', task);
    formData.append('file', testPdfBuffer, {
      filename: 'test.pdf',
      contentType: 'application/pdf'
    });
    
    const uploadResponse = await axios.post(
      `https://${server}/v1/upload`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    const uploadedFile = uploadResponse.data;
    console.log('✅ File uploaded');
    console.log('   Server filename:', uploadedFile.server_filename);
    
    // Step 5: Process (compress)
    console.log('\n5️⃣ Processing compression...');
    
    // CRITICAL: Per API docs, files array MUST include 'filename' (original filename)!
    const processBody = {
      task: task,
      tool: 'compress',  // REQUIRED
      compression_level: 'recommended',
      files: [{
        server_filename: uploadedFile.server_filename,
        filename: 'test.pdf'  // REQUIRED: Original filename
      }]
    };
    
    console.log('   Request body:', JSON.stringify(processBody, null, 2));
    
    const processResponse = await axios.post(
      `https://${server}/v1/process`,
      processBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Compression completed');
    console.log('   Download filename:', processResponse.data.download_filename);
    
    // Step 6: Download result
    console.log('\n6️⃣ Downloading compressed file...');
    const downloadResponse = await axios.get(
      `https://${server}/v1/download/${task}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer'
      }
    );
    
    const compressedBuffer = Buffer.from(downloadResponse.data);
    console.log('✅ File downloaded');
    console.log('   Original size:', testPdfBuffer.length, 'bytes');
    console.log('   Compressed size:', compressedBuffer.length, 'bytes');
    console.log('   Reduction:', Math.round((1 - compressedBuffer.length / testPdfBuffer.length) * 100), '%');
    
    console.log('\n✅ FULL FLOW TEST PASSED!\n');
    console.log('📊 Summary:');
    console.log('   - Authentication: OK');
    console.log('   - Task creation: OK');
    console.log('   - File upload: OK');
    console.log('   - Processing: OK');
    console.log('   - Download: OK');
    console.log('\n✨ iLovePDF API is working perfectly!\n');
    
  } catch (error) {
    console.error('\n❌ FULL FLOW TEST FAILED!\n');
    console.error('Error at step:', error.config?.url || 'unknown');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error message:', error.message);
    }
    
    console.log('\n🔧 This helps identify the exact failing point in the app!');
  }
}

testFullFlow();
