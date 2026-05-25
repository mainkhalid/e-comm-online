import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import {
  MapPin, CreditCard, CheckCircle2, Plus, ChevronLeft,
  ChevronRight, Smartphone, Edit2, Truck, Shield,
  Package, Loader2, Check, X,
} from 'lucide-react'
import {
  createOrder, getAddresses, createAddress,
  initiatePayment, checkPaymentStatus,
} from '../api/services'
import { fetchCart } from '../store/slices/cartSlice'
import { getCldMini } from '../utils/cloudinaryUtils'

const fmt = p => new Intl.NumberFormat('en-KE', {
  style: 'currency', currency: 'KES', minimumFractionDigits: 0,
}).format(p)

const KENYA_COUNTIES = [
  'Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Malindi',
  'Kitale','Garissa','Kakamega','Meru','Nyeri','Machakos','Kilifi',
  'Kisii','Uasin Gishu','Turkana','West Pokot','Samburu','Trans Nzoia',
  'Baringo','Laikipia','Nyandarua','Kirinyaga','Murang\'a','Kiambu',
  'Kajiado','Makueni','Kitui','Tana River','Lamu','Taita Taveta',
  'Kwale','Vihiga','Bungoma','Busia','Siaya','Homa Bay','Migori',
  'Kisii','Nyamira','Bomet','Kericho','Nandi','Elgeyo-Marakwet',
  'Baringo','Marsabit','Isiolo','Mandera','Wajir',
].sort()

/* ── Step indicator ────────────────────────────────── */
function StepBar({ current }) {
  const steps = [
    { n: 1, label: 'Address',  icon: MapPin },
    { n: 2, label: 'Review',   icon: Package },
    { n: 3, label: 'Payment',  icon: CreditCard },
  ]
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, idx) => {
        const Icon = step.icon
        const done    = current > step.n
        const active  = current === step.n
        return (
          <div key={step.n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: done ? 'var(--success)' : active ? 'var(--orange)' : 'var(--bg)',
                  border: `2px solid ${done ? 'var(--success)' : active ? 'var(--orange)' : 'var(--border)'}`,
                  color: done || active ? 'white' : 'var(--text-muted)',
                }}
              >
                {done ? <Check size={16} /> : <Icon size={15} />}
              </div>
              <span
                className="text-xs font-semibold mt-1.5"
                style={{ color: active ? 'var(--orange)' : done ? 'var(--success)' : 'var(--text-muted)' }}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className="w-16 sm:w-24 h-0.5 mx-2 mb-5 rounded transition-all"
                style={{ background: current > step.n ? 'var(--success)' : 'var(--border)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── M-Pesa polling UI ─────────────────────────────── */
function MpesaPoller({ orderNumber, phone, onSuccess, onFail, stkFailed, onRetryStk }) {
  const [status, setStatus]   = useState('pending') // pending | checking | success | failed
  const [attempts, setAttempts] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)
  const timerRef    = useRef(null)
  const MAX_ATTEMPTS = 12  // 60 seconds

  useEffect(() => {
    /* Elapsed counter */
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)

    /* Poll every 5s */
    intervalRef.current = setInterval(async () => {
      setAttempts(a => {
        const next = a + 1
        if (next >= MAX_ATTEMPTS) {
          clearInterval(intervalRef.current)
          setStatus('failed')
          onFail?.()
        }
        return next
      })
      try {
        const { data } = await checkPaymentStatus(orderNumber)
        if (data.status === 'completed' || data.payment_status === 'paid') {
          clearInterval(intervalRef.current)
          clearInterval(timerRef.current)
          setStatus('success')
          onSuccess?.()
        } else if (data.status === 'failed' || data.payment_status === 'failed') {
          clearInterval(intervalRef.current)
          clearInterval(timerRef.current)
          setStatus('failed')
          onFail?.()
        }
      } catch { /* network hiccup — keep polling */ }
    }, 5000)

    return () => {
      clearInterval(intervalRef.current)
      clearInterval(timerRef.current)
    }
  }, [orderNumber])

  return (
    <div className="text-center py-8">
      {status === 'pending' || status === 'checking' ? (
        <>
          {/* Animated phone icon */}
          <div className="relative inline-flex mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(22,163,74,0.10)' }}
            >
              <Smartphone size={36} style={{ color: '#16A34A' }} />
            </div>
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: 'rgba(22,163,74,0.15)' }}
            />
          </div>

          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Check your phone!
          </h3>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
            An M-Pesa prompt has been sent to
          </p>
          <p className="text-base font-bold mb-5" style={{ color: 'var(--text)' }}>
            {phone}
          </p>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            <Loader2 size={14} className="animate-spin" style={{ color: 'var(--orange)' }} />
            Checking payment… ({elapsed}s)
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mb-6">
            {[...Array(MAX_ATTEMPTS)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{
                  background: i < attempts ? 'var(--orange)' : 'var(--border)',
                }}
              />
            ))}
          </div>

          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Enter your M-Pesa PIN on your phone to complete payment.
            <br />Do not close this page.
          </p>

          {stkFailed && (
            <div className="mt-5 p-4 rounded-xl" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)' }}>
              <p className="text-xs mb-3" style={{ color: 'var(--danger)' }}>
                ⚠️ The M-Pesa prompt may not have been sent. You can retry below.
              </p>
              <button
                onClick={onRetryStk}
                className="btn-primary text-sm py-2 px-5"
                style={{ background: 'var(--danger)' }}
              >
                Retry STK Push
              </button>
            </div>
          )}
        </>
      ) : status === 'success' ? (
        <>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(22,163,74,0.12)' }}
          >
            <CheckCircle2 size={44} style={{ color: 'var(--success)' }} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--success)' }}>Payment Successful!</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Redirecting you to your order…</p>
        </>
      ) : (
        <>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(220,38,38,0.10)' }}
          >
            <X size={44} style={{ color: 'var(--danger)' }} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--danger)' }}>Payment Timed Out</h3>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            Your order was created. You can complete payment from your order history.
          </p>
          <button onClick={onFail} className="btn-primary">Go to My Orders</button>
        </>
      )}
    </div>
  )
}

