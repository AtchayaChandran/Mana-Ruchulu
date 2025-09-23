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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      // Fallback: restore session from localStorage token for backend-auth mode
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
    login: async (email, _password) => {
      try {
        if (auth) return await signInWithEmailAndPassword(auth, email, _password)
        const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        const res = await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: _password }) })
        let payload = null
        try { payload = await res.json() } catch {}
        if (!res.ok) {
          const msg = payload?.error || payload?.message || `Login failed (${res.status})`
          throw new Error(msg)
        }
        const backendUser = { email: payload?.user?.email, emailVerified: true, id: payload?.user?.id, displayName: payload?.user?.name }
        if (payload?.token) localStorage.setItem('mr_backend_token', payload.token)
        localStorage.setItem('mr_backend_user', JSON.stringify(backendUser))
        setUser(backendUser)
        return backendUser
      } catch (e) {
        // Firebase errors already have message; backend errors handled above
        throw e
      }
    },
    signup: async (email, _password, displayName) => {
      try {
        if (auth) {
          const cred = await createUserWithEmailAndPassword(auth, email, _password)
          if (displayName) await updateProfile(cred.user, { displayName })
          try { await sendEmailVerification(cred.user) } catch {}
          return cred
        }
        const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        const res = await fetch(`${base}/api/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name: displayName, password: _password }) })
        let payload = null
        try { payload = await res.json() } catch {}
        if (!res.ok) {
          const msg = payload?.error || payload?.message || `Signup failed (${res.status})`
          throw new Error(msg)
        }
        const backendUser = { email: payload?.user?.email, emailVerified: true, id: payload?.user?.id, displayName }
        if (payload?.token) localStorage.setItem('mr_backend_token', payload.token)
        localStorage.setItem('mr_backend_user', JSON.stringify(backendUser))
        setUser(backendUser)
        return backendUser
      } catch (e) {
        throw e
      }
    },
    loginWithGoogle: () => (auth && googleProvider) ? signInWithPopup(auth, googleProvider) : Promise.reject(new Error('Google login not configured')),
    logout: async () => {
      if (auth) return signOut(auth)
      localStorage.removeItem('mr_backend_user')
      localStorage.removeItem('mr_backend_token')
      setUser(null)
    },
    resendVerification: () => (auth && auth.currentUser) ? sendEmailVerification(auth.currentUser) : Promise.resolve(),
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}


