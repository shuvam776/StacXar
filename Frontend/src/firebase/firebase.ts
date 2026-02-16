import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

import { getFirestore, type Firestore } from "firebase/firestore";
import { type Auth } from "firebase/auth";

const isConfigValid = firebaseConfig.apiKey && firebaseConfig.authDomain;

let app;
let auth: Auth;
let googleProvider: any;
let db: Firestore;

if (isConfigValid) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
} else {
    console.warn("Firebase environment variables missing. Auth will be disabled/mocked.");
    // Mocking auth for UI preview purposes if needed, or keeping it null to handle in components
    auth = null as unknown as Auth;
    db = null as unknown as Firestore;
    googleProvider = null;
}

export { auth, db, googleProvider };
