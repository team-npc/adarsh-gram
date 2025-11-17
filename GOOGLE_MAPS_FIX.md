# Google Maps "For Development Purposes Only" Fix

## Why This Happens
The watermark appears when there are API key restrictions or billing issues.

## Solution Steps

### 1. Enable Billing Account (REQUIRED)
- Go to https://console.cloud.google.com/billing
- Create a billing account (Google provides $200 free credit monthly)
- Link the billing account to your project
- This is **mandatory** for Maps to work properly

### 2. Remove API Key Restrictions
Go to https://console.cloud.google.com/google/maps-apis/credentials

For your API key:
- Click on the API key to edit
- Under "Application restrictions": Select **"None"**
- Under "API restrictions": Select **"Don't restrict key"**
- Click **Save**

### 3. Enable Required APIs
Go to https://console.cloud.google.com/apis/library

Enable these APIs:
- ✅ **Maps JavaScript API** (Required)
- ✅ **Maps Static API** (Recommended)
- ✅ **Geocoding API** (Recommended)
- ✅ **Places API** (Optional)

### 4. Wait and Restart
- Wait 2-5 minutes for changes to propagate
- Stop your development server (Ctrl+C)
- Clear browser cache (Ctrl+Shift+Delete)
- Restart: `cd frontend && npm start`

### 5. Verify API Key in Code
Check that your `.env.local` file has:
```
REACT_APP_GOOGLE_MAPS_API_KEY=' '
```

## Quick Fix (If Still Not Working)

### Option A: Create New API Key
1. Go to https://console.cloud.google.com/google/maps-apis/credentials
2. Click "+ CREATE CREDENTIALS" → "API Key"
3. Copy the new key
4. Replace in `.env.local`
5. **Don't add any restrictions initially**
6. Restart server

### Option B: Check Console Errors
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors starting with "Google Maps API"
4. Share the error message for specific help

## Common Error Messages

**"RefererNotAllowedMapError"**
- Solution: Remove HTTP referrer restrictions or add `http://localhost:3000/*`

**"ApiNotActivatedMapError"**
- Solution: Enable Maps JavaScript API

**"RequestDenied"**
- Solution: Add billing account to project

## Test Your API Key
Visit this URL (replace YOUR_KEY):
```
https://maps.googleapis.com/maps/api/js?key=YOUR_KEY
```

Should return JavaScript code, not an error.

## Current Configuration
- API Key: 
- Environment: Development (localhost:3000)
- File: `.env.local`
