# Google Drive Integration Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project: "Clarity Co Analytics"
4. Click "Create"

## Step 2: Enable Google Drive API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"

## Step 3: Create Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key (you'll need this)
4. Click "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized origins:
   - `https://your-netlify-site.netlify.app`
   - `http://localhost:3000` (for testing)
7. Download the JSON file

## Step 4: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name: "Clarity Co Analytics"
   - User support email: your email
   - Developer contact: your email
4. Add scopes:
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/drive.metadata.readonly`
5. Add test users (your email and any other admins)

## Step 5: Update Your Website

Replace the placeholder API keys in the code with your actual credentials.

## Step 6: Test the Integration

1. Upload your updated files to Netlify
2. Test adding a customer in the admin panel
3. Verify data appears in your Google Drive
4. Test customer login functionality

## Security Notes

- Keep your API keys secure
- Use environment variables in production
- Regularly rotate your credentials
- Monitor API usage in Google Cloud Console
