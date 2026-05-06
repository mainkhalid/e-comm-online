import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, TrendingUp, ArrowUp, ArrowRight, Circle } from 'lucide-react'
import { adminGetProducts, adminGetOrders, adminGetStats } from '../../api/services'

const fmt = p => new Intl.NumberFormat('en-KE',{style:'currency',currency:'KES',minimumFractionDigits:0}).format(p)

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${color}18`}}>
          <span style={{color}}>{icon}</span>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-green-400">
          <ArrowUp size={11} /> 12%
        </span>
      </div>
      <p className="font-serif text-[28px] text-white mb-0.5">{value}</p>
      <p className="text-[12px] text-[#6a6a7e]">{label}</p>
      {sub && <p className="text-[11px] text-[#5a5a6e] mt-1">{sub}</p>}
    </div>
  )
}

const STATUS_COLORS = {
  pending:    '#f59e0b',
  confirmed:  '#3b82f6',
  processing: '#8b5cf6',
  shipped:    '#06b6d4',
  delivered:  '#10b981',
  cancelled:  '#e8192c',
}

export default function AdminDashboard() {
  const [orders, setOrders]   = useState([])
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminGetOrders().then(({data}) => setOrders(data.results || data)).catch(() => {}),
      adminGetProducts({ordering:'-created_at'}).then(({data}) => setProducts(data.results || data)).catch(() => {}),
      adminGetStats().then(({data}) => setStats(data)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const totalRevenue = stats?.total_revenue || orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + parseFloat(o.total || 0), 0)
  const totalCustomers = stats?.total_customers || '—'

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h2 className="font-serif text-2xl text-white mb-1">Dashboard</h2>
        <p className="text-[13px] text-[#6a6a7e]">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<TrendingUp size={18}/>} label="Total Revenue" value={fmt(totalRevenue)} color="#e8192c" />
        <StatCard icon={<ShoppingBag size={18}/>} label="Total Orders" value={orders.length} sub="All time" color="#3b82f6" />
        <StatCard icon={<Package size={18}/>} label="Products" value={products.length} sub="Active listings" color="#10b981" />
        <StatCard icon={<Users size={18}/>} label="Customers" value={totalCustomers} sub="Registered users" color="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Recent orders */}
        <div className="surface p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white text-[15px]">Recent orders</h3>
            <Link to="/admin/orders" className="text-[12px] flex items-center gap-1 hover:gap-2 transition-all" style={{color:'#e8192c'}}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="skeleton h-12" />)}</div>
          ) : orders.length === 0 ? (
            <p className="text-[13px] text-[#5a5a6e] text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-1">
              {orders.slice(0, 6).map(order => (
                <Link key={order.id} to={`/admin/orders/${order.order_number}`}
                  className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group">
                  <div>
                    <p className="text-[13px] font-medium text-white group-hover:text-[#e8192c] transition-colors">{order.order_number}</p>
                    <p className="text-[11px] text-[#5a5a6e]">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-white">{fmt(order.total)}</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{background:`${STATUS_COLORS[order.status] || '#888'}18`, color: STATUS_COLORS[order.status] || '#888'}}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent products */}
        <div className="surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white text-[15px]">Recent products</h3>
            <Link to="/admin/products" className="text-[12px] flex items-center gap-1 hover:gap-2 transition-all" style={{color:'#e8192c'}}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="skeleton h-12" />)}</div>
          ) : products.length === 0 ? (
            <p className="text-[13px] text-[#5a5a6e] text-center py-8">No products yet</p>
          ) : (
            <div className="space-y-1">
              {products.slice(0,6).map(p => (
                <Link key={p.id} to={`/admin/products/${p.id}`}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-[#222228] overflow-hidden shrink-0">
                    {p.primary_image && <img src={p.primary_image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#d0d0d8] group-hover:text-white transition-colors truncate">{p.name}</p>
                    <p className="text-[11px] text-[#5a5a6e]">{fmt(p.current_price)}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.in_stock ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {p.in_stock ? 'In stock' : 'Out'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
