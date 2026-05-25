import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import {
  ShoppingCart, Heart, Star, ChevronRight, Minus, Plus,
  Truck, Shield, RotateCcw, Package, Share2, ZoomIn,
  Check, X, MessageSquare, ThumbsUp, Award, Zap,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getProduct, getReviews, createReview, getProducts } from '../api/services'
import { addItem } from '../store/slices/cartSlice'
import { getCldHero, getCldMini, safeImgUrl } from '../utils/cloudinaryUtils'
import ProductCard from '../components/product/ProductCard'

const fmt = p => new Intl.NumberFormat('en-KE', {
  style: 'currency', currency: 'KES', minimumFractionDigits: 0,
}).format(p)

/* ── Star rating display ── */
function Stars({ rating, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size}
          style={{
            color: i <= Math.round(rating) ? '#FBBF24' : '#E2E8F0',
            fill:  i <= Math.round(rating) ? '#FBBF24' : '#E2E8F0',
          }}
        />
      ))}
    </div>
  )
}

/* ── Interactive star picker ── */
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i} type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        >
          <Star size={24}
            style={{
              color: i <= (hover || value) ? '#FBBF24' : '#E2E8F0',
              fill:  i <= (hover || value) ? '#FBBF24' : '#E2E8F0',
              transition: 'all 0.1s',
            }}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hover || value]}
      </span>
    </div>
  )
}

/* ── Rating breakdown bar ── */
function RatingBar({ star, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-3 text-right" style={{ color: 'var(--text-muted)' }}>{star}</span>
      <Star size={10} style={{ color: '#FBBF24', fill: '#FBBF24', flexShrink: 0 }} />
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: '#FBBF24' }} />
      </div>
      <span className="w-5 text-right" style={{ color: 'var(--text-muted)' }}>{count}</span>
    </div>
  )
}

