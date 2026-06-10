import { Link } from 'react-router-dom'
import { homeAssets } from '../../assets/assets'
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, MessageCircle } from 'lucide-react'

const NAV_COLS = [
  {
    title: 'Shop',
    links: [
      ['Laptops',        '/products?category=laptops'],
      ['Desktops',    '/products?category=desktops'],
      ['Networking',    '/products?category=networking'],
      ['Printers',         '/products?category=printers'],
      ['Accessories',    '/products?category=accessories'],
      ['🔥 Hot Deals',   '/products?on_sale=true'],
    ],
  },
  {
    title: 'My Account',
    links: [
      ['Sign In',        '/login'],
      ['Create Account', '/register'],
      ['My Orders',      '/account/orders'],
      ['My Profile',     '/account/profile'],
      ['Wishlist',       '/wishlist'],
      ['Track Order',    '/account/orders'],
    ],
  },
  {
    title: 'Help & Info',
    links: [
      ['About Us',        '/about'],
      ['Contact Us',      '/contact'],
      ['Shipping Policy', '/policies'],
      ['Return Policy',   '/policies'],
      ['Warranty Info',   '/warranty'],
      ['Terms & Conditions', '/terms'],
    ],
  },
]

const SOCIALS = [
  { icon: Facebook,       href: 'https://www.facebook.com/Nixxontechnologies', label: 'Facebook' },
  { icon: Instagram,      href: '#', label: 'Instagram' },
  { icon: MessageCircle,  href: 'https://wa.me/254722363470', label: 'WhatsApp' },
]

const PAYMENTS = ['M-Pesa', 'Equity Bank', 'Cash on Delivery']

export default function Footer() {
  const isExternal = (href) => href.startsWith('mailto:') || href.startsWith('http') || href.startsWith('#')

  return (
    <footer style={{ background: 'var(--navy)', color: 'white' }}>

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center font-bold bg-white"
                
              >
                  <img src={homeAssets.logo} alt="Nixxon Technologies" />
              </div>
              <div>
                <span className="font-bold text-lg text-white">Nixxon</span>
                <span className="font-bold text-lg" style={{ color: 'var(--orange)' }}>Tech</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Kenya's premier destination for genuine tech products. Authorised dealer for Apple,
              Samsung, JBL, Garmin, Dell, HP, and 80+ more trusted brands.
            </p>

            {/* Contact */}
            <div className="space-y-2.5 mb-7">
              {[
                [MapPin, 'Moi Avenue,Bazaar Plaza ,Nairobi'],
                [Phone,  '+254 722 363470'],
                [Mail,   'support@nixxontechnologies.co.ke'],
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <Icon size={14} style={{ color: 'var(--orange)', flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map(col => (
            <div key={col.title}>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {col.title}
              </h4>
              <div className="flex flex-col gap-3">
                {col.links.map(([label, href]) =>
                  isExternal(href) ? (
                    <a
                      key={label}
                      href={href}
                      className="text-sm transition-colors"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                      onMouseEnter={e => (e.target.style.color = 'var(--orange)')}
                      onMouseLeave={e => (e.target.style.color = 'rgba(255,255,255,0.55)')}
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      key={label}
                      to={href}
                      className="text-sm transition-colors"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                      onMouseEnter={e => (e.target.style.color = 'var(--orange)')}
                      onMouseLeave={e => (e.target.style.color = 'rgba(255,255,255,0.55)')}
                    >
                      {label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            &copy; {new Date().getFullYear()} Nixxon Technologies Kenya Ltd. All rights reserved.
          </p>

          {/* Payment badges */}
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENTS.map(method => (
              <span
                key={method}
                className="text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: 'rgba(255,255,255,0.60)',
                }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}