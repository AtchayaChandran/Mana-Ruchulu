import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Layout() {
  const { user, logout } = useAuth() || {}
  const { items } = useCart() || { items: {} }
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const searchRef = useRef(null)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mr_search_history')
      if (stored) {
        setSearchHistory(JSON.parse(stored))
      }
    } catch {}
  }, [])

  // Close history on click outside and on Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!showHistory) return
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowHistory(false)
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setShowHistory(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [showHistory])

  // Close account menu on outside click and Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setAccountOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const saveToHistory = (query) => {
    const trimmed = (query || '').trim()
    if (!trimmed) return
    const next = [trimmed, ...searchHistory.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, 10)
    setSearchHistory(next)
    try {
      localStorage.setItem('mr_search_history', JSON.stringify(next))
    } catch {}
  }

  const submitSearch = (e) => {
    e.preventDefault()
    saveToHistory(searchQuery)
    setShowHistory(false)
    setActiveIndex(-1)
  }

  const filteredHistory = searchHistory.filter((q) => !searchQuery || q.toLowerCase().includes(searchQuery.toLowerCase()))

  const removeFromHistory = (qToRemove) => {
    const next = searchHistory.filter((q) => q !== qToRemove)
    setSearchHistory(next)
    try { localStorage.setItem('mr_search_history', JSON.stringify(next)) } catch {}
  }
  const itemEntries = Object.entries(items || {})
  const totalQty = itemEntries.reduce((sum, [, it]) => sum + (it.qty || 0), 0)
  const showMobileCartBar = totalQty > 0 && (location.pathname !== '/cart') && (location.pathname !== '/checkout') && (location.pathname !== '/order-status')
  const isOrderStatus = location.pathname === '/order-status'

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        {/* Top bar removed on all breakpoints as requested */}
        <div className="bg-gray-50 border-b hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 text-sm gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Brand near location on laptop/desktop */}
              <Link to="/" className="hidden md:block text-lg whitespace-nowrap brand-font font-extrabold tracking-tight">Mana Ruchulu</Link>
              <svg
                className="h-4 w-4 text-gray-700"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <label htmlFor="location" className="sr-only">Select location</label>
              <select id="location" className="bg-white border rounded px-2 py-1 max-w-full" defaultValue="">
                <option value="" disabled>Choose your area</option>
                <optgroup label="Hyderabad">
                  <option>Madhapur</option>
                  <option>Gachibowli</option>
                  <option>HiTech City</option>
                  <option>Kondapur</option>
                  <option>Jubilee Hills</option>
                  <option>Banjara Hills</option>
                  <option>Film Nagar</option>
                  <option>Manikonda</option>
                  <option>Financial District</option>
                  <option>Kukatpally</option>
                  <option>Miyapur</option>
                  <option>Nizampet</option>
                  <option>Begumpet</option>
                  <option>Ameerpet</option>
                  <option>Somajiguda</option>
                  <option>Panjagutta</option>
                  <option>Secunderabad</option>
                  <option>Thirumalgiri</option>
                  <option>Alwal</option>
                  <option>ECIL</option>
                  <option>Malkajgiri</option>
                  <option>Uppal</option>
                  <option>LB Nagar</option>
                  <option>Dilsukhnagar</option>
                  <option>Kothapet</option>
                  <option>Himayat Nagar</option>
                  <option>Abids</option>
                  <option>Charminar</option>
                  <option>Mehdipatnam</option>
                  <option>Tolichowki</option>
                </optgroup>
                <optgroup label="Andhra Pradesh">
                  <option>Vijayawada</option>
                  <option>Guntur</option>
                  <option>Visakhapatnam</option>
                  <option>Nellore</option>
                  <option>Tirupati</option>
                  <option>Rajahmundry</option>
                  <option>Kakinada</option>
                </optgroup>
                <optgroup label="Chennai">
                  <option>Adyar</option>
                  <option>T. Nagar</option>
                  <option>Velachery</option>
                  <option>Guindy</option>
                  <option>Nungambakkam</option>
                  <option>Anna Nagar</option>
                  <option>OMR</option>
                </optgroup>
                <optgroup label="Delhi">
                  <option>Connaught Place</option>
                  <option>Saket</option>
                  <option>Dwarka</option>
                  <option>Karol Bagh</option>
                  <option>Vasant Kunj</option>
                  <option>Hauz Khas</option>
                </optgroup>
                <optgroup label="Bangalore">
                  <option>Koramangala</option>
                  <option>Indiranagar</option>
                  <option>Whitefield</option>
                  <option>Marathahalli</option>
                  <option>HSR Layout</option>
                  <option>Bellandur</option>
                  <option>Jayanagar</option>
                </optgroup>
              </select>

              {/* Laptop search (attached to location) */}
              <form ref={searchRef} onSubmit={submitSearch} className="hidden md:flex items-center relative">
                <div className="flex items-center bg-white border rounded px-2 py-1 md:w-80 lg:w-96">
                  <svg className="h-5 w-5 text-purple-600 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setActiveIndex(-1) }}
                    onFocus={() => setShowHistory(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') { setShowHistory(false); setActiveIndex(-1); return }
                      if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        setShowHistory(true)
                        setActiveIndex((idx) => Math.min((idx ?? -1) + 1, filteredHistory.length - 1))
                        return
                      }
                      if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        setActiveIndex((idx) => Math.max((idx ?? -1) - 1, -1))
                        return
                      }
                      if (e.key === 'Enter') {
                        if (showHistory && activeIndex >= 0 && filteredHistory[activeIndex]) {
                          e.preventDefault()
                          const chosen = filteredHistory[activeIndex]
                          setSearchQuery(chosen)
                          saveToHistory(chosen)
                          setShowHistory(false)
                          setActiveIndex(-1)
                        }
                        return
                      }
                      if (e.key === 'Delete') {
                        if (showHistory && activeIndex >= 0 && filteredHistory[activeIndex]) {
                          e.preventDefault()
                          const toRemove = filteredHistory[activeIndex]
                          removeFromHistory(toRemove)
                          setActiveIndex((idx) => Math.min(idx, filteredHistory.length - 2))
                        }
                        return
                      }
                    }}
                    placeholder="Search dishes..."
                    className="no-native-clear w-full outline-none text-gray-900 placeholder-gray-400"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 px-1" aria-label="Clear search">✕</button>
                  )}
                </div>
                {showHistory && (searchHistory.length > 0 || searchQuery) && (
                  <div className="absolute top-full left-0 mt-1 w-full md:w-80 lg:w-96 bg-white border rounded shadow z-10">
                    <ul className="max-h-60 overflow-auto">
                      {filteredHistory.map((q, idx) => (
                        <li key={q} onMouseEnter={() => setActiveIndex(idx)}>
                          <button
                            type="button"
                            className={`w-full text-left truncate px-3 py-2 ${activeIndex === idx ? 'bg-gray-100' : ''}`}
                            onClick={() => { setSearchQuery(q); setShowHistory(false); saveToHistory(q); setActiveIndex(-1) }}
                          >
                            {q}
                          </button>
                        </li>
                      ))}
                      {!filteredHistory.length && (
                        <li className="px-3 py-2 text-gray-500">No recent searches</li>
                      )}
                    </ul>
                  </div>
                )}
              </form>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/cart" aria-label="Cart" className="relative h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 3h2l2.4 12.3A2 2 0 0 0 9.37 17h7.26a2 2 0 0 0 1.97-1.7L20 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="20" r="1.5" fill="currentColor"/>
                  <circle cx="17" cy="20" r="1.5" fill="currentColor"/>
                </svg>
                {totalQty > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[11px] leading-[18px] text-center font-semibold">
                    {totalQty}
                  </span>
                )}
              </Link>
              {user ? (
                <div ref={accountRef} className="relative">
                  <button
                    aria-label="Account"
                    aria-haspopup="menu"
                    aria-expanded={accountOpen}
                    className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    onClick={() => setAccountOpen((v) => !v)}
                  >
                    <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-20 py-1">
                      <Link to="/profile" className="block px-3 py-2 hover:bg-gray-50">Profile</Link>
                      <button onClick={logout} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="px-3 py-1.5 border rounded">Login</Link>
                  <Link to="/signup" className="px-3 py-1.5 bg-purple-700 text-white rounded">Sign up</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main nav */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-4">
          <div className="flex items-center justify-between">
            {/* Brand in main nav (visible on all breakpoints) */}
            <Link to="/" className="text-2xl font-extrabold tracking-tight brand-font">Mana Ruchulu</Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="hover:underline inline-flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Home</span>
              </Link>
              <Link to="/menu" className="hover:underline inline-flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Menu</span>
              </Link>
              <Link to="/orders" className="hover:underline inline-flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M6 2h12a1 1 0 0 1 1 1v18l-7-3-7 3V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                <span>Your Orders</span>
              </Link>
              <Link to="/specials" className="hover:underline inline-flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 2l2.39 4.84L20 8.27l-3.9 3.8.92 5.36L12 15.9 7 17.43l.92-5.36L4 8.27l5.61-1.43L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                <span>Specials</span>
              </Link>
              <Link to="/about" className="hover:underline inline-flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>About Us</span>
              </Link>
              <Link to="/profile" className="hover:underline inline-flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Your Account</span>
              </Link>
              <Link to="/contact" className="hover:underline inline-flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 5h18v14H3z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Contact</span>
              </Link>
              
            </div>
            <div className="flex items-center gap-3">
              {/* Cart icon visible in main nav */}
              <Link to="/cart" aria-label="Cart" className="relative h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 3h2l2.4 12.3A2 2 0 0 0 9.37 17h7.26a2 2 0 0 0 1.97-1.7L20 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="20" r="1.5" fill="currentColor"/>
                  <circle cx="17" cy="20" r="1.5" fill="currentColor"/>
                </svg>
                {totalQty > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[11px] leading-[18px] text-center font-semibold">
                    {totalQty}
                  </span>
                )}
              </Link>
              {/* Mobile menu button */}
              <button
                className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? (
                  <svg className="h-6 w-6 text-gray-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-gray-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {/* Mobile drawer menu from right */}
          {/* Backdrop */}
          <div
            className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div
            className={`md:hidden fixed inset-y-0 right-0 z-50 w-72 max-w-[85%] bg-white border-l shadow-xl transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
            role="dialog"
            aria-modal="true"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div className="text-lg font-semibold">Menu</div>
              <button aria-label="Close" onClick={() => setMobileOpen(false)} className="p-2 rounded hover:bg-gray-100">
                <svg className="h-6 w-6 text-gray-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className="p-3 space-y-1">
              <Link onClick={() => setMobileOpen(false)} to="/" className="block px-2 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Home</span>
              </Link>
              <Link onClick={() => setMobileOpen(false)} to="/menu" className="block px-2 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Menu</span>
              </Link>
              <Link onClick={() => setMobileOpen(false)} to="/specials" className="block px-2 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 2l2.39 4.84L20 8.27l-3.9 3.8.92 5.36L12 15.9 7 17.43l.92-5.36L4 8.27l5.61-1.43L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                <span>Specials</span>
              </Link>
              <Link onClick={() => setMobileOpen(false)} to="/about" className="block px-2 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>About Us</span>
              </Link>
              <Link onClick={() => setMobileOpen(false)} to="/profile" className="block px-2 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Your Account</span>
              </Link>
              <Link onClick={() => setMobileOpen(false)} to="/contact" className="block px-2 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 5h18v14H3z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Contact</span>
              </Link>
              <Link onClick={() => setMobileOpen(false)} to="/orders" className="block px-2 py-2 rounded hover:bg-gray-50 flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M6 2h12a1 1 0 0 1 1 1v18l-7-3-7 3V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                <span>Your Orders</span>
              </Link>
            </nav>
          </div>
        </nav>
      </header>
      <main className={`flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 ${showMobileCartBar ? 'pb-20 md:pb-0' : ''}`}>
        <Outlet />
      </main>
      {/* Mobile sticky cart bar */}
      {showMobileCartBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30">
          <div className="mx-3 mb-3 rounded-full shadow-lg border bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-full bg-rose-600 text-white text-sm font-semibold">{totalQty}</span>
                <span className="text-sm font-medium">items added</span>
              </div>
              <Link to="/cart" className="inline-flex items-center gap-1 rounded-full bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700">
                View Cart
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
      {(location.pathname !== '/cart' && location.pathname !== '/login' && location.pathname !== '/signup') && (
        <footer className={`border-t bg-stone-50 ${isOrderStatus ? 'hidden md:block' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-lg font-semibold brand-font">Mana Ruchulu</div>
              <p className="mt-2 text-sm text-gray-600">A Taste of Tradition, Served Fresh.</p>
            </div>
            <div className="text-sm text-gray-700">
              <div className="font-medium">Address</div>
              <div>Road No. 12, Banjara Hills</div>
              <div>Hyderabad, Telangana</div>
              <div>+91 98765 43210</div>
            </div>
            <div className="text-sm text-gray-700">
              <div className="font-medium">Follow Us</div>
              <div className="flex gap-3 mt-2">
                <a href="#" className="hover:text-purple-700">Instagram</a>
                <a href="#" className="hover:text-purple-700">Facebook</a>
                <a href="#" className="hover:text-purple-700">Twitter</a>
              </div>
            </div>
            <form className="text-sm">
              <div className="font-medium">Newsletter</div>
              <div className="mt-2 flex">
                <input className="flex-1 border rounded-l px-3 py-2" placeholder="Your email" />
                <button className="bg-purple-700 hover:bg-purple-800 text-white px-4 rounded-r">Subscribe</button>
              </div>
            </form>
          </div>
          <div className="text-center text-xs text-gray-500 pb-4">© {new Date().getFullYear()} Mana Ruchulu</div>
        </footer>
      )}
    </div>
  )
}


