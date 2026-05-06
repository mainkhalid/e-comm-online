import { Link } from 'react-router-dom'
import { Search, ShoppingCart, Menu, X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { logout } from '../../store/slices/authSlice'

const categories = [
  'GAMING', 'SPORTS & FITNESS', 'FUN & GAMES', 'POWER & ELECTRICALS',
  'OFFICE SOLUTIONS', 'SATELLITE COMMUNICATION', 'REFURBISHED', 'SMART HOME',
  'SURVEILLANCE SYSTEM', 'ENGINEERING & SURVEYING', 'SOFTWARE'
]

export default function MainNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { itemCount, total } = useSelector(state => state.cart)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    setIsMenuOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
      setSearchQuery('')
    }
  }

  return (
    <nav className="bg-white shadow-sm">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded flex items-center justify-center shadow">
            <span className="text-white font-bold">T</span>
          </div>
          <span className="font-bold text-lg text-gray-900 hidden sm:inline">E-comm</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-600 text-sm"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-green-600"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Category Selector */}
          <select className="px-3 py-2 rounded border border-gray-300 text-sm hidden lg:block">
            <option>SELECT CATEGORY</option>
            {categories.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          {/* Cart */}
          <Link to="/cart" className="flex items-center gap-1 text-green-600 font-bold">
            <ShoppingCart size={20} />
            <span className="text-sm">KSH {(total / 1000).toFixed(1)}K</span>
            <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded font-bold">
              {itemCount}
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-gray-50 border-t border-gray-200 overflow-x-auto hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 py-2 whitespace-nowrap">
          {categories.map(cat => (
            <Link
              key={cat}
              to={`/products?category=${cat.toLowerCase()}`}
              className="text-xs font-semibold text-gray-700 hover:text-green-600 py-2 border-b-2 border-transparent hover:border-green-600 transition"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
              />
              <button type="submit" className="absolute right-2 top-2 text-gray-400">
                <Search size={16} />
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {categories.slice(0, 6).map(cat => (
              <Link
                key={cat}
                to={`/products?category=${cat.toLowerCase()}`}
                className="block text-sm font-semibold text-gray-700 hover:text-green-600 py-2 border-b border-gray-100"
              >
                {cat}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="mt-4 w-full btn-secondary"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="mt-4 w-full block btn-primary text-center">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
