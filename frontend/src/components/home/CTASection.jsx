import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from 'lucide-react'

const BENEFITS = [
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    desc: 'Fast shipping to all 47 counties in Kenya',
    color: '#4C6EF5',
    bg: 'rgba(76,110,245,0.08)',
  },
  {
    icon: Shield,
    title: 'Genuine Products',
    desc: 'Authorised dealer — all items verified & warrantied',
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.08)',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    desc: 'Hassle-free return or exchange policy',
    color: 'var(--orange)',
    bg: 'rgba(255,107,43,0.08)',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'WhatsApp, call, and email support always available',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
  },
]

export default function CTASection() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── Benefit cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENEFITS.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="card p-5 flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: bg }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA Banner ── */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1E3A8A 100%)' }}
        >
          {/* Decorative blob */}
          <div
            className="absolute right-0 top-0 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'var(--orange)', transform: 'translate(30%, -30%)' }}
          />
          <div
            className="absolute right-16 bottom-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: 'var(--orange)', transform: 'translateY(40%)' }}
          />

          <div className="relative px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--orange)' }}>
                Limited time
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Ready to upgrade your tech?
              </h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Explore 10,000+ products. Free shipping on orders over KSh 5,000.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
                style={{ background: 'var(--orange)', boxShadow: '0 4px 20px rgba(255,107,43,0.40)' }}
              >
                Shop All Products
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/products?on_sale=true"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.20)', color: 'white' }}
              >
                🔥 View Deals
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}