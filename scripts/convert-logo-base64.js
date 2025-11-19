const fs = require('fs');
const path = require('path');

// Read logo file
const logoPath = path.join(__dirname, '../public/Logo/logopanjang.png');
const logoBuffer = fs.readFileSync(logoPath);

// Convert to base64
const logoBase64 = logoBuffer.toString('base64');

// Create data URL
const logoDataUrl = `data:image/png;base64,${logoBase64}`;

console.log('\n✅ Logo converted to base64!\n');
console.log('📏 File size:', Math.round(logoBuffer.length / 1024), 'KB');
console.log('📏 Base64 size:', Math.round(logoBase64.length / 1024), 'KB');
console.log('\n📋 Copy this to your email template:\n');
console.log('─'.repeat(80));
console.log(logoDataUrl.substring(0, 100) + '...');
console.log('─'.repeat(80));

// Save to file
const outputPath = path.join(__dirname, 'logo-base64.txt');
fs.writeFileSync(outputPath, logoDataUrl);
console.log('\n💾 Full base64 saved to:', outputPath);
console.log('\n✨ Done!\n');
