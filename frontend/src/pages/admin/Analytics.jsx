import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, ShoppingCart, Users, Package, ArrowUpRight } from 'lucide-react'
import { adminGetAnalytics } from '../../api/services'

const fmt  = p => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(p)
const fmtK = p => p >= 1000000 ? `KSh ${(p/1000000).toFixed(1)}M` : p >= 1000 ? `KSh ${(p/1000).toFixed(0)}K` : fmt(p)

/* ── Fallback static data if API not wired ── */
const REVENUE = [
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

const TOP_PRODUCTS = [
  { name: 'MacBook Pro M4',     revenue: 3780000, units: 21 },
  { name: 'Samsung Galaxy S25', revenue: 2450000, units: 49 },
  { name: 'JBL Charge 6',       revenue: 1260000, units: 126 },
  { name: 'iPad Pro 13"',       revenue: 1890000, units: 18 },
  { name: 'PS5 Slim',           revenue: 1540000, units: 22 },
]

const CATEGORY_PIE = [
  { name: 'Laptops',     value: 38, color: 'var(--navy)' },
  { name: 'Phones',      value: 27, color: 'var(--orange)' },
  { name: 'Audio',       value: 16, color: '#7C3AED' },
  { name: 'Gaming',      value: 11, color: '#0891B2' },
  { name: 'Accessories', value: 8,  color: '#16A34A' },
]

const PAYMENT_DATA = [
  { name: 'M-Pesa',       value: 72 },
  { name: 'Visa/MC',      value: 18 },
  { name: 'PayPal',       value: 7 },
  { name: 'Cash on Del.', value: 3 },
]

function KpiCard({ label, value, change, icon: Icon, color, bg }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <Icon size={20} style={{ color }} />
        </div>
        <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: 'var(--success)' }}>
          <ArrowUpRight size={13} />{change}%
        </span>
      </div>
      <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--text)' }}>{value}</p>
      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>vs last month</p>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 text-xs shadow-card-hover"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <p className="font-bold mb-1" style={{ color: 'var(--text)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color || 'var(--text-muted)' }}>
          {p.name}: {prefix}{typeof p.value === 'number' && p.name === 'revenue' ? fmtK(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

export default function AdminAnalytics() {
  const [data, setData]     = useState(null)
  const [range, setRange]   = useState('12m')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetAnalytics?.({ range })
      .then(({ data: d }) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [range])

  const revenue      = data?.monthly_revenue    || []
  const topProducts  = data?.top_products       || []
  const categoryPie  = data?.category_breakdown || []
  const paymentData  = data?.payment_methods    || []

  const totalRevenue = revenue.reduce((s, r) => s + r.revenue, 0)
  const totalOrders  = revenue.reduce((s, r) => s + r.orders, 0)

  const KPIS = [
    { label: 'Total Revenue',  value: fmtK(totalRevenue), change: 12, icon: TrendingUp,   color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
    { label: 'Total Orders',   value: totalOrders.toLocaleString(), change: 8, icon: ShoppingCart, color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
    { label: 'Avg Order Value',value: fmt(totalRevenue / (totalOrders || 1)), change: 4, icon: Package, color: 'var(--orange)', bg: 'rgba(255,107,43,0.08)' },
    { label: 'New Customers',  value: (data?.new_customers ?? 0).toLocaleString(), change: 6, icon: Users, color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  ]

  return (
    <div className="space-y-6 fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Analytics</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Store performance overview</p>
        </div>
        {/* Range picker */}
        <div className="flex gap-1.5">
          {[
            { v: '7d',  l: '7 days' },
            { v: '30d', l: '30 days' },
            { v: '12m', l: '12 months' },
          ].map(({ v, l }) => (
            <button key={v} onClick={() => setRange(v)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: range === v ? 'var(--navy)' : 'var(--card)',
                color: range === v ? 'white' : 'var(--text-muted)',
                border: `1px solid ${range === v ? 'var(--navy)' : 'var(--border)'}`,
              }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Revenue + Orders chart */}
      <div className="card p-5">
        <h2 className="text-sm font-bold mb-5" style={{ color: 'var(--text)' }}>Revenue & Orders</h2>
        {revenue.length === 0 ? (
          <div className="flex items-center justify-center h-[260px] text-sm" style={{ color: 'var(--text-muted)' }}>
            No order data yet for this period
          </div>
        ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={revenue} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--orange)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--orange)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--navy)" stopOpacity={0.12} />
                <stop offset="95%" stopColor="var(--navy)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="rev" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
              tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
            <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8}
              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
            <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue"
              stroke="var(--orange)" strokeWidth={2.5} fill="url(#revGrad2)" dot={false}
              activeDot={{ r: 5, fill: 'var(--orange)' }} />
            <Area yAxisId="ord" type="monotone" dataKey="orders" name="Orders"
              stroke="var(--navy)" strokeWidth={2} fill="url(#ordGrad)" dot={false}
              activeDot={{ r: 4, fill: 'var(--navy)' }} />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>

      {/* Bottom row: Top products + Category pie + Payment breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Top products bar */}
        <div className="lg:col-span-2 card p-5">
          <h2 className="text-sm font-bold mb-5" style={{ color: 'var(--text)' }}>Top Products by Revenue</h2>
          {topProducts.length === 0 ? (
            <div className="flex items-center justify-center h-[220px] text-sm" style={{ color: 'var(--text-muted)' }}>
              No sales data yet for this period
            </div>
          ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={false} tickLine={false} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="var(--orange)" radius={[0, 5, 5, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>

        {/* Category pie + payment */}
        <div className="space-y-5">
          {/* Category breakdown */}
          <div className="card p-5">
            <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text)' }}>Sales by Category</h2>
            {categoryPie.length === 0 ? (
              <div className="flex items-center justify-center h-[140px] text-sm" style={{ color: 'var(--text-muted)' }}>
                No data yet
              </div>
            ) : (
            <>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={categoryPie} cx="50%" cy="50%" outerRadius={60}
                  dataKey="value" nameKey="name" stroke="none">
                  {categoryPie.map((entry, i) => (
                    <Cell key={i} fill={entry.color || `hsl(${i * 60}, 65%, 45%)`} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, '']}
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {categoryPie.map(c => (
                <div key={c.name} className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  {c.name} {c.value}%
                </div>
              ))}
            </div>
            </>
            )}
          </div>

          {/* Payment methods */}
          <div className="card p-5">
            <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text)' }}>Payment Methods</h2>
            {paymentData.length === 0 ? (
              <div className="flex items-center justify-center h-[80px] text-sm" style={{ color: 'var(--text-muted)' }}>
                No payment data yet
              </div>
            ) : (
            <div className="space-y-2.5">
              {paymentData.map(({ name, value }) => (
                <div key={name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-muted)' }}>{name}</span>
                    <span className="font-bold" style={{ color: 'var(--text)' }}>{value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${value}%`, background: name === 'M-Pesa Completed' ? '#16A34A' : name === 'M-Pesa Failed' ? '#DC2626' : 'var(--navy)' }} />
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}