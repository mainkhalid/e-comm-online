import { X, ChevronDown, ImagePlus } from 'lucide-react'
import { useRef } from 'react'
import { getCldThumb } from '../../../utils/cloudinaryUtils'

export const fmt = p =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: 'KES', minimumFractionDigits: 0,
  }).format(p)

/* ── Toggle switch ────────────────────────────────────────── */
export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div
        className="w-9 h-5 rounded-full relative transition-colors flex-shrink-0"
        style={{ background: checked ? 'var(--orange)' : 'var(--border)' }}
        onClick={() => onChange(!checked)}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
          style={{ left: checked ? '18px' : '2px' }}
        />
      </div>
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
    </label>
  )
}

/* ── Field label ──────────────────────────────────────────── */
export function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5"
      style={{ color: 'var(--text-muted)' }}>
      {children}
      {required && <span style={{ color: 'var(--danger)' }}> *</span>}
    </label>
  )
}

/* ── Stock badge ──────────────────────────────────────────── */
export function StockBadge({ qty }) {
  if (qty === 0) return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(220,38,38,0.08)', color: 'var(--danger)' }}>
      Out of stock
    </span>
  )
  if (qty <= 5) return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(217,119,6,0.08)', color: '#D97706' }}>
      {qty} left
    </span>
  )
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(22,163,74,0.08)', color: 'var(--success)' }}>
      {qty} in stock
    </span>
  )
}

/* ── Select with chevron ─────────────────────────────────── */
export function SelectField({ label, value, onChange, options, placeholder, required }) {
  return (
    <div>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="input w-full text-sm appearance-none pr-8">
          <option value="">{placeholder || 'Select...'}</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-muted)' }} />
      </div>
    </div>
  )
}

/* ── Image uploader ───────────────────────────────────────── */
export function ImageUploader({ images, onChange, onDeleteExisting }) {
  const ref = useRef()
  const handleFiles = (files) => {
    const next = Array.from(files).map((f, i) => ({
      preview: URL.createObjectURL(f), file: f, _new: true,
    }))
    onChange([...images, ...next])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider mb-2"
        style={{ color: 'var(--text-muted)' }}>
        Product Images
      </p>
      <div
        className="flex flex-wrap gap-2 mb-1.5 p-3 rounded-xl border-2 border-dashed min-h-[100px]"
        style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--orange)' }}
        onDragLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        onDrop={e => { e.currentTarget.style.borderColor = 'var(--border)'; handleDrop(e) }}
      >
        {images.map((img, i) => (
          <div key={img.id || i}
            className="relative w-20 h-20 rounded-xl overflow-hidden border group"
            style={{ borderColor: img.is_primary ? 'var(--orange)' : 'var(--border)', background: 'var(--card)' }}>
            <img
              src={img._new ? img.preview : getCldThumb(img.image)}
              alt={img.alt_text || ''}
              className="w-full h-full object-contain p-1"
            />
            {img.is_primary && (
              <span className="absolute bottom-0 left-0 right-0 text-center text-[8px] font-bold py-0.5"
                style={{ background: 'var(--orange)', color: 'white' }}>PRIMARY</span>
            )}
            <button
              type="button"
              onClick={() => {
                if (img._new) {
                  onChange(images.filter((_, j) => j !== i))
                } else if (onDeleteExisting) {
                  onDeleteExisting(img.id, i)
                }
              }}
              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'var(--danger)' }}
            >
              <X size={10} color="white" />
            </button>
            {!img.is_primary && !img._new && (
              <button
                type="button"
                onClick={() => {
                  const updated = images.map((im, j) => ({ ...im, is_primary: j === i }))
                  onChange(updated)
                }}
                className="absolute top-0.5 left-0.5 text-[7px] font-bold px-1 py-0.5 rounded bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                style={{ color: 'var(--orange)' }}
              >
                Set Primary
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors hover:border-orange-400"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <ImagePlus size={18} />
          <span style={{ fontSize: 10 }}>Add</span>
        </button>
      </div>
      <input
        ref={ref} type="file" multiple accept="image/*"
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
      <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
        Drag & drop or click to add. Click image to set as primary.
      </p>
    </div>
  )
}
