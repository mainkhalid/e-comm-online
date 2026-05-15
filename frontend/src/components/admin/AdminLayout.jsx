import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  FolderTree, BarChart3, Tag, Star, Menu, X,
  LogOut, ChevronRight, Bell, Settings, Award,
} from 'lucide-react'
import { logout } from '../../store/slices/authSlice'

const NAV = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard',  exact: true },
  { to: '/admin/products',   icon: Package,         label: 'Products'   },
  { to: '/admin/orders',     icon: ShoppingCart,    label: 'Orders'     },
  { to: '/admin/customers',  icon: Users,           label: 'Customers'  },
  { to: '/admin/categories', icon: FolderTree,      label: 'Categories' },
  { to: '/admin/brands',     icon: Award,           label: 'Brands'     },
  { to: '/admin/analytics',  icon: BarChart3,       label: 'Analytics'  },
  { to: '/admin/settings',   icon: Settings,        label: 'Settings'   },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  const initials = [user?.first_name?.[0], user?.last_name?.[0]].filter(Boolean).join('').toUpperCase() || 'A'

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : ''}`}
      style={{ background: 'var(--navy)' }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'var(--orange)' }}>TZ</div>
          <div>
            <span className="font-bold text-sm text-white">Tech</span>
            <span className="font-bold text-sm" style={{ color: 'var(--orange)' }}>Zone</span>
            <span className="text-[9px] font-bold uppercase tracking-widest block"
              style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1, marginTop: '-2px' }}>Admin</span>
          </div>
        </Link>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)}>
            <X size={18} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.3)' }}>Main Menu</p>
        {NAV.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? 'rgba(255,107,43,0.15)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--orange)' : '3px solid transparent',
            })}
          >
            <div className="flex items-center gap-3">
              <Icon size={16} />
              {label}
            </div>
            <ChevronRight size={12} className="opacity-0 group-hover:opacity-60 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'var(--orange)' }}>{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:bg-red-500/10"
          style={{ color: '#f87171' }}
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-56 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-56">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="flex items-center justify-between px-5 h-14 flex-shrink-0 border-b"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden btn-icon"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-2">
            <button className="btn-icon relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: 'var(--orange)' }} />
            </button>
            <Link to="/" className="btn-ghost text-xs py-1.5 px-3 rounded-lg">
              View Store →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-7" style={{ overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}