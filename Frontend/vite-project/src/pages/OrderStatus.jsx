import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'

export default function OrderStatus() {
  const [accepted, setAccepted] = useState(false)
  const { clear } = useCart() || { clear: () => {} }
  const location = useLocation()
  let bill = location?.state || {}
  if (!bill || Object.keys(bill).length === 0) {
    try {
      const saved = sessionStorage.getItem('mr_last_bill')
      if (saved) bill = JSON.parse(saved)
    } catch {}
  }

  useEffect(() => {
    const id = setTimeout(() => setAccepted(true), 3500)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    // Clear cart once the order is placed and we show this screen
    try { clear() } catch {}
  }, [])

  useEffect(() => {
    if (!accepted) return
    try {
      const lastId = sessionStorage.getItem('mr_last_order_id')
      if (lastId) {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        fetch(`${base}/api/orders/${lastId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'accepted', acceptedAt: Date.now() }) }).catch(() => {})
        const raw = localStorage.getItem('mr_orders')
        const arr = raw ? JSON.parse(raw) : []
        if (Array.isArray(arr)) {
          const idx = arr.findIndex((o) => o.id === lastId)
          if (idx >= 0) {
            arr[idx] = { ...arr[idx], status: 'accepted', acceptedAt: Date.now() }
            localStorage.setItem('mr_orders', JSON.stringify(arr))
          }
        }
      }
    } catch {}
  }, [accepted])

  return (
    <div className="p-6 flex flex-col items-center text-center gap-4" aria-live="polite">
      <div className="mt-6 flex flex-col items-center gap-3">
        {accepted ? (
          <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center" aria-hidden="true">
            <svg className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ) : (
          <div className="h-14 w-14 rounded-full border-4 border-rose-200 border-t-rose-600 animate-spin" aria-hidden="true" />
        )}
        <h1 className="text-xl sm:text-2xl font-semibold">
          {accepted ? 'Hooray! Restaurant accepted your order' : 'Waiting for restaurant to accept your order'}
        </h1>
        {accepted ? (
          <>
            <p className="text-gray-600 max-w-md">We’re assigning a delivery partner. Please wait while we get things moving.</p>
            <div className="mt-4 w-full max-w-md text-left rounded-xl border bg-white p-4">
              <div className="text-base font-semibold">Bill summary</div>
              <div className="mt-2 grid gap-2 text-sm">
                <div className="flex items-center justify-between"><span>Item total</span><span>₹{bill.subtotal ?? '-'}</span></div>
                <div className="flex items-center justify-between"><span>GST</span><span>₹{bill.gst ?? '-'}</span></div>
                <div className="flex items-center justify-between"><span>Restaurant charges</span><span>₹{bill.restaurantCharges ?? '-'}</span></div>
                <div className="flex items-center justify-between"><span>Delivery partner fee</span><span>₹{bill.deliveryPartnerFee ?? '-'}</span></div>
                <div className="flex items-center justify-between"><span>Platform fee</span><span>₹{bill.platformFee ?? '-'}</span></div>
                <div className="flex items-center justify-between border-t pt-2 text-base font-semibold"><span>Paid</span><span>₹{bill.total ?? '-'}</span></div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-600 max-w-md">Hang tight! We’ve sent your order to the kitchen. You’ll see updates here as soon as the restaurant confirms.</p>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Link to="/" className="px-4 py-2 rounded-lg border">Back to Home</Link>
      </div>
    </div>
  )
}


