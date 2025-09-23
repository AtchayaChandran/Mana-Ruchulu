import { useEffect, useState } from 'react'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const base = import.meta.env.VITE_API_URL || ' https://mana-ruchulu-backend.onrender.com'
        const res = await fetch(`${base}/api/orders`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            setOrders(data)
            setLoading(false)
            return
          }
        }
        throw new Error('Bad response')
      } catch {
        try {
          const raw = localStorage.getItem('mr_orders')
          const arr = raw ? JSON.parse(raw) : []
          setOrders(Array.isArray(arr) ? arr : [])
        } catch {
          setOrders([])
        }
        setError('Showing offline orders')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const formatTime = (ms) => {
    try {
      const d = new Date(ms)
      return d.toLocaleString()
    } catch { return '-' }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-3 text-gray-600">No orders yet.</p>
      ) : (
        <div className="mt-4 grid gap-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Order #{o.id}</div>
                <div className="text-sm text-gray-600">{formatTime(o.createdAt)}</div>
              </div>
              <div className="mt-1 text-sm">
                <span className="font-medium">Status:</span> {o.status}
                {o.acceptedAt && <span className="ml-2 text-gray-600">(accepted {formatTime(o.acceptedAt)})</span>}
              </div>
              <div className="mt-3 divide-y">
                {o.items?.map((it) => (
                  <div key={it.id} className="flex items-center justify-between py-2">
                    <div className="min-w-0">
                      <div className="truncate">{it.name}</div>
                      <div className="text-xs text-gray-600">₹{it.price} × {it.qty}</div>
                    </div>
                    <div className="font-semibold">₹{(it.price || 0) * (it.qty || 0)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t pt-3 flex items-center justify-between">
                <div className="text-sm text-gray-600">ETA: {o.eta}</div>
                <div className="text-lg font-semibold">Paid: ₹{o.totals?.total ?? '-'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}




