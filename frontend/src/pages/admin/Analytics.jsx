import { useState, useEffect } from 'react'
import { TrendingUp, ShoppingBag, Package, Users, DollarSign, Clock, AlertTriangle } from 'lucide-react'
import { adminGetStats } from '../../api/services'

const fmt = p => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(p)

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <p className="font-serif text-[28px] text-white mb-0.5">{value}</p>
      <p className="text-[12px] text-[#6a6a7e]">{label}</p>
      {sub && <p className="text-[11px] text-[#5a5a6e] mt-1">{sub}</p>}
    </div>
  )
}

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#06b6d4',
  delivered: '#10b981',
  cancelled: '#e8192c',
}

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetStats()
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="space-y-6 fade-up">
      <div><h2 className="font-serif text-2xl text-white mb-1">Analytics</h2></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-32" />)}
      </div>
    </div>
  )

  if (!stats) return (
    <div className="text-center py-20 text-[#5a5a6e]">
      <AlertTriangle size={32} className="mx-auto mb-3" />
      <p>Failed to load analytics. Make sure you're logged in as admin.</p>
    </div>
  )

  const statusEntries = Object.entries(stats.status_breakdown || {})
  const totalStatusOrders = statusEntries.reduce((s, [, c]) => s + c, 0) || 1

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h2 className="font-serif text-2xl text-white mb-1">Analytics</h2>
        <p className="text-[13px] text-[#6a6a7e]">Business metrics and insights</p>
      </div>

      {/* Revenue & Orders */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<TrendingUp size={18} />} label="Total Revenue" value={fmt(stats.total_revenue)} sub="All time" color="#10b981" />
        <StatCard icon={<DollarSign size={18} />} label="30-Day Revenue" value={fmt(stats.recent_revenue)} sub="Last 30 days" color="#3b82f6" />
        <StatCard icon={<ShoppingBag size={18} />} label="Total Orders" value={stats.total_orders} sub={`${stats.recent_orders} in last 30 days`} color="#8b5cf6" />
        <StatCard icon={<Users size={18} />} label="Customers" value={stats.total_customers} sub="Registered users" color="#f59e0b" />
      </div>

      {/* Inventory & Alerts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Package size={18} />} label="Active Products" value={stats.total_products} color="#06b6d4" />
        <StatCard icon={<AlertTriangle size={18} />} label="Low Stock" value={stats.low_stock_count} sub="Below threshold" color="#f59e0b" />
        <StatCard icon={<Package size={18} />} label="Out of Stock" value={stats.out_of_stock_count} color="#ef4444" />
        <StatCard icon={<Clock size={18} />} label="Pending Orders" value={stats.pending_orders} sub={`${stats.pending_reviews} reviews pending`} color="#e8192c" />
      </div>

      {/* Order Status Breakdown */}
      <div className="surface p-6">
        <h3 className="font-semibold text-white text-[15px] mb-5">Order Status Breakdown</h3>
        <div className="space-y-4">
          {statusEntries.map(([status, count]) => {
            const pct = Math.round((count / totalStatusOrders) * 100)
            const color = STATUS_COLORS[status] || '#888'
            return (
              <div key={status}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium capitalize" style={{ color }}>{status}</span>
                  <span className="text-[12px] text-[#6a6a7e]">{count} orders ({pct}%)</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            )
          })}
        </div>
        {statusEntries.length === 0 && (
          <p className="text-center text-[#5a5a6e] text-[13px] py-4">No order data yet</p>
        )}
      </div>
    </div>
  )
}
