import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, ShoppingCart, Users, Package,
  ArrowUpRight, ArrowDownRight, Zap, Clock,
  CheckCircle2, Truck, XCircle,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import { adminGetStats, adminGetOrders } from '../../api/services'

const fmt = p => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(p)

/* ── Stat card ── */
function StatCard({ label, value, change, icon: Icon, color, bg }) {
  const isUp = change >= 0
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: bg }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <span
          className="flex items-center gap-0.5 text-xs font-bold"
          style={{ color: isUp ? 'var(--success)' : 'var(--danger)' }}
        >
          {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(change)}%
        </span>
      </div>
      <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--text)' }}>{value}</p>
      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>vs last month</p>
    </div>
  )
}

/* ── Status badge ── */
const STATUS = {
  pending:    { label: 'Pending',    color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  confirmed:  { label: 'Confirmed',  color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
  processing: { label: 'Processing', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  shipped:    { label: 'Shipped',    color: '#0891B2', bg: 'rgba(8,145,178,0.08)' },
  delivered:  { label: 'Delivered',  color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
  cancelled:  { label: 'Cancelled',  color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
}

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  )
}

/* ── Mock chart data (replace with real API) ── */
const REVENUE_DATA = [
  { month: 'Jan', revenue: 320000, orders: 42 },
  { month: 'Feb', revenue: 410000, orders: 55 },
  { month: 'Mar', revenue: 380000, orders: 48 },
  { month: 'Apr', revenue: 520000, orders: 67 },
  { month: 'May', revenue: 490000, orders: 62 },
  { month: 'Jun', revenue: 640000, orders: 81 },
  { month: 'Jul', revenue: 710000, orders: 94 },
  { month: 'Aug', revenue: 680000, orders: 88 },
  { month: 'Sep', revenue: 820000, orders: 105 },
  { month: 'Oct', revenue: 790000, orders: 98 },
  { month: 'Nov', revenue: 930000, orders: 121 },
  { month: 'Dec', revenue: 1100000, orders: 143 },
]

const CATEGORY_DATA = [
  { name: 'Laptops',     value: 38 },
  { name: 'Phones',      value: 27 },
  { name: 'Audio',       value: 16 },
  { name: 'Gaming',      value: 11 },
  { name: 'Accessories', value: 8 },
]

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminGetStats().catch(() => ({ data: null })),
      adminGetOrders({ page_size: 6 }).catch(() => ({ data: { results: [] } })),
    ]).then(([{ data: s }, { data: o }]) => {
      setStats(s)
      setOrders(o.results || o || [])
    }).finally(() => setLoading(false))
  }, [])

  /* Use real stats if available, else placeholders */
  const STATS = [
    {
      label: 'Total Revenue',
      value: stats?.total_revenue ? fmt(stats.total_revenue) : 'KSh 0',
      change: stats?.revenue_change ?? 0,
      icon: TrendingUp,
      color: '#16A34A',
      bg: 'rgba(22,163,74,0.08)',
    },
    {
      label: 'Total Orders',
      value: stats?.total_orders?.toLocaleString() ?? '0',
      change: stats?.orders_change ?? 0,
      icon: ShoppingCart,
      color: '#2563EB',
      bg: 'rgba(37,99,235,0.08)',
    },
    {
      label: 'Customers',
      value: stats?.total_customers?.toLocaleString() ?? '0',
      change: stats?.customers_change ?? 0,
      icon: Users,
      color: '#7C3AED',
      bg: 'rgba(124,58,237,0.08)',
    },
    {
      label: 'Products',
      value: stats?.total_products?.toLocaleString() ?? '0',
      change: stats?.products_change ?? 0,
      icon: Package,
      color: 'var(--orange)',
      bg: 'rgba(255,107,43,0.08)',
    },
  ]

  /* Quick action items */
  const QUICK = [
    { icon: Zap,          label: 'Pending Orders',   count: stats?.pending_orders  ?? 0, color: '#D97706', to: '/admin/orders?status=pending' },
    { icon: Clock,        label: 'Low Stock Items',  count: stats?.low_stock       ?? 0, color: '#DC2626', to: '/admin/products?stock=low' },
    { icon: CheckCircle2, label: 'Delivered Today',  count: stats?.delivered_today ?? 0, color: '#16A34A', to: '/admin/orders?status=delivered' },
    { icon: Truck,        label: 'Shipped Today',    count: stats?.shipped_today   ?? 0, color: '#0891B2', to: '/admin/orders?status=shipped' },
  ]

  return (
    <div className="space-y-6 fade-up">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link to="/admin/products" className="btn-primary text-sm">
          <Package size={15} />
          Add Product
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick alerts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK.map(({ icon: Icon, label, count, color, to }) => (
          <Link
            key={label}
            to={to}
            className="card p-4 flex items-center gap-3 hover:scale-[1.01] transition-transform"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold leading-none" style={{ color: 'var(--text)' }}>{count}</p>
              <p className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Revenue area chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Revenue Overview</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(255,107,43,0.08)', color: 'var(--orange)' }}>
              2025
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--orange)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--orange)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }}
                formatter={v => [fmt(v), 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--orange)" strokeWidth={2.5}
                fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: 'var(--orange)' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown bar */}
        <div className="card p-5">
          <h2 className="text-sm font-bold mb-5" style={{ color: 'var(--text)' }}>Sales by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CATEGORY_DATA} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={72} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }}
                formatter={v => [`${v}%`, 'Share']}
              />
              <Bar dataKey="value" fill="var(--navy)" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs font-semibold" style={{ color: 'var(--orange)' }}>
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                {['Order #', 'Customer', 'Date', 'Items', 'Total', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="skeleton h-3.5 rounded" style={{ width: j === 1 ? '80px' : '60px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    No orders yet
                  </td>
                </tr>
              ) : orders.map(order => (
                <tr
                  key={order.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td className="px-4 py-3.5">
                    <Link to={`/admin/orders`} className="text-xs font-bold font-mono" style={{ color: 'var(--orange)' }}>
                      #{order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text)' }}>
                    {order.customer_name || order.user_email || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                    {order.items?.length || 0}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    {fmt(order.total_amount || order.total)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}