/* ─── Main Checkout component ──────────────────────── */
export default function Checkout() {
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const { items, total } = useSelector(s => s.cart)
  const { isAuthenticated, user } = useSelector(s => s.auth)

  const [step, setStep]             = useState(1)
  const [addresses, setAddresses]   = useState([])
  const [selectedAddr, setSelectedAddr] = useState(null)
  const [loading, setLoading]       = useState(false)
  const [orderNumber, setOrderNumber] = useState(null)
  const [payPhone, setPayPhone]     = useState('')
  const [notes, setNotes]           = useState('')
  const [showAddrForm, setShowAddrForm] = useState(false)
  const [editAddr, setEditAddr]     = useState(null)
  const [stkFailed, setStkFailed]   = useState(false)

  const [addrForm, setAddrForm] = useState({
    full_name: '', phone: '', street: '', city: '',
    county: '', address_type: 'shipping', is_default: false,
  })

  useEffect(() => {
    if (!isAuthenticated) { toast.error('Sign in first'); navigate('/login'); return }
    getAddresses()
      .then(({ data }) => {
        const addrs = data.results || data
        setAddresses(addrs)
        const def = addrs.find(a => a.is_default) || addrs[0]
        if (def) {
          setSelectedAddr(def.id)
          setPayPhone(user?.phone || def.phone || '')
        }
      })
      .catch(() => {})
  }, [isAuthenticated])

  if (!isAuthenticated) return null

  /* Empty cart guard */
  if (items.length === 0 && step < 3) {
    return (
      <>
        <Helmet><title>Checkout — TechZone</title></Helmet>
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
          <div className="text-center">
            <p className="text-lg font-semibold mb-5" style={{ color: 'var(--text)' }}>Your cart is empty</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        </div>
      </>
    )
  }

  /* ── Handlers ── */
  const handleSaveAddress = async (e) => {
    e.preventDefault()
    try {
      const { data } = editAddr
        ? await import('../api/services').then(m => m.updateAddress(editAddr.id, addrForm))
        : await createAddress(addrForm)
      const isEdit = !!editAddr
      setAddresses(prev => isEdit
        ? prev.map(a => a.id === data.id ? data : a)
        : [...prev, data])
      setSelectedAddr(data.id)
      setPayPhone(data.phone || payPhone)
      setShowAddrForm(false)
      setEditAddr(null)
      setAddrForm({ full_name: '', phone: '', street: '', city: '', county: '', address_type: 'shipping', is_default: false })
      toast.success(isEdit ? 'Address updated' : 'Address saved')
    } catch { toast.error('Could not save address') }
  }

  const openEditAddr = (addr) => {
    setEditAddr(addr)
    setAddrForm({ full_name: addr.full_name, phone: addr.phone, street: addr.street, city: addr.city, county: addr.county, address_type: addr.address_type, is_default: addr.is_default })
    setShowAddrForm(true)
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddr) { toast.error('Select a shipping address'); return }
    if (!payPhone.trim()) { toast.error('Enter M-Pesa phone number'); return }
    setLoading(true)
    try {
      const { data: order } = await createOrder({ shipping_address: selectedAddr, notes })
      setOrderNumber(order.order_number)
      // Initiate STK push
      try {
        await initiatePayment({ order_number: order.order_number, phone_number: payPhone })
        setStkFailed(false)
      } catch (stkErr) {
        setStkFailed(true)
        toast.error('M-Pesa prompt failed to send. You can retry from the payment screen.')
      }
      dispatch(fetchCart())
      setStep(3) // show polling UI
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to place order')
    } finally { setLoading(false) }
  }

  const handlePaySuccess = () => {
    navigate(`/order-confirmation/${orderNumber}`)
  }
  const handlePayFail = () => {
    navigate('/account/orders')
  }

  const selectedAddrObj = addresses.find(a => a.id === selectedAddr)

  /* ── Render ── */
  return (
    <>
      <Helmet><title>Checkout — Nixxon Technologies</title></Helmet>

      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        {/* Topbar */}
        <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              to="/cart"
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <ChevronLeft size={16} />
              Back to cart
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--navy)' }}>TZ</div>
              <span className="font-bold text-sm hidden sm:block" style={{ color: 'var(--navy)' }}>Tech<span style={{ color: 'var(--orange)' }}>Zone</span></span>
            </Link>
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Shield size={13} style={{ color: 'var(--success)' }} />
              Secure checkout
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Step indicator */}
          <StepBar current={step} />

          {/* ────────── STEP 1: ADDRESS ────────── */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left */}
              <div className="lg:col-span-2 space-y-5">
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} style={{ color: 'var(--orange)' }} />
                      <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Shipping Address</h2>
                    </div>
                    <button
                      onClick={() => { setShowAddrForm(true); setEditAddr(null); setAddrForm({ full_name:'', phone:'', street:'', city:'', county:'', address_type:'shipping', is_default:false }) }}
                      className="btn-ghost text-xs gap-1 py-1.5"
                    >
                      <Plus size={13} />
                      Add New
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    {addresses.length === 0 && !showAddrForm ? (
                      <div className="text-center py-8">
                        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>No saved addresses yet</p>
                        <button
                          onClick={() => setShowAddrForm(true)}
                          className="btn-primary text-sm"
                        >
                          <Plus size={14} />
                          Add Address
                        </button>
                      </div>
                    ) : (
                      addresses.map(addr => (
                        <label
                          key={addr.id}
                          className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all relative"
                          style={{
                            border: `2px solid ${selectedAddr === addr.id ? 'var(--orange)' : 'var(--border)'}`,
                            background: selectedAddr === addr.id ? 'rgba(255,107,43,0.03)' : 'var(--card)',
                          }}
                        >
                          {/* Radio */}
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ borderColor: selectedAddr === addr.id ? 'var(--orange)' : 'var(--border)' }}
                          >
                            {selectedAddr === addr.id && (
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--orange)' }} />
                            )}
                          </div>
                          <input
                            type="radio" className="sr-only"
                            checked={selectedAddr === addr.id}
                            onChange={() => { setSelectedAddr(addr.id); setPayPhone(addr.phone || payPhone) }}
                          />

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{addr.full_name}</p>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                              {addr.street}, {addr.city}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{addr.county} County</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{addr.phone}</p>
                            {addr.is_default && (
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                                style={{ background: 'rgba(255,107,43,0.10)', color: 'var(--orange)' }}
                              >
                                Default
                              </span>
                            )}
                          </div>

                          <button
                            onClick={e => { e.preventDefault(); openEditAddr(addr) }}
                            className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100"
                          >
                            <Edit2 size={12} style={{ color: 'var(--text-muted)' }} />
                          </button>
                        </label>
                      ))
                    )}

                    {/* Inline address form */}
                    {showAddrForm && (
                      <form
                        onSubmit={handleSaveAddress}
                        className="mt-2 p-4 rounded-xl space-y-3"
                        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                      >
                        <h4 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                          {editAddr ? 'Edit Address' : 'New Address'}
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <input required placeholder="Full Name *" value={addrForm.full_name}
                            onChange={e => setAddrForm({ ...addrForm, full_name: e.target.value })} className="input text-sm" />
                          <input required placeholder="Phone *" value={addrForm.phone}
                            onChange={e => setAddrForm({ ...addrForm, phone: e.target.value })} className="input text-sm" />
                        </div>
                        <input required placeholder="Street Address *" value={addrForm.street}
                          onChange={e => setAddrForm({ ...addrForm, street: e.target.value })} className="input text-sm w-full" />
                        <div className="grid grid-cols-2 gap-3">
                          <input required placeholder="City / Town *" value={addrForm.city}
                            onChange={e => setAddrForm({ ...addrForm, city: e.target.value })} className="input text-sm" />
                          <select required value={addrForm.county}
                            onChange={e => setAddrForm({ ...addrForm, county: e.target.value })} className="input text-sm">
                            <option value="">County *</option>
                            {KENYA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={addrForm.is_default}
                            onChange={e => setAddrForm({ ...addrForm, is_default: e.target.checked })}
                            className="rounded" />
                          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Set as default address</span>
                        </label>
                        <div className="flex gap-2 pt-1">
                          <button type="submit" className="btn-primary text-sm py-2">Save Address</button>
                          <button type="button" onClick={() => { setShowAddrForm(false); setEditAddr(null) }}
                            className="btn-outline text-sm py-2">Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Order Notes (Optional)</h3>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Special delivery instructions, landmark, etc."
                    className="input w-full resize-none text-sm"
                  />
                </div>

                {/* Next */}
                <button
                  disabled={!selectedAddr || addresses.length === 0}
                  onClick={() => setStep(2)}
                  className="btn-primary w-full justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Review
                  <ChevronRight size={17} />
                </button>
              </div>

              {/* Right: mini order summary */}
              <MiniOrderSummary items={items} total={total} />
            </div>
          )}

          {/* ────────── STEP 2: REVIEW ────────── */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">

                {/* Address preview */}
                <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={15} style={{ color: 'var(--orange)' }} />
                      <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Delivering to</h3>
                    </div>
                    <button onClick={() => setStep(1)} className="text-xs font-semibold" style={{ color: 'var(--orange)' }}>
                      Change
                    </button>
                  </div>
                  {selectedAddrObj && (
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text)' }}>
                        {selectedAddrObj.full_name}
                      </p>
                      <p>{selectedAddrObj.street}, {selectedAddrObj.city}, {selectedAddrObj.county}</p>
                      <p>{selectedAddrObj.phone}</p>
                    </div>
                  )}
                </div>

                {/* Items preview */}
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                    <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
                      <Package size={15} style={{ color: 'var(--orange)' }} />
                      Order Items ({items.length})
                    </h3>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {items.map(item => (
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
                          <p className="text-sm font-medium line-clamp-1" style={{ color: 'var(--text)' }}>
                            {item.product_name}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            Qty: {item.quantity} × {fmt(item.unit_price)}
                          </p>
                        </div>
                        <span className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--text)' }}>
                          {fmt(item.unit_price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment phone */}
                <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Smartphone size={15} style={{ color: 'var(--orange)' }} />
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>M-Pesa Phone Number</h3>
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    Enter the Safaricom number to receive the STK push prompt
                  </p>
                  <input
                    value={payPhone}
                    onChange={e => setPayPhone(e.target.value)}
                    placeholder="e.g. 0712 345 678"
                    className="input w-full text-sm"
                  />
                  <div
                    className="flex items-center gap-2 mt-3 p-3 rounded-xl text-xs"
                    style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.15)', color: 'var(--success)' }}
                  >
                    <Shield size={12} />
                    Your payment is secured and encrypted
                  </div>
                </div>

                {/* Place order */}
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline py-3.5 px-5">
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || !payPhone.trim()}
                    className="btn-primary flex-1 justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Placing Order…
                      </span>
                    ) : (
                      <>
                        Place Order — {fmt(total)}
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <MiniOrderSummary items={items} total={total} />
            </div>
          )}

          {/* ────────── STEP 3: M-PESA POLLING ────────── */}
          {step === 3 && orderNumber && (
            <div className="max-w-md mx-auto">
              <div className="rounded-2xl p-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <MpesaPoller
                  orderNumber={orderNumber}
                  phone={payPhone}
                  onSuccess={handlePaySuccess}
                  onFail={handlePayFail}
                  stkFailed={stkFailed}
                  onRetryStk={async () => {
                    try {
                      await initiatePayment({ order_number: orderNumber, phone_number: payPhone })
                      setStkFailed(false)
                      toast.success('M-Pesa prompt sent! Check your phone.')
                    } catch {
                      toast.error('Retry failed. Please try again or pay from your orders page.')
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/* ── Mini order summary sidebar ── */
function MiniOrderSummary({ items, total }) {
  const fmt = p => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(p)
  const shipping = total >= 10000 ? 0 : 300

  return (
    <div
      className="rounded-2xl overflow-hidden sticky top-20 h-fit"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
        <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
          Order Summary
        </h3>
      </div>
      <div className="p-5">
        <div className="space-y-3 mb-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          {items.slice(0, 4).map(item => (
            <div key={item.id} className="flex justify-between text-xs gap-3">
              <span className="line-clamp-1 flex-1" style={{ color: 'var(--text-muted)' }}>
                {item.product_name} × {item.quantity}
              </span>
              <span className="font-semibold flex-shrink-0" style={{ color: 'var(--text)' }}>
                {fmt(item.unit_price * item.quantity)}
              </span>
            </div>
          ))}
          {items.length > 4 && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>+{items.length - 4} more items</p>
          )}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
            <span style={{ color: 'var(--text)' }}>{fmt(total)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
            <span style={{ color: shipping === 0 ? 'var(--success)' : 'var(--text)' }}>
              {shipping === 0 ? 'FREE' : fmt(shipping)}
            </span>
          </div>
        </div>
        <div className="flex justify-between font-bold text-base mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <span style={{ color: 'var(--text)' }}>Total</span>
          <span style={{ color: 'var(--navy)' }}>{fmt(total + shipping)}</span>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <Truck size={12} style={{ color: 'var(--success)' }} />
          {total >= 10000 ? 'Free delivery included!' : `KSh ${(10000 - total).toLocaleString()} away from free delivery`}
        </div>
      </div>
    </div>
  )
}