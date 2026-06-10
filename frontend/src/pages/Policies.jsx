import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Truck, RotateCcw } from 'lucide-react'

const TABS = [
  { id: 'returns', label: 'Return Policy', icon: RotateCcw },
  { id: 'shipping', label: 'Shipping Policy', icon: Truck },
]

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-bold mb-3" style={{ color: 'var(--text)' }}>{title}</h3>
      <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-muted)' }}>
        {children}
      </div>
    </div>
  )
}

function ReturnPolicy() {
  return (
    <>
      <Section title="1. Return Window">
        <p>
          All products may be returned within <strong style={{ color: 'var(--text)' }}>7 days</strong> of delivery, provided they are unused, in their original packaging, and accompanied by the original receipt.
        </p>
      </Section>
      <Section title="2. Eligible Products">
        <p>Returns are accepted for products that are:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Defective on arrival (DOA)</li>
          <li>Damaged during shipping</li>
          <li>Significantly different from the product description</li>
          <li>Unopened and in their original sealed packaging</li>
        </ul>
      </Section>
      <Section title="3. Non-Returnable Items">
        <ul className="list-disc pl-5 space-y-1">
          <li>Software licenses and digital download codes</li>
          <li>Opened consumables (ink cartridges, toner, cables)</li>
          <li>Custom/built-to-order products</li>
          <li>Products with physical damage caused after delivery</li>
        </ul>
      </Section>
      <Section title="4. How to Initiate a Return">
        <p>
          Contact our support team via WhatsApp at <strong style={{ color: 'var(--text)' }}>+254 722 363470</strong> or
          email <strong style={{ color: 'var(--text)' }}>support@nixxontechnologies.co.ke</strong> with:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your order number</li>
          <li>Photos of the product and packaging</li>
          <li>A brief description of the issue</li>
        </ul>
      </Section>
      <Section title="5. Refund Process">
        <p>
          Approved returns are refunded via the original payment method (M-Pesa reversal) within
          <strong style={{ color: 'var(--text)' }}> 3–5 business days</strong> after we receive and inspect the returned item.
        </p>
      </Section>
    </>
  )
}

function ShippingPolicy() {
  return (
    <>
      <Section title="1. Delivery Areas">
        <p>We deliver nationwide across Kenya. Major cities enjoy faster delivery times:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong style={{ color: 'var(--text)' }}>Nairobi CBD & Metropolitan:</strong> Same-day or next-day delivery</li>
          <li><strong style={{ color: 'var(--text)' }}>Major Towns</strong> (Mombasa, Kisumu, Nakuru, Eldoret): 2–3 business days</li>
          <li><strong style={{ color: 'var(--text)' }}>Other Counties:</strong> 3–7 business days</li>
        </ul>
      </Section>
      <Section title="2. Shipping Costs">
        <p>
          Orders above <strong style={{ color: 'var(--text)' }}>KSh 100,000</strong> qualify for <strong style={{ color: 'var(--success)' }}>FREE delivery</strong> within Nairobi.
          Orders below this threshold incur a flat delivery fee of KSh 300.
        </p>
        <p>Rates for upcountry deliveries are calculated at checkout based on location and package weight.</p>
      </Section>
      <Section title="3. Order Tracking">
        <p>
          Once your order is dispatched, you will receive an SMS and email with tracking information.
          You can also track your order from your account dashboard under "My Orders".
        </p>
      </Section>
      <Section title="4. Pickup Option">
        <p>
          Free self-collection is available at our Nairobi showroom:
          <strong style={{ color: 'var(--text)' }}> CBD, Moi Avenue, Nairobi.</strong>
          Orders are ready for pickup within 2 hours of placement during business hours.
        </p>
      </Section>
      <Section title="5. Delivery Hours">
        <p>Our delivery team operates <strong style={{ color: 'var(--text)' }}>Monday–Saturday, 8:00 AM – 6:00 PM.</strong> Sunday and holiday deliveries are not currently available.</p>
      </Section>
    </>
  )
}

export default function Policies() {
  const [tab, setTab] = useState('returns')

  return (
    <>
      <Helmet>
        <title>Return & Shipping Policy — Nixxon Technologies</title>
        <meta name="description" content="Nixxon Technologies return and shipping policies. Free delivery on orders over KSh 100,000." />
      </Helmet>

      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-4 py-5">
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Home › Policies</p>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Store Policies</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {TABS.map(t => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: tab === t.id ? 'var(--navy)' : 'var(--card)',
                    color: tab === t.id ? 'white' : 'var(--text-muted)',
                    border: `1px solid ${tab === t.id ? 'var(--navy)' : 'var(--border)'}`,
                  }}
                >
                  <Icon size={15} />
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Content */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {tab === 'returns' ? <ReturnPolicy /> : <ShippingPolicy />}

            <div
              className="mt-8 p-4 rounded-xl text-sm"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >
              <strong style={{ color: 'var(--text)' }}>Questions?</strong> Contact our team at{' '}
              <strong style={{ color: 'var(--orange)' }}>+254 722 363470</strong> (WhatsApp) or{' '}
              <strong style={{ color: 'var(--orange)' }}>support@nixxontechnologies.co.ke</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
