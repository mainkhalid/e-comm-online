import { useState } from 'react'
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, BarChart2,
  ChevronLeft, Menu, Cpu, LogOut, Settings
} from 'lucide-react'

const NAV = [
  { icon: <LayoutDashboard size={16}/>, label: 'Dashboard',  path: '/admin' },
  { icon: <Package size={16}/>,         label: 'Products',   path: '/admin/products' },
  { icon: <Tag size={16}/>,             label: 'Categories', path: '/admin/categories' },
  { icon: <ShoppingBag size={16}/>,     label: 'Orders',     path: '/admin/orders' },
  { icon: <Users size={16}/>,           label: 'Customers',  path: '/admin/customers' },
  { icon: <BarChart2 size={16}/>,       label: 'Analytics',  path: '/admin/analytics' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/login" />

  return (
    <div className="flex h-screen overflow-hidden" style={{background:'#0c0c0e'}}>
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-56'} shrink-0 flex flex-col border-r border-white/[0.06] transition-all duration-200`}
        style={{background:'#0e0e11'}}>
        {/* Logo */}
        <div className={`h-16 flex items-center border-b border-white/[0.06] ${collapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{background:'#e8192c'}}>
            <Cpu size={15} className="text-white" />
          </div>
          {!collapsed && <span className="font-serif text-[17px] text-white">TechZone</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {!collapsed && <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a4a5e] px-3 mb-3">Main</p>}
          {NAV.map(item => {
            const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
            return (
              <Link key={item.path} to={item.path}
                className={`admin-nav-item ${active ? 'active' : ''} ${collapsed ? 'justify-center px-0 w-full' : ''}`}
                title={collapsed ? item.label : ''}>
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] p-2 space-y-0.5">
          <Link to="/" className={`admin-nav-item ${collapsed ? 'justify-center px-0' : ''}`} title="Back to store">
            <ChevronLeft size={16} />
            {!collapsed && <span>Back to store</span>}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)}
            className={`admin-nav-item w-full ${collapsed ? 'justify-center px-0' : ''}`}>
            <Menu size={16} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-16 border-b border-white/[0.06] flex items-center justify-between px-6 shrink-0"
          style={{background:'#0e0e11'}}>
          <h1 className="text-[15px] font-semibold text-white capitalize">
            {location.pathname.split('/').pop() || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[13px] font-medium text-white">{user?.full_name || user?.email || 'Admin'}</p>
              <p className="text-[11px] text-[#5a5a6e]">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[13px]"
              style={{background:'#e8192c'}}>
              {(user?.first_name || 'A')[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
