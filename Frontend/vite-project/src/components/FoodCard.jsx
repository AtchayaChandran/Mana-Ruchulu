import { useCart } from '../context/CartContext'
import { useEffect, useState } from 'react'

export default function FoodCard({
  name,
  price,
  image,
  status = 'Highly reordered',
  description ,
  customizable = false,
  id,

}) {
  const { items, add, inc, dec } =
    useCart() || { items: {}, add: () => { }, inc: () => { }, dec: () => { } }

  const qty = id ? items?.[id]?.qty || 0 : 0
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mr_saved')
      const arr = raw ? JSON.parse(raw) : []
      setIsSaved(Array.isArray(arr) && arr.includes(id))
    } catch {}
  }, [id])

  const toggleSaved = () => {
    try {
      const raw = localStorage.getItem('mr_saved')
      const arr = raw ? JSON.parse(raw) : []
      let next = []
      if (Array.isArray(arr)) {
        if (arr.includes(id)) {
          next = arr.filter((x) => x !== id)
        } else {
          next = [...arr, id]
        }
      } else {
        next = [id]
      }
      localStorage.setItem('mr_saved', JSON.stringify(next))
      setIsSaved(next.includes(id))
    } catch {}
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/dish/${id}`
    const shareData = {
      title: name,
      text: `${name} – ₹${price}`,
      url,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
    } catch {}
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
        alert('Link copied to clipboard')
        return
      }
    } catch {}
    try {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      alert('Link copied to clipboard')
    } catch {
      alert(url)
    }
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition">
      <div className="p-3">
        {/* MOBILE STYLE: text left, image right */}
        <div className="flex flex-row-reverse items-start gap-3">
          {/* Right: Food Image with ADD overlay */}
          <div className="relative w-28 h-24 sm:w-36 sm:h-28 flex-shrink-0">
            <img
              src={image}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
            <div className="absolute -bottom-10 right-0 flex flex-col items-center gap-1">
              {qty === 0 ? (
                <button
                  onClick={() => add(id, { name, price, image })}
                  className="bg-rose-50 text-rose-600 border border-rose-300 rounded-2xl shadow px-4 py-1.5 text-sm font-semibold"
                >
                  ADD +
                </button>
              ) : (
                <div className="bg-rose-50 text-rose-600 border border-rose-300 rounded-2xl shadow inline-flex items-center overflow-hidden">
                  <button onClick={() => dec(id)} className="px-3 py-1">
                    -
                  </button>
                  <span className="px-2 font-semibold">{qty}</span>
                  <button onClick={() => inc(id)} className="px-3 py-1">
                    +
                  </button>
                </div>
              )}

              {/* Customisable note under ADD */}
              {customizable && (
                <span className="text-[13px] text-gray-500">customisable</span>
              )}
            </div>
          </div>

          {/* Left: Content */}
          <div className="flex-1 pr-1">
            <h3 className="text-[16px] font-semibold leading-tight">{name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-2 w-6 bg-green-500 rounded" />
              <span className="text-xs text-gray-600">{status}</span>
            </div>
            <div className="mt-1 text-[15px] font-semibold">₹{price}</div>
            <p className="mt-1 text-gray-600 text-[13px]">
              {description}

              <button className="text-gray-700 font-medium">…more</button>
            </p>

            {/* Bookmark + Share icons */}
            <div className="mt-3 flex items-center gap-3">
              <button onClick={toggleSaved} className="h-9 w-9 rounded-full border flex items-center justify-center" aria-label="Save">
                <svg
                  className={`h-5 w-5 ${isSaved ? 'text-purple-700' : 'text-gray-700'}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    fill={isSaved ? 'currentColor' : 'none'}
                  />
                </svg>
              </button>
              <button onClick={handleShare} className="h-9 w-9 rounded-full border flex items-center justify-center" aria-label="Share">
                <svg
                  className="h-5 w-5 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 16V4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 8l4-4 4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

