import FoodCard from '../components/FoodCard'
import { menuCategories } from '../data/menu'

export default function Specials() {
  const specials = menuCategories.flatMap((c) => c.items || []).filter((it) => String(it.badge || '').includes('Chef'))

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold">Today’s Specials</h1>
        <p className="mt-3 text-gray-700">Hand-picked dishes recommended by our chef for today.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </div>
  )
}














