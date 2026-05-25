import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PromoBanner({ title, discount, image, description, ctaText = 'Shop Now', href = '/products' }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        minHeight: 280,
        background: '#0A0F1E',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}
    >
      {/* Left — text content */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '44px 40px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', gap: 18,
      }}>
        {/* Eyebrow */}
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#FACC15',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{
            display: 'inline-block', width: 20, height: 2,
            background: '#FACC15', borderRadius: 2,
          }} />
          Limited Offer
        </span>

        {/* Title */}
        <h3 style={{
          fontSize: 30, fontWeight: 900,
          color: '#fff', lineHeight: 1.12,
          letterSpacing: '-0.03em', margin: 0,
        }}>
          {title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: 13, color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.6, margin: 0, maxWidth: 280,
        }}>
          {description}
        </p>

        {/* Discount pill + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {discount && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #FACC15, #F59E0B)',
              boxShadow: '0 8px 24px rgba(250,204,21,0.35)',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: '#78350F', letterSpacing: '0.06em', textTransform: 'uppercase' }}>UP TO</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#78350F', lineHeight: 1 }}>{discount}</span>
              <span style={{ fontSize: 8, fontWeight: 800, color: '#78350F', letterSpacing: '0.08em' }}>OFF</span>
            </div>
          )}

          <Link
            to={href}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 10,
              background: '#FACC15',
              color: '#78350F',
              fontSize: 13, fontWeight: 800,
              textDecoration: 'none',
              letterSpacing: '0.02em',
              transition: 'transform 0.2s, box-shadow 0.2s',
              transform: hovered ? 'translateY(-2px)' : 'none',
              boxShadow: hovered ? '0 12px 32px rgba(250,204,21,0.4)' : '0 4px 16px rgba(250,204,21,0.2)',
            }}
          >
            {ctaText} <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Right — product image full bleed */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Blurred atmospheric bg */}
        <img
          src={image || '/placeholder.png'}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'blur(24px) brightness(0.3) saturate(1.5)',
            transform: 'scale(1.1)',
          }}
        />
        {/* Sharp product image */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }}>
          {/* Glow behind product */}
          <div style={{
            position: 'absolute',
            width: '60%', height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(250,204,21,0.25) 0%, transparent 70%)',
            filter: 'blur(16px)',
          }} />
          <img
            src={image || '/placeholder.png'}
            alt={title}
            style={{
              position: 'relative',
              maxHeight: 200, maxWidth: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 20px 48px rgba(0,0,0,0.6))',
              transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: hovered ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)',
            }}
          />
        </div>
      </div>

      {/* Left-to-right gradient fade — left panel into right */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0,
        left: '45%', width: '15%',
        background: 'linear-gradient(to right, #0A0F1E, transparent)',
        zIndex: 1, pointerEvents: 'none',
      }} />
    </div>
  )
}