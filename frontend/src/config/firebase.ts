import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9_HiVzTQNxTYWcf0I_p6ZztGVNIJwHbU",
  authDomain: "realestate-456c4.firebaseapp.com",
  projectId: "realestate-456c4",
  storageBucket: "realestate-456c4.firebasestorage.app",
  messagingSenderId: "628551361975",
  appId: "1:628551361975:web:b1b142fc82678d11af3432",
  measurementId: "G-VT0F7YRT1H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence
export const auth = getAuth(app);

// Set persistence to LOCAL (survives browser restart)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Analytics not available:", error);
  }
}

export { analytics };
export default app;
