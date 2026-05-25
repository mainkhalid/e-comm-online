import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { LayoutGrid, List, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { getProducts, getCategories, getBrands } from '../api/services'
import ProductCard from '../components/product/ProductCard'
import FilterSidebar from '../components/filters/FilterSidebar'
import QuickViewModal from '../components/product/QuickViewModal'

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest First' },
  { value: 'price',       label: 'Price: Low → High' },
  { value: '-price',      label: 'Price: High → Low' },
  { value: '-average_rating', label: 'Top Rated' },
  { value: 'name',        label: 'Name A–Z' },
]

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="skeleton" style={{ aspectRatio: '1/1' }} />
      <div className="p-3.5 space-y-2.5">
        <div className="skeleton h-2.5 w-16 rounded" />
        <div className="skeleton h-3.5 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="skeleton h-5 w-24 rounded mt-1" />
        <div className="skeleton h-8 w-full rounded-lg mt-2" />
      </div>
    </div>
  )
}

/* ── Active filter chips ── */
function ActiveChips({ chips, onRemove }) {
  if (!chips.length) return null
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onRemove(key)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
          style={{ background: 'rgba(255,107,43,0.10)', color: 'var(--orange)', border: '1px solid rgba(255,107,43,0.25)' }}
        >
          {label}
          <X size={11} />
        </button>
      ))}
    </div>
  )
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [count, setCount]         = useState(0)
  const [page, setPage]           = useState(1)
  const [hasMore, setHasMore]     = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const [viewMode, setViewMode]         = useState('grid') // 'grid' | 'list'
  const [mobileFilters, setMobileFilters] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  /* URL params */
  const search      = searchParams.get('search')    || ''
  const category    = searchParams.get('category')  || ''
  const brand       = searchParams.get('brand')     || ''
  const onSale      = searchParams.get('on_sale')   || ''
  const ordering    = searchParams.get('ordering')  || '-created_at'
  const minPrice    = searchParams.get('min_price') || ''
  const maxPrice    = searchParams.get('max_price') || ''
  const minRating   = searchParams.get('min_rating')|| ''

  const setParam = useCallback((key, value) => {
    const p = new URLSearchParams(searchParams)
    if (key === '_batch_price' && typeof value === 'object') {
      Object.entries(value).forEach(([k, v]) => {
        v ? p.set(k, v) : p.delete(k)
      })
    } else {
      value ? p.set(key, value) : p.delete(key)
    }
    p.delete('page')
    setSearchParams(p)
  }, [searchParams, setSearchParams])

  const clearAll = () => {
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    setSearchParams(p)
  }

  /* Active filter chips */
  const chips = [
    category  && { key: 'category',  label: `Category: ${categories.find(c => c.slug === category)?.name || category}` },
    brand     && { key: 'brand',     label: `Brand: ${brands.find(b => b.slug === brand)?.name || brand}` },
    onSale    && { key: 'on_sale',   label: '🔥 On Sale' },
    minPrice  && { key: 'min_price', label: `Min KSh ${parseInt(minPrice).toLocaleString()}` },
    maxPrice  && { key: 'max_price', label: `Max KSh ${parseInt(maxPrice).toLocaleString()}` },
    minRating && { key: 'min_rating',label: `${minRating}★ & up` },
  ].filter(Boolean)

  /* Reset page on filter change */
  useEffect(() => {
    setPage(1)
    setProducts([])
  }, [searchParams])

  /* Fetch products */
  useEffect(() => {
    const isFirstPage = page === 1
    isFirstPage ? setLoading(true) : setLoadingMore(true)

    const params = { page, page_size: 24 }
    if (search)   params.search         = search
    if (category) params.category__slug = category
    if (brand)    params.brand__slug    = brand
    if (onSale)   params.on_sale        = true
    if (minPrice) params.price__gte     = minPrice
    if (maxPrice) params.price__lte     = maxPrice
    if (minRating) params.min_rating    = minRating
    params.ordering = ordering

    getProducts(params)
      .then(({ data }) => {
        const results = data.results || data
        setProducts(prev => isFirstPage ? results : [...prev, ...results])
        setCount(data.count || results.length)
        setHasMore(!!data.next)
      })
      .catch(() => {})
      .finally(() => { setLoading(false); setLoadingMore(false) })
  }, [searchParams, page])

  /* Fetch categories + brands once */
  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data.results || data)).catch(() => {})
    getBrands().then(({ data }) => setBrands(data.results || data)).catch(() => {})
  }, [])

  /* Page title */
  const pageTitle = search
    ? `"${search}"`
    : category ? (categories.find(c => c.slug === category)?.name || category) : 'All Products'

  return (
    <>
      <Helmet>
        <title>{pageTitle} — Nixxon Technologies</title>
        <meta name="description" content={`Shop ${pageTitle} in Kenya. Genuine products, M-Pesa payments, fast delivery.`} />
      </Helmet>

      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        {/* ── Page header ── */}
        <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 py-5">
            {/* Breadcrumb */}
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              Home › {category || brand ? `${pageTitle}` : 'All Products'}
            </p>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{pageTitle}</h1>
                {!loading && (
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {count.toLocaleString()} product{count !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={ordering}
                    onChange={e => setParam('ordering', e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border outline-none cursor-pointer"
                    style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--text)' }}
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--text-muted)' }} />
                </div>

                {/* View toggle */}
                <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                  {['grid', 'list'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className="w-9 h-9 flex items-center justify-center transition-colors"
                      style={{
                        background: viewMode === mode ? 'var(--navy)' : 'var(--card)',
                        color: viewMode === mode ? 'white' : 'var(--text-muted)',
                      }}
                    >
                      {mode === 'grid' ? <LayoutGrid size={15} /> : <List size={15} />}
                    </button>
                  ))}
                </div>

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setMobileFilters(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border lg:hidden"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--card)' }}
                >
                  <SlidersHorizontal size={14} />
                  Filters
                  {chips.length > 0 && (
                    <span className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                      style={{ background: 'var(--orange)' }}>
                      {chips.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-4 py-6">

          {/* Active filter chips */}
          <ActiveChips chips={chips} onRemove={(key) => setParam(key, '')} />

          <div className="flex gap-6">
            {/* ── Desktop sidebar ── */}
            <div className="hidden lg:block w-56 flex-shrink-0">
              <div
                className="sticky top-20 rounded-xl p-4"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <FilterSidebar
                  categories={categories}
                  brands={brands}
                  currentCategory={category}
                  currentBrand={brand}
                  currentOnSale={onSale}
                  currentMinPrice={minPrice}
                  currentMaxPrice={maxPrice}
                  currentRating={minRating}
                  activeCount={chips.length}
                  onSetParam={setParam}
                  onClearAll={clearAll}
                />
              </div>
            </div>

            {/* ── Product grid / list ── */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3'
                    : 'flex flex-col gap-3'
                }>
                  {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-24 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <p className="text-4xl mb-4">🔍</p>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>No products found</h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={clearAll}
                    className="btn-primary"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                      {products.map(p => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          onQuickView={setQuickViewProduct}
                        />
                      ))}
                    </div>
                  ) : (
                    /* List view */
                    <div className="flex flex-col gap-3">
                      {products.map(p => (
                        <ListCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
                      ))}
                    </div>
                  )}

                  {/* Load more */}
                  {hasMore && (
                    <div className="flex justify-center mt-10">
                      <button
                        onClick={() => setPage(n => n + 1)}
                        disabled={loadingMore}
                        className="btn-outline px-10 py-3 disabled:opacity-50"
                      >
                        {loadingMore ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 20" />
                            </svg>
                            Loading…
                          </span>
                        ) : `Load more (${count - products.length} remaining)`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {mobileFilters && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          style={{ background: 'rgba(15,23,42,0.6)' }}
          onClick={() => setMobileFilters(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-72 overflow-y-auto p-5"
            style={{ background: 'var(--card)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold" style={{ color: 'var(--text)' }}>Filters</span>
              <button onClick={() => setMobileFilters(false)}>
                <X size={18} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
            <FilterSidebar
              categories={categories}
              brands={brands}
              currentCategory={category}
              currentBrand={brand}
              currentOnSale={onSale}
              currentMinPrice={minPrice}
              currentMaxPrice={maxPrice}
              currentRating={minRating}
              activeCount={chips.length}
              onSetParam={(key, val) => { setParam(key, val); setMobileFilters(false) }}
              onClearAll={() => { clearAll(); setMobileFilters(false) }}
            />
          </div>
        </div>
      )}

      {/* ── Quick view modal ── */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  )
}

/* ── List view card ── */
function ListCard({ product, onQuickView }) {
  const fmt = p => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(p)

  return (
    <a
      href={`/products/${product.slug}`}
      className="flex gap-4 p-4 rounded-xl transition-all hover:shadow-card"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* Image */}
      <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden" style={{ background: 'var(--bg)' }}>
        {product.primary_image ? (
          <img src={product.primary_image} alt={product.name} className="w-full h-full object-contain p-2" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">📦</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--orange)' }}>
          {product.brand_name}
        </p>
        <h3 className="text-sm font-semibold line-clamp-2 mb-1" style={{ color: 'var(--text)' }}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[1,2,3,4,5].map(i => (
            <span key={i} style={{ color: i <= Math.round(product.average_rating) ? '#FBBF24' : '#E2E8F0', fontSize: 12 }}>★</span>
          ))}
          <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>({product.review_count})</span>
        </div>
        <div className="flex items-center gap-2">
          {product.discount_percent > 0 ? (
            <>
              <span className="text-base font-bold" style={{ color: 'var(--danger)' }}>{fmt(product.current_price)}</span>
              <span className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>{fmt(product.price)}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: 'var(--danger)' }}>-{product.discount_percent}%</span>
            </>
          ) : (
            <span className="text-base font-bold" style={{ color: 'var(--text)' }}>{fmt(product.current_price)}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 flex-shrink-0 justify-center">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: product.in_stock ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)',
            color: product.in_stock ? 'var(--success)' : 'var(--danger)',
          }}
        >
          {product.in_stock ? 'In Stock' : 'Out of Stock'}
        </span>
        <button
          onClick={e => { e.preventDefault(); onQuickView?.(product) }}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          Quick View
        </button>
      </div>
    </a>
  )
}