// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import type { FirebaseConfig, EnvironmentVariables } from '../types';

// Validate environment variables
const requiredEnvVars: Partial<EnvironmentVariables> = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}. Please check your .env.local file.`);
}

// Your web app's Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: requiredEnvVars.VITE_FIREBASE_API_KEY!,
  authDomain: requiredEnvVars.VITE_FIREBASE_AUTH_DOMAIN!,
  projectId: requiredEnvVars.VITE_FIREBASE_PROJECT_ID!,
  storageBucket: requiredEnvVars.VITE_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: requiredEnvVars.VITE_FIREBASE_MESSAGING_SENDER_ID!,
  appId: requiredEnvVars.VITE_FIREBASE_APP_ID!
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

// Connect to emulators in development (optional)
if (import.meta.env.DEV) {
  // Uncomment these lines if you want to use Firebase emulators for development
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectAuthEmulator(auth, 'http://localhost:9099');
}

export default app;