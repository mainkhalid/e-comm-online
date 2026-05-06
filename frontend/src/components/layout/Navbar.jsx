import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Search, ShoppingCart, Menu, X, LogOut, LogIn, User, ChevronDown, Package, Settings, Heart, Home, Box } from 'lucide-react'
import { logout } from '../../store/slices/authSlice'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { itemCount } = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    setIsMenuOpen(false)
    setShowAccountMenu(false)
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top promotional bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <span className="hidden sm:inline">🎉 Welcome to TechZone — Premium Tech Products in Kenya</span>
          <span className="sm:hidden text-xs">🎉 TechZone — Premium Tech</span>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Link to="/account/orders" className="hover:underline transition text-xs sm:text-sm">Track Order</Link>
            )}
            <a href="mailto:hello@techzone.co.ke" className="hover:underline transition text-xs sm:text-sm">Support</a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="hidden sm:inline font-bold text-xl text-gray-900 tracking-tight">E-comm</span>
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search laptops, desktops, accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-1">
              {isAuthenticated ? (
                <div className="relative">
                  <button onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {(user?.first_name || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">{user?.first_name || 'Account'}</span>
                    <ChevronDown size={14} className={`transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showAccountMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowAccountMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-semibold text-gray-900 text-sm">{user?.full_name || user?.email}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <Link to="/account/profile" onClick={() => setShowAccountMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <User size={16} /> My Profile
                        </Link>
                        <Link to="/account/orders" onClick={() => setShowAccountMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <Package size={16} /> My Orders
                        </Link>
                        {user?.is_staff && (
                          <Link to="/admin" onClick={() => setShowAccountMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition">
                            <Settings size={16} /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full text-left">
                            <LogOut size={16} /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm font-medium">
                  <LogIn size={18} /> Sign In
                </Link>
              )}

              <Link to="/cart" className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile: cart + menu */}
            <div className="flex md:hidden items-center gap-1">
              <Link to="/cart" className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar - mobile */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <input type="text" placeholder="Search…" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Category links - desktop */}
        <div className="hidden md:flex gap-6 mt-3 pt-3 border-t border-gray-100 text-sm">
          <Link to="/" className="font-medium text-gray-700 hover:text-blue-600 transition flex items-center gap-1.5">
            <Home size={15} /> Home
          </Link>
          <Link to="/products" className="font-medium text-gray-700 hover:text-blue-600 transition flex items-center gap-1.5">
            <Box size={15} /> All Products
          </Link>
          <Link to="/products?category=laptops" className="font-medium text-gray-600 hover:text-blue-600 transition">Laptops</Link>
          <Link to="/products?category=desktops" className="font-medium text-gray-600 hover:text-blue-600 transition">Desktops</Link>
          <Link to="/products?on_sale=true" className="font-medium text-red-600 hover:text-red-700 transition">🔥 Hot Deals</Link>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-1 max-w-7xl mx-auto">
            {[
              { to: '/', label: 'Home', icon: <Home size={18} /> },
              { to: '/products', label: 'All Products', icon: <Box size={18} /> },
              { to: '/products?category=laptops', label: 'Laptops' },
              { to: '/products?category=desktops', label: 'Desktops' },
              { to: '/products?on_sale=true', label: '🔥 Hot Deals' },
            ].map(item => (
              <Link key={item.label} to={item.to}
                className="flex items-center gap-3 py-3 px-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                onClick={() => setIsMenuOpen(false)}>
                {item.icon} {item.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2">
                    <p className="font-semibold text-gray-900">{user?.full_name || user?.email}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link to="/account/profile" className="flex items-center gap-3 py-3 px-3 rounded-xl text-gray-700 hover:bg-gray-50 transition" onClick={() => setIsMenuOpen(false)}>
                    <User size={18} /> My Profile
                  </Link>
                  <Link to="/account/orders" className="flex items-center gap-3 py-3 px-3 rounded-xl text-gray-700 hover:bg-gray-50 transition" onClick={() => setIsMenuOpen(false)}>
                    <Package size={18} /> My Orders
                  </Link>
                  {user?.is_staff && (
                    <Link to="/admin" className="flex items-center gap-3 py-3 px-3 rounded-xl text-blue-600 hover:bg-blue-50 transition" onClick={() => setIsMenuOpen(false)}>
                      <Settings size={18} /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    className="flex items-center gap-3 py-3 px-3 rounded-xl text-red-600 hover:bg-red-50 transition w-full">
                    <LogOut size={18} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-3 py-3 px-3 rounded-xl text-blue-600 font-semibold hover:bg-blue-50 transition" onClick={() => setIsMenuOpen(false)}>
                    <LogIn size={18} /> Sign In
                  </Link>
                  <Link to="/register" className="flex items-center gap-3 py-3 px-3 rounded-xl text-blue-600 font-semibold hover:bg-blue-50 transition" onClick={() => setIsMenuOpen(false)}>
                    <User size={18} /> Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
