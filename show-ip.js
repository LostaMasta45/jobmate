// Script untuk menampilkan IP address untuk mobile access
const os = require('os');
const interfaces = os.networkInterfaces();

console.log('\n========================================');
console.log('  📱 MOBILE ACCESS URL');
console.log('========================================\n');

let found = false;

Object.keys(interfaces).forEach(name => {
  interfaces[name].forEach(iface => {
    // Skip internal (loopback) dan non-IPv4
    if (iface.family === 'IPv4' && !iface.internal) {
      // Prioritas untuk 192.168.x.x (WiFi biasanya)
      if (iface.address.startsWith('192.168')) {
        console.log(`🎯 [RECOMMENDED] Buka di HP:`);
        console.log(`   http://${iface.address}:3000\n`);
        found = true;
      } else {
        console.log(`ℹ️  [${name}]: http://${iface.address}:3000`);
      }
    }
  });
});

if (!found) {
  console.log('⚠️  Tidak menemukan IP 192.168.x.x');
  console.log('   Gunakan salah satu IP di atas\n');
}

console.log('========================================');
console.log('Pastikan HP dan laptop di WiFi yang sama!');
console.log('========================================\n');
