import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Zap } from 'lucide-react'

/* ─── Banner slides ─────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    eyebrow: 'New Arrivals 2025',
    title: 'MacBook Pro M4',
    subtitle: 'Pro performance for serious creators. Up to 24-core GPU, 128GB memory.',
    cta: 'Shop Laptops',
    href: '/products?category=laptops',
    badge: 'From KSh 189,999',
    accent: '#FF6B2B',
    bg: 'from-slate-900 to-slate-800',
    emoji: '💻',
  },
  {
    id: 2,
    eyebrow: 'Deal of the Day',
    title: 'Samsung Galaxy S25',
    subtitle: 'AI-powered flagship. 200MP camera, Snapdragon 8 Elite, all-day battery.',
    cta: 'Shop Phones',
    href: '/products?category=smartphones',
    badge: 'Save KSh 15,000',
    accent: '#4C6EF5',
    bg: 'from-indigo-900 to-slate-900',
    emoji: '📱',
  },
  {
    id: 3,
    eyebrow: 'Gaming Month',
    title: 'PlayStation 5 Slim',
    subtitle: 'Experience gaming at its finest. 4K 120fps, ultra-fast SSD, haptic feedback.',
    cta: 'Shop Gaming',
    href: '/products?category=consoles',
    badge: 'In Stock Now',
    accent: '#16A34A',
    bg: 'from-slate-900 to-emerald-950',
    emoji: '🎮',
  },
]

/* ─── Trust badges ─────────────────────────────────────── */
const TRUST = [
  { icon: Truck,      label: 'Free Delivery',  sub: 'Orders over KSh 5K' },
  { icon: Shield,     label: 'Genuine Products', sub: 'All brands verified' },
  { icon: RotateCcw,  label: '30-Day Returns', sub: 'No questions asked' },
  { icon: Zap,        label: 'M-Pesa Payments', sub: 'Instant STK push' },
]

/* ─── Deal countdown ─────────────────────────────────── */
function useCountdown(targetHour = 18) {
  const getTime = () => {
    const now = new Date()
    const end = new Date()
    end.setHours(targetHour, 0, 0, 0)
    if (end <= now) end.setDate(end.getDate() + 1)
    const diff = Math.max(0, Math.floor((end - now) / 1000))
    return {
      h: String(Math.floor(diff / 3600)).padStart(2, '0'),
      m: String(Math.floor((diff % 3600) / 60)).padStart(2, '0'),
      s: String(diff % 60).padStart(2, '0'),
    }
  }
  const [time, setTime] = useState(getTime)
  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-lg font-mono leading-none"
        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        {value}
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-widest mt-1 text-white/60">{label}</span>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────── */
export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused]   = useState(false)
  const time = useCountdown(18)
  const slide = SLIDES[current]

  /* Auto-advance */
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(id)
  }, [paused])

  const prev = () => { setPaused(true); setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length) }
  const next = () => { setPaused(true); setCurrent(c => (c + 1) % SLIDES.length) }

  return (
    <section>
      {/* ── Deal bar ── */}
      <div
        className="py-2 px-4 text-white text-sm flex items-center justify-center gap-6 flex-wrap"
        style={{ background: 'var(--orange)' }}
      >
        <span className="font-bold uppercase tracking-wide text-xs">🔥 Daily Deal Ends In:</span>
        <div className="flex items-center gap-2">
          <CountdownUnit value={time.h} label="hrs" />
          <span className="text-white/60 font-bold mb-4">:</span>
          <CountdownUnit value={time.m} label="min" />
          <span className="text-white/60 font-bold mb-4">:</span>
          <CountdownUnit value={time.s} label="sec" />
        </div>
        <Link
          to="/products?on_sale=true"
          className="text-xs font-bold uppercase tracking-wider text-white/90 underline underline-offset-2 hover:text-white transition-colors"
        >
          View All Deals →
        </Link>
      </div>

      {/* ── Main hero banner ── */}
      <div
        className={`relative overflow-hidden bg-gradient-to-r ${slide.bg}`}
        style={{ minHeight: '420px' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Decorative circles */}
        <div
          className="absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: slide.accent }}
        />
        <div
          className="absolute -right-8 -bottom-16 w-64 h-64 rounded-full opacity-5"
          style={{ background: slide.accent }}
        />

        <div className="max-w-7xl mx-auto px-4 py-14 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* Text content */}
            <div key={slide.id} className="fade-up">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest"
                  style={{ background: slide.accent, color: 'white' }}
                >
                  {slide.eyebrow}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
                {slide.title}
              </h1>
              <p className="text-slate-300 text-base mb-6 leading-relaxed max-w-md">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={slide.href}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
                  style={{ background: slide.accent, boxShadow: `0 4px 20px ${slide.accent}60` }}
                >
                  {slide.cta}
                  <ArrowRight size={16} />
                </Link>
                <span
                  className="inline-flex items-center px-4 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: 'rgba(255,255,255,0.10)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  {slide.badge}
                </span>
              </div>
            </div>

            {/* Graphic / product display */}
            <div className="hidden md:flex items-center justify-center">
              <div
                className="w-56 h-56 rounded-3xl flex items-center justify-center text-9xl"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {slide.emoji}
              </div>
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPaused(true); setCurrent(i) }}
              className="rounded-full transition-all"
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                background: i === current ? slide.accent : 'rgba(255,255,255,0.35)',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Trust badges strip ── */}
      <div
        className="border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x" style={{ color: 'var(--text)' }}>
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,107,43,0.08)' }}
                >
                  <Icon size={19} style={{ color: 'var(--orange)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}