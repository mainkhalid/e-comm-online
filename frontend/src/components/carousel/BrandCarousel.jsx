import { useState } from 'react'

/* ─── Authentic Brand SVGs (Officially Styled) ──────── */
const BrandLogo = ({ name, style }) => {
  const logos = {
    Apple: (
      <svg viewBox="0 0 24 24" style={style} fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-1.01 2.94 1.07.08 2.18-.52 2.84-1.33z"/>
      </svg>
    ),
    Samsung: (
      <svg viewBox="0 0 24 24" style={style} fill="currentColor">
        <path d="M0 10.9c0-3.3 5.4-6 12-6s12 2.7 12 6-5.4 6-12 6-12-2.7-12-6zm3.9.7h.9c.2 0 .3-.1.3-.3v-.6h.7c.3 0 .5-.2.5-.5V9.7c0-.3-.2-.5-.5-.5h-1.9v2.9c0 .3.1.5.3.5zm2.8 0h1.1l.2-.5h1l.1.5h1.1L9.1 9.2H8.1l-1.4 2.4zm4.8 0h1l.1-1.9.8 1.9h.8l.8-1.9.1 1.9h1V9.2h-1.3l-.9 1.9-.9-1.9H11.5v2.4zm6-.8c0 .4.3.5.8.6.4.1.6.2.6.4 0 .2-.2.3-.6.3-.4 0-.7-.1-.9-.3l-.4.6c.4.3.9.4 1.4.4.8 0 1.5-.4 1.5-1.1 0-.5-.3-.7-.9-.8-.4-.1-.6-.2-.6-.4s.2-.3.5-.3c.3 0 .6.1.8.2l.4-.6c-.3-.2-.8-.3-1.3-.3-.8-.1-1.4.3-1.4.9zm-13.8-.8v-.6h.7c.1 0 .2.1.2.2v.2c0 .1-.1.2-.2.2H3.7zm4.8.4l.4-1.1.4 1.1H8.5z" />
      </svg>
    ),
    Dell: (
      <svg viewBox="0 0 24 24" style={style} fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.05 5.4c3.68 0 6.822 2.21 8.296 5.43H9.835L7.73 14.93H5.16c-.15-.6-.23-1.228-.23-1.873C4.93 8.9 7.97 5.4 11.95 5.4zM12 18.6c-3.68 0-6.822-2.21-8.297-5.43h10.41l2.107-4.1h2.57c.15.6.23 1.228.23 1.873C19.02 15.1 15.98 18.6 12 18.6z"/>
      </svg>
    ),
    HP: (
      <svg viewBox="0 0 24 24" style={style} fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM9.31 17.75H7.57l1.7-7.73H11l-.4 1.84c.48-.68 1.23-1.09 2.09-1.09 1.87 0 3.03 1.34 2.62 3.23-.42 1.95-1.92 3.75-3.79 3.75-.84 0-1.42-.32-1.71-.87l-.5 2.12zm4.1-3.61c.95 0 1.76-.98 1.97-1.97.21-.99-.34-1.63-1.3-1.63-.96 0-1.78.98-1.99 1.97-.21.99.35 1.63 1.32 1.63zm-4.75-.41c.21-.97.28-1.44.28-1.44h-.02c-.28.47-.84.81-1.5.81-.98 0-1.57-.75-1.36-1.73.22-.98.98-1.73 1.95-1.73.65 0 1.15.31 1.41.77h.02l.27-.63h1.61l-1.39 6.33c-.09.39-.17.61-.17.61h-1.1zm-.05-3.03c-.49 0-.89.37-.99.85-.1.48.21.82.7.82.5 0 .9-.37 1-.85.11-.48-.2-.82-.71-.82z"/>
      </svg>
    ),
    Lenovo: (
      <svg viewBox="0 0 24 24" style={style} fill="currentColor">
        <path d="M0 0v24h24V0H0zm4.55 16.48c0-1.49.52-2.22 1.57-2.22.42 0 .74.12.98.35v-3.73h1.37V18h-1.2l-.11-.53h-.03c-.27.4-.69.65-1.25.65-1.03.01-1.33-.76-1.33-1.64zm4.24-1.97c0-1.34.82-2.25 2.05-2.25 1.27 0 1.93.97 1.93 2.17v.34h-2.61c0 .64.31.99.96.99.41 0 .73-.13.97-.37l.63.64c-.42.49-1 .74-1.69.74-1.35-.01-2.24-.95-2.24-2.26zm4.78 2.21v-5.41h1.27l.11.66h.03c.33-.51.81-.78 1.41-.78 1.05 0 1.48.69 1.48 1.83V18h-1.37v-3.32c0-.62-.16-.94-.65-.94-.37 0-.71.22-.88.58V18h-1.4zm6.05-1.97c0-1.44.91-2.5 2.24-2.5s2.24 1.06 2.24 2.5c0 1.44-.91 2.51-2.24 2.51s-2.24-1.07-2.24-2.51zM6.1 16.45c0 .62.17.93.63.93.31 0 .62-.22.75-.54v-1.39c-.12-.22-.38-.34-.69-.34-.45.01-.69.34-.69 1.34zm4.78-.51h1.25c-.01-.52-.19-.85-.64-.85-.42.01-.59.33-.61.85zm8.41.51c0-.68-.29-1.12-.87-1.12-.57 0-.87.44-.87 1.12 0 .67.29 1.12.87 1.12.58 0 .87-.45.87-1.12z"/>
      </svg>
    ),
    Sony: (
      <svg viewBox="0 0 24 24" style={style} fill="currentColor">
        <path d="M24 11.026v1.109c0 .416-.01.503-.178.536-.328.067-.935.093-1.635.107l-.14-.701h-2.822v.333c0 .546.438.74 1.545.753l-.066.697c-1.076-.013-2.18-.04-2.903-.04-.692 0-1.68.027-2.607.04l-.06-.697c.884-.013 1.259-.14 1.259-.753v-1.198c0-.65-.411-.753-1.3-.766l.053-.69c.805.013 1.761.039 2.454.039.73 0 1.706-.026 2.56-.039l.06.69c-.914.013-1.287.116-1.287.766v.253h2.72v-.519c0-.526-.35-.632-1.217-.645l.053-.69c.737.013 1.46.039 2.052.039.52 0 1.053-.026 1.486-.039l.04.532c-.106.046-.179.166-.179.412M6.168 11.233c-.007-.473-.245-.632-.934-.645l.04-.69c.594.013 1.301.039 1.83.039.492 0 1.02-.026 1.4-.039l.04.69c-.663.013-.881.166-.881.645v.693c0 .58.265.733.987.746l-.04.697c-.675-.013-1.424-.04-1.974-.04-.51 0-1.139.027-1.65.04l-.04-.697c.603-.013.73-.166.73-.746v-.693zM1.98 12.012c.57.14 1.153.253 1.153.646 0 .426-.61.579-1.498.592l-.06.704c1.1-.02 2.306-.113 2.306-.99 0-.759-.716-1.01-1.505-1.19-.536-.12-.994-.213-.994-.552 0-.326.47-.492 1.206-.505l-.047-.691c-1.007.013-1.92.14-1.92.89 0 .638.564.918 1.359 1.106m10.155-.785l-1.405 2.148v.013c0 .412.087.5.557.513l-.04.697c-.47-.013-1.047-.04-1.464-.04-.37 0-.895.027-1.299.04l-.033-.697c.43-.013.51-.101.51-.513v-1.63c0-.44-.066-.54-.45-.553l.033-.69c.39.013.842.039 1.213.039.404 0 .808-.026 1.14-.039l1.106 1.77h.013v-1.77c0-.44-.073-.54-.457-.553l.033-.69c.398.013.855.039 1.226.039.351 0 .736-.026 1.04-.039l.034.69c-.43.013-.51.113-.51.553v1.65a22.253 22.253 0 0 0 .04.678h-.83l-1.319-2.134z"/>
      </svg>
    ),
    Oraimo: (
      <svg viewBox="0 0 24 24" style={style} fill="currentColor">
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 18.6a6.6 6.6 0 1 1 0-13.2 6.6 6.6 0 0 1 0 13.2zm0-10.8a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4z" />
      </svg>
    ),
    Microsoft: (
      <svg viewBox="0 0 24 24" style={style} fill="currentColor">
        <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
      </svg>
    ),
    Anker: (
      <svg viewBox="0 0 24 24" style={style} fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.6 4.8v5.4h3l-4.8 9v-5.4H7.8L12.6 4.8z"/>
      </svg>
    ),
    LG: (
      <svg viewBox="0 0 24 24" style={style} fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.2 7.2h1.8v9H7.2v-1.8h3.6V7.2zm4.2 3h1.8v4.2h.6V16.8H15v-1.2h-1.8v-4.2h1.8V10.2z"/>
      </svg>
    ),
  }

  return logos[name] || (
    <svg viewBox="0 0 24 24" style={style} fill="currentColor">
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

/* ─── Premium Tech Brands ───────────────────────────────── */
const BRANDS = [
  { id: 1,  name: 'Apple',     color: '#000000' },
  { id: 2,  name: 'Samsung',   color: '#1428A0' },
  { id: 3,  name: 'Dell',      color: '#007DB8' },
  { id: 4,  name: 'HP',        color: '#0096D6' },
  { id: 5,  name: 'Lenovo',    color: '#E2231A' },
  { id: 6,  name: 'Oraimo',    color: '#9AF000' }, 
  { id: 7,  name: 'Sony',      color: '#000000' },
  { id: 8,  name: 'Anker',     color: '#00A5E0' },
  { id: 9,  name: 'Microsoft', color: '#F25022' },
  { id: 10, name: 'LG',        color: '#A50034' },
]

// Doubled list creates the flawless seamless transition anchor
const DOUBLED = [...BRANDS, ...BRANDS]

function BrandChip({ brand }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        display: 'flex', 
        alignItems: 'center', 
        gap: 12,
        padding: '12px 24px',
        borderRadius: 12,
        background: hovered ? '#ffffff' : '#F9FAFB',
        border: `1px solid ${hovered ? brand.color + '44' : '#E5E7EB'}`,
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? `0 10px 25px -5px ${brand.color}15, 0 8px 10px -6px ${brand.color}15` : 'none',
        minWidth: 140,
      }}
    >
      <BrandLogo
        name={brand.name}
        style={{
          width: 22, 
          height: 22,
          color: hovered ? brand.color : '#9CA3AF',
          transition: 'color 0.25s ease',
          flexShrink: 0,
        }}
      />
      <span style={{
        fontSize: 14, 
        fontWeight: 600,
        color: hovered ? '#111827' : '#4B5563',
        transition: 'color 0.25s ease',
        whiteSpace: 'nowrap',
      }}>
        {brand.name}
      </span>
    </div>
  )
}