/* ── Image zoom overlay ── */
function ImageZoom({ src, alt, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <img
        src={src} alt={alt}
        className="max-w-full max-h-[90vh] rounded-2xl object-contain"
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}

/* ─── Main component ─────────────────────────────────── */
export default function ProductDetail() {
  const { slug }    = useParams()
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const { isAuthenticated } = useSelector(s => s.auth)

  const [product, setProduct]       = useState(null)
  const [reviews, setReviews]       = useState([])
  const [related, setRelated]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [selectedImg, setSelectedImg] = useState(0)
  const [quantity, setQuantity]     = useState(1)
  const [activeTab, setActiveTab]   = useState('description')
  const [wishlisted, setWishlisted] = useState(false)
  const [adding, setAdding]         = useState(false)
  const [zoomSrc, setZoomSrc]       = useState(null)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  /* Review form */
  const [showForm, setShowForm]         = useState(false)
  const [reviewForm, setReviewForm]     = useState({ rating: 5, title: '', body: '' })
  const [submitting, setSubmitting]     = useState(false)

  useEffect(() => {
    setLoading(true)
    setSelectedImg(0)
    setQuantity(1)
    setActiveTab('description')

    Promise.all([
      getProduct(slug),
      getReviews(slug).catch(() => ({ data: [] })),
    ])
      .then(([{ data: prod }, { data: revs }]) => {
        setProduct(prod)
        setReviews(revs.results || revs)

        /* Related products */
        if (prod.category?.slug) {
          getProducts({ category__slug: prod.category.slug, page_size: 6 })
            .then(({ data: d }) =>
              setRelated((d.results || d).filter(p => p.slug !== slug).slice(0, 4))
            )
            .catch(() => {})
        }
      })
      .catch(() => { toast.error('Product not found'); navigate('/products') })
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please sign in first'); return }
    setAdding(true)
    try {
      await dispatch(addItem({ productId: product.id, quantity })).unwrap()
      toast.success(`${quantity}× ${product.name.slice(0, 25)}… added to cart!`)
    } catch { toast.error('Failed to add to cart') }
    finally { setAdding(false) }
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    navigate('/cart')
  }

  const handleShare = () => {
    navigator.share?.({ title: product.name, url: window.location.href })
      || navigator.clipboard.writeText(window.location.href).then(() => toast.success('Link copied!'))
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Sign in first'); return }
    setSubmitting(true)
    try {
      await createReview(slug, { ...reviewForm, product: product.id })
      toast.success("Review submitted — it'll appear after approval")
      setShowForm(false)
      setReviewForm({ rating: 5, title: '', body: '' })
    } catch (err) {
      toast.error(err.response?.data?.non_field_errors?.[0] || 'Failed to submit')
    } finally { setSubmitting(false) }
  }

  /* Rating breakdown */
  const ratingCounts = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1
    return acc
  }, {})

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="skeleton rounded-2xl" style={{ aspectRatio: '1/1' }} />
            <div className="space-y-4 pt-4">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-8 w-3/4 rounded" />
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-10 w-40 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-5/6 rounded" />
              <div className="skeleton h-12 w-full rounded-xl mt-8" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const images = product.images || []
  const currentImg = images[selectedImg]

  const TABS = [
    { key: 'description',     label: 'Description' },
    { key: 'specifications',  label: 'Specifications', count: product.specs?.length },
    { key: 'reviews',         label: 'Reviews', count: product.review_count },
  ]

  return (
    <>
      <Helmet>
        <title>{product.meta_title || `${product.name} — Nixxon Technologies`}</title>
        <meta name="description" content={product.meta_description || product.short_description} />
        {product.schema_json_ld && (
          <script type="application/ld+json">{JSON.stringify(product.schema_json_ld)}</script>
        )}
      </Helmet>

      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

        {/* ── Breadcrumb ── */}
        <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-1.5 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link to="/products" className="hover:text-orange-500 transition-colors">Products</Link>
              {product.category && (
                <>
                  <ChevronRight size={12} />
                  <Link
                    to={`/products?category=${product.category.slug}`}
                    className="hover:text-orange-500 transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </>
              )}
              <ChevronRight size={12} />
              <span className="font-medium truncate max-w-[180px]" style={{ color: 'var(--text)' }}>
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* ── Product main section ── */}
          <div
            className="rounded-2xl overflow-hidden mb-8"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* ── Left: Image gallery ── */}
              <div
                className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r"
                style={{ borderColor: 'var(--border)' }}
              >
                {/* Main image */}
                <div
                  className="relative rounded-2xl overflow-hidden mb-4 cursor-zoom-in group"
                  style={{ aspectRatio: '1/1', background: 'var(--bg)' }}
                  onClick={() => currentImg && setZoomSrc(getCldHero(currentImg.image))}
                >
                  {currentImg ? (
                    <img
                      src={getCldHero(currentImg.image)}
                      alt={currentImg.alt_text || product.name}
                      className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={80} style={{ color: 'var(--border)' }} />
                    </div>
                  )}

                  {/* Badges */}
                  {product.discount_percent > 0 && (
                    <div
                      className="absolute top-4 left-4 text-white text-xs font-bold px-2.5 py-1.5 rounded-full"
                      style={{ background: 'var(--danger)' }}
                    >
                      -{product.discount_percent}%
                    </div>
                  )}
                  {product.is_featured && (
                    <div
                      className="absolute top-4 right-4 text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1"
                      style={{ background: 'var(--orange)' }}
                    >
                      <Award size={10} /> Featured
                    </div>
                  )}

                  {/* Zoom hint */}
                  <div
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(15,23,42,0.6)', color: 'white' }}
                  >
                    <ZoomIn size={14} />
                  </div>

                  {/* Out of stock overlay */}
                  {!product.in_stock && (
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
                      style={{ background: 'rgba(255,255,255,0.75)' }}>
                      <span
                        className="text-sm font-bold px-6 py-3 rounded-full text-white"
                        style={{ background: 'var(--text)' }}
                      >
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImg(i)}
                        className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all"
                        style={{
                          borderColor: i === selectedImg ? 'var(--orange)' : 'var(--border)',
                          background: 'var(--bg)',
                        }}
                      >
                        <img
                          src={getCldMini(img.image)}
                          alt={img.alt_text || ''}
                          className="w-full h-full object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Right: Product info ── */}
              <div className="p-6 lg:p-8 flex flex-col">

                {/* Brand + SKU row */}
                <div className="flex items-center justify-between mb-2">
                  {product.brand && (
                    <Link
                      to={`/products?brand=${product.brand.slug}`}
                      className="text-xs font-bold uppercase tracking-widest transition-colors hover:opacity-70"
                      style={{ color: 'var(--orange)' }}
                    >
                      {product.brand.name}
                    </Link>
                  )}
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    SKU: {product.sku}
                  </span>
                </div>

                {/* Name */}
                <h1 className="text-2xl lg:text-3xl font-bold leading-tight mb-4" style={{ color: 'var(--text)' }}>
                  {product.name}
                </h1>

                {/* Rating row */}
                <div className="flex items-center gap-3 mb-5">
                  <Stars rating={product.average_rating} size={16} />
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {product.review_count > 0
                      ? `${product.average_rating}/5 (${product.review_count} review${product.review_count !== 1 ? 's' : ''})`
                      : 'No reviews yet'}
                  </button>
                </div>

                {/* Price block */}
                <div
                  className="rounded-xl p-4 mb-5"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                >
                  {product.discount_percent > 0 ? (
                    <div>
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-3xl font-bold" style={{ color: 'var(--danger)' }}>
                          {fmt(product.current_price)}
                        </span>
                        <span className="text-base line-through" style={{ color: 'var(--text-muted)' }}>
                          {fmt(product.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-bold px-2 py-1 rounded-full text-white"
                          style={{ background: 'var(--danger)' }}
                        >
                          -{product.discount_percent}% OFF
                        </span>
                        <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>
                          You save {fmt(product.price - product.current_price)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                      {fmt(product.current_price)}
                    </span>
                  )}
                </div>

                {/* Short description */}
                {product.short_description && (
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                    {product.short_description}
                  </p>
                )}

                {/* Stock badge */}
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: product.in_stock ? 'var(--success)' : 'var(--danger)' }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: product.in_stock ? 'var(--success)' : 'var(--danger)' }}
                  >
                    {product.in_stock
                      ? product.is_low_stock
                        ? `⚡ Only ${product.stock_qty} left — order soon!`
                        : 'In Stock — ready to ship'
                      : 'Out of Stock'}
                  </span>
                </div>

                {/* Tags */}
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {product.tags.map(tag => (
                      <Link
                        key={tag.id}
                        to={`/products?tag=${tag.slug}`}
                        className="text-xs px-2.5 py-1 rounded-full transition-colors"
                        style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Qty + actions */}
                {product.in_stock && (
                  <div className="space-y-3 mb-6">
                    {/* Qty row */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Qty:</span>
                      <div
                        className="flex items-center rounded-lg overflow-hidden"
                        style={{ border: '1px solid var(--border)' }}
                      >
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="px-3.5 py-2 transition-colors hover:bg-slate-50"
                        >
                          <Minus size={14} style={{ color: 'var(--text-muted)' }} />
                        </button>
                        <span className="w-12 text-center text-sm font-bold" style={{ color: 'var(--text)' }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(q => Math.min(product.stock_qty, q + 1))}
                          className="px-3.5 py-2 transition-colors hover:bg-slate-50"
                        >
                          <Plus size={14} style={{ color: 'var(--text-muted)' }} />
                        </button>
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        ({product.stock_qty} available)
                      </span>
                    </div>

                    {/* CTA buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddToCart}
                        disabled={adding}
                        className="flex-1 btn-primary justify-center py-3 disabled:opacity-60"
                      >
                        {adding ? (
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 20" />
                          </svg>
                        ) : <ShoppingCart size={17} />}
                        {adding ? 'Adding…' : 'Add to Cart'}
                      </button>
                      <button
                        onClick={handleBuyNow}
                        className="flex-1 btn-navy justify-center py-3"
                      >
                        <Zap size={17} />
                        Buy Now
                      </button>
                    </div>

                    {/* Secondary actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setWishlisted(w => !w)}
                        className="flex-1 btn-outline justify-center py-2.5"
                        style={wishlisted ? { borderColor: 'var(--danger)', color: 'var(--danger)' } : {}}
                      >
                        <Heart size={15}
                          style={{ fill: wishlisted ? 'var(--danger)' : 'none', color: wishlisted ? 'var(--danger)' : 'inherit' }} />
                        {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                      </button>
                      <button onClick={handleShare} className="btn-icon border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                        <Share2 size={16} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Trust strip */}
                <div
                  className="grid grid-cols-3 gap-2 pt-5 border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {[
                    { icon: Truck,      label: 'Free Delivery',  sub: 'Orders over KSh 5K' },
                    { icon: Shield,     label: '1-Year Warranty',sub: 'Genuine product' },
                    { icon: RotateCcw,  label: '30-Day Returns', sub: 'Hassle-free' },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex flex-col items-center text-center p-2.5 rounded-xl"
                      style={{ background: 'var(--bg)' }}>
                      <Icon size={17} className="mb-1" style={{ color: 'var(--orange)' }} />
                      <p className="text-[11px] font-semibold" style={{ color: 'var(--text)' }}>{label}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs: Description / Specs / Reviews ── */}
          <div
            className="rounded-2xl overflow-hidden mb-10"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {/* Tab bar */}
            <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex items-center gap-1.5 px-6 py-4 text-sm font-semibold transition-all relative"
                  style={{ color: activeTab === tab.key ? 'var(--orange)' : 'var(--text-muted)' }}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: activeTab === tab.key ? 'rgba(255,107,43,0.12)' : 'var(--bg)',
                        color: activeTab === tab.key ? 'var(--orange)' : 'var(--text-muted)',
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.key && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: 'var(--orange)' }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 lg:p-10">

              {/* ── Description tab ── */}
              {activeTab === 'description' && (
                <div>
                  {product.description ? (
                    <div
                      className="prose prose-sm max-w-none text-sm leading-relaxed"
                      style={{ color: 'var(--text-muted)' }}
                      dangerouslySetInnerHTML={{
                        __html: product.description.replace(/\n/g, '<br/>'),
                      }}
                    />
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No detailed description available for this product.</p>
                  )}
                </div>
              )}

              {/* ── Specifications tab ── */}
              {activeTab === 'specifications' && (
                <div>
                  {product.specs?.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                      <table className="w-full text-sm">
                        <tbody>
                          {product.specs.map((spec, i) => (
                            <tr
                              key={spec.id}
                              style={{ background: i % 2 === 0 ? 'var(--bg)' : 'var(--card)' }}
                            >
                              <td
                                className="py-3 px-5 font-semibold w-40 lg:w-56"
                                style={{ color: 'var(--text)', borderRight: '1px solid var(--border)' }}
                              >
                                {spec.label}
                              </td>
                              <td className="py-3 px-5" style={{ color: 'var(--text-muted)' }}>
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No specifications listed for this product.</p>
                  )}
                </div>
              )}

              {/* ── Reviews tab ── */}
              {activeTab === 'reviews' && (
                <div>
                  {/* Rating summary */}
                  {reviews.length > 0 && (
                    <div
                      className="flex flex-col sm:flex-row gap-8 p-6 rounded-xl mb-8"
                      style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                    >
                      {/* Big number */}
                      <div className="text-center sm:border-r sm:pr-8" style={{ borderColor: 'var(--border)' }}>
                        <div className="text-5xl font-bold mb-1" style={{ color: 'var(--text)' }}>
                          {product.average_rating}
                        </div>
                        <Stars rating={product.average_rating} size={18} />
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          {product.review_count} reviews
                        </p>
                      </div>

                      {/* Bars */}
                      <div className="flex-1 flex flex-col justify-center gap-1.5">
                        {[5, 4, 3, 2, 1].map(star => (
                          <RatingBar
                            key={star}
                            star={star}
                            count={ratingCounts[star] || 0}
                            total={reviews.length}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Write review header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                      Customer Reviews
                    </h3>
                    {isAuthenticated ? (
                      <button
                        onClick={() => setShowForm(f => !f)}
                        className="btn-primary py-2 text-xs"
                      >
                        <MessageSquare size={13} />
                        Write a Review
                      </button>
                    ) : (
                      <Link to="/login" className="text-sm font-semibold" style={{ color: 'var(--orange)' }}>
                        Sign in to review
                      </Link>
                    )}
                  </div>

                  {/* Review form */}
                  {showForm && (
                    <form
                      onSubmit={handleSubmitReview}
                      className="rounded-xl p-6 mb-8"
                      style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                    >
                      <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--text)' }}>Your Review</h4>

                      <div className="mb-4">
                        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          Rating *
                        </label>
                        <StarPicker value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} />
                      </div>

                      <div className="mb-4">
                        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          Title (optional)
                        </label>
                        <input
                          value={reviewForm.title}
                          onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                          className="input"
                          placeholder="Summarise your experience…"
                        />
                      </div>

                      <div className="mb-5">
                        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          Review *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={reviewForm.body}
                          onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))}
                          className="input resize-none"
                          placeholder="Tell others what you think of this product…"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn-primary disabled:opacity-60"
                        >
                          {submitting ? 'Submitting…' : 'Submit Review'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="btn-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Reviews list */}
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map(review => (
                        <div
                          key={review.id}
                          className="pb-6 border-b last:border-0"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <div className="flex items-start gap-3 mb-2">
                            {/* Avatar */}
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                              style={{ background: 'var(--navy)' }}
                            >
                              {(review.user_name?.[0] || 'U').toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                                  {review.user_name || 'Anonymous'}
                                </span>
                                <Stars rating={review.rating} size={12} />
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                  {new Date(review.created_at).toLocaleDateString('en-KE', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                  })}
                                </span>
                              </div>
                              {review.title && (
                                <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text)' }}>
                                  {review.title}
                                </p>
                              )}
                              <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                {review.body}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Star size={44} style={{ color: 'var(--border)', margin: '0 auto 12px' }} />
                      <h4 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>
                        No reviews yet
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Be the first to review this product
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* ── Related products ── */}
          {related.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="section-title text-xl">Related Products</h2>
                {product.category && (
                  <Link
                    to={`/products?category=${product.category.slug}`}
                    className="text-sm font-semibold"
                    style={{ color: 'var(--navy)' }}
                  >
                    View all {product.category.name} →
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {related.map(p => <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />)}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Zoom overlay ── */}
      {zoomSrc && (
        <ImageZoom
          src={zoomSrc}
          alt={product.name}
          onClose={() => setZoomSrc(null)}
        />
      )}
    </>
  )
}