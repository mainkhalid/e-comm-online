import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Zap } from 'lucide-react'
import { homeAssets } from '../../assets/assets'

/* ─── Data ────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    eyebrow: 'Microsoft Surface',
    tag: 'TOP PICK',
    title: 'Surface\nLaptop 4',
    specs: ['11th Gen Intel Core i5', '256GB SSD', '13.5" Touch Display', 'Windows 11'],
    price: 'KSh 52,999',
    oldPrice: 'KSh 65,999',
    saving: 'Save KSh 13,000',
    cta: 'Shop Now',
    href: '/products?category=laptops',
    accent: '#2563EB',
    image: homeAssets.heroSlides[3],
    badges: ['Intel', 'Windows 11'],
  },
  {
    id: 2,
    eyebrow: 'Dell Business',
    tag: 'BEST SELLER',
    title: 'Dell\nLatitude 5540',
    specs: ['Intel Core i7 13th Gen', '16GB RAM', '512GB NVMe SSD', 'Windows 11 Pro'],
    price: 'KSh 98,500',
    oldPrice: 'KSh 115,000',
    saving: 'Save KSh 16,500',
    cta: 'Shop Now',
    href: '/products?category=laptops',
    accent: '#0284C7',
    image: homeAssets.heroSlides[0],
    badges: ['Intel Core i7', 'Business Grade'],
  },
  {
    id: 3,
    eyebrow: 'HP EliteBook',
    tag: 'NEW ARRIVAL',
    title: 'HP EliteBook\n840 G10',
    specs: ['AMD Ryzen 7 Pro', '32GB RAM', '1TB SSD', '14" FHD IPS'],
    price: 'KSh 145,000',
    oldPrice: 'KSh 168,000',
    saving: 'Save KSh 23,000',
    cta: 'Shop Now',
    href: '/products?category=laptops',
    accent: '#0369A1',
    image: homeAssets.heroSlides[2],
    badges: ['AMD Ryzen 7', 'Pro Series'],
  },
]

const LEFT_FEATURE = {
  brand: 'Complete Setup',
  tag: 'OFFICE SETUP',
  title: 'Complete Modern Office Solution',
  subtitle: 'High-Performance Workstations & Smart Office Equipment',
  highlight: 'Fast Performance · Ergonomic Setup · Business Ready',
  cta: 'Shop Now',
  href: '/products?category=networking',
  accent: '#00BCEB',
  image: homeAssets.promos[1],
  specs: ['Wireless Accessories', 'High Performance', 'Simple Setup'],
}

const RIGHT_FEATURE = {
  brand: 'JBL',
  tag: 'AUDIO',
  title: 'Charge Essential 2',
  subtitle: 'BIG SOUND. ALL DAY.',
  highlight: 'Waterproof · 20hr Battery · USB-C',
  cta: 'Shop Now',
  href: '/products?category=accessories',
  accent: '#FF6B2B',
  image: homeAssets.promos[0],
}

const TRUST = [
  { icon: Truck,      label: 'Free Delivery',    sub: 'Orders over KSh 5K' },
  { icon: Shield,     label: 'Genuine Products', sub: 'All brands verified' },
  { icon: RotateCcw,  label: '30-Day Returns',   sub: 'No questions asked' },
  { icon: Zap,        label: 'M-Pesa Payments',  sub: 'Instant STK push' },
]

/* ─── Countdown ──────────────────────────────────────── */
function useCountdown(targetHour = 18) {
  const getTime = useCallback(() => {
    const now = new Date(), end = new Date()
    end.setHours(targetHour, 0, 0, 0)
    if (end <= now) end.setDate(end.getDate() + 1)
    const diff = Math.max(0, Math.floor((end - now) / 1000))
    return {
      h: String(Math.floor(diff / 3600)).padStart(2, '0'),
      m: String(Math.floor((diff % 3600) / 60)).padStart(2, '0'),
      s: String(diff % 60).padStart(2, '0'),
    }
  }, [targetHour])
  const [time, setTime] = useState(getTime)
  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(id)
  }, [getTime])
  return time
}

function CountdownUnit({ value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{
        minWidth: 40, height: 40, borderRadius: 8,
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 800, fontSize: 17,
        fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
        padding: '0 10px',
      }}>
        {value}
      </div>
      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
        {label}
      </span>
    </div>
  )
}

