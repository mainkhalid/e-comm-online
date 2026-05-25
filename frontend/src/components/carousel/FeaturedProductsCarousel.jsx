import { useRef, useState, useEffect } from 'react'
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
  const [canScrollLeft, setCanScrollLeft]   = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIdx, setActiveIdx]           = useState(0)

  const CARD_WIDTH = 280  // approximate card width + gap

  const updateScrollState = () => {
    const el = carouselRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    const idx = Math.round(el.scrollLeft / CARD_WIDTH)
    setActiveIdx(idx)
  }

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    updateScrollState()
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [products])

  const scroll = (dir) => {
    if (!carouselRef.current) return
    carouselRef.current.scrollBy({
      left: dir === 'left' ? -CARD_WIDTH * 2 : CARD_WIDTH * 2,
      behavior: 'smooth',
    })
  }

  const scrollToIdx = (i) => {
    if (!carouselRef.current) return
    carouselRef.current.scrollTo({ left: i * CARD_WIDTH, behavior: 'smooth' })
  }

  if (!products || products.length === 0) return null

  const dotCount = Math.ceil(products.length / 2)

  return (
    <section style={{ padding: '48px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 28, gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            {/* Accent line above title */}
            <div style={{
              width: 36, height: 3, borderRadius: 2,
              background: accentColor,
              marginBottom: 10,
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

            {/* Nav buttons */}
            <div style={{ display: 'flex', gap: 6 }}>
              {['left', 'right'].map(dir => (
                <button
                  key={dir}
                  onClick={() => scroll(dir)}
                  disabled={dir === 'left' ? !canScrollLeft : !canScrollRight}
                  aria-label={dir === 'left' ? 'Scroll left' : 'Scroll right'}
                  style={{
                    width: 36, height: 36, borderRadius: 9,
                    border: `1px solid ${(dir === 'left' ? !canScrollLeft : !canScrollRight) ? '#EAECF0' : '#D1D5DB'}`,
                    background: (dir === 'left' ? !canScrollLeft : !canScrollRight) ? '#F9FAFB' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: (dir === 'left' ? !canScrollLeft : !canScrollRight) ? 'default' : 'pointer',
                    transition: 'all 0.18s',
                    color: (dir === 'left' ? !canScrollLeft : !canScrollRight) ? '#D1D5DB' : '#374151',
                  }}
                  onMouseEnter={e => {
                    const disabled = dir === 'left' ? !canScrollLeft : !canScrollRight
                    if (!disabled) {
                      e.currentTarget.style.background = accentColor
                      e.currentTarget.style.borderColor = accentColor
                      e.currentTarget.style.color = '#fff'
                    }
                  }}
                  onMouseLeave={e => {
                    const disabled = dir === 'left' ? !canScrollLeft : !canScrollRight
                    e.currentTarget.style.background = disabled ? '#F9FAFB' : '#fff'
                    e.currentTarget.style.borderColor = disabled ? '#EAECF0' : '#D1D5DB'
                    e.currentTarget.style.color = disabled ? '#D1D5DB' : '#374151'
                  }}
                >
                  {dir === 'left' ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Carousel track ── */}
        <div style={{ position: 'relative' }}>
          {/* Fade right edge */}
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 64,
            background: 'linear-gradient(to right, transparent, #F0F2F5)',
            zIndex: 1, pointerEvents: 'none',
            opacity: canScrollRight ? 1 : 0,
            transition: 'opacity 0.3s',
          }} />

          <div
            ref={carouselRef}
            style={{
              display: 'flex', gap: 14,
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              paddingBottom: 6,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`
              div::-webkit-scrollbar { display: none; }
            `}</style>

            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  flexShrink: 0,
                  width: 'clamp(240px, 25%, 280px)',
                }}
              >
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Dot indicators (mobile) ── */}
        <div
          className="flex md:hidden"
          style={{
            justifyContent: 'center', gap: 6, marginTop: 16,
            display: 'flex',
          }}
        >
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIdx(i * 2)}
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