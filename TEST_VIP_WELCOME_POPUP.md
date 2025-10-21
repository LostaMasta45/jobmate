# Test VIP Welcome Popup - Console Scripts

## 🔍 Script untuk Test Popup

### **1. Reset & Show Welcome Popup**

Paste di browser console (F12):

```javascript
// Reset welcome popup (force show on next reload)
localStorage.removeItem('vip_welcome_seen');
console.log('✅ Welcome popup reset - akan muncul saat reload');
location.reload();
```

---

### **2. Check Membership dari Client Side**

```javascript
// Check user membership status
const checkMembership = async () => {
  try {
    // Get from page data
    const welcomeBox = document.querySelector('[class*="gradient"]');
    const badge = welcomeBox?.querySelector('[class*="badge"]')?.textContent;
    
    console.log('📊 UI Info:');
    console.log('Badge text:', badge);
    console.log('Contains "VIP Basic":', badge?.includes('VIP Basic'));
    console.log('Contains "VIP Premium":', badge?.includes('VIP Premium'));
    
    // Check if upgrade section exists in popup
    const dialog = document.querySelector('[role="dialog"]');
    if (dialog) {
      const upgradeSection = dialog.textContent?.includes('Upgrade ke VIP Premium');
      const toolsList = dialog.textContent?.includes('Surat Lamaran AI');
      
      console.log('\n🎯 Popup Content:');
      console.log('Has upgrade section:', upgradeSection);
      console.log('Has tools list:', toolsList);
      console.log('Dialog text preview:', dialog.textContent?.substring(0, 200));
    } else {
      console.log('\n⚠️ Popup not visible - run reset script first');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

checkMembership();
```

---

### **3. Force Show Popup (Without Reload)**

```javascript
// Manually trigger popup show
localStorage.removeItem('vip_welcome_seen');
console.log('✅ Popup reset - refresh page atau click tombol dialog');
```

---

### **4. Check All Upgrade Elements**

```javascript
// Check if VIP Basic user sees upgrade prompts
const checkUpgradeUI = () => {
  console.log('🔍 Checking VIP Basic Upgrade UI Elements...\n');
  
  // 1. Check welcome banner badge
  const badge = document.querySelector('[class*="VIP"]')?.textContent;
  console.log('1. Banner Badge:', badge || 'Not found');
  
  // 2. Check upgrade box on dashboard
  const upgradeBox = document.body.textContent?.includes('Upgrade ke VIP Premium');
  console.log('2. Dashboard Upgrade Box:', upgradeBox ? '✅ Found' : '❌ Not found');
  
  // 3. Check sidebar Tools Jobmate
  const toolsSection = document.body.textContent?.includes('Tools Jobmate');
  console.log('3. Sidebar Tools Section:', toolsSection ? '✅ Found' : '❌ Not found');
  
  // 4. Check popup dialog
  const dialog = document.querySelector('[role="dialog"]');
  if (dialog) {
    const hasUpgrade = dialog.textContent?.includes('Upgrade ke VIP Premium');
    const hasToolsList = dialog.textContent?.includes('Yang kamu dapatkan');
    console.log('4. Popup Upgrade Info:', hasUpgrade ? '✅ Found' : '❌ Not found');
    console.log('5. Popup Tools List:', hasToolsList ? '✅ Found' : '❌ Not found');
  } else {
    console.log('4. Popup:', '⚠️ Not visible (reset to see)');
  }
  
  console.log('\n📋 Summary:');
  console.log(upgradeBox && toolsSection ? '✅ VIP Basic UI Complete' : '⚠️ Some elements missing');
};

checkUpgradeUI();
```

---

## 🎯 Expected Results

### **For VIP Basic User:**

