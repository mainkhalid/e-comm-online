import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react'
import { addItem } from '../../store/slices/cartSlice'
import { getCldThumb, safeImgUrl } from '../../utils/cloudinaryUtils'
import toast from 'react-hot-toast'
import { useState } from 'react'

const fmt = (p) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: 'KES', minimumFractionDigits: 0,
  }).format(p)

function StarRow({ rating, count, size = 13 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i} size={size}
          style={{
            color: i <= Math.round(rating) ? '#FBBF24' : '#E2E8F0',
            fill:  i <= Math.round(rating) ? '#FBBF24' : '#E2E8F0',
          }}
        />
      ))}
      {count !== undefined && (
        <span className="text-xs ml-0.5" style={{ color: 'var(--text-muted)' }}>({count})</span>
      )}
    </div>
  )
}

export default function ProductCard({ product, onQuickView }) {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(s => s.auth)
  const [wishlisted, setWishlisted] = useState(false)
  const [addingCart, setAddingCart] = useState(false)

  const imgSrc = getCldThumb(product.primary_image) || safeImgUrl(product.primary_image)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) { toast.error('Sign in to add to cart'); return }
    if (!product.in_stock) return
    setAddingCart(true)
    try {
      await dispatch(addItem({ productId: product.id, quantity: 1 })).unwrap()
      toast.success(`${product.name.slice(0, 30)}… added to cart`)
    } catch {
      toast.error('Could not add to cart')
    } finally {
      setAddingCart(false)
    }
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted(w => !w)
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️')
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product)
  }

  return (
    <Link to={`/products/${product.slug}`} className="group block h-full">
      <div className="product-card h-full flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">

        {/* ── Image Wrapper ── */}
        <div className="relative aspect-square w-full bg-gray-50/50 overflow-hidden">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20 bg-gray-100">📦</div>
          )}

          {/* Badges */}
          {product.discount_percent > 0 && (
            <span className="badge-sale absolute top-2.5 left-2.5">-{product.discount_percent}%</span>
          )}
          {product.is_featured && !product.discount_percent && (
            <span className="badge-featured absolute top-2.5 left-2.5">Featured</span>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-[2px] z-10">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
                style={{ background: 'var(--text)', color: 'white' }}>
                Out of Stock
              </span>
            </div>
          )}

          {/* Hover Actions Menu */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-250 translate-x-2 group-hover:translate-x-0 z-10">
            <button
              onClick={handleWishlist}
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all hover:bg-gray-50 active:scale-95"
              title="Add to wishlist"
            >
              <Heart
                size={14}
                style={{
                  color: wishlisted ? '#DC2626' : 'var(--text-muted)',
                  fill:  wishlisted ? '#DC2626' : 'none',
                }}
              />
            </button>
            {onQuickView && (
              <button
                onClick={handleQuickView}
                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all hover:bg-gray-50 active:scale-95"
                title="Quick view"
              >
                <Eye size={14} style={{ color: 'var(--text-muted)' }} />
              </button>
            )}
          </div>

          {/* Low stock ribbon */}
          {product.in_stock && product.is_low_stock && (
            <div className="absolute bottom-0 left-0 right-0 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white select-none z-10"
              style={{ background: 'var(--orange)' }}>
              Only {product.stock_qty} left
            </div>
          )}
        </div>

        {/* ── Info area ── */}
        <div className="flex flex-col flex-1 p-4">

          {/* Brand */}
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--orange)' }}>
            {product.brand_name || 'Nixxon Technologies'}
          </p>

          {/* Name */}
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 mb-2 transition-colors duration-200 group-hover:text-[var(--orange)]"
            style={{ color: 'var(--text)' }}>
            {product.name}
          </h3>

          {/* Stars */}
          {product.review_count > 0 && (
            <div className="mb-3">
              <StarRow rating={product.average_rating} count={product.review_count} />
            </div>
          )}

          {/* Price & Action Container */}
          <div className="mt-auto pt-2">
            {product.discount_percent > 0 ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-base font-bold" style={{ color: 'var(--danger)' }}>
                  {fmt(product.current_price)}
                </span>
                <span className="text-xs line-through opacity-70" style={{ color: 'var(--text-muted)' }}>
                  {fmt(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-base font-bold" style={{ color: 'var(--text)' }}>
                {fmt(product.current_price)}
              </span>
            )}

            {/* Add to cart button inside the context block */}
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock || addingCart}
              className="mt-3.5 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:transform-none disabled:cursor-not-allowed"
              style={{
                background: product.in_stock ? 'var(--navy)' : 'var(--border)',
                color: product.in_stock ? 'white' : 'var(--text-muted)',
              }}
            >
              {addingCart ? (
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 20" />
                </svg>
              ) : (
                <ShoppingCart size={13} />
              )}
              {addingCart ? 'Adding…' : product.in_stock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

        </div>
      </div>
    </Link>
  )
}