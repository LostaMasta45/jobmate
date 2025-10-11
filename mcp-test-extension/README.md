# MCP Chrome Test Extension

Extension sederhana untuk test MCP Chrome Bridge Native Messaging.

## Cara Install Extension:

1. Buka Chrome
2. Ketik di address bar: `chrome://extensions/`
3. Aktifkan **"Developer mode"** (toggle di kanan atas)
4. Klik **"Load unpacked"**
5. Pilih folder: `C:\Users\user\Music\JOBMATE\mcp-test-extension`
6. Extension akan muncul dengan nama **"MCP Chrome Test Extension"**

## Cara Menggunakan:

1. Klik icon extension di toolbar Chrome (atau klik Extensions icon → MCP Chrome Test Extension)
2. Popup akan terbuka dengan UI test
3. Klik **"Connect to Native Host"**
4. Jika berhasil, status akan berubah menjadi **"Connected"**
5. Test dengan button:
   - **Send Ping** - Kirim ping message
   - **MCP Initialize** - Kirim MCP protocol initialize
   - **Send Test Message** - Kirim test message custom
6. Lihat response di **Log** section

## Troubleshooting:

Jika gagal connect dengan error "not found":

1. Cek instalasi:
   ```bash
   npm list -g mcp-chrome-bridge
   ```

2. Register ulang:
   ```bash
   npx mcp-chrome-bridge register
   ```

3. Restart Chrome

4. Cek registry (Windows):
   ```bash
   reg query "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.chromemcp.nativehost"
   ```

## File Structure:

- `manifest.json` - Konfigurasi extension
- `popup.html` - UI popup
- `popup.js` - Logic untuk test MCP
- `background.js` - Background service worker
- `README.md` - Dokumentasi ini
