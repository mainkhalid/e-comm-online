import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react'

const CONTACT_INFO = [
  { icon: MapPin, label: 'Visit Us', value: 'CBD, Moi Avenue, Nairobi, Kenya', href: null },
  { icon: Phone, label: 'Call Us', value: '+254 705 125 957', href: 'tel:+254705125957' },
  { icon: Mail, label: 'Email Us', value: 'hello@nixxontechnologies.co.ke', href: 'mailto:hello@nixxontechnologies.co.ke' },
  { icon: Clock, label: 'Working Hours', value: 'Mon–Sat: 8:00 AM – 6:00 PM', href: null },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      toast.success('Message sent! We\'ll get back to you within 24 hours.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 1200)
  }

  return (
    <>
      <Helmet>
        <title>Contact Us — Nixxon Technologies</title>
        <meta name="description" content="Get in touch with Nixxon Technologies. Visit our Nairobi showroom or contact us via phone, email, or WhatsApp." />
      </Helmet>

      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto px-4 py-5">
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Home › Contact Us</p>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Contact Us</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Have a question or need help? We'd love to hear from you.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact info cards */}
            <div className="space-y-4">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="rounded-xl p-4 flex items-start gap-3.5"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,107,43,0.08)' }}
                  >
                    <Icon size={18} style={{ color: 'var(--orange)' }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>
                      {label}
                    </p>
                    {href ? (
                      <a href={href} className="text-sm font-medium hover:underline" style={{ color: 'var(--text)' }}>
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/254705125957"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl text-white transition-transform hover:scale-[1.02]"
                style={{ background: '#25D366' }}
              >
                <MessageCircle size={22} />
                <div>
                  <p className="text-sm font-bold">Chat on WhatsApp</p>
                  <p className="text-xs opacity-80">Quick responses during business hours</p>
                </div>
              </a>
            </div>

            {/* Contact form */}
            <div
              className="lg:col-span-2 rounded-2xl p-6 sm:p-8"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--text)' }}>Send us a message</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                      Full Name *
                    </label>
                    <input
                      required
                      className="input w-full text-sm"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                      Email Address *
                    </label>
                    <input
                      required type="email"
                      className="input w-full text-sm"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                      Phone Number
                    </label>
                    <input
                      className="input w-full text-sm"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="0712 345 678"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                      Subject *
                    </label>
                    <select
                      required
                      className="input w-full text-sm"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                    >
                      <option value="">Select a topic</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="warranty">Warranty Claim</option>
                      <option value="return">Return / Refund</option>
                      <option value="partnership">Business / Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="input w-full text-sm resize-none"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full justify-center py-3 disabled:opacity-50"
                >
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 20" />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={15} /> Send Message
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Map placeholder */}
          <div
            className="mt-8 rounded-2xl overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Our Location</h3>
            </div>
            <div className="w-full h-64 sm:h-80">
              <iframe
                title="Nixxon Technologies Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8176214!2d36.8219!3d-1.2864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMoi+Avenue+Nairobi!5e0!3m2!1sen!2ske!4v1"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
