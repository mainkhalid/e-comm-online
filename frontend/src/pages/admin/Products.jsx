import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react'
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '../../api/services'
import toast from 'react-hot-toast'

const fmt = p => new Intl.NumberFormat('en-KE',{style:'currency',currency:'KES',minimumFractionDigits:0}).format(p)

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState({ name:'', sku:'', price:'', sale_price:'', stock_qty:'', short_description:'', is_active:true, is_featured:false })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetProducts({ search, ordering: '-created_at' })
      .then(({ data }) => setProducts(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search])

  const openCreate = () => { setEditProduct(null); setForm({ name:'',sku:'',price:'',sale_price:'',stock_qty:'',short_description:'',is_active:true,is_featured:false }); setShowForm(true) }
  const openEdit = p => { setEditProduct(p); setForm({ name:p.name, sku:p.sku, price:p.price, sale_price:p.sale_price||'', stock_qty:p.stock_qty, short_description:p.short_description||'', is_active:p.is_active, is_featured:p.is_featured }); setShowForm(true) }

  const save = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, sale_price: form.sale_price || null }
      if (editProduct) { await adminUpdateProduct(editProduct.slug, payload); toast.success('Product updated') }
      else { await adminCreateProduct(payload); toast.success('Product created') }
      setShowForm(false); load()
    } catch (err) {
      const errs = err.response?.data
      if (errs) Object.values(errs).flat().forEach(m => toast.error(String(m)))
      else toast.error('Save failed')
    } finally { setSaving(false) }
  }

  const deleteProduct = async (slug, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    try { await adminDeleteProduct(slug); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  return (
    <div className="space-y-5 fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-white mb-0.5">Products</h2>
          <p className="text-[13px] text-[#6a6a7e]">{products.length} total products</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus size={15} /> Add product
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 surface px-4 py-2.5 max-w-sm">
        <Search size={15} className="text-[#5a5a6e] shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          className="bg-transparent outline-none text-[14px] text-white placeholder-[#5a5a6e] w-full" />
      </div>

      {/* Table */}
      <div className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Product','SKU','Price','Stock','Status','Featured','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-[#5a5a6e]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_,i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    {[...Array(7)].map((_,j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-16 text-center text-[#5a5a6e] text-[14px]">
                  <Package size={32} className="mx-auto mb-3 text-[#2a2a30]" />
                  No products found
                </td></tr>
              ) : products.map(p => (
                <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#222228] overflow-hidden shrink-0">
                        {p.primary_image && <img src={p.primary_image} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white line-clamp-1 max-w-[200px]">{p.name}</p>
                        <p className="text-[11px] text-[#5a5a6e]">{p.brand_name || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#6a6a7e] font-mono">{p.sku}</td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-white font-semibold">{fmt(p.current_price)}</p>
                    {p.discount_percent > 0 && <p className="text-[11px] text-[#5a5a6e] line-through">{fmt(p.price)}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[12px] font-semibold ${p.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                      {p.stock_qty}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${p.is_active ? 'text-green-400 bg-green-400/10' : 'text-[#5a5a6e] bg-white/5'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.is_featured && <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#e8192c]/10 text-[#e8192c]">⭐ Yes</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="btn-icon w-8 h-8 text-[#6a6a7e] hover:text-white"><Edit2 size={14} /></button>
                      <button onClick={() => deleteProduct(p.slug, p.name)} className="btn-icon w-8 h-8 text-[#6a6a7e] hover:text-[#e8192c]"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative surface p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl text-white mb-5">{editProduct ? 'Edit product' : 'New product'}</h3>
            <form onSubmit={save} className="space-y-4">
              <div><label className="label">Product name *</label><input required className="input" value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="e.g. Dell XPS 15 OLED" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">SKU *</label><input required className="input" value={form.sku} onChange={e => setForm({...form,sku:e.target.value})} placeholder="DELL-XPS15-001" /></div>
                <div><label className="label">Stock qty</label><input type="number" min="0" className="input" value={form.stock_qty} onChange={e => setForm({...form,stock_qty:e.target.value})} placeholder="0" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Price (KES) *</label><input required type="number" min="0" className="input" value={form.price} onChange={e => setForm({...form,price:e.target.value})} placeholder="150000" /></div>
                <div><label className="label">Sale price (KES)</label><input type="number" min="0" className="input" value={form.sale_price} onChange={e => setForm({...form,sale_price:e.target.value})} placeholder="Optional" /></div>
              </div>
              <div><label className="label">Short description</label><textarea rows={3} className="input resize-none" value={form.short_description} onChange={e => setForm({...form,short_description:e.target.value})} placeholder="Brief product description…" /></div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#e8192c] w-4 h-4" checked={form.is_active} onChange={e => setForm({...form,is_active:e.target.checked})} />
                  <span className="text-[13px] text-[#9898a6]">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#e8192c] w-4 h-4" checked={form.is_featured} onChange={e => setForm({...form,is_featured:e.target.checked})} />
                  <span className="text-[13px] text-[#9898a6]">Featured</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5">{saving ? 'Saving…' : editProduct ? 'Save changes' : 'Create product'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1 py-2.5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
