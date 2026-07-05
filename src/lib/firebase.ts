import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";

// All Firebase config values MUST come from environment variables.
// Copy .env.example to .env and fill in your Firebase project details.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key-replace-me',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-auth-domain',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-bucket',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'demo-sender-id',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app-id',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'demo-measurement'
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