/* ─── Full-bleed Feature Card ─────────────────────────── */
function FeatureCard({ data }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={data.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        borderRadius: 14,
        overflow: 'hidden',
        textDecoration: 'none',
        height: '100%',
        position: 'relative',
        minHeight: 420,
        background: '#111',
      }}
    >
      {/* Full-bleed background image */}
      <img
        src={data.image}
        alt={data.title}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />

      {/* Gradient overlays — top fade for brand badge, bottom fade for text */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0.92) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 20,
      }}>
        {/* Top — brand + tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: data.accent,
            color: '#fff', padding: '4px 10px', borderRadius: 5,
          }}>
            {data.brand}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(6px)',
            color: 'rgba(255,255,255,0.85)',
            padding: '4px 9px', borderRadius: 5,
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            {data.tag}
          </span>
        </div>

        {/* Bottom — title + info + cta */}
        <div>
          <p style={{
            fontSize: 11, fontWeight: 600, color: data.accent,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            margin: '0 0 6px',
          }}>
            {data.highlight}
          </p>
          <h3 style={{
            fontSize: 20, fontWeight: 900, color: '#fff',
            lineHeight: 1.15, letterSpacing: '-0.02em',
            margin: '0 0 4px',
          }}>
            {data.title}
          </h3>
          <p style={{
            fontSize: 12, color: 'rgba(255,255,255,0.55)',
            fontWeight: 500, margin: '0 0 16px',
            letterSpacing: '0.02em',
          }}>
            {data.subtitle}
          </p>

          {/* Spec pills (left card only) */}
          {data.specs && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
              {data.specs.map(s => (
                <span key={s} style={{
                  fontSize: 9, fontWeight: 600,
                  padding: '3px 8px', borderRadius: 20,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.75)',
                  letterSpacing: '0.04em',
                }}>
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '10px 20px', borderRadius: 9,
            background: data.accent,
            color: '#fff', fontSize: 12, fontWeight: 700,
            letterSpacing: '0.02em',
            transition: 'opacity 0.2s',
            opacity: hovered ? 0.9 : 1,
          }}>
            {data.cta} <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ─── Center Slider ───────────────────────────────────── */
function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const slide = SLIDES[current]

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setCurrent(c => (c + 1) % SLIDES.length)
      setAnimKey(k => k + 1)
    }, 5500)
    return () => clearInterval(id)
  }, [paused])

  const goTo = (idx) => { setPaused(true); setCurrent(idx); setAnimKey(k => k + 1) }
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length)
  const next = () => goTo((current + 1) % SLIDES.length)

  /* Discount % */
  const priceParsed = parseFloat(slide.price.replace(/[^0-9]/g, ''))
  const oldParsed = parseFloat(slide.oldPrice.replace(/[^0-9]/g, ''))
  const discountPct = Math.round(((oldParsed - priceParsed) / oldParsed) * 100)

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        borderRadius: 14, overflow: 'hidden',
        position: 'relative', minHeight: 420,
        background: '#08101E',
      }}
    >
      {/* Blurred atmospheric background — the product image fills the space */}
      <img
        key={`bg-${slide.id}`}
        src={slide.image}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          filter: 'blur(28px) brightness(0.35) saturate(1.4)',
          transform: 'scale(1.1)',
          transition: 'opacity 0.7s ease',
        }}
      />

      {/* Dark vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
      }} />

      {/* Accent color bleed — bottom glow */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
        background: `linear-gradient(to top, ${slide.accent}22 0%, transparent 100%)`,
        transition: 'background 0.5s ease',
        pointerEvents: 'none',
      }} />

      {/* Slide content */}
      <div
        key={animKey}
        style={{
          position: 'relative', zIndex: 1,
          height: '100%', minHeight: 420,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          padding: '32px 36px',
          gap: 24,
          animation: 'slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        {/* LEFT — text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Eyebrow + tag */}
          <div style={{ display: 'flex', align: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: slide.accent,
              background: `${slide.accent}22`,
              border: `1px solid ${slide.accent}55`,
              padding: '4px 10px', borderRadius: 5,
            }}>
              {slide.eyebrow}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#fff',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '4px 10px', borderRadius: 5,
            }}>
              {slide.tag}
            </span>
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: 32, fontWeight: 900,
            color: '#fff', lineHeight: 1.1,
            letterSpacing: '-0.03em',
            margin: 0,
            whiteSpace: 'pre-line',
          }}>
            {slide.title}
          </h2>

          {/* Specs */}
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {slide.specs.map(s => (
              <li key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: slide.accent, flexShrink: 0,
                  boxShadow: `0 0 6px ${slide.accent}`,
                }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', fontWeight: 500 }}>
                  {s}
                </span>
              </li>
            ))}
          </ul>

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 26, fontWeight: 900, color: '#fff',
              letterSpacing: '-0.03em',
            }}>
              {slide.price}
            </span>
            <span style={{
              fontSize: 13, color: 'rgba(255,255,255,0.4)',
              textDecoration: 'line-through', fontWeight: 500,
            }}>
              {slide.oldPrice}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 800,
              background: '#22C55E',
              color: '#fff',
              padding: '3px 9px', borderRadius: 20,
              letterSpacing: '0.04em',
            }}>
              −{discountPct}%
            </span>
          </div>

          {/* CTA */}
          <Link
            to={slide.href}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 26px', borderRadius: 10,
              background: slide.accent,
              color: '#fff', fontSize: 14, fontWeight: 700,
              textDecoration: 'none', alignSelf: 'flex-start',
              letterSpacing: '0.01em',
              boxShadow: `0 8px 24px ${slide.accent}55`,
              transition: 'transform 0.18s, box-shadow 0.18s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 12px 32px ${slide.accent}77`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = `0 8px 24px ${slide.accent}55`
            }}
          >
            {slide.cta} <ArrowRight size={15} />
          </Link>
        </div>

        {/* RIGHT — product image */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Glow behind product */}
          <div style={{
            position: 'absolute',
            width: '70%', height: '70%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${slide.accent}40 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }} />
          <img
            src={slide.image}
            alt={slide.title}
            style={{
              position: 'relative',
              maxHeight: 380, maxWidth: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 20px 48px rgba(0,0,0,0.5))',
              animation: 'floatIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
              animationDelay: '0.05s',
            }}
          />

          {/* Spec badges floating top-right */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {slide.badges.map(b => (
              <span key={b} style={{
                fontSize: 10, fontWeight: 700,
                padding: '4px 10px', borderRadius: 6,
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                letterSpacing: '0.04em',
              }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      {['prev', 'next'].map(dir => (
        <button
          key={dir}
          onClick={dir === 'prev' ? prev : next}
          aria-label={dir === 'prev' ? 'Previous slide' : 'Next slide'}
          style={{
            position: 'absolute',
            [dir === 'prev' ? 'left' : 'right']: 14,
            top: '50%', transform: 'translateY(-50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
            zIndex: 2,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          {dir === 'prev' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      ))}

      {/* Slide indicators */}
      <div style={{
        position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, alignItems: 'center', zIndex: 2,
      }}>
        {SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              padding: 0, border: 'none', cursor: 'pointer',
              borderRadius: 20,
              width: i === current ? 28 : 7, height: 7,
              background: i === current ? slide.accent : 'rgba(255,255,255,0.3)',
              transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              boxShadow: i === current ? `0 0 10px ${slide.accent}99` : 'none',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          height: 3,
          background: `linear-gradient(to right, ${slide.accent}, ${slide.accent}aa)`,
          animation: 'progressBar 5.5s linear',
          borderRadius: '0 2px 0 0',
        }} />
      )}
    </div>
  )
}

/* ─── Main export ─────────────────────────────────────── */
export default function HeroSection() {
  const time = useCountdown(18)

  return (
    <section>

      {/* ── Deal countdown bar ── */}
      <div style={{ background: '#0A0F1E', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
            padding: '10px 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 11, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: '#FF6B2B',
              }}>
                🔥 Daily Deal Ends In:
              </span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                <CountdownUnit value={time.h} label="hrs" />
                <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 700, fontSize: 18, marginBottom: 14 }}>:</span>
                <CountdownUnit value={time.m} label="min" />
                <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 700, fontSize: 18, marginBottom: 14 }}>:</span>
                <CountdownUnit value={time.s} label="sec" />
              </div>
            </div>
            <Link
              to="/products?on_sale=true"
              style={{
                fontSize: 11, fontWeight: 700,
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              View All Deals <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Three-panel hero ── */}
      <div style={{ background: '#F0F2F5', padding: '14px 0' }}>
        <div className="w-full  mx-auto px-26 sm:px-6 lg:px-8">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2.2fr 1fr',
            gap: 12,
            alignItems: 'stretch',
          }}
            className="hero-grid"
          >
            <div className="hidden lg:block">
              <FeatureCard data={LEFT_FEATURE} />
            </div>

            <HeroSlider />

            <div className="hidden lg:block">
              <FeatureCard data={RIGHT_FEATURE} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust strip ── */}
      <div style={{ background: '#fff', borderTop: '1px solid #EAECF0', borderBottom: '1px solid #EAECF0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {TRUST.map(({ icon: Icon, label, sub }, i) => (
              <div
                key={label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '15px 16px',
                  borderRight: i < 3 ? '1px solid #EAECF0' : 'none',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(255,107,43,0.09)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={19} style={{ color: '#FF6B2B' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @media (max-width: 1023px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}