export default function BrandCarousel() {
  const [paused, setPaused] = useState(false)

  return (
    <section style={{
      padding: '40px 0',
      borderTop: '1px solid #F3F4F6',
      borderBottom: '1px solid #F3F4F6',
      background: '#ffffff',
      overflow: 'hidden',
    }}>
      {/* Label section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginBottom: 28 }}>
        <p style={{
          fontSize: 11, 
          fontWeight: 700, 
          letterSpacing: '0.12em',
          textTransform: 'uppercase', 
          textAlign: 'center',
          color: '#9CA3AF', 
          margin: 0,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 16,
        }}>
          <span style={{ flex: 1, height: 1, background: '#E5E7EB', maxWidth: 64 }} />
          Authorised Retailer For Global Brands
          <span style={{ flex: 1, height: 1, background: '#E5E7EB', maxWidth: 64 }} />
        </p>
      </div>

      {/* Outer Viewport Container */}
      <div
        style={{ position: 'relative', width: '100%' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Subtle Vignette Gradient Masks */}
        <div style={{
          position: 'absolute', left: 0, top: -4, bottom: -4, width: 100, zIndex: 10,
          background: 'linear-gradient(to right, #ffffff, transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: -4, bottom: -4, width: 100, zIndex: 10,
          background: 'linear-gradient(to left, #ffffff, transparent)',
          pointerEvents: 'none',
        }} />

        {/* Continuous Marquee Track */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            width: 'max-content',
            padding: '4px 0',
            animation: 'infiniteLinearMarquee 32s linear infinite',
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {DOUBLED.map((brand, i) => (
            <BrandChip key={`${brand.id}-${i}`} brand={brand} />
          ))}
        </div>
      </div>

      {/* Single, mathematically sound global animation keyframe */}
      <style>{`
        @keyframes infiniteLinearMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            /* Translates exactly half the track length (the duplicate boundary point) */
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}