import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { homeAssets } from '../../assets/assets'

/* ─── Single banner card ─────────────────────────────── */
function PromoBanner({ title, discount, image, description, ctaText = 'Shop Now', href = '/products' }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative min-h-[300px] rounded-2xl overflow-hidden bg-[#0A0F1E] border border-white/[0.04] grid grid-cols-1 sm:grid-cols-12 group transition-all duration-300 shadow-xl"
    >
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Left — Text Content */}
      <div className="relative z-10 sm:col-span-7 p-8 flex flex-col justify-center gap-4">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 text-[11px] font-extrabold tracking-widest text-amber-400 uppercase">
          <span className="w-5 h-[2px] bg-amber-400 rounded-full" />
          Limited Offer
        </span>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed max-w-[280px]">
          {description}
        </p>

        {/* Action / Discount Area */}
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          {discount && (
            <div className="relative flex flex-col items-center justify-center w-[76px] h-[76px] rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-[0_8px_24px_rgba(245,158,11,0.25)] shrink-0 animate-pulse">
              <span className="text-[9px] font-extrabold text-amber-950 tracking-wider">UP TO</span>
              <span className="text-2xl font-black text-amber-950 leading-none">{discount}</span>
              <span className="text-[8px] font-bold text-amber-950 tracking-widest">OFF</span>
            </div>
          )}
          
          <Link
            to={href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-amber-950 text-sm font-extrabold tracking-wide no-underline transition-all duration-300 hover:bg-amber-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(245,158,11,0.4)]"
          >
            {ctaText} 
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Right — Product Image Showcase */}
      <div className="relative sm:col-span-5 h-64 sm:h-auto overflow-hidden flex items-center justify-center p-6 bg-gradient-to-l from-black/20 to-transparent">
        {/* Dynamic Blurred Background Image mirroring the product */}
        <img
          src={image || '/placeholder.png'}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-30 blur-2xl scale-125 select-none pointer-events-none"
        />
        
        {/* Ambient Ring Light Behind Asset */}
        <div className="absolute w-[70%] h-[70%] bg-amber-500/20 rounded-full blur-2xl opacity-70" />

        {/* Hero Product Image */}
        <img
          src={image || '/placeholder.png'}
          alt={title}
          className="relative max-h-[220px] max-w-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] transition-all duration-500 ease-out transform group-hover:-translate-y-3 group-hover:scale-105"
        />
      </div>
    </div>
  )
}

/* ─── Data — update images when ready ───────────────── */
const BANNERS = [
  {
    title: 'ExUk Laptops',
    discount: '40%',
    description: 'Fully tested and warranted ex-UK laptops at unbeatable prices. Business-grade performance, budget-friendly.',
    ctaText: 'Shop Laptops',
    href: '/products?category=laptops',
    image: homeAssets.promos2[1], 
  },
  {
    title: 'Garmin GPS Watches',
    discount: '20%',
    description: 'For runners, hikers and cyclists. Track every move with precision GPS and all-day battery life.',
    ctaText: 'Explore Range',
    href: '/products?brand=garmin',
    image: homeAssets.promos2[0], 
  },
]

/* ─── Section export ─────────────────────────────────── */
export default function PromoBanners() {
  return (
    <section className="px-4 py-12 md:py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6">
        {BANNERS.map(b => (
          <PromoBanner key={b.title} {...b} />
        ))}
      </div>
    </section>
  )
}