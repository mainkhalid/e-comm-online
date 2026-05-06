import { Heart, ShoppingCart, Search, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, onAddToCart }) {
  if (!product) return null

  const isOnSale = product.original_price && product.price < product.original_price
  const discount = isOnSale
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <div className="product-card">
      {/* Badge */}
      {isOnSale && <div className="badge-hot">HOT</div>}

      {/* Image Container */}
      <Link
        to={`/product/${product.slug || product.id}`}
        className="relative overflow-hidden bg-gray-100 h-48 flex items-center justify-center group"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl">📦</div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button className="btn-icon bg-white/90">
            <ShoppingCart size={18} />
          </button>
          <button className="btn-icon bg-white/90">
            <Search size={18} />
          </button>
          <button className="btn-icon bg-white/90">
            <Share2 size={18} />
          </button>
          <button className="btn-icon bg-white/90">
            <Heart size={18} />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        <Link
          to={`/product/${product.slug || product.id}`}
          className="text-sm font-semibold text-gray-900 hover:text-green-600 line-clamp-2"
        >
          {product.name}
        </Link>

        <p className="text-xs text-gray-500 mt-1">
          {product.category || 'Products'}
        </p>

        {/* Rating */}
        {product.average_rating && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.round(product.average_rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.rating_count || 0})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              KSh {(product.price / 1000).toFixed(1)}K
            </span>
            {isOnSale && (
              <span className="text-xs text-gray-500 line-through">
                KSh {(product.original_price / 1000).toFixed(1)}K
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="text-xs text-green-600 font-semibold">
              Save {discount}%
            </span>
          )}
        </div>

        {/* Stock Status */}
        {!product.in_stock && (
          <div className="text-xs font-bold text-red-600 mt-2">SOLD OUT</div>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToCart(product)}
        disabled={!product.in_stock}
        className="m-3 btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  )
}
