import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const result = await signup(email, password, name)
      if (result && (result.user?.emailVerified === true || result.emailVerified === true)) {
        navigate('/')
      } else {
        navigate('/verify')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="py-6 mt-[120px]">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">Create Account</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <input className="w-full border rounded px-3 py-2" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded">Sign up</button>
        </form>
        <p className="text-sm mt-3">Have an account? <Link className="text-purple-700" to="/login">Login</Link></p>
      </div>
    </div>
  )
}











