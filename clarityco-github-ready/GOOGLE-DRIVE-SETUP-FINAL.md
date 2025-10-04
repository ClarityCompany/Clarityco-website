# Google Drive Setup - Final Configuration

## Step 1: Enable Google Drive API

1. **Go to:** [Google Cloud Console](https://console.cloud.google.com/)
2. **Select your project:** "Clarity Co Analytics"
3. **Go to:** "APIs & Services" → "Library"
4. **Search for:** `Google Drive API`
5. **Click on "Google Drive API"**
6. **Click "Enable"** ⚠️ **THIS IS CRITICAL!**

## Step 2: Verify OAuth Client Configuration

1. **Go to:** "APIs & Services" → "Credentials"
2. **Click on your OAuth 2.0 Client ID**
3. **Verify these are in "Authorized JavaScript origins":**
   - `https://68e17111e7ed381756dace13--transcendent-stardust-59752e.netlify.app`
   - `http://localhost:3000`

## Step 3: Test the Integration

### Admin Panel Test:
1. **Go to:** https://68e17111e7ed381756dace13--transcendent-stardust-59752e.netlify.app/admin-login.html
2. **Login with:** `dcaldwell` / `Jj3239828!`
3. **Add a customer** - should save to Google Drive
4. **Edit a customer** - should update in Google Drive
5. **Refresh the page** - customer should still be there

### Customer Dashboard Test:
1. **Go to:** https://68e17111e7ed381756dace13--transcendent-stardust-59752e.netlify.app/insight-hub.html
2. **Login with:** `acme_user` / `acme2024`
3. **Should see personalized dashboard** with data from Google Drive

## Step 4: Verify Google Drive Storage

1. **Go to:** [Google Drive](https://drive.google.com)
2. **Look for folder:** "Clarity Co Analytics"
3. **Should contain files:**
   - `customers.json` - All customer data
   - `dashboard-data.json` - All dashboard data

## Troubleshooting

### If you see "Google Drive API not enabled" error:
- Go back to Step 1 and make sure Google Drive API is enabled

### If you see "API key error":
- Check that your API key is correct in config.js
- Make sure the API key is not restricted to specific APIs

### If you see "OAuth client error":
- Check that your Netlify URL is in authorized origins
- Make sure the OAuth consent screen is configured

### If data disappears after refresh:
- Check browser console for errors
- Verify Google Drive API is enabled
- Check that files are being created in Google Drive

## Your API Credentials (Already Configured):

- **API Key:** `AIzaSyDDIFaZjCCdRfk4GbzCRNWU7S91Mn7kj60`
- **Client ID:** `1041903487209-1mpvagaa7d7jfgeqq9bg56gpqs478ee9.apps.googleusercontent.com`

## Benefits of Google Drive Integration:

✅ **Access from anywhere** - Any computer with internet  
✅ **Real-time sync** - Changes appear immediately  
✅ **Automatic backup** - Google Drive handles backups  
✅ **Secure storage** - Google's security infrastructure  
✅ **Scalable** - Handles unlimited customers and data  

## Next Steps:

1. **Enable Google Drive API** (Step 1 above)
2. **Deploy the updated files**
3. **Test the integration**
4. **Enjoy cloud-based data management!**

Your Clarity Co Analytics system will now store all data in Google Drive, making it accessible from any computer with internet access!
