import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";

// All Firebase config values MUST come from environment variables.
// Copy .env.example to .env and fill in your Firebase project details.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

if (!firebaseConfig.apiKey) {
  console.warn(
    '[ThreatLens] Firebase API key is missing. Copy .env.example to .env and fill in your Firebase credentials.'
  );
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

auth.useDeviceLanguage();
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase auth persistence failed:", error);
});
