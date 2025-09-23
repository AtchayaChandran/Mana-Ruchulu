import { useParams } from 'react-router-dom'

export default function Dish() {
  const { id } = useParams()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Dish Details</h1>
      <p className="mt-2 text-gray-600">Dish ID: {id}</p>
    </div>
  )
}



