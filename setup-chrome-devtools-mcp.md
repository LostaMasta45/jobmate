# Setup Chrome DevTools MCP untuk VS Code

## 📋 Langkah Install (MUDAH - 2 Menit):

### **Opsi 1: Otomatis via Command (Recommended)**

1. **Tutup VS Code** (penting!)

2. **Jalankan di terminal**:
   ```bash
   code --add-mcp "{\"name\":\"chrome-devtools\",\"command\":\"npx\",\"args\":[\"chrome-devtools-mcp@latest\"]}"
   ```

3. **Buka VS Code lagi**

---

### **Opsi 2: Manual Setup (Jika Opsi 1 Gagal)**

#### **Step 1: Buka VS Code Settings**
- Tekan `Ctrl + Shift + P` (Command Palette)
- Ketik: `Preferences: Open User Settings (JSON)`
- Atau buka: `File` → `Preferences` → `Settings` → Klik icon `{}` (kanan atas) untuk buka `settings.json`

#### **Step 2: Tambahkan Konfigurasi MCP**

Di file `settings.json`, tambahkan konfigurasi ini:

```json
{
  "github.copilot.chat.mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

**⚠️ PENTING:**
- Jika sudah ada `"github.copilot.chat.mcpServers"`, tambahkan `"chrome-devtools"` di dalamnya saja
- Jika `settings.json` sudah ada config lain, tambahkan dengan koma (,) yang benar

**Contoh lengkap jika sudah ada config:**
```json
{
  "editor.fontSize": 14,
  "files.autoSave": "afterDelay",
  "github.copilot.chat.mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

#### **Step 3: Reload VS Code**
- Tekan `Ctrl + Shift + P`
- Ketik: `Developer: Reload Window`
- Atau restart VS Code

---

## ✅ Verifikasi Setup:

1. **Buka Copilot Chat** di VS Code (icon chat di sidebar atau `Ctrl + Alt + I`)

2. **Ketik prompt test**:
   ```
   Check the performance of https://google.com
   ```
   atau
   ```
   Open Chrome and navigate to https://example.com then take a screenshot
   ```

3. **Hasilnya**:
   - ✅ **Berhasil**: Chrome akan terbuka otomatis, Copilot akan melakukan test
   - ❌ **Gagal**: Lihat troubleshooting di bawah

---

## 🔧 Troubleshooting:

### Error: "MCP server not found"

**Solusi 1**: Pastikan Node.js v20+ terinstall
```bash
node --version
```

**Solusi 2**: Test manual chrome-devtools-mcp
```bash
npx chrome-devtools-mcp@latest --help
```

**Solusi 3**: Clear npm cache
```bash
npm cache clean --force
```

### Error: "Chrome not found"

**Solusi**: Install Chrome terbaru
- Download: https://www.google.com/chrome/

### MCP Server tidak muncul di Copilot

**Solusi**:
1. Restart VS Code
2. Check VS Code Output panel (View → Output → pilih "GitHub Copilot Chat")
3. Cari error messages

---

## 🎯 Contoh Prompt yang Bisa Digunakan:

```
Check the performance of https://developers.chrome.com
```

```
Open https://github.com and take a screenshot
```

```
Navigate to https://example.com, click the "More information" link, and take a screenshot
```

```
Test form submission on https://httpbin.org/forms/post
```

```
Get console logs from https://example.com
```

```
Analyze network requests for https://example.com
```

---

## 📖 Tools Available:

Chrome DevTools MCP memberikan tools untuk:

- **Navigation**: navigate_page, new_page, close_page, wait_for
- **Input**: click, fill, hover, drag, upload_file
- **Debugging**: take_screenshot, evaluate_script, list_console_messages
- **Performance**: performance_start_trace, performance_stop_trace, performance_analyze_insight
- **Network**: list_network_requests, get_network_request
- **Emulation**: emulate_cpu, emulate_network, resize_page

Full documentation: https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md

---

## 🧹 Cleanup (Opsional):

Jika ingin uninstall mcp-chrome-bridge yang lama:

```bash
npm uninstall -g mcp-chrome-bridge
```

Hapus registry entry (optional):
```bash
reg delete "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.chromemcp.nativehost" /f
```

---

## ✨ Keuntungan chrome-devtools-mcp:

✅ **Tidak perlu Chrome Extension**
✅ **Tidak perlu Native Messaging setup**
✅ **Install sekali, langsung kerja**
✅ **Official dari Chrome DevTools team**
✅ **Support semua AI coding agents** (Copilot, Claude, Cursor, Gemini, dll)
✅ **Auto-start Chrome** saat diperlukan

---

**Selamat menggunakan Chrome DevTools MCP! 🎉**
