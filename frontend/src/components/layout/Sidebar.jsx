import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const categoryTree = [
  {
    name: 'Phones & Tablets',
    subcategories: ['Mobile Phones', 'Tablets', 'Phone Accessories', 'Chargers']
  },
  {
    name: 'Smart Watches',
    subcategories: ['Smartwatches', 'Fitness Trackers', 'Watch Bands']
  },
  {
    name: 'Fashion Accessories',
    subcategories: ['Bags', 'Belts', 'Wallets', 'Sunglasses']
  },
  {
    name: 'TV, Audio & Video',
    subcategories: ['Smart TVs', 'Sound Systems', 'Headphones', 'Speakers']
  },
  {
    name: 'Camera & Photo',
    subcategories: ['Digital Cameras', 'Lenses', 'Tripods', 'Lighting']
  },
  {
    name: 'Sports & Fitness',
    subcategories: ['Yoga Mats', 'Dumbbells', 'Treadmills', 'Sports Gear']
  },
  {
    name: 'Computing',
    subcategories: ['Laptops', 'Desktops', 'Monitors', 'Keyboards', 'Mice']
  },
  {
    name: 'Networking',
    subcategories: ['Routers', 'Modems', 'Network Cables', 'Switches']
  },
  {
    name: 'Office Solutions',
    subcategories: ['Printers', 'Scanners', 'Office Chairs', 'Desks']
  }
]

export default function Sidebar() {
  const [expandedCategory, setExpandedCategory] = useState(0)

  return (
    <div className="bg-white rounded shadow hidden lg:block">
      <div className="bg-green-600 text-white font-bold p-4 flex items-center gap-2">
        <span>☰</span>
        BROWSE CATEGORIES
      </div>

      <div className="max-h-96 overflow-y-auto">
        {categoryTree.map((category, idx) => (
          <div key={idx} className="border-b border-gray-200">
            <button
              onClick={() => setExpandedCategory(expandedCategory === idx ? -1 : idx)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition text-sm font-medium text-gray-700"
            >
              <span>{category.name}</span>
              <ChevronRight
                size={16}
                className={`transition-transform ${expandedCategory === idx ? 'rotate-90' : ''}`}
              />
            </button>

            {expandedCategory === idx && (
              <div className="bg-gray-50">
                {category.subcategories.map((subcat, subIdx) => (
                  <Link
                    key={subIdx}
                    to={`/products?category=${category.name}&subcategory=${subcat}`}
                    className="block px-8 py-2 text-xs text-gray-600 hover:text-green-600 hover:bg-white transition"
                  >
                    {subcat}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
