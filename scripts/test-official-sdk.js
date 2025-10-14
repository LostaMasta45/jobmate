// Test official iLovePDF SDK
// Run: node scripts/test-official-sdk.js

const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const fs = require('fs');

const PUBLIC_KEY = 'project_public_fa1dce6798894535b5cd082c0a8684dd_kYQjM6f1f2428afa806b693d33f63f8a9ecd8';
const SECRET_KEY = 'secret_key_e5ab451ba8a4c44e27be1d3ea3aece59_-Qc-Jad36a6d0a84b10be065dd9b3e865c7b8';

async function testOfficialSDK() {
  console.log('🧪 Testing Official iLovePDF SDK...\n');
  
  try {
    // Create instance
    const instance = new ILovePDFApi(PUBLIC_KEY, SECRET_KEY);
    console.log('✅ SDK instance created');
    
    // Create a simple but valid PDF
    const testPdf = Buffer.from(
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000115 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n211\n%%EOF',
      'binary'
    );
    console.log('✅ Test PDF created:', testPdf.length, 'bytes\n');
    
    // Test compress
    console.log('1️⃣ Testing COMPRESS...');
    const compressTask = instance.newTask('compress');
    await compressTask.addFile(testPdf, 'test.pdf');
    compressTask.setCompressionLevel('recommended');
    
    console.log('   Processing...');
    await compressTask.process();
    
    console.log('   Downloading...');
    const compressed = await compressTask.download();
    
    console.log('✅ COMPRESS works!');
    console.log('   Result:', compressed.length, 'bytes\n');
    
    // Test merge (need 2 files)
    console.log('2️⃣ Testing MERGE...');
    const mergeTask = instance.newTask('merge');
    await mergeTask.addFile(testPdf, 'file1.pdf');
    await mergeTask.addFile(testPdf, 'file2.pdf');
    
    console.log('   Processing...');
    await mergeTask.process();
    
    console.log('   Downloading...');
    const merged = await mergeTask.download();
    
    console.log('✅ MERGE works!');
    console.log('   Result:', merged.length, 'bytes\n');
    
    console.log('🎉 ALL TESTS PASSED!\n');
    console.log('✅ Official SDK is working perfectly');
    console.log('✅ Your API credentials are valid');
    console.log('✅ Ready to use in the app!');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED!\n');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    console.error('\nStack:', error.stack);
  }
}

testOfficialSDK();
