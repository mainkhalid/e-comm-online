import { useState } from 'react'
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react'

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b py-4" style={{ borderColor: 'var(--border)' }}>
      <button
        className="flex items-center justify-between w-full mb-0"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text)' }}>
          {title}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--text-muted)' }}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

function RadioItem({ label, checked, onChange, count }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group py-1.5 gap-2">
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
          style={{ borderColor: checked ? 'var(--orange)' : 'var(--border)' }}
        >
          {checked && <div className="w-2 h-2 rounded-full" style={{ background: 'var(--orange)' }} />}
        </div>
        <span
          className="text-sm transition-colors"
          style={{ color: checked ? 'var(--text)' : 'var(--text-muted)' }}
        >
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}>
          {count}
        </span>
      )}
      <input type="radio" className="sr-only" checked={checked} onChange={onChange} />
    </label>
  )
}

const PRICE_RANGES = [
  { label: 'All prices',        min: '',      max: '' },
  { label: 'Under KSh 5,000',   min: '',      max: '5000' },
  { label: 'KSh 5K – 20K',      min: '5000',  max: '20000' },
  { label: 'KSh 20K – 50K',     min: '20000', max: '50000' },
  { label: 'KSh 50K – 100K',    min: '50000', max: '100000' },
  { label: 'Over KSh 100,000',  min: '100000',max: '' },
]

const RATING_OPTIONS = [4, 3, 2, 1]

export default function FilterSidebar({
  categories, brands,
  currentCategory, currentBrand, currentOnSale,
  currentMinPrice, currentMaxPrice, currentRating,
  activeCount,
  onSetParam, onClearAll,
}) {
  const currentPriceKey = `${currentMinPrice}|${currentMaxPrice}`

  const handlePriceRange = (min, max) => {
    onSetParam('_batch_price', { min_price: min, max_price: max })
  }

  const currentPriceLabel = PRICE_RANGES.find(
    r => r.min === (currentMinPrice || '') && r.max === (currentMaxPrice || '')
  )?.label || 'All prices'

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} style={{ color: 'var(--navy)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Filters</span>
          {activeCount > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
              style={{ background: 'var(--orange)' }}
            >
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold flex items-center gap-1 transition-colors"
            style={{ color: 'var(--danger)' }}
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>

      {/* On Sale */}
      <Section title="Special Offers" defaultOpen>
        <label className="flex items-center gap-2.5 cursor-pointer py-1">
          <div
            className="w-9 h-5 rounded-full relative transition-colors flex-shrink-0"
            style={{ background: currentOnSale ? 'var(--orange)' : 'var(--border)' }}
            onClick={() => onSetParam('on_sale', currentOnSale ? '' : 'true')}
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
              style={{ left: currentOnSale ? '18px' : '2px' }}
            />
          </div>
          <span className="text-sm font-semibold" style={{ color: currentOnSale ? 'var(--danger)' : 'var(--text)' }}>
            🔥 On sale only
          </span>
        </label>
      </Section>

      {/* Price range */}
      <Section title="Price Range">
        <div className="space-y-0.5">
          {PRICE_RANGES.map(r => (
            <RadioItem
              key={r.label}
              label={r.label}
              checked={
                (currentMinPrice || '') === r.min &&
                (currentMaxPrice || '') === r.max
              }
              onChange={() => handlePriceRange(r.min, r.max)}
            />
          ))}
        </div>
      </Section>

      {/* Categories */}
      {categories.length > 0 && (
        <Section title="Category">
          <div className="space-y-0.5">
            <RadioItem
              label="All Categories"
              checked={!currentCategory}
              onChange={() => onSetParam('category', '')}
            />
            {categories.map(cat => (
              <RadioItem
                key={cat.id}
                label={cat.name}
                checked={currentCategory === cat.slug}
                onChange={() => onSetParam('category', cat.slug)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <Section title="Brand">
          <div className="space-y-0.5 max-h-52 overflow-y-auto">
            <RadioItem
              label="All Brands"
              checked={!currentBrand}
              onChange={() => onSetParam('brand', '')}
            />
            {brands.map(b => (
              <RadioItem
                key={b.id}
                label={b.name}
                checked={currentBrand === b.slug}
                onChange={() => onSetParam('brand', b.slug)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Minimum rating */}
      <Section title="Min. Rating">
        <div className="space-y-0.5">
          <RadioItem
            label="Any rating"
            checked={!currentRating}
            onChange={() => onSetParam('min_rating', '')}
          />
          {RATING_OPTIONS.map(r => (
            <RadioItem
              key={r}
              label={`${'★'.repeat(r)}${'☆'.repeat(5 - r)} & up`}
              checked={currentRating === String(r)}
              onChange={() => onSetParam('min_rating', String(r))}
            />
          ))}
        </div>
      </Section>
    </aside>
  )
}