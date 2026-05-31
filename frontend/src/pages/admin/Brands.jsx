import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Plus, Edit2, Trash2, Award, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  adminGetBrands, adminCreateBrand,
  adminUpdateBrand, adminDeleteBrand,
} from '../../api/services'
import { invalidateProducts } from '../../store/slices/productsSlice'

const EMPTY = { name: '', slug: '', description: '', is_active: true }

function BrandModal({ brand, onClose, onSaved }) {
  const [form, setForm] = useState(brand ? {
    name: brand.name, slug: brand.slug || '',
    description: brand.description || '', is_active: brand.is_active !== false,
  } : EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleName = (v) => {
    set('name', v)
    if (!brand) set('slug', v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (brand) await adminUpdateBrand(brand.slug, form)
      else       await adminCreateBrand(form)
      toast.success(brand ? 'Brand updated!' : 'Brand created!')
      onSaved(); onClose()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save')
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'var(--card)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
            {brand ? 'Edit Brand' : 'New Brand'}
          </h3>
          <button onClick={onClose}><X size={17} style={{ color: 'var(--text-muted)' }} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Brand Name *</label>
            <input required value={form.name} onChange={e => handleName(e.target.value)}
              placeholder="e.g. HP, Dell, Lenovo" className="input w-full text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Slug *</label>
            <input required value={form.slug} onChange={e => set('slug', e.target.value)}
              placeholder="e.g. hp" className="input w-full text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={2} className="input w-full text-sm resize-none" placeholder="Optional brand description" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-5 rounded-full relative transition-colors flex-shrink-0"
              style={{ background: form.is_active ? 'var(--orange)' : 'var(--border)' }}
              onClick={() => set('is_active', !form.is_active)}>
              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                style={{ left: form.is_active ? '18px' : '2px' }} />
            </div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Active (visible in filters)</span>
          </label>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
              {saving ? 'Saving…' : brand ? 'Update Brand' : 'Create Brand'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline px-5">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminBrands() {
  const dispatch = useDispatch()
  const [brands, setBrands]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(null)

  const load = () => {
    setLoading(true)
    adminGetBrands({ search: search || undefined })
      .then(({ data }) => setBrands(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // ── Debounced search (300ms delay) ───────────────────────
  const searchTimerRef = useRef(null)
  const debouncedSearch = useCallback(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => { load() }, 300)
  }, [search])
  useEffect(() => { return () => clearTimeout(searchTimerRef.current) }, [])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    debouncedSearch()
  }

  const handleSearch = (e) => { e.preventDefault(); load() }

  const handleDelete = async (slug, name) => {
    if (!confirm(`Delete brand "${name}"? Products will lose this brand assignment.`)) return
    // Optimistic update: remove from UI immediately
    const previousBrands = brands
    setBrands(prev => prev.filter(b => b.slug !== slug))
    try {
      await adminDeleteBrand(slug)
      toast.success('Brand deleted')
      dispatch(invalidateProducts())
    } catch {
      // Revert on error
      setBrands(previousBrands)
      toast.error('Could not delete brand')
    }
  }

  const handleSaved = () => {
    dispatch(invalidateProducts()) // clear Redux brand cache
    load()
  }

  return (
    <div className="space-y-5 fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Brands</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{brands.length} brands</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary text-sm">
          <Plus size={15} /> Add Brand
        </button>
      </div>

      <div className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <form onSubmit={handleSearch} className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={handleSearchChange}
            placeholder="Search brands…" className="input pl-9 w-full text-sm" />
        </form>
      </div>

      <div className="card overflow-hidden" style={{ transform: 'none' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Brand', 'Slug', 'Products', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="skeleton h-4 rounded" style={{ width: j === 0 ? '120px' : '60px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-14 text-center">
                    <Award size={36} style={{ color: 'var(--border)', margin: '0 auto 12px' }} />
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No brands yet</p>
                    <button onClick={() => setModal('new')} className="btn-primary text-sm mt-4">
                      <Plus size={14} /> Add First Brand
                    </button>
                  </td>
                </tr>
              ) : brands.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,107,43,0.08)' }}>
                        <Award size={16} style={{ color: 'var(--orange)' }} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{b.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{b.slug}</td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>{b.product_count ?? '—'}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: b.is_active ? 'rgba(22,163,74,0.08)' : 'rgba(107,114,128,0.08)',
                        color: b.is_active ? 'var(--success)' : 'var(--text-muted)',
                      }}>
                      {b.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(b)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors">
                        <Edit2 size={13} style={{ color: '#2563EB' }} />
                      </button>
                      <button onClick={() => handleDelete(b.slug, b.name)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                        <Trash2 size={13} style={{ color: 'var(--danger)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal !== null && (
        <BrandModal
          brand={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}