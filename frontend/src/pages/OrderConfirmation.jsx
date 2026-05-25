import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  CheckCircle2, Package, Truck, Home, Phone,
  ChevronRight, Download, Share2, ArrowRight,
  MapPin, Clock, CreditCard,
} from 'lucide-react'
import { getOrder } from '../api/services'
import { getCldMini } from '../utils/cloudinaryUtils'

const fmt = p => new Intl.NumberFormat('en-KE', {
  style: 'currency', currency: 'KES', minimumFractionDigits: 0,
}).format(p)

const ORDER_STEPS = [
  { key: 'placed',     label: 'Order Placed',    icon: CheckCircle2, done: true },
  { key: 'confirmed',  label: 'Confirmed',        icon: Package,      done: true },
  { key: 'processing', label: 'Processing',       icon: Clock,        done: false },
  { key: 'shipped',    label: 'Shipped',          icon: Truck,        done: false },
  { key: 'delivered',  label: 'Delivered',        icon: Home,         done: false },
]

/* ── Timeline step ── */
function TimelineStep({ step, isLast }) {
  const Icon = step.icon
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{
          background: step.done ? 'var(--success)' : 'var(--bg)',
          border: `2px solid ${step.done ? 'var(--success)' : 'var(--border)'}`,
        }}
      >
        <Icon size={16} style={{ color: step.done ? 'white' : 'var(--text-muted)' }} />
      </div>
      <p
        className="text-xs font-semibold mt-2 text-center"
        style={{ color: step.done ? 'var(--success)' : 'var(--text-muted)' }}
      >
        {step.label}
      </p>
      {!isLast && (
        <div
          className="absolute top-5 left-10 right-0"
          style={{ height: '2px', background: step.done ? 'var(--success)' : 'var(--border)' }}
        />
      )}
    </div>
  )
}

export default function OrderConfirmation() {
  const { orderNumber } = useParams()
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrder(orderNumber)
      .then(({ data }) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [orderNumber])

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    toast?.success?.('Link copied!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="space-y-4 w-full max-w-2xl px-4">
          <div className="skeleton h-40 rounded-2xl" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  /* Fallback if order fetch failed */
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <CheckCircle2 size={56} style={{ color: 'var(--success)', margin: '0 auto 16px' }} />
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Order Placed!</h1>
          <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Order #{orderNumber}</p>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            You'll receive a confirmation SMS shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/account/orders" className="btn-primary">View My Orders</Link>
            <Link to="/" className="btn-outline">Back to Home</Link>
          </div>
        </div>
      </div>
    )
  }

  const addr = order.shipping_address_detail || {}
  const payStatus = order.payment_status || 'pending'

  return (
    <>
      <Helmet>
        <title>Order Confirmed #{orderNumber} — Nixxon Technologies</title>
      </Helmet>

      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

        {/* ── Success banner ── */}
        <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1E3A8A 100%)' }}>
          <div className="max-w-3xl mx-auto px-4 py-12 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(22,163,74,0.20)' }}
            >
              <CheckCircle2 size={44} style={{ color: '#4ADE80' }} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Order Confirmed! 🎉
            </h1>
            <p className="text-base mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Thank you for shopping with TechZone
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.20)' }}
            >
              Order #{orderNumber}
            </div>

            {/* Payment status badge */}
            <div className="flex justify-center mt-4">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: payStatus === 'completed'
                    ? 'rgba(74,222,128,0.15)'
                    : 'rgba(251,191,36,0.15)',
                  color: payStatus === 'completed' ? '#4ADE80' : '#FBBF24',
                  border: `1px solid ${payStatus === 'completed' ? 'rgba(74,222,128,0.3)' : 'rgba(251,191,36,0.3)'}`,
                }}
              >
                <CreditCard size={11} />
                Payment: {payStatus === 'completed' ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

          {/* ── Order timeline ── */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h2 className="text-sm font-bold mb-6" style={{ color: 'var(--text)' }}>
              Order Status
            </h2>
            <div className="flex justify-between items-start relative">
              {/* Connecting line */}
              <div
                className="absolute top-5 left-5 right-5 h-0.5"
                style={{ background: 'var(--border)' }}
              />
              {ORDER_STEPS.map((step, i) => (
                <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: step.done ? 'var(--success)' : 'var(--card)',
                      border: `2px solid ${step.done ? 'var(--success)' : 'var(--border)'}`,
                    }}
                  >
                    <step.icon size={15} style={{ color: step.done ? 'white' : 'var(--text-muted)' }} />
                  </div>
                  <p
                    className="text-[10px] font-semibold mt-2 text-center leading-tight"
                    style={{ color: step.done ? 'var(--success)' : 'var(--text-muted)' }}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Order items ── */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                Items Ordered ({order.items?.length || 0})
              </h2>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {(order.items || []).map(item => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div
                    className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                  >
                    {item.primary_image && (
                      <img src={getCldMini(item.primary_image)} alt="" className="w-full h-full object-contain p-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text)' }}>
                      {item.product_name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Qty: {item.quantity} × {fmt(item.unit_price)}
                    </p>
                  </div>
                  <span className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--text)' }}>
                    {fmt(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-5 py-4 border-t space-y-2" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span style={{ color: 'var(--text)' }}>{fmt(order.subtotal || order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span style={{ color: 'var(--success)' }}>FREE</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <span style={{ color: 'var(--text)' }}>Total Paid</span>
                <span style={{ color: 'var(--navy)' }}>{fmt(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* ── Delivery details ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} style={{ color: 'var(--orange)' }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Delivering To</h3>
              </div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
                {addr.full_name || order.customer_name}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {addr.street}, {addr.city}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {addr.county} County
              </p>
              {addr.phone && (
                <div className="flex items-center gap-1.5 mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Phone size={12} />
                  {addr.phone}
                </div>
              )}
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Truck size={14} style={{ color: 'var(--orange)' }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Delivery Info</h3>
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--success)' }}>
                Estimated: 2–4 business days
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                You'll receive an SMS with tracking details once your order is shipped.
              </p>
              {order.notes && (
                <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <strong>Notes:</strong> {order.notes}
                </div>
              )}
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/account/orders"
              className="btn-primary flex-1 justify-center py-3.5"
            >
              <Package size={17} />
              Track My Order
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/products"
              className="btn-outline flex-1 justify-center py-3.5"
            >
              Continue Shopping
            </Link>
          </div>

          {/* ── Support note ── */}
          <div
            className="rounded-xl p-4 text-center text-sm"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            Need help? WhatsApp us at{' '}
            <a
              href="https://wa.me/254705125957"
              className="font-semibold"
              style={{ color: 'var(--orange)' }}
            >
              +254 705 125 957
            </a>{' '}
            or email{' '}
            <a href="mailto:hello@techzone.co.ke" className="font-semibold" style={{ color: 'var(--orange)' }}>
              hello@techzone.co.ke
            </a>
          </div>
        </div>
      </div>
    </>
  )
}