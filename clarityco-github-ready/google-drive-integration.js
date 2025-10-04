// Google Drive Integration for Clarity Co Analytics
// This file handles all Google Drive operations

class GoogleDriveManager {
    constructor() {
        // Use config values if available, otherwise use placeholders
        this.apiKey = window.CONFIG?.GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY';
        this.clientId = window.CONFIG?.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
        this.discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
        this.scopes = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly';
        this.gapi = null;
        this.isInitialized = false;
        this.folderId = null; // Will store the Clarity Co folder ID
        this.folderName = window.CONFIG?.DRIVE_FOLDER_NAME || 'Clarity Co Analytics';
    }

    // Initialize Google API
    async initialize() {
        return new Promise((resolve, reject) => {
            if (this.isInitialized) {
                resolve();
                return;
            }

            // Load Google API script if not already loaded
            if (!window.gapi) {
                const script = document.createElement('script');
                script.src = 'https://apis.google.com/js/api.js';
                script.async = true;
                script.defer = true;
                script.crossOrigin = 'anonymous';
                script.onload = () => this.loadGapi(resolve, reject);
                script.onerror = (error) => {
                    console.error('Failed to load Google API script:', error);
                    reject(new Error('Failed to load Google API script. Check CSP settings.'));
                };
                document.head.appendChild(script);
            } else {
                this.loadGapi(resolve, reject);
            }
        });
    }

    loadGapi(resolve, reject) {
        window.gapi.load('client:auth2', async () => {
            try {
                await window.gapi.client.init({
                    apiKey: this.apiKey,
                    clientId: this.clientId,
                    discoveryDocs: this.discoveryDocs,
                    scope: this.scopes
                });

                this.gapi = window.gapi;
                this.isInitialized = true;
                
                // Create or find the Clarity Co folder
                await this.ensureClarityCoFolder();
                
                resolve();
            } catch (error) {
                console.error('Error initializing Google API:', error);
                reject(error);
            }
        });
    }

    // Authenticate user
    async authenticate() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const authInstance = this.gapi.auth2.getAuthInstance();
        const user = authInstance.currentUser.get();
        
        if (!user.isSignedIn()) {
            await authInstance.signIn();
        }
        
