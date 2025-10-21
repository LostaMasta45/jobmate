# 🚀 QUICK FIX - Port 3001

## ⚡ COPY & PASTE INI DI BROWSER CONSOLE

### Step 1: Buka http://localhost:3001
### Step 2: Press F12 → Tab "Console"
### Step 3: Paste & Press Enter:

```javascript
async function fixAll() {
  console.log('🚀 Fixing users on port 3001...');
  
  // Fix Losta - VIP Basic
  const losta = await fetch('http://localhost:3001/api/admin/force-update-membership', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'lostamasta.com@gmail.com',
      membership: 'vip_basic',
      days: 30
    })
  }).then(r => r.json());
  
  // Fix TestBasic - VIP Premium
  const testbasic = await fetch('http://localhost:3001/api/admin/force-update-membership', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'testbasic@example.com',
      membership: 'vip_premium'
    })
  }).then(r => r.json());
  
  console.log('📊 Results:');
  console.log('Losta:', losta.success ? '✅ SUCCESS' : '❌ FAILED', losta);
  console.log('TestBasic:', testbasic.success ? '✅ SUCCESS' : '❌ FAILED', testbasic);
  
  if (losta.success && testbasic.success) {
    alert('✅ FIXED! Users dapat logout dan login sekarang!');
  } else {
    alert('❌ Error! Check console.');
  }
}

fixAll();
```

## ✅ After Success:
1. Users **logout** dari aplikasi
2. Users **login** kembali
3. **DONE!** Should work now! 🎉

## 🔍 Verify (Optional):
```javascript
// Check Losta
fetch('http://localhost:3001/api/admin/force-update-membership?email=lostamasta.com@gmail.com')
  .then(r => r.json())
  .then(d => console.log('Losta:', d.data));

// Check TestBasic
fetch('http://localhost:3001/api/admin/force-update-membership?email=testbasic@example.com')
  .then(r => r.json())
  .then(d => console.log('TestBasic:', d.data));
```

**Expected:**
```
Losta: { membership: "vip_basic", membership_status: "active" }
TestBasic: { membership: "vip_premium", membership_status: "active" }
```

---

**That's it! Port sudah diganti ke 3001.** 🚀
