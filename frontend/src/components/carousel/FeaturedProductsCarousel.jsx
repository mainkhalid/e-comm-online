import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../product/ProductCard'

export default function FeaturedProductsCarousel({
  products,
  onAddToCart,
  title = 'Featured Products',
  viewAllHref = '/products',
  accentColor = '#FF6B2B',
}) {
  const carouselRef = useRef(null)
  const autoRef     = useRef(null)
  const pausedRef   = useRef(false)

  const [canScrollLeft, setCanScrollLeft]   = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIdx, setActiveIdx]           = useState(0)

  // Use offsetLeft of each child — the only reliable way to hit card edges
  const getChildLeft = useCallback((index) => {
    const el = carouselRef.current
    if (!el) return 0
    const child = el.children[index]
    return child ? child.offsetLeft : 0
  }, [])

  const updateScrollState = useCallback(() => {
    const el = carouselRef.current
    if (!el || !el.children.length) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)

    // Find which card is most in view
    let closest = 0
    let minDist = Infinity
    for (let i = 0; i < el.children.length; i++) {
      const dist = Math.abs(el.children[i].offsetLeft - el.scrollLeft)
      if (dist < minDist) { minDist = dist; closest = i }
    }
    setActiveIdx(closest)
  }, [])

  const scrollToIndex = useCallback((index) => {
    const el = carouselRef.current
    if (!el || !el.children.length) return
    const clamped = Math.max(0, Math.min(products.length - 1, index))
    el.scrollTo({ left: getChildLeft(clamped), behavior: 'smooth' })
  }, [products.length, getChildLeft])

  // Auto-scroll tick
  const tick = useCallback(() => {
    const el = carouselRef.current
    if (!el || pausedRef.current || !el.children.length) return

    let closest = 0
    let minDist = Infinity
    for (let i = 0; i < el.children.length; i++) {
      const dist = Math.abs(el.children[i].offsetLeft - el.scrollLeft)
      if (dist < minDist) { minDist = dist; closest = i }
    }

    const nextIndex = closest + 1 >= products.length ? 0 : closest + 1
    el.scrollTo({ left: getChildLeft(nextIndex), behavior: 'smooth' })
  }, [products.length, getChildLeft])

  const startAuto = useCallback(() => {
    clearInterval(autoRef.current)
    autoRef.current = setInterval(tick, 3500)
  }, [tick])

  const stopAuto = useCallback(() => {
    clearInterval(autoRef.current)
  }, [])

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const raf = requestAnimationFrame(updateScrollState)
    startAuto()
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      cancelAnimationFrame(raf)
      stopAuto()
    }
  }, [products, updateScrollState, startAuto, stopAuto])

  const scroll = (dir) => {
    const el = carouselRef.current
    if (!el || !el.children.length) return

    stopAuto()

    let closest = 0
    let minDist = Infinity
    for (let i = 0; i < el.children.length; i++) {
      const dist = Math.abs(el.children[i].offsetLeft - el.scrollLeft)
      if (dist < minDist) { minDist = dist; closest = i }
    }

    const nextIndex = dir === 'left'
      ? Math.max(0, closest - 2)
      : Math.min(products.length - 1, closest + 2)

    el.scrollTo({ left: getChildLeft(nextIndex), behavior: 'smooth' })
    setTimeout(startAuto, 6000)
  }

  const scrollToIdx = (i) => {
    stopAuto()
    scrollToIndex(i * 2)
    setTimeout(startAuto, 6000)
  }

  if (!products || products.length === 0) return null

  const dotCount = Math.ceil(products.length / 2)

  return (
    <section style={{ padding: '48px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 28, gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{
              width: 36, height: 3, borderRadius: 2,
              background: accentColor, marginBottom: 10,
            }} />
            <h2 style={{
              fontSize: 24, fontWeight: 900,
              color: '#111827', letterSpacing: '-0.02em',
              margin: 0, lineHeight: 1.15,
            }}>
              {title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              to={viewAllHref}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 700,
                color: accentColor, textDecoration: 'none',
                letterSpacing: '0.04em', textTransform: 'uppercase',
                transition: 'gap 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.gap = '10px'}
              onMouseLeave={e => e.currentTarget.style.gap = '6px'}
            >
              View All <ArrowRight size={13} />
            </Link>

            <div style={{ display: 'flex', gap: 6 }}>
              {['left', 'right'].map(dir => {
                const disabled = dir === 'left' ? !canScrollLeft : !canScrollRight
                return (
                  <button
                    key={dir}
                    onClick={() => scroll(dir)}
                    disabled={disabled}
                    aria-label={dir === 'left' ? 'Scroll left' : 'Scroll right'}
                    style={{
                      width: 36, height: 36, borderRadius: 9,
                      border: `1px solid ${disabled ? '#EAECF0' : '#D1D5DB'}`,
                      background: disabled ? '#F9FAFB' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: disabled ? 'default' : 'pointer',
                      transition: 'all 0.18s',
                      color: disabled ? '#D1D5DB' : '#374151',
                    }}
                    onMouseEnter={e => {
                      if (!disabled) {
                        e.currentTarget.style.background = accentColor
                        e.currentTarget.style.borderColor = accentColor
                        e.currentTarget.style.color = '#fff'
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = disabled ? '#F9FAFB' : '#fff'
                      e.currentTarget.style.borderColor = disabled ? '#EAECF0' : '#D1D5DB'
                      e.currentTarget.style.color = disabled ? '#D1D5DB' : '#374151'
                    }}
                  >
                    {dir === 'left' ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Carousel track */}
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => { pausedRef.current = true }}
          onMouseLeave={() => { pausedRef.current = false }}
          onTouchStart={() => { pausedRef.current = true }}
          onTouchEnd={() => { pausedRef.current = false }}
        >
          {/* Fade edges */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 32,
            background: 'linear-gradient(to left, transparent, var(--bg, #F0F2F5))',
            zIndex: 1, pointerEvents: 'none',
            opacity: canScrollLeft ? 1 : 0, transition: 'opacity 0.3s',
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 64,
            background: 'linear-gradient(to right, transparent, var(--bg, #F0F2F5))',
            zIndex: 1, pointerEvents: 'none',
            opacity: canScrollRight ? 1 : 0, transition: 'opacity 0.3s',
          }} />

          <div
            ref={carouselRef}
            className="carousel-track"
            style={{
              display: 'flex',
              gap: 14,
              overflowX: 'auto',
              // Remove scroll-snap — it fights JS scrollTo and causes snap-to-wrong-card
              overflowY: 'visible',
              paddingBottom: 8,
              paddingTop: 4,
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`
              .carousel-track::-webkit-scrollbar { display: none; }
            `}</style>

            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  flexShrink: 0,
                  width: 'clamp(220px, 23vw, 272px)',
                  transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s',
                  borderRadius: 14,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.10)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center', gap: 6, marginTop: 16,
        }}>
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIdx(i)}
              aria-label={`Go to group ${i + 1}`}
              style={{
                width: i === Math.floor(activeIdx / 2) ? 20 : 7,
                height: 7, borderRadius: 20, border: 'none',
                background: i === Math.floor(activeIdx / 2) ? accentColor : '#D1D5DB',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                padding: 0,
              }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}