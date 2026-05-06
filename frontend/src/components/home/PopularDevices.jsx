import { Link } from 'react-router-dom'
import {
  Laptop, Monitor, Tablet, Headphones, Smartphone,
  Gamepad2, Tv, Router, Camera, Printer, HardDrive, Cpu,
} from 'lucide-react'

const DEVICES = [
  {
    id: 1,
    name: 'Laptops',
    sub: 'Gaming · Ultrabooks · Business',
    href: '/products?category=laptops',
    icon: Laptop,
    count: '2,340+',
    color: 'var(--navy)',
    light: 'rgba(15,23,42,0.06)',
  },
  {
    id: 2,
    name: 'Smartphones',
    sub: 'Android · iPhone · Satellite',
    href: '/products?category=smartphones',
    icon: Smartphone,
    count: '1,890+',
    color: '#4C6EF5',
    light: 'rgba(76,110,245,0.07)',
  },
  {
    id: 3,
    name: 'Tablets',
    sub: 'iPad · Android · E-readers',
    href: '/products?category=tablets',
    icon: Tablet,
    count: '890+',
    color: '#0891B2',
    light: 'rgba(8,145,178,0.07)',
  },
  {
    id: 4,
    name: 'Audio',
    sub: 'JBL · Bose · Anker · Sony',
    href: '/products?category=headphones',
    icon: Headphones,
    count: '3,120+',
    color: '#7C3AED',
    light: 'rgba(124,58,237,0.07)',
  },
  {
    id: 5,
    name: 'Televisions',
    sub: '4K · OLED · Smart TVs',
    href: '/products?category=tvs',
    icon: Tv,
    count: '640+',
    color: '#059669',
    light: 'rgba(5,150,105,0.07)',
  },
  {
    id: 6,
    name: 'Gaming',
    sub: 'PS5 · Xbox · PC Gaming',
    href: '/products?category=gaming',
    icon: Gamepad2,
    count: '1,500+',
    color: 'var(--orange)',
    light: 'rgba(255,107,43,0.07)',
  },
  {
    id: 7,
    name: 'Networking',
    sub: 'Routers · CCTV · POS',
    href: '/products?category=networking',
    icon: Router,
    count: '780+',
    color: '#DC2626',
    light: 'rgba(220,38,38,0.07)',
  },
  {
    id: 8,
    name: 'Accessories',
    sub: 'Bags · Chargers · Cables',
    href: '/products?category=accessories',
    icon: HardDrive,
    count: '5,400+',
    color: '#D97706',
    light: 'rgba(217,119,6,0.07)',
  },
]

export default function PopularDevices() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--orange)' }}>
              Browse by category
            </p>
            <h2 className="section-title text-2xl">Popular Categories</h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold hidden sm:flex items-center gap-1 transition-colors"
            style={{ color: 'var(--navy)' }}
          >
            View all
            <span style={{ color: 'var(--orange)' }}>→</span>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
          {DEVICES.map(device => {
            const Icon = device.icon
            return (
              <Link
                key={device.id}
                to={device.href}
                className="group card p-4 flex flex-col gap-3"
              >
                {/* Icon area */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: device.light }}
                >
                  <Icon size={22} style={{ color: device.color }} />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-sm font-bold mb-0.5" style={{ color: 'var(--text)' }}>
                    {device.name}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {device.sub}
                  </p>
                </div>

                {/* Count */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: device.light, color: device.color }}
                  >
                    {device.count}
                  </span>
                  <span
                    className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: device.color }}
                  >
                    Shop →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}