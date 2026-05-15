import { useState, useEffect, useRef } from 'react'
import {
  Plus, Search, Edit2, Trash2, Package, ChevronDown,
  Download, Upload, CheckSquare, Square, MoreHorizontal,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  adminGetProducts, adminDeleteProduct,
  adminBulkAction, adminExportCSV, adminImportCSV,
  adminGetCategories, adminGetBrands,
} from '../../api/services'
import { getCldThumb } from '../../utils/cloudinaryUtils'
import { fmt, StockBadge } from './products/ProductShared'
import ProductModal from './products/ProductModal'

export default function AdminProducts() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [catFilter, setCatFilter]   = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [modal, setModal]           = useState(null)
  const [page, setPage]             = useState(1)
  const [count, setCount]           = useState(0)
  const [selected, setSelected]     = useState(new Set())
  const [bulkOpen, setBulkOpen]     = useState(false)
  const csvRef = useRef()

  const load = () => {
    setLoading(true)
    const params = { page, page_size: 20 }
    if (search)       params.search    = search
    if (catFilter)    params.category  = catFilter
    if (brandFilter)  params.brand     = brandFilter
    if (statusFilter === 'active')     params.is_active = true
    if (statusFilter === 'inactive')   params.is_active = false
    if (statusFilter === 'featured')   params.is_featured = true
    if (statusFilter === 'low')        params.low_stock = true
    adminGetProducts(params)
      .then(({ data }) => {
        setProducts(data.results || data)
        setCount(data.count || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, statusFilter, catFilter, brandFilter])

  useEffect(() => {
    // Flatten nested category tree for dropdown
    const flatten = (cats, depth = 0) => {
      let flat = []
      for (const c of cats) {
        flat.push({ ...c, _depth: depth })
        if (c.children?.length) flat = flat.concat(flatten(c.children, depth + 1))
      }
      return flat
    }
    adminGetCategories()
      .then(({ data }) => setCategories(flatten(data.results || data)))
      .catch(() => {})
    adminGetBrands()
      .then(({ data }) => setBrands(data.results || data))
      .catch(() => {})
  }, [])

  const handleDelete = async (slug, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await adminDeleteProduct(slug)
      toast.success('Product deleted')
      load()
    } catch { toast.error('Could not delete — may have associated orders') }
  }

  const handleSearch = (e) => { e.preventDefault(); setPage(1); load() }

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const toggleAll = () => {
    if (selected.size === products.length) setSelected(new Set())
    else setSelected(new Set(products.map(p => p.id)))
  }

  const handleBulk = async (action) => {
    if (selected.size === 0) return toast.error('No products selected')
    const labels = { publish: 'publish', unpublish: 'unpublish', delete: 'delete', feature: 'feature', unfeature: 'unfeature' }
    if (action === 'delete' && !confirm(`Delete ${selected.size} products? This cannot be undone.`)) return
    try {
      const { data } = await adminBulkAction({ action, ids: [...selected] })
      toast.success(data.detail)
      setSelected(new Set())
      setBulkOpen(false)
      load()
    } catch { toast.error('Bulk action failed') }
  }

  const handleExport = async () => {
    try {
      const { data } = await adminExportCSV()
      const url = window.URL.createObjectURL(new Blob([data]))
      const a = document.createElement('a')
      a.href = url; a.download = 'products.csv'; a.click()
      window.URL.revokeObjectURL(url)
      toast.success('CSV exported!')
    } catch { toast.error('Export failed') }
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const { data } = await adminImportCSV(file)
      toast.success(`Imported: ${data.created} created, ${data.updated} updated`)
      if (data.errors?.length) toast.error(`${data.errors.length} rows had errors`)
      load()
    } catch { toast.error('Import failed') }
    e.target.value = ''
  }

  const PAGES = Math.ceil(count / 20)

  return (
    <div className="space-y-5 fade-up">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Products</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {count.toLocaleString()} total products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn-outline text-xs py-2 px-3" title="Export CSV">
            <Download size={14} /> Export
          </button>
          <button onClick={() => csvRef.current?.click()} className="btn-outline text-xs py-2 px-3" title="Import CSV">
            <Upload size={14} /> Import
          </button>
          <input ref={csvRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
          <button onClick={() => setModal(undefined)} className="btn-primary text-sm">
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl p-4 flex flex-wrap items-center gap-3"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <form onSubmit={handleSearch} className="flex-1 min-w-0 relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products, SKUs…" className="input pl-9 w-full text-sm" />
        </form>

        <div className="flex gap-2 flex-wrap">
          {[
            { v: '', label: 'All' }, { v: 'active', label: 'Active' },
            { v: 'inactive', label: 'Inactive' }, { v: 'featured', label: '★ Featured' },
            { v: 'low', label: '⚠ Low Stock' },
          ].map(({ v, label }) => (
            <button key={v} onClick={() => { setStatusFilter(v); setPage(1) }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: statusFilter === v ? 'var(--navy)' : 'var(--bg)',
                color: statusFilter === v ? 'white' : 'var(--text-muted)',
                border: `1px solid ${statusFilter === v ? 'var(--navy)' : 'var(--border)'}`,
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Category / Brand dropdowns */}
        <div className="flex gap-2">
          <div className="relative">
            <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1) }}
              className="input text-xs py-1.5 pl-2 pr-6 appearance-none"
              style={{ minWidth: 100 }}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{'—'.repeat(c._depth || 0)} {c.name}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="relative">
            <select value={brandFilter} onChange={e => { setBrandFilter(e.target.value); setPage(1) }}
              className="input text-xs py-1.5 pl-2 pr-6 appearance-none"
              style={{ minWidth: 100 }}>
              <option value="">All Brands</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{ background: 'var(--navy)', color: 'white' }}>
          <span className="text-xs font-bold">{selected.size} selected</span>
          <div className="flex gap-1.5 ml-auto">
            {[
              { action: 'publish', label: 'Publish' },
              { action: 'unpublish', label: 'Unpublish' },
              { action: 'feature', label: 'Feature' },
              { action: 'unfeature', label: 'Unfeature' },
              { action: 'delete', label: 'Delete' },
            ].map(({ action, label }) => (
              <button key={action} onClick={() => handleBulk(action)}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors"
                style={{
                  background: action === 'delete' ? 'rgba(220,38,38,0.2)' : 'rgba(255,255,255,0.1)',
                  color: action === 'delete' ? '#fca5a5' : 'rgba(255,255,255,0.9)',
                }}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={() => setSelected(new Set())} className="text-xs opacity-60 hover:opacity-100 ml-2">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden" style={{ transform: 'none' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                <th className="px-3 py-3 w-10">
                  <button onClick={toggleAll} className="flex items-center justify-center">
                    {selected.size === products.length && products.length > 0
                      ? <CheckSquare size={15} style={{ color: 'var(--orange)' }} />
                      : <Square size={15} style={{ color: 'var(--text-muted)' }} />}
                  </button>
                </th>
                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Variants', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-3 py-3.5"><div className="skeleton w-4 h-4 rounded" /></td>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="skeleton h-4 rounded" style={{ width: j === 0 ? '160px' : '70px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    <Package size={36} style={{ color: 'var(--border)', margin: '0 auto 12px' }} />
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No products found</p>
                    <button onClick={() => setModal(undefined)} className="btn-primary text-sm mt-4">
                      <Plus size={14} /> Add First Product
                    </button>
                  </td>
                </tr>
              ) : products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td className="px-3 py-3.5">
                    <button onClick={() => toggleSelect(p.id)} className="flex items-center justify-center">
                      {selected.has(p.id)
                        ? <CheckSquare size={15} style={{ color: 'var(--orange)' }} />
                        : <Square size={15} style={{ color: 'var(--text-muted)' }} />}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                        {p.primary_image
                          ? <img src={getCldThumb(p.primary_image)} alt="" className="w-full h-full object-contain p-0.5" />
                          : <div className="w-full h-full flex items-center justify-center text-xl opacity-20">📦</div>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate max-w-[180px]" style={{ color: 'var(--text)' }}>{p.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.brand_name || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{p.sku}</td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>{p.category_name || '—'}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{fmt(p.current_price)}</p>
                    {p.sale_price && (
                      <p className="text-[10px] line-through" style={{ color: 'var(--text-muted)' }}>{fmt(p.price)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5"><StockBadge qty={p.stock_qty} /></td>
                  <td className="px-4 py-3.5">
                    {p.variant_count > 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB' }}>
                        {p.variant_count} variants
                      </span>
                    ) : (
                      <span className="text-[10px]" style={{ color: 'var(--text-light)' }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: p.is_active ? 'rgba(22,163,74,0.08)' : 'rgba(107,114,128,0.08)',
                          color: p.is_active ? 'var(--success)' : 'var(--text-muted)',
                        }}>
                        {p.is_active ? 'Active' : 'Draft'}
                      </span>
                      {p.is_featured && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,107,43,0.08)', color: 'var(--orange)' }}>★</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModal(p)} title="Edit"
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors">
                        <Edit2 size={13} style={{ color: '#2563EB' }} />
                      </button>
                      <button onClick={() => handleDelete(p.slug, p.name)} title="Delete"
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

        {/* Pagination */}
        {PAGES > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Page {page} of {PAGES} · {count} products
            </p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="btn-outline text-xs py-1.5 px-3 disabled:opacity-40">← Prev</button>
              <button disabled={page === PAGES} onClick={() => setPage(p => p + 1)}
                className="btn-outline text-xs py-1.5 px-3 disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal !== null && (
        <ProductModal
          product={modal}
          categories={categories}
          brands={brands}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}
    </div>
  )
}