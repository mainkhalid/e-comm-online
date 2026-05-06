import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Tag, X, Truck, Shield, RotateCcw } from 'lucide-react'

const fmt = p => new Intl.NumberFormat('en-KE', {
  style: 'currency', currency: 'KES', minimumFractionDigits: 0,
}).format(p)

const FREE_SHIPPING_THRESHOLD = 5000

export default function CartSummary({ items, onCheckout, loading }) {
  const [coupon, setCoupon]         = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError]     = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [discount, setDiscount]     = useState(0)

  const subtotal    = items.reduce((sum, i) => sum + (i.unit_price * i.quantity), 0)
  const shipping    = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 300
  const totalAmount = subtotal - discount + shipping

  const remaining   = FREE_SHIPPING_THRESHOLD - subtotal
  const shippingPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return
    setCouponLoading(true)
    setCouponError('')
    try {
      // TODO: POST /api/coupons/validate/ { code: coupon }
      await new Promise(r => setTimeout(r, 700))
      // Simulate 10% discount for demo
      if (coupon.toUpperCase() === 'TECHZONE10') {
        setDiscount(Math.round(subtotal * 0.10))
        setCouponApplied(true)
      } else {
        setCouponError('Invalid or expired coupon code')
      }
    } finally { setCouponLoading(false) }
  }

  const removeCoupon = () => {
    setCoupon(''); setDiscount(0); setCouponApplied(false); setCouponError('')
  }

  return (
    <div
      className="rounded-2xl overflow-hidden sticky top-20"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text)' }}>
          Order Summary
        </h3>
      </div>

      <div className="p-5 space-y-5">
        {/* Free shipping progress bar */}
        {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
          <div
            className="rounded-xl p-3.5"
            style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.15)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Truck size={13} style={{ color: 'var(--success)' }} />
              <p className="text-xs font-semibold" style={{ color: 'var(--success)' }}>
                Add {fmt(remaining)} more for FREE delivery!
              </p>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${shippingPct}%`, background: 'var(--success)' }}
              />
            </div>
          </div>
        )}
        {subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
          <div
            className="rounded-xl p-3.5 flex items-center gap-2"
            style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.15)' }}
          >
            <Truck size={13} style={{ color: 'var(--success)' }} />
            <p className="text-xs font-semibold" style={{ color: 'var(--success)' }}>
              🎉 You've unlocked free delivery!
            </p>
          </div>
        )}

        {/* Price breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-muted)' }}>
              Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})
            </span>
            <span className="font-semibold" style={{ color: 'var(--text)' }}>{fmt(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--success)' }}>Discount (coupon)</span>
              <span className="font-semibold" style={{ color: 'var(--success)' }}>-{fmt(discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
            <span
              className="font-semibold"
              style={{ color: shipping === 0 ? 'var(--success)' : 'var(--text)' }}
            >
              {shipping === 0 ? 'FREE' : fmt(shipping)}
            </span>
          </div>
        </div>

        {/* Coupon code */}
        <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          {couponApplied ? (
            <div
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
              style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}
            >
              <div className="flex items-center gap-2">
                <Tag size={13} style={{ color: 'var(--success)' }} />
                <span className="text-xs font-bold" style={{ color: 'var(--success)' }}>
                  {coupon.toUpperCase()} — 10% off applied!
                </span>
              </div>
              <button onClick={removeCoupon}>
                <X size={14} style={{ color: 'var(--success)' }} />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    value={coupon}
                    onChange={e => { setCoupon(e.target.value); setCouponError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                    placeholder="Promo code"
                    className="input pl-9 text-sm"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={!coupon.trim() || couponLoading}
                  className="btn-navy px-4 py-2.5 text-sm disabled:opacity-50 flex-shrink-0"
                >
                  {couponLoading ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 20" />
                    </svg>
                  ) : 'Apply'}
                </button>
              </div>
              {couponError && (
                <p className="text-xs mt-1.5" style={{ color: 'var(--danger)' }}>{couponError}</p>
              )}
            </div>
          )}
        </div>

        {/* Total */}
        <div
          className="flex justify-between items-center pt-4 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="font-bold text-base" style={{ color: 'var(--text)' }}>Total</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>
            {fmt(totalAmount)}
          </span>
        </div>

        {/* Checkout CTA */}
        <button
          onClick={onCheckout}
          disabled={loading || items.length === 0}
          className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 20" />
              </svg>
              Processing…
            </span>
          ) : (
            <>
              Proceed to Checkout
              <ArrowRight size={16} />
            </>
          )}
        </button>

        <Link
          to="/products"
          className="block text-center text-sm font-semibold transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          ← Continue Shopping
        </Link>

        {/* Trust row */}
        <div
          className="pt-4 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex flex-col gap-2">
            {[
              { icon: Shield,    text: 'Secure checkout — SSL encrypted' },
              { icon: RotateCcw, text: '30-day hassle-free returns' },
              { icon: Truck,     text: 'Fast nationwide delivery' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Icon size={12} style={{ color: 'var(--orange)', flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>

          {/* Payment method badges */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {['M-Pesa', 'Visa', 'Mastercard', 'PayPal'].map(m => (
              <span
                key={m}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}