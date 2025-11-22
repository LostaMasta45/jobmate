// Generate base64 encoded logos for email embedding
const fs = require('fs');
const path = require('path');

const logoPanjang = fs.readFileSync(path.join(__dirname, '../public/Logo/logopanjang.png'));
const logoKecil = fs.readFileSync(path.join(__dirname, '../public/Logo/logokecil.png'));

const logoPanjangBase64 = 'data:image/png;base64,' + logoPanjang.toString('base64');
const logoKecilBase64 = 'data:image/png;base64,' + logoKecil.toString('base64');

console.log('='.repeat(80));
console.log('LOGO BASE64 - Ready for Email Embedding');
console.log('='.repeat(80));
console.log('\n📝 Copy these values to your email template:\n');

// Save to file for easy reference
const output = `// Logo Base64 - Generated: ${new Date().toISOString()}
// Use these base64 strings in email templates for guaranteed logo display

export const LOGO_PANJANG_BASE64 = "${logoPanjangBase64}";

export const LOGO_KECIL_BASE64 = "${logoKecilBase64}";

// Size info:
// - logopanjang.png: ${(logoPanjang.length / 1024).toFixed(2)} KB
// - logokecil.png: ${(logoKecil.length / 1024).toFixed(2)} KB
// - logopanjang base64: ${(logoPanjangBase64.length / 1024).toFixed(2)} KB
// - logokecil base64: ${(logoKecilBase64.length / 1024).toFixed(2)} KB
`;

fs.writeFileSync(path.join(__dirname, 'logo-base64.ts'), output);

console.log('✅ Saved to: scripts/logo-base64.ts');
console.log(`📊 Logo panjang size: ${(logoPanjang.length / 1024).toFixed(2)} KB`);
console.log(`📊 Logo kecil size: ${(logoKecil.length / 1024).toFixed(2)} KB`);
console.log(`📊 Base64 panjang: ${(logoPanjangBase64.length / 1024).toFixed(2)} KB`);
console.log(`📊 Base64 kecil: ${(logoKecilBase64.length / 1024).toFixed(2)} KB`);
console.log('\n' + '='.repeat(80));
