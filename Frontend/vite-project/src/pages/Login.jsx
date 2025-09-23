import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  

  return (
    <div className="py-6">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded">Login</button>
        </form>
        <p className="text-sm mt-3">No account? <Link className="text-purple-700" to="/signup">Sign up</Link></p>
      </div>
    </div>
  )
}











