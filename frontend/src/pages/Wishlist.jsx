import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import { addItem } from '../store/slices/cartSlice'

const STORAGE_KEY = 'tz_wishlist'

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function saveWishlist(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function addToWishlist(product) {
  const list = getWishlist()
  if (list.find(p => p.id === product.id)) return false
  list.push({
    id: product.id,
    slug: product.slug,
    name: product.name,
    primary_image: product.primary_image,
    price: product.price,
    sale_price: product.sale_price,
    current_price: product.current_price,
    discount_percent: product.discount_percent,
    brand_name: product.brand_name,
    in_stock: product.in_stock,
  })
  saveWishlist(list)
  return true
}

export function removeFromWishlist(productId) {
  const list = getWishlist().filter(p => p.id !== productId)
  saveWishlist(list)
  return list
}

export function isInWishlist(productId) {
  return getWishlist().some(p => p.id === productId)
}

const fmt = p => new Intl.NumberFormat('en-KE', {
  style: 'currency', currency: 'KES', minimumFractionDigits: 0,
}).format(p)

export default function Wishlist() {
  const [items, setItems] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    setItems(getWishlist())
  }, [])

  const handleRemove = useCallback((id) => {
    const updated = removeFromWishlist(id)
    setItems(updated)
    toast.success('Removed from wishlist')
  }, [])

  const handleAddToCart = useCallback((product) => {
    dispatch(addItem({ productId: product.id, quantity: 1 }))
      .unwrap()
      .then(() => toast.success('Added to cart!'))
      .catch(() => toast.error('Sign in to add items'))
  }, [dispatch])

  return (
    <>
      <Helmet>
        <title>Wishlist — Nixxon Technologies</title>
        <meta name="description" content="Your saved items at Nixxon Technologies." />
      </Helmet>

      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 py-5">
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Home › Wishlist</p>
            <div className="flex items-center gap-3">
              <Heart size={22} style={{ color: 'var(--danger)' }} fill="var(--danger)" />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                My Wishlist
              </h1>
              {items.length > 0 && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: 'var(--orange)' }}
                >
                  {items.length}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {items.length === 0 ? (
            /* Empty state */
            <div
              className="text-center py-20 rounded-2xl"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(220,38,38,0.08)' }}
              >
                <Heart size={36} style={{ color: 'var(--danger)' }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                Your wishlist is empty
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Browse our products and tap the heart icon to save items here.
              </p>
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                Browse Products <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            /* Product grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map(product => (
                <div
                  key={product.id}
                  className="rounded-xl overflow-hidden group transition-shadow hover:shadow-card"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  {/* Image */}
                  <Link to={`/products/${product.slug}`} className="block relative" style={{ aspectRatio: '1/1', background: 'var(--bg)' }}>
                    {product.primary_image ? (
                      <img
                        src={product.primary_image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">📦</div>
                    )}
                    {product.discount_percent > 0 && (
                      <span
                        className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: 'var(--danger)' }}
                      >
                        -{product.discount_percent}%
                      </span>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--orange)' }}>
                      {product.brand_name}
                    </p>
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="text-sm font-semibold line-clamp-2 mb-2 transition-colors hover:text-orange-500" style={{ color: 'var(--text)' }}>
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-3">
                      {product.discount_percent > 0 ? (
                        <>
                          <span className="text-base font-bold" style={{ color: 'var(--danger)' }}>{fmt(product.current_price)}</span>
                          <span className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>{fmt(product.price)}</span>
                        </>
                      ) : (
                        <span className="text-base font-bold" style={{ color: 'var(--text)' }}>{fmt(product.current_price || product.price)}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.in_stock}
                        className="btn-primary flex-1 text-xs py-2 gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed justify-center"
                      >
                        <ShoppingCart size={13} />
                        {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors hover:bg-red-50"
                        style={{ borderColor: 'var(--border)' }}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
