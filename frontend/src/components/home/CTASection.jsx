import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from 'lucide-react'

const BENEFITS = [
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    desc: 'Fast shipping to all 47 counties in Kenya',
    accent: '#3B82F6',
    glow: 'rgba(59,130,246,0.15)',
    border: 'rgba(59,130,246,0.2)',
  },
  {
    icon: Shield,
    title: 'Genuine Products',
    desc: 'Authorised dealer — all items verified & warrantied',
    accent: '#22C55E',
    glow: 'rgba(34,197,94,0.15)',
    border: 'rgba(34,197,94,0.2)',
  },
  {
    icon: RotateCcw,
    title: '8-Day Returns',
    desc: 'Hassle-free return or exchange policy',
    accent: '#FF6B2B',
    glow: 'rgba(255,107,43,0.15)',
    border: 'rgba(255,107,43,0.2)',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'WhatsApp, call, and email support always available',
    accent: '#A855F7',
    glow: 'rgba(168,85,247,0.15)',
    border: 'rgba(168,85,247,0.2)',
  },
]

export default function CTASection() {
  return (
    <section style={{ padding: '48px 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Benefit cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {BENEFITS.map(({ icon: Icon, title, desc, accent, glow, border }) => (
            <div
              key={title}
              style={{
                background: '#fff',
                border: `1px solid ${border}`,
                borderRadius: 14,
                padding: '20px 20px',
                display: 'flex', alignItems: 'flex-start', gap: 14,
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = `0 12px 32px ${glow}`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: glow,
                border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} style={{ color: accent }} />
              </div>
              <div>
                <h3 style={{
                  fontSize: 13, fontWeight: 700,
                  color: '#111827', margin: '0 0 4px',
                }}>
                  {title}
                </h3>
                <p style={{
                  fontSize: 11.5, color: '#6B7280',
                  lineHeight: 1.55, margin: 0,
                }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA Banner ── */}
        <div style={{
          borderRadius: 18,
          overflow: 'hidden',
          position: 'relative',
          background: '#0A0F1E',
          padding: '52px 52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 28,
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', right: -60, top: -60,
            width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,43,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: 120, bottom: -80,
            width: 180, height: 180, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          {/* Subtle grid pattern */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }} />

          {/* Left text */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              fontSize: 10, fontWeight: 800, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#FF6B2B',
              display: 'flex', alignItems: 'center', gap: 7, margin: '0 0 10px',
            }}>
              <span style={{
                display: 'inline-block', width: 18, height: 2,
                background: '#FF6B2B', borderRadius: 2,
              }} />
              Limited time
            </p>
            <h2 style={{
              fontSize: 28, fontWeight: 900, color: '#fff',
              lineHeight: 1.15, letterSpacing: '-0.03em',
              margin: '0 0 8px',
            }}>
              Ready to upgrade your tech?
            </h2>
            <p style={{
              fontSize: 13, color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.6, margin: 0,
            }}>
              Explore 10,000+ products. Free shipping on orders over KSh 5,000.
            </p>
          </div>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 12, flexWrap: 'wrap',
            position: 'relative', zIndex: 1,
            flexShrink: 0,
          }}>
            <Link
              to="/products"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 26px', borderRadius: 11,
                background: '#FF6B2B',
                color: '#fff', fontSize: 13, fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 6px 24px rgba(255,107,43,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,107,43,0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,107,43,0.4)'
              }}
            >
              Shop All Products <ArrowRight size={15} />
            </Link>
            <Link
              to="/products?on_sale=true"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 26px', borderRadius: 11,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.2s',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            >
              🔥 View Deals
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}