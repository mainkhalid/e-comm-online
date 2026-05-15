import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, FolderTree, ChevronRight, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  adminGetCategories, adminCreateCategory,
  adminUpdateCategory, adminDeleteCategory,
} from '../../api/services'

const EMPTY = { name: '', slug: '', parent: '', description: '', is_active: true }

function CategoryModal({ cat, categories, onClose, onSaved }) {
  const [form, setForm]   = useState(cat ? {
    name: cat.name, slug: cat.slug || '', parent: cat.parent || '',
    description: cat.description || '', is_active: cat.is_active !== false,
  } : EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Auto-slug
  const handleName = (v) => {
    set('name', v)
    if (!cat) set('slug', v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (cat) { await adminUpdateCategory(cat.id, form) }
      else      { await adminCreateCategory(form) }
      toast.success(cat ? 'Category updated!' : 'Category created!')
      onSaved(); onClose()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save')
    } finally { setSaving(false) }
  }

  const parents = categories.filter(c => !cat || c.id !== cat.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-slide-down"
        style={{ background: 'var(--card)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
            {cat ? 'Edit Category' : 'New Category'}
          </h3>
          <button onClick={onClose}><X size={17} style={{ color: 'var(--text-muted)' }} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {[
            { label: 'Category Name *', key: 'name', placeholder: 'e.g. Laptops', handler: e => handleName(e.target.value) },
            { label: 'Slug *', key: 'slug', placeholder: 'e.g. laptops', handler: e => set('slug', e.target.value) },
          ].map(({ label, key, placeholder, handler }) => (
            <div key={key}>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</label>
              <input required value={form[key]} onChange={handler} placeholder={placeholder} className="input w-full text-sm" />
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Parent Category
            </label>
            <select value={form.parent} onChange={e => set('parent', e.target.value)} className="input w-full text-sm">
              <option value="">None (top-level)</option>
              {parents.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={2} className="input w-full text-sm resize-none" placeholder="Optional description" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-5 rounded-full relative transition-colors flex-shrink-0"
              style={{ background: form.is_active ? 'var(--orange)' : 'var(--border)' }}
              onClick={() => set('is_active', !form.is_active)}>
              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                style={{ left: form.is_active ? '18px' : '2px' }} />
            </div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Active (visible in store)</span>
          </label>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
              {saving ? 'Saving…' : cat ? 'Update' : 'Create Category'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline px-5">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CategoryRow({ cat, depth = 0, all, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(true)
  const children = all.filter(c => String(c.parent) === String(cat.id))

  return (
    <>
      <tr style={{ borderBottom: '1px solid var(--border)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
        onMouseLeave={e => e.currentTarget.style.background = ''}>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 20}px` }}>
            {children.length > 0 ? (
              <button onClick={() => setExpanded(o => !o)} className="flex-shrink-0">
                <ChevronRight size={13}
                  style={{ color: 'var(--text-muted)', transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>
            ) : (
              <div className="w-3.5 flex-shrink-0" />
            )}
            <FolderTree size={14} style={{ color: depth === 0 ? 'var(--orange)' : 'var(--text-muted)', flexShrink: 0 }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{cat.name}</span>
            {children.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(255,107,43,0.08)', color: 'var(--orange)' }}>
                {children.length}
              </span>
            )}
          </div>
        </td>
        <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{cat.slug}</td>
        <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          {cat.product_count ?? '—'}
        </td>
        <td className="px-4 py-3.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: cat.is_active ? 'rgba(22,163,74,0.08)' : 'rgba(107,114,128,0.08)',
              color: cat.is_active ? 'var(--success)' : 'var(--text-muted)',
            }}>
            {cat.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(cat)}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors">
              <Edit2 size={13} style={{ color: '#2563EB' }} />
            </button>
            <button onClick={() => onDelete(cat.id, cat.name)}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors">
              <Trash2 size={13} style={{ color: 'var(--danger)' }} />
            </button>
          </div>
        </td>
      </tr>

      {/* Children */}
      {expanded && children.map(child => (
        <CategoryRow key={child.id} cat={child} depth={depth + 1} all={all} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </>
  )
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null) // null=closed, 'new', or category obj

  const load = () => {
    setLoading(true)
    adminGetCategories()
      .then(({ data }) => setCategories(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? Sub-categories will also be removed.`)) return
    try {
      await adminDeleteCategory(id)
      toast.success('Category deleted')
      load()
    } catch { toast.error('Could not delete — may have associated products') }
  }

  // Top-level only (no parent or parent not in list)
  const topLevel = categories.filter(c => !c.parent || !categories.find(p => String(p.id) === String(c.parent)))

  return (
    <div className="space-y-5 fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Categories</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{categories.length} categories</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary text-sm">
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Slug', 'Products', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="skeleton h-4 rounded" style={{ width: j === 0 ? '140px' : '70px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : topLevel.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-14 text-center">
                  <FolderTree size={36} style={{ color: 'var(--border)', margin: '0 auto 12px' }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No categories yet</p>
                </td></tr>
              ) : topLevel.map(cat => (
                <CategoryRow key={cat.id} cat={cat} all={categories}
                  onEdit={c => setModal(c)}
                  onDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal !== null && (
        <CategoryModal
          cat={modal === 'new' ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}
    </div>
  )
}