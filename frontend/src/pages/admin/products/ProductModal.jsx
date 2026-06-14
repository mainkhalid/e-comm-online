import { useState, useEffect } from 'react'
import { X, Check, Package, DollarSign, Layers, Image, Settings, Search as SearchIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminCreateProduct, adminUpdateProduct, adminGetProduct, adminDeleteImage } from '../../../api/services'
import { FieldLabel, Toggle, SelectField, ImageUploader, fmt } from './ProductShared'

const TABS = [
  { key: 'general',   label: 'General',   icon: Package },
  { key: 'pricing',   label: 'Pricing',   icon: DollarSign },
  { key: 'variants',  label: 'Variants',  icon: Layers },
  { key: 'images',    label: 'Images',    icon: Image },
  { key: 'specs',     label: 'Specs',     icon: Settings },
  { key: 'seo',       label: 'SEO',       icon: SearchIcon },
]

const EMPTY_FORM = {
  name: '', sku: '', price: '', sale_price: '',
  stock_qty: '', low_stock_threshold: '5',
  category: '', brand: '',
  short_description: '', description: '',
  is_featured: false, is_active: true,
  meta_title: '', meta_description: '', canonical_url: '',
}

export default function ProductModal({ product, categories, brands, onClose, onSaved }) {
  const [tab, setTab] = useState('general')
  const [form, setForm] = useState(EMPTY_FORM)
  const [images, setImages] = useState([])
  const [specs, setSpecs] = useState([])
  const [variants, setVariants] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Load full product detail if editing
  useEffect(() => {
    if (product?.slug) {
      setLoading(true)
      adminGetProduct(product.slug).then(({ data }) => {
        setForm({
          name: data.name || '', sku: data.sku || '',
          price: data.price || '', sale_price: data.sale_price || '',
          stock_qty: data.stock_qty ?? '', low_stock_threshold: data.low_stock_threshold ?? '5',
          category: data.category?.id || '', brand: data.brand?.id || '',
          short_description: data.short_description || '', description: data.description || '',
          is_featured: data.is_featured || false, is_active: data.is_active !== false,
          meta_title: data.meta_title || '', meta_description: data.meta_description || '',
          canonical_url: data.canonical_url || '',
        })
        setImages(data.images || [])
        setSpecs((data.specs || []).map(s => ({ label: s.label, value: s.value, order: s.order })))
        setVariants((data.variants || []).map(v => ({
          name: v.name, sku: v.sku,
          price_override: v.price_override || '',
          stock_qty: v.stock_qty || 0, is_active: v.is_active !== false,
          attributes: (v.attributes || []).map(a => ({
            attribute_name: a.attribute_name, attribute_value: a.attribute_value,
          })),
        })))
        setTags((data.tags || []).map(t => t.name))
      }).catch(() => toast.error('Failed to load product details'))
        .finally(() => setLoading(false))
    }
  }, [product?.slug])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) fd.append(k, v)
      })
      // New images
      images.filter(i => i._new).forEach(i => fd.append('uploaded_images', i.file))
      // Specs as JSON
      if (specs.length) fd.append('specs', JSON.stringify(specs))
      // Variants as JSON
      if (variants.length) fd.append('variants', JSON.stringify(variants))
      // Tags
      if (tags.length) tags.forEach(t => fd.append('tag_names', t))

      if (product) {
        await adminUpdateProduct(product.slug, fd)
        toast.success('Product updated!')
      } else {
        await adminCreateProduct(fd)
        toast.success('Product created!')
      }
      onSaved()
      onClose()
    } catch (err) {
      const detail = err.response?.data
      const msg = typeof detail === 'string' ? detail
        : detail?.detail || JSON.stringify(detail) || 'Failed to save product'
      toast.error(msg)
    } finally { setSaving(false) }
  }

  const handleDeleteExistingImage = async (imgId, idx) => {
    try {
      await adminDeleteImage(imgId)
      setImages(prev => prev.filter((_, i) => i !== idx))
      toast.success('Image deleted')
    } catch { toast.error('Failed to delete image') }
  }

  // Spec helpers
  const addSpec = () => setSpecs(s => [...s, { label: '', value: '', order: s.length }])
  const updateSpec = (i, k, v) => setSpecs(s => s.map((sp, j) => j === i ? { ...sp, [k]: v } : sp))
  const removeSpec = (i) => setSpecs(s => s.filter((_, j) => j !== i))

  // Variant helpers
  const addVariant = () => setVariants(v => [...v, {
    name: '', sku: '', price_override: '', stock_qty: 0, is_active: true,
    attributes: [{ attribute_name: '', attribute_value: '' }],
  }])
  const updateVariant = (i, k, v) => setVariants(vs => vs.map((vr, j) => j === i ? { ...vr, [k]: v } : vr))
  const removeVariant = (i) => setVariants(v => v.filter((_, j) => j !== i))
  const addVarAttr = (vi) => setVariants(vs => vs.map((v, i) =>
    i === vi ? { ...v, attributes: [...v.attributes, { attribute_name: '', attribute_value: '' }] } : v))
  const updateVarAttr = (vi, ai, k, val) => setVariants(vs => vs.map((v, i) =>
    i === vi ? { ...v, attributes: v.attributes.map((a, j) => j === ai ? { ...a, [k]: val } : a) } : v))
  const removeVarAttr = (vi, ai) => setVariants(vs => vs.map((v, i) =>
    i === vi ? { ...v, attributes: v.attributes.filter((_, j) => j !== ai) } : v))

  // Tag helpers
  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) { setTags(prev => [...prev, t]); setTagInput('') }
  }

  const catOptions = categories.map(c => ({ value: c.id, label: c.name }))
  const brandOptions = brands.map(b => ({ value: b.id, label: b.name }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(15,23,42,0.70)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="relative w-full flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'var(--card)', maxWidth: '780px', maxHeight: 'calc(100vh - 48px)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {product ? `Editing: ${product.name}` : 'Fill in all tabs below'}
            </p>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100">
            <X size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex gap-0 border-b overflow-x-auto hide-scrollbar"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} type="button" onClick={() => setTab(key)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2"
              style={{
                borderColor: tab === key ? 'var(--orange)' : 'transparent',
                color: tab === key ? 'var(--orange)' : 'var(--text-muted)',
                background: tab === key ? 'rgba(255,107,43,0.04)' : 'transparent',
              }}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-10 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading product…</p>
            </div>
          ) : (
            <form id="product-form" onSubmit={handleSubmit}>
              <div className="p-5 space-y-5">

                {/* ── TAB: General ── */}
                {tab === 'general' && (<>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel required>Product Name</FieldLabel>
                      <input required value={form.name} onChange={e => set('name', e.target.value)}
                        placeholder="e.g. MacBook Pro M4" className="input w-full text-sm" />
                    </div>
                    <div>
                      <FieldLabel required>SKU</FieldLabel>
                      <input required value={form.sku} onChange={e => set('sku', e.target.value)}
                        placeholder="e.g. MBP-M4-16-512" className="input w-full text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField label="Category" value={form.category} onChange={v => set('category', v)}
                      options={catOptions} placeholder="Select category" />
                    <SelectField label="Brand" value={form.brand} onChange={v => set('brand', v)}
                      options={brandOptions} placeholder="Select brand" />
                  </div>
                  <div>
                    <FieldLabel>Short Description</FieldLabel>
                    <textarea rows={2} value={form.short_description}
                      onChange={e => set('short_description', e.target.value)}
                      placeholder="Brief summary shown on product cards…" className="input w-full text-sm resize-none" />
                  </div>
                  <div>
                    <FieldLabel>Full Description</FieldLabel>
                    <textarea rows={5} value={form.description}
                      onChange={e => set('description', e.target.value)}
                      placeholder="Detailed product description…" className="input w-full text-sm resize-none" />
                  </div>
                </>)}

                {/* ── TAB: Pricing ── */}
                {tab === 'pricing' && (<>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <FieldLabel required>Price (KSh)</FieldLabel>
                      <input required type="number" min="0" step="0.01" value={form.price}
                        onChange={e => set('price', e.target.value)} placeholder="0" className="input w-full text-sm" />
                    </div>
                    <div>
                      <FieldLabel>Sale Price</FieldLabel>
                      <input type="number" min="0" step="0.01" value={form.sale_price}
                        onChange={e => set('sale_price', e.target.value)} placeholder="—" className="input w-full text-sm" />
                    </div>
                    <div>
                      <FieldLabel required>Stock Qty</FieldLabel>
                      <input required type="number" min="0" value={form.stock_qty}
                        onChange={e => set('stock_qty', e.target.value)} placeholder="0" className="input w-full text-sm" />
                    </div>
                    <div>
                      <FieldLabel>Low Stock Alert</FieldLabel>
                      <input type="number" min="0" value={form.low_stock_threshold}
                        onChange={e => set('low_stock_threshold', e.target.value)} placeholder="5" className="input w-full text-sm" />
                    </div>
                  </div>
                  {form.price && (
                    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs"
                      style={{ background: 'rgba(255,107,43,0.06)', border: '1px solid rgba(255,107,43,0.15)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Price preview:</span>
                      {form.sale_price ? (<>
                        <span className="font-bold" style={{ color: 'var(--danger)' }}>{fmt(form.sale_price)}</span>
                        <span className="line-through" style={{ color: 'var(--text-muted)' }}>{fmt(form.price)}</span>
                        <span className="font-bold px-1.5 py-0.5 rounded-full text-white text-[10px]"
                          style={{ background: 'var(--danger)' }}>
                          -{Math.round((1 - form.sale_price / form.price) * 100)}%
                        </span>
                      </>) : (
                        <span className="font-bold" style={{ color: 'var(--text)' }}>{fmt(form.price)}</span>
                      )}
                    </div>
                  )}
                  <div className="rounded-xl p-4 flex flex-col sm:flex-row gap-4"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <Toggle checked={form.is_active} onChange={v => set('is_active', v)} label="Active — visible in store" />
                    <Toggle checked={form.is_featured} onChange={v => set('is_featured', v)} label="Featured product" />
                  </div>
                </>)}

                {/* ── TAB: Variants ── */}
                {tab === 'variants' && (<>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Product Variants ({variants.length})
                    </p>
                    <button type="button" onClick={addVariant} className="btn-outline text-xs py-1.5 px-3">+ Add Variant</button>
                  </div>
                  {variants.length === 0 ? (
                    <div className="text-center py-10 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                      <Layers size={32} style={{ color: 'var(--border)', margin: '0 auto 8px' }} />
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No variants yet</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>
                        Add variants for options like RAM, storage, color
                      </p>
                    </div>
                  ) : variants.map((v, vi) => (
                    <div key={vi} className="rounded-xl p-4 mb-3 space-y-3"
                      style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>Variant #{vi + 1}</p>
                        <button type="button" onClick={() => removeVariant(vi)}
                          className="text-[10px] font-bold px-2 py-1 rounded hover:bg-red-50"
                          style={{ color: 'var(--danger)' }}>Remove</button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="col-span-2">
                          <FieldLabel>Variant Name</FieldLabel>
                          <input value={v.name} onChange={e => updateVariant(vi, 'name', e.target.value)}
                            placeholder="e.g. 16GB / 512GB SSD / Space Gray" className="input w-full text-sm" />
                        </div>
                        <div>
                          <FieldLabel>SKU</FieldLabel>
                          <input value={v.sku} onChange={e => updateVariant(vi, 'sku', e.target.value)}
                            placeholder="VAR-SKU" className="input w-full text-sm" />
                        </div>
                        <div>
                          <FieldLabel>Price Override</FieldLabel>
                          <input type="number" min="0" step="0.01" value={v.price_override}
                            onChange={e => updateVariant(vi, 'price_override', e.target.value)}
                            placeholder="Same as parent" className="input w-full text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FieldLabel>Stock Qty</FieldLabel>
                          <input type="number" min="0" value={v.stock_qty}
                            onChange={e => updateVariant(vi, 'stock_qty', parseInt(e.target.value) || 0)}
                            className="input w-full text-sm" />
                        </div>
                        <div className="flex items-end pb-1">
                          <Toggle checked={v.is_active} onChange={val => updateVariant(vi, 'is_active', val)} label="Active" />
                        </div>
                      </div>
                      {/* Attributes */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Attributes</p>
                          <button type="button" onClick={() => addVarAttr(vi)}
                            className="text-[10px] font-bold px-1.5" style={{ color: 'var(--orange)' }}>+ Add</button>
                        </div>
                        {v.attributes.map((a, ai) => (
                          <div key={ai} className="flex gap-2 mb-1.5">
                            <input value={a.attribute_name} onChange={e => updateVarAttr(vi, ai, 'attribute_name', e.target.value)}
                              placeholder="e.g. RAM" className="input flex-1 text-xs py-1.5" />
                            <input value={a.attribute_value} onChange={e => updateVarAttr(vi, ai, 'attribute_value', e.target.value)}
                              placeholder="e.g. 16GB" className="input flex-1 text-xs py-1.5" />
                            <button type="button" onClick={() => removeVarAttr(vi, ai)}
                              className="w-7 h-7 rounded flex items-center justify-center hover:bg-red-50 flex-shrink-0">
                              <X size={12} style={{ color: 'var(--danger)' }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>)}

                {/* ── TAB: Images ── */}
                {tab === 'images' && (
                  <div className="rounded-xl p-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <ImageUploader images={images} onChange={setImages} onDeleteExisting={handleDeleteExistingImage} />
                  </div>
                )}

                {/* ── TAB: Specs ── */}
                {tab === 'specs' && (<>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Specifications ({specs.length})
                    </p>
                    <button type="button" onClick={addSpec} className="btn-outline text-xs py-1.5 px-3">+ Add Spec</button>
                  </div>
                  {specs.length === 0 ? (
                    <div className="text-center py-10 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                      <Settings size={32} style={{ color: 'var(--border)', margin: '0 auto 8px' }} />
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No specs yet</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>Add specs like Processor, RAM, Display</p>
                    </div>
                  ) : specs.map((s, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input value={s.label} onChange={e => updateSpec(i, 'label', e.target.value)}
                        placeholder="e.g. Processor" className="input flex-1 text-sm" />
                      <input value={s.value} onChange={e => updateSpec(i, 'value', e.target.value)}
                        placeholder="e.g. Apple M4 Pro" className="input flex-1 text-sm" />
                      <button type="button" onClick={() => removeSpec(i)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-red-50 flex-shrink-0">
                        <X size={14} style={{ color: 'var(--danger)' }} />
                      </button>
                    </div>
                  ))}
                  {specs.length > 0 && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      Common specs: Processor, RAM, Storage, Display, Graphics, OS, Battery, Weight, Ports
                    </p>
                  )}
                </>)}

                {/* ── TAB: SEO ── */}
                {tab === 'seo' && (<>
                  <div>
                    <FieldLabel>Meta Title</FieldLabel>
                    <input value={form.meta_title} onChange={e => set('meta_title', e.target.value)}
                      placeholder="SEO title (auto-generated if empty)" className="input w-full text-sm" maxLength={70} />
                    <p className="text-[10px] mt-0.5 text-right" style={{ color: form.meta_title.length > 60 ? 'var(--danger)' : 'var(--text-light)' }}>
                      {form.meta_title.length}/70
                    </p>
                  </div>
                  <div>
                    <FieldLabel>Meta Description</FieldLabel>
                    <textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)}
                      placeholder="SEO description (auto-generated if empty)" className="input w-full text-sm resize-none" rows={3} maxLength={160} />
                    <p className="text-[10px] mt-0.5 text-right" style={{ color: form.meta_description.length > 150 ? 'var(--danger)' : 'var(--text-light)' }}>
                      {form.meta_description.length}/160
                    </p>
                  </div>
                  <div>
                    <FieldLabel>Canonical URL</FieldLabel>
                    <input value={form.canonical_url} onChange={e => set('canonical_url', e.target.value)}
                      placeholder="https://..." className="input w-full text-sm" />
                  </div>
                  {/* Tags */}
                  <div>
                    <FieldLabel>Tags</FieldLabel>
                    <div className="flex gap-2 mb-2">
                      <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                        placeholder="Type a tag and press Enter" className="input flex-1 text-sm" />
                      <button type="button" onClick={addTag} className="btn-outline text-xs py-1.5 px-3">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((t, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: 'rgba(255,107,43,0.08)', color: 'var(--orange)' }}>
                          {t}
                          <button type="button" onClick={() => setTags(tags.filter((_, j) => j !== i))}
                            className="hover:text-red-500"><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Preview */}
                  <div className="rounded-xl p-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                      Search Preview
                    </p>
                    <p className="text-sm font-semibold" style={{ color: '#1a0dab' }}>
                      {form.meta_title || form.name || 'Product Title'} | Nixxon Technologies
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--success)' }}>
                      nixxontechnologies.co.ke/products/{form.name?.toLowerCase().replace(/\s+/g, '-') || 'slug'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {form.meta_description || form.short_description || 'Product description will appear here...'}
                    </p>
                  </div>
                </>)}

              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-t"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
          <div className="hidden sm:flex items-center gap-2">
            {TABS.map(({ key, label }) => (
              <span key={key} className="w-2 h-2 rounded-full" style={{
                background: tab === key ? 'var(--orange)' : 'var(--border)',
              }} />
            ))}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button type="button" onClick={onClose} className="btn-outline px-5 py-2.5">Cancel</button>
            <button type="submit" form="product-form" disabled={saving}
              className="btn-primary px-6 py-2.5 disabled:opacity-60 min-w-[130px] justify-center">
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60 20" />
                  </svg>
                  Saving…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check size={15} />
                  {product ? 'Update Product' : 'Create Product'}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}