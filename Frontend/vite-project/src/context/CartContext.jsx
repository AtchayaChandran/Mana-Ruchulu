import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mr_cart')) || {} } catch { return {} }
  })

  useEffect(() => {
    try { localStorage.setItem('mr_cart', JSON.stringify(items)) } catch {}
  }, [items])

  const add = (id, data) => {
    setItems((prev) => ({ ...prev, [id]: { ...(prev[id] || { qty: 0 }), ...data, qty: (prev[id]?.qty || 0) + 1 } }))
  }
  const inc = (id) => setItems((prev) => ({ ...prev, [id]: { ...prev[id], qty: (prev[id]?.qty || 0) + 1 } }))
  const dec = (id) => setItems((prev) => {
    const nextQty = (prev[id]?.qty || 0) - 1
    const next = { ...prev }
    if (nextQty <= 0) { delete next[id] } else { next[id] = { ...prev[id], qty: nextQty } }
    return next
  })
  const clear = () => setItems({})

  const value = useMemo(() => ({ items, add, inc, dec, clear }), [items])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() { return useContext(CartContext) }



















