import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app = null
let auth = null
let storage = null
let googleProvider = null

try {
  if (cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId) {
    app = initializeApp(cfg)
    auth = getAuth(app)
    storage = getStorage(app)
    googleProvider = new GoogleAuthProvider()
  }
} catch (e) {
  console.warn('Firebase not initialized:', e)
}

export { auth, storage, googleProvider }


