import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  Shield, Cpu, Truck, HeadphonesIcon, Award, Users,
  Target, Heart, Zap,
} from 'lucide-react'

const VALUES = [
  {
    icon: Shield,
    title: 'Genuine Products',
    desc: 'Every product we sell is 100% genuine, sourced directly from authorised distributors.',
    color: '#16A34A',
  },
  {
    icon: Award,
    title: 'Warranty You Can Trust',
    desc: 'Up to 12 months warranty on new products and 3 months on refurbished devices.',
    color: '#FF6B2B',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Same-day delivery in Nairobi, 2–5 days nationwide. Free delivery on orders over KSh 5,000.',
    color: '#2563EB',
  },
  {
    icon: HeadphonesIcon,
    title: 'Expert Support',
    desc: 'Our tech team is available on WhatsApp, phone, and email to help you choose the right product.',
    color: '#7C3AED',
  },
]

const MILESTONES = [
  { value: '5,000+', label: 'Orders Delivered' },
  { value: '80+', label: 'Trusted Brands' },
  { value: '4.8★', label: 'Customer Rating' },
  { value: '24hrs', label: 'Avg. Response Time' },
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us — Nixxon Technologies</title>
        <meta name="description" content="Learn about Nixxon Technologies — Kenya's trusted destination for laptops, phones, and tech accessories." />
      </Helmet>

      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        {/* Hero banner */}
        <div
          className="relative py-16 sm:py-24"
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
          }}
        >
          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
              About Us
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Powering Kenya's <span style={{ color: 'var(--orange)' }}>Digital Future</span>
            </h1>
            <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Nixxon Technologies is Kenya's premier tech retailer, offering genuine laptops, smartphones,
              networking equipment, and accessories from 80+ trusted global brands — with fast delivery
              and reliable after-sales support.
            </p>
          </div>
          {/* Decorative elements */}
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'var(--orange)', filter: 'blur(80px)' }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 -mt-20 relative z-20 mb-12">
            {MILESTONES.map(m => (
              <div
                key={m.label}
                className="rounded-xl p-5 text-center"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(15,23,42,0.08)' }}
              >
                <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--navy)' }}>{m.value}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
              </div>
            ))}
          </div>

          {/* Our Story */}
          <div
            className="rounded-2xl p-6 sm:p-8 mb-8"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Cpu size={18} style={{ color: 'var(--orange)' }} />
              <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Our Story</h2>
            </div>
            <div className="text-sm leading-relaxed space-y-4" style={{ color: 'var(--text-muted)' }}>
              <p>
                Founded in Nairobi's CBD, Nixxon Technologies started with a simple mission: to make genuine,
                quality tech products accessible to every Kenyan at fair prices. We began as a small shop on Moi Avenue,
                serving students, professionals, and businesses looking for reliable laptops and accessories.
              </p>
              <p>
                Today, we've grown into a full-service tech retailer with an extensive online store, serving customers
                across all 47 counties. Whether you need a high-performance workstation, a budget-friendly student
                laptop, or enterprise networking equipment, we've got you covered.
              </p>
              <p>
                Our team of tech enthusiasts personally tests and curates every product we sell, ensuring that our
                customers get exactly what they need — no compromises on quality, no inflated prices.
              </p>
            </div>
          </div>

          {/* Our Mission & Vision */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Target size={18} style={{ color: 'var(--orange)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>Our Mission</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                To empower individuals and businesses across Kenya with access to genuine, high-quality technology
                products, backed by expert guidance and reliable after-sales support.
              </p>
            </div>
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap size={18} style={{ color: 'var(--orange)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>Our Vision</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                To become East Africa's most trusted technology retailer, known for product authenticity,
                competitive pricing, and exceptional customer experience.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Heart size={18} style={{ color: 'var(--danger)' }} />
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {VALUES.map(v => {
              const Icon = v.icon
              return (
                <div
                  key={v.title}
                  className="rounded-xl p-5 flex items-start gap-4"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${v.color}12` }}
                  >
                    <Icon size={20} style={{ color: v.color }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>{v.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)' }}
          >
            <h3 className="text-xl font-bold text-white mb-2">Ready to shop?</h3>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Browse our full range of genuine tech products with M-Pesa payments and fast delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/products" className="btn-primary">Browse Products</Link>
              <Link to="/contact" className="btn-outline text-white border-white/30 hover:bg-white/10">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
