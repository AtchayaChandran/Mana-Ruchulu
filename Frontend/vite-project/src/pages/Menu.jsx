import { Link, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { menuCategories as localMenu } from '../data/menu'
import FoodCard from '../components/FoodCard'

export default function Menu() {
  const [saved, setSaved] = useState([])
  const location = useLocation()

  // Listen for changes to saved items (including across tabs)
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem('mr_saved')
        const arr = raw ? JSON.parse(raw) : []
        setSaved(Array.isArray(arr) ? arr : [])
      } catch { setSaved([]) }
    }
    read()
    const onStorage = (e) => { if (e.key === 'mr_saved') read() }
    window.addEventListener('storage', onStorage)
    const id = setInterval(read, 500)
    return () => { window.removeEventListener('storage', onStorage); clearInterval(id) }
  }, [])

  const [remoteMenu, setRemoteMenu] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/menu` : 'http://localhost:4000/api/menu')
        const data = await res.json()
        if (data && Array.isArray(data.categories)) setRemoteMenu(data)
      } catch {}
    })()
  }, [])

  // Scroll to category if URL has a hash (e.g., /menu#mandi)
  useEffect(() => {
    const scrollToHash = () => {
      const hash = (location.hash || '').replace('#', '')
      if (!hash) return
      const el = document.getElementById(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // Run after render to ensure sections exist
    const id = setTimeout(scrollToHash, 0)
    return () => clearTimeout(id)
  }, [location, remoteMenu])

  const favourites = useMemo(() => {
    if (!saved.length) return []
    const categories = (remoteMenu?.categories?.length ? remoteMenu.categories : localMenu)
    const all = categories.flatMap((c) => c.items || [])
    const map = new Map(all.map((it) => [it.id, it]))
    return saved.map((id) => map.get(id)).filter(Boolean)
  }, [saved, remoteMenu])

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-4">Our Menu</h1>

        {favourites.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Your Favourites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {favourites.map((item) => (
                <FoodCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  status={item.badge || 'Highly reordered'}
                  description={item.description}
                  customizable={true}
                />
              ))}
            </div>
          </section>
        )}
        {(remoteMenu?.categories?.length ? remoteMenu.categories : localMenu).map((cat) => (
          <section key={cat.id} id={cat.id} className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">{cat.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {cat.items.map((item) => (
                <FoodCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  status={item.badge || 'Highly reordered'}
                  description={item.description}
                  customizable={true}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}


