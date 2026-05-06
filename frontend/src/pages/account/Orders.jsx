import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'
import { getOrders } from '../../api/services'

const fmt = p => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(p)

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
}

const PAYMENT_COLORS = {
  paid: 'bg-green-100 text-green-700',
  unpaid: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
}

export default function Orders() {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(s => s.auth)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    getOrders()
      .then(({ data }) => setOrders(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  return (
    <>
      <Helmet><title>My Orders — TechZone</title></Helmet>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
              <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <button onClick={() => setSelected(selected?.id === order.id ? null : order)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-bold text-gray-900">{order.order_number}</span>
                        <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                        <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${PAYMENT_COLORS[order.payment_status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.payment_status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{new Date(order.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        <span>{order.items?.length || 0} item(s)</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900 text-lg">{fmt(order.total)}</p>
                      <ChevronRight size={16} className={`text-gray-400 mx-auto mt-1 transition-transform ${selected?.id === order.id ? 'rotate-90' : ''}`} />
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {selected?.id === order.id && (
                    <div className="border-t border-gray-100 px-6 py-5 bg-gray-50">
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">Items</p>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2 text-sm">
                            <div>
                              <span className="text-gray-900 font-medium">{item.product_name}</span>
                              <span className="text-gray-400 ml-2">× {item.quantity}</span>
                            </div>
                            <span className="font-semibold text-gray-900">{fmt(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-gray-900 text-lg">{fmt(order.total)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
