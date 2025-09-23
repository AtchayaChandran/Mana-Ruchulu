import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, googleProvider } from '../lib/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth'

const AuthContext = createContext(null)

// ✅ Hardcode your backend URL here
// If your backend routes are actually `/auth/login` instead of `/api/auth/login`
// just remove `/api` from below.
const BASE_URL = 'https://mana-ruchulu-backend.onrender.com'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      // fallback: restore session from localStorage if backend auth mode
      try {
        const raw = localStorage.getItem('mr_backend_user')
        if (raw) setUser(JSON.parse(raw))
      } catch {}
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const value = useMemo(() => ({
    user,
    loading,

    // ----------------
    // LOGIN
    // ----------------
    login: async (email, password) => {
      try {
        if (auth) {
          return await signInWithEmailAndPassword(auth, email, password)
        }

        const res = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        let payload = null
        try { payload = await res.json() } catch {}

        if (!res.ok) {
          const msg = payload?.error || payload?.message || `Login failed (${res.status})`
          throw new Error(msg)
        }

        const backendUser = {
          email: payload?.user?.email,
          emailVerified: true,
          id: payload?.user?.id,
          displayName: payload?.user?.name,
        }

        if (payload?.token) localStorage.setItem('mr_backend_token', payload.token)
        localStorage.setItem('mr_backend_user', JSON.stringify(backendUser))
        setUser(backendUser)

        return backendUser
      } catch (e) {
        throw e
      }
    },

    // ----------------
    // SIGNUP
    // ----------------
    signup: async (email, password, displayName) => {
      try {
        if (auth) {
          const cred = await createUserWithEmailAndPassword(auth, email, password)
          if (displayName) await updateProfile(cred.user, { displayName })
          try { await sendEmailVerification(cred.user) } catch {}
          return cred
        }

        const res = await fetch(`${BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: displayName, password }),
        })

        let payload = null
        try { payload = await res.json() } catch {}

        if (!res.ok) {
          const msg = payload?.error || payload?.message || `Signup failed (${res.status})`
          throw new Error(msg)
        }

        const backendUser = {
          email: payload?.user?.email,
          emailVerified: true,
          id: payload?.user?.id,
          displayName,
        }

        if (payload?.token) localStorage.setItem('mr_backend_token', payload.token)
        localStorage.setItem('mr_backend_user', JSON.stringify(backendUser))
        setUser(backendUser)

        return backendUser
      } catch (e) {
        throw e
      }
    },

    // ----------------
    // GOOGLE LOGIN
    // ----------------
    loginWithGoogle: () =>
      (auth && googleProvider)
        ? signInWithPopup(auth, googleProvider)
        : Promise.reject(new Error('Google login not configured')),

    // ----------------
    // LOGOUT
    // ----------------
    logout: async () => {
      if (auth) return signOut(auth)
      localStorage.removeItem('mr_backend_user')
      localStorage.removeItem('mr_backend_token')
      setUser(null)
    },

    // ----------------
    // RESEND VERIFICATION
    // ----------------
    resendVerification: () =>
      (auth && auth.currentUser)
        ? sendEmailVerification(auth.currentUser)
        : Promise.resolve(),

  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
