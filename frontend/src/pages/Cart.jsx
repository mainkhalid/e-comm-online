import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchCart, removeItem, updateItem } from '../store/slices/cartSlice'
import CartItems from '../components/cart/CartItems'
import CartSummary from '../components/cart/CartSummary'

export default function Cart() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { items, loading } = useSelector(s => s.cart)
  const { isAuthenticated } = useSelector(s => s.auth)

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart())
  }, [isAuthenticated, dispatch])

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) { handleRemoveItem(itemId); return }
    try {
      await dispatch(updateItem({ itemId, quantity })).unwrap()
    } catch { toast.error('Could not update quantity') }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeItem(itemId)).unwrap()
      toast.success('Item removed from cart')
    } catch { toast.error('Could not remove item') }
  }

  const handleCheckout = () => {
    if (items.length === 0) { toast.error('Your cart is empty'); return }
    navigate('/checkout')
  }

  /* Not signed in */
  if (!isAuthenticated) {
    return (
      <>
        <Helmet><title>Cart — Nixxon Technologies</title></Helmet>
        <div
          className="min-h-screen flex items-center justify-center px-4"
          style={{ background: 'var(--bg)' }}
        >
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(255,107,43,0.08)' }}
            >
              <ShoppingCart size={36} style={{ color: 'var(--orange)' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
              Sign in to view your cart
            </h2>
            <p className="text-sm mb-7" style={{ color: 'var(--text-muted)' }}>
              Your saved items are waiting for you
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/login" className="btn-primary">Sign In</Link>
              <Link to="/products" className="btn-outline">Browse Products</Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet><title>{`Shopping Cart (${items.length}) — TechZone`}</title></Helmet>

      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

        {/* Header bar */}
        <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 py-5">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                  Shopping Cart
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <Link
                to="/products"
                className="text-sm font-semibold hidden sm:block"
                style={{ color: 'var(--navy)' }}
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Items — takes 2/3 */}
            <div className="lg:col-span-2">
              <CartItems
                items={items}
                loading={loading}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>

            {/* Summary — sticky sidebar */}
            <div>
              <CartSummary
                items={items}
                onCheckout={handleCheckout}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}