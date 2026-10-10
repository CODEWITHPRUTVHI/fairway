/**
 * FAIRWAY Nashik - Firebase Realtime Database Service
 * Powers: Live GPS tracking, Stranger matching across real devices
 */
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// ── FAIRWAY PUBLIC FIREBASE PROJECT CONFIG ──────────────────────────────────
// This is the public Fairway Nashik Firebase project.
// Replace with your own if you fork this project.
const firebaseConfig = {
  apiKey: "AIzaSyC_fairway_placeholder_REPLACE_ME",
  authDomain: "fairway-nashik.firebaseapp.com",
  databaseURL: "https://fairway-nashik-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fairway-nashik",
  storageBucket: "fairway-nashik.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:000000000000000000000000",
};

let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getDatabase> | null = null;
let firebaseAvailable = false;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  firebaseAvailable = true;
  console.log('[FAIRWAY] Firebase connected to Realtime Database');
} catch (e) {
  console.warn('[FAIRWAY] Firebase not configured — running in offline simulation mode. To enable real-time, update firebase.ts with your project credentials.');
  firebaseAvailable = false;
}

export { db, firebaseAvailable };
