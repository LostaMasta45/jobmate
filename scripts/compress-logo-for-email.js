// Compress logos for email - Target: < 50KB for fast loading
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compressLogo() {
  console.log('🖼️  Compressing logos for email...\n');
  
  const inputDir = path.join(__dirname, '../public/Logo');
  const outputDir = path.join(__dirname, '../public/Logo/optimized');
  
  // Create output directory if not exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    // Compress logo panjang (header)
    console.log('📤 Compressing logopanjang.png...');
    const logoPanjangInput = path.join(inputDir, 'logopanjang.png');
    const logoPanjangOutput = path.join(outputDir, 'logopanjang-email.png');
    
    const statBefore1 = fs.statSync(logoPanjangInput);
    console.log(`   Before: ${(statBefore1.size / 1024).toFixed(2)} KB`);
    
    await sharp(logoPanjangInput)
      .resize(560, 140, { // 2x size for retina displays (280x70 actual)
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({
        quality: 90,
        compressionLevel: 9,
        palette: true, // Use palette-based compression
        effort: 10 // Maximum compression effort
      })
      .toFile(logoPanjangOutput);
    
    const statAfter1 = fs.statSync(logoPanjangOutput);
    const reduction1 = ((1 - statAfter1.size / statBefore1.size) * 100).toFixed(1);
    console.log(`   After:  ${(statAfter1.size / 1024).toFixed(2)} KB`);
    console.log(`   ✅ Reduced by ${reduction1}%\n`);
    
    // Compress logo kecil (footer)
    console.log('📤 Compressing logokecil.png...');
    const logoKecilInput = path.join(inputDir, 'logokecil.png');
    const logoKecilOutput = path.join(outputDir, 'logokecil-email.png');
    
    const statBefore2 = fs.statSync(logoKecilInput);
    console.log(`   Before: ${(statBefore2.size / 1024).toFixed(2)} KB`);
    
    await sharp(logoKecilInput)
      .resize(96, 96, { // 2x size for retina (48x48 actual)
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({
        quality: 90,
        compressionLevel: 9,
        palette: true,
        effort: 10
      })
      .toFile(logoKecilOutput);
    
    const statAfter2 = fs.statSync(logoKecilOutput);
    const reduction2 = ((1 - statAfter2.size / statBefore2.size) * 100).toFixed(1);
    console.log(`   After:  ${(statAfter2.size / 1024).toFixed(2)} KB`);
    console.log(`   ✅ Reduced by ${reduction2}%\n`);
    
    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 COMPRESSION SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\nOriginal Total:  ${((statBefore1.size + statBefore2.size) / 1024).toFixed(2)} KB`);
    console.log(`Optimized Total: ${((statAfter1.size + statAfter2.size) / 1024).toFixed(2)} KB`);
    console.log(`Total Savings:   ${((statBefore1.size + statBefore2.size - statAfter1.size - statAfter2.size) / 1024).toFixed(2)} KB`);
    
    const totalReduction = ((1 - (statAfter1.size + statAfter2.size) / (statBefore1.size + statBefore2.size)) * 100).toFixed(1);
    console.log(`Overall:         ${totalReduction}% smaller! 🎉\n`);
    
    console.log('✅ Compressed logos saved to:');
    console.log(`   ${outputDir}/logopanjang-email.png`);
    console.log(`   ${outputDir}/logokecil-email.png`);
    console.log('\n💡 Next step: Upload these to Imgur and update email template!\n');
    
  } catch (error) {
    console.error('❌ Error compressing logos:', error.message);
    
    if (error.message.includes('sharp')) {
      console.log('\n📦 Installing sharp...');
      console.log('Run: npm install sharp\n');
    }
  }
}

compressLogo();
