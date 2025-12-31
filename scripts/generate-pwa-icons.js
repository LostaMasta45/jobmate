const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputPath = path.join(__dirname, '../public/favicon.png');
const outputDir = path.join(__dirname, '../public/icons');

// Create output directory if not exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icons from favicon.png...');
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`Created: icon-${size}x${size}.png`);
  }
  
  // Create maskable icon (with padding for safe zone)
  const maskableOutputPath = path.join(outputDir, 'maskable-512x512.png');
  
  // Maskable icons need 10% padding on each side (80% safe zone)
  const safeZoneSize = Math.floor(512 * 0.8); // 409px
  
  await sharp(inputPath)
    .resize(safeZoneSize, safeZoneSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .extend({
      top: Math.floor((512 - safeZoneSize) / 2),
      bottom: Math.ceil((512 - safeZoneSize) / 2),
      left: Math.floor((512 - safeZoneSize) / 2),
      right: Math.ceil((512 - safeZoneSize) / 2),
      background: { r: 99, g: 102, b: 241, alpha: 1 } // indigo-500
    })
    .png()
    .toFile(maskableOutputPath);
  
  console.log('Created: maskable-512x512.png');
  console.log('Done! All icons generated.');
}

generateIcons().catch(console.error);
