# Google Drive Integration Setup Guide

## Overview
This guide will help you set up Google Drive integration for your Clarity Co. admin panel to store customer data securely in the cloud.

## Step 1: Create Google Cloud Project

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select an existing one
3. **Name your project**: "Clarity Co Admin Panel"

## Step 2: Enable Google Drive API

1. **In the Google Cloud Console**, go to "APIs & Services" > "Library"
2. **Search for "Google Drive API"**
3. **Click on it and press "Enable"**

## Step 3: Create Credentials

1. **Go to "APIs & Services" > "Credentials"**
2. **Click "Create Credentials" > "API Key"**
3. **Copy the API Key** - you'll need this
4. **Click "Create Credentials" > "OAuth 2.0 Client IDs"**
5. **Application type**: "Web application"
6. **Name**: "Clarity Co Web Client"
7. **Authorized JavaScript origins**: 
   - `https://your-netlify-site.netlify.app`
   - `https://clarityco.net` (once your domain is connected)
8. **Copy the Client ID** - you'll need this

## Step 4: Update Your Code

Replace these placeholders in `admin-script.js`:

```javascript
// Replace these lines in the initClient function:
apiKey: 'YOUR_API_KEY', // Replace with your API Key
clientId: 'YOUR_CLIENT_ID', // Replace with your Client ID
```

## Step 5: Test the Integration

1. **Upload the updated files** to Netlify
2. **Go to your admin panel**
3. **Check the browser console** for "Google Drive API initialized"
4. **Try adding/editing customers** - data will be saved to Google Drive

## Security Notes

- **Keep your API keys secure** - don't share them publicly
- **Restrict your API key** to your domain in Google Cloud Console
- **The OAuth client** will handle user authentication automatically

## Troubleshooting

- **If you see CORS errors**: Make sure your domain is added to authorized origins
- **If API doesn't load**: Check that Google Drive API is enabled
- **If authentication fails**: Verify your Client ID is correct

## Benefits

✅ **Automatic backup** of all customer data
✅ **Access from anywhere** - data syncs across devices
✅ **Secure storage** in your Google Drive
✅ **No server required** - everything runs in the browser
✅ **Free** - Google Drive API has generous free limits

## Next Steps

Once set up, your customer data will automatically:
- Save to Google Drive when you add/edit customers
- Load from Google Drive when you open the admin panel
- Sync across all your devices
- Provide a secure backup of all your business data
