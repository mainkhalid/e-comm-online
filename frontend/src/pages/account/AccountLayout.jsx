import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import {
  User, Package, MapPin, Heart, Star,
  Lock, ChevronRight, LogOut,
} from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/account/profile',  icon: User,    label: 'My Profile'    },
  { to: '/account/orders',   icon: Package, label: 'My Orders'     },
  { to: '/account/addresses',icon: MapPin,  label: 'Addresses'     },
  { to: '/account/wishlist', icon: Heart,   label: 'Wishlist'      },
  { to: '/account/reviews',  icon: Star,    label: 'My Reviews'    },
  { to: '/account/security', icon: Lock,    label: 'Password & Security' },
]

export default function AccountLayout() {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const { isAuthenticated, user } = useSelector(s => s.auth)

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated])

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Signed out')
    navigate('/')
  }

  const initials = [user?.first_name?.[0], user?.last_name?.[0]]
    .filter(Boolean).join('').toUpperCase() || 'U'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 py-5">
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Home › My Account</p>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>My Account</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div
              className="rounded-2xl overflow-hidden sticky top-20"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {/* Avatar section */}
              <div
                className="p-5 border-b"
                style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, var(--navy) 0%, #1E3A8A 100%)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: 'var(--orange)' }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nav links */}
              <nav className="p-2">
                {NAV.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                        isActive ? 'active' : ''
                      } admin-nav-item`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      {label}
                    </div>
                    <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </NavLink>
                ))}

                <div className="border-t my-2" style={{ borderColor: 'var(--border)' }} />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-red-50"
                  style={{ color: 'var(--danger)' }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* ── Page content ── */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}