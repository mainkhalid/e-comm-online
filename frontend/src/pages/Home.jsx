import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDispatch } from 'react-redux'
import { getFeaturedProducts } from '../api/services'
import { addItem } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'

import HeroSection from '../components/home/HeroSection'
import PopularDevices from '../components/home/PopularDevices'
import FeaturedProductsCarousel from '../components/carousel/FeaturedProductsCarousel'
import BrandCarousel from '../components/carousel/BrandCarousel'
import CTASection from '../components/home/CTASection'
import NewsletterSection from '../components/home/NewsletterSection'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    getFeaturedProducts()
      .then(({ data }) => {
        setProducts(data.results || data)
      })
      .catch(() => {
        setProducts([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleAddToCart = (productId) => {
    dispatch(addItem({ productId, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success('Added to cart!')
      })
      .catch(() => {
        toast.error('Please sign in to add items')
      })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Helmet>
        <title>Nixxon Technologies — Premium Tech Products in Kenya</title>
        <meta name="description" content="Shop the best laptops, desktops, tablets, and accessories in Kenya. Fast shipping, M-Pesa payments, 30-day returns." />
      </Helmet>

      <div>
        {/* Hero Section */}
        <HeroSection />

        {/* Popular Devices */}
        <PopularDevices />

        {/* Featured Products */}
        {products.length > 0 && (
          <FeaturedProductsCarousel
            products={products}
            onAddToCart={handleAddToCart}
            title="Featured Products"
          />
        )}

        {/* Brands Carousel */}
        <BrandCarousel />

        {/* Newsletter Section */}
        <NewsletterSection />

        {/* CTA Section */}
        <CTASection />
      </div>
    </>
  )
}
