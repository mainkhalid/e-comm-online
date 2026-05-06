import { useState, useEffect } from 'react'
import { Tag, Plus, Edit2, Trash2, ChevronRight } from 'lucide-react'
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../api/services'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editCat, setEditCat] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', is_active: true })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetCategories()
      .then(({ data }) => setCategories(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditCat(null)
    setForm({ name: '', slug: '', description: '', is_active: true })
    setShowForm(true)
  }

  const openEdit = (cat) => {
    setEditCat(cat)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', is_active: cat.is_active !== false })
    setShowForm(true)
  }

  const save = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editCat) { await adminUpdateCategory(editCat.slug, form); toast.success('Category updated') }
      else { await adminCreateCategory(form); toast.success('Category created') }
      setShowForm(false); load()
    } catch (err) {
      const errs = err.response?.data
      if (errs) Object.values(errs).flat().forEach(m => toast.error(String(m)))
      else toast.error('Save failed')
    } finally { setSaving(false) }
  }

  const deleteCat = async (slug, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    try { await adminDeleteCategory(slug); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  const renderCategory = (cat, depth = 0) => (
    <div key={cat.id}>
      <div className={`flex items-center justify-between py-3 px-4 hover:bg-white/[0.03] transition-colors ${depth > 0 ? 'border-l-2 border-white/10 ml-6' : ''}`}>
        <div className="flex items-center gap-3">
          {depth > 0 && <ChevronRight size={12} className="text-[#5a5a6e]" />}
          <div>
            <p className="text-[13px] font-medium text-white">{cat.name}</p>
            <p className="text-[11px] text-[#5a5a6e]">/{cat.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(cat)} className="btn-icon w-8 h-8 text-[#6a6a7e] hover:text-white"><Edit2 size={14} /></button>
          <button onClick={() => deleteCat(cat.slug, cat.name)} className="btn-icon w-8 h-8 text-[#6a6a7e] hover:text-[#e8192c]"><Trash2 size={14} /></button>
        </div>
      </div>
      {cat.children && cat.children.map(child => renderCategory(child, depth + 1))}
    </div>
  )

  return (
    <div className="space-y-5 fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-white mb-0.5">Categories</h2>
          <p className="text-[13px] text-[#6a6a7e]">Manage product categories</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus size={15} /> Add category
        </button>
      </div>

      <div className="surface overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12" />)}</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-[#5a5a6e]">
            <Tag size={32} className="mx-auto mb-3 text-[#2a2a30]" />
            <p className="text-[14px]">No categories yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {categories.map(cat => renderCategory(cat))}
          </div>
        )}
      </div>

      {/* Create/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative surface p-6 w-full max-w-lg">
            <h3 className="font-serif text-xl text-white mb-5">{editCat ? 'Edit category' : 'New category'}</h3>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="label">Name *</label>
                <input required className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Laptops" />
              </div>
              <div>
                <label className="label">Slug</label>
                <input className="input" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated if empty" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea rows={3} className="input resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[#e8192c] w-4 h-4" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                <span className="text-[13px] text-[#9898a6]">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5">{saving ? 'Saving…' : editCat ? 'Save changes' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1 py-2.5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
