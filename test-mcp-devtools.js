// ============================================
// MCP Chrome Bridge - Test Script
// ============================================
// 
// CARA MENGGUNAKAN:
// 1. Buka Chrome dan pastikan extension MCP sudah terinstall
// 2. Buka halaman apapun di Chrome
// 3. Tekan F12 untuk membuka DevTools
// 4. Pilih tab "Console"
// 5. Copy dan paste script ini ke Console
// 6. Tekan Enter
// 
// ============================================

console.log('%c🧪 MCP Chrome Bridge Test Started', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
console.log('%cExtension ID: hbdgbgagpkpjffpklnamcljpakneikee', 'color: #2196F3;');
console.log('%cNative Host: com.chromemcp.nativehost', 'color: #2196F3;');
console.log('─'.repeat(60));

// Test 1: Check Chrome Runtime API
console.log('\n%c📋 Test 1: Chrome Runtime API', 'color: #FF9800; font-weight: bold;');
if (typeof chrome !== 'undefined' && chrome.runtime) {
    console.log('%c✅ Chrome runtime API available', 'color: #4CAF50;');
    console.log('Extension ID:', chrome.runtime.id || 'Not in extension context');
} else {
    console.log('%c❌ Chrome runtime API not available', 'color: #f44336;');
}

// Test 2: Test Native Messaging Connection
console.log('\n%c🔌 Test 2: Native Messaging Connection', 'color: #FF9800; font-weight: bold;');

try {
    const port = chrome.runtime.connectNative('com.chromemcp.nativehost');
    
    console.log('%c✅ Native Messaging port created', 'color: #4CAF50;');
    
    // Message listener
    port.onMessage.addListener((message) => {
        console.log('%c📨 Received from Native Host:', 'color: #4CAF50; font-weight: bold;');
        console.log(JSON.stringify(message, null, 2));
    });
    
    // Disconnect listener
    port.onDisconnect.addListener(() => {
        if (chrome.runtime.lastError) {
            console.log('%c❌ Native Host disconnected with error:', 'color: #f44336; font-weight: bold;');
            console.error(chrome.runtime.lastError.message);
            
            // Common errors and solutions
            if (chrome.runtime.lastError.message.includes('not found')) {
                console.log('\n%c💡 Solusi:', 'color: #FF9800; font-weight: bold;');
                console.log('1. Pastikan mcp-chrome-bridge sudah terinstall: npm list -g mcp-chrome-bridge');
                console.log('2. Register ulang: npx mcp-chrome-bridge register');
                console.log('3. Restart Chrome setelah register');
            }
        } else {
            console.log('%c✅ Native Host connection closed gracefully', 'color: #4CAF50;');
        }
    });
    
    // Test 3: Send Ping Message
    console.log('\n%c📤 Test 3: Sending Ping Message', 'color: #FF9800; font-weight: bold;');
    setTimeout(() => {
        try {
            port.postMessage({
                type: 'ping',
                timestamp: Date.now()
            });
            console.log('%c✅ Ping message sent', 'color: #4CAF50;');
        } catch (error) {
            console.log('%c❌ Failed to send ping:', 'color: #f44336;');
            console.error(error);
        }
    }, 500);
    
    // Test 4: Send MCP Protocol Message
    console.log('\n%c🔧 Test 4: MCP Protocol Initialize', 'color: #FF9800; font-weight: bold;');
    setTimeout(() => {
        try {
            port.postMessage({
                jsonrpc: '2.0',
                method: 'initialize',
                params: {
                    protocolVersion: '1.0.0',
                    capabilities: {
                        roots: {
                            listChanged: true
                        }
                    },
                    clientInfo: {
                        name: 'test-client',
                        version: '1.0.0'
                    }
                },
                id: 1
            });
            console.log('%c✅ MCP initialize message sent', 'color: #4CAF50;');
        } catch (error) {
            console.log('%c❌ Failed to send MCP message:', 'color: #f44336;');
            console.error(error);
        }
    }, 1000);
    
    // Keep port reference for manual testing
    window.mcpPort = port;
    console.log('\n%c💡 Tip: Port tersimpan di window.mcpPort untuk testing manual', 'color: #2196F3;');
    console.log('Contoh: window.mcpPort.postMessage({type: "test", data: "hello"})');
    
} catch (error) {
    console.log('%c❌ Error connecting to Native Host:', 'color: #f44336; font-weight: bold;');
    console.error(error);
    
    console.log('\n%c📋 Troubleshooting:', 'color: #FF9800; font-weight: bold;');
    console.log('1. Cek apakah mcp-chrome-bridge terinstall:');
    console.log('   npm list -g mcp-chrome-bridge');
    console.log('2. Register Native Messaging Host:');
    console.log('   npx mcp-chrome-bridge register');
    console.log('3. Cek registry Windows:');
    console.log('   reg query "HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\com.chromemcp.nativehost"');
    console.log('4. Restart Chrome setelah register');
}

console.log('\n' + '─'.repeat(60));
console.log('%c✅ Test script completed. Check results above.', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
console.log('%cWait for Native Host responses...', 'color: #2196F3;');
