import { useEffect, useMemo, useState } from 'react'
import { menuCategories } from '../data/menu'

export default function Order() {
  const [saved, setSaved] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mr_saved')
      const arr = raw ? JSON.parse(raw) : []
      setSaved(Array.isArray(arr) ? arr : [])
    } catch { setSaved([]) }
  }, [])

  const savedItems = useMemo(() => {
    const all = menuCategories.flatMap((c) => c.items || [])
    const map = new Map(all.map((it) => [it.id, it]))
    return saved.map((id) => map.get(id)).filter(Boolean)
  }, [saved])

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold">Saved</h1>
        <p className="mt-1 text-gray-700">Your saved items are listed below.</p>

        {savedItems.length === 0 ? (
          <p className="mt-6 text-gray-600">No saved items yet. Tap the bookmark icon on any dish to save it.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedItems.map((it) => (
              <div key={it.id} className="border rounded-xl bg-white p-4 flex items-start gap-3">
                {it.image && <img src={it.image} alt={it.name} className="h-16 w-16 rounded object-cover" />}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{it.name}</div>
                  <div className="text-sm text-gray-600">₹{it.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}









