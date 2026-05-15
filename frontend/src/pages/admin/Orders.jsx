import { useState, useEffect } from 'react'
import {
  Search, ChevronDown, X, Package,
  MapPin, Phone, CreditCard, Truck,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { adminGetOrders, adminUpdateOrder } from '../../api/services'
import { getCldMini } from '../../utils/cloudinaryUtils'

const fmt = p => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(p)

const ORDER_STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled']
const PAYMENT_STATUSES = ['pending','completed','failed','refunded']

const STATUS_STYLE = {
  pending:    { color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  confirmed:  { color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
  processing: { color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  shipped:    { color: '#0891B2', bg: 'rgba(8,145,178,0.08)' },
  delivered:  { color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
  cancelled:  { color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  refunded:   { color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
  completed:  { color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
  failed:     { color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
}

function Badge({ value }) {
  const s = STATUS_STYLE[value] || { color: 'var(--text-muted)', bg: 'var(--bg)' }
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
      style={{ background: s.bg, color: s.color }}>{value}</span>
  )
}

/* ── Status selector dropdown ── */
function StatusSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const s = STATUS_STYLE[value] || {}
  return (
    <div className="relative">
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
        className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
        style={{ background: s.bg || 'var(--bg)', color: s.color || 'var(--text-muted)' }}
      >
        <span className="capitalize">{value}</span>
        <ChevronDown size={9} />
      </button>
      {open && (
        <div
          className="absolute top-full mt-1 left-0 w-36 rounded-xl overflow-hidden shadow-card-hover z-30 border"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          onClick={e => e.stopPropagation()}
        >
          {options.map(o => {
            const st = STATUS_STYLE[o] || {}
            return (
              <button
                key={o}
                onClick={() => { onChange(o); setOpen(false) }}
                className="w-full text-left px-3 py-2 text-xs font-medium capitalize transition-colors hover:bg-slate-50 flex items-center gap-2"
                style={{ color: o === value ? st.color : 'var(--text-muted)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: st.color || 'var(--border)' }} />
                {o}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Order detail side panel ── */
function OrderPanel({ order, onClose, onStatusChange }) {
  const addr = order.shipping_address_detail || {}

  return (
    <div className="fixed inset-0 z-40 flex justify-end"
      style={{ background: 'rgba(15,23,42,0.50)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}>
      <div
        className="w-full max-w-md h-full overflow-y-auto shadow-2xl animate-slide-down"
        style={{ background: 'var(--card)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10"
          style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Order</p>
            <h3 className="text-sm font-bold font-mono" style={{ color: 'var(--text)' }}>#{order.order_number}</h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={17} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Status controls */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Order Status
              </p>
              <StatusSelect
                value={order.status}
                options={ORDER_STATUSES}
                onChange={s => onStatusChange(order.order_number, { status: s })}
              />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Payment
              </p>
              <StatusSelect
                value={order.payment_status}
                options={PAYMENT_STATUSES}
                onChange={s => onStatusChange(order.order_number, { payment_status: s })}
              />
            </div>
          </div>

          {/* Customer */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Customer
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: 'var(--navy)' }}>
                {(order.customer_name?.[0] || 'U').toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{order.customer_name || '—'}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{order.user_email || '—'}</p>
              </div>
            </div>
          </div>

          {/* Delivery address */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Delivery Address
            </p>
            <div className="p-3.5 rounded-xl space-y-1" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{addr.full_name || '—'}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{addr.street}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{addr.city}, {addr.county}</p>
              {addr.phone && (
                <div className="flex items-center gap-1.5 text-xs pt-1" style={{ color: 'var(--text-muted)' }}>
                  <Phone size={11} />{addr.phone}
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Items ({order.items?.length || 0})
            </p>
            <div className="space-y-2">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    {item.primary_image && <img src={getCldMini(item.primary_image)} alt="" className="w-full h-full object-contain p-0.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold line-clamp-1" style={{ color: 'var(--text)' }}>{item.product_name}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity} × {fmt(item.unit_price)}</p>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--text)' }}>
                    {fmt(item.subtotal || item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span style={{ color: 'var(--text)' }}>{fmt(order.subtotal || order.total_amount)}</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span style={{ color: 'var(--success)' }}>FREE</span></div>
              <div className="flex justify-between font-bold pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <span style={{ color: 'var(--text)' }}>Total</span>
                <span style={{ color: 'var(--navy)' }}>{fmt(order.total_amount || order.total)}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="p-3 rounded-xl text-xs" style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}>
              <strong>Notes:</strong> {order.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Main orders page ──────────────────────────── */
export default function AdminOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [page, setPage]       = useState(1)
  const [count, setCount]     = useState(0)

  const load = () => {
    setLoading(true)
    const params = { page, page_size: 20 }
    if (search) params.search = search
    if (statusFilter) params.status = statusFilter
    adminGetOrders(params)
      .then(({ data }) => { setOrders(data.results || data); setCount(data.count || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, statusFilter])

  const handleStatusChange = async (orderNumber, update) => {
    try {
      const { data } = await adminUpdateOrder(orderNumber, update)
      setOrders(prev => prev.map(o => o.order_number === orderNumber ? { ...o, ...update } : o))
      if (selected?.order_number === orderNumber) setSelected(s => ({ ...s, ...update }))
      toast.success('Order updated')
    } catch { toast.error('Update failed') }
  }

  const PAGES = Math.ceil(count / 20)

  return (
    <div className="space-y-5 fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Orders</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{count} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl p-4 flex flex-wrap gap-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <form onSubmit={e => { e.preventDefault(); setPage(1); load() }} className="flex-1 min-w-0 relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search order #, customer…" className="input pl-9 w-full text-sm" />
        </form>
        <div className="flex gap-2 flex-wrap">
          {[{ v:'', label:'All' }, ...ORDER_STATUSES.map(s => ({ v:s, label: s.charAt(0).toUpperCase()+s.slice(1) }))].map(({ v, label }) => (
            <button key={v} onClick={() => { setStatusFilter(v); setPage(1) }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: statusFilter === v ? 'var(--navy)' : 'var(--bg)',
                color: statusFilter === v ? 'white' : 'var(--text-muted)',
                border: `1px solid ${statusFilter === v ? 'var(--navy)' : 'var(--border)'}`,
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Order #','Date','Customer','Items','Total','Status','Payment','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="skeleton h-4 rounded" style={{ width: j === 2 ? '100px' : '60px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-14 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  No orders found
                </td></tr>
              ) : orders.map(order => (
                <tr
                  key={order.id}
                  className="cursor-pointer"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                  onClick={() => setSelected(order)}
                >
                  <td className="px-4 py-3.5 text-xs font-bold font-mono" style={{ color: 'var(--orange)' }}>
                    #{order.order_number}
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(order.created_at).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' })}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{order.customer_name || '—'}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{order.user_email || ''}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                    {order.items?.length || 0}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    {fmt(order.total_amount || order.total)}
                  </td>
                  <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                    <StatusSelect value={order.status} options={ORDER_STATUSES}
                      onChange={s => handleStatusChange(order.order_number, { status: s })} />
                  </td>
                  <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                    <StatusSelect value={order.payment_status} options={PAYMENT_STATUSES}
                      onChange={s => handleStatusChange(order.order_number, { payment_status: s })} />
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(order) }}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors hover:bg-slate-100"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {PAGES > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Page {page} of {PAGES}</p>
            <div className="flex gap-2">
              <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="btn-outline text-xs py-1.5 px-3 disabled:opacity-40">← Prev</button>
              <button disabled={page===PAGES} onClick={() => setPage(p=>p+1)} className="btn-outline text-xs py-1.5 px-3 disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <OrderPanel
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}