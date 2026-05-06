import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function EmptyState({ message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Package size={64} className="text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
      <p className="text-gray-600 mb-6 text-center max-w-sm">{message}</p>
      <Link
        to="/products"
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Continue Shopping
      </Link>
    </div>
  )
}
