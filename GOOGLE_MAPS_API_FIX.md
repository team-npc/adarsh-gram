# Google Maps API Configuration Fix

## Error: InvalidKeyMapError

Your Google Maps API key is not properly configured.

## Steps to Fix:

### 1. Enable Required APIs
Go to Google Cloud Console and enable these APIs:
- **Maps JavaScript API** (required)
- **Geocoding API** (optional, for address lookup)
- **Places API** (optional, for place search)

Link: https://console.cloud.google.com/apis/library

### 2. Check API Key Restrictions

#### Option A: Remove All Restrictions (For Development Only)
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your API key 
3. Under "Application restrictions" → Select **None**
4. Under "API restrictions" → Select **Don't restrict key** (or ensure Maps JavaScript API is checked)
5. Click **Save**

#### Option B: Add HTTP Referrer (Recommended for Production)
1. Under "Application restrictions" → Select **HTTP referrers (web sites)**
2. Add these referrers:
   - `http://localhost:3000/*`
   - `http://localhost:*/*`
   - `https://yourdomain.com/*` (your production domain)
3. Under "API restrictions" → Select **Restrict key**
4. Check: **Maps JavaScript API**
5. Click **Save**

### 3. Verify API Key is Active
- It can take up to 5 minutes for changes to take effect
- Check billing is enabled (Google Maps requires a billing account)

### 4. Restart Development Server
After configuring the API key:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd frontend
npm start
```

## Alternative: Get a New API Key

If the current key doesn't work, create a new one:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **+ CREATE CREDENTIALS** → **API key**
3. Copy the new key
4. Update `frontend/.env.local`:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_NEW_KEY_HERE
   ```
5. Restart the development server

## Testing

After fixing, you should see:
- ✅ Google Maps loads without errors
- ✅ Village markers appear on the map
- ✅ Terrain/Satellite toggle works
- ✅ Info windows open when clicking markers

## Common Issues

### "This API project is not authorized to use this API"
- Enable "Maps JavaScript API" in Google Cloud Console

### "The provided API key is expired"
- Generate a new API key

### "This page can't load Google Maps correctly"
- Check billing is enabled
- Verify HTTP referrer restrictions match your domain

## Quick Test API Key (No Restrictions Needed)

For immediate testing, you can temporarily use this demo setup:
1. Remove all restrictions from your API key
2. Wait 2-3 minutes
3. Hard refresh browser (Ctrl+Shift+R)
4. Check if map loads

## Support Links
- [API Key Best Practices](https://developers.google.com/maps/api-key-best-practices)
- [Error Messages Reference](https://developers.google.com/maps/documentation/javascript/error-messages)
- [Billing Setup](https://console.cloud.google.com/billing)
