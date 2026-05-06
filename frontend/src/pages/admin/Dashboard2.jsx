import { BarChart3, TrendingUp, ShoppingCart, Users, Package } from 'lucide-react'

export default function AdminDashboard2() {
  const stats = [
    { label: 'Total Revenue', value: 'KSh 2.4M', change: '+12%', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Orders', value: '1,287', change: '+5%', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
    { label: 'Customers', value: '3,456', change: '+8%', icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: 'Products', value: '542', change: '+2%', icon: Package, color: 'bg-orange-100 text-orange-600' },
  ]

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', status: 'Completed', amount: 'KSh 15,000', date: '2024-01-20' },
    { id: 'ORD-002', customer: 'Jane Smith', status: 'Pending', amount: 'KSh 22,500', date: '2024-01-19' },
    { id: 'ORD-003', customer: 'Mike Johnson', status: 'Shipped', amount: 'KSh 8,900', date: '2024-01-18' },
  ]

  const topProducts = [
    { id: 1, name: 'MacBook Pro 16"', sales: 45, revenue: 'KSh 13.5M' },
    { id: 2, name: 'Dell XPS 13', sales: 38, revenue: 'KSh 8.2M' },
    { id: 3, name: 'iPad Air', sales: 62, revenue: 'KSh 6.8M' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 ml-0 lg:ml-64 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to TechZone Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-green-600 text-xs font-semibold mt-2">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-600">Order ID</th>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-600">Customer</th>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-600">Status</th>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-600">Amount</th>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.customer}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.amount}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                  <span className="text-xs font-bold text-green-600">{product.sales} sales</span>
                </div>
                <p className="text-sm text-gray-600">{product.revenue}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(product.sales / 70) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
