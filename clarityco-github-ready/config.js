// Configuration file for Clarity Co Analytics
// Replace these placeholder values with your actual Google API credentials

const CONFIG = {
    // Google Drive API Configuration
    GOOGLE_API_KEY: 'AIzaSyDDIFaZjCCdRfk4GbzCRNWU7S91Mn7kj60', // Your actual API key
    GOOGLE_CLIENT_ID: '1041903487209-1mpvagaa7d7jfgeqq9bg56gpqs478ee9.apps.googleusercontent.com', // Your actual client ID
    
    // Application Settings
    APP_NAME: 'Clarity Co Analytics',
    VERSION: '1.0.0',
    
    // Google Drive Folder Settings
    DRIVE_FOLDER_NAME: 'Clarity Co Analytics',
    
    // Data Refresh Settings
    REFRESH_INTERVAL: 30000, // 30 seconds
    
    // Notification Settings
    NOTIFICATION_DURATION: 5000, // 5 seconds
    
    // Demo Data Settings
    ENABLE_DEMO_DATA: true, // Set to false in production
    
    // Security Settings
    ENABLE_GOOGLE_DRIVE: true, // Set to false to use localStorage only
    
    // Debug Settings
    DEBUG_MODE: true, // Set to false in production
    LOG_LEVEL: 'info' // 'debug', 'info', 'warn', 'error'
};

// Make config available globally
window.CONFIG = CONFIG;

// Log configuration status
if (CONFIG.DEBUG_MODE) {
    console.log('Clarity Co Analytics Configuration Loaded:', CONFIG);
}
