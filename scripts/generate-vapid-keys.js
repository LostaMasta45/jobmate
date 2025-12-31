const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

const keys = webpush.generateVAPIDKeys();

console.log('Generated VAPID Keys');
console.log('====================');

// Read existing .env.local
const envPath = path.join(__dirname, '.env.local');
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Check if VAPID keys already exist
if (envContent.includes('NEXT_PUBLIC_VAPID_PUBLIC_KEY')) {
  console.log('VAPID keys already exist in .env.local');
} else {
  // Append VAPID keys
  const vapidConfig = `
# Push Notifications (VAPID)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}
VAPID_PRIVATE_KEY=${keys.privateKey}
VAPID_SUBJECT=mailto:admin@infolokerjombang.net
`;
  
  fs.appendFileSync(envPath, vapidConfig);
  console.log('VAPID keys added to .env.local');
}

// Also output keys for Vercel config
console.log('');
console.log('For Vercel Environment Variables:');
console.log('NEXT_PUBLIC_VAPID_PUBLIC_KEY=' + keys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + keys.privateKey);
console.log('VAPID_SUBJECT=mailto:admin@infolokerjombang.net');
