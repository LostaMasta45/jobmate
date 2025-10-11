const NATIVE_HOST = 'com.chromemcp.nativehost';
let port = null;

// DOM Elements
const statusEl = document.getElementById('status');
const logEl = document.getElementById('log');
const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn');
const pingBtn = document.getElementById('ping-btn');
const mcpInitBtn = document.getElementById('mcp-init-btn');
const testMessageBtn = document.getElementById('test-message-btn');
const clearBtn = document.getElementById('clear-btn');

// Logging functions
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const className = type;
    const line = document.createElement('div');
    line.className = className;
    line.textContent = `[${timestamp}] ${message}`;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
}

function clearLog() {
    logEl.innerHTML = '';
}

// Status update
function updateStatus(connected) {
    if (connected) {
        statusEl.textContent = 'Connected';
        statusEl.className = 'status connected';
        connectBtn.style.display = 'none';
        disconnectBtn.style.display = 'inline-block';
    } else {
        statusEl.textContent = 'Disconnected';
        statusEl.className = 'status disconnected';
        connectBtn.style.display = 'inline-block';
        disconnectBtn.style.display = 'none';
    }
}

// Connect to Native Host
function connect() {
    log('🔌 Connecting to Native Host...', 'info');
    
    try {
        port = chrome.runtime.connectNative(NATIVE_HOST);
        log(`✅ Connected to ${NATIVE_HOST}`, 'success');
        updateStatus(true);
        
        // Message listener
        port.onMessage.addListener((message) => {
            log('📨 Received:', 'success');
            log(JSON.stringify(message, null, 2), 'info');
        });
        
        // Disconnect listener
        port.onDisconnect.addListener(() => {
            if (chrome.runtime.lastError) {
                log(`❌ Disconnected: ${chrome.runtime.lastError.message}`, 'error');
                
                // Troubleshooting tips
                if (chrome.runtime.lastError.message.includes('not found')) {
                    log('', 'info');
                    log('💡 Troubleshooting:', 'warning');
                    log('1. Pastikan mcp-chrome-bridge terinstall: npm list -g mcp-chrome-bridge', 'info');
                    log('2. Register: npx mcp-chrome-bridge register', 'info');
                    log('3. Restart Chrome', 'info');
                }
            } else {
                log('✅ Disconnected gracefully', 'success');
            }
            port = null;
            updateStatus(false);
        });
        
    } catch (error) {
        log(`❌ Error: ${error.message}`, 'error');
        updateStatus(false);
    }
}

// Disconnect
function disconnect() {
    if (port) {
        port.disconnect();
        port = null;
        log('🔌 Manually disconnected', 'info');
        updateStatus(false);
    }
}

// Send Ping
function sendPing() {
    if (!port) {
        log('❌ Not connected! Please connect first.', 'error');
        return;
    }
    
    const message = {
        type: 'ping',
        timestamp: Date.now()
    };
    
    log('📤 Sending ping...', 'info');
    log(JSON.stringify(message, null, 2), 'info');
    
    try {
        port.postMessage(message);
        log('✅ Ping sent', 'success');
    } catch (error) {
        log(`❌ Error sending ping: ${error.message}`, 'error');
    }
}

// Send MCP Initialize
function sendMCPInit() {
    if (!port) {
        log('❌ Not connected! Please connect first.', 'error');
        return;
    }
    
    const message = {
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
                name: 'mcp-test-extension',
                version: '1.0.0'
            }
        },
        id: 1
    };
    
    log('📤 Sending MCP initialize...', 'info');
    log(JSON.stringify(message, null, 2), 'info');
    
    try {
        port.postMessage(message);
        log('✅ MCP initialize sent', 'success');
    } catch (error) {
        log(`❌ Error sending MCP message: ${error.message}`, 'error');
    }
}

// Send Test Message
function sendTestMessage() {
    if (!port) {
        log('❌ Not connected! Please connect first.', 'error');
        return;
    }
    
    const message = {
        type: 'test',
        data: {
            message: 'Hello from Chrome Extension!',
            timestamp: Date.now()
        }
    };
    
    log('📤 Sending test message...', 'info');
    log(JSON.stringify(message, null, 2), 'info');
    
    try {
        port.postMessage(message);
        log('✅ Test message sent', 'success');
    } catch (error) {
        log(`❌ Error sending test message: ${error.message}`, 'error');
    }
}

// Event listeners
connectBtn.addEventListener('click', connect);
disconnectBtn.addEventListener('click', disconnect);
pingBtn.addEventListener('click', sendPing);
mcpInitBtn.addEventListener('click', sendMCPInit);
testMessageBtn.addEventListener('click', sendTestMessage);
clearBtn.addEventListener('click', clearLog);

// Initial log
log('🧪 MCP Chrome Bridge Tester Ready', 'success');
log(`Native Host ID: ${NATIVE_HOST}`, 'info');
log('Click "Connect to Native Host" to start', 'info');
