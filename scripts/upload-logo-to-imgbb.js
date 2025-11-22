// Upload logos to ImgBB for reliable email embedding
const fs = require('fs');
const path = require('path');
const https = require('https');

// ImgBB API - Free image hosting
// Get your API key from: https://api.imgbb.com/
const IMGBB_API_KEY = 'your-imgbb-api-key-here'; // User needs to get this

async function uploadToImgBB(imagePath, name) {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  
  const formData = new URLSearchParams();
  formData.append('key', IMGBB_API_KEY);
  formData.append('image', base64Image);
  formData.append('name', name);
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.imgbb.com',
      port: 443,
      path: '/1/upload',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(formData.toString())
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success) {
            resolve(response.data.url);
          } else {
            reject(new Error(response.error.message));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.write(formData.toString());
    req.end();
  });
}

async function main() {
  console.log('🚀 Uploading logos to ImgBB...\n');
  
  if (IMGBB_API_KEY === 'your-imgbb-api-key-here') {
    console.log('❌ Please set your ImgBB API key first!');
    console.log('📝 Get it from: https://api.imgbb.com/');
    console.log('💡 Then update IMGBB_API_KEY in this script\n');
    return;
  }
  
  try {
    // Upload logo panjang
    console.log('📤 Uploading logopanjang.png...');
    const logoPanjangUrl = await uploadToImgBB(
      path.join(__dirname, '../public/Logo/logopanjang.png'),
      'jobmate-logo-long'
    );
    console.log('✅ Logo panjang uploaded:', logoPanjangUrl);
    
    // Upload logo kecil
    console.log('\n📤 Uploading logokecil.png...');
    const logoKecilUrl = await uploadToImgBB(
      path.join(__dirname, '../public/Logo/logokecil.png'),
      'jobmate-logo-small'
    );
    console.log('✅ Logo kecil uploaded:', logoKecilUrl);
    
    // Save URLs to file
    const output = `// Logo URLs - Uploaded to ImgBB
// Generated: ${new Date().toISOString()}

export const LOGO_PANJANG_URL = "${logoPanjangUrl}";
export const LOGO_KECIL_URL = "${logoKecilUrl}";
`;
    
    fs.writeFileSync(path.join(__dirname, 'logo-urls.ts'), output);
    
    console.log('\n✅ URLs saved to: scripts/logo-urls.ts');
    console.log('\n📝 Update emails/InvoiceEmailTable.tsx with these URLs:');
    console.log(`const LOGO_PANJANG_URL = "${logoPanjangUrl}";`);
    console.log(`const LOGO_KECIL_URL = "${logoKecilUrl}";`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
