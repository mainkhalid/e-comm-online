import { Link } from 'react-router-dom'
import { BarChart3, Package, ShoppingCart, Users, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'

const menuItems = [
  { label: 'Dashboard', icon: BarChart3, path: '/admin' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
]

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-40 btn-icon"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0 lg:w-64'
      } overflow-hidden`}>
        <div className="p-6 border-b border-gray-700">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <div className="font-bold text-white">TechZone</div>
              <div className="text-xs text-gray-400">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded text-gray-300 hover:bg-green-600 hover:text-white transition group"
              >
                <Icon size={20} className="group-hover:text-white" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded bg-red-600 text-white hover:bg-red-700 transition font-semibold"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
