import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  getFeaturedProducts,
  getProductsByCategory,
  getTopRatedProducts,
} from '../api/services'
import { addItem } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'

import HeroSection from '../components/home/HeroSection'
import PopularDevices from '../components/home/PopularDevices'
import FeaturedProductsCarousel from '../components/carousel/FeaturedProductsCarousel'
import BrandCarousel from '../components/carousel/BrandCarousel'
import NewsletterSection from '../components/home/NewsletterSection'
import CTASection from '../components/home/CTASection'
import LoadingSpinner from '../components/common/LoadingSpinner'

/* ─── Mini promo banners ─────────────────────────────── */
const PROMO_BANNERS = [
  {
    id: 1,
    eyebrow: 'Clearance Sale',
    title: 'ExUk Laptops',
    sub: 'Up to 40% off — tested & warranted',
    href: '/products?category=refurbished',
    bg: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
    badge: 'Up to 40% off',
    emoji: '♻️',
  },
  {
    id: 2,
    eyebrow: 'New Arrivals',
    title: 'Garmin GPS Watches',
    sub: 'For runners, hikers & cyclists',
    href: '/products?brand=garmin',
    bg: 'linear-gradient(135deg, #059669 0%, #0F172A 100%)',
    badge: 'Explore range',
    emoji: '⌚',
  },
]

function PromoBanners() {
  return (
    <section className="px-4 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PROMO_BANNERS.map(b => (
          <Link
            key={b.id}
            to={b.href}
            className="group relative rounded-2xl overflow-hidden p-7 flex items-center gap-5"
            style={{ background: b.bg, minHeight: '130px' }}
          >
            {/* Text */}
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {b.eyebrow}
              </p>
              <h3 className="text-lg font-bold text-white mb-1">{b.title}</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{b.sub}</p>
              <span
                className="inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'var(--orange)', color: 'white' }}
              >
                {b.badge} →
              </span>
            </div>
            {/* Emoji */}
            <div
              className="text-5xl flex-shrink-0 opacity-80 group-hover:scale-110 transition-transform"
            >
              {b.emoji}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ─── Homepage ─────────────────────────────────────── */
export default function Home() {
  const [featured, setFeatured]       = useState([])
  const [laptops, setLaptops] = useState([])
  const [desktops, setDesktops] = useState([])
  const [topRated, setTopRated]       = useState([])
  const [loading, setLoading]         = useState(true)
  const dispatch                      = useDispatch()

  useEffect(() => {
    Promise.allSettled([
  getFeaturedProducts(),
  getProductsByCategory('laptops'),
  getProductsByCategory('desktops'),
  getTopRatedProducts(),
]).then(([featRes, newRes, saleRes, topRes]) => {
      if (featRes.status === 'fulfilled') setFeatured(featRes.value.data.results || featRes.value.data)
      if (newRes.status === 'fulfilled') setLaptops(newRes.value.data.results || newRes.value.data)
      if (saleRes.status === 'fulfilled') setDesktops(saleRes.value.data.results || saleRes.value.data)
      if (topRes.status === 'fulfilled') setTopRated((topRes.value.data.results || topRes.value.data))
    }).finally(() => setLoading(false))
  }, [])

  const handleAddToCart = (productId) => {
    dispatch(addItem({ productId, quantity: 1 }))
      .unwrap()
      .then(() => toast.success('Added to cart!'))
      .catch(() => toast.error('Please sign in to add items'))
  }

  return (
    <>
      <Helmet>
        <title>Nixxon Technologies — Laptops, Desktops, Gadgets & More</title>
        <meta name="description" content="Shop the latest laptops, smartphones, tablets, and accessories in Kenya. Genuine products, M-Pesa payments, fast nationwide delivery." />
      </Helmet>

      <HeroSection />
      <PopularDevices />
      <PromoBanners />

      {loading && (
        <div className="py-12 flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      {/* Featured products */}
      {!loading && featured.length > 0 && (
        <FeaturedProductsCarousel
          products={featured}
          onAddToCart={handleAddToCart}
          title="Featured Products"
        />
      )}

      {/* Laptops */}
{!loading && laptops.length > 0 && (
  <FeaturedProductsCarousel
    products={laptops}
    onAddToCart={handleAddToCart}
    title="💻 Laptops"
  />
)}

{/* Desktops */}
{!loading && desktops.length > 0 && (
  <FeaturedProductsCarousel
    products={desktops}
    onAddToCart={handleAddToCart}
    title="🖥️ Desktops"
  />
)}

      {/* Top Rated */}
      {!loading && topRated.length > 0 && (
        <FeaturedProductsCarousel
          products={topRated}
          onAddToCart={handleAddToCart}
          title="⭐ Top Rated"
        />
      )}

      {/* Brand carousel */}
      <BrandCarousel />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Benefits + CTA */}
      <CTASection />
    </>
  )
}