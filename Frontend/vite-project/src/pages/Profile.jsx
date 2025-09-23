import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const displayName = user?.displayName || user?.email || 'Guest'
  const initial = String(displayName).trim().charAt(0).toUpperCase()

  return (
    <div className="py-6">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-semibold">Your Profile</h1>
        <div className="mt-4 flex items-center gap-4">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" className="h-16 w-16 rounded-full object-cover border" />
          ) : (
            <div className="h-16 w-16 rounded-full border bg-purple-700 text-white flex items-center justify-center text-xl font-semibold">
              {initial || 'U'}
            </div>
          )}
          <div>
            <div className="font-medium">{displayName}</div>
            <div className="text-gray-600 text-sm">{user?.email}</div>
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          <Link to="/orders" className="w-full border rounded px-4 py-2 text-left">My Orders</Link>
          <button onClick={async () => { await logout(); navigate('/login') }} className="w-full border rounded px-4 py-2 text-left text-red-600">Logout</button>
        </div>
      </div>
    </div>
  )
}











