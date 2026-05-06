const BRANDS = [
  { id: 1,  name: 'Apple',     emoji: '🍎' },
  { id: 2,  name: 'Samsung',   emoji: '📱' },
  { id: 3,  name: 'Dell',      emoji: '💻' },
  { id: 4,  name: 'HP',        emoji: '🖨️' },
  { id: 5,  name: 'Lenovo',    emoji: '⌨️' },
  { id: 6,  name: 'JBL',       emoji: '🔊' },
  { id: 7,  name: 'Bose',      emoji: '🎧' },
  { id: 8,  name: 'Garmin',    emoji: '⌚' },
  { id: 9,  name: 'Sony',      emoji: '🎮' },
  { id: 10, name: 'Anker',     emoji: '🔋' },
  { id: 11, name: 'Jabra',     emoji: '🎙️' },
  { id: 12, name: 'Microsoft', emoji: '🪟' },
  { id: 13, name: 'Acer',      emoji: '💡' },
  { id: 14, name: 'Asus',      emoji: '🖥️' },
  { id: 15, name: 'LG',        emoji: '📺' },
  { id: 16, name: 'Hisense',   emoji: '📡' },
]

// Duplicate for seamless infinite scroll
const DOUBLED = [...BRANDS, ...BRANDS]

export default function BrandCarousel() {
  return (
    <section className="py-10 overflow-hidden" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--card)' }}>
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: 'var(--text-muted)' }}>
          Authorised dealers for 80+ global brands
        </p>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--card), transparent)' }}
        />
        <div
          className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--card), transparent)' }}
        />

        <div
          className="flex gap-4"
          style={{
            animation: 'marquee 35s linear infinite',
            width: 'max-content',
          }}
        >
          {DOUBLED.map((brand, i) => (
            <div
              key={`${brand.id}-${i}`}
              className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-xl cursor-pointer transition-all hover:scale-105"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                minWidth: '130px',
              }}
            >
              <span className="text-xl">{brand.emoji}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}