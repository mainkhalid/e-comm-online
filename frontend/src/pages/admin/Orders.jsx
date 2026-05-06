import { useState, useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'
import { adminGetOrders, adminUpdateOrder } from '../../api/services'
import toast from 'react-hot-toast'

const fmt = p => new Intl.NumberFormat('en-KE',{style:'currency',currency:'KES',minimumFractionDigits:0}).format(p)

const STATUS_COLORS = {
  pending:'#f59e0b', confirmed:'#3b82f6', processing:'#8b5cf6',
  shipped:'#06b6d4', delivered:'#10b981', cancelled:'#e8192c', refunded:'#6b7280',
}

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const load = () => {
    adminGetOrders().then(({data}) => setOrders(data.results || data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (orderNumber, newStatus) => {
    try {
      await adminUpdateOrder(orderNumber, { status: newStatus })
      toast.success('Status updated')
      load()
      if (selected?.order_number === orderNumber) setSelected(s => ({...s, status: newStatus}))
    } catch { toast.error('Update failed') }
  }

  return (
    <div className="space-y-5 fade-up">
      <div>
        <h2 className="font-serif text-2xl text-white mb-0.5">Orders</h2>
        <p className="text-[13px] text-[#6a6a7e]">{orders.length} total orders</p>
      </div>

      <div className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Order #','Date','Customer','Items','Total','Payment','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-[#5a5a6e]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_,i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    {[...Array(8)].map((_,j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-16 text-center text-[#5a5a6e] text-[14px]">
                  <ShoppingBag size={32} className="mx-auto mb-3 text-[#2a2a30]" />
                  No orders yet
                </td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-[13px] font-mono font-medium text-white">{order.order_number}</td>
                  <td className="px-4 py-3 text-[12px] text-[#6a6a7e]">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-[12px] text-[#9898a6]">{order.user_email || '—'}</td>
                  <td className="px-4 py-3 text-[12px] text-[#6a6a7e]">{order.items?.length || 0}</td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-white">{fmt(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${order.payment_status === 'paid' ? 'bg-green-400/10 text-green-400' : 'bg-amber-400/10 text-amber-400'}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select value={order.status}
                      onChange={e => updateStatus(order.order_number, e.target.value)}
                      className="text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border-0 outline-none cursor-pointer"
                      style={{background:`${STATUS_COLORS[order.status] || '#888'}18`, color: STATUS_COLORS[order.status] || '#888'}}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(order)}
                      className="text-[12px] text-[#6a6a7e] hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative surface p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl text-white">Order {selected.order_number}</h3>
              <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-full"
                style={{background:`${STATUS_COLORS[selected.status]}18`, color:STATUS_COLORS[selected.status]}}>
                {selected.status}
              </span>
            </div>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between py-2 border-b border-white/[0.06]">
                <span className="text-[#6a6a7e]">Date</span>
                <span className="text-white">{new Date(selected.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.06]">
                <span className="text-[#6a6a7e]">Payment</span>
                <span className={selected.payment_status === 'paid' ? 'text-green-400' : 'text-amber-400'}>{selected.payment_status}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.06]">
                <span className="text-[#6a6a7e]">Total</span>
                <span className="text-white font-semibold">{fmt(selected.total)}</span>
              </div>
              {selected.items?.length > 0 && (
                <div className="mt-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#5a5a6e] mb-2">Items</p>
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 text-[12px]">
                      <span className="text-[#9898a6]">{item.product_name} × {item.quantity}</span>
                      <span className="text-white">{fmt(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setSelected(null)} className="btn-ghost w-full mt-5">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
