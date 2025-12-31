const webpush = require('web-push');
const fs = require('fs');

const keys = webpush.generateVAPIDKeys();

const envContent = `
# =====================================================
# Push Notifications (VAPID)
# Copy these lines to your .env.local file
# =====================================================
NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}
VAPID_PRIVATE_KEY=${keys.privateKey}
VAPID_SUBJECT=mailto:admin@infolokerjombang.net
`;

// Write to a readable file
fs.writeFileSync('VAPID_KEYS_COPY_THIS.txt', envContent);

console.log('========================================');
console.log('VAPID Keys Generated!');
console.log('========================================');
console.log('');
console.log('Copy the contents of VAPID_KEYS_COPY_THIS.txt');
console.log('and paste into your .env.local file');
console.log('');
console.log('========================================');
