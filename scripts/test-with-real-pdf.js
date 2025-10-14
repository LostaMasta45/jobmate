// Test with REAL PDF file
// USAGE: 
// 1. Put a real PDF file (>500KB) in the scripts folder, name it "test.pdf"
// 2. Run: node scripts/test-with-real-pdf.js

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const PUBLIC_KEY = 'project_public_203a476595552effba308de8a1db2efc_mIZfAa73d45681bf631339a8c6eff5d249d8e';

async function testWithRealPDF() {
  console.log('🧪 Testing with REAL PDF File...\n');
  
  try {
    // Check if test.pdf exists
    const testPdfPath = path.join(__dirname, 'test.pdf');
    
    if (!fs.existsSync(testPdfPath)) {
      console.log('❌ ERROR: test.pdf not found!');
      console.log('\n📝 INSTRUCTIONS:');
      console.log('1. Put a REAL PDF file (any PDF from your computer) in:');
      console.log('   C:\\Users\\user\\Music\\JOBMATE\\scripts\\test.pdf');
      console.log('2. Make sure file size > 500KB');
      console.log('3. Run this script again');
      console.log('\nYou can use any PDF: CV, document, anything!');
      return;
    }
    
    // Read the real PDF
    const pdfBuffer = fs.readFileSync(testPdfPath);
    const pdfSizeKB = (pdfBuffer.length / 1024).toFixed(2);
    
    console.log('✅ Found test.pdf');
    console.log('   Size:', pdfSizeKB, 'KB');
    console.log('   Bytes:', pdfBuffer.length);
    
    if (pdfBuffer.length < 100) {
      console.log('\n⚠️ WARNING: File too small! Use a real PDF (>500KB)');
      return;
    }
    
    console.log('\n1️⃣ Authenticating...');
    const authResponse = await axios.post('https://api.ilovepdf.com/v1/auth', {
      public_key: PUBLIC_KEY
    });
    const token = authResponse.data.token;
    console.log('✅ Authentication successful');
    
    console.log('\n2️⃣ Starting compress task...');
    const startResponse = await axios.get('https://api.ilovepdf.com/v1/start/compress', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { server, task } = startResponse.data;
    console.log('✅ Task started');
    console.log('   Server:', server);
    
    console.log('\n3️⃣ Uploading REAL PDF...');
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('task', task);
    formData.append('file', pdfBuffer, {
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
    
    console.log('\n4️⃣ Processing compression...');
    const processBody = {
      task: task,
      compression_level: 'recommended',
      files: [uploadedFile]
    };
    
    console.log('   Request:', JSON.stringify(processBody, null, 2));
    
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
    
    console.log('✅ Compression completed!');
    console.log('   Result:', processResponse.data);
    
    console.log('\n5️⃣ Downloading compressed PDF...');
    const downloadResponse = await axios.get(
      `https://${server}/v1/download/${task}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer'
      }
    );
    
    const compressedBuffer = Buffer.from(downloadResponse.data);
    const compressedSizeKB = (compressedBuffer.length / 1024).toFixed(2);
    const reduction = Math.round((1 - compressedBuffer.length / pdfBuffer.length) * 100);
    
    console.log('✅ Downloaded!');
    console.log('   Original:', pdfSizeKB, 'KB');
    console.log('   Compressed:', compressedSizeKB, 'KB');
    console.log('   Reduction:', reduction, '%');
    
    // Save result
    const outputPath = path.join(__dirname, 'test-compressed.pdf');
    fs.writeFileSync(outputPath, compressedBuffer);
    console.log('   Saved to:', outputPath);
    
    console.log('\n✅ ✅ ✅ SUCCESS! iLovePDF API WORKS! ✅ ✅ ✅\n');
    console.log('🎉 The app should work now with REAL PDF files!');
    console.log('🎉 Test PDF was too small - that was the issue!');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED!\n');
    console.error('Error at:', error.config?.url || 'unknown');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Message:', error.message);
    }
    
    console.log('\n💡 TIP: Make sure test.pdf is a REAL, valid PDF file (not tiny test file)');
  }
}

testWithRealPDF();
