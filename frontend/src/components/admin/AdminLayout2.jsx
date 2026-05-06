import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminLayout() {
  const { isAuthenticated } = useSelector(s => s.auth)

  if (!isAuthenticated) return <Navigate to="/login" />

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
