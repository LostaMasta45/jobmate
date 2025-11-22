const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function compressLogo() {
  try {
    const logoPath = path.join(__dirname, '../public/Logo/logopanjang.png');
    const outputPath = path.join(__dirname, 'logo-compressed.png');
    
    console.log('\n🖼️  Loading logo...');
    const image = await loadImage(logoPath);
    
    // Create canvas with smaller size (reduce to 300px width)
    const targetWidth = 300;
    const targetHeight = Math.round((image.height / image.width) * targetWidth);
    
    const canvas = createCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');
    
    // Draw image scaled down
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
    
    // Save compressed PNG
    const buffer = canvas.toBuffer('image/png', { compressionLevel: 9 });
    fs.writeFileSync(outputPath, buffer);
    
    // Convert to base64
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;
    
    console.log('✅ Logo compressed!\n');
    console.log('📏 Original size:', Math.round(fs.statSync(logoPath).size / 1024), 'KB');
    console.log('📏 Compressed size:', Math.round(buffer.length / 1024), 'KB');
    console.log('📏 Reduction:', Math.round((1 - buffer.length / fs.statSync(logoPath).size) * 100), '%\n');
    
    // Save base64 to file
    fs.writeFileSync(path.join(__dirname, 'logo-base64-compressed.txt'), dataUrl);
    console.log('💾 Saved to: logo-base64-compressed.txt\n');
    console.log('✨ Copy the content and use in email template!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Canvas package not installed. Installing...\n');
    console.log('Run: npm install canvas\n');
  }
}

compressLogo();