        return user;
    }

    // Create or find the Clarity Co folder
    async ensureClarityCoFolder() {
        try {
            // Search for existing folder
            const response = await this.gapi.client.drive.files.list({
                q: `name='${this.folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                fields: 'files(id, name)'
            });

            if (response.result.files.length > 0) {
                this.folderId = response.result.files[0].id;
                console.log('Found existing Clarity Co folder:', this.folderId);
            } else {
                // Create new folder
                const folderMetadata = {
                    name: this.folderName,
                    mimeType: 'application/vnd.google-apps.folder'
                };

                const folder = await this.gapi.client.drive.files.create({
                    resource: folderMetadata,
                    fields: 'id'
                });

                this.folderId = folder.result.id;
                console.log('Created new Clarity Co folder:', this.folderId);
            }
        } catch (error) {
            console.error('Error managing Clarity Co folder:', error);
            throw error;
        }
    }

    // Save customer data to Google Drive
    async saveCustomerData(customers) {
        try {
            await this.authenticate();
            
            const fileName = 'customers.json';
            const fileContent = JSON.stringify(customers, null, 2);
            
            // Check if file exists
            const existingFile = await this.findFile(fileName);
            
            if (existingFile) {
                // Update existing file
                await this.gapi.client.drive.files.update({
                    fileId: existingFile.id,
                    media: {
                        mimeType: 'application/json',
                        body: fileContent
                    }
                });
                console.log('Updated customers.json in Google Drive');
            } else {
                // Create new file
                const fileMetadata = {
                    name: fileName,
                    parents: [this.folderId]
                };

                await this.gapi.client.drive.files.create({
                    resource: fileMetadata,
                    media: {
                        mimeType: 'application/json',
                        body: fileContent
                    },
                    fields: 'id'
                });
                console.log('Created customers.json in Google Drive');
            }
        } catch (error) {
            console.error('Error saving customer data:', error);
            throw error;
        }
    }

    // Load customer data from Google Drive
    async loadCustomerData() {
        try {
            await this.authenticate();
            
            const fileName = 'customers.json';
            const file = await this.findFile(fileName);
            
            if (file) {
                const response = await this.gapi.client.drive.files.get({
                    fileId: file.id,
                    alt: 'media'
                });
                
                const customers = JSON.parse(response.body);
                console.log('Loaded customer data from Google Drive');
                return customers;
            } else {
                console.log('No customer data found in Google Drive');
                return [];
            }
        } catch (error) {
            console.error('Error loading customer data:', error);
            return [];
        }
    }

    // Save dashboard data to Google Drive
    async saveDashboardData(dashboardData) {
        try {
            await this.authenticate();
            
            const fileName = 'dashboard-data.json';
            const fileContent = JSON.stringify(dashboardData, null, 2);
            
            const existingFile = await this.findFile(fileName);
            
            if (existingFile) {
                await this.gapi.client.drive.files.update({
                    fileId: existingFile.id,
                    media: {
                        mimeType: 'application/json',
                        body: fileContent
                    }
                });
                console.log('Updated dashboard-data.json in Google Drive');
            } else {
                const fileMetadata = {
                    name: fileName,
                    parents: [this.folderId]
                };

                await this.gapi.client.drive.files.create({
                    resource: fileMetadata,
                    media: {
                        mimeType: 'application/json',
                        body: fileContent
                    },
                    fields: 'id'
                });
                console.log('Created dashboard-data.json in Google Drive');
            }
        } catch (error) {
            console.error('Error saving dashboard data:', error);
            throw error;
        }
    }

    // Load dashboard data from Google Drive
    async loadDashboardData() {
        try {
            await this.authenticate();
            
            const fileName = 'dashboard-data.json';
            const file = await this.findFile(fileName);
            
            if (file) {
                const response = await this.gapi.client.drive.files.get({
                    fileId: file.id,
                    alt: 'media'
                });
                
                const dashboardData = JSON.parse(response.body);
                console.log('Loaded dashboard data from Google Drive');
                return dashboardData;
            } else {
                console.log('No dashboard data found in Google Drive');
                return [];
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            return [];
        }
    }

    // Find a file by name
    async findFile(fileName) {
        try {
            const response = await this.gapi.client.drive.files.list({
                q: `name='${fileName}' and parents in '${this.folderId}' and trashed=false`,
                fields: 'files(id, name)'
            });

            return response.result.files.length > 0 ? response.result.files[0] : null;
        } catch (error) {
            console.error('Error finding file:', error);
            return null;
        }
    }

    // Upload a file to Google Drive
    async uploadFile(file, fileName, description = '') {
        try {
            await this.authenticate();
            
            const fileMetadata = {
                name: fileName,
                parents: [this.folderId],
                description: description
            };

            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(fileMetadata)], {type: 'application/json'}));
            form.append('file', file);

            const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
                },
                body: form
            });

            if (response.ok) {
                const result = await response.json();
                console.log('File uploaded to Google Drive:', result.id);
                return result;
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    // Get all files in the Clarity Co folder
    async getAllFiles() {
        try {
            await this.authenticate();
            
            const response = await this.gapi.client.drive.files.list({
                q: `parents in '${this.folderId}' and trashed=false`,
                fields: 'files(id, name, mimeType, createdTime, modifiedTime, size)',
                orderBy: 'modifiedTime desc'
            });

            return response.result.files;
        } catch (error) {
            console.error('Error getting files:', error);
            return [];
        }
    }

    // Delete a file
    async deleteFile(fileId) {
        try {
            await this.authenticate();
            
            await this.gapi.client.drive.files.delete({
                fileId: fileId
            });
            
            console.log('File deleted from Google Drive');
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }

    // Check authentication status
    isAuthenticated() {
        if (!this.isInitialized) return false;
        const authInstance = this.gapi.auth2.getAuthInstance();
        return authInstance.isSignedIn.get();
    }

    // Sign out
    async signOut() {
        if (this.isInitialized) {
            const authInstance = this.gapi.auth2.getAuthInstance();
            await authInstance.signOut();
            console.log('Signed out of Google Drive');
        }
    }
}

// Global instance
window.googleDriveManager = new GoogleDriveManager();

// Auto-initialize when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.googleDriveManager.initialize();
        console.log('Google Drive integration initialized');
    } catch (error) {
        console.error('Failed to initialize Google Drive integration:', error);
    }
});
