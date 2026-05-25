import { Helmet } from 'react-helmet-async'
import { Shield } from 'lucide-react'

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

export default function Warranty() {
  return (
    <>
      <Helmet>
        <title>Warranty Information — Nixxon Technologies</title>
        <meta name="description" content="Warranty coverage and claim process for products purchased at Nixxon Technologies." />
      </Helmet>

      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-4 py-5">
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Home › Warranty Information</p>
            <div className="flex items-center gap-3">
              <Shield size={22} style={{ color: 'var(--success)' }} />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Warranty Information</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'New Products', value: '12 months', desc: 'Manufacturer warranty' },
              { label: 'ExUK / Refurbished', value: '3 months', desc: 'In-house warranty' },
              { label: 'Accessories', value: '6 months', desc: 'Manufacturer warranty' },
            ].map(c => (
              <div
                key={c.label}
                className="rounded-xl p-5 text-center"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--navy)' }}>{c.value}</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{c.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <Section title="1. Warranty Coverage">
              <p>Our warranty covers manufacturing defects and hardware failures under normal use conditions. This includes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Motherboard, processor, and memory failures</li>
                <li>Screen defects (dead pixels exceeding manufacturer threshold)</li>
                <li>Battery defects (not holding charge within the warranty period)</li>
                <li>Port and connector malfunctions</li>
              </ul>
            </Section>

            <Section title="2. What's NOT Covered">
              <ul className="list-disc pl-5 space-y-1">
                <li>Physical damage (drops, spills, cracks)</li>
                <li>Software issues, viruses, or OS corruption</li>
                <li>Unauthorised modifications or third-party repairs</li>
                <li>Normal wear and tear (cosmetic scratches, battery degradation beyond warranty period)</li>
                <li>Damage from power surges (always use a surge protector!)</li>
              </ul>
            </Section>

            <Section title="3. How to Make a Warranty Claim">
              <p>To initiate a warranty claim:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Contact us via WhatsApp (<strong style={{ color: 'var(--text)' }}>+254 705 125 957</strong>) or email
                  <strong style={{ color: 'var(--text)' }}> support@nixxontechnologies.co.ke</strong>
                </li>
                <li>Provide your <strong style={{ color: 'var(--text)' }}>order number</strong> and a description of the issue</li>
                <li>Attach photos or a short video demonstrating the defect</li>
                <li>Our team will review and respond within <strong style={{ color: 'var(--text)' }}>24 business hours</strong></li>
              </ol>
            </Section>

            <Section title="4. Repair vs. Replacement">
              <p>
                We will first attempt to repair the product. If repair is not feasible, we will offer a replacement of the same or equivalent model.
                Refunds are issued only if neither repair nor replacement is possible.
              </p>
            </Section>

            <Section title="5. Warranty Transfer">
              <p>
                Warranties are non-transferable and apply only to the original purchaser. Proof of purchase is required for all warranty claims.
              </p>
            </Section>

            <div
              className="mt-8 p-4 rounded-xl text-sm flex items-start gap-3"
              style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.15)' }}
            >
              <Shield size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ color: 'var(--text)' }}>Tip:</strong>{' '}
                <span style={{ color: 'var(--text-muted)' }}>
                  Keep your purchase receipt and original packaging for the duration of the warranty. This speeds up the claims process.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
