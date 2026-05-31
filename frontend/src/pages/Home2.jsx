import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatured, fetchByCategory, fetchTopRated } from '../store/slices/productsSlice'
import { addItem } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'

import HeroSection    from '../components/home/HeroSection'
import PromoBanner    from '../components/promo/PromoBanner'
import PopularDevices from '../components/home/PopularDevices'
import FeaturedProductsCarousel from '../components/carousel/FeaturedProductsCarousel'
import BrandCarousel     from '../components/carousel/BrandCarousel'
import NewsletterSection from '../components/home/NewsletterSection'
import CTASection        from '../components/home/CTASection'
import LoadingSpinner    from '../components/common/LoadingSpinner'

/* ─── Stale time ─────────────────────────────────────── */
const STALE_MS = 10 * 60 * 1000

function isStale(fetchedAt) {
  if (!fetchedAt) return true
  return Date.now() - fetchedAt > STALE_MS
}

/* ─── Homepage ───────────────────────────────────────── */
export default function Home() {
  const dispatch = useDispatch()
  const { featured, topRated, byCategory, loading, fetchedAt } = useSelector(s => s.products)

  const laptops  = byCategory['laptops']  || []
  const desktops = byCategory['desktops'] || []

  useEffect(() => {
    if (isStale(fetchedAt.featured))  dispatch(fetchFeatured())
    if (isStale(fetchedAt.laptops))   dispatch(fetchByCategory('laptops'))
    if (isStale(fetchedAt.desktops))  dispatch(fetchByCategory('desktops'))
    if (isStale(fetchedAt.topRated))  dispatch(fetchTopRated())
  }, [dispatch])

  const handleAddToCart = (productId) => {
    dispatch(addItem({ productId, quantity: 1 }))
      .unwrap()
      .then(() => toast.success('Added to cart!'))
      .catch(() => toast.error('Please sign in to add items'))
  }

  const isFirstLoad = loading && !featured.length && !laptops.length

  return (
    <>
      <Helmet>
        <title>Nixxon Technologies — Laptops, Desktops, Gadgets & More</title>
        <meta name="description" content="Shop the latest laptops, smartphones, tablets, and accessories in Kenya. Genuine products, M-Pesa payments, fast nationwide delivery." />
      </Helmet>

      <HeroSection />
      <PopularDevices />

      <PromoBanner />

      {isFirstLoad && (
        <div className="py-12 flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      {featured.length > 0 && (
        <FeaturedProductsCarousel
          products={featured}
          onAddToCart={handleAddToCart}
          title="Featured Products"
        />
      )}

      {laptops.length > 0 && (
        <FeaturedProductsCarousel
          products={laptops}
          onAddToCart={handleAddToCart}
          title="Laptops"
        />
      )}

      {desktops.length > 0 && (
        <FeaturedProductsCarousel
          products={desktops}
          onAddToCart={handleAddToCart}
          title="Desktops"
        />
      )}

      {topRated.length > 0 && (
        <FeaturedProductsCarousel
          products={topRated}
          onAddToCart={handleAddToCart}
          title="Top Rated"
        />
      )}

      <BrandCarousel />
      <NewsletterSection />
      <CTASection />
    </>
  )
}