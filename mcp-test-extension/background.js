// Background service worker for MCP Test Extension

console.log('MCP Test Extension Background Service Worker Started');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed:', details);
});

// Optional: Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message:', message);
    sendResponse({ status: 'ok' });
});

// Log when service worker starts
console.log('Native Messaging Host ID: com.chromemcp.nativehost');
