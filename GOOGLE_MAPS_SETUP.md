# Google Maps Integration Setup Guide

## ✅ What's Been Implemented

Your VillageMap component now uses **real Google Maps** instead of a placeholder!

### Features:
- ✅ Interactive Google Maps with zoom and pan
- ✅ Terrain and Satellite view toggle
- ✅ Custom markers for each village with color coding by status
- ✅ Info windows showing village details when clicked
- ✅ Fullscreen control
- ✅ Automatic map type switching

---

## 🔑 Get Your Google Maps API Key

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/google/maps-apis/

### Step 2: Create a Project (if you don't have one)
1. Click "Select a project" at the top
2. Click "NEW PROJECT"
3. Name it: "Adarsh Gram Assessment System"
4. Click "CREATE"

### Step 3: Enable Maps JavaScript API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Maps JavaScript API"
3. Click on it and click "ENABLE"

### Step 4: Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "CREATE CREDENTIALS" > "API key"
3. Copy your API key (it will look like: )

### Step 5: Restrict Your API Key (Recommended for Security)
1. Click on your API key to edit it
2. Under "Application restrictions", select "HTTP referrers (web sites)"
3. Add: `http://localhost:3000/*` and `http://localhost:3001/*`
4. Under "API restrictions", select "Restrict key"
5. Choose "Maps JavaScript API"
6. Click "SAVE"

---

## 📝 Add API Key to Your Project

### Edit the `.env.local` file:

```bash
# Location: frontend/.env.local
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

**Example:**
```bash
REACT_APP_GOOGLE_MAPS_API_KEY=
```

### Important:
- ⚠️ The `.env.local` file is already created in `frontend/.env.local`
- ⚠️ Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key
- ⚠️ Never commit your API key to Git (`.env.local` should be in `.gitignore`)
- ⚠️ Restart the development server after adding the key

---

## 🚀 Restart Your Application

After adding the API key, restart the dev server:

```bash
cd frontend
npm start
```

The map should now display with real Google Maps!

---

## 🎨 Map Features

### View Toggle
- **Terrain**: Shows roads, labels, and topography
- **Satellite**: Shows satellite imagery

### Village Markers
Color-coded by status:
- **Gray (Light)**: Registered
- **Gray (Medium)**: Under Assessment  
- **Gray (Dark)**: In Development
- **Black**: Adarsh Gram

### Interactive Elements
- Click markers to see village info
- Zoom in/out with mouse wheel or controls
- Pan by clicking and dragging
- Fullscreen button in bottom right

---

## 🗺️ Customization Options

### Change Map Center
Edit in `VillageMap.tsx`:
```tsx
const center = {
  lat: 27.5667,  // Your latitude
  lng: 80.6833,  // Your longitude
};
```

### Add More Villages
Edit the `villages` array:
```tsx
const villages: Village[] = [
  {
    id: '4',
    name: 'Your Village',
    district: 'Your District',
    status: 'registered',
    latitude: 27.5000,
    longitude: 80.5000,
    problemCount: 2,
  },
  // ... more villages
];
```

### Change Default Zoom
Edit in `VillageMap.tsx`:
```tsx
const mapOptions = {
  zoom: 11,  // Increase for closer view, decrease for wider view
  // ... other options
};
```

---

## 💰 Pricing Information

Google Maps has a **generous free tier**:
- **$200 free credit per month**
- Maps JavaScript API: **28,000 free map loads per month**
- This is more than enough for development and small-scale production

For more info: https://cloud.google.com/maps-platform/pricing

---

## 🔒 Security Best Practices

### For Development:
✅ Use `.env.local` for API key  
✅ Add `.env.local` to `.gitignore`  
✅ Restrict API key to localhost domains  

### For Production:
✅ Use environment variables on your hosting platform  
✅ Restrict API key to your production domain  
✅ Enable billing alerts in Google Cloud Console  
✅ Monitor API usage regularly  

---

## 🐛 Troubleshooting

### Map Not Showing?
1. Check if API key is correctly added to `.env.local`
2. Make sure you enabled "Maps JavaScript API" in Google Cloud Console
3. Restart the development server
4. Check browser console for errors
5. Verify API key restrictions aren't blocking localhost

### "For development purposes only" watermark?
- This means you haven't enabled billing on your Google Cloud account
- Enable billing to remove the watermark (still free under $200/month usage)

### Markers not appearing?
- Check that village coordinates are valid (latitude: -90 to 90, longitude: -180 to 180)
- Open browser console to see any errors

---

## 📚 Additional Resources

- [Google Maps JavaScript API Docs](https://developers.google.com/maps/documentation/javascript)
- [React Google Maps API Library](https://react-google-maps-api-docs.netlify.app/)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## 🎉 You're All Set!

Once you add your API key and restart the server, you'll see a real interactive Google Map with your villages marked on it!
