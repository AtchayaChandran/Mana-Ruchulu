import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Cart() {
  const { items, inc, dec, clear } = useCart() || { items: {}, inc: () => {}, dec: () => {}, clear: () => {} }
  const itemEntries = Object.entries(items || {})
  const hasItems = itemEntries.length > 0
  const subtotal = itemEntries.reduce((sum, [, it]) => sum + (it.price || 0) * (it.qty || 0), 0)
  const gst = Math.round(subtotal * 0.05)
  const restaurantCharges = Math.round(subtotal * 0.02)
  const deliveryPartnerFee = subtotal > 0 ? 35 : 0
  const platformFee = subtotal > 0 ? 10 : 0
  const total = subtotal + gst + restaurantCharges + deliveryPartnerFee + platformFee

  useEffect(() => {
    // Persist latest bill summary for order status page (fallback if navigation state is lost)
    try {
      if (hasItems) {
        sessionStorage.setItem('mr_last_bill', JSON.stringify({ subtotal, gst, restaurantCharges, deliveryPartnerFee, platformFee, total }))
      }
    } catch {}
  }, [hasItems, subtotal, gst, restaurantCharges, deliveryPartnerFee, platformFee, total])

  const saveOrderToHistory = async () => {
    try {
      const orderItems = itemEntries.map(([id, it]) => ({ id, name: it.name, price: it.price, qty: it.qty, image: it.image }))
      const payload = {
        eta: '30-35 min',
        totals: { subtotal, gst, restaurantCharges, deliveryPartnerFee, platformFee, total },
        items: orderItems,
      }
      const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      let orderId = null
      try {
        const res = await fetch(`${base}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (res.ok) {
          const data = await res.json()
          orderId = data?.id
        }
      } catch {}
      if (!orderId) {
        orderId = `ord_${Date.now()}`
        const record = { id: orderId, createdAt: Date.now(), status: 'placed', ...payload }
        const raw = localStorage.getItem('mr_orders')
        const arr = raw ? JSON.parse(raw) : []
        const next = Array.isArray(arr) ? [record, ...arr] : [record]
        localStorage.setItem('mr_orders', JSON.stringify(next))
      }
      sessionStorage.setItem('mr_last_order_id', orderId)
    } catch {}
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Your Cart</h1>

      {!hasItems ? (
        <div className="mt-4">
          <p className="text-gray-600">No items yet.</p>
          <Link to="/menu" className="mt-3 inline-block text-rose-600 font-medium">Browse menu →</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {/* Items list */}
          <div className="divide-y rounded-xl border bg-white">
            {itemEntries.map(([id, it]) => (
              <div key={id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  {it.image ? (
                    <img src={it.image} alt={it.name} className="h-14 w-14 sm:h-16 sm:w-16 rounded object-cover flex-shrink-0" />
                  ) : null}
                  <div className="min-w-0">
                    <div className="font-medium truncate max-w-[14rem] sm:max-w-none">{it.name}</div>
                    <div className="text-sm text-gray-600">₹{it.price}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="bg-rose-50 text-rose-600 border border-rose-300 rounded-2xl shadow inline-flex items-center overflow-hidden">
                    <button aria-label="Decrease quantity" onClick={() => dec(id)} className="px-3 py-1.5">-</button>
                    <span className="px-2 font-semibold min-w-6 text-center">{it.qty}</span>
                    <button aria-label="Increase quantity" onClick={() => inc(id)} className="px-3 py-1.5">+</button>
                  </div>
                  <div className="w-20 text-right font-semibold">₹{(it.price || 0) * (it.qty || 0)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Bill Summary */}
          <div className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Delivery in 30-35 min</div>
              <span className="text-xs text-gray-600">Estimated</span>
            </div>
            <div className="mt-3 grid gap-3">
              <div>
                <label className="text-sm text-gray-700">Delivery Address</label>
                <textarea className="mt-1 w-full rounded border px-3 py-2 text-sm" rows="2" placeholder="House no, street, area" />
              </div>
              <div>
                <label className="text-sm text-gray-700">Phone Number</label>
                <input className="mt-1 w-full rounded border px-3 py-2 text-sm" type="tel" placeholder="Enter your phone number" />
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="text-base font-semibold">Bill summary</div>
              <div className="mt-2 grid gap-2 text-sm">
                <div className="flex items-center justify-between"><span>Item total</span><span>₹{subtotal}</span></div>
                <div className="flex items-center justify-between"><span>GST (5%)</span><span>₹{gst}</span></div>
                <div className="flex items-center justify-between"><span>Restaurant charges</span><span>₹{restaurantCharges}</span></div>
                <div className="flex items-center justify-between"><span>Delivery partner fee</span><span>₹{deliveryPartnerFee}</span></div>
                <div className="flex items-center justify-between"><span>Platform fee</span><span>₹{platformFee}</span></div>
                <div className="flex items-center justify-between border-t pt-2 text-base font-semibold"><span>To pay</span><span>₹{total}</span></div>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="text-base font-semibold mb-2">Payment</div>
              <div className="grid gap-2">
                <label className="flex items-center gap-2 p-2 border rounded">
                  <input type="radio" name="payment" defaultChecked />
                  <span>Cash on delivery</span>
                </label>
              </div>
              <Link
                to="/order-status"
                state={{ subtotal, gst, restaurantCharges, deliveryPartnerFee, platformFee, total }}
                onClick={saveOrderToHistory}
                className="mt-3 w-full inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-white font-medium hover:bg-rose-700"
              >
                Place order
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