```javascript
✅ Welcome popup reset - akan muncul saat reload

📊 UI Info:
Badge text: VIP Basic
Contains "VIP Basic": true
Contains "VIP Premium": false

🎯 Popup Content:
Has upgrade section: true
Has tools list: true
Dialog text: "Selamat Pagi, Losta Masta! 👋 ... Upgrade ke VIP Premium (Lifetime) ..."

🔍 Checking VIP Basic Upgrade UI Elements...
1. Banner Badge: VIP Basic
2. Dashboard Upgrade Box: ✅ Found
3. Sidebar Tools Section: ✅ Found
4. Popup Upgrade Info: ✅ Found
5. Popup Tools List: ✅ Found

📋 Summary: ✅ VIP Basic UI Complete
```

---

### **For VIP Premium User:**

```javascript
📊 UI Info:
Badge text: VIP Premium
Contains "VIP Basic": false
Contains "VIP Premium": true

🎯 Popup Content:
Has upgrade section: false
Has tools list: false
Dialog text: "Selamat Pagi, Test Basic! 👋 ... Akses penuh tanpa batas ..."

🔍 Checking VIP Premium UI Elements...
1. Banner Badge: VIP Premium
2. Dashboard Upgrade Box: ❌ Not found (correct for Premium)
3. Sidebar Tools Section: ✅ Found (JobMate Tools link)
4. Popup Upgrade Info: ❌ Not found (correct for Premium)

📋 Summary: ✅ VIP Premium UI Complete
```

---

## 🚀 Quick Test Flow

1. **Open browser console** (F12)
2. **Paste reset script:**
   ```javascript
   localStorage.removeItem('vip_welcome_seen');
   location.reload();
   ```
3. **Wait for page reload**
4. **Popup should appear automatically**
5. **Check content:**
   - VIP Basic → Should see upgrade section with 6 tools
   - VIP Premium → Should NOT see upgrade section

---

## 📝 Debug Commands

### **If popup doesn't show:**

```javascript
// Force clear all vip-related storage
Object.keys(localStorage)
  .filter(key => key.includes('vip') || key.includes('welcome'))
  .forEach(key => localStorage.removeItem(key));
console.log('✅ All VIP storage cleared');
location.reload();
```

### **Check localStorage state:**

```javascript
// View all stored data
console.log('📦 LocalStorage VIP keys:');
Object.keys(localStorage)
  .filter(key => key.includes('vip') || key.includes('welcome'))
  .forEach(key => {
    console.log(`  ${key}:`, localStorage.getItem(key));
  });
```

---

## 🎨 Visual Test Checklist

### **VIP Basic User Popup:**
```
┌────────────────────────────────────────┐
│ 🎉 Selamat Pagi, Losta Masta!         │
│                                        │
│ ✓ Loker Asli Daerah Jombang          │
│ ✓ Job Alerts Otomatis                 │
│ ✓ Detail Lengkap & Kontak Langsung   │
│                                        │
│ 🎁 Upgrade ke VIP Premium (Lifetime)  │
│                                        │
│ Yang kamu dapatkan:                    │
│ ✓ Surat Lamaran AI Generator          │
│ ✓ CV ATS Optimizer                    │
│ ✓ Email Generator & Follow-up AI      │
│ ✓ Job Application Tracker             │
│ ✓ PDF Tools                            │
│ ✓ WhatsApp Message Generator          │
│                                        │
│ [Hubungi Admin untuk Upgrade]         │
│ [Mulai Cari Loker 🚀]                 │
└────────────────────────────────────────┘
```

### **VIP Premium User Popup:**
```
┌────────────────────────────────────────┐
│ 🎉 Selamat Pagi, Test Basic!          │
│                                        │
│ ✓ Loker Asli Daerah Jombang          │
│ ✓ Job Alerts Otomatis                 │
│ ✓ Detail Lengkap & Kontak Langsung   │
│                                        │
│ (NO upgrade section)                   │
│                                        │
│ [Mulai Cari Loker 🚀]                 │
└────────────────────────────────────────┘
```

---

**Status:** Ready to test! Copy-paste scripts above to browser console.
