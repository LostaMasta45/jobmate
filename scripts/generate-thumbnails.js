/**
 * Script untuk generate thumbnail template surat lamaran
 * 
 * CARA PAKAI:
 * 1. Install dependencies: npm install puppeteer
 * 2. Start dev server: npm run dev (di terminal lain)
 * 3. Run script: node scripts/generate-thumbnails.js
 * 
 * Script ini akan:
 * - Buka halaman /generate-thumbnails di browser
 * - Screenshot setiap template
 * - Simpan ke /public/Template/template-X.png
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'Template');
const TEMPLATES = Array.from({ length: 20 }, (_, i) => `template-${i + 1}`);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateThumbnails() {
  console.log('🚀 Starting thumbnail generation...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to ensure consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1800,
      deviceScaleFactor: 2 // Higher quality
    });

    console.log('📱 Opening generate-thumbnails page...');
    await page.goto(`${BASE_URL}/generate-thumbnails`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    console.log('✅ Page loaded successfully\n');

    // Generate thumbnail for each template
    for (const templateId of TEMPLATES) {
      try {
        console.log(`📸 Capturing ${templateId}...`);
        
        const elementId = `preview-${templateId}`;
        const element = await page.$(`#${elementId}`);
        
        if (!element) {
          console.log(`⚠️  Element #${elementId} not found, skipping...`);
          continue;
        }

        // Screenshot the specific template preview
        const outputPath = path.join(OUTPUT_DIR, `${templateId}.png`);
        await element.screenshot({
          path: outputPath,
          type: 'png'
        });

        console.log(`   ✅ Saved to ${outputPath}`);
        
        // Small delay to prevent overwhelming the page
        await page.waitForTimeout(500);
        
      } catch (error) {
        console.error(`   ❌ Error capturing ${templateId}:`, error.message);
      }
    }

    console.log('\n✨ Thumbnail generation completed!');
    console.log(`📁 Check files in: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await browser.close();
  }
}

// Main execution
(async () => {
  try {
    // Check if dev server is running
    const http = require('http');
    const checkServer = () => new Promise((resolve) => {
      const req = http.get(BASE_URL, (res) => {
        resolve(true);
        req.destroy();
      });
      req.on('error', () => resolve(false));
      req.setTimeout(3000);
    });

    const serverRunning = await checkServer();
    
    if (!serverRunning) {
      console.error('❌ Dev server is not running!');
      console.error('   Please start it first: npm run dev');
      process.exit(1);
    }

    await generateThumbnails();
    
  } catch (error) {
    console.error('❌ Script error:', error);
    process.exit(1);
  }
})();
