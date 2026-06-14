import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import {
  Package, ChevronDown, ShoppingBag, Truck,
  Clock, CheckCircle2, XCircle, RotateCcw,
  Eye, RefreshCcw,
} from 'lucide-react'
import { getOrders } from '../../api/services'
import { getCldMini } from '../../utils/cloudinaryUtils'

const fmt = p => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(p)

const ORDER_STATUS = {
  pending:    { label: 'Pending',    color: '#D97706', bg: 'rgba(217,119,6,0.08)',    icon: Clock },
  confirmed:  { label: 'Confirmed',  color: '#2563EB', bg: 'rgba(37,99,235,0.08)',    icon: CheckCircle2 },
  processing: { label: 'Processing', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)',   icon: RefreshCcw },
  shipped:    { label: 'Shipped',    color: '#0891B2', bg: 'rgba(8,145,178,0.08)',    icon: Truck },
  delivered:  { label: 'Delivered',  color: '#16A34A', bg: 'rgba(22,163,74,0.08)',    icon: CheckCircle2 },
  cancelled:  { label: 'Cancelled',  color: '#DC2626', bg: 'rgba(220,38,38,0.08)',    icon: XCircle },
  refunded:   { label: 'Refunded',   color: '#6B7280', bg: 'rgba(107,114,128,0.08)', icon: RotateCcw },
}

const PAYMENT_STATUS = {
  pending:   { label: 'Unpaid',    color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  completed: { label: 'Paid',      color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
  failed:    { label: 'Failed',    color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  refunded:  { label: 'Refunded',  color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
}

/* ── Status timeline ── */
const TIMELINE = ['pending','confirmed','processing','shipped','delivered']
function StatusTimeline({ current }) {
  const idx = TIMELINE.indexOf(current)
  const cancelled = current === 'cancelled' || current === 'refunded'
  return (
    <div className="flex items-center gap-0 mt-4">
      {TIMELINE.map((step, i) => {
        const done   = idx >= i && !cancelled
        const active = idx === i && !cancelled
        const label  = ORDER_STATUS[step]?.label || step
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: cancelled ? 'var(--border)' : done ? 'var(--success)' : 'var(--bg)',
                  border: `2px solid ${cancelled ? 'var(--border)' : done ? 'var(--success)' : 'var(--border)'}`,
                  color: done && !cancelled ? 'white' : 'var(--text-muted)',
                }}
              >
                {done && !cancelled ? '✓' : i + 1}
              </div>
              <p
                className="text-[9px] font-semibold mt-1 text-center"
                style={{ color: done && !cancelled ? 'var(--success)' : 'var(--text-muted)', lineHeight: 1.2 }}
              >
                {label}
              </p>
            </div>
            {i < TIMELINE.length - 1 && (
              <div
                className="flex-1 h-0.5 mb-4"
                style={{ background: done && idx > i && !cancelled ? 'var(--success)' : 'var(--border)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Order row ── */
function OrderRow({ order }) {
  const [open, setOpen] = useState(false)
  const status  = ORDER_STATUS[order.status]  || ORDER_STATUS.pending
  const payment = PAYMENT_STATUS[order.payment_status] || PAYMENT_STATUS.pending
  const Icon    = status.icon

  return (
    <div
      className="rounded-2xl overflow-hidden transition-shadow"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* Header row */}
      <button
        className="w-full text-left p-5 flex flex-wrap items-center gap-4"
        onClick={() => setOpen(o => !o)}
      >
        {/* Order icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: status.bg }}
        >
          <Icon size={17} style={{ color: status.color }} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-bold font-mono" style={{ color: 'var(--text)' }}>
              #{order.order_number}
            </span>
            {/* Status badge */}
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
            {/* Payment badge */}
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: payment.bg, color: payment.color }}
            >
              {payment.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>
              {new Date(order.created_at).toLocaleDateString('en-KE', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </span>
            <span>·</span>
            <span>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Total + chevron */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-base font-bold" style={{ color: 'var(--navy)' }}>
            {fmt(order.total_amount || order.total)}
          </span>
          <ChevronDown
            size={16}
            style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t" style={{ borderColor: 'var(--border)' }}>
          {/* Timeline */}
          <div className="px-5 pt-4 pb-2">
            <StatusTimeline current={order.status} />
          </div>

          {/* Items */}
          <div className="border-t" style={{ borderColor: 'var(--border)' }}>
            {(order.items || []).map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3 border-b last:border-0"
                style={{ borderColor: 'var(--border)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                >
                  {item.primary_image && (
                    <img src={getCldMini(item.primary_image)} alt="" className="w-full h-full object-contain p-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1" style={{ color: 'var(--text)' }}>
                    {item.product_name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} × {fmt(item.unit_price)}
                  </p>
                </div>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--text)' }}>
                  {fmt(item.subtotal || item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ background: 'var(--bg)' }}
          >
            <div className="text-sm">
              <span style={{ color: 'var(--text-muted)' }}>Total: </span>
              <span className="font-bold" style={{ color: 'var(--navy)' }}>
                {fmt(order.total_amount || order.total)}
              </span>
            </div>
            <Link
              to={`/order-confirmation/${order.order_number}`}
              className="btn-ghost text-xs gap-1.5 py-2"
            >
              <Eye size={13} /> View Details
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Orders() {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(s => s.auth)
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    getOrders()
      .then(({ data }) => setOrders(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const filters = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <>
      <Helmet><title>My Orders — Nixxon Technologies</title></Helmet>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all flex-shrink-0"
            style={{
              background: filter === f ? 'var(--navy)' : 'var(--card)',
              color: filter === f ? 'white' : 'var(--text-muted)',
              border: `1px solid ${filter === f ? 'var(--navy)' : 'var(--border)'}`,
            }}
          >
            {f === 'all' ? `All Orders (${orders.length})` : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton rounded-2xl h-24" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <ShoppingBag size={48} style={{ color: 'var(--border)', margin: '0 auto 16px' }} />
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {filter === 'all' ? 'Your orders will appear here once you place one.' : 'Try a different filter.'}
          </p>
          {filter === 'all' && (
            <Link to="/products" className="btn-primary">Start Shopping</Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => <OrderRow key={order.id} order={order} />)}
        </div>
      )}
    </>
  )
}