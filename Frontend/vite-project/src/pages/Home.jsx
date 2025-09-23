import { Link } from 'react-router-dom'
import { menuCategories } from '../data/menu'
import FoodCard from '../components/FoodCard'

export default function Home() {
  // Keep original selection (from category index 2), only change the card UI
  const specials = (menuCategories[2]?.items || []).slice(0, 3)
  return (
    <div className="">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <iframe
          className="h-[360px] sm:h-[480px] w-full object-cover"
          src={`https://www.youtube.com/embed/DzSSUU37ynQ?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&modestbranding=1&rel=0&showinfo=0&playlist=DzSSUU37ynQ`}
          title="Hero video"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight brand-font text-white">Mana Ruchulu</h1>
            <p className="mt-3 text-white/90 text-lg">A Taste of Tradition, Served Fresh</p>
            <div className="mt-6 flex gap-3">
              <Link to="/menu" className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded">Order Now</Link>
              <Link to="/menu" className="bg-white/90 hover:bg-white text-gray-900 px-5 py-2 rounded">View Menu</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Chef's Special */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Chef’s Special</h2>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specials.map((item) => (
            <FoodCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              description={item.description}
              status={item.badge || 'Chef’s'}
            />
          ))}
        </div>
      </section>

      {/* Categories preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-semibold">Explore Our Menu</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {menuCategories.map((cat) => (
            <Link key={cat.id} to={`/menu#${cat.id}`} className={`rounded p-4 ${cat.color} hover:shadow`}>
              <div className="font-medium">{cat.title}</div>
              <div className="text-sm text-gray-600">{cat.items.length} items</div>
            </Link>
          ))}
        </div>
      </section>

      {/* About & Testimonials */}
      <section className="bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold">About Us</h2>
            <p className="mt-3 text-gray-700">At Mana Ruchulu, we celebrate authentic recipes from our home kitchens—made with the warmth of tradition and the freshness of seasonal ingredients.</p>
            <Link to="/about" className="inline-block mt-4 text-purple-700 hover:underline">Read our story →</Link>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">What Our Guests Say</h2>
            <div className="mt-4 space-y-4">
              <blockquote className="bg-white p-4 rounded shadow">
                “Best biryani in town! The flavors are unmatched.” — Ananya
              </blockquote>
              <blockquote className="bg-white p-4 rounded shadow">
                “It tastes like home. Courteous service and delicious food.” — Rahul
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


