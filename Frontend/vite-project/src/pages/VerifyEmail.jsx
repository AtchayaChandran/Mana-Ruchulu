import { useAuth } from '../context/AuthContext'

export default function VerifyEmail() {
  const { user, resendVerification } = useAuth()
  return (
    <div className="py-6">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-2">Verify your email</h1>
        <p className="text-gray-700">We sent a verification link to {user?.email}. Please verify to continue.</p>
        <button onClick={resendVerification} className="mt-4 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded">Resend email</button>
      </div>
    </div>
  )
}



















