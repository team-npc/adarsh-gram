# Troubleshooting: Login Issues

## Current Issue: "Taking forever to load"

### Root Cause:
The error `net::ERR_ADDRESS_INVALID` and CORS errors indicate:
1. Firebase authentication service is having connectivity issues
2. Google Analytics is being blocked
3. The auth state listener might be stuck waiting

### Quick Fix Solutions:

#### Option 1: Clear Browser Data (RECOMMENDED)
1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Click **Clear storage** on the left
4. Check all boxes and click **Clear site data**
5. Refresh the page (Ctrl + Shift + R)
6. Try logging in again

#### Option 2: Disable Extensions
- Some browser extensions can block Firebase
- Try in **Incognito Mode** (Ctrl + Shift + N)
- Or disable extensions temporarily

#### Option 3: Check Internet Connection
- Ensure stable internet connection
- Firebase requires internet access
- Try disconnecting and reconnecting

#### Option 4: Use Different Browser
- Try Microsoft Edge or Firefox
- Sometimes Chrome has stricter CORS policies

### Developer Solutions:

#### Clear localStorage:
```javascript
// Open browser console (F12 → Console tab)
localStorage.clear();
location.reload();
```

#### Check Firebase Status:
```javascript
// In browser console
console.log('Auth:', window.firebase);
```

#### Bypass Role Selection (Temporary):
If stuck on role selection:
```javascript
// In browser console
localStorage.setItem('users', JSON.stringify([{
  email: 'admin@adharshgram.in',
  username: 'admin123',
  role: 'admin',
  roleAssigned: true
}]));
location.reload();
```

### Network Errors Explained:

**ERR_ADDRESS_INVALID:**
- Firebase URL is malformed or blocked
- Usually a browser/network issue, not code issue

**COOP/CORS Errors:**
- Cross-Origin policy blocks window.close
- Affects Google Sign-In popup
- Safe to ignore if not using Google Sign-In

### Prevention:

1. **Always use stable internet**
2. **Clear browser cache regularly**
3. **Don't use ad-blockers on localhost**
4. **Check Firebase project is active** at https://console.firebase.google.com

### If Still Not Working:

1. Restart development server:
   ```bash
   # Stop server (Ctrl+C)
   npm start
   ```

2. Hard refresh browser:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. Check if Firebase project is suspended:
   - Go to Firebase Console
   - Check project status
   - Verify authentication is enabled

4. Verify Firebase configuration:
   - File: `frontend/src/config/firebase.ts`
   - Ensure all config values are correct
   - Check if project ID matches Firebase console

### Contact Support:
If none of these work, the Firebase project might need to be recreated or there's a regional network block.
