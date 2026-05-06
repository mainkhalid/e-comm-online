import { Bell, User } from 'lucide-react'

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-6 ml-0 lg:ml-64">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, Admin</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="btn-icon relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>

          {/* User Profile */}
          <button className="btn-icon">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
