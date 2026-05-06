import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ShoppingCart, Heart, Star, ChevronRight, Minus, Plus, ExternalLink } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addItem } from '../../store/slices/cartSlice'
import { getCldHero, getCldMini } from '../../utils/cloudinaryUtils'
import { getProduct } from '../../api/services'
import toast from 'react-hot-toast'

const fmt = (p) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(p)

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14}
          style={{ color: i <= Math.round(rating) ? '#FBBF24' : '#E2E8F0', fill: i <= Math.round(rating) ? '#FBBF24' : '#E2E8F0' }} />
      ))}
    </div>
  )
}

export default function QuickViewModal({ product: listProduct, onClose }) {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(s => s.auth)
  const [product, setProduct]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [selectedImg, setSelectedImg] = useState(0)
  const [qty, setQty]                 = useState(1)
  const [wishlisted, setWishlisted]   = useState(false)
  const [adding, setAdding]           = useState(false)

  /* Fetch full product detail */
  useEffect(() => {
    if (!listProduct?.slug) return
    setLoading(true)
    getProduct(listProduct.slug)
      .then(({ data }) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [listProduct?.slug])

  /* Trap focus / close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Sign in to add to cart'); return }
    if (!product?.in_stock) return
    setAdding(true)
    try {
      await dispatch(addItem({ productId: product.id, quantity: qty })).unwrap()
      toast.success('Added to cart!')
    } catch { toast.error('Could not add to cart') }
    finally { setAdding(false) }
  }

  const images = product?.images || []
  const currentImgUrl = images[selectedImg]?.image || listProduct?.primary_image

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl animate-slide-down"
        style={{ background: 'var(--card)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'var(--bg)' }}
        >
          <X size={16} style={{ color: 'var(--text-muted)' }} />
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--orange)' }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 20" />
            </svg>
          </div>
        ) : !product ? (
          <div className="text-center p-12" style={{ color: 'var(--text-muted)' }}>Product not found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2">

            {/* ── Left: Images ── */}
            <div className="p-6" style={{ background: 'var(--bg)' }}>
              {/* Main image */}
              <div className="rounded-xl overflow-hidden mb-3" style={{ aspectRatio: '1/1', background: 'white' }}>
                <img
                  src={getCldHero(currentImgUrl)}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImg(i)}
                      className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all"
                      style={{
                        borderColor: i === selectedImg ? 'var(--orange)' : 'transparent',
                        background: 'white',
                      }}
                    >
                      <img src={getCldMini(img.image)} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Info ── */}
            <div className="p-6 flex flex-col">

              {/* Brand */}
              <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--orange)' }}>
                {product.brand?.name || 'TechZone'}
              </p>

              {/* Name */}
              <h2 className="text-lg font-bold leading-snug mb-3" style={{ color: 'var(--text)' }}>
                {product.name}
              </h2>

              {/* Stars */}
              <div className="flex items-center gap-2 mb-4">
                <Stars rating={product.average_rating} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {product.review_count} review{product.review_count !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                {product.discount_percent > 0 ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold" style={{ color: 'var(--danger)' }}>
                      {fmt(product.current_price)}
                    </span>
                    <span className="text-sm line-through" style={{ color: 'var(--text-muted)' }}>
                      {fmt(product.price)}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--danger)' }}>
                      -{product.discount_percent}%
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                    {fmt(product.current_price)}
                  </span>
                )}
              </div>

              {/* Short description */}
              {product.short_description && (
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  {product.short_description}
                </p>
              )}

              {/* Stock status */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full" style={{ background: product.in_stock ? 'var(--success)' : 'var(--danger)' }} />
                <span className="text-sm font-semibold" style={{ color: product.in_stock ? 'var(--success)' : 'var(--danger)' }}>
                  {product.in_stock
                    ? product.is_low_stock ? `Only ${product.stock_qty} left!` : 'In Stock'
                    : 'Out of Stock'}
                </span>
              </div>

              {/* Qty + actions */}
              {product.in_stock && (
                <div className="flex items-center gap-2 mb-4">
                  {/* Qty stepper */}
                  <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="px-3 py-2 transition-colors hover:bg-slate-50">
                      <Minus size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold" style={{ color: 'var(--text)' }}>
                      {qty}
                    </span>
                    <button onClick={() => setQty(q => Math.min(product.stock_qty, q + 1))}
                      className="px-3 py-2 transition-colors hover:bg-slate-50">
                      <Plus size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="flex-1 btn-primary justify-center py-2.5 disabled:opacity-60"
                  >
                    {adding ? (
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 20" />
                      </svg>
                    ) : (
                      <ShoppingCart size={16} />
                    )}
                    {adding ? 'Adding…' : 'Add to Cart'}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => setWishlisted(w => !w)}
                    className="btn-icon border rounded-lg"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <Heart size={17}
                      style={{ color: wishlisted ? 'var(--danger)' : 'var(--text-muted)', fill: wishlisted ? 'var(--danger)' : 'none' }} />
                  </button>
                </div>
              )}

              {/* View full page */}
              <Link
                to={`/products/${product.slug}`}
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              >
                <ExternalLink size={14} />
                View Full Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}