import { Link } from 'react-router-dom'
import { Phone, Mail, User, Heart, LogIn, ChevronDown, MapPin } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useState } from 'react'

const SHIPPING_NOTICES = [
  '🚚 Free shipping on orders over KSH 100,000 — Kenya-wide delivery',
  '🔒 Secure M-Pesa & card payments — 100% safe checkout',
  '↩️ 30-day hassle-free returns on all products',
  '⚡ Same-day dispatch for orders placed before 2 PM',
]

export default function TopBar() {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const [noticeIdx] = useState(0)

  return (
    <div style={{ background: 'var(--navy)' }} className="hidden sm:block text-white ">
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="flex items-center justify-between h-9 text-s ">

          {/* Left — scrolling shipping notice */}
          <div className="flex items-center gap-6 overflow-hidden">
            <div
              key={noticeIdx}
              className="text-slate-300 font-medium animate-fade-in"
              style={{ fontSize: '11px' }}
            >
              {SHIPPING_NOTICES[noticeIdx]}
            </div>
          </div>

          {/* Right — contacts + account */}
          <div className="flex items-center gap-5" style={{ fontSize: '11px' }}>
            <a
              href="tel:+254705125957"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone size={11} />
              +254 722 363470
            </a>
            <a
              href="mailto:sales@nixxontechnologies.co.ke"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Mail size={11} />
              sales@nixxontechnologies.co.ke
            </a>

            <div className="w-px h-3 bg-white/20" />

            <a
              href="/products?on_sale=true"
              className="text-orange-400 font-semibold hover:text-orange-300 transition-colors"
              style={{ fontSize: '11px' }}
            >
              🔥 Today's Deals
            </a>

            <Link
              to="/wishlist"
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Heart size={11} />
              Wishlist
            </Link>

            {isAuthenticated ? (
              <Link
                to="/account/profile"
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              >
                <User size={11} />
                {user?.first_name || 'My Account'}
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              >
                <LogIn size={11} />
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}