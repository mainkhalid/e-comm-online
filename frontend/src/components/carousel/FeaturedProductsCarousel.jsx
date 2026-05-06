import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../product/ProductCard'

export default function FeaturedProductsCarousel({ products, onAddToCart, title = "Featured Products" }) {
  const carouselRef = useRef(null)

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 400
      const newPos = carouselRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      carouselRef.current.scrollLeft = newPos
    }
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4">
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>

        {/* Mobile scroll indicators */}
        <div className="md:hidden flex justify-center gap-2 mt-4">
          {[...Array(Math.ceil(products.length / 1))].map((_, i) => (
            <button
              key={i}
              className="w-2 h-2 rounded-full bg-gray-300 hover:bg-blue-600 transition"
              onClick={() => {
                if (carouselRef.current) {
                  carouselRef.current.scrollLeft = i * carouselRef.current.offsetWidth
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
