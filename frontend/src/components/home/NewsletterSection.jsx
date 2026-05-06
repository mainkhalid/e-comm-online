import { useState } from 'react'
import { Send, Mail, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewsletterSection() {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      // TODO: POST /api/newsletter/subscribe/
      await new Promise(r => setTimeout(r, 800))
      setSubscribed(true)
      toast.success('You\'re subscribed! 🎉')
      setEmail('')
    } catch {
      toast.error('Something went wrong, please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ background: 'var(--navy)' }} className="py-14 px-4">
      <div className="max-w-3xl mx-auto text-center">

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(255,107,43,0.15)', border: '1px solid rgba(255,107,43,0.25)' }}
        >
          <Mail size={24} style={{ color: 'var(--orange)' }} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Deals straight to your inbox
        </h2>
        <p className="mb-8 max-w-md mx-auto text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Get exclusive offers, new arrivals, and tech tips — no spam, unsubscribe any time.
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center gap-2 text-white font-semibold">
            <CheckCircle2 size={22} style={{ color: 'var(--orange)' }} />
            You're on the list! We'll be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'white',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-shrink-0 justify-center py-3 px-6 rounded-xl disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 20" />
                  </svg>
                  Subscribing…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={15} />
                  Subscribe
                </span>
              )}
            </button>
          </form>
        )}

        {/* Trust micro-copy */}
        <div className="flex items-center justify-center gap-6 mt-8 flex-wrap" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>
          <span>✓ No spam ever</span>
          <span>✓ Unsubscribe any time</span>
          <span>✓ Exclusive subscriber deals</span>
        </div>
      </div>
    </section>
  )
}