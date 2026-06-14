import { Link } from 'react-router-dom'

const CATEGORIES = [
  {
    id: 1,
    name: 'Laptops',
    sub: 'Gaming · Ultrabooks · Business',
    href: '/products?category=laptops',
  },
  {
    id: 2,
    name: 'All-in-Ones',
    sub: 'Windows · macOS · Linux',
    href: '/products?category=desktops',
  },
  {
    id: 3,
    name: 'Desktops',
    sub: 'HP · Dell · Lenovo · E-readers',
  },
  {
    id: 4,
    name: 'Batteries',
    sub: 'HP · Dell · Lenovo',
    href: '/products?category=batteries',
  },
  {
    id: 5,
    name: 'Printers',
    sub: 'Inkjet · Laser · 3D Printers',
    href: '/products?category=printers',
  },
  {
    id: 6,
    name: 'Tablets',
    sub: 'iPad · Galaxy Tab · Kindle',
    href: '/products?category=tablets',
  },
  {
    id: 7,
    name: 'Networking',
    sub: 'Routers · CCTV · POS',
    href: '/products?category=networking',
  },
  {
    id: 8,
    name: 'Accessories',
    sub: 'Bags · Chargers · Cables',
    href: '/products?category=accessories',
  },
]

export default function PopularCategories() {
  return (
    <section className="py-16 px-4 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--orange)' }}>
              Browse by category
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--navy)' }}>
              Popular Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="group text-sm font-bold hidden sm:flex items-center gap-1 transition-colors"
            style={{ color: 'var(--navy)' }}
          >
            View all categories
            <span className="transition-transform group-hover:translate-x-1" style={{ color: 'var(--orange)' }}>
              →
            </span>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between min-h-[120px]"
            >
              <div>
                <h3 className="text-base font-bold mb-1 transition-colors group-hover:text-[var(--orange)]" style={{ color: 'var(--text)' }}>
                  {category.name}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {category.sub}
                </p>
              </div>

              {/* Clean text-based CTA replacement */}
              <div className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0" style={{ color: 'var(--orange)' }}>
                Explore 
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}