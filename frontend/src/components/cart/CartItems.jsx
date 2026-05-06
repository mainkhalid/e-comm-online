import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { getCldMini, safeImgUrl } from '../../utils/cloudinaryUtils'

const fmt = p => new Intl.NumberFormat('en-KE', {
  style: 'currency', currency: 'KES', minimumFractionDigits: 0,
}).format(p)

export default function CartItems({ items, onUpdateQuantity, onRemoveItem, loading }) {

  if (items.length === 0) {
    return (
      <div
        className="rounded-2xl p-14 text-center"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <ShoppingBag size={52} style={{ color: 'var(--border)', margin: '0 auto 16px' }} />
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          Your cart is empty
        </h3>
        <p className="text-sm mb-7" style={{ color: 'var(--text-muted)' }}>
          Browse our collection and add items you love
        </p>
        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* Desktop header */}
      <div
        className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 text-xs font-bold uppercase tracking-widest"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}
      >
        <div className="col-span-5">Product</div>
        <div className="col-span-2 text-center">Unit Price</div>
        <div className="col-span-2 text-center">Quantity</div>
        <div className="col-span-2 text-right">Subtotal</div>
        <div className="col-span-1" />
      </div>

      {/* Items */}
      <div>
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-5 py-5"
            style={{
              borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none',
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {/* Product info */}
            <Link
              to={`/products/${item.product_slug}`}
              className="col-span-1 md:col-span-5 flex items-center gap-4 group"
            >
              <div
                className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <img
                  src={getCldMini(item.primary_image) || safeImgUrl(item.primary_image)}
                  alt={item.product_name}
                  className="w-full h-full object-contain p-1.5"
                />
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold leading-snug line-clamp-2 mb-1 group-hover:text-orange-500 transition-colors"
                  style={{ color: 'var(--text)' }}
                >
                  {item.product_name}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  SKU: {item.product_slug?.split('-').slice(-1)[0]?.toUpperCase()}
                </p>
              </div>
            </Link>

            {/* Mobile price label */}
            <div
              className="md:hidden flex justify-between text-sm pb-1"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span style={{ color: 'var(--text-muted)' }}>Unit Price</span>
              <span className="font-semibold" style={{ color: 'var(--text)' }}>
                {fmt(item.unit_price)}
              </span>
            </div>

            {/* Desktop unit price */}
            <div className="hidden md:block md:col-span-2 text-center">
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {fmt(item.unit_price)}
              </span>
            </div>

            {/* Quantity stepper */}
            <div className="md:col-span-2 flex justify-center">
              <div
                className="flex items-center rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--border)' }}
              >
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={loading}
                  className="px-3 py-2 transition-colors hover:bg-slate-50 disabled:opacity-40"
                >
                  <Minus size={14} style={{ color: 'var(--text-muted)' }} />
                </button>
                <span
                  className="w-10 text-center text-sm font-bold"
                  style={{ color: 'var(--text)' }}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={loading}
                  className="px-3 py-2 transition-colors hover:bg-slate-50 disabled:opacity-40"
                >
                  <Plus size={14} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            </div>

            {/* Mobile subtotal label */}
            <div className="md:hidden flex justify-between text-sm">
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span className="font-bold" style={{ color: 'var(--text)' }}>
                {fmt(item.unit_price * item.quantity)}
              </span>
            </div>

            {/* Desktop subtotal */}
            <div className="hidden md:block md:col-span-2 text-right">
              <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                {fmt(item.unit_price * item.quantity)}
              </span>
            </div>

            {/* Remove button */}
            <div className="md:col-span-1 flex justify-end md:justify-center">
              <button
                onClick={() => onRemoveItem(item.id)}
                disabled={loading}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-50 disabled:opacity-40"
              >
                <Trash2 size={15} style={{ color: 'var(--danger)' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}